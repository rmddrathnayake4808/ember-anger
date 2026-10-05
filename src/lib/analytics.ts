// Loads Google Analytics (gtag.js) once, using the Measurement ID stored
// as a project secret and exposed via /api/public/analytics-config.
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let started = false;

export async function initAnalytics(): Promise<void> {
  if (started || typeof window === 'undefined') return;
  started = true;

  try {
    const res = await fetch('/api/public/analytics-config');
    if (!res.ok) return;
    const { measurementId } = (await res.json()) as { measurementId?: string };
    if (!measurementId) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => {
      window.dataLayer!.push(args);
    };
    gtag('js', new Date());
    gtag('config', measurementId);
  } catch {
    // Analytics is best-effort; never break the app over it.
  }
}
