import type { Route } from "next";

export type SiteConfig = typeof siteConfig;

/**
 * Internal routes use Next.js `Route` so `typedRoutes` accepts them.
 * External URLs (instagram, etc.) are plain strings.
 */
type NavItem = { label: string; href: Route };

export const siteConfig = {
  name: "CLUB L.R.E",
  description: "Club Los Rosarinos Estudiantil",
  navItems: [
    { label: "Inicio", href: "/" },
    { label: "El Club", href: "/about" },
    // Fragment-only links bypass typedRoutes since they target an
    // anchor on the current page.
    { label: "Actividades", href: "/#actividades" as Route },
    { label: "Cuotas", href: "/pricing" },
  ] as ReadonlyArray<NavItem>,
  navMenuItems: [
    { label: "Inicio", href: "/" },
    { label: "El Club", href: "/about" },
    { label: "Actividades", href: "/#actividades" as Route },
    { label: "Blog", href: "/blog" },
    { label: "Cuotas", href: "/pricing" },
  ] as ReadonlyArray<NavItem>,
  links: {
    instagram: "https://www.instagram.com/clubestudiantilrosario/",
  },
} as const;
