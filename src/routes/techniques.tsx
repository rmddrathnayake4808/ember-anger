import { createFileRoute, Link } from "@tanstack/react-router";
import { Wind, Footprints, MessageSquare, PenLine } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/techniques")({
  head: () => ({
    meta: [
      { title: "Anger Management Techniques — Ember" },
      {
        name: "description",
        content:
          "Learn practical anger management techniques: box breathing, mindful walking, voice venting, and expressive journaling. Ember helps you turn intense moments into calm action.",
      },
      { property: "og:title", content: "Anger Management Techniques — Ember" },
      {
        property: "og:description",
        content:
          "Learn practical anger management techniques: box breathing, mindful walking, voice venting, and expressive journaling. Ember helps you turn intense moments into calm action.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ember-anger.lovable.app/techniques" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/techniques" }],
  }),
  component: TechniquesPage,
});

const TECHNIQUES = [
  {
    title: "Box breathing",
    icon: <Wind className="size-4" />,
    tone: "text-flow bg-flow-soft",
    body: "Inhale, hold, exhale, hold — each for 4 counts. Slows the heart rate and signals safety to the nervous system.",
  },
  {
    title: "Mindful walking",
    icon: <Footprints className="size-4" />,
    tone: "text-clay bg-clay/15",
    body: "Pace slowly and match steps to breath. Movement burns stress hormones and breaks rumination loops.",
  },
  {
    title: "Voice venting",
    icon: <MessageSquare className="size-4" />,
    tone: "text-ink bg-ink/10",
    body: "Say what you feel out loud without storing it. Releasing the charge verbally can reduce its intensity.",
  },
  {
    title: "Expressive journaling",
    icon: <PenLine className="size-4" />,
    tone: "text-destructive bg-destructive/15",
    body: "Write the thought down, then shred it. Externalizing anger makes it easier to inspect and release.",
  },
];

function TechniquesPage() {
  return (
    <AppShell title="Techniques" back>
      <div className="flex-1 px-6 pb-4 flex flex-col gap-3 min-h-0">
        <header className="shrink-0">
          <h1 className="font-display font-bold text-ink text-2xl tracking-tight leading-tight">
            Anger management techniques
          </h1>
          <p className="text-xs text-ink-light text-pretty mt-1">
            Evidence-based ways to cool intense moments and build a steadier response.
          </p>
        </header>

        <section className="flex-1 min-h-0 grid grid-cols-2 gap-2">
          {TECHNIQUES.map((t) => (
            <article
              key={t.title}
              className="bg-sand-50/70 border border-clay/20 rounded-[20px] p-3 flex flex-col gap-2 justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`size-8 rounded-lg flex items-center justify-center ${t.tone}`}>{t.icon}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="font-display font-bold text-ink text-sm leading-tight">{t.title}</h2>
                <p className="text-[10px] text-ink-light text-pretty leading-snug">{t.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="shrink-0 rounded-[20px] p-3 border border-clay/20 bg-sand-50/60 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-ink text-sm">Practice them in Ember</h2>
            <p className="text-[10px] text-ink-light text-pretty mt-0.5">
              Track tension, follow guided tools, and see what works for you.
            </p>
          </div>
          <Link
            to="/signup"
            className="shrink-0 bg-clay text-sand-50 rounded-full px-4 py-2 text-xs font-bold active:scale-95 transition-transform"
          >
            Try free
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
