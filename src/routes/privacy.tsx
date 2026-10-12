import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "./terms";

const D = "How Ember handles your account, check-ins, journal entries, recordings, and chat messages.";
export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ember" },
      { name: "description", content: D },
      { property: "og:title", content: "Privacy Policy — Ember" },
      { property: "og:description", content: D },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://ember-anger.lovable.app/privacy" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy — Ember" },
      { name: "twitter:description", content: D },
    ],
    links: [{ rel: "canonical", href: "https://ember-anger.lovable.app/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="Last updated October 2026">
      <p>We collect only what Ember needs: your email, display name, and the chat messages you send to the emotion companion, stored securely in your account and visible only to you.</p>
      <p>Tension check-ins and journal entries stay on your device and are erased when you sign out. Voice recordings are never uploaded and disappear when you leave the screen.</p>
      <p>Face Check photos are sent once for analysis and are not stored. Chat messages and photos are processed by an AI provider solely to generate responses.</p>
      <p>We use Google Analytics to understand anonymous app usage. We never sell your data.</p>
      <p>You can clear your chat history in the app at any time, or ask us to delete your account and all associated data.</p>
    </LegalPage>
  );
}
