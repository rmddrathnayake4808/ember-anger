import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children, title, back = true }: { children: ReactNode; title?: string; back?: boolean }) {
  return (
    <div className="min-h-dvh w-full bg-sand-200 flex justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-[440px] bg-sand-100 rounded-[40px] sm:rounded-[48px] ring-[10px] sm:ring-[12px] ring-ink/10 overflow-hidden flex flex-col min-h-[calc(100dvh-3rem)] sm:min-h-[860px] relative shadow-[0_30px_60px_-20px_oklch(0.22_0.06_250/0.35)]">
        {(title || back) && (
          <div className="flex items-center justify-between px-6 pt-8 pb-4 shrink-0">
            {back ? (
              <Link
                to="/"
                className="size-10 rounded-full bg-sand-50 border border-sand-200/60 flex items-center justify-center text-ink-light hover:text-ink active:scale-95 transition-all"
                aria-label="Back to home"
              >
                <span className="text-lg">←</span>
              </Link>
            ) : (
              <span />
            )}
            {title && (
              <h1 className="font-display font-bold text-ink text-lg">{title}</h1>
            )}
            <span className="size-10" />
          </div>
        )}
        <div className="flex-1 flex flex-col min-h-0">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
