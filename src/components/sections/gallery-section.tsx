import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import {
  galleryCategories,
  galleryItems as galleryItemsFallback,
  useGallery,
  type GalleryCategory,
} from "@/content/gallery";

const spanClass = {
  sm: "row-span-1",
  md: "row-span-2",
  lg: "row-span-2 sm:row-span-3",
  xl: "row-span-2 sm:col-span-2 sm:row-span-3",
} as const;

export function GallerySection() {
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data: galleryItems = galleryItemsFallback } = useGallery();
  const filtered =
    category === "All" ? galleryItems : galleryItems.filter((g) => g.category === category);

  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  const prev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));

  return (
    <section id="gallery" className="relative px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
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
            Gallery
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            Work in the <span className="text-copper-dark">wild.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A visual tour across AI, robotics, IoT, drones and software we've shipped.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {galleryCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              data-cursor="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                c === category
                  ? "bg-primary text-primary-foreground shadow-md shadow-copper/30"
                  : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-copper-dark"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid auto-rows-[120px] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35 }}
                onClick={() => setOpenIndex(i)}
                data-card
                className={`group relative overflow-hidden rounded-2xl glass ${spanClass[item.span ?? "sm"]}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="text-xs font-semibold uppercase tracking-wider text-copper-light">
                    {item.category}
                  </div>
                  <div className="text-sm font-bold text-warm-white">{item.title}</div>
                </div>
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-copper/90 p-3 text-white">
                      <Play className="h-5 w-5" />
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {openIndex !== null && filtered[openIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-espresso/90 p-4 backdrop-blur-xl"
            onClick={() => setOpenIndex(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") next();
              if (e.key === "ArrowLeft") prev();
              if (e.key === "Escape") setOpenIndex(null);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex(null);
              }}
              className="absolute right-6 top-6 rounded-full bg-warm-white/10 p-3 text-warm-white hover:bg-warm-white/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-warm-white/10 p-3 text-warm-white hover:bg-warm-white/20"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-warm-white/10 p-3 text-warm-white hover:bg-warm-white/20"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.img
              key={openIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={filtered[openIndex].src}
              alt={filtered[openIndex].title}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
