import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Wind, ScanFace, NotebookPen, Settings, BookOpen } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/breathe", label: "Breathe", icon: Wind },
  { to: "/face", label: "Face", icon: ScanFace },
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <nav className="pointer-events-auto w-full max-w-3xl flex items-center justify-between rounded-full border border-clay/20 bg-sand-50/80 backdrop-blur-2xl shadow-[0_10px_30px_-8px_oklch(0.12_0.06_245/0.45)] px-2 py-2 transition-all duration-300">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                active
                  ? "bg-clay text-sand-50 px-3 py-2.5 gap-1.5"
                  : "text-ink-light hover:text-ink px-2.5 py-2.5"
              }`}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`size-5 shrink-0 ${active ? "stroke-[2.5]" : ""}`} />
              {active && (
                <span className="text-xs font-bold tracking-tight whitespace-nowrap max-w-0 overflow-hidden animate-[navlabel_0.3s_ease_forwards]">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
