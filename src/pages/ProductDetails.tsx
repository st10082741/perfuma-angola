import { PackageCheck, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { perfumes } from "../data/perfumes";
import { storeConfig } from "../config/store";
import { WhatsAppButton } from "../components/common/WhatsAppButton";
import { useLanguage } from "../i18n/LanguageContext";
import { getStockStatus } from "../utils/inventory";

/** Full product view generated automatically from the matching catalogue item. */
export function ProductDetails() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const p = perfumes.find((item) => item.slug === slug);

  if (!p) {
    return (
      <main className="section">
        <h1>404</h1>
        <Link to="/shop">{t.product.back}</Link>
      </main>
    );
  }

  const status = getStockStatus(p);
  const statusText =
    status === "out"
      ? t.common.unavailable
      : status === "low"
        ? t.common.lowStock
        : t.common.available;

  return (
    <main className="product-page">
      <div className="product-photo">
        <img src={p.image} alt={`${p.brand} ${p.name}`} />
        <span className={`product-stock-badge stock-${status}`}>
          {statusText}
        </span>
      </div>

      <div className="product-info">
        <Link to="/shop" className="back">
          {t.product.back}
        </Link>
        <span className="eyebrow">{p.brand}</span>
        <h1>{p.name}</h1>
        <div className="product-price">
          {p.price.toLocaleString(storeConfig.locale)} {storeConfig.currency}
        </div>
        <p className="product-description">{p.description[language]}</p>

        <div className="stock-panel">
          <PackageCheck size={20} />
          <div>
            <strong>{statusText}</strong>
            <span>
              {p.stock > 0 ? `${p.stock} ${t.common.stock}` : t.common.soldOut}
            </span>
          </div>
        </div>

        <dl>
          <div>
            <dt>{t.product.size}</dt>
            <dd>{p.size}</dd>
          </div>
          <div>
            <dt>{t.product.concentration}</dt>
            <dd>{p.concentration}</dd>
          </div>
          <div>
            <dt>{t.product.category}</dt>
            <dd>
              {p.category === "Men"
                ? t.nav.men
                : p.category === "Women"
                  ? t.nav.women
                  : t.nav.unisex}
            </dd>
          </div>
          <div>
            <dt>{t.product.family}</dt>
            <dd>{p.fragranceFamily[language]}</dd>
          </div>
        </dl>

        <h3>{t.product.notes}</h3>
        <div className="notes">
          {p.notes.map((note, index) => (
            <span key={index}>{note[language]}</span>
          ))}
        </div>

        <WhatsAppButton product={p} disabled={status === "out"} />
        <p className="order-reassurance">
          <ShieldCheck size={15} />{" "}
          {language === "pt"
            ? "Confirme stock e pagamento diretamente connosco antes da entrega."
            : "Confirm stock and payment directly with us before delivery."}
        </p>
      </div>
    </main>
  );
}
