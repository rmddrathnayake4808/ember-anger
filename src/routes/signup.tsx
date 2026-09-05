import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { signInWithGoogle } from "@/lib/google-sign-in";
import { AuthScaffold, Field, Divider, GoogleIcon } from "@/routes/signin";

export const Route = createFileRoute("/signup")({
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: name || email.split("@")[0] },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/" });
    } else {
      setInfo("We sent a 6-digit code to your email.");
      navigate({ to: "/verify", search: { email } });
    }
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
      title="Create account"
      subtitle="A gentle space, just for you."
      footer={
        <p className="text-sm text-ink-light">
          Already have one?{" "}
          <Link to="/signin" className="font-display font-bold text-clay">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Name" value={name} onChange={setName} placeholder="What should we call you?" autoComplete="name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" required />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" autoComplete="new-password" required />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {info && <p className="text-sm font-medium text-flow">{info}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-clay text-sand-50 rounded-[24px] py-4 font-display font-extrabold text-lg shadow-[0_8px_0_var(--clay-dark)] active:translate-y-2 active:shadow-[0_0_0_var(--clay-dark)] transition-all disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Account"}
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
    </AuthScaffold>
  );
}
