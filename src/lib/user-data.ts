import { supabase } from "@/integrations/supabase/client";
import { appendCachedRow, cacheRows, getCachedRows, clearCachedTable } from "@/lib/offline-cache";

export type CloudJournalEntry = {
  id: string;
  createdAt: string;
  text: string;
};

export type CloudCheckIn = {
  date: string;
  level: number;
};

export async function getCheckIns(userId: string): Promise<CloudCheckIn[]> {
  const { data, error } = await supabase
    .from("check_ins")
    .select("date, level")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) {
    const cached = await getCachedRows<CloudCheckIn>("check_ins");
    if (cached.length > 0) return cached.sort((a, b) => b.date.localeCompare(a.date));
    throw new Error("Could not load check-ins.");
  }
  void cacheRows("check_ins", data as unknown as Record<string, unknown>[]);
  return data;
}

export async function saveCheckIn(
  userId: string,
  level: number,
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const row = { user_id: userId, date: today, level: Math.max(0, Math.min(10, level)) };
  const { error } = await supabase.from("check_ins").upsert(row, { onConflict: "user_id,date" });

  if (error) {
    void appendCachedRow("check_ins", row);
    return;
  }
  void appendCachedRow("check_ins", row);
}

export async function getJournalEntries(
  userId: string,
): Promise<CloudJournalEntry[]> {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, created_at, text")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    const cached = await getCachedRows<{ id: string; created_at: string; text: string }>("journal_entries");
    if (cached.length > 0) {
      return cached
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((entry) => ({ id: entry.id, createdAt: entry.created_at, text: entry.text }));
    }
    throw new Error("Could not load journal entries.");
  }
  void cacheRows("journal_entries", data as unknown as Record<string, unknown>[]);
  return data.map((entry) => ({
    id: entry.id,
    createdAt: entry.created_at,
    text: entry.text,
  }));
}

export async function addJournalEntry(
  userId: string,
  text: string,
): Promise<void> {
  const { data, error } = await supabase.from("journal_entries").insert({
    user_id: userId,
    text: text.trim(),
  }).select("id, created_at, text").single();

  if (error) throw new Error("Could not save this journal entry.");
  if (data) {
    void appendCachedRow("journal_entries", data as unknown as Record<string, unknown>);
  }
}

export async function clearUserData(userId: string): Promise<void> {
  const [journalResult, checkInResult] = await Promise.all([
    supabase.from("journal_entries").delete().eq("user_id", userId),
    supabase.from("check_ins").delete().eq("user_id", userId),
  ]);

  if (journalResult.error || checkInResult.error) {
    throw new Error("Could not clear your saved data.");
  }
  void clearCachedTable("journal_entries");
  void clearCachedTable("check_ins");
}

export function getCheckInStreak(checkIns: CloudCheckIn[]): number {
  const dates = new Set(checkIns.map((checkIn) => checkIn.date));
  let streak = 0;
  const today = new Date();

  for (let offset = 0; ; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const expected = date.toISOString().slice(0, 10);
    if (!dates.has(expected)) break;
    streak += 1;
  }

  return streak;
}
