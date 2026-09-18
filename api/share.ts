import { perfumes } from "../src/data/perfumes.js";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ] || char,
  );
}

/**
 * WhatsApp/social-preview endpoint.
 * Crawlers receive real Open Graph tags; human visitors are immediately sent
 * to the normal React product page. This solves the common SPA preview issue.
 */
export default function handler(request: any, response: any) {
  const slug = String(request.query?.slug || "");
  const language = request.query?.lang === "en" ? "en" : "pt";
  const product = perfumes.find((item) => item.slug === slug);

  if (!product) return response.status(404).send("Product not found");

  const protocol = String(request.headers["x-forwarded-proto"] || "https");
  const host = String(request.headers.host || "");
  const origin = `${protocol}://${host}`;
  const productUrl = `${origin}/perfume/${product.slug}`;
  const imageUrl = `${origin}${product.image}`;
  const title = `${product.name} — Perfuma Angola`;
  const description = product.shortDescription[language];

  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=3600",
  );
  return response.status(200).send(`<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="Perfuma Angola" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(imageUrl)}" />
<meta property="og:url" content="${escapeHtml(productUrl)}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="${escapeHtml(productUrl)}" />
<meta http-equiv="refresh" content="0;url=${escapeHtml(productUrl)}" />
</head>
<body><p><a href="${escapeHtml(productUrl)}">Perfuma Angola — ${escapeHtml(product.name)}</a></p></body>
</html>`);
}
