// Local storage helpers for anger management app
const KEYS = {
  tension: "ac_tension_level",
  checkIns: "ac_check_ins",
  streak: "ac_streak",
  journal: "ac_journal_entries",
  name: "ac_user_name",
} as const;

export type CheckIn = { date: string; level: number };
export type JournalEntry = { id: string; createdAt: string; text: string };

export const storage = {
  getTension(): number {
    if (typeof window === "undefined") return 5;
    return Number(localStorage.getItem(KEYS.tension) ?? 5);
  },
  setTension(level: number) {
    localStorage.setItem(KEYS.tension, String(level));
    const today = new Date().toISOString().slice(0, 10);
    const list = storage.getCheckIns();
    const filtered = list.filter((c) => c.date !== today);
    filtered.push({ date: today, level });
    localStorage.setItem(KEYS.checkIns, JSON.stringify(filtered));
  },
  getCheckIns(): CheckIn[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(KEYS.checkIns) ?? "[]");
    } catch {
      return [];
    }
  },
  getStreak(): number {
    const list = storage.getCheckIns().sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < list.length; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const expected = d.toISOString().slice(0, 10);
      if (list[i]?.date === expected) streak++;
      else break;
    }
    return streak;
  },
  getName(): string {
    if (typeof window === "undefined") return "friend";
    return localStorage.getItem(KEYS.name) ?? "friend";
  },
  setName(name: string) {
    localStorage.setItem(KEYS.name, name);
  },
  getJournal(): JournalEntry[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(KEYS.journal) ?? "[]");
    } catch {
      return [];
    }
  },
  addJournal(text: string) {
    const list = storage.getJournal();
    list.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), text });
    localStorage.setItem(KEYS.journal, JSON.stringify(list.slice(0, 50)));
  },
  clearJournal() {
    localStorage.setItem(KEYS.journal, "[]");
  },
};
