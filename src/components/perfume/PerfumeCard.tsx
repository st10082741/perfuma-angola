import { Eye, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Perfume } from "../../types/perfume";
import { WhatsAppButton } from "../common/WhatsAppButton";
import { storeConfig } from "../../config/store";
import { useLanguage } from "../../i18n/LanguageContext";
import { getStockStatus } from "../../utils/inventory";

/**
 * Catalogue card.
 *
 * Desktop: the image reveals a short description on hover while remaining a
 * normal clickable link. Mobile devices simply show the card without relying
 * on hover, so the interaction stays accessible everywhere.
 */
export function PerfumeCard({ p }: { p: Perfume }) {
  const { language, t } = useLanguage();
  const status = getStockStatus(p);
  const money = (value: number) =>
    `${value.toLocaleString(storeConfig.locale)} ${storeConfig.currency}`;

  const stockLabel =
    status === "out"
      ? t.common.unavailable
      : status === "low"
        ? t.common.lowStock
        : t.common.available;

  return (
    <article className={`card ${status === "out" ? "card-sold-out" : ""}`}>
      <Link
        to={`/perfume/${p.slug}`}
        className="card-image"
        aria-label={`${t.common.viewDetails}: ${p.name}`}
      >
        <img src={p.image} alt={`${p.brand} ${p.name}`} loading="lazy" />

        <div className="card-badges">
          {p.bestseller && (
            <span className="badge badge-dark">{t.common.bestseller}</span>
          )}
          {!p.bestseller && p.newArrival && (
            <span className="badge badge-dark">{t.common.newArrival}</span>
          )}
          <span className={`badge badge-stock stock-${status}`}>
            {stockLabel}
          </span>
        </div>

        <div className="card-hover">
          <Eye size={19} aria-hidden="true" />
          <p>{p.shortDescription[language]}</p>
          <strong>{t.common.viewDetails} →</strong>
        </div>
      </Link>

      <div className="card-body">
        <small>{p.brand.toUpperCase()}</small>
        <Link to={`/perfume/${p.slug}`}>
          <h3>{p.name}</h3>
        </Link>
        <p>
          {p.size} · {p.fragranceFamily[language]}
        </p>

        <div className="inventory-line">
          <PackageCheck size={14} aria-hidden="true" />
          {p.stock > 0 ? `${p.stock} ${t.common.stock}` : t.common.unavailable}
        </div>

        <div className="price">
          {money(p.price)} {p.oldPrice && <del>{money(p.oldPrice)}</del>}
        </div>

        <WhatsAppButton product={p} disabled={status === "out"} />
      </div>
    </article>
  );
}
