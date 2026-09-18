/**
 * =========================================================
 * CHATBOT BUSINESS KNOWLEDGE
 * =========================================================
 * This file contains stable answers about Perfuma Angola.
 * It is intentionally separate from the product catalogue:
 * - product facts/prices/stock -> perfumes.ts
 * - business policies/FAQ      -> this file
 *
 * The chatbot API combines both sources at request time, so no database is
 * required for this first version.
 */
export const businessKnowledge = {
  brand: "Perfuma Angola",
  country: "Angola",
  owners: ["Miguel Almeida", "Victor Sumbo"],
  aboutPt:
    "A Perfuma Angola é uma marca angolana criada por jovens empreendedores, Miguel Almeida e Victor Sumbo, com foco em tornar a descoberta e compra de fragrâncias mais simples, pessoal e elegante.",
  aboutEn:
    "Perfuma Angola is an Angolan fragrance brand created by young entrepreneurs Miguel Almeida and Victor Sumbo, focused on making fragrance discovery and ordering simple, personal and elegant.",
  paymentPt:
    "O pagamento pode ser feito por Multicaixa Express ou por IBAN/transferência bancária. Os dados de pagamento devem ser confirmados diretamente com a Perfuma Angola antes de efetuar a transferência.",
  paymentEn:
    "Payment can be made through Multicaixa Express or by IBAN/bank transfer. Payment details should be confirmed directly with Perfuma Angola before making a transfer.",
  deliveryPt:
    "As entregas regulares são feitas aos domingos. Para endereço, taxa de entrega ou uma situação especial, o cliente deve confirmar diretamente pelo WhatsApp.",
  deliveryEn:
    "Regular deliveries are made on Sundays. For address coverage, delivery fees or a special situation, the customer should confirm directly on WhatsApp.",
  policies: [
    "Never invent delivery fees, delivery areas, bank details, return rules or guarantees that are not provided.",
    "Never claim an unbranded oil fragrance is an original designer fragrance.",
    "If exact operational information is missing, offer the WhatsApp contact instead of guessing.",
    "Recommend only products with stock greater than zero as currently available.",
  ],
} as const;
