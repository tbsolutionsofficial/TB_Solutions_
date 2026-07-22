// Central editable content store. A future CMS/server function can replace
// these plain exports with fetched data without touching any component.

export const siteConfig = {
  brand: {
    name: "TB_Solutions",
    tagline: "Guiding Ideas · Empowering Impact",
    logoUrl: "", // set from asset in component
  },
  contact: {
    email: "hello@tbsolutions.dev",
    phone: "+1 (555) 000-0000",
    whatsapp: "+15550000000",
    location: "Global delivery, local presence",
  },
  social: {
    linkedin: "#",
    twitter: "#",
    github: "#",
    dribbble: "#",
  },
  stats: [
    { value: 150, suffix: "+", label: "Projects" },
    { value: 11, suffix: "", label: "Domains" },
    { value: 92, suffix: "%", label: "Retention" },
  ],
  hero: {
    eyebrow: "Guiding Ideas · Empowering Impact",
    titleTop: "Every domain.",
    titleBottom: "One partner.",
    description:
      "TB_Solutions is your project consultancy partner across AI, automation, software, robotics, IoT, and digital transformation — turning complex technology into clear business outcomes.",
    primaryCta: { label: "See our work", href: "#projects" },
    secondaryCta: { label: "Start a project", href: "#contact" },
  },
  nav: [
    { label: "Domains", href: "/#domains" },
    { label: "Projects", href: "/#projects" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "About", href: "/#about" },
    { label: "Process", href: "/#process" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
