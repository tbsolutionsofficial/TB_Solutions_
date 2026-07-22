import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { getDomain, domains, useDomain } from "@/content/domains";

export const Route = createFileRoute("/domains/$slug")({
  loader: ({ params }) => {
    const domain = getDomain(params.slug);
    if (!domain) throw notFound();
    return { domain };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Domain not found — TB_Solutions" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const d = loaderData.domain;
    return {
      meta: [
        { title: `${d.title} — TB_Solutions` },
        { name: "description", content: d.short },
        { property: "og:title", content: `${d.title} — TB_Solutions` },
        { property: "og:description", content: d.short },
        { property: "og:image", content: d.banner },
        { name: "twitter:image", content: d.banner },
      ],
    };
  },
  component: DomainPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="font-display text-5xl font-bold text-foreground">Domain not found</h1>
        <Link to="/" className="mt-6 inline-block text-copper-dark hover:underline">
          Back to home
        </Link>
      </div>
      <Footer />
    </div>
  ),
});

function DomainPage() {
  const { domain: loaderDomain } = Route.useLoaderData() as { domain: (typeof domains)[number] };
  const domain = useDomain(loaderDomain.slug) ?? loaderDomain;

  const related = domains.filter((d) => d.slug !== domain.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="relative overflow-hidden pt-36 pb-16">
        <div className="absolute inset-0 -z-10">
          <img src={domain.banner} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-copper-dark hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all domains
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 font-display text-5xl font-bold text-foreground sm:text-6xl lg:text-7xl"
          >
            {domain.title}
          </motion.h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {domain.overview}
          </p>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-foreground">Services we offer</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {domain.services.map((s) => (
              <div key={s.title} data-card className="rounded-3xl glass p-6">
                <h3 className="font-display text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-3xl font-bold text-foreground">What's included</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {domain.items.map((i) => (
              <li key={i} className="flex items-start gap-2 rounded-2xl bg-secondary/50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                <span className="text-sm text-foreground">{i}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-16 font-display text-3xl font-bold text-foreground">FAQ</h2>
          <div className="mt-6 space-y-4">
            {domain.faq.map((f) => (
              <details key={f.q} className="group rounded-2xl glass p-5">
                <summary className="cursor-pointer list-none font-semibold text-foreground">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-primary p-10 text-center text-primary-foreground">
            <h3 className="font-display text-3xl font-bold">Ready to start?</h3>
            <p className="mt-2 opacity-90">
              Tell us about your {domain.title.toLowerCase()} project.
            </p>
            <Link
              to="/"
              hash="contact"
              data-cursor="cta"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-warm-white px-6 py-3 font-semibold text-copper-dark"
            >
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16">
            <h3 className="font-display text-2xl font-bold text-foreground">
              Explore other domains
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((d) => (
                <Link
                  key={d.slug}
                  to="/domains/$slug"
                  params={{ slug: d.slug }}
                  data-card
                  className="group rounded-2xl glass p-5 transition-shadow hover:shadow-lg"
                >
                  <div className="font-display text-lg font-bold text-foreground">{d.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{d.short}</div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-copper-dark">
                    Explore{" "}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
