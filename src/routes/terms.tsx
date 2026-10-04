import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Ember" },
      { name: "description", content: "The terms that govern your use of Ember, the calm anger-release companion." },
      { property: "og:title", content: "Terms of Service — Ember" },
      { property: "og:description", content: "The terms that govern your use of Ember, the calm anger-release companion." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ember-anger.lovable.app/terms" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Terms of Service — Ember" },
      { name: "twitter:description", content: "The terms that govern your use of Ember, the calm anger-release companion." },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="Last updated September 2026">
      <p>
        Ember is a self-help companion for noticing and releasing anger. It is not medical care, therapy, or
        crisis support. If you are in danger or thinking about harming yourself or others, contact local
        emergency services immediately.
      </p>
      <p>
        By creating an account you agree to use Ember lawfully, to keep your login details private, and to be
        responsible for the content you save in your check-ins, journal, and recordings.
      </p>
      <p>
        We may update or discontinue features over time. You can stop using Ember at any time, and you may ask
        us to delete your account and its data.
      </p>
      <p>
        Ember is provided “as is” without warranties. To the extent permitted by law, we are not liable for
        decisions you make based on the app’s readings or suggestions.
      </p>
    </LegalPage>
  );
}

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh w-full bg-sand-100 flex flex-col overflow-hidden">
      <div className="px-6 pt-10 pb-4 shrink-0">
        <Link to="/signup" className="text-xs font-bold uppercase tracking-widest text-ink-light">
          ← Back
        </Link>
        <h1 className="mt-3 font-display font-extrabold text-ink text-2xl tracking-tight">{title}</h1>
        <p className="text-ink-light text-xs mt-1">{updated}</p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-10 flex flex-col gap-4 text-sm leading-relaxed text-ink-light">
        {children}
      </div>
    </div>
  );
}
