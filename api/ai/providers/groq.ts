/**
 * ================================================================
 * PERFUMA ANGOLA — GROQ AI PROVIDER ADAPTER
 * ================================================================
 *
 * Language/Technology: TypeScript
 * Layer: Server-side external-service adapter
 * External service: Groq API
 *
 * PURPOSE:
 * This is the translator between Perfuma Angola's STANDARD AI contract
 * (`api/ai/types.ts`) and Groq's vendor-specific HTTP API.
 *
 * Perfuma Angola sends an `AIGenerationRequest`.
 * This adapter converts it to Groq's request format, calls Groq securely,
 * then converts Groq's response/errors back to `AIGenerationResult`.
 *
 * IMPORTANT:
 * Groq-specific URLs, model configuration, authorization and response parsing
 * belong here — NOT in the main chatbot controller. This is what makes Groq
 * replaceable later without rewriting Perfuma Angola's business logic.
 * ================================================================
 */

import type {
  AIGenerationRequest,
  AIGenerationResult,
  AIProvider,
} from "../types.js";

/** Minimal portion of Groq's JSON response that our application needs. */
interface GroqChatResponse {
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
}

/**
 * Groq implementation of our own AIProvider contract.
 *
 * Future providers implement the same interface in their own adapter file.
 */
export const groqProvider: AIProvider = {
  name: "groq",

  async generate(request: AIGenerationRequest): Promise<AIGenerationResult> {
    /**
     * Secrets are read only on the server. They are never sent to Chatbot.tsx
     * or exposed through VITE_ environment variables.
     */
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

    if (!apiKey) {
      return {
        ok: false,
        notConfigured: true,
        error: "GROQ_API_KEY is not configured.",
      };
    }

    try {
      /**
       * Translate our provider-neutral request into Groq's HTTP request.
       */
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: request.systemPrompt },
              ...request.conversation,
            ],
            temperature: request.temperature,
            max_completion_tokens: request.maxCompletionTokens,
          }),
        },
      );

      /**
       * Normalize rate limiting into a provider-independent flag. api/chat.ts
       * can therefore show the same graceful fallback for any future provider.
       */
      if (response.status === 429) {
        return {
          ok: false,
          rateLimited: true,
          error: await response.text(),
        };
      }

      if (!response.ok) {
        return {
          ok: false,
          error: `HTTP ${response.status}: ${await response.text()}`,
        };
      }

      const data = (await response.json()) as GroqChatResponse;
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        return {
          ok: false,
          error: "Provider returned an empty response.",
        };
      }

      /** Convert Groq's successful response back into our standard result. */
      return {
        ok: true,
        content,
        finishReason: data.choices?.[0]?.finish_reason,
      };
    } catch (error) {
      /** Network/runtime failures are also normalized for the controller. */
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
