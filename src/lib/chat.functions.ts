import { createServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const loadChatHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, parts, created_at")
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      id: row.id,
      role: row.role as "user" | "assistant",
      parts: (row.parts ?? []) as UIMessage["parts"],
    })) satisfies UIMessage[];
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
