import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/tb-solutions-logo.png";
import { COLLECTIONS, SITE_SETTINGS_DOC_ID, useFirestoreDoc, type SiteSettings } from "@/lib/firestore";

const DEFAULT_SETTINGS: SiteSettings = {
  email: "hello@tbsolutions.dev",
  phone: "+1 (555) 000-0000",
  address: "Global delivery, local presence",
};

export function Footer() {
  const { data } = useFirestoreDoc<SiteSettings>(COLLECTIONS.settings, SITE_SETTINGS_DOC_ID, {
    initialData: null,
  });
  const settings = { ...DEFAULT_SETTINGS, ...data };

  const socialLinks = [
    { href: settings.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: settings.twitter, label: "Twitter", icon: Twitter },
    { href: settings.instagram, label: "Instagram", icon: Instagram },
    { href: settings.whatsapp, label: "WhatsApp", icon: MessageCircle },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-border bg-cream/50">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={logoAsset} alt="TB_Solutions" className="h-12 w-auto object-contain" />
              <span className="font-display text-xl font-bold text-foreground">TB_Solutions</span>
            </Link>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Guiding ideas, empowering impact. Your project consultancy partner for AI, automation,
              software, robotics, IoT, and digital transformation.
            </p>
            <div className="mt-6 flex gap-3">
              {(socialLinks.length ? socialLinks : [{ href: "#", label: "LinkedIn", icon: Linkedin }, { href: "#", label: "Twitter", icon: Twitter }]).map(
                (s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href?.startsWith("http") ? "_blank" : undefined}
                    rel={s.href?.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label={s.label}
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                Quick links
              </h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "Expertise", href: "#expertise" },
                  { label: "About us", href: "#about" },
                  { label: "Our process", href: "#process" },
                  { label: "Contact", href: "#contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                Contact
              </h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                  <span>{settings.email}</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                  <span>{settings.phone}</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                  <span>{settings.address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TB_Solutions. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Guiding Ideas. Empowering Impact.</p>
        </div>
      </div>
    </footer>
  );
}
