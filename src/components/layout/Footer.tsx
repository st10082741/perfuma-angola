import { Link } from "react-router-dom";
import { storeConfig } from "../../config/store";
import { useLanguage } from "../../i18n/LanguageContext";

/** Footer deliberately avoids publishing placeholder email/social details. */
export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer>
      <div className="footer-brand">
        <img className="footer-logo" src={storeConfig.logoPath} alt="" />
        <div>
          <h3>{storeConfig.businessName}</h3>
          <p>{t.footer.text}</p>
        </div>
      </div>

      <div>
        <strong>{language === "pt" ? "Explorar" : "Explore"}</strong>
        <Link to="/shop">{t.nav.shop}</Link>
        <Link to="/about">{t.nav.about}</Link>
        <Link to="/contact">{t.nav.contact}</Link>
      </div>

      <div>
        <strong>{language === "pt" ? "Encomendas" : "Orders"}</strong>
        <span>
          {language === "pt" ? "Entregas: Domingos" : "Deliveries: Sundays"}
        </span>
        <span>Multicaixa Express · IBAN · CASH</span>
        <span>WhatsApp: +244 939 853 871</span>
      </div>

      <small>
        © {new Date().getFullYear()} {storeConfig.businessName}.{" "}
        {t.footer.rights}
      </small>
    </footer>
  );
}
