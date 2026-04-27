import { useEffect } from "react";
import { applyTheme, getStoredTheme } from "@/lib/theme";

/**
 * Applies stored theme on mount and follows device theme when in "system" mode.
 * Updates <meta name="theme-color"> to match the current background.
 */
export function useSystemTheme() {
  useEffect(() => {
    const mode = getStoredTheme();
    applyTheme(mode);

    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
}
