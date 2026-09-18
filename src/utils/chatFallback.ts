import { perfumes } from "../data/perfumes";
import type { Language } from "../i18n/translations";

/**
 * =========================================================
 * LOCAL CHAT FALLBACK — BILINGUAL INTENT ROUTER
 * =========================================================
 * This file is NOT the real AI model.
 *
 * It exists so the chatbot can still answer important questions when:
 * - you are running the site with normal `npm run dev` (without Vercel API), or
 * - the AI provider is temporarily unavailable.
 *
 * IMPORTANT STRUCTURE:
 * Instead of checking one exact sentence, we detect an INTENT such as
 * PAYMENT, DELIVERY, STOCK or RECOMMENDATION. Each intent understands several
 * Portuguese and English expressions. This makes the fallback much less
 * fragile while keeping the logic easy to understand and edit.
 */

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The website language is a useful default, but the customer may type in the
 * other language. These common words help the fallback reply in the language
 * of the actual question whenever possible.
 */
function detectReplyLanguage(text: string, uiLanguage: Language): Language {
  const englishSignals =
    /\b(how|can|could|do|does|what|when|where|which|who|recommend|payment|pay|deliver|delivery|available|stock|price|cost|gift|men|women|sweet|fresh|strong|intense)\b/;
  const portugueseSignals =
    /\b(como|posso|pagar|pagamento|quando|onde|qual|quais|quem|recomenda|entrega|disponivel|stock|preco|custa|presente|homem|mulher|doce|fresco|intenso)\b/;

  if (englishSignals.test(text) && !portugueseSignals.test(text)) return "en";
  if (portugueseSignals.test(text) && !englishSignals.test(text)) return "pt";
  return uiLanguage;
}

function formatPrice(value: number) {
  return `${new Intl.NumberFormat("pt-AO").format(value)} Kz`;
}

function findMentionedPerfume(text: string) {
  return perfumes.find((perfume) => {
    const name = normalize(perfume.name);
    const slugWords = perfume.slug.replace(/-/g, " ");
    return text.includes(name) || text.includes(slugWords);
  });
}

/**
 * Fallback answers for the most important customer intents.
 * The real AI endpoint (/api/chat.ts) remains the primary intelligent layer.
 */
export function localChatReply(message: string, uiLanguage: Language) {
  const text = normalize(message);
  const language = detectReplyLanguage(text, uiLanguage);
  const pt = language === "pt";
  const mentionedPerfume = findMentionedPerfume(text);

  // ---------------------------------------------------------
  // PAYMENT INTENT
  // Covers: "Como posso pagar?", "How can I pay?", "payment methods?", etc.
  // ---------------------------------------------------------
  if (
    /\b(pag|pagar|pagamento|multicaixa|iban|transferencia|transfer|pay|payment|bank transfer|payment method|payment option)\b/.test(
      text,
    )
  ) {
    return pt
      ? "O pagamento pode ser feito por Multicaixa Express ou por IBAN/transferência bancária. Os dados de pagamento são confirmados diretamente com a Perfuma Angola antes da transferência."
      : "You can pay using Multicaixa Express or IBAN/bank transfer. Payment details are confirmed directly with Perfuma Angola before you make the transfer.";
  }

  // ---------------------------------------------------------
  // DELIVERY INTENT
  // ---------------------------------------------------------
  if (
    /\b(entrega|entregas|entregar|domingo|delivery|deliver|delivered|sunday)\b/.test(
      text,
    )
  ) {
    return pt
      ? "As entregas regulares da Perfuma Angola são feitas aos domingos. A zona e a taxa de entrega devem ser confirmadas antes de finalizar a encomenda."
      : "Perfuma Angola regular deliveries are made on Sundays. The delivery area and fee should be confirmed before the order is finalized.";
  }

  // ---------------------------------------------------------
  // SPECIFIC PRODUCT STOCK / PRICE
  // If the customer names a perfume, answer from perfumes.ts directly.
  // ---------------------------------------------------------
  if (
    mentionedPerfume &&
    /\b(stock|disponivel|available|availability|esgotado|out of stock|preco|price|custa|cost|quanto)\b/.test(
      text,
    )
  ) {
    const status =
      mentionedPerfume.stock > 0
        ? pt
          ? `${mentionedPerfume.stock} unidade(s) em stock`
          : `${mentionedPerfume.stock} unit(s) in stock`
        : pt
          ? "esgotado neste momento"
          : "currently out of stock";

    return pt
      ? `${mentionedPerfume.name} custa ${formatPrice(mentionedPerfume.price)} e está ${status}.`
      : `${mentionedPerfume.name} costs ${formatPrice(mentionedPerfume.price)} and is ${status}.`;
  }

  // ---------------------------------------------------------
  // GENERAL STOCK INTENT
  // ---------------------------------------------------------
  if (
    /\b(stock|disponivel|available|availability|esgotado|out of stock)\b/.test(
      text,
    )
  ) {
    const available = perfumes.filter((p) => p.stock > 0);
    const summary = available
      .slice(0, 6)
      .map((p) => `${p.name} (${p.stock})`)
      .join(", ");

    return pt
      ? `Temos várias opções disponíveis neste momento, incluindo: ${summary}. Se me disser o nome de um perfume, posso indicar o stock e o preço desse produto.`
      : `We currently have several options available, including: ${summary}. Tell me the name of a fragrance and I can give you its stock and price.`;
  }

  // ---------------------------------------------------------
  // RECOMMENDATION / DISCOVERY INTENT
  // The fallback begins a sales conversation instead of immediately sending
  // the customer to WhatsApp. The real AI will reason much more deeply.
  // ---------------------------------------------------------
  if (
    /\b(recomenda|recomendacao|recomendar|recommend|recommendation|suggest|sugestao|perfume ideal|fragrance for me|what perfume|which perfume)\b/.test(
      text,
    )
  ) {
    return pt
      ? "Claro! 😊 Posso ajudar a encontrar o perfume ideal. É para si ou para oferecer? E prefere algo doce, fresco, intenso, elegante ou amadeirado? Se não tiver preferência, também posso partir dos nossos mais vendidos."
      : "Of course! 😊 I can help you find the right fragrance. Is it for you or a gift? And do you prefer something sweet, fresh, intense, elegant or woody? If you are not sure, I can also start with our bestsellers.";
  }

  // ---------------------------------------------------------
  // OWNERS / BRAND INTENT
  // ---------------------------------------------------------
  if (
    /\b(quem|dono|donos|fundador|fundadores|owner|owners|founder|founders|who owns|who are)\b/.test(
      text,
    )
  ) {
    return pt
      ? "A Perfuma Angola é uma marca angolana criada pelos jovens empreendedores Miguel Almeida e Victor Sumbo."
      : "Perfuma Angola is an Angolan fragrance brand created by young entrepreneurs Miguel Almeida and Victor Sumbo.";
  }

  // ---------------------------------------------------------
  // DEFAULT FALLBACK
  // Keep the customer engaged instead of unnecessarily pushing WhatsApp.
  // ---------------------------------------------------------
  return pt
    ? "Posso ajudar com recomendações de perfumes, preços, stock, pagamentos e entregas. Diga-me o que procura e eu tento orientar da melhor forma."
    : "I can help with fragrance recommendations, prices, stock, payments and deliveries. Tell me what you are looking for and I will guide you as best I can.";
}
