import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { createDoc, COLLECTIONS } from "@/lib/firestore";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  company: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more"),
});
type FormValues = z.infer<typeof schema>;

type Phase = "idle" | "loading" | "ring" | "hologram" | "success";

export function ContactFormMagic() {
  const [phase, setPhase] = useState<Phase>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setPhase("loading");
    try {
      await createDoc(COLLECTIONS.contacts, {
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.message,
        createdAt: new Date().toISOString(),
        read: false,
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong sending your message. Please try again.");
      setPhase("idle");
      return;
    }
    setPhase("ring");
    await new Promise((r) => setTimeout(r, 600));
    setPhase("hologram");
    await new Promise((r) => setTimeout(r, 700));
    setPhase("success");
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#bf572c", "#e29563", "#3b2a20"],
    });
    setTimeout(() => {
      setPhase("idle");
      reset();
    }, 4200);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input
            {...register("name")}
            className="w-full rounded-2xl border border-border bg-warm-white/60 px-5 py-3.5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-copper focus:ring-2 focus:ring-copper/30"
            placeholder="Your name"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-2xl border border-border bg-warm-white/60 px-5 py-3.5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-copper focus:ring-2 focus:ring-copper/30"
            placeholder="you@company.com"
          />
        </Field>
      </div>
      <Field label="Company">
        <input
          {...register("company")}
          className="w-full rounded-2xl border border-border bg-warm-white/60 px-5 py-3.5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-copper focus:ring-2 focus:ring-copper/30"
          placeholder="Company"
        />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full rounded-2xl border border-border bg-warm-white/60 px-5 py-3.5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-copper focus:ring-2 focus:ring-copper/30"
          placeholder="Tell us about your project…"
        />
      </Field>

      <div className="relative flex justify-center pt-2">
        <motion.button
          type="submit"
          disabled={phase !== "idle"}
          data-cursor="cta"
          layout
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-copper/30 transition-all hover:shadow-xl hover:shadow-copper/50 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                Send message
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.span>
            )}
            {phase === "loading" && (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </motion.span>
            )}
            {phase === "ring" && (
              <motion.span
                key="ring"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Igniting…
              </motion.span>
            )}
            {phase === "hologram" && (
              <motion.span
                key="holo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Almost there…
              </motion.span>
            )}
            {phase === "success" && (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" /> Sent!
              </motion.span>
            )}
          </AnimatePresence>

          {/* Energy ring */}
          <AnimatePresence>
            {(phase === "ring" || phase === "hologram") && (
              <motion.span
                initial={{ scale: 0.4, opacity: 0.9 }}
                animate={{ scale: 2.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="pointer-events-none absolute inset-0 -z-10 rounded-full border-2 border-copper"
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Robot hologram */}
        <AnimatePresence>
          {phase === "hologram" && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.7 }}
              animate={{ opacity: 1, y: -80, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-copper/40 blur-2xl" />
                <div className="relative h-16 w-16 rounded-full border-2 border-copper bg-warm-white/20 backdrop-blur">
                  <div className="absolute inset-2 rounded-full border border-copper-light/60" />
                  <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm font-medium text-copper-dark"
          >
            Thanks — we'll contact you shortly.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
