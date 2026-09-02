import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wind, MessageSquare, Trash2, Footprints, ScanFace, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { storage } from "@/lib/storage";
import { useSystemTheme } from "@/hooks/use-system-theme";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ember — Track tension & release anger calmly" },
      {
        name: "description",
        content:
          "Track tension, breathe through triggers, vent privately, and journal to understand anger. Ember turns intense moments into calm action.",
      },
      { property: "og:title", content: "Ember — Track tension & release anger calmly" },
      {
        property: "og:description",
        content:
          "Track tension, breathe through triggers, vent privately, and journal to understand anger. Ember turns intense moments into calm action.",
      },
    ],
  }),
  component: Home,
});

const TENSION_MESSAGES = [
  "Calm waters. Stay grounded.",
  "Lightly stirred. Notice your breath.",
  "Some tension. A pause helps.",
  "Energy is rising in the chest.",
  "Heat building. Let it move.",
  "Pressure noticeable. Breathe out.",
  "Heavy and tight. Take a moment.",
  "Strong charge. Time to release.",
  "Energy feels tight and heavy in the chest.",
  "Boiling over. Step away. Channel it.",
  "At the edge. Ground yourself now.",
];

function Home() {
  useSystemTheme();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
  }, [loading, user, navigate]);
  const [tension, setTension] = useState(5);
  const [streak, setStreak] = useState(0);
  const [name, setName] = useState("friend");
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    setTension(storage.getTension());
    setStreak(storage.getStreak());
    setName(storage.getName());
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const onTensionChange = (v: number) => {
    setTension(v);
    storage.setTension(v);
    setStreak(storage.getStreak());
  };

  const fillPct = (tension / 10) * 100;

  return (
    <AppShell back={false}>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8 flex flex-col gap-6">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-clay text-3xl tracking-tight">
              {greeting}, {name}
            </h1>
            <p className="text-sm font-medium text-ink-light mt-1">
              Take a breath. You are in control.
            </p>
          </div>
          <div className="bg-flow-soft border border-flow/30 rounded-full px-3 py-1.5 flex items-center gap-2 shrink-0 mt-1">
            <span className="size-1.5 rounded-full bg-flow" />
            <span className="text-xs font-semibold text-flow tabular-nums">{streak}d</span>
          </div>
        </header>

        {/* Tension hero */}
        <section className="bg-sand-50/70 border border-clay/20 rounded-[28px] p-6 backdrop-blur-md shadow-[var(--shadow-inset-soft)]">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-light">
              Tension Level
            </h2>
            <span className="font-display font-bold text-clay text-4xl leading-none tabular-nums">
              {tension}
            </span>
          </div>

          <div className="relative h-9 rounded-full bg-sand-200/70 border border-clay/25 flex items-center px-1 shadow-[inset_0_2px_10px_oklch(0.22_0.06_250/0.2)]">
            <div
              className="absolute left-1 top-1 bottom-1 rounded-full bg-linear-to-r from-flow to-clay transition-all duration-300 shadow-[0_0_16px_var(--flow-soft)]"
              style={{ width: `calc(${fillPct}% - 0.5rem)` }}
            />
            <input
              type="range"
              min={0}
              max={10}
              value={tension}
              onChange={(e) => onTensionChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              aria-label="Tension level"
            />
            <div
              className="absolute size-8 rounded-full bg-sand-50 border-4 border-clay z-10 transition-all duration-300 pointer-events-none shadow-[var(--shadow-soft)]"
              style={{ left: `calc(${fillPct}% - 1rem)` }}
            />
          </div>

          <p className="mt-4 text-xs leading-relaxed italic text-clay text-pretty">
            Grounding: {TENSION_MESSAGES[tension]}
          </p>
        </section>

        {/* Primary CTA */}
        <Link
          to="/breathe"
          className="w-full bg-clay rounded-[20px] py-5 flex items-center justify-center gap-3 shadow-[var(--shadow-press)] transition-transform duration-150 active:translate-y-2 active:shadow-[var(--shadow-press-active)]"
        >
          <span className="font-display font-bold text-lg uppercase tracking-[0.12em] text-primary-foreground">
            I need an outlet
          </span>
          <Zap className="size-5 text-primary-foreground" strokeWidth={2.5} />
        </Link>

        {/* Channel grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/breathe"
            className="col-span-2 rounded-[28px] p-5 border border-clay/25 bg-linear-to-br from-sand-50 to-sand-100 min-h-[140px] flex flex-col justify-between active:scale-[0.98] transition-transform"
          >
            <span className="size-10 rounded-xl bg-flow-soft text-flow flex items-center justify-center">
              <Wind className="size-6" />
            </span>
            <span>
              <span className="block font-display font-bold text-ink text-xl">Breathe</span>
              <span className="block text-xs text-ink-light">Guided rhythmic release</span>
            </span>
          </Link>

          <Tile to="/vent" label="Vent" icon={<MessageSquare className="size-5" />} tone="text-flow bg-flow-soft" />
          <Tile to="/journal" label="Shred" icon={<Trash2 className="size-5" />} tone="text-destructive bg-destructive/15" />
          <Tile to="/walk" label="Walk" icon={<Footprints className="size-5" />} tone="text-clay bg-clay/15" />
          <Tile to="/face" label="Face Check" icon={<ScanFace className="size-5" />} tone="text-ink bg-ink/10" />
        </div>

        <section className="rounded-[24px] p-5 border border-clay/20 bg-sand-50/60 flex items-start gap-4">
          <span className="size-9 rounded-full bg-flow-soft text-flow flex items-center justify-center font-display font-bold shrink-0">
            ✓
          </span>
          <span>
            <span className="block font-display font-bold text-ink text-sm">You showed up today.</span>
            <span className="block text-xs text-ink-light text-pretty mt-1">
              Awareness is the first release. Each check-in builds a steadier you.
            </span>
          </span>
        </section>
      </div>
    </AppShell>
  );
}

function Tile({
  to,
  label,
  icon,
  tone,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <Link
      to={to}
      className="bg-sand-50/60 p-5 rounded-[28px] border border-clay/20 flex flex-col gap-4 active:scale-95 transition-transform"
    >
      <span className={`size-9 rounded-lg flex items-center justify-center ${tone}`}>{icon}</span>
      <span className="font-display font-bold text-ink text-lg">{label}</span>
    </Link>
  );
}
