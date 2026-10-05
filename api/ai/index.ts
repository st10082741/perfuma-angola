/**
 * ================================================================
 * PERFUMA ANGOLA — AI PROVIDER REGISTRY / SELECTOR
 * ================================================================
 *
 * Language/Technology: TypeScript
 * Layer: Server-side AI integration
 *
 * PURPOSE:
 * This file is the single selection point between Perfuma Angola and the
 * available AI provider adapters.
 *
 * Groq and Cloudflare Workers AI are currently registered. Additional provider
 * adapters can be added here without rewriting the catalogue, business rules,
 * conversation controller or React chatbot.
 * ================================================================
 */

import { groqProvider } from "./providers/groq.js";
import { cloudflareProvider } from "./providers/cloudflare.js";
import type {
  AIGenerationRequest,
  AIGenerationResult,
  AIProvider,
} from "./types.js";

/**
 * Provider registry.
 *
 * The key is the value expected in the `AI_PROVIDER` environment variable.
 * Adding a provider later is intentionally a small, visible change here.
 */
const providers: Record<string, AIProvider> = {
  groq: groqProvider,
  cloudflare: cloudflareProvider,
};

/**
 * Reads which provider should currently power the AI layer.
 *
 * Groq remains the safe default so existing deployments keep working even
 * before `AI_PROVIDER=groq` is added to Vercel.
 */
export function getAIProviderName(): string {
  return (process.env.AI_PROVIDER || "groq").trim().toLowerCase();
}

/**
 * Reads the optional backup provider.
 *
 * No fallback is assumed automatically. This means deployments must
 * explicitly configure AI_FALLBACK_PROVIDER before failover becomes active.
 * Keeping this environment-driven makes the provider order easy to change
 * later without modifying application business logic.
 */
function getAIFallbackProviderName(): string | undefined {
  const configuredName = process.env.AI_FALLBACK_PROVIDER?.trim().toLowerCase();

  return configuredName || undefined;
}

/** Resolve the configured adapter from our own provider registry. */
function getAIProvider(): AIProvider | undefined {
  return providers[getAIProviderName()];
}

/**
 * Generate one AI response using the configured provider chain.
 *
 * Every new customer message starts with the primary provider. If that
 * provider cannot produce a response, the optional fallback provider gets
 * one attempt using the EXACT SAME provider-neutral request and conversation
 * context.
 *
 * We deliberately do not retry the primary provider again during the same
 * request. This prevents primary -> fallback -> primary loops and keeps
 * failover predictable.
 */
export async function generateAIResponse(
  request: AIGenerationRequest,
): Promise<AIGenerationResult> {
  const primaryProviderName = getAIProviderName();
  const primaryProvider = getAIProvider();

  if (!primaryProvider) {
    return {
      ok: false,
      notConfigured: true,
      error: `Unsupported AI_PROVIDER: ${primaryProviderName}`,
    };
  }

  const primaryResult = await primaryProvider.generate(request);

  // Successful primary responses return immediately. No backup call is made.
  if (primaryResult.ok) {
    return primaryResult;
  }

  const fallbackProviderName = getAIFallbackProviderName();

  /**
   * Preserve the existing single-provider behaviour when no fallback has
   * been configured. Also prevent accidentally calling the same provider
   * twice if both environment variables contain the same name.
   */
  if (!fallbackProviderName || fallbackProviderName === primaryProviderName) {
    return primaryResult;
  }

  const fallbackProvider = providers[fallbackProviderName];

  /**
   * An invalid fallback configuration must not hide the original provider
   * failure. Returning the primary result preserves the existing safe
   * fallback behaviour in api/chat.ts.
   */
  if (!fallbackProvider) {
    return primaryResult;
  }

  /**
   * The same request is deliberately passed unchanged to the backup.
   * Therefore system instructions, PT/EN language context, catalogue
   * grounding and recent conversation history remain consistent even when
   * the external provider changes mid-conversation.
   */
  const fallbackResult = await fallbackProvider.generate(request);

  if (fallbackResult.ok) {
    return fallbackResult;
  }

  /**
   * Both providers failed. Return the final provider failure to the existing
   * chatbot controller, which already knows how to respond safely when AI is
   * temporarily unavailable.
   *
   * A new customer message will start from the primary provider again.
   */
  return fallbackResult;
}
