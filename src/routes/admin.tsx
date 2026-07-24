import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Star,
  Tag,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Search,
  Loader2,
  Pencil,
  ImagePlus,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminAuth } from "@/lib/auth";
import {
  COLLECTIONS,
  useFirestoreCollection,
  useFirestoreMutations,
  upsertDocById,
  type MediaAsset,
} from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { adminUser as mockAdminUser, mockContacts, mockOffers, mockMedia } from "@/mock/admin";
import { projects as seedProjects, type Project } from "@/content/projects";
import { domains as seedDomains, type Domain } from "@/content/domains";
import { testimonials as seedTestimonials, type Testimonial } from "@/content/testimonials";
import {
  galleryItems as seedGallery,
  galleryCategories,
  type GalleryItem,
} from "@/content/gallery";
import type { Contact } from "@/lib/firestore";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — TB_Solutions" },
      { name: "description", content: "TB_Solutions admin panel." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab =
  | "dashboard"
  | "projects"
  | "domains"
  | "gallery"
  | "testimonials"
  | "contacts"
  | "offers"
  | "media"
  | "content";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "domains", label: "Domains", icon: Layers },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "contacts", label: "Contacts", icon: Mail },
  { id: "offers", label: "Offers", icon: Tag },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "content", label: "Content", icon: FileText },
];

const inputClass =
  "w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-copper";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const auth = useAdminAuth();

  const domainsQuery = useFirestoreCollection<Domain>(COLLECTIONS.domains, {
    initialData: seedDomains.map((d) => ({ ...d, id: d.slug })),
  });
  const galleryQuery = useFirestoreCollection<GalleryItem>(COLLECTIONS.gallery, {
    initialData: seedGallery,
  });
  const testimonialsQuery = useFirestoreCollection<Testimonial>(COLLECTIONS.reviews, {
    initialData: seedTestimonials,
  });
  const projectsQuery = useFirestoreCollection<Project>(COLLECTIONS.projects, {
    initialData: seedProjects,
  });
  const contactsQuery = useFirestoreCollection<Contact>(COLLECTIONS.contacts, {
    initialData: mockContacts.map((c) => ({ ...c, id: c.id })),
  });
  const mediaQuery = useFirestoreCollection<MediaAsset>(COLLECTIONS.media, {
    initialData: mockMedia.map((m) => ({ ...m, id: m.id })),
  });

  const domainsMut = useFirestoreMutations(COLLECTIONS.domains);
  const galleryMut = useFirestoreMutations(COLLECTIONS.gallery);
  const testimonialsMut = useFirestoreMutations(COLLECTIONS.reviews);
  const projectsMut = useFirestoreMutations(COLLECTIONS.projects);
  const contactsMut = useFirestoreMutations(COLLECTIONS.contacts);
  const mediaMut = useFirestoreMutations(COLLECTIONS.media);
  const queryClient = useQueryClient();

  const [seeding, setSeeding] = useState(false);
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const asRecord = (v: unknown) => v as Record<string, unknown>;
      await Promise.all([
        ...seedDomains.map((d) => upsertDocById(COLLECTIONS.domains, d.slug, asRecord(d))),
        ...seedGallery.map((g) => upsertDocById(COLLECTIONS.gallery, g.id, asRecord(g))),
        ...seedTestimonials.map((t) => upsertDocById(COLLECTIONS.reviews, t.id, asRecord(t))),
        ...seedProjects.map((p) => upsertDocById(COLLECTIONS.projects, p.id, asRecord(p))),
      ]);
      await queryClient.invalidateQueries({ queryKey: ["firestore"] });
      toast.success("Starter content imported into Firestore.");
    } catch (err) {
      console.error(err);
      toast.error("Import failed. Check Firestore rules allow writes for this account.");
    } finally {
      setSeeding(false);
    }
  };

  if (auth.loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream">
        <Loader2 className="h-6 w-6 animate-spin text-copper-dark" />
      </div>
    );
  }

  if (!auth.isAdmin) {
    return <AdminLoginGate signIn={auth.signIn} />;
  }

  const adminUser = {
    name: auth.user?.displayName ?? auth.user?.email?.split("@")[0] ?? mockAdminUser.name,
    email: auth.user?.email ?? mockAdminUser.email,
    role: "Owner",
    avatar: auth.user?.photoURL ?? mockAdminUser.avatar,
  };

  const domainRows = (domainsQuery.data ?? []).map((d) => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    order: d.order,
    featured: d.featured ? "yes" : "no",
  }));
  const testimonialRows = (testimonialsQuery.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    company: t.company,
    stars: t.stars,
    status: t.status,
  }));
  const contactRows = (contactsQuery.data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    domain: c.domain ?? "-",
    read: c.read ? "yes" : "no",
  }));

  const dashboardStats = {
    totalProjects: projectsQuery.data?.length ?? 0,
    pendingReviews: (testimonialsQuery.data ?? []).filter((t) => t.status === "pending").length,
    unreadContacts: (contactsQuery.data ?? []).filter((c) => !c.read).length,
    activeBanners: galleryQuery.data?.length ?? 0,
  };

  return (
    <div className="flex min-h-dvh bg-cream">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-warm-white/80 backdrop-blur lg:flex">
        <div className="p-6">
          <Link to="/" className="font-display text-xl font-bold text-foreground">
            TB_Solutions
          </Link>
          <div className="mt-1 text-xs text-muted-foreground">Admin panel</div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <img src={adminUser.avatar} alt="" className="h-9 w-9 rounded-full" />
            <div className="flex-1 text-sm">
              <div className="font-semibold text-foreground">{adminUser.name}</div>
              <div className="text-xs text-muted-foreground">{adminUser.role}</div>
            </div>
            <button
              onClick={() => auth.signOut()}
              className="text-muted-foreground hover:text-copper-dark"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-warm-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as Tab)}
              className="rounded-lg border border-border bg-warm-white px-3 py-1.5 text-sm lg:hidden"
            >
              {tabs.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <h1 className="font-display text-2xl font-bold text-foreground capitalize">{tab}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm sm:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search…" className="w-40 bg-transparent outline-none" />
            </div>
          </div>
        </header>
        <div className="p-6">
          {tab === "dashboard" && (
            <DashboardView
              stats={dashboardStats}
              projects={projectsQuery.data ?? []}
              contacts={contactsQuery.data ?? []}
              testimonials={testimonialsQuery.data ?? []}
              onSeed={handleSeed}
              seeding={seeding}
            />
          )}
          {tab === "projects" && (
            <ProjectsAdmin
              projects={projectsQuery.data ?? []}
              domains={domainsQuery.data ?? []}
              mutations={projectsMut}
            />
          )}
          {tab === "domains" && (
            <CrudTable
              title="Domains"
              columns={["title", "slug", "order", "featured"]}
              rows={domainRows}
              blankRow={{
                title: "New",
                slug: `new-${Date.now()}`,
                order: domainRows.length + 1,
                featured: "no",
              }}
              onAdd={(data) => domainsMut.create.mutate(data)}
              onUpdate={(id, patch) => domainsMut.update.mutate({ id, data: patch })}
              onDelete={(id) => domainsMut.remove.mutate(id)}
            />
          )}
          {tab === "gallery" && (
            <GalleryAdmin items={galleryQuery.data ?? []} mutations={galleryMut} />
          )}
          {tab === "testimonials" && (
            <CrudTable
              title="Testimonials"
              columns={["name", "company", "stars", "status"]}
              rows={testimonialRows}
              blankRow={{ name: "New", company: "New", stars: 5, status: "pending" }}
              onAdd={(data) => testimonialsMut.create.mutate(data)}
              onUpdate={(id, patch) => testimonialsMut.update.mutate({ id, data: patch })}
              onDelete={(id) => testimonialsMut.remove.mutate(id)}
            />
          )}
          {tab === "contacts" && (
            <CrudTable
              title="Contacts"
              columns={["name", "email", "domain", "read"]}
              rows={contactRows}
              allowAdd={false}
              blankRow={{}}
              onAdd={() => {}}
              onUpdate={(id, patch) => contactsMut.update.mutate({ id, data: patch })}
              onDelete={(id) => contactsMut.remove.mutate(id)}
            />
          )}
          {tab === "offers" && (
            <CrudTable
              title="Offers"
              seed={mockOffers.map((o) => ({
                id: o.id,
                title: o.title,
                discount: `${o.discount}%`,
                active: o.active ? "yes" : "no",
              }))}
              columns={["title", "discount", "active"]}
            />
          )}
          {tab === "media" && (
            <MediaGrid
              items={mediaQuery.data ?? []}
              onUpload={(asset) =>
                mediaMut.create.mutate(asset as unknown as Record<string, unknown>)
              }
              onDelete={(id) => mediaMut.remove.mutate(id)}
            />
          )}
          {tab === "content" && <ContentEditor />}
        </div>
      </main>
    </div>
  );
}

function AdminLoginGate({
  signIn,
}: {
  signIn: (email: string, password: string) => Promise<unknown>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    try {
      await signIn(email, password);
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-3xl bg-warm-white p-8 shadow-sm">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl font-bold text-foreground">
            TB_Solutions
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <button
            type="submit"
            disabled={signingIn}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

const PIE_COLORS = ["#bf572c", "#8b3a1f", "#d97b4f", "#e8a87c", "#5c2a12", "#c98a5e"];

function monthlySeries(projects: Project[], contacts: Contact[], monthsBack = 6) {
  const now = new Date();
  const buckets = Array.from({ length: monthsBack }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1 - i), 1);
    return { label: d.toLocaleString("en-US", { month: "short" }), year: d.getFullYear(), monthIdx: d.getMonth() };
  });
  const countIn = (dates: (string | undefined)[], year: number, monthIdx: number) =>
    dates.filter((ds) => {
      if (!ds) return false;
      const d = new Date(ds);
      return !Number.isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === monthIdx;
    }).length;

  const projectDates = projects.map((p) => p.completionDate);
  const contactDates = contacts.map((c) => c.createdAt);

  return buckets.map((b) => ({
    month: b.label,
    projects: countIn(projectDates, b.year, b.monthIdx),
    contacts: countIn(contactDates, b.year, b.monthIdx),
  }));
}

function DashboardView({
  stats,
  projects,
  contacts,
  testimonials,
  onSeed,
  seeding,
}: {
  stats: {
    totalProjects: number;
    pendingReviews: number;
    unreadContacts: number;
    activeBanners: number;
  };
  projects: Project[];
  contacts: Contact[];
  testimonials: Testimonial[];
  onSeed: () => void;
  seeding: boolean;
}) {
  const cards = [
    { label: "Total projects", value: stats.totalProjects, hint: "Live from Firestore" },
    { label: "Pending reviews", value: stats.pendingReviews, hint: "Awaiting approval" },
    { label: "Unread contacts", value: stats.unreadContacts, hint: "New this week" },
    { label: "Gallery items", value: stats.activeBanners, hint: "Live on homepage" },
  ];

  const trend = monthlySeries(projects, contacts);

  const statusCounts = ["published", "draft", "archived"].map((status) => ({
    name: status,
    value: projects.filter((p) => p.status === status).length,
  })).filter((s) => s.value > 0);

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    name: `${stars} star${stars === 1 ? "" : "s"}`,
    value: testimonials.filter((t) => t.stars === stars).length,
  })).filter((r) => r.value > 0);

  const hasNoRealData = projects.length === 0 && contacts.length === 0;

  return (
    <div className="space-y-6">
      {hasNoRealData && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/60 p-4 text-sm text-foreground">
          <span>Firestore has no content yet — the site is showing the built-in starter content as a fallback.</span>
          <button
            onClick={onSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
          >
            {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Import starter content into Firestore
          </button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-warm-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {c.label}
            </div>
            <div className="mt-2 font-display text-4xl font-bold text-foreground">{c.value}</div>
            <div className="mt-1 text-xs text-copper-dark">{c.hint}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-warm-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-foreground">Projects delivered (by completion date)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#bf572c"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl bg-warm-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-foreground">Contact inquiries (by submission date)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="contacts" fill="#bf572c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl bg-warm-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-foreground">Projects by status</h3>
          {statusCounts.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" outerRadius={80} label>
                  {statusCounts.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No projects yet</p>
          )}
        </div>
        <div className="rounded-2xl bg-warm-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-foreground">Reviews by rating</h3>
          {ratingCounts.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={ratingCounts} dataKey="value" nameKey="name" outerRadius={80} label>
                  {ratingCounts.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface Row {
  id: string;
  [k: string]: string | number | boolean | undefined;
}

function CrudTable({
  title,
  rows,
  columns,
  blankRow,
  onAdd,
  onUpdate,
  onDelete,
  allowAdd = true,
  seed,
}: {
  title: string;
  columns: string[];
  rows?: Row[];
  blankRow?: Record<string, string | number>;
  onAdd?: (data: Record<string, unknown>) => void;
  onUpdate?: (id: string, patch: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
  allowAdd?: boolean;
  seed?: Row[];
}) {
  const [localRows, setLocalRows] = useState<Row[]>(seed ?? []);
  const [q, setQ] = useState("");

  const isLocalMode = !rows;
  const data = rows ?? localRows;
  const filtered = data.filter((r) =>
    Object.values(r).some((v) => String(v).toLowerCase().includes(q.toLowerCase())),
  );

  const handleAdd = () => {
    if (isLocalMode) {
      const id = `new-${Date.now()}`;
      const blank: Row = { id };
      columns.forEach((c) => (blank[c] = "New"));
      setLocalRows([blank, ...localRows]);
    } else {
      onAdd?.(blankRow ?? {});
    }
    toast.success(`${title.slice(0, -1)} added`);
  };

  const handleDelete = (id: string) => {
    if (isLocalMode) {
      setLocalRows(localRows.filter((row) => row.id !== id));
    } else {
      onDelete?.(id);
    }
    toast.success("Deleted");
  };

  return (
    <div className="rounded-2xl bg-warm-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          className="flex-1 min-w-48 rounded-lg border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-copper"
        />
        {allowAdd && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add {title.slice(0, -1)}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c} className="py-3 pr-4 font-semibold">
                  {c}
                </th>
              ))}
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border/60 hover:bg-secondary/40">
                {columns.map((c) => (
                  <td key={c} className="py-3 pr-4">
                    <input
                      defaultValue={String(r[c] ?? "")}
                      onBlur={(e) => {
                        if (e.target.value === String(r[c] ?? "")) return;
                        if (isLocalMode) {
                          setLocalRows(
                            localRows.map((row) =>
                              row.id === r.id ? { ...row, [c]: e.target.value } : row,
                            ),
                          );
                        } else {
                          onUpdate?.(r.id, { [c]: e.target.value });
                        }
                      }}
                      className="w-full rounded border border-transparent bg-transparent px-2 py-1 hover:border-border focus:border-copper focus:outline-none"
                    />
                  </td>
                ))}
                <td className="py-3 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-muted-foreground">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Projects: popup-form based add/edit ----------

interface ExtraLinkRow {
  _key: number;
  label: string;
  url: string;
}

// Monotonic counter so every extra-link row gets a key that never changes across
// re-renders, even as rows are added/removed/reordered (index-based keys caused
// input focus to drop while typing).
let extraLinkKeySeq = 0;

interface ProjectFormValues {
  title: string;
  tag: string;
  domain: string;
  description: string;
  fullDescription: string;
  image: string;
  client: string;
  completionDate: string;
  status: "published" | "draft" | "archived";
  featured: boolean;
  sortOrder: number;
  techStack: string;
  tags: string;
  github: string;
  website: string;
  extraLinks: ExtraLinkRow[];
}

function toProjectFormValues(p?: Project): ProjectFormValues {
  return {
    title: p?.title ?? "",
    tag: p?.tag ?? "",
    domain: p?.domain ?? "",
    description: p?.description ?? "",
    fullDescription: p?.fullDescription ?? "",
    image: p?.image ?? "",
    client: p?.client ?? "",
    completionDate: p?.completionDate ?? "",
    status: p?.status ?? "draft",
    featured: p?.featured ?? false,
    sortOrder: p?.sortOrder ?? 0,
    techStack: (p?.techStack ?? []).join(", "),
    tags: (p?.tags ?? []).join(", "),
    github: p?.urls?.github ?? "",
    website: p?.urls?.website ?? p?.urls?.demo ?? "",
    extraLinks: (p?.urls?.extraLinks ?? []).map((l) => ({ _key: extraLinkKeySeq++, label: l.label, url: l.url })),
  };
}

function ProjectFormModal({
  open,
  onOpenChange,
  initial,
  domains,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Project;
  domains: Domain[];
  onSubmit: (data: Record<string, unknown>) => void;
  submitting: boolean;
}) {
  const [values, setValues] = useState<ProjectFormValues>(() => toProjectFormValues(initial));
  const [uploading, setUploading] = useState(false);
  const [domainMode, setDomainMode] = useState<"select" | "custom">("select");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const next = toProjectFormValues(initial);
      setValues(next);
      setDomainMode(next.domain && !domains.some((d) => d.slug === next.domain) ? "custom" : "select");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, open]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "tb-solutions/projects");
      setValues((v) => ({ ...v, image: result.url }));
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const addExtraLink = () =>
    setValues((v) => ({
      ...v,
      extraLinks: [...v.extraLinks, { _key: extraLinkKeySeq++, label: "", url: "" }],
    }));
  const updateExtraLink = (key: number, patch: Partial<{ label: string; url: string }>) =>
    setValues((v) => ({
      ...v,
      extraLinks: v.extraLinks.map((l) => (l._key === key ? { ...l, ...patch } : l)),
    }));
  const removeExtraLink = (key: number) =>
    setValues((v) => ({ ...v, extraLinks: v.extraLinks.filter((l) => l._key !== key) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    const techStack = values.techStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = values.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const extraLinks = values.extraLinks
      .filter((l) => l.label.trim() && l.url.trim())
      .map((l) => ({ label: l.label, url: l.url }));

    onSubmit({
      title: values.title,
      slug: initial?.slug ?? slugify(values.title),
      tag: values.tag,
      domain: values.domain,
      description: values.description,
      fullDescription: values.fullDescription || values.description,
      image: values.image,
      images: values.image ? [values.image] : [],
      techStack,
      tags,
      client: values.client,
      completionDate: values.completionDate,
      status: values.status,
      featured: values.featured,
      sortOrder: values.sortOrder,
      urls: {
        github: values.github || null,
        website: values.website || null,
        extraLinks,
      },
      seo: { title: values.title, description: values.description, keywords: tags },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-warm-white">
        <DialogHeader>
          <DialogTitle className="font-display">
            {initial ? "Edit project" : "Add project"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cover image
            </span>
            <div className="flex items-center gap-4">
              {values.image && (
                <img src={values.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImageUpload(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-warm-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {values.image ? "Replace image" : "Upload image"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input
                required
                value={values.title}
                onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Tag">
              <input
                value={values.tag}
                onChange={(e) => setValues((v) => ({ ...v, tag: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Artificial Intelligence"
              />
            </Field>
          </div>

          <Field label="Domain">
            {domainMode === "select" ? (
              <select
                value={values.domain}
                onChange={(e) => {
                  if (e.target.value === "__other__") {
                    setDomainMode("custom");
                    setValues((v) => ({ ...v, domain: "" }));
                  } else {
                    setValues((v) => ({ ...v, domain: e.target.value }));
                  }
                }}
                className={inputClass}
              >
                <option value="">Select a domain…</option>
                {domains.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.title}
                  </option>
                ))}
                <option value="__other__">Other (type a new one)</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  autoFocus
                  placeholder="New domain name"
                  value={values.domain}
                  onChange={(e) => setValues((v) => ({ ...v, domain: e.target.value }))}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    setDomainMode("select");
                    setValues((v) => ({ ...v, domain: "" }));
                  }}
                  className="shrink-0 text-xs font-semibold text-muted-foreground hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
          </Field>

          <Field label="Short description">
            <textarea
              rows={2}
              value={values.description}
              onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Full description">
            <textarea
              rows={4}
              value={values.fullDescription}
              onChange={(e) => setValues((v) => ({ ...v, fullDescription: e.target.value }))}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tech stack (comma-separated)">
              <input
                value={values.techStack}
                onChange={(e) => setValues((v) => ({ ...v, techStack: e.target.value }))}
                className={inputClass}
                placeholder="React, Node, Postgres"
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                value={values.tags}
                onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value }))}
                className={inputClass}
                placeholder="AI, RAG"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Client">
              <input
                value={values.client}
                onChange={(e) => setValues((v) => ({ ...v, client: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Completion date">
              <input
                type="date"
                value={values.completionDate}
                onChange={(e) => setValues((v) => ({ ...v, completionDate: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Status">
              <select
                value={values.status}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    status: e.target.value as ProjectFormValues["status"],
                  }))
                }
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(e) => setValues((v) => ({ ...v, featured: e.target.checked }))}
              />
              Featured
            </label>
            <div className="w-28">
              <Field label="Sort order">
                <input
                  type="number"
                  value={values.sortOrder}
                  onChange={(e) => setValues((v) => ({ ...v, sortOrder: Number(e.target.value) }))}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="GitHub repo">
              <input
                value={values.github}
                onChange={(e) => setValues((v) => ({ ...v, github: e.target.value }))}
                className={inputClass}
                placeholder="https://github.com/..."
              />
            </Field>
            <Field label="Live site / demo">
              <input
                value={values.website}
                onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
                className={inputClass}
                placeholder="https://..."
              />
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Additional links (YouTube, resources, Figma, Vercel, etc.)
              </span>
              <button
                type="button"
                onClick={addExtraLink}
                className="text-xs font-semibold text-copper-dark hover:underline"
              >
                + Add link
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {values.extraLinks.map((link) => (
                <div key={link._key} className="flex gap-2">
                  <input
                    placeholder="Label (e.g. YouTube)"
                    value={link.label}
                    onChange={(e) => updateExtraLink(link._key, { label: e.target.value })}
                    className={`${inputClass} w-36`}
                  />
                  <input
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateExtraLink(link._key, { url: e.target.value })}
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeExtraLink(link._key)}
                    className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove link"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {values.extraLinks.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No extra links yet — add a YouTube demo, resources page, Figma file, or anything
                  else.
                </p>
              )}
            </div>
          </div>

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
              {initial ? "Save changes" : "Add project"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProjectsAdmin({
  projects,
  domains,
  mutations,
}: {
  projects: Project[];
  domains: Domain[];
  mutations: ReturnType<typeof useFirestoreMutations>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | undefined>(undefined);
  const [q, setQ] = useState("");

  const filtered = projects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  const submitting = mutations.create.isPending || mutations.update.isPending;

  const openAdd = () => {
    setEditing(undefined);
    setModalOpen(true);
  };
  const openEdit = (p: Project) => {
    setEditing(p);
    setModalOpen(true);
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    if (editing) {
      mutations.update.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => {
            toast.success("Project updated");
            setModalOpen(false);
          },
        },
      );
    } else {
      mutations.create.mutate(data, {
        onSuccess: () => {
          toast.success("Project added");
          setModalOpen(false);
        },
      });
    }
  };

  return (
    <div className="rounded-2xl bg-warm-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects…"
          className="flex-1 min-w-48 rounded-lg border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-copper"
        />
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add project
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-semibold">Title</th>
              <th className="py-3 pr-4 font-semibold">Tag</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Links</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const linkLabels = [
                p.urls?.github ? "GitHub" : null,
                p.urls?.website ? "Live" : null,
                ...(p.urls?.extraLinks ?? []).map((l) => l.label),
              ].filter(Boolean);
              return (
                <tr key={p.id} className="border-b border-border/60 hover:bg-secondary/40">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img src={p.image} alt="" className="h-9 w-9 rounded-lg object-cover" />
                      )}
                      <span className="font-medium text-foreground">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.tag}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-copper-dark">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">
                    {linkLabels.length ? linkLabels.join(", ") : "—"}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-copper-dark"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        mutations.remove.mutate(p.id);
                        toast.success("Deleted");
                      }}
                      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ProjectFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editing}
        domains={domains}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}

// ---------- Gallery: popup-form based add/edit ----------

function GalleryFormModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: GalleryItem;
  onSubmit: (data: Record<string, unknown>) => void;
  submitting: boolean;
}) {
  const categories = galleryCategories.filter((c) => c !== "All");
  const [values, setValues] = useState(() => ({
    title: initial?.title ?? "",
    category: initial?.category ?? categories[0],
    type: initial?.type ?? "image",
    src: initial?.src ?? "",
    span: initial?.span ?? "sm",
  }));
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValues({
        title: initial?.title ?? "",
        category: initial?.category ?? categories[0],
        type: initial?.type ?? "image",
        src: initial?.src ?? "",
        span: initial?.span ?? "sm",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, open]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "tb-solutions/gallery");
      setValues((v) => ({
        ...v,
        src: result.url,
        type: result.resourceType === "video" ? "video" : "image",
      }));
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.src) {
      toast.error("Please upload an image or video first.");
      return;
    }
    if (!values.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    onSubmit({
      title: values.title,
      category: values.category,
      type: values.type,
      src: values.src,
      span: values.span,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-warm-white">
        <DialogHeader>
          <DialogTitle className="font-display">
            {initial ? "Edit gallery item" : "Add gallery photo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Image / video
            </span>
            <div className="flex items-center gap-4">
              {values.src &&
                (values.type === "video" ? (
                  <video src={values.src} className="h-16 w-16 rounded-lg object-cover" muted />
                ) : (
                  <img src={values.src} alt="" className="h-16 w-16 rounded-lg object-cover" />
                ))}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUpload(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-warm-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {values.src ? "Replace" : "Upload"}
              </button>
            </div>
          </div>

          <Field label="Title">
            <input
              required
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select
                value={values.category}
                onChange={(e) =>
                  setValues((v) => ({ ...v, category: e.target.value as GalleryItem["category"] }))
                }
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Banner size">
              <select
                value={values.span}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    span: e.target.value as NonNullable<GalleryItem["span"]>,
                  }))
                }
                className={inputClass}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra large</option>
              </select>
            </Field>
          </div>

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
              disabled={submitting || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {initial ? "Save changes" : "Add photo"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GalleryAdmin({
  items,
  mutations,
}: {
  items: GalleryItem[];
  mutations: ReturnType<typeof useFirestoreMutations>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | undefined>(undefined);
  const submitting = mutations.create.isPending || mutations.update.isPending;

  const openAdd = () => {
    setEditing(undefined);
    setModalOpen(true);
  };
  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    if (editing) {
      mutations.update.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => {
            toast.success("Updated");
            setModalOpen(false);
          },
        },
      );
    } else {
      mutations.create.mutate(data, {
        onSuccess: () => {
          toast.success("Added");
          setModalOpen(false);
        },
      });
    }
  };

  return (
    <div className="rounded-2xl bg-warm-white p-6 shadow-sm">
      <div className="mb-4 flex justify-between">
        <h3 className="font-semibold text-foreground">Gallery</h3>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add photo
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border"
          >
            {item.type === "video" ? (
              <video src={item.src} className="h-full w-full object-cover" muted />
            ) : (
              <img src={item.src} alt={item.title} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-espresso/80 p-2 text-xs text-warm-white opacity-0 transition-opacity group-hover:opacity-100">
              <div className="truncate">{item.title}</div>
              <div className="flex items-center justify-between text-warm-white/60">
                <span>{item.category}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="hover:text-copper-light"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      mutations.remove.mutate(item.id);
                      toast.success("Deleted");
                    }}
                    className="hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            No gallery items yet
          </div>
        )}
      </div>
      <GalleryFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editing}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}

function MediaGrid({
  items,
  onUpload,
  onDelete,
}: {
  items: MediaAsset[];
  onUpload: (asset: Omit<MediaAsset, "id">) => void;
  onDelete: (id: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "tb-solutions");
      onUpload({
        name: file.name,
        type: result.resourceType === "video" ? "video" : "image",
        url: result.url,
        publicId: result.publicId,
        folder: "tb-solutions",
        sizeKb: Math.round(result.bytes / 1024),
        uploadedAt: new Date().toISOString(),
      });
      toast.success("Uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-warm-white p-6 shadow-sm">
      <div className="mb-4 flex justify-between">
        <h3 className="font-semibold text-foreground">Media library</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{" "}
          Upload
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((m) => (
          <div
            key={m.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border"
          >
            <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-espresso/80 p-2 text-xs text-warm-white opacity-0 transition-opacity group-hover:opacity-100">
              <div className="truncate">{m.name}</div>
              <div className="flex items-center justify-between text-warm-white/60">
                <span>{m.sizeKb ?? 0} KB</span>
                <button
                  onClick={() => onDelete(m.id)}
                  className="hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentEditor() {
  const [hero, setHero] = useState("Every domain. One partner.");
  return (
    <div className="max-w-3xl space-y-4 rounded-2xl bg-warm-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Hero headline</label>
        <input
          value={hero}
          onChange={(e) => setHero(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-copper"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Hero description</label>
        <textarea
          rows={4}
          defaultValue="TB_Solutions is your project consultancy partner…"
          className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-copper"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Contact email</label>
        <input
          defaultValue="hello@tbsolutions.dev"
          className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-copper"
        />
      </div>
      <button
        onClick={() => toast.success("Content saved (mock)")}
        className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
      >
        Save changes
      </button>
    </div>
  );
}
