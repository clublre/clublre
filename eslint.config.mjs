import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint 9 flat config for Club LRE.
 *
 * Layers:
 *  1. Global ignores.
 *  2. next/core-web-vitals (native flat config shipped by Next 16).
 *  3. next/typescript.
 *  4. Project-specific rules.
 *
 * Note: `eslint-config-next` v16 already exports flat configs natively,
 * so FlatCompat is no longer needed.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs",
      "public/**",
      // Per-developer agent skills (Vercel `skills` CLI). Not committed;
      // not our lint concern.
      ".agents/**",
      ".claude/**",
      ".cursor/**",
      ".windsurf/**",
      ".trae/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Console — only allow warn/error/info.
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // React hygiene.
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // TypeScript hygiene.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_.*?$",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Hooks.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default config;
