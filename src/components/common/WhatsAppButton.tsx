import { MessageCircle } from "lucide-react";
import type { Perfume } from "../../types/perfume";
import { useLanguage } from "../../i18n/LanguageContext";
import { whatsappUrl } from "../../utils/whatsapp";

/** Reusable WhatsApp action used by cards, product pages and general enquiries. */
export function WhatsAppButton({
  product,
  label,
  className = "btn btn-gold",
  disabled = false,
}: {
  product?: Perfume;
  label?: string;
  className?: string;
  disabled?: boolean;
}) {
  const { language, t } = useLanguage();

  if (disabled) {
    return (
      <span className={`${className} btn-disabled`} aria-disabled="true">
        <MessageCircle size={17} />
        {t.common.unavailable}
      </span>
    );
  }

  return (
    <a
      className={className}
      href={whatsappUrl(product, language)}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={17} />
      {label ?? t.common.order}
    </a>
  );
}
