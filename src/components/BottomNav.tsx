import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Wind, ScanFace, NotebookPen, Settings } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/breathe", label: "Breathe", icon: Wind },
  { to: "/face", label: "Face", icon: ScanFace },
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="shrink-0 border-t border-sand-200/60 bg-sand-50/95 backdrop-blur px-2 pt-2 pb-3 flex items-center justify-around">
      {items.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-2xl transition-all ${
              active ? "text-clay" : "text-ink-light hover:text-ink"
            }`}
            aria-label={label}
          >
            <Icon className={`size-5 ${active ? "stroke-[2.5]" : ""}`} />
            <span className={`text-[10px] font-bold tracking-wide ${active ? "" : "opacity-80"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
