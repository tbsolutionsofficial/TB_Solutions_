import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles, Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { testimonials as testimonialsFallback, useTestimonials } from "@/content/testimonials";
import { createDoc, COLLECTIONS } from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const fieldClass =
  "w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-copper";

function WriteReviewModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [values, setValues] = useState({ name: "", company: "", role: "", domain: "", review: "" });
  const [stars, setStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const result = await uploadToCloudinary(file, "tb-solutions/reviewers");
      setAvatarUrl(result.url);
    } catch (err) {
      console.error(err);
      toast.error("Photo upload failed.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim() || !values.review.trim()) {
      toast.error("Please fill in your name and review.");
      return;
    }
    setSubmitting(true);
    try {
      await createDoc(COLLECTIONS.reviews, {
        name: values.name,
        company: values.company || "—",
        role: values.role || "—",
        avatar: avatarUrl || `https://i.pravatar.cc/120?u=${encodeURIComponent(values.name)}`,
        stars,
        review: values.review,
        domain: values.domain || "General",
        date: new Date().toISOString(),
        status: "pending",
      });
      toast.success("Thanks! Your review will appear once approved.");
      setValues({ name: "", company: "", role: "", domain: "", review: "" });
      setStars(5);
      setAvatarUrl("");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-warm-white">
        <DialogHeader>
          <DialogTitle className="font-display">Write a review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your photo (optional)
            </span>
            <div className="flex items-center gap-4">
              {avatarUrl && (
                <img src={avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleAvatarUpload(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-warm-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {avatarUrl ? "Replace photo" : "Upload photo"}
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your name
              </span>
              <input
                required
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company
              </span>
              <input
                value={values.company}
                onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
                className={fieldClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </span>
              <input
                value={values.role}
                onChange={(e) => setValues((v) => ({ ...v, role: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Domain worked on
              </span>
              <input
                value={values.domain}
                onChange={(e) => setValues((v) => ({ ...v, domain: e.target.value }))}
                placeholder="e.g. Artificial Intelligence"
                className={fieldClass}
              />
            </label>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rating
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStars(n)}
                  aria-label={`${n} stars`}
                  className="p-0.5"
                >
                  <Star
                    className={`h-6 w-6 ${n <= stars ? "fill-copper text-copper" : "text-border"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your review
            </span>
            <textarea
              required
              rows={4}
              value={values.review}
              onChange={(e) => setValues((v) => ({ ...v, review: e.target.value }))}
              className={fieldClass}
            />
          </label>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit review
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TestimonialsSection() {
  const [paused, setPaused] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
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
          <button
            onClick={() => setWriteOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-warm-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Write a review
          </button>
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

      {approved.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No reviews yet — be the first to share your experience.
        </p>
      )}

      <WriteReviewModal open={writeOpen} onOpenChange={setWriteOpen} />
    </section>
  );
}
