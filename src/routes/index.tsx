import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Workflow,
  Code2,
  Cpu,
  Wifi,
  CircuitBoard,
  Glasses,
  Plane,
  Building2,
  Palette,
  Globe,
  Sparkles,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CountUp } from "@/components/count-up";
import { DomainCard } from "@/components/domain-card";
import { ProcessCard } from "@/components/process-card";
import { GallerySection } from "@/components/sections/gallery-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactFormMagic } from "@/components/contact-form-magic";
import { MagneticButton } from "@/components/magnetic-button";
import { HeroRobot3D } from "@/components/hero-robot-3d";
import logoAsset from "@/assets/tb-solutions-logo.png";
import heroRobot from "@/assets/hero-robot.png";
import roboticHand from "@/assets/robotic-hand-torch.png";
import drone from "@/assets/drone.png";
import phoenix from "@/assets/phoenix.png";
import companionRobot from "@/assets/companion-robot.png";
import energyOrb from "@/assets/energy-orb.png";
import { useDomains } from "@/content/domains";
import { useProjects } from "@/content/projects";
import { processSteps } from "@/content/process";
import { siteConfig } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TB_Solutions — Every Domain. One Partner." },
      {
        name: "description",
        content:
          "Project consultancy across AI, automation, software, robotics, IoT, drones and digital transformation. Guiding ideas, empowering impact.",
      },
      { property: "og:title", content: "TB_Solutions — Every Domain. One Partner." },
      {
        property: "og:description",
        content: "AI, automation, software, robotics, IoT, drones — shipped end-to-end.",
      },
    ],
  }),
  component: Index,
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  Workflow,
  Code2,
  Cpu,
  Wifi,
  CircuitBoard,
  Glasses,
  Plane,
  Building2,
  Palette,
  Globe,
};

const whyUs = [
  "Cross-domain expertise from AI to hardware",
  "End-to-end project consultancy model",
  "Scalable teams for startups and enterprises",
  "Transparent process and measurable outcomes",
];

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const { data: domains = [] } = useDomains();
  const { data: projects = [] } = useProjects();
  // @react-three/fiber's <Canvas> needs a real browser (WebGL) — never render it during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const robotY = useTransform(heroProgress, [0, 1], [0, -120]);
  const robotScale = useTransform(heroProgress, [0, 1], [1, 0.85]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, 80]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Navigation />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center overflow-hidden px-5 pt-28 sm:px-6 lg:px-8 lg:pt-32"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-copper/10 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-copper-light/20 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-espresso) 1px, transparent 1px), linear-gradient(90deg, var(--color-espresso) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            }}
          />
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <motion.div style={{ y: heroTextY }} className="relative">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-semibold text-copper-dark"
            >
              <Sparkles className="h-4 w-4" />
              {siteConfig.hero.eyebrow}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              {siteConfig.hero.titleTop}
              <br />
              <span className="text-copper-dark">{siteConfig.hero.titleBottom}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              {siteConfig.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative mt-10 flex flex-col items-start gap-4 sm:flex-row"
            >
              <div className="pointer-events-none absolute -left-16 -top-12 -z-10 h-56 w-56 opacity-70 sm:h-64 sm:w-64">
                <img src={energyOrb} alt="" className="h-full w-full animate-orb object-contain" />
              </div>

              <MagneticButton
                href={siteConfig.hero.primaryCta.href}
                data-cursor="cta"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-copper/30 transition-shadow hover:shadow-xl hover:shadow-copper/40"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{siteConfig.hero.primaryCta.label}</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton
                href={siteConfig.hero.secondaryCta.href}
                data-cursor="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/60 px-8 py-4 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-secondary"
              >
                {siteConfig.hero.secondaryCta.label}
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid max-w-md grid-cols-3 gap-6"
            >
              {siteConfig.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-copper-dark sm:text-4xl">
                    <CountUp end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: robotY, scale: robotScale }}
            className="relative mx-auto aspect-square w-full max-w-xl lg:max-w-none"
          >
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-copper/30 via-copper-light/20 to-transparent blur-3xl" />
            {/* Chest glow */}
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper/70 blur-2xl"
              animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {mounted ? (
                <HeroRobot3D
                  fallback={
                    <img
                      src={heroRobot}
                      alt="TB_Solutions humanoid robot"
                      className="h-full w-full animate-breathe object-contain"
                    />
                  }
                />
              ) : (
                <img
                  src={heroRobot}
                  alt="TB_Solutions humanoid robot"
                  className="h-full w-full animate-breathe object-contain"
                />
              )}
            </motion.div>

            <motion.img
              src={drone}
              alt=""
              aria-hidden
              className="absolute right-0 top-6 h-24 w-24 object-contain sm:h-32 sm:w-32"
              animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute -bottom-4 left-4 h-20 w-20 sm:h-28 sm:w-28"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={energyOrb} alt="" className="h-full w-full animate-orb object-contain" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Domains */}
      <section id="domains" className="relative px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-copper/5 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
              <Sparkles className="h-4 w-4" />
              Our Domains
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
              Every Domain. <span className="text-copper-dark">One Partner.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Hover a card to reveal the full domain — click through to explore in depth.
            </p>
          </motion.div>

          <div className="perspective-1200 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d, i) => (
              <DomainCard
                key={d.slug}
                slug={d.slug}
                title={d.title}
                short={d.short}
                banner={d.banner}
                items={d.items}
                Icon={iconMap[d.icon] ?? Bot}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Torch strip */}
      <section className="relative overflow-hidden px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
              The Torch
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              We carry the flame <br />
              <span className="text-copper-dark">for your next idea.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Our torch is more than a mark — it's how we work. Precision engineering, guided by
              human judgment, applied to problems worth solving.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-copper/40 via-copper-light/30 to-transparent blur-3xl" />
            <img
              src={roboticHand}
              alt="Robotic hand holding TB torch"
              className="relative h-full w-full animate-float object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="relative px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
                <CheckCircle2 className="h-4 w-4" />
                Completed Projects
              </span>
              <h2 className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
                Delivered work. <br />
                <span className="text-copper-dark">Measurable impact.</span>
              </h2>
            </div>
            <p className="max-w-md text-lg text-muted-foreground">
              A snapshot of engagements across AI, robotics, IoT, drones and SaaS — shipped, scaled,
              and running in production.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.a
                key={project.title}
                href="#contact"
                data-card
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl glass transition-shadow duration-500 hover:shadow-2xl hover:shadow-copper/20"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-copper-dark backdrop-blur">
                    {project.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-copper-dark">
                    View case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <GallerySection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* About */}
      <section
        id="about"
        className="relative overflow-hidden bg-cream px-5 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <motion.img
          src={companionRobot}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-8 top-8 hidden h-48 w-48 object-contain lg:block xl:right-8 xl:h-64 xl:w-64"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
                Why TB_Solutions
              </span>
              <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Technology moves fast. <br />
                <span className="text-copper-dark">We keep you ahead.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground/80">
                We don't just build software — we architect outcomes. Our team blends research,
                engineering, and design thinking to deliver solutions that are robust, scalable, and
                ready for the real world.
              </p>
              <ul className="mt-8 space-y-4">
                {whyUs.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-copper" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="grid gap-6"
            >
              {siteConfig.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  data-card
                  className="glass rounded-3xl p-8 text-center transition-shadow hover:shadow-xl hover:shadow-copper/15"
                >
                  <div className="font-display text-5xl font-bold text-copper-dark sm:text-6xl">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 text-sm font-medium uppercase tracking-wider text-foreground/70">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Phoenix divider */}
      <section className="relative flex items-center justify-center overflow-hidden py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[3/2] w-full max-w-2xl"
        >
          <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-copper/30 via-copper-light/25 to-transparent blur-3xl" />
          <img
            src={phoenix}
            alt=""
            aria-hidden
            className="relative h-full w-full animate-float object-contain"
          />
        </motion.div>
      </section>

      {/* Process */}
      <section id="process" className="relative px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
              How We Work
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
              A simple, <span className="text-copper-dark">proven process.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Hover any step to reveal what's inside.
            </p>
          </motion.div>
          <div className="grid gap-6 lg:grid-cols-3">
            {processSteps.map((step, i) => (
              <ProcessCard key={step.step} item={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="relative overflow-hidden bg-cream/60 px-5 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <motion.img
          src={drone}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-6 top-10 hidden h-32 w-32 object-contain lg:block"
          animate={{ y: [0, -16, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
                Contact
              </span>
              <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Let's build something <span className="text-copper-dark">remarkable.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Tell us about your project. We'll respond within 24 hours with next steps and a
                tailored approach.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-copper-dark">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email us</div>
                  <div className="font-medium text-foreground">{siteConfig.contact.email}</div>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <img src={logoAsset} alt="" aria-hidden className="h-10 w-auto object-contain" />
                <p className="text-sm text-muted-foreground">Guiding Ideas. Empowering Impact.</p>
              </div>
              <div className="mt-6 flex gap-3 text-sm">
                <Link to="/terms" className="text-copper-dark hover:underline">
                  Terms & Conditions
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/admin" className="text-muted-foreground hover:text-copper-dark">
                  Admin
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-8 sm:p-10"
            >
              <ContactFormMagic />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
