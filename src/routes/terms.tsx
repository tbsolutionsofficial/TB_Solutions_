import { createFileRoute, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { termsContent } from "@/content/terms";
import { useFirestoreDoc, COLLECTIONS, TERMS_DOC_ID, type TermsContent } from "@/lib/firestore";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — TB_Solutions" },
      { name: "description", content: "The terms and conditions for using TB_Solutions services." },
      { property: "og:title", content: "Terms & Conditions — TB_Solutions" },
      { property: "og:description", content: "Terms of service for TB_Solutions." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { data } = useFirestoreDoc<TermsContent>(COLLECTIONS.settings, TERMS_DOC_ID, {
    initialData: null,
  });
  const content = data?.content || termsContent;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-40 sm:px-6 lg:px-8">
        <Link to="/" className="text-sm font-medium text-copper-dark hover:underline">
          ← Back to home
        </Link>
        <article className="prose prose-neutral mt-8 max-w-none prose-headings:font-display prose-headings:text-foreground prose-h1:text-5xl prose-h2:text-2xl prose-h2:text-copper-dark prose-p:text-foreground/85 prose-strong:text-foreground prose-a:text-copper-dark">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}
