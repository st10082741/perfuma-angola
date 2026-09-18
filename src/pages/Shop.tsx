import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { perfumes } from "../data/perfumes";
import { PerfumeCard } from "../components/perfume/PerfumeCard";
import { useLanguage } from "../i18n/LanguageContext";
import type { Category } from "../types/perfume";

/**
 * Catalogue page.
 * Filtering happens entirely in the browser because the catalogue is small;
 * this keeps the first version fast and avoids needing a database.
 */
export function Shop() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const category = params.get("category") as Category | null;

  const categories: [Category, string][] = [
    ["Men", t.nav.men],
    ["Women", t.nav.women],
    ["Unisex", t.nav.unisex],
  ];

  const filtered = useMemo(() => {
    const search = query.toLowerCase().trim();
    return perfumes.filter((product) => {
      const categoryMatches = !category || product.category === category;
      const searchMatches =
        !search ||
        `${product.name} ${product.brand}`.toLowerCase().includes(search);
      return categoryMatches && searchMatches;
    });
  }, [category, query]);

  return (
    <main className="section shop-page">
      <span className="eyebrow">{t.shop.eyebrow}</span>
      <h1>{t.shop.title}</h1>
      <p className="lead">{t.shop.text}</p>

      <div className="filters">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.shop.search}
        />
        <button
          className={!category ? "active" : ""}
          onClick={() => setParams({})}
        >
          {t.shop.all}
        </button>
        {categories.map(([value, label]) => (
          <button
            key={value}
            className={category === value ? "active" : ""}
            onClick={() => setParams({ category: value })}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="catalogue-count">
        {filtered.length} {filtered.length === 1 ? "perfume" : "perfumes"}
      </p>
      {filtered.length ? (
        <div className="grid">
          {filtered.map((product) => (
            <PerfumeCard key={product.id} p={product} />
          ))}
        </div>
      ) : (
        <p>{t.shop.noResults}</p>
      )}
    </main>
  );
}
