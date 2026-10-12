import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { storage } from "@/lib/storage";
import { useRequireAuth } from "@/hooks/use-require-auth";

export const Route = createFileRoute("/journal")({
  component: Journal,
  head: () => ({
    meta: [
      { title: "Shred Thoughts — Ember: release anger calmly" },
      { name: "description", content: "Write down what set you off, then shred it or keep it. Journaling in Ember helps you understand anger and release it calmly." },
      { property: "og:title", content: "Shred Thoughts — Ember: release anger calmly" },
      { property: "og:description", content: "Write down what set you off, then shred it or keep it. Journaling in Ember helps you understand anger and release it calmly." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ember-anger.lovable.app/journal" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Shred Thoughts — Ember: release anger calmly" },
      { name: "twitter:description", content: "Write down what set you off, then shred it or keep it. Journaling in Ember helps you understand anger and release it calmly." },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/journal" }],
  }),
});


function Journal() {
  useRequireAuth();
  const [text, setText] = useState("");
  const [shredding, setShredding] = useState(false);
  const [shredded, setShredded] = useState(false);
  const [keepCount, setKeepCount] = useState(0);

  useEffect(() => {
    setKeepCount(storage.getJournal().length);
  }, []);

  const shred = () => {
    if (!text.trim()) return;
    setShredding(true);
    setTimeout(() => {
      setText("");
      setShredding(false);
      setShredded(true);
      setTimeout(() => setShredded(false), 2200);
    }, 1100);
  };

  const keep = () => {
    if (!text.trim()) return;
    storage.addJournal(text);
    setKeepCount(storage.getJournal().length);
    setText("");
  };

  return (
    <AppShell title="Shred Thoughts">
      <div className="flex-1 flex flex-col px-6 pb-16 pt-2 gap-5">
        <p className="text-sm text-ink-light text-center text-pretty">
          Write the thing you can't say out loud. Then shred it — or keep it for later.
        </p>

        <div className="relative flex-1 bg-sand-50 rounded-[28px] border border-sand-200/60 p-5 shadow-[var(--shadow-inset-soft)] overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's burning?"
            disabled={shredding}
            className={`w-full h-full min-h-[260px] bg-transparent resize-none outline-none text-ink placeholder:text-ink-light/60 text-base leading-relaxed font-medium transition-all duration-1000 ${
              shredding ? "opacity-0 blur-sm translate-y-4" : "opacity-100"
            }`}
          />
          {shredded && (
            <div className="absolute inset-0 flex items-center justify-center bg-sand-50/95 rounded-[28px] animate-in fade-in">
              <div className="flex flex-col items-center gap-2">
                <div className="size-14 rounded-full bg-flow-soft text-flow flex items-center justify-center text-2xl">✓</div>
                <p className="font-display font-bold text-ink">Shredded.</p>
                <p className="text-xs text-ink-light">It's no longer yours to carry.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-ink-light px-2">
          <span>{text.length} chars</span>
          <span>{keepCount} kept entr{keepCount === 1 ? "y" : "ies"}</span>
        </div>

        <p className="text-[11px] leading-relaxed text-ink-light/80 text-center px-2">
          Kept entries stay only on this device and never leave it. They're erased when you sign out.
        </p>

        <Link
          to="/journal-prompts"
          className="text-center text-xs font-bold text-clay active:scale-95 transition-transform"
        >
          Stuck? Try one of 35 journal prompts →
        </Link>


        <div className="flex gap-3">
          <button
            onClick={keep}
            disabled={!text.trim() || shredding}
            className="flex-1 bg-sand-50 text-ink border border-sand-200 rounded-[24px] py-4 font-display font-bold active:scale-95 transition-transform disabled:opacity-40"
          >
            Keep
          </button>
          <button
            onClick={shred}
            disabled={!text.trim() || shredding}
            className="flex-[1.4] bg-clay text-sand-50 rounded-[24px] py-4 font-display font-extrabold text-lg shadow-[0_6px_0_var(--clay-dark)] active:translate-y-1.5 active:shadow-[0_0_0_var(--clay-dark)] transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[0_6px_0_var(--clay-dark)]"
          >
            Shred It
          </button>
        </div>
      </div>
    </AppShell>
  );
}
