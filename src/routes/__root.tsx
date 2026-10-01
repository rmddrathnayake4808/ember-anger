import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-context";
import { WelcomeSplash } from "@/components/WelcomeSplash";
import { lazy, Suspense, useEffect as useEffectRoot, useState as useStateRoot } from "react";
const EmotionChat = lazy(() => import("@/components/EmotionChat").then((m) => ({ default: m.EmotionChat })));
function ClientChat() {
  const [ready, setReady] = useStateRoot(false);
  useEffectRoot(() => setReady(true), []);
  return ready ? <Suspense fallback={null}><EmotionChat /></Suspense> : null;
}

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex h-dvh items-center justify-center bg-background px-4 overflow-hidden">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "google-site-verification", content: "Ry0KEq7Geifgqb-AtCoB-WfN2k6Qgrp9uIOhQl2B9_4" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ember — Release anger calmly" },
      { name: "description", content: "Track tension, breathe through triggers, vent privately, and journal to understand anger. Ember turns intense moments into calm action." },
      { name: "author", content: "Ember" },
      { property: "og:title", content: "Ember — Release anger calmly" },
      { property: "og:description", content: "Track tension, breathe through triggers, vent privately, and journal to understand anger. Ember turns intense moments into calm action." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Ember — Release anger calmly" },
      { name: "twitter:description", content: "Track tension, breathe through triggers, vent privately, and journal to understand anger. Ember turns intense moments into calm action." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0674dbd0-e28f-44ee-a131-1f13aff28226/id-preview-1e57e356--fc0cd371-660c-47d2-9af5-0a4a6ceb4952.lovable.app-1778068148211.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0674dbd0-e28f-44ee-a131-1f13aff28226/id-preview-1e57e356--fc0cd371-660c-47d2-9af5-0a4a6ceb4952.lovable.app-1778068148211.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preload", as: "image", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Outfit:wght@600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Ember",
          url: "https://ember-anger.lovable.app",
          description:
            "Track tension, breathe through triggers, vent privately, and journal to understand anger. Ember turns intense moments into calm action.",
          publisher: {
            "@type": "Organization",
            name: "Ember",
            url: "https://ember-anger.lovable.app",
            logo: {
              "@type": "ImageObject",
              url: "https://ember-anger.lovable.app/apple-touch-icon.png",
            },
          },
        }),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <WelcomeSplash />
      <Outlet />
      <ClientChat />
    </AuthProvider>
  );
}
