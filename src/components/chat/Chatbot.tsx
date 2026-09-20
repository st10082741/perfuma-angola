/**
 * ================================================================
 * PERFUMA ANGOLA — AI CHATBOT USER INTERFACE
 * ================================================================
 *
 * Language: TypeScript + React (TSX)
 * Framework: React
 *
 * PURPOSE:
 * This component controls the customer-facing Perfuma Angola AI
 * assistant.
 *
 * It is responsible for:
 *
 * 1. Opening and closing the chatbot.
 * 2. Displaying the conversation.
 * 3. Sending customer messages to /api/chat.
 * 4. Receiving AI responses.
 * 5. Preserving recent conversational context.
 * 6. Supporting Portuguese and English.
 * 7. Falling back to local business answers if the AI API fails.
 * 8. Displaying a trusted WhatsApp CTA when purchase intent exists.
 *
 * SECURITY:
 * This component NEVER receives the GROQ_API_KEY.
 * AI provider communication happens securely through /api/chat.
 *
 * CUSTOMER JOURNEY:
 *
 * Customer
 *    ↓
 * React Chatbot
 *    ↓
 * /api/chat
 *    ↓
 * AI recommendation
 *    ↓
 * Optional purchase action
 *    ↓
 * WhatsApp
 * ================================================================
 */

import { useEffect, useMemo, useRef, useState } from "react";

import { Bot, ExternalLink, MessageCircle, Send, X } from "lucide-react";

import { useLanguage } from "../../i18n/LanguageContext";
import { localChatReply } from "../../utils/chatFallback";
import { chatbotWhatsAppUrl } from "../../utils/whatsapp";
import { perfumes } from "../../data/perfumes";

import type { Perfume } from "../../types/perfume";


/**
 * ================================================================
 * CHAT TYPES
 * ================================================================
 *
 * These interfaces describe the information stored by the chatbot.
 *
 * Keeping these structures typed allows TypeScript to warn us when
 * different parts of the application disagree about the expected data.
 */

/**
 * Represents an optional action attached to an assistant response.
 *
 * At present we support WhatsApp. This structure can later be expanded
 * with other safe actions without changing the basic message system.
 */
interface ChatAction {
  type: "whatsapp";

  /**
   * When available, this slug identifies the exact catalogue perfume
   * associated with the customer's purchase intent.
   */
  productSlug?: string;
}

/**
 * Represents one visible message in the conversation.
 *
 * Assistant messages may contain an action, while ordinary customer
 * messages contain only text.
 */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  action?: ChatAction;

  /**
   * Product cards are presentation metadata only.
   *
   * The AI does not provide image paths, prices or product URLs. We resolve
   * those details from the trusted local catalogue after reading the AI text.
   */
  suggestedProductSlugs?: string[];
}

/**
 * Represents the JSON response expected from /api/chat.
 */
interface ChatApiResponse {
  reply?: string;
  action?: ChatAction;
  activeProductSlug?: string;
  error?: string;
}

/**
 * ================================================================
 * CHATBOT COMPONENT
 * ================================================================
 */
export function Chatbot() {
  /**
   * `language` tells us whether the interface is currently PT or EN.
   *
   * `t` contains translated interface labels such as the welcome
   * message, placeholder, quick questions and loading text.
   */
  const { language, t } = useLanguage();

  /**
   * ---------------------------------------------------------------
   * WELCOME MESSAGE
   * ---------------------------------------------------------------
   *
   * useMemo recreates this object only when the translated welcome
   * text changes.
   */
  const welcome = useMemo<ChatMessage>(
    () => ({
      role: "assistant",
      content: t.chat.welcome,
    }),
    [t.chat.welcome],
  );

  /**
   * ---------------------------------------------------------------
   * COMPONENT STATE
   * ---------------------------------------------------------------
   *
   * React state allows the interface to remember information between
   * renders.
   */

  // Controls whether the floating chat window is visible.
  const [open, setOpen] = useState(false);

  // Stores the conversation currently visible to the visitor.
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);

  // Stores the text currently being typed into the input field.
  const [input, setInput] = useState("");

  // Prevents duplicate submissions while waiting for the AI.
  const [loading, setLoading] = useState(false);

  /**
   * Remembers the product currently being discussed during this browser
   * session. The server validates this slug against the trusted catalogue
   * before using it, so conversational references such as "esse" or a later
   * WhatsApp request can remain attached to the correct perfume.
   */
  const [activeProductSlug, setActiveProductSlug] = useState<string>();

  /**
   * ---------------------------------------------------------------
   * DOM REFERENCES
   * ---------------------------------------------------------------
   *
   * useRef gives React a safe reference to real HTML elements.
   */

  // Used to return keyboard focus to the message input.
  const fieldRef = useRef<HTMLInputElement>(null);

  // Invisible element placed at the bottom of the conversation.
  // Scrolling to it keeps the latest message visible automatically.
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * ================================================================
   * LANGUAGE SYNC FOR THE WELCOME MESSAGE
   * ================================================================
   *
   * The first assistant message is created when the chatbot loads.
   *
   * Without this effect, switching PT <-> EN would update interface
   * buttons but leave the existing welcome message in the old language.
   *
   * We replace it only while it is still the ONLY message.
   *
   * Once a real conversation starts, previous messages remain intact
   * and future AI responses follow the currently selected language.
   */
  useEffect(() => {
    setMessages((currentMessages) => {
      if (
        currentMessages.length === 1 &&
        currentMessages[0].role === "assistant"
      ) {
        return [
          {
            role: "assistant",
            content: t.chat.welcome,
          },
        ];
      }

      return currentMessages;
    });
  }, [language, t.chat.welcome]);

  /**
   * ================================================================
   * AUTOMATIC CONVERSATION SCROLLING
   * ================================================================
   *
   * Whenever:
   * - a new message appears;
   * - or the AI starts/stops thinking;
   *
   * the conversation gently scrolls to the newest content.
   *
   * This prevents customers from manually scrolling down after every
   * AI response.
   */
  useEffect(() => {
    if (!open) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, open]);

  /**
   * ================================================================
   * PRODUCT LOOKUP
   * ================================================================
   *
   * /api/chat may return a product slug with its WhatsApp action.
   *
   * The frontend then looks up that slug in the REAL local catalogue.
   *
   * This is safer than allowing the AI to manufacture:
   * - prices;
   * - product links;
   * - WhatsApp URLs.
   */
  function findProduct(productSlug?: string): Perfume | undefined {
    if (!productSlug) return undefined;

    return perfumes.find((perfume) => perfume.slug === productSlug);
  }

  /**
   * ================================================================
   * CHAT PRESENTATION HELPERS
   * ================================================================
   *
   * These helpers deliberately live in the frontend. They improve how an
   * already-approved AI response is DISPLAYED without changing the AI brain,
   * recommendation logic, product memory or WhatsApp action rules.
   */

  /**
   * Adds breathing room before a plain-text variant list and defensively
   * removes the duplicated "abaixo. abaixo." wording observed in production.
   */
  function formatAssistantDisplayText(text: string): string {
    return text
      .replace(/abaixo\.\s*abaixo\./gi, "abaixo.")
      .replace(/(variantes?:)\s*\n(?=\s*[•-])/gi, "$1\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  /**
   * Finds catalogue products explicitly named in the assistant's reply.
   *
   * IMPORTANT:
   * - This does NOT ask the AI to generate card data.
   * - Image, price, size and route always come from perfumes.ts.
   * - Generic names that are prefixes of a more specific matched product are
   *   removed. Example: "Ramz Lattafa Gold" must not also create the generic
   *   "Ramz Lattafa 30 ml" card merely because both contain "Ramz Lattafa".
   */
  function findSuggestedProducts(reply: string): Perfume[] {
    const normalizedReply = reply
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const matches = perfumes.filter((perfume) => {
      const normalizedName = perfume.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      return normalizedReply.includes(normalizedName);
    });

    const specificMatches = matches.filter((candidate) => {
      const candidateName = candidate.name.toLowerCase();

      return !matches.some(
        (other) =>
          other.slug !== candidate.slug &&
          other.name.toLowerCase().startsWith(candidateName) &&
          other.name.length > candidate.name.length,
      );
    });

    /**
     * A multi-variant availability answer can mention several products.
     * We keep that response as a clean text comparison rather than flooding
     * the compact chat window with multiple cards. Product cards are for the
     * focused recommendation/selection experience.
     */
    return specificMatches.length <= 2 ? specificMatches : [];
  }

  /**
   * Renders a compact catalogue-backed product recommendation.
   *
   * Opening the full product page in a new tab preserves the current chat
   * session in the original tab. No cart or database is introduced.
   */
  function renderSuggestedProducts(productSlugs?: string[]) {
    if (!productSlugs?.length) return null;

    const products = productSlugs
      .map((slug) => findProduct(slug))
      .filter((product): product is Perfume => Boolean(product));

    if (!products.length) return null;

    return (
      <div
        className="chat-product-recommendations"
        aria-label={
          language === "pt"
            ? "Produtos recomendados"
            : "Recommended products"
        }
      >
        {products.map((product) => (
          <article className="chat-product-card" key={product.slug}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
            />

            <div className="chat-product-card-content">
              <span className="chat-product-card-brand">{product.brand}</span>
              <strong>{product.name}</strong>

              <div className="chat-product-card-meta">
                <span>{product.size}</span>
                <span>{product.price.toLocaleString("pt-PT")} Kz</span>
              </div>

              <a
                href={`/perfume/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-product-card-link"
              >
                {language === "pt" ? "Ver produto" : "View product"}
                <ExternalLink size={12} />
              </a>
            </div>
          </article>
        ))}
      </div>
    );
  }


  /**
   * ================================================================
   * SEND A MESSAGE
   * ================================================================
   *
   * This is the main communication function between React and
   * the secure /api/chat serverless endpoint.
   *
   * `text` is optional because this function can be called from:
   *
   * 1. The normal text input.
   * 2. A quick-action question button.
   */
  async function send(text = input) {
    /**
     * Remove accidental spaces from the beginning/end.
     */
    const clean = text.trim();

    /**
     * Do nothing when:
     * - the message is empty;
     * - or another AI request is already running.
     */
    if (!clean || loading) return;

    /**
     * Add the customer's new message to the existing conversation.
     */
    const nextMessages: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        content: clean,
      },
    ];

    /**
     * Update the UI immediately.
     *
     * This makes the chat feel responsive instead of waiting for the
     * server before showing what the customer typed.
     */
    setMessages(nextMessages);

    // Clear the input after sending.
    setInput("");

    // Display the translated AI thinking/loading state.
    setLoading(true);

    try {
      /**
       * -------------------------------------------------------------
       * SEND THE REQUEST TO OUR OWN SERVER
       * -------------------------------------------------------------
       *
       * IMPORTANT:
       * The browser talks to `/api/chat`, NOT directly to Groq.
       *
       * This is how GROQ_API_KEY remains private.
       */
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          language,
          activeProductSlug,

          /**
           * Only recent role/content values are sent.
           *
           * UI-only information such as WhatsApp actions does not need
           * to be sent to the AI provider.
           */
          messages: nextMessages.slice(-8).map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      /**
       * Any non-success HTTP response activates the safe local fallback.
       */
      if (!response.ok) {
        throw new Error(`AI endpoint returned HTTP ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;

      /**
       * A successful HTTP request without an AI reply is still not a
       * valid chatbot response.
       */
      if (!data.reply?.trim()) {
        throw new Error("AI returned an empty response");
      }

      /**
       * Add the AI response AND its optional structured action.
       *
       * This is the key connection between:
       *
       * /api/chat
       *     ↓
       * Chatbot.tsx
       *     ↓
       * WhatsApp CTA
       */
      /**
       * Keep the trusted server-resolved product as session context.
       * This is deliberately separate from the visible AI text.
       */
      if (data.activeProductSlug && findProduct(data.activeProductSlug)) {
        setActiveProductSlug(data.activeProductSlug);
      } else if (data.action?.productSlug && findProduct(data.action.productSlug)) {
        setActiveProductSlug(data.action.productSlug);
      }

      const displayReply = formatAssistantDisplayText(data.reply!.trim());

      /**
       * Visual recommendations are intentionally suppressed on purchase
       * handoff messages. At that point the trusted WhatsApp CTA is the
       * primary action and we avoid cluttering the customer's next step.
       */
      const suggestedProducts = data.action
        ? []
        : findSuggestedProducts(displayReply);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: displayReply,
          action: data.action,
          suggestedProductSlugs: suggestedProducts.map(
            (product) => product.slug,
          ),
        },
      ]);
    } catch (error) {
      /**
       * -------------------------------------------------------------
       * LOCAL FALLBACK
       * -------------------------------------------------------------
       *
       * Standard Vite development does not automatically execute
       * Vercel serverless functions.
       *
       * The fallback also protects the customer experience if the AI
       * provider temporarily becomes unavailable.
       *
       * It can answer basic verified business/catalogue questions, but it
       * is NOT intended to replace the real conversational AI or manufacture
       * a WhatsApp handoff that the server did not approve.
       */
      console.error("Chatbot AI request failed:", error);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: localChatReply(clean, language),
        },
      ]);
    } finally {
      /**
       * Always remove the loading state, regardless of success/failure.
       */
      setLoading(false);

      /**
       * Give React a moment to update the DOM before returning keyboard
       * focus to the input field.
       */
      window.setTimeout(() => {
        fieldRef.current?.focus();
      }, 50);
    }
  }

  /**
   * ================================================================
   * WHATSAPP CTA RENDERER
   * ================================================================
   *
   * A WhatsApp button is rendered ONLY when the server explicitly
   * attaches a WhatsApp action to an assistant message.
   *
   * The AI itself does not construct this URL.
   */
  function renderAction(action?: ChatAction) {
    if (!action || action.type !== "whatsapp") {
      return null;
    }

    /**
     * If /api/chat identified a specific product, retrieve its real
     * catalogue object.
     *
     * If not, `product` remains undefined and whatsapp.ts creates a
     * general AI-conversation continuation message.
     */
    const product = findProduct(action.productSlug);

    /**
     * whatsapp.ts creates the trusted wa.me URL using storeConfig.
     */
    const url = chatbotWhatsAppUrl(language, product);

    /**
     * The visible button label follows the current interface language.
     */
    const label =
      language === "pt" ? "Continuar no WhatsApp" : "Continue on WhatsApp";

    return (
      <a
        className="chat-whatsapp-action"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        <MessageCircle size={16} />

        <span>{label}</span>

        <ExternalLink size={13} />
      </a>
    );
  }

  /**
   * ================================================================
   * USER INTERFACE
   * ================================================================
   *
   * Everything returned below is TSX:
   *
   * TSX allows us to describe HTML-like interface elements while
   * still using TypeScript and React logic.
   */
  return (
    <div className={`chatbot ${open ? "chatbot-open" : ""}`}>
      {open && (
        <section className="chat-panel" aria-label={t.chat.title}>
          {/* ======================================================
              CHAT HEADER
              Displays assistant identity, status and close button.
              ====================================================== */}
          <header className="chat-header">
            <div className="chat-avatar" aria-hidden="true">
              <Bot size={20} />
            </div>

            <div>
              <strong>{t.chat.title}</strong>
              <span>{t.chat.status}</span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.chat.close}
            >
              <X size={19} />
            </button>
          </header>

          {/* ======================================================
              CONVERSATION
              Messages are rendered in chronological order.
              ====================================================== */}
          <div className="chat-messages" aria-live="polite" aria-busy={loading}>
            {messages.map((message, index) => (
              <div
                /**
                 * The index is acceptable here because messages are
                 * appended and not reordered.
                 */
                key={index}
                className={`chat-message ${message.role}`}
              >
                <div className="chat-message-bubble">
                  {/*
                   * white-space: pre-wrap in CSS preserves intentional
                   * line breaks from the AI response.
                   */}
                  <p>{message.content}</p>
                </div>

                {/*
                 * Only assistant messages can display server-approved
                 * actions such as the WhatsApp continuation CTA.
                 */}

                {message.role === "assistant" &&
                  renderSuggestedProducts(message.suggestedProductSlugs)}

                {message.role === "assistant" && renderAction(message.action)}
              </div>
            ))}

            {/* ====================================================
                THINKING STATE
                Gives immediate feedback while waiting for /api/chat.
                ==================================================== */}
            {loading && (
              <div className="chat-message assistant">
                <div className="chat-message-bubble">
                  <p className="chat-thinking">{t.chat.thinking}</p>
                </div>
              </div>
            )}

            {/*
             * Invisible scroll target used by messagesEndRef.
             */}
            <div
              ref={messagesEndRef}
              className="chat-scroll-anchor"
              aria-hidden="true"
            />
          </div>

          {/* ======================================================
              QUICK QUESTIONS
              Useful shortcuts for customers who do not know what
              to ask the assistant first.
              ====================================================== */}
          <div
            className="chat-quick-actions"
            aria-label={
              language === "pt"
                ? "Sugestões de perguntas — deslize horizontalmente para ver mais"
                : "Suggested questions — swipe horizontally to see more"
            }
          >
            {t.chat.quick.map((question) => (
              <button
                type="button"
                key={question}
                onClick={() => void send(question)}
                disabled={loading}
              >
                {question}
              </button>
            ))}
          </div>

          {/* ======================================================
              MESSAGE FORM
              Customers can type a custom question here.
              ====================================================== */}
          <form
            className="chat-form"
            onSubmit={(event) => {
              /**
               * Prevent the browser from refreshing the entire page
               * when the form is submitted.
               */
              event.preventDefault();

              send();
            }}
          >
            <input
              ref={fieldRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              placeholder={t.chat.placeholder}
              maxLength={500}
              disabled={loading}
              autoComplete="off"
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

      {/* ==========================================================
          FLOATING CHAT LAUNCHER
          Remains visible while the main chat window is closed.
          ========================================================== */}
      <button
        type="button"
        className="chat-launcher"
        onClick={() => {
          setOpen((currentValue) => !currentValue);
        }}
        aria-label={open ? t.chat.close : t.chat.open}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={23} />}

        {!open && (
          <span>{language === "pt" ? "Precisa de ajuda?" : "Need help?"}</span>
        )}
      </button>
    </div>
  );
}
