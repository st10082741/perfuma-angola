import { Banknote, CalendarDays, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "../components/common/WhatsAppButton";
import { useLanguage } from "../i18n/LanguageContext";

/** Customer-service page with only confirmed business information. */
export function Contact() {
  const { language, t } = useLanguage();

  return (
    <main className="section prose contact-page">
      <span className="eyebrow">{t.contact.eyebrow}</span>
      <h1>{t.contact.title}</h1>
      <p>{t.contact.text}</p>

      <div className="contact-facts">
        <article>
          <MessageCircle />
          <strong>WhatsApp</strong>
          <span>+244 939 853 871</span>
        </article>
        <article>
          <CalendarDays />
          <strong>{language === "pt" ? "Entregas" : "Deliveries"}</strong>
          <span>{language === "pt" ? "Domingos" : "Sundays"}</span>
        </article>
        <article>
          <Banknote />
          <strong>{language === "pt" ? "Pagamento" : "Payment"}</strong>
          <span>Multicaixa Express · IBAN · CASH</span>
        </article>
      </div>

      <WhatsAppButton label={t.contact.button} />
    </main>
  );
}
