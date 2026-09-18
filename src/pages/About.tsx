import { useLanguage } from "../i18n/LanguageContext";

/** Brand story kept concise and bilingual. */
export function About() {
  const { language, t } = useLanguage();

  return (
    <main className="section prose about-page">
      <span className="eyebrow">{t.about.eyebrow}</span>
      <h1>{t.about.title}</h1>
      <p>{t.about.p1}</p>
      <p>{t.about.p2}</p>

      <div className="about-facts">
        <article>
          <strong>01</strong>
          <span>{language === "pt" ? "Marca angolana" : "Angolan brand"}</span>
        </article>
        <article>
          <strong>02</strong>
          <span>
            {language === "pt"
              ? "Fundada por jovens empreendedores"
              : "Built by young entrepreneurs"}
          </span>
        </article>
        <article>
          <strong>03</strong>
          <span>
            {language === "pt"
              ? "Atendimento pessoal pelo WhatsApp"
              : "Personal WhatsApp service"}
          </span>
        </article>
      </div>
    </main>
  );
}
