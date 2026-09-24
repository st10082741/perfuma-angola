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
 * Today Groq is registered. In the future another adapter can be imported
 * and registered here without rewriting the catalogue, business rules,
 * conversation controller or React chatbot.
 * ================================================================
 */

import { groqProvider } from "./providers/groq.js";
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

/** Resolve the configured adapter from our own provider registry. */
function getAIProvider(): AIProvider | undefined {
  return providers[getAIProviderName()];
}

/**
 * Stable function used by api/chat.ts.
 *
 * Notice that the chat controller calls `generateAIResponse()` rather than
 * `requestGroq()`. That separation is the core of the provider-independent
 * architecture.
 */
export async function generateAIResponse(
  request: AIGenerationRequest,
): Promise<AIGenerationResult> {
  const provider = getAIProvider();

  if (!provider) {
    return {
      ok: false,
      notConfigured: true,
      error: `Unsupported AI_PROVIDER: ${getAIProviderName()}`,
    };
  }

  return provider.generate(request);
}
