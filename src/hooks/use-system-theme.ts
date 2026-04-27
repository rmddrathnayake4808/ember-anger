import { useEffect } from "react";

/**
 * Syncs the `dark` class on <html> with the device's color-scheme preference,
 * and updates the meta theme-color so the browser chrome (mobile address bar)
 * matches the current background.
 */
export function useSystemTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (isDark: boolean) => {
      root.classList.toggle("dark", isDark);
      // Read computed --background and reflect into <meta name="theme-color">
      const bg = getComputedStyle(root).getPropertyValue("--background").trim();
      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      if (bg) meta.content = bg;
    };

    apply(mq.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
}
