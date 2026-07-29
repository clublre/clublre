/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile-time route type safety for next/link. Generates `Route` type
  // in next/types and makes <Link href="..."> only accept existing routes.
  typedRoutes: true,
  // React 19 + Next 16: opt into the React Compiler for automatic
  // memoization (drops useMemo / useCallback in most cases).
  // Falls back to the Babel transform if the runtime build is missing.
  // Requires `babel-plugin-react-compiler` as a dev dependency.
  // reactCompiler: {
  //   target: "19",
  // },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    // Tree-shake HeroUI and react-icons more aggressively. Both libraries
    // ship barrel exports; this makes Next import directly from
    // individual entry points when possible.
    optimizePackageImports: [
      "@heroui/react",
      "@heroui/styles",
      "react-icons",
      "react-icons/fa",
      "framer-motion",
    ],
  },
};

module.exports = nextConfig;
