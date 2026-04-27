import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/vent")({
  component: Vent,
});

function Vent() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(24).fill(0.2));
  const [error, setError] = useState<string | null>(null);
  const [released, setReleased] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close().catch(() => {});
    streamRef.current = null;
    ctxRef.current = null;
    analyserRef.current = null;
    setRecording(false);
  };

  useEffect(() => () => stop(), []);

  const start = async () => {
    setError(null);
    setReleased(false);
    setSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((s, v) => s + v, 0) / data.length / 255;
        setBars((prev) => [...prev.slice(1), Math.max(0.15, Math.min(1, avg * 1.8))]);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setRecording(true);
    } catch {
      setError("Microphone access blocked. You can still vent silently — speak it out, then tap Release.");
      setRecording(true);
      tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  };

  const release = () => {
    stop();
    setBars(Array(24).fill(0.2));
    setSeconds(0);
    setReleased(true);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <AppShell title="Voice Dump">
      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-16 pt-4">
        <p className="text-sm text-ink-light text-center text-pretty max-w-xs">
          Say everything. No filter. Nothing is recorded — your voice stays in this moment.
        </p>

        <div className="flex flex-col items-center gap-8">
          <div className="font-display font-extrabold text-6xl text-ink tabular-nums">
            {mm}:{ss}
          </div>

          <div className="h-32 w-72 flex items-center justify-center gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className={`w-2 rounded-full transition-all duration-100 ${
                  recording ? "bg-clay" : "bg-sand-300"
                }`}
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-ink-light text-center max-w-xs px-4">{error}</p>
          )}
          {released && !recording && (
            <p className="text-sm font-medium text-flow text-center max-w-xs">
              Released. Whatever you said is gone. Take a breath.
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-3">
          {!recording ? (
            <button
              onClick={start}
              className="w-full bg-clay text-sand-50 rounded-[28px] py-5 font-display font-extrabold text-lg shadow-[0_8px_0_var(--clay-dark)] active:translate-y-2 active:shadow-[0_0_0_var(--clay-dark)] transition-all"
            >
              {released ? "Vent Again" : "Start Venting"}
            </button>
          ) : (
            <button
              onClick={release}
              className="w-full bg-ink text-sand-50 rounded-[28px] py-5 font-display font-extrabold text-lg shadow-[0_8px_0_oklch(0.22_0.02_30)] active:translate-y-2 active:shadow-[0_0_0_oklch(0.22_0.02_30)] transition-all"
            >
              Release & Forget
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
