import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useRequireAuth } from "@/hooks/use-require-auth";

export const Route = createFileRoute("/vent")({
  component: Vent,
  head: () => ({
    meta: [
      { title: "Voice Vent — Ember: release anger calmly" },
      { name: "description", content: "Say what you need out loud and watch it fade. Ember's voice vent records nothing, so you can release anger privately and calmly." },
      { property: "og:title", content: "Voice Vent — Ember: release anger calmly" },
      { property: "og:description", content: "Say what you need out loud and watch it fade. Ember's voice vent records nothing, so you can release anger privately and calmly." },
      { property: "og:url", content: "https://ember-anger.lovable.app/vent" },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/vent" }],
  }),
});


function Vent() {
  const { user, loading } = useRequireAuth();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(24).fill(0.2));
  const [error, setError] = useState<string | null>(null);
  const [released, setReleased] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [clipUrl, setClipUrl] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stop = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    recorderRef.current = null;
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
    // Never request microphone access before auth is confirmed
    if (loading || !user) return;
    setError(null);
    setReleased(false);
    setSeconds(0);
    if (clipUrl) URL.revokeObjectURL(clipUrl);
    setClipUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stream.getAudioTracks().forEach((t) => (t.enabled = micOn));

      if (typeof MediaRecorder !== "undefined") {
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          if (!chunksRef.current.length) return;
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
          chunksRef.current = [];
          setClipUrl(URL.createObjectURL(blob));
        };
        recorder.start();
        recorderRef.current = recorder;
      }
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

  const toggleMic = () => {
    const next = !micOn;
    setMicOn(next);
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
  };

  const discardClip = () => {
    if (clipUrl) URL.revokeObjectURL(clipUrl);
    setClipUrl(null);
    setReleased(false);
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
          Say everything. No filter. Your recording stays on this device — keep it or delete it.
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
          <button
            type="button"
            onClick={toggleMic}
            aria-pressed={micOn}
            aria-label={micOn ? "Turn microphone off" : "Turn microphone on"}
            className={`w-full flex items-center justify-between rounded-[24px] border px-4 py-3 text-xs font-bold transition-colors ${
              micOn
                ? "bg-flow-soft text-flow border-flow/30"
                : "bg-sand-50 text-ink-light border-sand-200/60"
            }`}
          >
            <span className="flex items-center gap-2">
              {micOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
              Microphone {micOn ? "on" : "off"}
            </span>
            <span
              className={`relative h-5 w-9 rounded-full transition-colors ${micOn ? "bg-flow" : "bg-sand-300"}`}
            >
              <span
                className={`absolute top-0.5 size-4 rounded-full bg-sand-50 transition-all ${
                  micOn ? "left-[1.125rem]" : "left-0.5"
                }`}
              />
            </span>
          </button>

          {clipUrl && !recording && (
            <div className="flex items-center gap-2 rounded-[24px] bg-sand-50 border border-sand-200/60 px-3 py-2">
              <audio src={clipUrl} controls className="h-8 flex-1 min-w-0" />
              <button
                type="button"
                onClick={discardClip}
                aria-label="Delete recording"
                className="size-9 shrink-0 rounded-full bg-clay/10 text-clay flex items-center justify-center active:scale-95 transition-transform"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )}

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
