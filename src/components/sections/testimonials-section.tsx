import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";
import { testimonials as testimonialsFallback, useTestimonials } from "@/content/testimonials";

export function TestimonialsSection() {
  const [paused, setPaused] = useState(false);
  const { data: testimonials = testimonialsFallback } = useTestimonials();
  const approved = testimonials.filter((t) => t.status === "approved");
  const doubled = [...approved, ...approved];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden px-5 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
            <Sparkles className="h-4 w-4" />
            Testimonials
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            Loved by <span className="text-copper-dark">operators.</span>
          </h2>
        </motion.div>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <motion.div
          className="flex gap-6"
          animate={{ x: paused ? undefined : ["0%", "-50%"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {doubled.map((t, i) => (
            <motion.article
              key={`${t.id}-${i}`}
              data-card
              whileHover={{ y: -4 }}
              className="w-[340px] shrink-0 rounded-3xl glass p-6 sm:w-[400px]"
            >
              <Quote className="h-6 w-6 text-copper/50" />
              <p className="mt-3 text-base leading-relaxed text-foreground">"{t.review}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.role} · {t.company}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, k) => (
                    <Star key={k} className="h-3.5 w-3.5 fill-copper text-copper" />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-copper-dark">
                  {t.domain}
                </span>
                <span>{new Date(t.date).toLocaleDateString()}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
