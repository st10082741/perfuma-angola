import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, HeartHandshake } from "lucide-react";
import { Hero } from "../components/sections/Hero";
import { PerfumeCard } from "../components/perfume/PerfumeCard";
import { perfumes } from "../data/perfumes";
import { useLanguage } from "../i18n/LanguageContext";
export function Home() {
  const { t } = useLanguage();
  return (
    <>
      <Hero />
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t.home.edit}</span>
            <h2>{t.home.featured}</h2>
          </div>
          <Link to="/shop">{t.home.viewAll}</Link>
        </div>
        <div className="grid">
          {perfumes
            .filter((p) => p.featured)
            .map((p) => (
              <PerfumeCard key={p.id} p={p} />
            ))}
        </div>
      </section>
      <section className="dark-section">
        <span className="eyebrow">{t.home.why}</span>
        <h2>{t.home.whyTitle}</h2>
        <div className="benefits">
          <div>
            <Sparkles />
            <h3>{t.home.curated}</h3>
            <p>{t.home.curatedText}</p>
          </div>
          <div>
            <MessageCircle />
            <h3>{t.home.ordering}</h3>
            <p>{t.home.orderingText}</p>
          </div>
          <div>
            <HeartHandshake />
            <h3>{t.home.service}</h3>
            <p>{t.home.serviceText}</p>
          </div>
        </div>
      </section>
      <section className="quote">
        <span>{t.home.signature}</span>
        <h2>{t.home.quote}</h2>
        <Link className="btn btn-dark" to="/shop">
          {t.home.discover}
        </Link>
      </section>
    </>
  );
}
