import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, PenLine, Wind, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/cbt-anger-management")({
  head: () => ({
    meta: [
      { title: "Cognitive Behavioural Therapy for Anger Management — Ember" },
      {
        name: "description",
        content:
          "How cognitive behavioural therapy (CBT) helps manage anger: spot triggers, challenge hot thoughts, and practice calmer responses. Ember's tension tracking and journaling make CBT skills a daily habit.",
      },
      { property: "og:title", content: "Cognitive Behavioural Therapy for Anger Management — Ember" },
      {
        property: "og:description",
        content:
          "How cognitive behavioural therapy (CBT) helps manage anger: spot triggers, challenge hot thoughts, and practice calmer responses. Ember's tension tracking and journaling make CBT skills a daily habit.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ember-anger.lovable.app/cbt-anger-management" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Cognitive Behavioural Therapy for Anger Management — Ember" },
      {
        name: "twitter:description",
        content:
          "How cognitive behavioural therapy (CBT) helps manage anger: spot triggers, challenge hot thoughts, and practice calmer responses.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/cbt-anger-management" }],
  }),
  component: CbtPage,
});

const STEPS = [
  {
    title: "Notice the trigger",
    icon: <Brain className="size-4" />,
    tone: "text-flow bg-flow-soft",
    body: "CBT starts with awareness: anger follows a predictable chain of situation, thought, and body reaction. Ember's tension check-ins help you catch that chain early, before it peaks.",
  },
  {
    title: "Challenge hot thoughts",
    icon: <PenLine className="size-4" />,
    tone: "text-destructive bg-destructive/15",
    body: "Thoughts like \"they did that on purpose\" pour fuel on anger. Writing them down — a core CBT exercise — lets you inspect and reframe them. Ember's journal gives you that space privately.",
  },
  {
    title: "Calm the body first",
    icon: <Wind className="size-4" />,
    tone: "text-clay bg-clay/15",
    body: "Slow breathing lowers the physical arousal that keeps angry thoughts looping. Ember's guided box breathing is the same physiological reset CBT practitioners teach.",
  },
  {
    title: "Track what works",
    icon: <TrendingDown className="size-4" />,
    tone: "text-ink bg-ink/10",
    body: "CBT is skills practice, not a one-off fix. Watching your tension trend over days shows which responses actually cool you down — and builds the new habit.",
  },
];

function CbtPage() {
  return (
    <AppShell title="CBT & Anger" back>
      <div className="flex-1 px-6 pb-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
        <header className="shrink-0">
          <h1 className="font-display font-bold text-ink text-2xl tracking-tight leading-tight">
            Cognitive behavioural therapy for anger management
          </h1>
          <p className="text-xs text-ink-light text-pretty mt-1">
            CBT is one of the most researched approaches to anger. It treats anger as a habit of
            thoughts and reactions — and habits can be retrained.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-2">
          {STEPS.map((s) => (
            <article
              key={s.title}
              className="bg-sand-50/70 border border-clay/20 rounded-[20px] p-3 flex items-start gap-3"
            >
              <span className={`size-8 shrink-0 rounded-lg flex items-center justify-center ${s.tone}`}>
                {s.icon}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h2 className="font-display font-bold text-ink text-sm leading-tight">{s.title}</h2>
                <p className="text-[10px] text-ink-light text-pretty leading-snug">{s.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="shrink-0 rounded-[20px] p-3 border border-clay/20 bg-sand-50/60 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-ink text-sm">Practice CBT skills in Ember</h2>
            <p className="text-[10px] text-ink-light text-pretty mt-0.5">
              Tension tracking, journaling, and guided breathing — the daily reps that make CBT stick.
            </p>
          </div>
          <Link
            to="/signup"
            className="shrink-0 bg-clay text-sand-50 rounded-full px-4 py-2 text-xs font-bold active:scale-95 transition-transform"
          >
            Try free
          </Link>
        </section>

        <p className="text-[9px] text-ink-light/70 text-pretty shrink-0">
          Ember is a self-help tool, not a substitute for professional therapy. If anger feels
          unmanageable, please reach out to a qualified mental-health professional.
        </p>
      </div>
    </AppShell>
  );
}
