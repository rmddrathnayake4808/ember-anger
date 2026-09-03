import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children, title, back = true }: { children: ReactNode; title?: string; back?: boolean }) {
  return (
    <div className="min-h-dvh w-full bg-sand-100 flex flex-col">
      {(title || back) && (
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
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
  );
}
