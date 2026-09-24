/**
 * ================================================================
 * PERFUMA ANGOLA — AI PROVIDER CONTRACT
 * ================================================================
 *
 * Language/Technology: TypeScript
 * Layer: Server-side AI integration
 *
 * PURPOSE:
 * This file defines the STANDARD language that Perfuma Angola's backend
 * uses when talking to any AI provider adapter.
 *
 * IMPORTANT ARCHITECTURE IDEA:
 * `api/chat.ts` should not need to understand Groq-, OpenAI- or Gemini-
 * specific request/response formats. Instead, every provider adapter must
 * implement the `AIProvider` interface below.
 *
 * This is the contract that makes the AI layer replaceable and scalable.
 * ================================================================
 */

/** One recent customer/assistant message sent to the language model. */
export interface AIConversationMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Provider-neutral request created by Perfuma Angola.
 *
 * An adapter receives this shape and translates it into the external
 * provider's own API format. For example, groq.ts converts
 * `maxCompletionTokens` into Groq's `max_completion_tokens` field.
 */
export interface AIGenerationRequest {
  // Behaviour, language, catalogue and business grounding instructions.
  systemPrompt: string;

  // Recent conversation needed to understand follow-ups such as "that one".
  conversation: AIConversationMessage[];

  // Low values favour consistent business answers over creative variation.
  temperature: number;

  // Upper limit/headroom for the provider's generated completion.
  maxCompletionTokens: number;
}

/**
 * Provider-neutral result returned to api/chat.ts.
 *
 * Provider adapters normalize vendor-specific errors into these flags so the
 * main chatbot controller can react without knowing which vendor produced it.
 */
export interface AIGenerationResult {
  ok: boolean;
  content?: string;
  finishReason?: string;
  rateLimited?: boolean;
  notConfigured?: boolean;
  error?: string;
}

/**
 * Every current or future AI adapter MUST implement this interface.
 *
 * Example implementations:
 * - providers/groq.ts   -> Groq
 * - providers/openai.ts -> OpenAI (future)
 * - providers/gemini.ts -> Gemini (future)
 */
export interface AIProvider {
  readonly name: string;
  generate(request: AIGenerationRequest): Promise<AIGenerationResult>;
}
