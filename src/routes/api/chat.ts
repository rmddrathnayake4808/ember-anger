import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
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

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
        const userId = userData?.user?.id;
        if (userError || !userId) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as { messages?: unknown };
        const messages = body.messages;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }
        const uiMessages = messages as UIMessage[];

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured for this project yet.", { status: 500 });

        const latest = uiMessages[uiMessages.length - 1];
        if (latest?.role === "user") {
          const { error } = await supabaseAdmin
            .from("chat_messages")
            .insert({ user_id: userId, role: "user", parts: latest.parts as never });
          if (error) console.error("Failed to save user chat message", error.message);
        }

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3.8-flash"),
          system: SYSTEM_PROMPT,
          messages: convertToModelMessages(uiMessages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
          onFinish: async ({ responseMessage }) => {
            if (!responseMessage) return;
            const { error } = await supabaseAdmin
              .from("chat_messages")
              .insert({ user_id: userId, role: "assistant", parts: responseMessage.parts as never });
            if (error) console.error("Failed to save assistant chat message", error.message);
          },
        });
      },
    },
  },
});
