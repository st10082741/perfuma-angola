# ✨ Perfuma Angola

<div align="center">

**Elegância que se sente. Presença que permanece.**

A modern bilingual perfume catalogue and customer experience platform built for **Perfuma Angola**.

**Português 🇦🇴 · English 🇬🇧**

</div>

---

## 🌸 About Perfuma Angola

**Perfuma Angola** is an Angolan fragrance brand focused on bringing carefully selected fragrances closer to customers who value personality, elegance and confidence.

The platform was designed to provide customers with a simple and refined way to discover available fragrances, explore product information and place orders directly through WhatsApp.

Rather than building a traditional e-commerce checkout experience from the beginning, Perfuma Angola focuses on a more personal purchasing journey where customers can discover a fragrance online and continue their order directly with the business.

---

## 🌐 About the Website

The Perfuma Angola website is a responsive perfume catalogue developed using **React, TypeScript and Vite**.

The application provides a luxury-inspired digital experience while keeping catalogue management simple and maintainable.

Customers can:

- 🛍️ Browse the perfume catalogue
- 🔎 Explore individual fragrance details
- 👨 Discover men's fragrances
- 👩 Discover women's fragrances
- ✨ Explore unisex fragrances
- 📦 View product availability
- 💬 Order directly through WhatsApp
- 🤖 Interact with a virtual perfume assistant
- 🌍 Switch between Portuguese and English
- 📱 Browse comfortably on desktop, tablet and mobile devices

---

## ✨ Main Features

### 🛍️ Dynamic Perfume Catalogue

Products are managed through a centralized TypeScript catalogue.

Each perfume can contain information such as:

- Product name
- Brand
- Price
- Size
- Concentration
- Category
- Fragrance family
- Product descriptions
- Fragrance notes
- Product image
- Stock quantity
- Featured/bestseller status

This structure allows new perfumes to be added without rebuilding the catalogue interface manually.

---

### 📦 Stock-Based Availability

Product availability is derived directly from the perfume's stock quantity.

For example:

```ts
stock: 8; // Available
stock: 2; // Low stock
stock: 0; // Out of stock
```

This provides a simple source of truth for catalogue availability while keeping inventory management easy for the current stage of the business.

---

### 💬 WhatsApp Ordering

Instead of requiring customers to create accounts or complete a complicated checkout process, Perfuma Angola provides direct **WhatsApp ordering**.

When a customer selects a perfume, the website prepares an order message containing relevant product information such as:

```text
✨ Product
🏷️ Brand
📦 Size
💰 Price
🔗 Product link
```

The customer can then continue the conversation directly with Perfuma Angola.

This approach combines the convenience of an online catalogue with personalized customer service.

---

### 🖼️ Product Sharing Architecture

The project includes a server-side product sharing endpoint designed to generate Open Graph metadata for individual perfumes.

This allows shared product links to provide platforms such as WhatsApp with information including:

- Product name
- Description
- Product image
- Product URL
- Website name

This architecture provides richer product sharing while keeping the actual product experience inside the Perfuma Angola website.

---

### 🤖 AI-Powered Perfume Assistant

Perfuma Angola includes a virtual sales assistant designed to help customers navigate the catalogue naturally.

The assistant can use catalogue information to help with questions involving:

- Available perfumes
- Product prices
- Stock
- Fragrance categories
- Perfume recommendations
- Payment information
- Delivery information
- General catalogue questions

The AI integration is handled through a **server-side API**, preventing private API credentials from being exposed in the browser.

A local fallback assistant is also included so that basic customer assistance remains available when the external AI service is unavailable.

> The AI assistant is intended to assist customers with product discovery and information. Catalogue information remains the source of truth for product data.

---

### 🌍 Portuguese & English

Perfuma Angola was designed with **Portuguese as the primary language**, reflecting its Angolan market.

Customers can switch between:

- 🇦🇴 **Português**
- 🇬🇧 **English**

Navigation, product information, customer-facing content and chatbot experiences are designed around this bilingual structure.

---

### 📱 Responsive Design

The interface was designed to adapt across:

- Desktop computers
- Laptops
- Tablets
- Smartphones

The visual identity uses a luxury-inspired combination of elegant typography, warm neutral tones, refined spacing and subtle interactions.

---

## 🛠️ Technology Stack

| Technology           | Purpose                                       |
| -------------------- | --------------------------------------------- |
| **React**            | Component-based user interface                |
| **TypeScript**       | Type-safe application development             |
| **Vite**             | Development environment and production builds |
| **CSS3**             | Custom responsive and luxury-inspired styling |
| **React Router DOM** | Client-side navigation and product routes     |
| **Lucide React**     | Interface icons                               |
| **Groq API**         | AI assistant integration                      |
| **GPT-OSS**          | Language model used by the assistant          |
| **Vercel Functions** | Server-side API functionality                 |
| **Open Graph**       | Rich product-sharing metadata                 |
| **WhatsApp**         | Direct customer ordering                      |
| **Vercel**           | Production hosting and deployment             |

---

## 🏗️ Project Architecture

```text
perfuma-angola/
│
├── api/
│   ├── chat.ts
│   └── share.ts
│
├── public/
│   └── images/
│       └── perfumes/
│
├── src/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── data/
│   ├── i18n/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

### Important Areas

#### `src/data/perfumes.ts`

Contains the perfume catalogue and product information.

#### `src/i18n/`

Contains the Portuguese and English interface translations.

#### `src/components/`

Contains reusable interface components used throughout the application.

#### `src/pages/`

Contains the main website pages and product experiences.

#### `src/utils/`

Contains reusable business logic such as stock handling, WhatsApp ordering and chatbot fallback behaviour.

#### `api/chat.ts`

Server-side endpoint responsible for communication with the AI service.

#### `api/share.ts`

Server-side endpoint responsible for generating product-sharing metadata.

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Enter the project

```bash
cd perfuma-angola
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Vite will provide a local development URL in the terminal.

---

## 🏗️ Production Build

To create an optimized production build:

```bash
npm run build
```

The compiled application will be generated inside:

```text
dist/
```

---

## 🔐 Environment Variables

Some functionality requires environment variables.

Create a local `.env.local` file when necessary.

Example:

```env
GROQ_API_KEY=your_private_api_key
GROQ_MODEL=your_model_name
VITE_SITE_URL=your_public_website_url
```

> ⚠️ **Never commit `.env`, `.env.local`, API keys or other secrets to GitHub.**

Environment files containing secrets are excluded through `.gitignore`.

---

## 🧴 Adding a New Perfume

The catalogue is designed to make product management straightforward.

### Step 1 — Add the image

Place the product image inside:

```text
public/images/perfumes/
```

### Step 2 — Open the catalogue

Navigate to:

```text
src/data/perfumes.ts
```

### Step 3 — Add the product

Create a new perfume object with a **unique ID and slug**.

Example structure:

```ts
{
  id: 10,
  slug: 'example-perfume',
  name: 'Example Perfume',
  brand: 'Example Brand',

  price: 25000,

  size: '100 ml',
  concentration: 'Eau de Parfum',
  category: 'Unisex',

  fragranceFamily: {
    pt: 'Amadeirado',
    en: 'Woody'
  },

  shortDescription: {
    pt: 'Descrição curta em português.',
    en: 'Short description in English.'
  },

  description: {
    pt: 'Descrição completa em português.',
    en: 'Full description in English.'
  },

  image: '/images/perfumes/example-perfume.jpg',

  stock: 5,

  notes: {
    pt: ['Nota 1', 'Nota 2'],
    en: ['Note 1', 'Note 2']
  }
}
```

Once added, the existing catalogue architecture can use the new product throughout the website without manually creating a separate product page.

---

## 🔒 Security

Security considerations were included from the beginning of the project.

The application follows principles such as:

- API secrets remain server-side
- Environment files are excluded from Git
- No secret keys are embedded in frontend source code
- AI requests are handled through server-side endpoints
- Customer ordering is redirected through official business contact channels
- Product information is centrally managed to reduce inconsistencies

---

## 🗺️ Current Architecture & Future Growth

The current version intentionally keeps the purchasing process lightweight.

It does **not currently require**:

- Customer accounts
- Authentication
- A traditional shopping cart
- An internal checkout system
- A product database
- An integrated online payment gateway

Instead, catalogue data is managed directly within the application and customer orders continue through WhatsApp.

The architecture leaves room for future development such as:

- Database-backed inventory
- Administrative dashboard
- Customer accounts
- Shopping cart
- Online checkout
- Order management
- Automated stock updates
- Payment gateway integration
- Analytics and reporting
- Customer order history

These capabilities can be introduced as the platform and business requirements grow.

---

## 👨‍💻 Development

Perfuma Angola was developed as a custom web application rather than using a pre-built e-commerce platform.

The project demonstrates practical implementation of:

**React architecture · TypeScript · responsive UI development · reusable components · bilingual interfaces · API integration · serverless backend functionality · AI-assisted customer experiences · WhatsApp commerce · catalogue management · production deployment**

---

## 🇦🇴 Built for Angola

Perfuma Angola is designed around a simple principle:

> **Make discovering and ordering a fragrance elegant, personal and uncomplicated.**

From bilingual customer interaction to direct WhatsApp ordering, the platform is designed around the needs of the business and its customers.

---

<div align="center">

### Perfuma Angola

**Elegância · Personalidade · Confiança**

Made with ❤️ in Angola 🇦🇴

</div>
