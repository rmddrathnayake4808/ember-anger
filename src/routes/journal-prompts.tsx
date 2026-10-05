import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, PenLine, Search, HeartHandshake, Waves, Sunrise } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/journal-prompts")({
  head: () => ({
    meta: [
      { title: "35 Anger Journal Prompts — Ember" },
      {
        name: "description",
        content:
          "35 therapeutic anger journal prompts to understand your triggers, cool hot thoughts, and express what's really underneath. Free prompts you can start using today — with a journal that shreds.",
      },
      { property: "og:title", content: "35 Anger Journal Prompts — Ember" },
      {
        property: "og:description",
        content:
          "35 therapeutic anger journal prompts to understand your triggers, cool hot thoughts, and express what's really underneath. Free prompts you can start using today.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ember-anger.lovable.app/journal-prompts" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "35 Anger Journal Prompts — Ember" },
      {
        name: "twitter:description",
        content:
          "35 therapeutic anger journal prompts to understand your triggers, cool hot thoughts, and express what's really underneath.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/journal-prompts" }],
  }),
  component: JournalPromptsPage,
});

const GROUPS = [
  {
    title: "In the heat of the moment",
    icon: <Flame className="size-4" />,
    tone: "text-destructive bg-destructive/15",
    blurb: "Use these while the feeling is still loud. Writing slows the reaction down.",
    prompts: [
      "What happened in the last five minutes, described like a camera would see it — no interpretation?",
      "Where do I feel it in my body right now? Jaw, chest, fists, stomach?",
      "If my anger could talk, what is the very first sentence it would shout?",
      "What is the smallest thing that just happened — and why did it feel so big?",
      "On a scale of 1–10, how hot is this? What would make it one number lower?",
      "What do I want to do right now — and what would I want to have done tomorrow morning?",
    ],
  },
  {
    title: "Finding the trigger underneath",
    icon: <Search className="size-4" />,
    tone: "text-flow bg-flow-soft",
    blurb: "Anger usually guards something more tender. These prompts look behind it.",
    prompts: [
      "What did I believe about myself in that moment — 'I'm not respected', 'I'm being taken advantage of'?",
      "Was I actually angry, or was it hurt, fear, embarrassment, or exhaustion wearing anger's coat?",
      "When was the first time I remember feeling exactly like this?",
      "What boundary of mine was crossed, if any? Name it in one sentence.",
      "What expectation did I have that didn't get met? Was it spoken out loud or assumed?",
      "If a friend told me this same story, what would I say to them?",
      "What am I afraid will happen if I don't get angry about this?",
    ],
  },
  {
    title: "Cooling the hot thought",
    icon: <Waves className="size-4" />,
    tone: "text-clay bg-clay/15",
    blurb: "Cognitive reframing — the same skill cognitive behavioural therapy teaches.",
    prompts: [
      "Write the thought exactly as it appeared: 'They did that on purpose because…'",
      "What evidence supports that thought? What evidence doesn't?",
      "What's another way to explain what happened — one that isn't about me being wronged?",
      "If the person did mean it, what's the most useful response — not the most satisfying one?",
      "Will this matter in a week? In a year? What will matter?",
      "What did I make their behaviour mean about me? Is that meaning actually true?",
      "Rewrite the story in one calm sentence, as if I were reporting the news.",
    ],
  },
  {
    title: "Expressing what wasn't said",
    icon: <PenLine className="size-4" />,
    tone: "text-ink bg-ink/10",
    blurb: "Say it on paper so it doesn't have to come out sideways in real life.",
    prompts: [
      "Write the unsent message: everything I wish I had said, with no editing and no politeness.",
      "Finish the sentence ten times: 'I feel angry because…' — no repeats allowed.",
      "What do I need from this person or situation that I haven't asked for directly?",
      "If I could say one thing calmly to them tomorrow, what would it be? Draft it.",
      "What apology do I owe — to them, or to myself?",
    ],
  },
  {
    title: "Repair and moving forward",
    icon: <HeartHandshake className="size-4" />,
    tone: "text-flow bg-flow-soft",
    blurb: "After the storm: turning the incident into information you can use.",
    prompts: [
      "What did my reaction cost me — and was it worth the price?",
      "What is one thing I'd do differently next time this trigger shows up?",
      "What helped me cool down last time? Write the recipe so I remember it.",
      "Who do I need to repair with, and what's the smallest honest first step?",
      "What is one sentence I can hold onto the next time this happens?",
    ],
  },
  {
    title: "Building a steadier baseline",
    icon: <Sunrise className="size-4" />,
    tone: "text-clay bg-clay/15",
    blurb: "Anger management is a daily practice, not a fire drill. These prompts are for calm days.",
    prompts: [
      "What does my body feel like at tension level 2? Describe it so I can recognise it early.",
      "What are my three earliest warning signs that irritation is building?",
      "What situations reliably raise my tension — people, places, times of day, levels of tiredness?",
      "What does 'handled well' look like for me? Describe a version of today I'd be proud of.",
      "What do I need regularly — sleep, movement, quiet, alone time — that I'm currently low on?",
      "Who can I tell when I notice I'm at a 6? Do they know what I need when I say it?",
    ],
  },
];

function JournalPromptsPage() {
  return (
    <AppShell title="Journal Prompts" back>
      <div className="flex-1 px-6 pb-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
        <header className="shrink-0">
          <h1 className="font-display font-bold text-ink text-2xl tracking-tight leading-tight">
            35 anger journal prompts
          </h1>
          <p className="text-xs text-ink-light text-pretty mt-1">
            Writing about anger turns a blind surge into something you can look at. Pick one prompt,
            write freely, and don't edit yourself — these are for your eyes only.
          </p>
        </header>

        {GROUPS.map((g) => (
          <section key={g.title} className="bg-sand-50/70 border border-clay/20 rounded-[20px] p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`size-8 shrink-0 rounded-lg flex items-center justify-center ${g.tone}`}>{g.icon}</span>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-ink text-sm leading-tight">{g.title}</h2>
                <p className="text-[10px] text-ink-light text-pretty leading-snug">{g.blurb}</p>
              </div>
            </div>
            <ol className="flex flex-col gap-1.5">
              {g.prompts.map((p, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-snug text-ink-light text-pretty">
                  <span className="shrink-0 font-display font-bold text-ink/50">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section className="shrink-0 rounded-[20px] p-3 border border-clay/20 bg-sand-50/60 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-ink text-sm">Write it, then decide its fate</h2>
            <p className="text-[10px] text-ink-light text-pretty mt-0.5">
              Ember's journal lets you shred an entry when you're done with it — or keep it to watch
              your patterns over time.
            </p>
          </div>
          <Link
            to="/journal"
            className="shrink-0 bg-clay text-sand-50 rounded-full px-4 py-2 text-xs font-bold active:scale-95 transition-transform"
          >
            Open journal
          </Link>
        </section>

        <Link
          to="/techniques"
          className="shrink-0 rounded-[20px] p-3 border border-flow/30 bg-flow-soft/60 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-ink text-sm">Pair prompts with techniques</h2>
            <p className="text-[10px] text-ink-light text-pretty mt-0.5">
              Breathing, walking, and venting — the other tools that cool a hot moment.
            </p>
          </div>
          <span className="text-flow text-xs font-bold shrink-0">Read →</span>
        </Link>

        <p className="text-[9px] text-ink-light/70 text-pretty shrink-0">
          Ember is a self-help tool, not a substitute for professional therapy. If anger feels
          unmanageable, please reach out to a qualified mental-health professional.
        </p>
      </div>
    </AppShell>
  );
}
