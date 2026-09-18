import type { Perfume } from "../types/perfume";

/**
 * =========================================================
 * PERFUMA ANGOLA — MAIN PRODUCT CATALOGUE
 * =========================================================
 *
 * This is the main file to edit as the shop owner.
 * You normally do NOT need to edit the React components when stock changes.
 *
 * TO ADD A NEW PRODUCT
 * 1. Put its image in: public/images/perfumes/
 * 2. Copy one object below.
 * 3. Give it a new `id` and a unique `slug`.
 * 4. Change name, brand, price, size, stock and descriptions.
 * 5. Save — the shop card, detail page, filters, WhatsApp and chatbot all
 *    receive the new product automatically.
 *
 * IMPORTANT BEFORE LAUNCH
 * - Prices below are temporary Kz placeholders until Victor replaces them.
 * - Stock numbers below are ALSO placeholders. Replace them with real counts.
 */
export const perfumes: Perfume[] = [
  {
    id: 1,
    slug: "asad-elixir",
    name: "Asad Elixir",
    brand: "Lattafa",
    price: 75000,
    size: "100 ml",
    concentration: "Eau de Parfum",
    category: "Men",
    fragranceFamily: { pt: "Amadeirado especiado", en: "Woody spicy" },
    shortDescription: {
      pt: "Intenso e quente, com especiarias, tabaco, baunilha e um fundo ambarado marcante.",
      en: "Intense and warm, with spices, tobacco, vanilla and a distinctive amber dry-down.",
    },
    description: {
      pt: "Uma fragrância masculina intensa que abre com pimenta rosa, açafrão e toranja. O coração combina tabaco, cedro e baunilha, enquanto patchouli, olíbano, cashmeran e âmbar seco criam uma base quente, sofisticada e memorável.",
      en: "An intense masculine fragrance opening with pink pepper, saffron and grapefruit. Tobacco, cedarwood and vanilla shape the heart, while patchouli, olibanum, cashmeran and dry amber create a warm, sophisticated and memorable base.",
    },
    image: "/images/perfumes/asad-elixir-100ml.jpeg",
    stock: 6,
    featured: true,
    bestseller: true,
    notes: [
      { pt: "Pimenta rosa", en: "Pink pepper" },
      { pt: "Tabaco", en: "Tobacco" },
      { pt: "Baunilha", en: "Vanilla" },
      { pt: "Âmbar seco", en: "Dry amber" },
    ],
  },
  {
    id: 2,
    slug: "khamrah-dukhan",
    name: "Khamrah Dukhan",
    brand: "Lattafa",
    price: 14000,
    size: "30 ml",
    concentration: "Eau de Parfum",
    category: "Unisex",
    fragranceFamily: {
      pt: "Âmbar especiado e fumado",
      en: "Spicy smoky amber",
    },
    shortDescription: {
      pt: "Fumado, quente e viciante: especiarias, incenso, tabaco, âmbar e uma doçura de praliné.",
      en: "Smoky, warm and addictive: spices, incense, tobacco, amber and a touch of praline sweetness.",
    },
    description: {
      pt: "Uma composição rica e fumada que combina mandarina, pimento e especiarias defumadas com incenso, patchouli e flor de laranjeira. Tabaco, âmbar, fava-tonka, benjoim e praliné formam um fundo quente e sofisticado. A embalagem fotografada pela Perfuma Angola é a apresentação de 30 ml atualmente catalogada.",
      en: "A rich smoky composition blending mandarin, pimento and smoked spices with incense, patchouli and orange blossom. Tobacco, amber, tonka bean, benzoin and praline create a warm, sophisticated base. The Perfuma Angola product photo shows the 30 ml presentation currently catalogued.",
    },
    image: "/images/perfumes/khamrah-dukhan-30ml.jpeg",
    stock: 0,
    featured: true,
    bestseller: true,
    notes: [
      { pt: "Especiarias fumadas", en: "Smoked spices" },
      { pt: "Incenso", en: "Incense" },
      { pt: "Tabaco", en: "Tobacco" },
      { pt: "Âmbar", en: "Amber" },
    ],
  },
  {
    id: 3,
    slug: "ramz-lattafa-gold",
    name: "Ramz Lattafa Gold",
    brand: "Lattafa",
    price: 60000,
    size: "100 ml",
    concentration: "Eau de Parfum",
    category: "Unisex",
    fragranceFamily: {
      pt: "Frutado floral amadeirado",
      en: "Fruity floral woody",
    },
    shortDescription: {
      pt: "Frutado e elegante, com frutas luminosas, flores brancas, rosa, baunilha e sândalo.",
      en: "Fruity and elegant, with bright fruits, white florals, rose, vanilla and sandalwood.",
    },
    description: {
      pt: "Ramz Lattafa Gold combina laranja doce, groselha preta, maçã, pera e pêssego com um coração floral de jasmim sambac, flor de laranjeira e rosa. O fundo de patchouli, sândalo, baunilha e almíscar branco cria uma assinatura suave, envolvente e versátil.",
      en: "Ramz Lattafa Gold blends sweet orange, blackcurrant, apple, pear and peach with jasmine sambac, orange blossom and rose. Patchouli, sandalwood, vanilla and white musk create a smooth, enveloping and versatile signature.",
    },
    image: "/images/perfumes/ramz-lattafa-gold.jpeg",
    stock: 4,
    featured: true,
    notes: [
      { pt: "Frutas", en: "Fruits" },
      { pt: "Jasmim", en: "Jasmine" },
      { pt: "Sândalo", en: "Sandalwood" },
      { pt: "Baunilha", en: "Vanilla" },
    ],
  },
  {
    id: 4,
    slug: "ramz-lattafa-silver",
    name: "Ramz Lattafa Silver",
    brand: "Lattafa",
    price: 60000,
    size: "100 ml",
    concentration: "Eau de Parfum",
    category: "Men",
    fragranceFamily: { pt: "Aromático baunilhado", en: "Aromatic vanilla" },
    shortDescription: {
      pt: "Fresco e aromático no início, evoluindo para cardamomo, baunilha, âmbar, musk e patchouli.",
      en: "Fresh and aromatic at first, developing into cardamom, vanilla, amber, musk and patchouli.",
    },
    description: {
      pt: "Ramz Lattafa Silver abre com lavanda, menta, bergamota e pera. Sálvia e cardamomo dão personalidade ao coração, enquanto baunilha, âmbar, patchouli e musk formam uma base quente e moderna.",
      en: "Ramz Lattafa Silver opens with lavender, mint, bergamot and pear. Sage and cardamom shape the heart, while vanilla, amber, patchouli and musk form a warm, modern base.",
    },
    image: "/images/perfumes/ramz-lattafa-silver.jpeg",
    stock: 3,
    newArrival: true,
    notes: [
      { pt: "Lavanda", en: "Lavender" },
      { pt: "Pera", en: "Pear" },
      { pt: "Cardamomo", en: "Cardamom" },
      { pt: "Baunilha", en: "Vanilla" },
    ],
  },
  {
    id: 5,
    slug: "ramz-lattafa-30ml",
    name: "Ramz Lattafa",
    brand: "Lattafa",
    price: 14000,
    size: "30 ml",
    concentration: "Eau de Parfum",
    category: "Unisex",
    fragranceFamily: { pt: "Quente e expressivo", en: "Warm & expressive" },
    shortDescription: {
      pt: "Uma apresentação compacta de 30 ml com presença quente e identidade oriental.",
      en: "A compact 30 ml presentation with a warm character and oriental identity.",
    },
    description: {
      pt: "Uma edição compacta Ramz Lattafa de 30 ml, ideal para levar consigo e para quem procura uma fragrância expressiva num formato prático. Como esta apresentação específica não identifica claramente a variante na frente da embalagem, mantemos a descrição deliberadamente prudente e fiel ao produto fotografado.",
      en: "A compact 30 ml Ramz Lattafa presentation, ideal for carrying with you and for anyone wanting an expressive fragrance in a practical format. Because this specific presentation does not clearly identify the variant on the front packaging, the description remains deliberately careful and faithful to the photographed product.",
    },
    image: "/images/perfumes/ramz-lattafa-30ml.jpeg",
    stock: 4,
    notes: [
      { pt: "Compacto", en: "Compact" },
      { pt: "Quente", en: "Warm" },
      { pt: "Oriental", en: "Oriental" },
    ],
  },
  {
    id: 6,
    slug: "hushed-nightfall",
    name: "Hushed Nightfall",
    brand: "Miss Smoo",
    price: 3000,
    size: "100 ml",
    concentration: "Eau de Parfum",
    category: "Women",
    fragranceFamily: {
      pt: "Elegante e envolvente",
      en: "Elegant & enveloping",
    },
    shortDescription: {
      pt: "Feminino, elegante e confiante, pensado para deixar uma impressão profunda e duradoura.",
      en: "Feminine, elegant and confident, designed to leave a deep and lasting impression.",
    },
    description: {
      pt: "Hushed Nightfall é apresentado como um Eau de Parfum feminino de presença elegante, concebido para transmitir profundidade, beleza e confiança. Funciona tanto em ocasiões formais como no dia a dia e foi escolhido para quem procura uma assinatura refinada e memorável.",
      en: "Hushed Nightfall is presented as a feminine Eau de Parfum with an elegant presence, designed to convey depth, beauty and confidence. It suits formal occasions as well as everyday wear and is selected for anyone seeking a refined, memorable signature.",
    },
    image: "/images/perfumes/hushed-nightfall-100ml.jpeg",
    stock: 5,
    notes: [
      { pt: "Profundo", en: "Deep" },
      { pt: "Elegante", en: "Elegant" },
      { pt: "Feminino", en: "Feminine" },
    ],
  },
  {
    id: 7,
    slug: "sweet-treat-signature",
    name: "Sweet Treat Signature",
    brand: "Signature",
    price: 40000,
    size: "Tamanho a confirmar",
    concentration: "Eau de Toilette",
    category: "Women",
    fragranceFamily: { pt: "Doce e delicado", en: "Sweet & delicate" },
    shortDescription: {
      pt: "Leve, jovem e doce: uma fragrância descontraída para uso diário.",
      en: "Light, youthful and sweet: an easy-going fragrance for everyday wear.",
    },
    description: {
      pt: "Sweet Treat Signature tem uma estética leve e divertida e uma proposta feminina, jovem e doce. É uma opção fácil de usar no dia a dia, especialmente para quem prefere fragrâncias suaves e descontraídas. O volume não aparece de forma legível na fotografia, por isso deve ser confirmado antes da publicação final.",
      en: "Sweet Treat Signature has a light, playful aesthetic and a feminine, youthful, sweet character. It is an easy everyday option, especially for those who prefer softer, casual fragrances. The volume is not legible in the photo and should be confirmed before final publication.",
    },
    image: "/images/perfumes/sweet-treat-signature.jpeg",
    stock: 5,
    newArrival: true,
    notes: [
      { pt: "Doce", en: "Sweet" },
      { pt: "Suave", en: "Soft" },
      { pt: "Casual", en: "Casual" },
    ],
  },
  {
    id: 8,
    slug: "perfuma-oil-no-1",
    name: "Óleo Perfumado Nº 01",
    brand: "Perfuma Angola Selection",
    price: 12000,
    size: "Tamanho a confirmar",
    concentration: "Oil-based fragrance",
    category: "Unisex",
    fragranceFamily: {
      pt: "Suave, limpa e envolvente",
      en: "Soft, clean & enveloping",
    },
    shortDescription: {
      pt: "Seleção à base de óleo, com sensação concentrada, suave na projeção e agradável na pele.",
      en: "An oil-based selection with a concentrated feel, smooth projection and skin-friendly character.",
    },
    description: {
      pt: "Uma das seleções sem marca da Perfuma Angola, formulada à base de óleo e escolhida pelo aroma agradável e pela sensação concentrada na pele. A proposta é oferecer uma experiência inspirada na perfumaria de assinatura sem apresentar o produto como uma fragrância original de uma marca que não consta no frasco.",
      en: "One of Perfuma Angola’s unbranded selections, oil-based and chosen for its pleasant scent and concentrated feel on skin. It offers a signature-fragrance-inspired experience without presenting the product as an original fragrance from a brand that is not shown on the bottle.",
    },
    image: "/images/perfumes/perfuma-oil-no-1.jpeg",
    stock: 7,
    notes: [
      { pt: "À base de óleo", en: "Oil based" },
      { pt: "Concentrado", en: "Concentrated" },
      { pt: "Unissexo", en: "Unisex" },
    ],
  },
  {
    id: 9,
    slug: "perfuma-oil-no-2",
    name: "Óleo Perfumado Nº 02",
    brand: "Perfuma Angola Selection",
    price: 12000,
    size: "Tamanho a confirmar",
    concentration: "Oil-based fragrance",
    category: "Unisex",
    fragranceFamily: {
      pt: "Quente, macio e persistente",
      en: "Warm, smooth & lingering",
    },
    shortDescription: {
      pt: "Uma opção à base de óleo com perfil quente e macio, pensada para permanecer próxima da pele.",
      en: "An oil-based option with a warm, smooth profile designed to stay close to the skin.",
    },
    description: {
      pt: "Uma seleção sem marca da Perfuma Angola com base oleosa, escolhida pela boa performance e pelo aroma envolvente. É indicada para clientes que gostam de fragrâncias concentradas e de uma presença mais íntima na pele, sem atribuir ao produto uma marca ou inspiração específica que ainda não tenha sido confirmada.",
      en: "An unbranded Perfuma Angola oil-based selection chosen for its pleasant performance and enveloping aroma. It suits customers who enjoy concentrated fragrances and a more intimate skin scent, without assigning it a brand or specific inspiration that has not been confirmed.",
    },
    image: "/images/perfumes/perfuma-oil-no-2.jpeg",
    stock: 7,
    notes: [
      { pt: "À base de óleo", en: "Oil based" },
      { pt: "Quente", en: "Warm" },
      { pt: "Persistente", en: "Lingering" },
    ],
  },

  {
    id: 10,
    slug: "asad-onlyou",
    name: "Asada",
    brand: "Onlyou perfume collection",
    price: 14000,
    size: "30 ml",
    concentration: "Eau de Parfum",
    category: "Men",
    fragranceFamily: { pt: "Aromático Especiado", en: "Aromatic spicy" },
    shortDescription: {
      pt: "Uma fragrância compacta e marcante da Onlyou Perfume Collection, apresentada num elegante frasco de 30 ml. Uma opção prática para quem procura uma fragrância para acompanhar o dia a dia.",
      en: "A distinctive and compact fragrance from the Onlyou Perfume Collection, presented in an elegant 30 ml bottle. A practical choice for everyday fragrance use.",
    },
    description: {
      pt: "Asada da Onlyou Perfume Collection é uma Eau de Parfum apresentada num formato compacto de 30 ml, ideal para transportar e utilizar no dia a dia. O seu frasco de design distinto e acabamento elegante proporciona uma apresentação moderna e sofisticada. Uma escolha prática para quem procura adicionar uma nova fragrância à sua coleção.",
      en: "Asada by Onlyou Perfume Collection is an Eau de Parfum presented in a compact 30 ml format, making it convenient to carry and use throughout the day. Its distinctive bottle design and elegant finish give it a modern and sophisticated presentation. A practical choice for anyone looking to add a new fragrance to their collection.",
    },
    image: "/images/perfumes/Asada-30ml.jpeg",
    stock: 0,
    featured: false,
    bestseller: true,
    notes: [
      { pt: "Pimenta rosa", en: "Pink pepper" },
      { pt: "Tabaco", en: "Tobacco" },
      { pt: "Baunilha", en: "Vanilla" },
      { pt: "Âmbar seco", en: "Dry amber" },
    ],
  },
];
