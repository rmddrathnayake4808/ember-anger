import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, ExternalLink, Lightbulb, X, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { todaysArticles, todaysTip, type Article } from "@/lib/articles";
import { readArticle } from "@/lib/reader.functions";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Daily CBT tips & anger articles | Ember" },
      { name: "description", content: "A fresh CBT tip and hand-picked anger management articles from the NHS, APA, Mayo Clinic, Mind and more — updated every day." },
      { property: "og:title", content: "Learn — Daily CBT tips & anger articles | Ember" },
      { property: "og:description", content: "A fresh CBT tip and trusted anger management articles, updated every day." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ember-anger.lovable.app/learn" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Learn — Daily CBT tips & anger articles | Ember" },
      { name: "twitter:description", content: "A fresh CBT tip and trusted anger management articles, updated every day." },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/learn" }],
  }),
  component: LearnPage,
});

function LearnPage() {
  const [open, setOpen] = useState<Article | null>(null);
  const articles = todaysArticles();
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <AppShell>
      <div className="h-full overflow-y-auto px-5 pb-4 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-light">{date}</p>
          <h1 className="font-display text-2xl text-ink">Learn</h1>
        </div>

        <div className="rounded-3xl border border-clay/25 bg-clay/10 p-4">
          <div className="flex items-center gap-2 text-clay text-xs font-semibold uppercase tracking-wide">
            <Lightbulb className="size-4" /> CBT tip of the day
          </div>
          <p className="mt-2 text-ink">{todaysTip()}</p>
        </div>

        <h2 className="text-sm font-semibold text-ink-light">Today's reading</h2>
        <div className="space-y-3">
          {articles.map((a) => (
            <button key={a.id} onClick={() => setOpen(a)} className="w-full text-left rounded-3xl border border-clay/20 bg-sand-50/70 p-4 shadow-[var(--shadow-card)] hover:border-clay/50 transition-colors">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-clay">{a.source}</p>
              <h3 className="mt-1 font-semibold text-ink">{a.title}</h3>
              <p className="mt-1 text-sm text-ink-light line-clamp-2">{a.summary}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-clay font-semibold"><BookOpen className="size-3.5" /> Read in app</span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ink-light">New picks every day. Articles belong to their publishers. Not a replacement for professional care.</p>
      </div>
      {open && <Reader article={open} onClose={() => setOpen(null)} />}
    </AppShell>
  );
}

function Reader({ article, onClose }: { article: Article; onClose: () => void }) {
  const read = useServerFn(readArticle);
  const [paras, setParas] = useState<{ tag: string; text: string }[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    setLoading(true);
    read({ data: { id: article.id } })
      .then((r) => live && setParas(r.paragraphs))
      .catch(() => live && setParas([]))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [article.id, read]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-clay/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-clay truncate">{article.source}</p>
        <button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-clay/10 text-ink"><X className="size-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        <h1 className="font-display text-2xl text-ink">{article.title}</h1>
        <div className="rounded-2xl bg-clay/10 p-3 text-sm text-ink"><strong>Key tip:</strong> {article.tip}</div>
        {isLoading && <div className="flex items-center gap-2 text-ink-light text-sm"><Loader2 className="size-4 animate-spin" /> Loading article…</div>}
        {!isLoading && paras.length === 0 && <p className="text-ink-light">{article.summary}</p>}
        {paras.map((p, i) =>
          p.tag === "h2" || p.tag === "h3" ? (
            <h2 key={i} className="pt-2 font-semibold text-lg text-ink">{p.text}</h2>
          ) : p.tag === "li" ? (
            <p key={i} className="pl-4 text-ink leading-relaxed">• {p.text}</p>
          ) : (
            <p key={i} className="text-ink leading-relaxed">{p.text}</p>
          ),
        )}
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-clay px-4 py-2 text-sm font-semibold text-primary-foreground">
          Open original <ExternalLink className="size-4" />
        </a>
      </div>
    </div>
  );
}
