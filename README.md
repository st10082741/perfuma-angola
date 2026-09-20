**\# ✨ Perfuma Angola**

\<div *align*="center"\>

**\*\*Elegância que se sente. Presença que permanece.\*\***

A modern bilingual perfume catalogue and customer experience platform
built for **\*\*Perfuma Angola\*\***.

**\*\*Português 🇦🇴 · English 🇬🇧\*\***

\</div\>

**---**

**\## 🌸 About Perfuma Angola**

**\*\*Perfuma Angola\*\*** is an Angolan fragrance brand focused on
bringing carefully selected fragrances closer to customers who value
personality, elegance and confidence.

The platform was designed to provide customers with a simple and refined
way to discover available fragrances, explore product information and
place orders directly through WhatsApp.

Rather than building a traditional e-commerce checkout experience from
the beginning, Perfuma Angola focuses on a more personal purchasing
journey where customers can discover a fragrance online and continue
their order directly with the business.

**---**

**\## 🌐 About the Website**

The Perfuma Angola website is a responsive perfume catalogue developed
using **\*\*React, TypeScript and Vite\*\***.

The application provides a luxury-inspired digital experience while
keeping catalogue management simple and maintainable.

Customers can:

\- 🛍️ Browse the perfume catalogue

\- 🔎 Explore individual fragrance details

\- 👨 Discover men's fragrances

\- 👩 Discover women's fragrances

\- ✨ Explore unisex fragrances

\- 📦 View product availability

\- 💬 Order directly through WhatsApp

\- 🤖 Interact with a virtual perfume assistant

\- 🌍 Switch between Portuguese and English

\- 📱 Browse comfortably on desktop, tablet and mobile devices

**---**

**\## ✨ Main Features**

**\### 🛍️ Dynamic Perfume Catalogue**

Products are managed through a centralized TypeScript catalogue.

Each perfume can contain information such as:

\- Product name

\- Brand

\- Price

\- Size

\- Concentration

\- Category

\- Fragrance family

\- Product descriptions

\- Fragrance notes

\- Product image

\- Stock quantity

\- Featured/bestseller status

This structure allows new perfumes to be added without rebuilding the
catalogue interface manually.

**---**

**\### 📦 Stock-Based Availability**

Product availability is derived directly from the perfume's stock
quantity.

For example:

\`\`\`ts

stock: 8; // Available

stock: 2; // Low stock

stock: 0; // Out of stock

\`\`\`

This provides a simple source of truth for catalogue availability while
keeping inventory management easy for the current stage of the business.

**---**

**\### 💬 WhatsApp Ordering**

Instead of requiring customers to create accounts or complete a
complicated checkout process, Perfuma Angola provides direct
**\*\*WhatsApp ordering\*\***.

When a customer selects a perfume, the website prepares an order message
containing relevant product information such as:

\`\`\`text

✨ Product

🏷️ Brand

📦 Size

💰 Price

🔗 Product link

\`\`\`

The customer can then continue the conversation directly with Perfuma
Angola.

This approach combines the convenience of an online catalogue with
personalized customer service.

**---**

**\### 🖼️ Product Sharing Architecture**

The project includes a server-side product sharing endpoint designed to
generate Open Graph metadata for individual perfumes.

This allows shared product links to provide platforms such as WhatsApp
with information including:

\- Product name

\- Description

\- Product image

\- Product URL

\- Website name

This architecture provides richer product sharing while keeping the
actual product experience inside the Perfuma Angola website.

**---**

**\### 🤖 AI-Powered Perfume Assistant**

Perfuma Angola now includes an AI-powered virtual sales assistant built
as part of the website rather than as a separate chatbot service.

The assistant combines **Groq AI**, the Perfuma Angola catalogue,
verified business information, recent conversation context and
deterministic application logic. This allows customers to have natural
sales conversations while keeping important business data under the
control of the application.

The assistant can:

-   Understand natural Portuguese and English customer questions
-   Tolerate common spelling mistakes and Portuguese text written
    without accents
-   Remember recent conversation context during the current chat session
-   Recommend perfumes according to category, preference and price
-   Understand follow-up messages such as `e masculino?`, `mais barato`,
    `quanto custa?` and `quero o de 30ml`
-   Read trusted product names, prices, sizes and stock from the
    catalogue
-   Display visual product recommendation cards for focused
    recommendations
-   Link recommendations to the correct product page
-   Detect purchase intent and provide a controlled WhatsApp handoff
-   Answer confirmed payment and delivery information
-   Avoid inventing unknown business information such as an unconfirmed
    IBAN or delivery fee
-   Fall back safely when the external AI service is temporarily
    unavailable or rate-limited

The AI integration is handled through the server-side `api/chat.ts`
endpoint. The private Groq API key therefore remains on the server and
is never exposed in the customer's browser.

The catalogue remains the source of truth for product information. The
AI is responsible for natural-language understanding and conversation,
while trusted TypeScript application logic controls sensitive actions
and verified business data.

------------------------------------------------------------------------

### 🧠 How the AI Assistant Works

The simplified request flow is:

``` text
Customer
   ↓
React Chatbot (Chatbot.tsx)
   ↓
Vercel Serverless API (/api/chat.ts)
   ↓
Catalogue + Business Knowledge + Recent Conversation Context
   ↓
Groq API / Language Model
   ↓
Validated Assistant Response
   ↓
Text Response / Product Card / WhatsApp Handoff
```

This separation is intentional.

The **AI layer** is useful for flexible language, recommendations,
conversational follow-ups and understanding customer intent.

The **application layer** remains responsible for trusted catalogue
information, business rules, product matching, purchase actions and
WhatsApp links.

For example, a customer can have a conversation such as:

``` text
Customer: Recomenda um perfume unissexo
Assistant: Recommends a suitable catalogue product.

Customer: Mas é caro, sugere algo mais barato
Assistant: Understands the previous recommendation and suggests a cheaper option.

Customer: Tem um Lattafa mais barato?
Assistant: Narrows the recommendation while preserving the conversation context.

Customer: Quero o de 30ml
Assistant: Resolves the referenced product and starts the controlled purchase handoff.
```

The final message does not need to repeat the complete perfume name
because recent conversation context helps the system understand what the
customer is referring to.

------------------------------------------------------------------------

### 🖼️ AI Visual Product Recommendations

AI recommendations are connected to the existing Perfuma Angola
catalogue.

When the assistant gives a focused recommendation for one known perfume,
the React frontend can identify that catalogue product and render a
visual recommendation containing:

-   Product image
-   Brand
-   Product name
-   Size
-   Price
-   `Ver produto` / `View product` action

The visual card does **not** trust the AI to generate its own image,
price or product URL. Those values are loaded from
`src/data/perfumes.ts`.

When the assistant is listing several variants or products, the
interface keeps the answer as a text list instead of filling the chat
with multiple product cards.

This creates a customer journey of:

``` text
AI discovery → Visual recommendation → Product page → WhatsApp purchase handoff
```

------------------------------------------------------------------------

### 💬 AI-to-WhatsApp Handoff

WhatsApp is treated as a purchase and human-support channel rather than
a replacement for the AI assistant.

The chatbot can answer normal catalogue questions inside the website.
When the customer demonstrates purchase intent, explicitly requests
human assistance, or asks for business information that is not safely
available to the AI, the server can return a structured WhatsApp action.

The application then creates the trusted WhatsApp URL using the official
Perfuma Angola configuration.

This prevents the language model from inventing contact links or
sensitive business information.

------------------------------------------------------------------------

### 🎓 What We Learned Building the AI Assistant

Developing the Perfuma Angola assistant was an important project
milestone because it introduced practical AI engineering into the
application.

The development process provided hands-on experience with:

-   Integrating a language model through an external API
-   Building a secure serverless AI endpoint with TypeScript
-   Protecting API keys with environment variables
-   Prompt engineering and defining AI behaviour
-   Grounding AI responses in trusted catalogue and business data
-   Combining AI reasoning with deterministic application logic
-   Maintaining recent conversational context
-   Handling ambiguous follow-up messages
-   Normalizing text, accents, spacing and common typing variations
-   Preventing unsupported business information from being invented
-   Designing structured actions instead of allowing AI-generated URLs
-   Connecting AI recommendations to real React product components
-   Building visual catalogue-backed recommendations
-   Implementing safe WhatsApp purchase handoffs
-   Handling provider errors and rate limits
-   Reducing unnecessary token usage
-   Testing AI conversations as multi-turn user journeys
-   Regression testing after chatbot changes
-   Separating the AI "brain" from the frontend presentation layer

#### Did we train our own AI model?

During development we may informally describe the process as "training"
or teaching the Perfuma Angola chatbot because we customized how it
behaves and what business information it can use.

Technically, however, the underlying language model was **not fine-tuned
and its model weights were not changed**.

The current architecture specializes an existing language model through:

``` text
Prompt engineering
        +
Catalogue grounding
        +
Business knowledge
        +
Conversation context
        +
Deterministic TypeScript logic
        +
Controlled application actions
```

Understanding this distinction was one of the key lessons from the
project.

A future version could explore model fine-tuning if there is a genuine
business requirement, but the current architecture provides
customization without requiring Perfuma Angola to train or host its own
language model.

------------------------------------------------------------------------

**\### 🌍 Portuguese & English**

Perfuma Angola was designed with **\*\*Portuguese as the primary
language\*\***, reflecting its Angolan market.

Customers can switch between:

\- 🇦🇴 **\*\*Português\*\***

\- 🇬🇧 **\*\*English\*\***

Navigation, product information, customer-facing content and chatbot
experiences are designed around this bilingual structure.

**---**

**\### 📱 Responsive Design**

The interface was designed to adapt across:

\- Desktop computers

\- Laptops

\- Tablets

\- Smartphones

The visual identity uses a luxury-inspired combination of elegant
typography, warm neutral tones, refined spacing and subtle interactions.

**---**

**\## 🛠️ Technology Stack**

\| Technology           \| Purpose                                      
\|

\| -------------------- \| ---------------------------------------------
\|

\| **\*\*React\*\***            \| Component-based user interface      
         \|

\| **\*\*TypeScript\*\***       \| Type-safe application development    
        \|

\| **\*\*Vite\*\***             \| Development environment and
production builds \|

\| **\*\*CSS3\*\***             \| Custom responsive and luxury-inspired
styling \|

\| **\*\*React Router DOM\*\*** \| Client-side navigation and product
routes     \|

\| **\*\*Lucide React\*\***     \| Interface icons                      
        \|

\| **\*\*Groq API\*\***         \| AI assistant integration            
         \|

\| **\*\*GPT-OSS\*\***          \| Language model used by the assistant
         \|

\| **\*\*Vercel Functions\*\*** \| Server-side API functionality        
        \|

\| **\*\*Open Graph\*\***       \| Rich product-sharing metadata        
        \|

\| **\*\*WhatsApp\*\***         \| Direct customer ordering            
         \|

\| **\*\*Vercel\*\***           \| Production hosting and deployment    
        \|

**---**

**\## 🏗️ Project Architecture**

\`\`\`text

perfuma-angola/

│

├── api/

│   ├── chat.ts

│   └── share.ts

│

├── public/

│   └── images/

│       └── perfumes/

│

├── src/

│   ├── components/

│   ├── config/

│   ├── context/

│   ├── data/

│   ├── i18n/

│   ├── pages/

│   ├── types/

│   ├── utils/

│   ├── App.tsx

│   └── main.tsx

│

├── .env.example

├── .gitignore

├── index.html

├── package.json

├── tsconfig.json

├── vercel.json

└── vite.config.ts

\`\`\`

**\### Important Areas**

**\#### \`src/data/perfumes.ts\`**

Contains the perfume catalogue and product information.

**\#### \`src/i18n/\`**

Contains the Portuguese and English interface translations.

**\#### \`src/components/\`**

Contains reusable interface components used throughout the application.

**\#### \`src/pages/\`**

Contains the main website pages and product experiences.

**\#### \`src/utils/\`**

Contains reusable business logic such as stock handling, WhatsApp
ordering and chatbot fallback behaviour.

**\#### \`api/chat.ts\`**

Server-side endpoint responsible for communication with the AI service.

**\#### \`api/share.ts\`**

Server-side endpoint responsible for generating product-sharing
metadata.

**---**

**\## 🚀 Running the Project Locally**

**\### 1. Clone the repository**

\`\`\`bash

git clone \<your-repository-url\>

\`\`\`

**\### 2. Enter the project**

\`\`\`bash

cd perfuma-angola

\`\`\`

**\### 3. Install dependencies**

\`\`\`bash

npm install

\`\`\`

**\### 4. Start the development server**

\`\`\`bash

npm run dev

\`\`\`

Vite will provide a local development URL in the terminal.

**---**

**\## 🏗️ Production Build**

To create an optimized production build:

\`\`\`bash

npm run build

\`\`\`

The compiled application will be generated inside:

\`\`\`text

dist/

\`\`\`

**---**

**\## 🔐 Environment Variables**

Some functionality requires environment variables.

Create a local \`.env.local\` file when necessary.

Example:

\`\`\`env

GROQ_API_KEY=your_private_api_key

GROQ_MODEL=your_model_name

VITE_SITE_URL=your_public_website_url

\`\`\`

\> ⚠️ **\*\*Never commit \`.env\`, \`.env.local\`, API keys or other
secrets to GitHub.\*\***

Environment files containing secrets are excluded through
\`.gitignore\`.

**---**

**\## 🧴 Adding a New Perfume**

The catalogue is designed to make product management straightforward.

**\### Step 1 --- Add the image**

Place the product image inside:

\`\`\`text

public/images/perfumes/

\`\`\`

**\### Step 2 --- Open the catalogue**

Navigate to:

\`\`\`text

src/data/perfumes.ts

\`\`\`

**\### Step 3 --- Add the product**

Create a new perfume object with a **\*\*unique ID and slug\*\***.

Example structure:

\`\`\`ts

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

    pt: \['Nota 1', 'Nota 2'\],

    en: \['Note 1', 'Note 2'\]

  }

}

\`\`\`

Once added, the existing catalogue architecture can use the new product
throughout the website without manually creating a separate product
page.

**---**

**\## 🔒 Security**

Security considerations were included from the beginning of the project.

The application follows principles such as:

\- API secrets remain server-side

\- Environment files are excluded from Git

\- No secret keys are embedded in frontend source code

\- AI requests are handled through server-side endpoints

\- Customer ordering is redirected through official business contact
channels

\- Product information is centrally managed to reduce inconsistencies

**---**

**\## 🗺️ Current Architecture & Future Growth**

The current version intentionally keeps the purchasing process
lightweight.

It does **\*\*not currently require\*\***:

\- Customer accounts

\- Authentication

\- A traditional shopping cart

\- An internal checkout system

\- A product database

\- An integrated online payment gateway

Instead, catalogue data is managed directly within the application and
customer orders continue through WhatsApp.

The architecture leaves room for future development such as:

\- Database-backed inventory

\- Administrative dashboard

\- Customer accounts

\- Shopping cart

\- Online checkout

\- Order management

\- Automated stock updates

\- Payment gateway integration

\- Analytics and reporting

\- Customer order history

These capabilities can be introduced as the platform and business
requirements grow.

**---**

**\## 👨‍💻 Development**

Perfuma Angola was developed as a custom web application rather than
using a pre-built e-commerce platform.

The project demonstrates practical implementation of:

**\*\*React architecture · TypeScript · responsive UI development ·
reusable components · bilingual interfaces · API integration ·
serverless backend functionality · prompt engineering · AI grounding ·
conversational context · controlled AI actions · AI-assisted customer
experiences · WhatsApp commerce · catalogue management · production
deployment\*\***

**---**

**\## 🇦🇴 Built for Angola**

Perfuma Angola is designed around a simple principle:

\> **\*\*Make discovering and ordering a fragrance elegant, personal and
uncomplicated.\*\***

From bilingual customer interaction to direct WhatsApp ordering, the
platform is designed around the needs of the business and its customers.

**---**

\<div *align*="center"\>

**\### Perfuma Angola**

**\*\*Elegância · Personalidade · Confiança\*\***

Made with ❤️ in Angola 🇦🇴

\</div\>
