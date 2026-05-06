import { useEffect, useState } from "react";

export function WelcomeSplash() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("ac_splash_seen");
    if (seen) {
      setShow(false);
      return;
    }
    const fadeT = setTimeout(() => setFade(true), 2600);
    const hideT = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("ac_splash_seen", "1");
    }, 3000);
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
      <div className="size-24 rounded-[28px] bg-sand-50/95 flex items-center justify-center shadow-[0_20px_60px_-10px_oklch(0_0_0/0.5)] animate-[breathe-in_1.2s_ease-out]">
        <span className="font-display font-extrabold text-4xl bg-linear-to-br from-clay to-flow bg-clip-text text-transparent">
          E
        </span>
      </div>
      <h1 className="mt-6 font-display font-extrabold text-3xl text-sand-50 tracking-tight">
        Ember
      </h1>
      <p className="mt-2 text-sm text-sand-50/80 font-medium">
        A gentle space for anger
      </p>
    </div>
  );
}
