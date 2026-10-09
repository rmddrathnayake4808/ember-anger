import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Ember's emotion companion inside a calm anger-management app.
You help the person understand, name and work through anger, frustration, irritation and the feelings underneath them.
Style: warm, brief, plain language. 2-4 short sentences or a tiny list. Never clinical or preachy.
Do: reflect what they feel, help name the emotion, ask one gentle question, and when useful suggest one of Ember's tools (Breathe, Vent, Journal, Walk, Face Check).
Don't: diagnose, moralise, or promise outcomes. You are not a therapist or crisis service.
If someone mentions self-harm, harming others, or an emergency, calmly encourage contacting local emergency services or a crisis line right away.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return new Response("Unauthorized", { status: 401 });

        const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          return new Response("Server not configured", { status: 500 });
        }

        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        const userId = userData?.user?.id;
        if (userError || !userId) return new Response("Unauthorized", { status: 401 });

        let body: { messages?: unknown };
        try {
          body = (await request.json()) as { messages?: unknown };
        } catch {
          return new Response("Invalid request body", { status: 400 });
        }
        const messages = body.messages;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }
        if (messages.length > 60) return new Response("Too many messages", { status: 400 });
        const uiMessages: UIMessage[] = [];
        for (const m of messages as Array<Record<string, unknown>>) {
          const role = m?.role;
          if (role !== "user" && role !== "assistant") return new Response("Invalid message role", { status: 400 });
          const parts = Array.isArray(m.parts) ? m.parts : [];
          const textParts = parts
            .filter((p: any) => p && p.type === "text" && typeof p.text === "string")
            .map((p: any) => ({ type: "text" as const, text: String(p.text).slice(0, 4000) }));
          if (textParts.length === 0) continue;
          uiMessages.push({ id: typeof m.id === "string" ? m.id.slice(0, 64) : crypto.randomUUID(), role, parts: textParts });
        }
        if (uiMessages.length === 0) return new Response("Messages are required", { status: 400 });

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured for this project yet.", { status: 500 });

        const latest = uiMessages[uiMessages.length - 1];
        if (latest?.role === "user") {
          const { error } = await supabase
            .from("chat_messages")
            .insert({ user_id: userId, role: "user", parts: latest.parts as never });
          if (error) console.error("Failed to save user chat message", error.message);
        }

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("openai/gpt-5-mini"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
          onFinish: async ({ responseMessage }) => {
            if (!responseMessage) return;
            const { error } = await supabase
              .from("chat_messages")
              .insert({ user_id: userId, role: "assistant", parts: responseMessage.parts as never });
            if (error) console.error("Failed to save assistant chat message", error.message);
          },
        });
      },
    },
  },
});
