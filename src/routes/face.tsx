import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, RefreshCw, ScanFace, SwitchCamera, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { storage } from "@/lib/storage";
import { analyzeFaceEmotion } from "@/lib/emotion.functions";
import type { FaceReading } from "@/lib/emotion.server";

export const Route = createFileRoute("/face")({
  head: () => ({
    meta: [
      { title: "Face Check — Ember: release anger calmly" },
      {
        name: "description",
        content:
          "Track tension, breathe through triggers, vent privately, and journal to understand anger. Ember turns intense moments into calm action.",
      },
      { property: "og:title", content: "Face Check — Ember: release anger calmly" },
      {
        property: "og:description",
        content:
          "Track tension, breathe through triggers, vent privately, and journal to understand anger. Ember turns intense moments into calm action.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FaceCheck,
});

function FaceCheck() {
  const { user, loading } = useRequireAuth();
  const analyze = useServerFn(analyzeFaceEmotion);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [shot, setShot] = useState<string | null>(null);
  const [reading, setReading] = useState<FaceReading | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  useEffect(() => stopCamera, []);

  const openStream = async (mode: "user" | "environment") => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: mode }, width: { ideal: 640 }, height: { ideal: 640 } },
      audio: false,
    });
    streamRef.current = stream;
    setFacing(mode);
    setCameraOn(true);
    requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        void videoRef.current.play();
      }
    });
  };

  const startCamera = async () => {
    if (loading || !user) return;
    setError(null);
    setReading(null);
    setShot(null);
    setSaved(false);
    try {
      await openStream(facing);
    } catch {
      setError("Camera access was blocked. You can upload a photo instead.");
    }
  };

  const flipCamera = async () => {
    const next = facing === "user" ? "environment" : "user";
    try {
      await openStream(next);
    } catch {
      setError("Couldn't switch camera — this device may only have one.");
      try {
        await openStream(facing);
      } catch {
        setCameraOn(false);
      }
    }
  };

  const runReading = async (dataUrl: string) => {
    setShot(dataUrl);
    setReading(null);
    setSaved(false);
    setBusy(true);
    setError(null);
    try {
      const result = await analyze({ data: { image: dataUrl } });
      setReading(result);
      if (!result.faceDetected) setError("No clear face found. Try better light and face the camera.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong reading that photo.");
    } finally {
      setBusy(false);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (facing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      video,
      (video.videoWidth - size) / 2,
      (video.videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    stopCamera();
    void runReading(canvas.toDataURL("image/jpeg", 0.82));
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 6_000_000) {
      setError("That image is too large. Please pick one under 6 MB.");
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      if (typeof fr.result === "string") void runReading(fr.result);
    };
    fr.readAsDataURL(file);
  };

  const applyToCheckIn = () => {
    if (!reading) return;
    storage.setTension(reading.angerLevel);
    setSaved(true);
  };

  const reset = () => {
    stopCamera();
    setShot(null);
    setReading(null);
    setError(null);
    setSaved(false);
  };

  return (
    <AppShell title="Face Check">
      <div className="flex-1 px-6 pb-4 flex flex-col gap-3 min-h-0">
        <section className="bg-sand-50 rounded-[24px] p-4 border border-sand-200/60 flex items-start gap-3">
          <div className="size-9 rounded-full bg-flow-soft text-flow flex items-center justify-center shrink-0">
            <ScanFace className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="font-display font-bold text-ink text-sm">Read your expression</h2>
            <p className="text-[10px] text-ink-light text-pretty leading-snug">
              One photo, ranked emotions, and a tension level for your check-in. Nothing is stored.
            </p>
          </div>
        </section>

        <div className="relative h-48 w-full rounded-[28px] overflow-hidden bg-sand-200 border border-sand-200/60 flex items-center justify-center shrink-0">
          {cameraOn ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className={`size-full object-cover ${facing === "user" ? "-scale-x-100" : ""}`}
              aria-label="Camera preview"
            />
          ) : shot ? (
            <img src={shot} alt="Captured face" className="size-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink-light px-8 text-center">
              <ScanFace className="size-8 opacity-60" />
              <p className="text-[10px] font-medium text-pretty">
                Face a soft light and keep your whole face in frame.
              </p>
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-sand-50/25">
                <div className="h-full w-1/3 rounded-full bg-sand-50 animate-[loading-slide_1.1s_ease-in-out_infinite]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sand-50/85">Reading…</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          {cameraOn ? (
            <button
              type="button"
              onClick={capture}
              className="w-full bg-clay text-sand-50 rounded-[24px] py-3.5 font-display font-extrabold text-base shadow-[var(--shadow-press)] active:translate-y-1 active:shadow-[var(--shadow-press-active)] transition-all flex items-center justify-center gap-2"
            >
              <Camera className="size-4" /> Capture
            </button>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              disabled={busy}
              className="w-full bg-clay text-sand-50 rounded-[24px] py-3.5 font-display font-extrabold text-base shadow-[var(--shadow-press)] active:translate-y-1 active:shadow-[var(--shadow-press-active)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Camera className="size-4" /> {shot ? "Retake photo" : "Open camera"}
            </button>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="flex-1 bg-sand-50 text-ink rounded-[20px] py-3 text-xs font-bold border border-sand-200/60 active:scale-[0.98] transition-transform disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              <Upload className="size-3.5" /> Upload
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="flex-1 bg-sand-50 text-ink-light rounded-[20px] py-3 text-xs font-bold border border-sand-200/60 active:scale-[0.98] transition-transform disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="size-3.5" /> Reset
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        {error && (
          <p className="text-[10px] font-medium text-clay bg-clay/10 border border-clay/20 rounded-xl px-3 py-2 text-pretty">
            {error}
          </p>
        )}

        {reading?.faceDetected && (
          <section className="flex-1 min-h-0 bg-sand-50 rounded-[24px] p-4 border border-sand-200/60 flex flex-col gap-3">
            <div className="flex items-end justify-between shrink-0">
              <h3 className="font-display font-bold text-ink text-sm">Emotion ranking</h3>
              <span className="text-xs font-bold text-clay tabular-nums">Tension {reading.angerLevel}</span>
            </div>

            <ol className="flex flex-col gap-2 overflow-hidden">
              {reading.ranking.map((row, i) => (
                <li key={row.emotion} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-ink capitalize">
                      {i + 1}. {row.emotion}
                    </span>
                    <span className="text-[10px] font-bold text-ink-light tabular-nums">{row.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-sand-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${i === 0 ? "bg-clay" : "bg-flow/70"}`}
                      style={{ width: `${Math.max(row.score, 3)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>

            {reading.note && (
              <p className="text-xs font-medium text-ink-light text-pretty border-t border-sand-200/60 pt-2 shrink-0">
                {reading.note}
              </p>
            )}

            <button
              type="button"
              onClick={applyToCheckIn}
              disabled={saved}
              className="w-full mt-auto bg-ink text-sand-50 rounded-[20px] py-3 text-xs font-bold active:scale-[0.98] transition-transform disabled:opacity-70 shrink-0"
            >
              {saved ? "Saved to today's check-in" : `Set today's tension to ${reading.angerLevel}`}
            </button>
          </section>
        )}
      </div>
    </AppShell>
  );
}
