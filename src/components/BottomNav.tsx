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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <nav className="pointer-events-auto w-full max-w-3xl flex items-center justify-between gap-1 rounded-[2rem] border border-clay/15 bg-sand-50/70 backdrop-blur-2xl shadow-[0_8px_32px_-6px_oklch(0.12_0.06_245/0.35),inset_0_1px_1px_oklch(1_0_0/0.6)] px-2.5 py-2 transition-all duration-300 animate-[nav-rise_0.5s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center justify-center rounded-full transition-all duration-400 ease-out ${
                active
                  ? "bg-clay text-sand-50 px-3.5 py-2.5 gap-1.5 shadow-[0_4px_14px_-4px_var(--clay)]"
                  : "text-ink-light/80 hover:text-ink hover:bg-clay/8 px-2.5 py-2.5"
              }`}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`size-[18px] shrink-0 transition-transform duration-300 ${active ? "scale-110 stroke-[2.5]" : "group-hover:scale-105"}`} />
              {active && (
                <span className="text-[11px] font-bold tracking-tight whitespace-nowrap max-w-0 overflow-hidden opacity-0 animate-[navlabel_0.35s_ease_forwards]">
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
