import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/walk")({
  component: Walk,
});

const TOTAL = 10 * 60; // 10 minutes
const PROMPTS = [
  "Notice five things you can see.",
  "Feel your feet pressing into the ground.",
  "Match your steps to your breath.",
  "Listen for the furthest sound around you.",
  "Soften your jaw. Drop your shoulders.",
  "Notice the temperature on your skin.",
  "Walk a little slower than feels natural.",
  "Let your arms swing freely.",
  "Find one thing you hadn't noticed before.",
  "Thank your body for moving you.",
];

function Walk() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s >= TOTAL) {
          setRunning(false);
          return TOTAL;
        }
        return s + 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setSeconds(0);
  };

  const remaining = TOTAL - seconds;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = (seconds / TOTAL) * 100;
  const promptIndex = Math.min(PROMPTS.length - 1, Math.floor(seconds / 60));

  const done = seconds >= TOTAL;

  return (
    <AppShell title="Brisk Walk">
      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-16 pt-4">
        <p className="text-sm text-ink-light text-center text-pretty max-w-xs">
          Move your body for ten minutes. Anger is energy — let it travel out through your feet.
        </p>

        <div className="relative size-72 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--sand-200)" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--clay)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(pct * 2 * Math.PI * 44) / 100} ${2 * Math.PI * 44}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="flex flex-col items-center justify-center text-ink">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-light">
              {done ? "Complete" : running ? "Walking" : "Ready"}
            </span>
            <span className="font-display font-extrabold text-6xl tabular-nums mt-1">
              {mm}:{ss}
            </span>
          </div>
        </div>

        <div className="bg-sand-50 rounded-[24px] border border-sand-200/60 px-5 py-4 max-w-xs text-center">
          <p className="text-xs font-bold text-ink-light uppercase tracking-widest mb-1">
            Focus
          </p>
          <p className="text-sm font-medium text-ink text-pretty">
            {done ? "Beautiful work. Notice how your body feels now." : PROMPTS[promptIndex]}
          </p>
        </div>

        <div className="w-full flex gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={done}
            className="flex-1 bg-clay text-sand-50 rounded-[28px] py-5 font-display font-extrabold text-lg shadow-[0_8px_0_var(--clay-dark)] active:translate-y-2 active:shadow-[0_0_0_var(--clay-dark)] transition-all disabled:opacity-50"
          >
            {running ? "Pause" : seconds > 0 ? "Resume" : "Start Walk"}
          </button>
          <button
            onClick={reset}
            className="bg-sand-50 text-ink border border-sand-200 rounded-[28px] px-6 font-display font-bold active:scale-95 transition-transform"
          >
            Reset
          </button>
        </div>
      </div>
    </AppShell>
  );
}
