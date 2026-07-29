#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * dev-clean — hard reset of the local dev environment.
 *
 * Why we need this:
 *   When the Next.js dev server is killed mid-edit (Ctrl-C, VS Code
 *   restart, terminal crash), it can leave:
 *     - zombie child processes (`next dev`, `next build`, MCP servers)
 *     - stale `node_modules/.cache` and `.next/cache`
 *     - port 3000/3001 stuck in TIME_WAIT
 *   The next `npm run dev` then either fails silently (port in use →
 *   falls back to 3001) or hangs on a corrupt Turbopack cache.
 *
 * This script kills all relevant processes, removes the build cache,
 * and (optionally) restarts the dev server.
 *
 * Usage:
 *   npm run dev:clean           # kill zombies + wipe .next/cache
 *   npm run dev:clean -- restart # also start `next dev` afterwards
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from 'node:path';
import { platform } from 'node:process';

const cwd = process.cwd();
const isWindows = platform === 'win32';
const shouldRestart = process.argv.includes('restart');

const TARGET_PORTS = [3000, 3001, 3002];

const STALE_DIRS = [
  '.next/cache',
  '.next/dev',
  '.next/server',
  '.next/static',
  '.next/types',
  'node_modules/.cache',
];

const PROCESS_PATTERNS = [
  'next dev',
  'next-server',
  'next-build',
  'next-devtools-mcp',
];

function logStep(label) {
  console.log(`\n\x1b[36m▸\x1b[0m ${label}`);
}

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
  } catch {
    return '';
  }
}

/**
 * Find PIDs whose working directory is inside `cwd`. Used to scope
 * process kills to the current repo (avoids killing `next dev`
 * instances belonging to other projects on the same machine).
 *
 * macOS / Linux: `lsof -a -d cwd -c node -F p` lists node PIDs and
 * the directories they were launched from; we filter to those whose
 * cwd starts with the project path.
 */
function pidsInThisProject() {
  if (isWindows) return null; // Skip scoping on Windows for now.
  const out = run(
    `lsof -a -d cwd -c node -F p 2>/dev/null | awk '/^p/ {substr($1,2)}'`,
  );
  if (!out.trim()) return null;
  const allPids = out
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s));
  // Refine: check each PID's cwd via lsof.
  const scoped = [];
  for (const pid of allPids) {
    const cwdOut = run(
      `lsof -a -d cwd -p ${pid} 2>/dev/null | awk '/^f/ {print substr($1,2)}'`,
    );
    if (cwdOut && cwdOut.startsWith(cwd)) scoped.push(pid);
  }
  return scoped;
}

function killByPattern(pattern) {
  logStep(`Killing processes matching "${pattern}"`);
  if (isWindows) {
    run(`taskkill /F /IM node.exe /FI "WINDOWTITLE eq ${pattern}*" 2>nul`);
    return;
  }
  // Scope: prefer PIDs whose cwd is inside this repo. If we can't
  // determine that (e.g. lsof not available), fall back to a global
  // pkill on the pattern.
  const scoped = pidsInThisProject();
  if (scoped && scoped.length > 0) {
    run(
      `ps -p ${scoped.join(",")} -o pid,command 2>/dev/null | grep "${pattern}" | awk '{print $1}' | xargs -r kill -9 2>/dev/null`,
    );
  } else {
    logStep(
      "  (no scoped matches found; falling back to project-local SIGINT)",
    );
    // Send SIGINT to the dev server's PID file if Next wrote one.
    const pidFile = `${cwd}/.next/dev/pid`;
    if (existsSync(pidFile)) {
      try {
        const pid = readFileSync(pidFile, "utf8").trim();
        if (/^\d+$/.test(pid)) {
          run(`kill -INT ${pid} 2>/dev/null`);
        }
      } catch {
        /* ignore */
      }
    }
  }
}

function freePort(port) {
  logStep(`Freeing port ${port}`);
  if (isWindows) {
    run(
      `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a 2>nul`,
    );
    return;
  }
  // lsof prints PIDs in column 2; awk keeps just the PID.
  const out = run(
    `/usr/sbin/lsof -nP -iTCP:${port} -sTCP:LISTEN 2>/dev/null | awk 'NR>1 {print $2}'`,
  );
  for (const pid of out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (!/^\d+$/.test(pid)) continue;
    try {
      process.kill(Number(pid), 'SIGTERM');
      console.log(`  • SIGTERM ${pid}`);
    } catch {
      /* already gone */
    }
  }
}

function wipeCaches() {
  logStep('Removing stale build caches');
  for (const rel of STALE_DIRS) {
    const abs = join(cwd, rel);
    if (existsSync(abs)) {
      rmSync(abs, { recursive: true, force: true });
      console.log(`  • removed ${rel}`);
    }
  }
}

function startDev() {
  logStep('Starting `next dev` (background)');
  const child = spawn('npx', ['next', 'dev'], {
    cwd,
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  console.log(`  • PID ${child.pid} (detached). Open http://localhost:3000`);
}

function main() {
  console.log('\x1b[1m\x1b[35mdev-clean\x1b[0m — wiping local dev state');

  for (const pattern of PROCESS_PATTERNS) {
    killByPattern(pattern);
  }
  for (const port of TARGET_PORTS) {
    freePort(port);
  }
  wipeCaches();

  if (shouldRestart) {
    startDev();
  } else {
    console.log(
      '\n\x1b[32m✓\x1b[0m Done. Run \x1b[1mnpm run dev\x1b[0m to start.',
    );
  }
}

main();
