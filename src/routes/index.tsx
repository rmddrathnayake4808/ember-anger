import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { storage } from "@/lib/storage";
import { useSystemTheme } from "@/hooks/use-system-theme";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
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
    setGreeting(h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening");
  }, []);

  const onTensionChange = (v: number) => {
    setTension(v);
    storage.setTension(v);
    setStreak(storage.getStreak());
  };

  const fillPct = (tension / 10) * 100;

  return (
    <AppShell back={false}>
      <header className="flex items-center justify-between px-7 pt-10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-clay/15 border border-clay/20 flex items-center justify-center">
            <span className="font-display font-bold text-clay text-lg">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-ink-light">{greeting},</span>
            <h1 className="font-display font-bold text-ink text-xl">{name}</h1>
          </div>
        </div>
        <div className="bg-flow-soft border border-flow/25 rounded-full px-3.5 py-2 flex items-center gap-2">
          <div className="size-2 rounded-full bg-flow" />
          <span className="text-xs font-bold text-flow tabular-nums">
            {streak} Day{streak === 1 ? "" : "s"}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-16 flex flex-col gap-7">
        {/* Tension */}
        <section className="bg-sand-50 rounded-[32px] p-6 border border-sand-200/60 shadow-[var(--shadow-inset-soft)]">
          <div className="flex justify-between items-end mb-5">
            <h2 className="font-display font-bold text-ink text-lg">Current Tension</h2>
            <span className="text-sm font-bold text-clay tabular-nums">Level {tension}</span>
          </div>

          <div className="relative h-14 bg-sand-200 rounded-full p-2 flex items-center shadow-[inset_0_4px_8px_oklch(0.32_0.03_30/0.06)]">
            <div
              className="absolute left-2 top-2 bottom-2 bg-clay rounded-full transition-all duration-300 shadow-[0_2px_10px_oklch(0.585_0.135_38/0.35)]"
              style={{ width: `calc(${fillPct}% - 1rem)` }}
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
              className="absolute size-10 bg-sand-50 rounded-full border-4 border-clay shadow-[0_4px_12px_oklch(0.32_0.03_30/0.18)] z-10 transition-all duration-300 pointer-events-none"
              style={{ left: `calc(${fillPct}% - 1.25rem - 0.25rem + 0.25rem)`, top: "0.5rem" }}
            />
          </div>
          <p className="mt-5 text-sm font-medium text-ink-light text-center text-pretty">
            {TENSION_MESSAGES[tension]}
          </p>
        </section>

        {/* Primary Action */}
        <section className="px-1">
          <Link
            to="/breathe"
            className="block w-full bg-clay text-sand-50 rounded-[36px] pt-7 pb-9 px-6 shadow-[var(--shadow-press)] flex flex-col items-center justify-center gap-3 transform transition-all duration-150 hover:brightness-105 active:translate-y-3 active:shadow-[var(--shadow-press-active)]"
          >
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
              I need an outlet
            </span>
            <span className="text-sm font-medium text-sand-50/85 bg-clay-dark/35 px-4 py-1.5 rounded-full">
              Start guided release
            </span>
          </Link>
        </section>

        {/* Channels */}
        <section>
          <h3 className="text-xs font-bold text-ink-light uppercase tracking-[0.15em] mb-4 px-2">
            Quick Channels
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <ChannelCard to="/breathe" label={["Box", "Breathe"]} sub="2 min grounding" letter="B" tone="flow" />
            <ChannelCard to="/face" label={["Face", "Check"]} sub="Rank your emotions" letter="F" tone="clay" />
            <ChannelCard to="/vent" label={["Voice", "Dump"]} sub="Audio uncensored" letter="V" tone="ink" />
            <ChannelCard to="/journal" label={["Shred", "Thoughts"]} sub="Write & destroy" letter="S" tone="sand" />
            <ChannelCard to="/walk" label={["Brisk", "Walk"]} sub="Burn the energy" letter="M" tone="flow" />
          </div>
        </section>

        <section className="bg-sand-50 rounded-[28px] p-5 border border-sand-200/60 flex items-start gap-4">
          <div className="size-10 rounded-full bg-flow-soft text-flow flex items-center justify-center font-display font-bold shrink-0">
            ✓
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-display font-bold text-ink text-sm">You showed up today.</p>
            <p className="text-xs text-ink-light text-pretty">
              Awareness is the first release. Each check-in builds a steadier you.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ChannelCard({
  to,
  label,
  sub,
  letter,
  tone,
}: {
  to: string;
  label: [string, string];
  sub: string;
  letter: string;
  tone: "flow" | "clay" | "ink" | "sand";
}) {
  const tones: Record<typeof tone, string> = {
    flow: "bg-flow-soft text-flow",
    clay: "bg-clay/15 text-clay",
    ink: "bg-ink/10 text-ink",
    sand: "bg-sand-300/40 text-ink-light",
  };
  return (
    <Link
      to={to}
      className="bg-sand-50 rounded-[28px] p-5 border border-sand-200/50 flex flex-col gap-7 active:scale-95 transition-transform shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)]"
    >
      <div className={`size-10 rounded-full flex items-center justify-center font-display font-bold text-base ${tones[tone]}`}>
        {letter}
      </div>
      <div>
        <h4 className="font-display font-bold text-ink text-balance leading-tight">
          {label[0]}<br />{label[1]}
        </h4>
        <p className="text-xs text-ink-light mt-1">{sub}</p>
      </div>
    </Link>
  );
}
