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
      <div className="flex-1 px-6 pt-4 pb-4 flex flex-col gap-3 min-h-0">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-flow leading-tight">
              {greeting}, {name}
            </p>
            <h1 className="font-display font-bold text-clay text-2xl tracking-tight leading-tight">
              Ember — your space for anger release
            </h1>
          </div>

          <div className="bg-flow-soft border border-flow/30 rounded-full px-3 py-1.5 flex items-center gap-2 shrink-0">
            <span className="size-1.5 rounded-full bg-flow" />
            <span className="text-xs font-semibold text-flow tabular-nums">{streak}d</span>
          </div>
        </header>

        {/* Tension hero */}
        <section className="bg-sand-50/70 border border-clay/20 rounded-[24px] p-4 backdrop-blur-md shadow-[var(--shadow-inset-soft)]">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-light">
              Tension Level
            </h2>
            <span className="font-display font-bold text-clay text-3xl leading-none tabular-nums">
              {tension}
            </span>
          </div>

          <div className="relative h-7 rounded-full bg-sand-200/70 border border-clay/25 flex items-center px-1 shadow-[inset_0_2px_10px_oklch(0.22_0.06_250/0.2)]">
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
              className="absolute size-6 rounded-full bg-sand-50 border-[3px] border-clay z-10 transition-all duration-300 pointer-events-none shadow-[var(--shadow-soft)]"
              style={{ left: `calc(${fillPct}% - 0.75rem)` }}
            />
          </div>

          <p className="mt-2 text-xs leading-snug italic text-clay text-pretty">
            Grounding: {TENSION_MESSAGES[tension]}
          </p>
        </section>

        {/* Primary CTA */}
        <Link
          to="/breathe"
          className="w-full bg-clay rounded-[18px] py-3.5 flex items-center justify-center gap-2 shadow-[var(--shadow-press)] transition-transform duration-150 active:translate-y-2 active:shadow-[var(--shadow-press-active)]"
        >
          <span className="font-display font-bold text-base uppercase tracking-[0.12em] text-primary-foreground">
            I need an outlet
          </span>
          <Zap className="size-4 text-primary-foreground" strokeWidth={2.5} />
        </Link>

        {/* Channel grid */}
        <div className="grid grid-cols-4 gap-2">
          <Link
            to="/breathe"
            className="col-span-2 row-span-2 rounded-[24px] p-4 border border-clay/25 bg-linear-to-br from-sand-50 to-sand-100 flex flex-col justify-between active:scale-[0.98] transition-transform"
          >
            <span className="size-9 rounded-xl bg-flow-soft text-flow flex items-center justify-center">
              <Wind className="size-5" />
            </span>
            <span>
              <span className="block font-display font-bold text-ink text-lg">Breathe</span>
              <span className="block text-[10px] text-ink-light">Guided rhythmic release</span>
            </span>
          </Link>

          <Tile to="/vent" label="Vent" icon={<MessageSquare className="size-4" />} tone="text-flow bg-flow-soft" />
          <Tile to="/journal" label="Shred" icon={<Trash2 className="size-4" />} tone="text-destructive bg-destructive/15" />
          <Tile to="/walk" label="Walk" icon={<Footprints className="size-4" />} tone="text-clay bg-clay/15" />
          <Tile to="/face" label="Face" icon={<ScanFace className="size-4" />} tone="text-ink bg-ink/10" />
        </div>

        <section className="rounded-[20px] p-3 border border-clay/20 bg-sand-50/60 flex items-start gap-3">
          <span className="size-7 rounded-full bg-flow-soft text-flow flex items-center justify-center font-display font-bold shrink-0 text-sm">
            ✓
          </span>
          <span>
            <span className="block font-display font-bold text-ink text-xs">You showed up today.</span>
            <span className="block text-[10px] text-ink-light text-pretty mt-0.5">
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
