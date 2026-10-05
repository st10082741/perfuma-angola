/// <reference types="node" />

/**
 * ================================================================
 * PERFUMA ANGOLA — CLOUDFLARE WORKERS AI PROVIDER ADAPTER
 * ================================================================
 *
 * Language/Technology: TypeScript
 * Layer: Server-side external-service adapter
 * External service: Cloudflare Workers AI
 *
 * PURPOSE:
 * This file translates Perfuma Angola's STANDARD AI provider contract
 * (`api/ai/types.ts`) into Cloudflare Workers AI's vendor-specific
 * HTTP request and response format.
 *
 * ARCHITECTURE:
 * Perfuma Angola's chatbot and business logic communicate only with
 * the provider-neutral `AIProvider` interface.
 *
 * This adapter is responsible for:
 * - Reading Cloudflare-specific server environment variables.
 * - Translating Perfuma's conversation format to Cloudflare's format.
 * - Calling the Cloudflare Workers AI REST API.
 * - Normalizing Cloudflare responses and failures back into the
 *   standard `AIGenerationResult`.
 *
 * IMPORTANT:
 * Cloudflare-specific URLs, authentication, model configuration and
 * response parsing belong here — NOT in api/chat.ts or the React
 * chatbot.
 *
 * This separation allows Cloudflare to be added, replaced or removed
 * without rewriting Perfuma Angola's catalogue, conversation,
 * WhatsApp, product-card or business logic.
 * ================================================================
 */

import type {
  AIGenerationRequest,
  AIGenerationResult,
  AIProvider,
} from "../types.js";

/**
 * Minimal response structure needed from Cloudflare Workers AI.
 *
 * Keeping vendor-specific types inside this adapter prevents Cloudflare
 * response details from leaking into the rest of the application.
 */
interface CloudflareAIResponse {
  success?: boolean;

  result?: {
    choices?: Array<{
      message?: {
        content?: string;
      };
      finish_reason?: string;
    }>;
  };

  errors?: Array<{
    code?: number;
    message?: string;
  }>;

  messages?: Array<{
    code?: number;
    message?: string;
  }>;
}

/**
 * Cloudflare implementation of Perfuma Angola's AIProvider contract.
 *
 * The rest of the application can call this provider using exactly the
 * same request structure used for Groq, Gemini or future providers.
 */
export const cloudflareProvider: AIProvider = {
  name: "cloudflare",

  async generate(request: AIGenerationRequest): Promise<AIGenerationResult> {
    /**
     * Credentials remain server-side only.
     *
     * CLOUDFLARE_ACCOUNT_ID identifies the Cloudflare account.
     * CLOUDFLARE_API_TOKEN authenticates the Workers AI request.
     *
     * The model is environment-configurable so Perfuma Angola can change
     * Cloudflare models later without modifying application business logic.
     */
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const model = process.env.CLOUDFLARE_MODEL || "@cf/zai-org/glm-4.7-flash";

    /**
     * Missing credentials are normalized through the existing provider
     * contract instead of throwing an exception.
     *
     * This allows the provider selector to decide whether another provider
     * should be attempted.
     */
    if (!accountId || !apiToken) {
      return {
        ok: false,
        notConfigured: true,
        error:
          "CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN is not configured.",
      };
    }

    try {
      /**
       * Cloudflare's chat-compatible models accept role-based messages.
       *
       * Perfuma's system prompt is inserted first, followed by the existing
       * provider-neutral conversation history unchanged. This preserves
       * catalogue grounding, PT/EN instructions and conversational context.
       */
      const messages = [
        {
          role: "system",
          content: request.systemPrompt,
        },
        ...request.conversation,
      ];

      /**
       * Call the Cloudflare Workers AI REST endpoint directly.
       *
       * Using REST keeps the adapter lightweight and avoids introducing an
       * additional SDK dependency solely for this provider.
       *
       * IMPORTANT:
       * Cloudflare model identifiers such as "@cf/zai-org/glm-4.7-flash"
       * intentionally contain "/" path separators. The model identifier must
       * therefore remain intact when appended to the Workers AI route.
       *
       * The account ID is still URL-encoded because it is a single path segment.
       */
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(
          accountId,
        )}/ai/run/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            temperature: request.temperature,
            max_completion_tokens: request.maxCompletionTokens,
            chat_template_kwargs: {
              enable_thinking: false,
            },
          }),
        },
      );

      /**
       * Normalize Cloudflare rate limiting into the same flag used by the
       * other provider adapters.
       *
       * The provider selector can therefore react consistently without
       * understanding Cloudflare-specific HTTP behaviour.
       */
      if (response.status === 429) {
        return {
          ok: false,
          rateLimited: true,
          error: await response.text(),
        };
      }

      /**
       * Authentication, model availability, server errors and other
       * unsuccessful HTTP responses are returned through the standard
       * provider result instead of leaking provider-specific exceptions.
       */
      if (!response.ok) {
        return {
          ok: false,
          error: `HTTP ${response.status}: ${await response.text()}`,
        };
      }

      const data = (await response.json()) as CloudflareAIResponse;

      /**
       * GLM-4.7-Flash returns an OpenAI-compatible completion structure inside
       * Cloudflare's standard API envelope.
       *
       * Extract the first generated assistant message and trim it so the rest of
       * Perfuma Angola receives the same clean text format regardless of provider.
       */
      const content = data.result?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        /**
         * Keep diagnostics intentionally non-sensitive.
         *
         * We log only provider response metadata. Never log the API token,
         * system prompt, catalogue prompt or customer conversation.
         */
        console.warn("Cloudflare Workers AI returned no usable text.", {
          success: data.success ?? false,
          errorCount: data.errors?.length ?? 0,
          messageCount: data.messages?.length ?? 0,
          finishReason: data.result?.choices?.[0]?.finish_reason ?? "unknown",
        });

        const providerError = data.errors
          ?.map((error) => error.message)
          .filter(Boolean)
          .join("; ");

        return {
          ok: false,
          error:
            providerError ||
            "Cloudflare Workers AI returned an empty response.",
        };
      }

      /**
       * Convert the successful Cloudflare response into Perfuma Angola's
       * standard provider-neutral result.
       */
      return {
        ok: true,
        content,
      };
    } catch (error) {
      /**
       * Network failures and unexpected runtime errors are normalized here
       * so api/chat.ts never needs Cloudflare-specific error handling.
       */
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
