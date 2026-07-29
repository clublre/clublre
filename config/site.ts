export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CLUB L.R.E",
  description: "Club Los Rosarinos Estudiantil",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "El Club",
      href: "/about",
    },
    {
      label: "Actividades",
      href: "/#actividades",
    },
    {
      label: "Cuotas",
      href: "/pricing",
    },
  ],
  navMenuItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "El Club",
      href: "/about",
    },
    {
      label: "Actividades",
      href: "/#actividades",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Cuotas",
      href: "/pricing",
    },
  ],
  links: {
    instagram: "https://www.instagram.com/clubestudiantilrosario/",
  },
};
