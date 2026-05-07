import { useEffect, useState } from "react";
import iconUrl from "@/assets/ember-app-icon.png";

export function WelcomeSplash() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("ac_splash_seen");
    if (seen) {
      setShow(false);
      return;
    }
    const fadeT = setTimeout(() => setFade(true), 900);
    const hideT = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("ac_splash_seen", "1");
    }, 1300);
    return () => {
      clearTimeout(fadeT);
      clearTimeout(hideT);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-linear-to-br from-clay via-ink to-flow transition-opacity duration-500 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={iconUrl}
        alt="Ember"
        width={112}
        height={112}
        className="size-28 rounded-[28px] shadow-[0_20px_60px_-10px_oklch(0_0_0/0.5)] animate-[breathe-in_1.2s_ease-out]"
      />
      <h1 className="mt-6 font-display font-extrabold text-3xl text-sand-50 tracking-tight">
        Ember
      </h1>
      <p className="mt-2 text-sm text-sand-50/80 font-medium">
        A gentle space for anger
      </p>
      <div className="mt-8 flex flex-col items-center gap-3" role="status" aria-label="Loading">
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-sand-50/15">
          <div className="h-full w-1/3 rounded-full bg-sand-50 animate-[loading-slide_1.1s_ease-in-out_infinite]" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-sand-50/70">
          Loading…
        </span>
      </div>
    </div>
  );
}
