import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { signInWithGoogle } from "@/lib/google-sign-in";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — Ember" },
      {
        name: "description",
        content:
          "Sign in to Ember to track tension, practice breathing, vent privately, journal, and release anger calmly.",
      },
      { property: "og:title", content: "Sign In — Ember" },
      {
        property: "og:description",
        content:
          "Sign in to Ember to track tension, practice breathing, vent privately, journal, and release anger calmly.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ember-anger.lovable.app/signin" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Sign In — Ember" },
      {
        name: "twitter:description",
        content:
          "Sign in to Ember to track tension, practice breathing, vent privately, journal, and release anger calmly.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/signin" }],
  }),
  component: SignIn,
});

const GENDERS = ["Male", "Female", "Other"] as const;
const AGE_GROUPS = [
  "Child (6–10)",
  "Pre-teen / Tween (10–13)",
  "Teenager / Adolescent (13–18)",
  "Young Adult (18–40)",
  "Middle-aged Adult (40–60)",
  "Senior / Older Adult (60–90)",
  "Centenarian (90+)",
];

function SignIn() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anonOpen, setAnonOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/" });
  };

  const onAnon = async () => {
    if (!GENDERS.includes(gender as never) || !AGE_GROUPS.includes(ageGroup)) return;
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously({
      options: { data: { gender, age_group: ageGroup, display_name: "Guest" } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/" });
  };

  const onGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.redirected) navigate({ to: "/" });
    } catch (googleError) {
      setError(googleError instanceof Error ? googleError.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title="Welcome back"
      subtitle="Step into your quiet space."
      footer={
        <p className="text-sm text-ink-light">
          New here?{" "}
          <Link to="/signup" className="font-display font-bold text-clay">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" required />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" required />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-clay text-sand-50 rounded-[24px] py-4 font-display font-extrabold text-lg shadow-[0_8px_0_var(--clay-dark)] active:translate-y-2 active:shadow-[0_0_0_var(--clay-dark)] transition-all disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <Divider />

      <button
        onClick={onGoogle}
        disabled={loading}
        className="w-full bg-sand-50 text-ink border border-sand-200 rounded-[24px] py-4 font-display font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      {!anonOpen ? (
        <button
          type="button"
          onClick={() => setAnonOpen(true)}
          disabled={loading}
          className="w-full bg-transparent text-ink-light border border-dashed border-sand-200 rounded-[24px] py-3 font-display font-bold active:scale-[0.98] transition-transform"
        >
          Continue anonymously
        </button>
      ) : (
        <div className="flex flex-col gap-3 bg-sand-50 border border-sand-200 rounded-[20px] p-4">
          <span className="text-xs font-bold text-ink-light uppercase tracking-widest">Gender</span>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 rounded-full py-2 text-sm font-bold border transition-colors ${gender === g ? "bg-clay text-sand-50 border-clay" : "border-sand-200 text-ink"}`}
              >
                {g}
              </button>
            ))}
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold text-ink-light uppercase tracking-widest">Age group</span>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full bg-sand-100 border border-sand-200 rounded-[16px] px-4 py-3 text-ink outline-none focus:border-clay"
            >
              <option value="">Select…</option>
              {AGE_GROUPS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={onAnon}
            disabled={loading || !gender || !ageGroup}
            className="w-full bg-clay text-sand-50 rounded-[20px] py-3 font-display font-extrabold disabled:opacity-50"
          >
            {loading ? "Starting…" : "Start anonymously"}
          </button>
        </div>
      )}
    </AuthScaffold>
  );
}

export function AuthScaffold({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="h-dvh w-full bg-sand-100 flex flex-col overflow-hidden">
      <div className="flex flex-col flex-1 px-6 pt-10 pb-8 gap-6 min-h-0">
        <div className="flex flex-col gap-3 shrink-0">
          <div className="size-12 rounded-2xl bg-clay/15 border border-clay/25 flex items-center justify-center">
            <span className="font-display font-extrabold text-clay text-2xl">E</span>
          </div>
          <h1 className="font-display font-extrabold text-ink text-2xl tracking-tight">{title}</h1>
          <p className="text-ink-light text-sm">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">{children}</div>
        <div className="text-center shrink-0">{footer}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold text-ink-light uppercase tracking-widest">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full bg-sand-50 border border-sand-200 rounded-[20px] px-5 py-4 text-ink placeholder:text-ink-light/50 outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-all"
      />
    </label>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs font-bold text-ink-light/70 uppercase tracking-widest">
      <span className="flex-1 h-px bg-sand-200" />
      or
      <span className="flex-1 h-px bg-sand-200" />
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.7 6.7 2.7 12s4.1 9.5 9.3 9.5c5.4 0 8.9-3.8 8.9-9.1 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}
