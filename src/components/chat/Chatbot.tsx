import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { localChatReply } from "../../utils/chatFallback";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * =========================================================
 * PERFUMA AI CHAT WIDGET
 * =========================================================
 * The browser never receives the AI provider secret key.
 * Messages are sent to `/api/chat`, a Vercel serverless function that keeps the
 * GROQ_API_KEY securely on the server. No database is required: recent chat
 * history is sent with each request and exists only in the visitor's browser.
 */
export function Chatbot() {
  const { language, t } = useLanguage();
  const welcome = useMemo<ChatMessage>(
    () => ({ role: "assistant", content: t.chat.welcome }),
    [t.chat.welcome],
  );
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fieldRef = useRef<HTMLInputElement>(null);

  /**
   * LANGUAGE SYNC FOR THE WELCOME MESSAGE
   * -------------------------------------
   * The first assistant message is created when the chatbot loads. Without this
   * effect, changing PT <-> EN updates the buttons and labels but leaves that
   * already-created welcome message in the old language.
   *
   * We only replace the welcome message while it is still the only message.
   * Once the customer has started a conversation, we preserve the history and
   * simply let future replies follow the newly selected language.
   */
  useEffect(() => {
    setMessages((currentMessages) => {
      if (
        currentMessages.length === 1 &&
        currentMessages[0].role === "assistant"
      ) {
        return [{ role: "assistant", content: t.chat.welcome }];
      }

      return currentMessages;
    });
  }, [language, t.chat.welcome]);

  async function send(text = input) {
    const clean = text.trim();
    if (!clean || loading) return;

    const nextMessages = [
      ...messages,
      { role: "user" as const, content: clean },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, messages: nextMessages.slice(-8) }),
      });

      if (!response.ok) throw new Error("AI endpoint unavailable");
      const data = await response.json();
      if (!data.reply) throw new Error("Empty AI response");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      // Local Vite development does not run Vercel API functions by default.
      // Falling back keeps important business FAQs usable while developing.
      setMessages((current) => [
        ...current,
        { role: "assistant", content: localChatReply(clean, language) },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => fieldRef.current?.focus(), 50);
    }
  }

  return (
    <div className={`chatbot ${open ? "chatbot-open" : ""}`}>
      {open && (
        <section className="chat-panel" aria-label={t.chat.title}>
          <header className="chat-header">
            <div className="chat-avatar">
              <Bot size={20} />
            </div>
            <div>
              <strong>{t.chat.title}</strong>
              <span>{t.chat.status}</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.chat.close}>
              <X size={19} />
            </button>
          </header>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role}`}>
                <p>{message.content}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant">
                <p className="chat-thinking">{t.chat.thinking}</p>
              </div>
            )}
          </div>

          <div className="chat-quick-actions">
            {t.chat.quick.map((question) => (
              <button key={question} onClick={() => send(question)}>
                {question}
              </button>
            ))}
          </div>

          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <input
              ref={fieldRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.chat.placeholder}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={t.chat.send}
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        className="chat-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? t.chat.close : t.chat.open}
      >
        {open ? <X size={22} /> : <MessageCircle size={23} />}
        {!open && (
          <span>{language === "pt" ? "Precisa de ajuda?" : "Need help?"}</span>
        )}
      </button>
    </div>
  );
}
