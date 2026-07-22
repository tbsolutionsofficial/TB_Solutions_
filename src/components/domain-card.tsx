import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";


interface Props {
  slug: string;
  title: string;
  short: string;
  banner: string;
  items: string[];
  Icon: ComponentType<{ className?: string }>;
  index: number;
}

export function DomainCard({ slug, title, short, banner, items, Icon, index }: Props) {
  return (
    <motion.div
      data-card
      data-cursor="card"
      initial={{ opacity: 0, rotateY: -60, y: 40 }}
      whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="preserve-3d group relative h-72 overflow-hidden rounded-3xl glass sm:h-80"
    >
      {/* Default face */}
      <div className="absolute inset-0 flex flex-col p-6 transition-opacity duration-500 group-hover:opacity-0 sm:p-8">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-copper-dark">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
        <ul className="mt-4 space-y-2">
          {items.slice(0, 5).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-copper" />
              {item}
            </li>
          ))}
          {items.length > 5 && (
            <li className="text-sm font-medium text-copper-dark">+{items.length - 5} more</li>
          )}
        </ul>
      </div>

      {/* Hover banner */}
      <Link
        to="/domains/$slug"
        params={{ slug }}
        className="absolute inset-0 flex flex-col justify-end overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <img src={banner} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover transition-transform duration-1000 group-hover:scale-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/60 to-transparent" />
        {/* particles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-copper-light/80"
            style={{ left: `${15 + i * 18}%`, bottom: 20 }}
            animate={{ y: [-10, -70, -10], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
        <div className="relative p-6 text-warm-white sm:p-8">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-copper/90 text-white">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-display text-2xl font-bold">{title}</h3>
          <p className="mt-2 text-sm text-warm-white/85">{short}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-copper-light">
            Explore domain <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
