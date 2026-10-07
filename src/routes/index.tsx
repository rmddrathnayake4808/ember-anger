import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wind, MessageSquare, Trash2, Footprints, ScanFace, Phone, BookOpen, Lightbulb, PenLine, Brain, Settings as SettingsIcon, AlertTriangle } from "lucide-react";
import { detectCountry, emergencyNumber } from "@/lib/emergency";
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
          "Check in with your tension level, then release it with guided breathing, private venting, journaling, and mindful walks — all in one calm space.",
      },
      { property: "og:title", content: "Ember — Track tension & release anger calmly" },
      {
        property: "og:description",
        content:
          "Check in with your tension level, then release it with guided breathing, private venting, journaling, and mindful walks — all in one calm space.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ember-anger.lovable.app/" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Ember — Track tension & release anger calmly" },
      {
        name: "twitter:description",
        content:
          "Check in with your tension level, then release it with guided breathing, private venting, journaling, and mindful walks — all in one calm space.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/" }],
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
  const [sos, setSos] = useState("112");
  useEffect(() => setSos(emergencyNumber(detectCountry())), []);
  useEffect(() => {
    const root = document.documentElement;
    const c = tensionColor(tension);
    root.style.setProperty("--clay", c);
    root.style.setProperty("--flow", c);
    root.style.setProperty("--primary", c);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", c);
  }, [tension]);

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
    if (v > 7 && typeof Notification !== "undefined") {
      const notify = () => {
        try { new Notification("Ember: tension is high", { body: "Pause. Try a breathing round or another outlet.", icon: "/favicon.png" }); } catch {}
      };
      if (Notification.permission === "granted") notify();
      else if (Notification.permission === "default") Notification.requestPermission().then((p) => p === "granted" && notify());
    }
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

          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-flow-soft border border-flow/30 rounded-full px-2.5 py-1.5 text-xs font-semibold text-flow tabular-nums">{streak}d</span>
            <a
              href={`tel:${sos}`}
              aria-label={`Call emergency services ${sos}`}
              className="bg-destructive text-destructive-foreground rounded-full px-3 py-2 flex items-center gap-1.5 font-display font-bold text-xs shadow-[var(--shadow-soft)] active:scale-95 transition-transform"
            >
              <Phone className="size-3.5" /> SOS {sos}
            </a>
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

          <div
            className="relative h-7 rounded-full border border-clay/25 flex items-center px-1 shadow-[inset_0_2px_10px_oklch(0.22_0.06_250/0.2)]"
            style={{ background: "linear-gradient(to right, oklch(0.72 0.17 145), oklch(0.86 0.17 95), oklch(0.62 0.21 27))" }}
          >
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
              className="absolute size-6 rounded-full border-[3px] border-sand-50 z-10 transition-all duration-300 pointer-events-none shadow-[var(--shadow-soft)]"
              style={{ left: `calc(${fillPct}% - 0.75rem)`, background: tensionColor(tension) }}
            />

          </div>

          <p className="mt-2 text-xs leading-snug italic text-clay text-pretty">
            Grounding: {TENSION_MESSAGES[tension]}
          </p>
        </section>

        {tension > 7 && (
          <div role="alert" className="rounded-[18px] border border-destructive/40 bg-destructive/10 p-3 flex gap-2 items-start">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-ink">
              Your tension is high. Pause and choose an outlet below —{" "}
              <Link to="/breathe" className="font-bold text-destructive underline">breathe now</Link>.
            </p>
          </div>
        )}


        {/* All tools */}
        <div className="grid grid-cols-4 gap-2">
          <Tile to="/breathe" label="Breathe" icon={<Wind className="size-4" />} tone="text-flow bg-flow-soft" />
          <Tile to="/vent" label="Vent" icon={<MessageSquare className="size-4" />} tone="text-flow bg-flow-soft" />
          <Tile to="/journal" label="Shred" icon={<Trash2 className="size-4" />} tone="text-destructive bg-destructive/15" />
          <Tile to="/walk" label="Walk" icon={<Footprints className="size-4" />} tone="text-clay bg-clay/15" />
          <Tile to="/face" label="Face" icon={<ScanFace className="size-4" />} tone="text-ink bg-ink/10" />
          <Tile to="/learn" label="Learn" icon={<BookOpen className="size-4" />} tone="text-flow bg-flow-soft" />
          <Tile to="/techniques" label="Tips" icon={<Lightbulb className="size-4" />} tone="text-clay bg-clay/15" />
          <Tile to="/journal-prompts" label="Prompts" icon={<PenLine className="size-4" />} tone="text-ink bg-ink/10" />
          <Tile to="/cbt-anger-management" label="CBT" icon={<Brain className="size-4" />} tone="text-flow bg-flow-soft" />
          <Tile to="/settings" label="Settings" icon={<SettingsIcon className="size-4" />} tone="text-ink bg-ink/10" />
        </div>

        <p className="mt-auto text-center text-[11px] text-ink-light text-pretty">
          If you need professional advice, seek medical assistance.
        </p>
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
      className="bg-sand-50/60 p-2.5 rounded-[18px] border border-clay/20 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
    >
      <span className={`size-7 rounded-lg flex items-center justify-center ${tone}`}>{icon}</span>
      <span className="font-display font-bold text-ink text-xs">{label}</span>
    </Link>
  );
}
