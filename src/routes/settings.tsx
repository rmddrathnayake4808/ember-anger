import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { getStoredTheme, setStoredTheme, type ThemeMode } from "@/lib/theme";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setName(data.display_name);
      });
  }, [user]);

  const onTheme = (mode: ThemeMode) => {
    setTheme(mode);
    setStoredTheme(mode);
  };

  const saveName = async () => {
    if (!user || !name.trim()) return;
    setSavingName(true);
    await supabase.from("profiles").upsert({ id: user.id, display_name: name.trim() });
    setSavingName(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/signin" });
  };

  return (
    <AppShell title="Settings">
      <div className="flex-1 px-6 pb-4 flex flex-col gap-3 min-h-0">
        {/* Profile */}
        <Section title="Profile">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-clay/15 border border-clay/25 flex items-center justify-center">
              <span className="font-display font-extrabold text-clay text-lg">
                {(name || user?.email || "?").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-bold text-ink text-sm truncate">{name || "—"}</span>
              <span className="text-[10px] text-ink-light truncate">{user?.email}</span>
            </div>
          </div>

          <label className="flex flex-col gap-1.5 mt-1">
            <span className="text-[10px] font-bold text-ink-light uppercase tracking-widest">Display name</span>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="flex-1 bg-sand-50 border border-sand-200 rounded-[16px] px-3 py-2.5 text-sm text-ink outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-all"
              />
              <button
                onClick={saveName}
                disabled={savingName}
                className="bg-clay text-sand-50 rounded-[16px] px-4 text-sm font-display font-bold active:scale-95 transition-transform disabled:opacity-50"
              >
                {savedFlash ? "✓" : "Save"}
              </button>
            </div>
          </label>
        </Section>

        {/* Theme */}
        <Section title="Appearance">
          <p className="text-xs text-ink-light text-pretty">
            Choose how Ember looks on your device.
          </p>
          <div className="grid grid-cols-3 gap-2 bg-sand-200/60 p-1.5 rounded-[18px]">
            {(["system", "light", "dark"] as ThemeMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onTheme(m)}
                className={`py-2.5 rounded-[12px] text-xs font-display font-bold capitalize transition-all ${
                  theme === m
                    ? "bg-sand-50 text-ink shadow-[0_2px_8px_oklch(0.32_0.03_30/0.1)]"
                    : "text-ink-light hover:text-ink"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <ThemePreview mode="system" />
            <ThemePreview mode="light" />
            <ThemePreview mode="dark" />
          </div>
        </Section>

        {/* Account */}
        <Section title="Account">
          <Link
            to="/"
            className="block w-full text-center bg-sand-50 text-ink border border-sand-200 rounded-[18px] py-3 text-sm font-display font-bold active:scale-[0.98] transition-transform"
          >
            Back to Ember
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full bg-ink text-sand-50 rounded-[18px] py-3 text-sm font-display font-bold active:scale-[0.98] transition-transform"
          >
            Sign Out
          </button>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-sand-50 rounded-[28px] p-5 border border-sand-200/60 flex flex-col gap-4">
      <h2 className="font-display font-bold text-ink text-base">{title}</h2>
      {children}
    </section>
  );
}

function ThemePreview({ mode }: { mode: ThemeMode }) {
  const styles =
    mode === "light"
      ? { bg: "#F2ECE7", fg: "#B0553B", border: "#E3D9D1" }
      : mode === "dark"
        ? { bg: "#1F1814", fg: "#C97557", border: "#3A2F2A" }
        : { bg: "linear-gradient(135deg,#F2ECE7 50%, #1F1814 50%)", fg: "#B0553B", border: "#E3D9D1" };
  return (
    <div
      className="aspect-[4/3] rounded-[16px] border flex items-end justify-start p-2"
      style={{ background: styles.bg, borderColor: styles.border }}
    >
      <div className="size-3 rounded-full" style={{ background: styles.fg }} />
    </div>
  );
}
