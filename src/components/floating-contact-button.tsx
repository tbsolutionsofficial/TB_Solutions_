import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Instagram, Linkedin, Twitter, Mail } from "lucide-react";
import {
  useFirestoreDoc,
  COLLECTIONS,
  SITE_SETTINGS_DOC_ID,
  type SiteSettings,
} from "@/lib/firestore";

const CYCLE_SECONDS = 3.5;

export function FloatingContactButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: settings } = useFirestoreDoc<SiteSettings>(
    COLLECTIONS.settings,
    SITE_SETTINGS_DOC_ID,
    {
      initialData: null,
    },
  );

  const links = [
    settings?.whatsapp
      ? { key: "whatsapp", href: settings.whatsapp, icon: MessageCircle, label: "WhatsApp" }
      : null,
    settings?.instagram
      ? { key: "instagram", href: settings.instagram, icon: Instagram, label: "Instagram" }
      : null,
    settings?.linkedin
      ? { key: "linkedin", href: settings.linkedin, icon: Linkedin, label: "LinkedIn" }
      : null,
    settings?.twitter
      ? { key: "twitter", href: settings.twitter, icon: Twitter, label: "Twitter" }
      : null,
    settings?.email
      ? { key: "email", href: `mailto:${settings.email}`, icon: Mail, label: "Email" }
      : null,
  ].filter(Boolean) as { key: string; href: string; icon: typeof Mail; label: string }[];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (links.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % links.length), CYCLE_SECONDS * 1000);
    return () => clearInterval(id);
  }, [links.length]);

  if (pathname.startsWith("/admin") || links.length === 0) return null;

  const current = links[index % links.length];

  return (
    <a
      href={current.href}
      target="_blank"
      rel="noreferrer"
      aria-label={current.label}
      data-cursor="button"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground shadow-lg shadow-copper/40 transition-transform hover:scale-105"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
      <AnimatePresence mode="wait">
        <motion.span
          key={current.key}
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <current.icon className="h-6 w-6" />
        </motion.span>
      </AnimatePresence>
    </a>
  );
}
