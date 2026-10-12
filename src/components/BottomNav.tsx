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
    <div className="shrink-0 px-4 pb-5 pt-2">
      <nav className="rounded-[2.25rem] border border-clay/25 bg-sand-50/80 backdrop-blur-xl shadow-[var(--shadow-card)] px-3 py-3 flex items-center justify-between">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-colors ${
                active ? "text-clay" : "text-ink-light hover:text-ink"
              }`}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`size-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              {active && <span className="absolute -bottom-1 size-1.5 rounded-full bg-clay" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
