import { supabase } from "@/integrations/supabase/client";

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

  if (error) throw new Error("Could not load check-ins.");
  return data;
}

export async function saveCheckIn(
  userId: string,
  level: number,
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("check_ins").upsert(
    {
      user_id: userId,
      date: today,
      level: Math.max(0, Math.min(10, level)),
    },
    { onConflict: "user_id,date" },
  );

  if (error) throw new Error("Could not save this check-in.");
}

export async function getJournalEntries(
  userId: string,
): Promise<CloudJournalEntry[]> {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, created_at, text")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Could not load journal entries.");
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
  const { error } = await supabase.from("journal_entries").insert({
    user_id: userId,
    text: text.trim(),
  });

  if (error) throw new Error("Could not save this journal entry.");
}

export async function clearUserData(userId: string): Promise<void> {
  const [journalResult, checkInResult] = await Promise.all([
    supabase.from("journal_entries").delete().eq("user_id", userId),
    supabase.from("check_ins").delete().eq("user_id", userId),
  ]);

  if (journalResult.error || checkInResult.error) {
    throw new Error("Could not clear your saved data.");
  }
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
