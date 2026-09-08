import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type StoredChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: { type: string; text?: string }[];
};

export const loadChatHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StoredChatMessage[]> => {
    const { data, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, parts, created_at")
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      id: row.id,
      role: row.role === "assistant" ? "assistant" : "user",
      parts: (Array.isArray(row.parts) ? row.parts : []) as StoredChatMessage["parts"],
    }));
  });

export const clearChatHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
