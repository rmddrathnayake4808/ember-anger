import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthScaffold, Field } from "@/routes/signin";

export const Route = createFileRoute("/verify")({
  validateSearch: (s: Record<string, unknown>) => ({
    email: typeof s.email === "string" ? s.email : "",
  }),
  head: () => ({
    meta: [
      { title: "Verify Email — Ember" },
      {
        name: "description",
        content:
          "Enter the 6-digit code sent to your email to verify your Ember account and start releasing anger calmly.",
      },
      { property: "og:title", content: "Verify Email — Ember" },
      {
        property: "og:description",
        content:
          "Enter the 6-digit code sent to your email to verify your Ember account and start releasing anger calmly.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ember-anger.lovable.app/verify" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/verify" }],
  }),
  component: Verify,
});

function Verify() {
  const navigate = useNavigate();
  const { email: initialEmail } = Route.useSearch();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) navigate({ to: "/" });
  };

  const onResend = async () => {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setError(null);
    setInfo(null);
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    if (error) setError(error.message);
    else setInfo("A new code is on its way.");
  };

  return (
    <AuthScaffold
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox."
      footer={
        <p className="text-sm text-ink-light">
          Wrong email?{" "}
          <Link to="/signup" className="font-display font-bold text-clay">
            Start over
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
          autoComplete="email"
          required
        />
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold text-ink-light uppercase tracking-widest">
            6-digit code
          </span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="••••••"
            required
            className="w-full bg-sand-50 border border-sand-200 rounded-[20px] px-5 py-4 text-ink text-center text-2xl font-display font-extrabold tracking-[0.5em] outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-all"
          />
        </label>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {info && <p className="text-sm font-medium text-flow">{info}</p>}
        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="w-full bg-clay text-sand-50 rounded-[24px] py-4 font-display font-extrabold text-lg shadow-[0_8px_0_var(--clay-dark)] active:translate-y-2 active:shadow-[0_0_0_var(--clay-dark)] transition-all disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify & Continue"}
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="text-sm font-bold text-clay hover:underline disabled:opacity-60"
        >
          {resending ? "Sending…" : "Resend code"}
        </button>
      </form>
    </AuthScaffold>
  );
}
