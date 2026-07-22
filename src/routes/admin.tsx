import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
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
} from "recharts";
import { toast } from "sonner";
import { useAdminAuth } from "@/lib/auth";
import {
  COLLECTIONS,
  useFirestoreCollection,
  useFirestoreMutations,
  type MediaAsset,
} from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  adminUser as mockAdminUser,
  chartData,
  mockContacts,
  mockOffers,
  mockMedia,
} from "@/mock/admin";
import { projects as seedProjects, type Project } from "@/content/projects";
import { domains as seedDomains, type Domain } from "@/content/domains";
import { testimonials as seedTestimonials, type Testimonial } from "@/content/testimonials";
import { galleryItems as seedGallery, type GalleryItem } from "@/content/gallery";
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
    name: auth.user?.displayName ?? mockAdminUser.name,
    email: auth.user?.email ?? mockAdminUser.email,
    role: "Owner",
    avatar: auth.user?.photoURL ?? mockAdminUser.avatar,
  };

  const projectRows = (projectsQuery.data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    tag: p.tag,
    status: p.status,
  }));
  const domainRows = (domainsQuery.data ?? []).map((d) => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    order: d.order,
    featured: d.featured ? "yes" : "no",
  }));
  const galleryRows = (galleryQuery.data ?? []).map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category,
    type: g.type,
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
          {tab === "dashboard" && <DashboardView stats={dashboardStats} />}
          {tab === "projects" && (
            <CrudTable
              title="Projects"
              columns={["title", "tag", "status"]}
              rows={projectRows}
              blankRow={{ title: "New", tag: "New", status: "draft" }}
              onAdd={(data) => projectsMut.create.mutate(data)}
              onUpdate={(id, patch) => projectsMut.update.mutate({ id, data: patch })}
              onDelete={(id) => projectsMut.remove.mutate(id)}
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
            <CrudTable
              title="Gallery"
              columns={["title", "category", "type"]}
              rows={galleryRows}
              blankRow={{ title: "New", category: "Software", type: "image" }}
              onAdd={(data) => galleryMut.create.mutate(data)}
              onUpdate={(id, patch) => galleryMut.update.mutate({ id, data: patch })}
              onDelete={(id) => galleryMut.remove.mutate(id)}
            />
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
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-copper"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-copper"
            />
          </div>
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

function DashboardView({
  stats,
}: {
  stats: {
    totalProjects: number;
    pendingReviews: number;
    unreadContacts: number;
    activeBanners: number;
  };
}) {
  const cards = [
    { label: "Total projects", value: stats.totalProjects, hint: "Live from Firestore" },
    { label: "Pending reviews", value: stats.pendingReviews, hint: "Awaiting approval" },
    { label: "Unread contacts", value: stats.unreadContacts, hint: "New this week" },
    { label: "Gallery items", value: stats.activeBanners, hint: "Live on homepage" },
  ];
  return (
    <div className="space-y-6">
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
          <h3 className="mb-4 font-semibold text-foreground">Projects delivered</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
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
          <h3 className="mb-4 font-semibold text-foreground">Contact inquiries</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="contacts" fill="#bf572c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
