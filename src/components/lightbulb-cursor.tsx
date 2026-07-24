import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Variant = "default" | "button" | "card" | "link" | "input" | "cta" | "image";

export function LightbulbCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 1200, damping: 60, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 1200, damping: 60, mass: 0.25 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const attr = el.closest<HTMLElement>("[data-cursor]")?.dataset.cursor as Variant | undefined;
      if (attr) return setVariant(attr);
      const tag = el.tagName;
      if (el.closest("button,[role='button']")) setVariant("button");
      else if (el.closest("a")) setVariant("link");
      else if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") setVariant("input");
      else if (tag === "IMG") setVariant("image");
      else if (el.closest("[data-card]")) setVariant("card");
      else setVariant("default");
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  const scale = variant === "button" || variant === "cta" ? 1.35 : variant === "card" ? 1.15 : 1;
  const glow =
    variant === "cta"
      ? "0 0 30px 8px color-mix(in oklab, var(--color-copper) 60%, transparent)"
      : variant === "button"
        ? "0 0 22px 6px color-mix(in oklab, var(--color-copper) 45%, transparent)"
        : "0 0 14px 3px color-mix(in oklab, var(--color-copper) 30%, transparent)";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{ scale, y: [0, -2, 0] }}
        transition={{
          scale: { duration: 0.2 },
          y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ filter: `drop-shadow(${glow})` }}
      >
        <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
          {/* bulb glow halo */}
          <circle
            cx="13"
            cy="12"
            r="11"
            fill="url(#bulbGlow)"
            opacity={variant === "cta" ? 0.9 : 0.6}
          />
          {/* bulb body */}
          <path
            d="M13 2c-4.4 0-8 3.4-8 7.6 0 2.5 1.1 4.7 2.9 6.2.7.6 1.1 1.5 1.1 2.4V19h8v-.8c0-.9.4-1.8 1.1-2.4 1.8-1.5 2.9-3.7 2.9-6.2C21 5.4 17.4 2 13 2z"
            fill="var(--color-copper-light)"
            stroke="var(--color-copper-dark)"
            strokeWidth="1"
          />
          {/* filament */}
          <path
            d="M10 10 L13 7 L16 10"
            stroke="var(--color-copper-dark)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          {/* base */}
          <rect x="8" y="19" width="10" height="2" rx="0.5" fill="var(--color-espresso)" />
          <rect x="9" y="21" width="8" height="2" rx="0.5" fill="var(--color-taupe)" />
          <rect x="10" y="23" width="6" height="2" rx="0.5" fill="var(--color-espresso)" />
          {/* screw tip */}
          <path d="M11 25 L13 28 L15 25" fill="var(--color-espresso)" />
          <defs>
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-copper)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--color-copper)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Fire particles for CTA */}
      {variant === "cta" && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-copper"
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: -30 - i * 10, x: (i - 1) * 6 }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}
      {/* Sparks for buttons */}
      {variant === "button" && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-copper-light"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos((i / 4) * Math.PI * 2) * 22,
                y: Math.sin((i / 4) * Math.PI * 2) * 22,
              }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
