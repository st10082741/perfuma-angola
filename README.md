# ✨ Perfuma Angola

<div align="center">

**Elegância que se sente. Presença que permanece.**

A modern bilingual perfume catalogue and customer experience platform<br>
built for **Perfuma Angola**.

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
- 🤖 Interact with an AI-powered perfume assistant
- 🌍 Switch between Portuguese and English
- 📱 Browse comfortably on desktop, tablet and mobile devices

---

# ✨ Main Features

## 🛍️ Dynamic Perfume Catalogue

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

The catalogue also acts as a trusted source of truth for several other parts of the application, including product pages, stock availability, AI recommendations and WhatsApp ordering.

---

## 📦 Stock-Based Availability

Product availability is derived directly from the perfume's stock quantity.

For example:

```ts
stock: 8; // Available
stock: 2; // Low stock
stock: 0; // Out of stock
```

This provides a simple source of truth for catalogue availability while keeping inventory management practical for the current stage of the business.

The same stock information can also be used by the AI assistant to prevent unavailable products from entering the normal purchase handoff.

---

## 💬 WhatsApp Ordering

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

The website does **not** currently pretend to:

- Process payments internally
- Complete an order inside the chatbot
- Collect delivery addresses through the AI
- Provide a traditional shopping cart
- Provide an internal checkout system

Those responsibilities remain with the business through the controlled WhatsApp handoff.

---

## 🖼️ Product Sharing Architecture

The project includes a server-side product-sharing endpoint designed to generate Open Graph metadata for individual perfumes.

This allows shared product links to provide platforms such as WhatsApp with information including:

- Product name
- Description
- Product image
- Product URL
- Website name

The sharing endpoint is handled separately from the main customer-facing product page.

This architecture provides richer product sharing while keeping the actual product experience inside the Perfuma Angola website.

---

# 🤖 AI-Powered Perfume Assistant

Perfuma Angola includes an AI-powered virtual sales assistant built directly into the website rather than operating as a separate chatbot service.

The assistant combines:

- The Perfuma Angola catalogue
- Verified business knowledge
- Recent conversation context
- Deterministic TypeScript logic
- A provider-independent AI layer
- An external language model

**Groq is currently the external AI provider**, but the main chatbot architecture is no longer designed around Groq itself.

This distinction is important.

The language model helps understand natural conversation.

The Perfuma Angola application remains responsible for trusted business behaviour.

---

## 💡 What the Assistant Can Do

The assistant can:

- Understand natural Portuguese and English customer questions
- Tolerate common spelling mistakes
- Understand Portuguese messages written without accents
- Remember recent conversation context during the current session
- Recommend perfumes according to category, preference and price
- Understand follow-up messages such as `e masculino?`, `mais barato`, `quanto custa?` and `quero o de 30ml`
- Read trusted product names, prices, sizes and availability from the catalogue
- Display focused visual product recommendations
- Link recommendations to existing product pages
- Detect clear purchase intent
- Provide a controlled WhatsApp handoff
- Answer confirmed payment and delivery information
- Protect sold-out products from normal purchase flows
- Avoid inventing unknown business information
- Fall back safely when the external AI provider is temporarily unavailable or rate-limited

The private AI API credentials remain server-side and are never intentionally exposed in the customer's browser.

---

# 🧠 How the AI Assistant Works

The current request flow is:

```text
Customer
   ↓
React Chatbot
Chatbot.tsx
   ↓
Vercel Serverless API
api/chat.ts
   ↓
Perfuma Angola Application Logic
   ├── Catalogue
   ├── Business Knowledge
   ├── Conversation Context
   ├── Product Resolution
   ├── Purchase Intent
   ├── Stock Protection
   └── WhatsApp Handoff
   ↓
AI Provider Layer
api/ai/index.ts
   ↓
AIProvider Contract
api/ai/types.ts
   ↓
Groq Adapter
api/ai/providers/groq.ts
   ↓
Groq API / Language Model
   ↓
Validated Assistant Response
   ↓
Text Response / Product Card / WhatsApp Handoff
```

This separation is intentional.

The **AI layer** is useful for:

- Flexible language
- Recommendations
- Conversational follow-ups
- Understanding customer intent
- Handling different ways of asking the same question

The **application layer** remains responsible for:

- Trusted catalogue information
- Business rules
- Product matching
- Stock protection
- Purchase actions
- Verified business information
- WhatsApp links

The external AI provider therefore does not control the business.

---

# 🔌 Provider-Independent AI Architecture

One of the most important architectural improvements made during development was separating the Perfuma Angola chatbot from the specific AI provider.

The provider layer is structured approximately as follows:

```text
api/
├── ai/
│   ├── index.ts
│   ├── types.ts
│   └── providers/
│       └── groq.ts
├── chat.ts
└── share.ts
```

### `api/chat.ts`

This is the main Perfuma Angola chatbot/business layer.

It coordinates:

- Conversation context
- Catalogue grounding
- Product resolution
- Purchase intent
- Business-information handling
- Sold-out protection
- Deterministic actions
- WhatsApp handoff
- Communication with the AI provider layer

Provider-specific networking should not dominate this file.

### `api/ai/types.ts`

Defines the common TypeScript contract used by AI providers.

The application can work with a standard `AIProvider` interface rather than depending directly on Groq-specific request and response formats.

### `api/ai/index.ts`

Acts as the provider registry and selector.

The configured provider can be selected through:

```env
AI_PROVIDER=groq
```

Groq remains the current provider.

### `api/ai/providers/groq.ts`

Contains the Groq-specific adapter.

This includes responsibilities such as:

- Reading Groq environment configuration
- Sending requests to Groq
- Formatting provider requests
- Parsing provider responses
- Handling provider errors
- Detecting rate limits

The architecture can therefore be summarized as:

```text
Perfuma Angola
      ↓
api/chat.ts
      ↓
AI Provider Interface
      ↓
Provider Selector
      ↓
Groq Adapter
      ↓
Groq API
```

The important principle is:

> **Do not replace Groq unnecessarily. Make Groq replaceable.**

---

# 🔮 Future AI Provider Expansion

The provider-independent architecture creates room for additional AI providers later.

For example:

```text
AIProvider
   ├── Groq
   ├── Future Provider A
   └── Future Provider B
```

A future reliability architecture could become:

```text
Perfuma Angola Chatbot
        ↓
AI Provider Interface
        ↓
Primary Provider — Groq
        ↓
Provider failure / rate limit
        ↓
Future Backup Provider
```

**Automatic provider failover is not currently implemented.**

The architecture only makes it easier to introduce later without rewriting the core chatbot.

A future backup provider should activate because of a genuine technical failure, rate limit or unusable provider response—not simply because one provider produced wording that was not preferred.

Even if all AI providers were unavailable, deterministic Perfuma Angola business logic can still remain separate from the external language-model layer.

---

# 💭 Conversation Context

The assistant maintains recent conversation context during the current chat session.

This allows customers to communicate naturally without repeating full product names.

For example:

```text
Customer:
Recomenda um perfume unissexo

Assistant:
Recommends a suitable catalogue product.

Customer:
Mas é caro. Tens um mais barato?

Assistant:
Understands the previous recommendation and suggests a cheaper option.

Customer:
Tem um Lattafa mais barato?

Assistant:
Narrows the recommendation while preserving context.

Customer:
Gostei desse.

Assistant:
Understands which recently recommended product "desse" refers to.

Customer:
Quero prosseguir.

Assistant:
Starts the controlled purchase handoff for that product.
```

The same principle applies to English conversations.

For example:

```text
Customer:
Recommend a perfume.

Customer:
Do you have a cheaper one?

Customer:
I like this one.

Customer:
I want to proceed.
```

Recent context allows these messages to form one conversation rather than being treated as completely unrelated requests.

---

# 🌍 Portuguese & English AI Behaviour

Perfuma Angola was designed with **Portuguese as the primary customer-facing language**, reflecting its Angolan market.

The assistant also supports English.

Customers may type Portuguese without diacritics because of their keyboard configuration.

For example:

```text
e masculino?
```

can be interpreted as:

```text
é masculino?
```

and:

```text
nao
```

can be interpreted as:

```text
não
```

The objective is to understand normal customer communication rather than require perfect spelling.

Portuguese and English share the same underlying:

- Catalogue
- Business rules
- Stock protection
- Product context
- Purchase architecture
- WhatsApp handoff logic

---

# 🖼️ AI Visual Product Recommendations

AI recommendations are connected to the existing Perfuma Angola catalogue.

When the assistant gives a focused recommendation for one known perfume, the React frontend can identify the catalogue product and display a visual recommendation containing:

- Product image
- Brand
- Product name
- Size
- Price
- `Ver produto` / `View product` action

The visual card does **not** trust the language model to invent its own product image, price or URL.

Those values come from:

```text
src/data/perfumes.ts
```

When the assistant lists several variants or products, the interface can keep the answer as text rather than filling the chat with unnecessary product cards.

The intended customer journey is:

```text
AI discovery
      ↓
Visual recommendation
      ↓
Existing product page
      ↓
WhatsApp purchase handoff
```

This keeps the visual recommendation system separate from the chatbot reasoning layer.

---

# 💬 AI-to-WhatsApp Handoff

WhatsApp is treated as a purchase and human-support channel rather than a replacement for the AI assistant.

The chatbot can answer normal catalogue questions inside the website.

When the customer:

- Demonstrates clear purchase intent
- Explicitly requests human assistance
- Requests WhatsApp
- Requires sensitive business information that is not safely available to the AI

the server can return a structured WhatsApp action.

The application then creates the trusted WhatsApp URL using the official Perfuma Angola configuration.

This prevents the language model from inventing contact links or sensitive business information.

---

# 🛒 Deterministic Purchase Intent

Natural-language AI is useful for understanding customers, but important application actions should be reliable.

Perfuma Angola therefore uses deterministic logic for selected purchase and handoff situations.

Examples of purchase intent can include:

```text
Quero comprar
Quero prosseguir
Quero continuar com a compra
Quero pagar
Quero fazer o pagamento
```

and:

```text
I want to buy
I want to proceed
I want to make the payment
I want to pay
```

Common typing mistakes can also be handled when an exact application action needs to be guaranteed.

This does **not** mean every possible customer sentence should be hardcoded.

The language model remains responsible for ordinary natural conversation.

Deterministic phrase handling is mainly used where an exact phrase should reliably trigger an application action such as:

- Purchase summary
- WhatsApp continuation
- Human handoff
- Protected business-information handoff

---

# 📦 Sold-Out Protection

Product availability remains controlled by the catalogue.

The application checks the selected product before creating a normal purchase handoff.

Conceptually:

```text
Customer purchase intent
        ↓
Resolve catalogue product
        ↓
Check availability
      ↙     ↘
 Available  Sold out
    ↓          ↓
Purchase    Safe sold-out
handoff      response
```

This prevents a natural-language response from bypassing stock rules.

---

# 💳 Verified Business Information

The assistant can provide business information that has been confirmed for the project.

Current confirmed payment methods include:

- Multicaixa Express
- IBAN / bank transfer
- Cash / Dinheiro

Regular deliveries are currently scheduled for **Sundays**.

The chatbot should not invent unavailable information such as:

- An unconfirmed IBAN
- Unknown bank-account details
- Unconfirmed delivery fees
- Unconfirmed delivery areas
- Unsupported return policies
- Unsupported payment details

When information needs direct confirmation from the business, the customer can be handed off to the Perfuma Angola team.

---

# 🎓 Did We Train Our Own AI Model?

During development, it can be tempting to describe the process as "training" or teaching the Perfuma Angola chatbot because its behaviour was customized.

Technically, however, the underlying language model was **not fine-tuned and its model weights were not changed**.

The current architecture specializes an existing model through:

```text
Prompt Engineering
        +
Catalogue Grounding
        +
Business Knowledge
        +
Conversation Context
        +
Deterministic TypeScript Logic
        +
Controlled Application Actions
```

Understanding this distinction was an important AI-engineering lesson from the project.

A future version could explore fine-tuning if a genuine business requirement justified it, but the current architecture does not require Perfuma Angola to train or host its own foundation model.

---

# 📱 Responsive Design

The interface was designed to adapt across:

- Desktop computers
- Laptops
- Tablets
- Smartphones

The visual identity uses a luxury-inspired combination of elegant typography, warm neutral tones, refined spacing and subtle interactions.

---

# 🛠️ Technology Stack

| Technology | Purpose |
| --- | --- |
| **React** | Component-based user interface |
| **TypeScript** | Type-safe application development |
| **Vite** | Development environment and production builds |
| **CSS3** | Custom responsive and luxury-inspired styling |
| **React Router DOM** | Client-side navigation and product routes |
| **Lucide React** | Interface icons |
| **Groq API** | Current external AI provider |
| **GPT-OSS** | Language model currently used by the assistant |
| **Vercel Functions** | Server-side API functionality |
| **Open Graph** | Rich product-sharing metadata |
| **WhatsApp** | Direct customer ordering and human handoff |
| **Git** | Version control |
| **GitHub** | Remote source-code repository |
| **Vercel** | Production hosting and deployment |

---

# 🏗️ Project Architecture

```text
perfuma-angola/
│
├── api/
│   ├── ai/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── providers/
│   │       └── groq.ts
│   │
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

---

## Important Areas

### `src/data/perfumes.ts`

Contains the perfume catalogue and product information.

It acts as a source of truth for important product information used throughout the application.

### `src/i18n/`

Contains Portuguese and English interface translations.

### `src/components/`

Contains reusable interface components used throughout the application.

This includes the customer-facing chatbot interface.

### `src/pages/`

Contains the main website pages and product experiences.

### `src/utils/`

Contains reusable application logic such as stock handling, WhatsApp ordering and chatbot fallback behaviour.

### `api/chat.ts`

Contains the server-side Perfuma Angola chatbot and business logic.

It coordinates catalogue knowledge, context, deterministic actions and the AI provider layer.

### `api/ai/types.ts`

Defines the provider-neutral AI interfaces used by the backend.

### `api/ai/index.ts`

Selects the configured AI provider and provides the provider-independent entry point used by the chatbot.

### `api/ai/providers/groq.ts`

Contains the current Groq-specific implementation.

### `api/share.ts`

Server-side endpoint responsible for generating product-sharing metadata.

---

# 🚀 Running the Project Locally

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

## 2. Enter the project

```bash
cd perfuma-angola
```

## 3. Install dependencies

```bash
npm install
```

On the current Windows development environment, the command can also be executed as:

```powershell
npm.cmd install
```

## 4. Start the development server

```bash
npm run dev
```

or:

```powershell
npm.cmd run dev
```

Vite will provide a local development URL in the terminal.

---

# 🏗️ Production Build

To create an optimized production build:

```bash
npm run build
```

On the current Windows development environment:

```powershell
npm.cmd run build
```

The `npm.cmd` form is useful when the PowerShell execution policy prevents the `npm.ps1` wrapper from running.

The compiled application is generated inside:

```text
dist/
```

A successful build helps detect:

- TypeScript errors
- Invalid imports
- Vite compilation problems
- Other build-time failures

A successful build does not replace functional testing, but it is an important verification step.

---

# 🔐 Environment Variables

Some functionality requires environment variables.

Create a local `.env.local` file when necessary.

Example:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_private_api_key
GROQ_MODEL=your_model_name
VITE_SITE_URL=your_public_website_url
```

### `AI_PROVIDER`

Selects the current AI provider adapter.

Current value:

```env
AI_PROVIDER=groq
```

### `GROQ_API_KEY`

Contains the private credential used by the server to communicate with Groq.

### `GROQ_MODEL`

Defines the Groq model used by the assistant.

### `VITE_SITE_URL`

Defines the public website URL where required by the application.

> ⚠️ **Never commit `.env`, `.env.local`, API keys or other secrets to GitHub.**

Environment files containing secrets are excluded through `.gitignore`.

---

# 🧴 Adding a New Perfume

The catalogue is designed to make product management straightforward.

## Step 1 — Add the image

Place the product image inside:

```text
public/images/perfumes/
```

## Step 2 — Open the catalogue

Navigate to:

```text
src/data/perfumes.ts
```

## Step 3 — Add the product

Create a new perfume object with a **unique ID and slug**.

Example structure:

```ts
{
  id: 10,
  slug: "example-perfume",
  name: "Example Perfume",
  brand: "Example Brand",
  price: 25000,
  size: "100 ml",
  concentration: "Eau de Parfum",
  category: "Unisex",

  fragranceFamily: {
    pt: "Amadeirado",
    en: "Woody",
  },

  shortDescription: {
    pt: "Descrição curta em português.",
    en: "Short description in English.",
  },

  description: {
    pt: "Descrição completa em português.",
    en: "Full description in English.",
  },

  image: "/images/perfumes/example-perfume.jpg",
  stock: 5,

  notes: {
    pt: ["Nota 1", "Nota 2"],
    en: ["Note 1", "Note 2"],
  },
}
```

Once added, the existing catalogue architecture can use the new product throughout the website without manually creating a separate product page.

---

# 🔒 Security

Security considerations were included throughout the project.

The application follows principles such as:

- API secrets remain server-side
- Environment files are excluded from Git
- Secret keys are not intentionally embedded in frontend source code
- AI requests are handled through server-side endpoints
- Customer ordering is redirected through official business contact channels
- Product information is centrally managed
- AI-generated URLs are not trusted for sensitive application actions
- Sensitive business information should not be invented
- External AI-provider implementation is isolated from core business logic

---

# 🔧 Git & GitHub Development Workflow

Git became an important part of developing Perfuma Angola safely.

The project does not use Git only to upload code.

Git is also used to **verify what actually changed before those changes reach production**.

One of the most important lessons from development was:

> **Do not trust what an edit was supposed to change. Verify what Git proves it changed.**

---

# 🔄 Understanding the Git Flow

The development workflow can be visualized as:

```text
Working Directory
      ↓
   git add
      ↓
Staging Area
      ↓
 git commit
      ↓
Local Git Repository
      ↓
   git push
      ↓
GitHub — origin/main
      ↓
Vercel Deployment
```

### Working Directory

The working directory contains the files currently being edited.

### Staging Area

The staging area contains the changes selected for the next commit.

### Local Repository

A commit creates a checkpoint in the local Git history.

### GitHub

GitHub contains the remote copy of the repository.

### Vercel

The production application is connected to the repository so pushed changes can be deployed.

---

# 🔍 Git Verification Commands

Several commands are used before committing or pushing important changes.

---

## `git status`

```bash
git status
```

Shows the current state of the repository.

It can show:

- Current branch
- Whether the branch is synchronized with the remote
- Modified files
- Staged files
- Untracked files

A completely clean repository reports:

```text
nothing to commit, working tree clean
```

---

## `git diff`

```bash
git diff
```

Shows the actual uncommitted line-by-line changes.

This allows a developer to inspect what Git sees rather than relying on what an editor or automated tool was expected to change.

---

## `git diff --stat`

```bash
git diff --stat
```

Shows a compact summary of the changed files and approximate change size.

Example:

```text
README.md | 8 +++++---
1 file changed, 5 insertions(+), 3 deletions(-)
```

This is useful for quickly detecting an unexpectedly large change.

---

## `git diff --numstat`

For a specific file:

```bash
git diff --numstat -- api/chat.ts
```

This displays numerical additions and deletions.

For example:

```text
17    1    api/chat.ts
```

This command became especially useful during chatbot development because it immediately showed whether a supposedly small patch was actually small.

---

## `git diff --check`

```bash
git diff --check
```

Checks the current diff for whitespace errors.

When Git finds no problems, the command normally produces no output.

---

## `git diff --word-diff=plain`

For documentation:

```bash
git diff --word-diff=plain -- README.md
```

This shows word-level changes.

It became particularly useful during README development because it exposed unwanted Markdown transformations that were harder to understand through line counts alone.

---

# 📦 Staging Changes

After the working-directory diff has been reviewed, changes can be staged.

```bash
git add .
```

`git add` moves selected changes into the staging area.

The `.` represents the current directory and its relevant changes.

For a single file, a more targeted command can also be used:

```bash
git add README.md
```

---

# 💾 Creating a Commit

After staging:

```bash
git commit -m "Describe what changed"
```

A commit creates a local checkpoint.

The `-m` option means **message**, allowing the commit message to be supplied directly in the command.

For example:

```bash
git commit -m "Update project documentation and Git workflow"
```

A useful commit message should describe the purpose of the change.

---

# 🔎 Verifying a Commit Before Push

Creating a commit does not mean it must immediately be pushed.

The committed change can still be inspected first.

## `git show --stat HEAD`

```bash
git show --stat HEAD
```

Shows a summary of the current/latest commit.

`HEAD` represents the commit currently checked out.

The output can be used to verify:

- Commit message
- Changed files
- Additions
- Deletions

---

## `git --no-pager show HEAD -- <file>`

Example:

```bash
git --no-pager show HEAD -- api/chat.ts
```

This displays the committed changes for a specific file.

`--no-pager` prints the output directly in the terminal.

`HEAD` means the current commit.

The second `--` separates the Git revision/options from the file path.

For README changes:

```bash
git --no-pager show HEAD -- README.md
```

This provides one final review before pushing.

---

# ☁️ `git push`

After verification:

```bash
git push
```

uploads local commits to the configured remote repository.

In this project:

```text
origin
```

is the conventional name of the remote repository.

```text
main
```

is the primary branch.

The relationship can be thought of as:

```text
Local main
    ↓
git push
    ↓
origin/main
    ↓
Vercel
```

---

# ↩️ Recovering From Unwanted Changes

Git also provides tools for recovering safely when something goes wrong.

Two particularly important commands used during development were `git restore` and `git revert`.

They solve different problems.

---

## `git restore`

Example:

```bash
git restore README.md
```

This restores an **uncommitted** file to its last committed state.

It is useful when an edit goes wrong before being committed.

For example, when an attempted README replacement unexpectedly changed a large amount of Markdown formatting, the change was inspected and then discarded safely with:

```bash
git restore README.md
```

---

## `git revert`

Example:

```bash
git revert <commit>
```

`git revert` is used when an unwanted change has **already been committed**.

Instead of deleting Git history, it creates a new commit that reverses the earlier commit.

This is safer for shared history because the original commit remains visible.

---

# 🔐 Verifying Private Files

The project includes a private development guide that should not be committed to the public repository.

Its ignored status can be checked with:

```bash
git check-ignore PROJECT-GUIDE.md
```

When Git outputs:

```text
PROJECT-GUIDE.md
```

the file is being ignored successfully.

This helps protect private development documentation from accidental publication.

---

# 🧯 A Real Git Regression We Caught

One of the most useful lessons during development came from what should have been a very small chatbot modification.

The intention was only to expand deterministic purchase-intent phrases.

However, one attempted edit unexpectedly modified a very large portion of:

```text
api/chat.ts
```

The problem was caught by inspecting the Git diff rather than trusting the intended edit.

The incorrect committed change was safely reverted.

The intended change was then reapplied carefully.

The final correct patch contained only:

```text
17 insertions
1 deletion
```

This experience established an important rule for the project:

> **The expected size of a change should roughly match the actual Git diff.**

If a small fix unexpectedly changes hundreds or thousands of lines, development should stop until the cause is understood.

---

# 📝 A README Regression We Also Caught

The same principle later protected the project documentation.

An attempted generated README replacement unexpectedly normalized and escaped large amounts of Markdown.

Instead of immediately committing it, commands such as:

```bash
git diff --stat
```

and:

```bash
git diff --word-diff=plain -- README.md
```

showed that the actual change was much larger than intended.

Because it had not been committed, the original README was safely recovered with:

```bash
git restore README.md
```

This demonstrated that Git verification matters for:

- Source code
- Documentation
- Configuration
- Environment examples
- Architecture files

not only application logic.

---

# ✅ Verification Before Pushing

The project now follows a stricter verification workflow for important changes.

```text
Make one controlled change
        ↓
git diff --stat
        ↓
git diff --numstat
        ↓
git diff --check
        ↓
Review the actual diff
        ↓
npm.cmd run build
        ↓
Test affected functionality
        ↓
git add
        ↓
git commit
        ↓
git show --stat HEAD
        ↓
Review the committed diff
        ↓
git push
        ↓
Verify Vercel deployment
        ↓
Production regression testing
```

The principle is simple:

> **It is easier to stop a bad change before pushing than to repair a production regression afterward.**

---

# 🧪 Production Regression Testing

After important chatbot changes are deployed, the production assistant should be tested as a complete customer journey rather than only through isolated messages.

A typical regression flow includes:

```text
Greeting
   ↓
Recommendation
   ↓
Cheaper alternative
   ↓
Contextual follow-up
   ↓
Payment question
   ↓
Purchase intent
   ↓
WhatsApp handoff
```

Important checks include:

- Portuguese conversation
- English conversation
- Recommendations
- Cheaper alternatives
- Recent product context
- Missing Portuguese accents
- Common typing mistakes
- Product cards
- Correct product images
- Correct product pages
- Correct prices
- Product variants
- Sold-out protection
- Payment information
- Sunday delivery information
- Safe bank-information handling
- Purchase intent
- WhatsApp button
- Correct WhatsApp language
- Correct WhatsApp product context

Testing the full journey matters because a chatbot may answer one isolated message correctly while losing the product context several messages later.

---

# 🎓 What We Learned Building Perfuma Angola

Developing Perfuma Angola provided practical experience beyond simply creating a React website.

The project introduced hands-on experience with:

- React architecture
- TypeScript
- Responsive user-interface development
- Reusable components
- Bilingual interfaces
- Catalogue-driven applications
- Serverless APIs
- External AI APIs
- Prompt engineering
- AI grounding
- Conversation context
- Deterministic business logic
- Text normalization
- Typo tolerance
- Controlled AI actions
- Visual catalogue-backed AI recommendations
- WhatsApp commerce
- Sold-out protection
- Environment variables
- API-key protection
- Provider rate limits
- Provider-independent AI architecture
- Git version control
- Git staging
- Git commits
- Reading diffs
- Reviewing commit history
- Recovering unwanted changes
- Regression testing
- GitHub deployment
- Vercel production deployment

One of the strongest lessons from the project is that software engineering is not only about making code work.

It is also about being able to:

> **Understand what changed, prove what changed, test what changed, recover safely when something goes wrong and design the architecture so future changes remain manageable.**

---

# 🚀 Deployment Architecture

The production workflow is:

```text
Local Development
       ↓
Git Verification
       ↓
Production Build
       ↓
Local Commit
       ↓
Commit Verification
       ↓
GitHub
       ↓
Vercel
       ↓
Production Website
       ↓
Regression Testing
```

This provides a straightforward deployment process while still requiring important changes to be reviewed before they reach production.

The objective is not simply continuous deployment.

The objective is **controlled deployment**.

---

# 🗺️ Current Architecture & Future Growth

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
- Additional AI providers
- AI provider failover
- Additional catalogue-management tools

These capabilities can be introduced as the platform and business requirements grow.

They should not be added merely for complexity.

The current architecture prioritizes what Perfuma Angola needs now while leaving sensible paths for future expansion.

---

# 👨‍💻 Development

Perfuma Angola was developed as a custom web application rather than using a pre-built e-commerce platform.

The project demonstrates practical implementation of:

**React architecture · TypeScript · responsive UI development · reusable components · bilingual interfaces · API integration · serverless backend functionality · prompt engineering · AI grounding · conversational context · deterministic application logic · provider-independent AI architecture · controlled AI actions · visual product recommendations · WhatsApp commerce · catalogue management · Git version control · regression testing · production deployment**

---

# 🇦🇴 Built for Angola

Perfuma Angola is designed around a simple principle:

> **Make discovering and ordering a fragrance elegant, personal and uncomplicated.**

From bilingual customer interaction to AI-assisted perfume discovery and direct WhatsApp ordering, the platform is designed around the needs of the business and its customers.

---

<div align="center">

### Perfuma Angola

**Elegância · Personalidade · Confiança**

Made with ❤️ in Angola 🇦🇴

</div>