import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircleHeart, X, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { clearChatHistory, loadChatHistory } from "@/lib/chat.functions";
import emberMark from "@/assets/ember-favicon.png";

const STARTERS = [
  "I snapped at someone today",
  "Why do small things set me off?",
  "Help me name what I'm feeling",
];

export function EmotionChat() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    [],
  );

  useEffect(() => {
    if (!open || !user || initial) return;
    let cancelled = false;
    loadChatHistory()
      .then((rows) => {
        if (!cancelled) setInitial(rows as unknown as UIMessage[]);
      })
      .catch(() => {
        if (!cancelled) setInitial([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, user, initial]);

  if (loading) return null;
  if (!user)
    return (
      <a
        href="/signin"
        className="fixed bottom-24 right-4 z-40 size-14 rounded-full bg-clay text-primary-foreground shadow-[0_12px_28px_-8px_var(--clay-dark)] ring-4 ring-sand-100/70 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Sign in to chat about your emotions"
      >
        <MessageCircleHeart className="size-6" />
      </a>
    );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 size-14 rounded-full bg-clay text-primary-foreground shadow-[0_12px_28px_-8px_var(--clay-dark)] ring-4 ring-sand-100/70 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Chat about your emotions"
      >
        <MessageCircleHeart className="size-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/40 backdrop-blur-sm">
          <button
            type="button"
            className="flex-1"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          />
          <div className="mx-auto h-[85dvh] w-full max-w-2xl rounded-t-[28px] border-t border-clay/25 bg-sand-100 flex flex-col overflow-hidden shadow-[0_-18px_50px_-24px_oklch(0.08_0.04_245/0.8)]">
            {initial === null ? (
              <div className="flex-1 flex items-center justify-center">
                <Shimmer>Opening your space...</Shimmer>
              </div>
            ) : (
              <ChatPanel
                initialMessages={initial}
                transport={transport}
                onClose={() => setOpen(false)}
                onCleared={() => setInitial([])}
                textareaRef={textareaRef}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ChatPanel({
  initialMessages,
  transport,
  onClose,
  onCleared,
  textareaRef,
}: {
  initialMessages: UIMessage[];
  transport: DefaultChatTransport<UIMessage>;
  onClose: () => void;
  onCleared: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, status } = useChat({
    id: "ember-emotion-chat",
    messages: initialMessages,
    transport,
    onError: (e) => {
      const message = e.message.toLowerCase();
      setError(
        message.includes("401") || message.includes("unauthorized")
          ? "Your session expired. Please sign in again."
          : message.includes("402") || message.includes("credits")
            ? "The companion is temporarily unavailable. Please try again later."
            : "I couldn't respond right now. Please try again.",
      );
    },
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    textareaRef.current?.focus();
  }, [textareaRef]);

  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status, textareaRef]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);
    setInput("");
    void sendMessage({ text: trimmed });
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const clearAll = async () => {
    try {
      await clearChatHistory();
      setMessages([]);
      onCleared();
    } catch {
      setError("Couldn't clear the chat — try again.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 px-5 py-3 border-b border-clay/20 shrink-0">
        <img src={emberMark} alt="" className="size-9 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-ink text-sm leading-tight">Emotion companion</p>
          <p className="text-[10px] text-ink-light">Talk through what you're feeling</p>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="size-9 rounded-full flex items-center justify-center text-ink-light hover:text-destructive active:scale-95 transition-all"
          aria-label="Clear conversation"
        >
          <Trash2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="size-9 rounded-full flex items-center justify-center text-ink-light hover:text-ink active:scale-95 transition-all"
          aria-label="Close chat"
        >
          <X className="size-5" />
        </button>
      </div>

      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="gap-3">
          {messages.length === 0 && (
            <div className="pt-6 text-center">
              <img src={emberMark} alt="" className="mx-auto size-14 rounded-2xl" />
              <p className="mt-3 font-display font-bold text-ink text-base">
                What's stirring right now?
              </p>
              <p className="mt-1 text-xs text-ink-light">
                Anything you say here stays in your account.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-2xl border border-clay/25 bg-sand-50/70 px-4 py-2.5 text-xs text-ink text-left active:scale-[0.98] transition-transform"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join("");
            if (!text) return null;
            return (
              <Message from={message.role} key={message.id}>
                {message.role === "assistant" ? (
                  <div className="text-sm text-ink leading-relaxed">
                    <MessageResponse>{text}</MessageResponse>
                  </div>
                ) : (
                  <MessageContent className="bg-clay text-primary-foreground text-sm">
                    {text}
                  </MessageContent>
                )}
              </Message>
            );
          })}

          {status === "submitted" && (
            <Shimmer className="text-sm">Thinking...</Shimmer>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="px-4 pb-4 pt-2 shrink-0">
        <PromptInput
          onSubmit={(_message, event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what happened..."
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  );
}
