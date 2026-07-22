import { motion } from "framer-motion";
import type { ProcessStep } from "@/content/process";

export function ProcessCard({ item, index }: { item: ProcessStep; index: number }) {
  return (
    <motion.div
      data-card
      data-cursor="card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative h-72 overflow-hidden rounded-3xl glass"
    >
      {/* default */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 transition-opacity duration-500 group-hover:opacity-0">
        <span className="font-display text-6xl font-bold text-copper/30">{item.step}</span>
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      </div>
      {/* hover banner */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <img src={item.bannerImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/70 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-8 text-warm-white">
          <motion.div
            initial={false}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-3 inline-block rounded-full bg-copper/90 px-3 py-1 text-xs font-semibold text-white"
          >
            Step {item.step}
          </motion.div>
          <h3 className="font-display text-2xl font-bold">{item.bannerTitle}</h3>
          <p className="mt-2 text-sm text-warm-white/90">{item.bannerDescription}</p>
        </div>
      </div>
    </motion.div>
  );
}
