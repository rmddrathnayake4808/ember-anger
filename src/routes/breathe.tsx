import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useRequireAuth } from "@/hooks/use-require-auth";

export const Route = createFileRoute("/breathe")({
  component: Breathe,
  head: () => ({
    meta: [
      { title: "Box Breathing — Ember: release anger calmly" },
      { name: "description", content: "Follow a guided 4-4-4-4 box breathing session to slow your heart rate and release anger calmly in the moment." },
      { property: "og:title", content: "Box Breathing — Ember: release anger calmly" },
      { property: "og:description", content: "Follow a guided 4-4-4-4 box breathing session to slow your heart rate and release anger calmly in the moment." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ember-anger.lovable.app/breathe" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Box Breathing — Ember: release anger calmly" },
      { name: "twitter:description", content: "Follow a guided 4-4-4-4 box breathing session to slow your heart rate and release anger calmly in the moment." },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/breathe" }],
  }),
});


type Phase = "in" | "hold1" | "out" | "hold2";
const PHASE_LABEL: Record<Phase, string> = {
  in: "Breathe in",
  hold1: "Hold",
  out: "Breathe out",
  hold2: "Rest",
};
const PHASE_NEXT: Record<Phase, Phase> = { in: "hold1", hold1: "out", out: "hold2", hold2: "in" };
const SECONDS = 4;

function Breathe() {
  useRequireAuth();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("in");
  const [count, setCount] = useState(SECONDS);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        setPhase((p) => {
          const next = PHASE_NEXT[p];
          if (p === "hold2") setCycles((x) => x + 1);
          return next;
        });
        return SECONDS;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setPhase("in");
    setCount(SECONDS);
    setCycles(0);
  };

  const scale =
    phase === "in" ? 1 : phase === "hold1" ? 1 : phase === "out" ? 0.55 : 0.55;
  const transitionMs = phase === "in" || phase === "out" ? SECONDS * 1000 : 200;

  return (
    <AppShell title="Box Breathing">
      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-4 pt-4">
        <div className="text-center max-w-xs">
          <p className="text-sm text-ink-light text-pretty">
            Inhale, hold, exhale, rest — each for four counts. Let your shoulders soften.
          </p>
        </div>

        <div className="relative size-72 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-clay/5" />
          <div className="absolute inset-6 rounded-full bg-clay/10" />
          <div
            className="size-56 rounded-full bg-linear-to-br from-clay to-clay-dark shadow-[0_20px_60px_-15px_oklch(0.585_0.135_38/0.55)] flex flex-col items-center justify-center text-sand-50"
            style={{
              transform: `scale(${running ? scale : 0.85})`,
              transition: `transform ${transitionMs}ms ease-in-out`,
            }}
          >
            <span className="font-display font-bold text-2xl">{PHASE_LABEL[phase]}</span>
            <span className="font-display font-extrabold text-6xl tabular-nums mt-1">
              {running ? count : "•"}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-5">
          <p className="text-sm font-bold text-ink-light tabular-nums">
            {cycles} cycle{cycles === 1 ? "" : "s"} complete
          </p>
          <div className="w-full flex gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className="flex-1 bg-clay text-sand-50 rounded-[28px] py-5 font-display font-extrabold text-lg shadow-[0_8px_0_var(--clay-dark)] active:translate-y-2 active:shadow-[0_0_0_var(--clay-dark)] transition-all"
            >
              {running ? "Pause" : "Begin"}
            </button>
            <button
              onClick={reset}
              className="bg-sand-50 text-ink border border-sand-200 rounded-[28px] px-6 font-display font-bold active:scale-95 transition-transform"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
