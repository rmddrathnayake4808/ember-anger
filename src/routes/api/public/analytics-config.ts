import { createFileRoute } from '@tanstack/react-router';

// Measurement IDs are public by nature (they appear in every page's HTML),
// so this public route simply exposes the configured ID to the browser.
export const Route = createFileRoute('/api/public/analytics-config')({
  server: {
    handlers: {
      GET: async () => {
        const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID ?? '';
        return Response.json({ measurementId });
      },
    },
  },
});
