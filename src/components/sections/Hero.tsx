import { Link } from "react-router-dom";
import { WhatsAppButton } from "../common/WhatsAppButton";
import { useLanguage } from "../../i18n/LanguageContext";

/**
 * Homepage hero.
 * The image is one of Perfuma Angola's own product photos rather than a stock
 * image, which keeps the storefront visually connected to the real catalogue.
 */
export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">{t.hero.eyebrow}</span>
        <h1>
          {t.hero.title}
          <br />
          <em>{t.hero.accent}</em>
        </h1>
        <p>{t.hero.text}</p>
        <div className="actions">
          <Link className="btn btn-dark" to="/shop">
            {t.hero.explore}
          </Link>
          <WhatsAppButton label={t.hero.advice} className="btn btn-light" />
        </div>
      </div>

      <div className="hero-image">
        <img src="/images/perfumes/asad-elixir-100ml.jpeg" alt={t.hero.alt} />
        <span>PERFUMA ANGOLA · ANGOLA</span>
      </div>
    </section>
  );
}
