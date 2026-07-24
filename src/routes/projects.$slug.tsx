import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { fetchProjectBySlug, projects, useProject } from "@/content/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = await fetchProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project not found — TB_Solutions" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.project;
    return {
      meta: [
        { title: `${p.seo?.title || p.title} — TB_Solutions` },
        { name: "description", content: p.seo?.description || p.description },
        { property: "og:title", content: `${p.title} — TB_Solutions` },
        { property: "og:description", content: p.description },
        { property: "og:image", content: p.image },
        { name: "twitter:image", content: p.image },
      ],
    };
  },
  component: ProjectPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="font-display text-5xl font-bold text-foreground">Project not found</h1>
        <Link to="/" className="mt-6 inline-block text-copper-dark hover:underline">
          Back to home
        </Link>
      </div>
      <Footer />
    </div>
  ),
});

function ProjectPage() {
  const { project: loaderProject } = Route.useLoaderData() as {
    project: (typeof projects)[number];
  };
  const project = useProject(loaderProject.slug) ?? loaderProject;

  const hasGallery = (project.images?.length ?? 0) > 0;
  const gallery = hasGallery ? project.images : [project.image];
  const links = [
    project.urls?.github ? { label: "GitHub", href: project.urls.github, icon: Github } : null,
    project.urls?.website
      ? { label: "Live site", href: project.urls.website, icon: ExternalLink }
      : project.urls?.demo
        ? { label: "Demo", href: project.urls.demo, icon: ExternalLink }
        : null,
    ...(project.urls?.extraLinks ?? []).map((l) => ({
      label: l.label,
      href: l.url,
      icon: ExternalLink,
    })),
  ].filter(Boolean) as { label: string; href: string; icon: typeof ExternalLink }[];

  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="relative overflow-hidden pt-36 pb-16">
        <div className="absolute inset-0 -z-10">
          <img src={project.image} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            hash="projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-copper-dark hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-copper-dark">
            {project.tag}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 font-display text-5xl font-bold text-foreground sm:text-6xl lg:text-7xl"
          >
            {project.title}
          </motion.h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.fullDescription || project.description}
          </p>

          {links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-warm-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <l.icon className="h-4 w-4" /> {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {hasGallery && (
            <div className={`grid gap-4 ${gallery.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {gallery.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  loading="lazy"
                  className="aspect-video w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Client
              </h3>
              <p className="mt-2 text-foreground">{project.client || "—"}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed
              </h3>
              <p className="mt-2 text-foreground">
                {project.completionDate
                  ? new Date(project.completionDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tech stack
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {(project.techStack ?? []).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-copper-dark"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-3xl bg-primary p-10 text-center text-primary-foreground">
            <h3 className="font-display text-3xl font-bold">Ready to start?</h3>
            <p className="mt-2 opacity-90">
              Tell us about your {project.tag.toLowerCase()} project.
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

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="font-display text-2xl font-bold text-foreground">More projects</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    data-card
                    className="group rounded-2xl glass p-5 transition-shadow hover:shadow-lg"
                  >
                    <div className="font-display text-lg font-bold text-foreground">{p.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{p.description}</div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-copper-dark">
                      Explore{" "}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
