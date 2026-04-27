# CookSmart India 🇮🇳🍳
Modern, SEO-optimized, AI-powered Indian recipe discovery and meal planning platform.

## Features
- **Smart Ingredient Search**: Discover what to cook based on the ingredients you already have in the kitchen.
- **AI Recipe Generator**: Uses OpenAI to generate custom recipes based on dietary needs (e.g., Muscle Gain, Weight Loss, Healthy, Budget).
- **SEO Ready**: Automatically structured schema markups, dynamic robots/sitemap tags, and fast server-rendered components.
- **Modern UI**: Polished glassmorphic aesthetic built with Tailwind CSS v4 and Lucide React.
- **Categorized Recipes**: Curated database for Indian Veg, Non-Veg, High-Protein, and Budget options `<₹50`.

## Tech Stack
- Next.js 14+ (App Router)
- React 19
- Tailwind CSS v4 (app custom `@theme`)
- Lucide React Icons
- Local JSON mock DB (ready for MongoDB integration via `mongoose`)

## Getting Started

1. Clone or download the repository.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` or `.env.local` and add your keys:
   ```bash
   cp .env.example .env.local
   ```
   You will need to manually specify an `OPENAI_API_KEY` to use the actual AI Recipe Generator. Without it, the app will return a mock generated recipe for testing.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Import the project into Vercel.
3. Don't forget to add `OPENAI_API_KEY` in your Vercel Environment Variables in the project settings!
4. Click Deploy. Vercel will automatically detect `next build` and deploy the app on their edge network.

To run the app with a backend manually (e.g., on Render): 
You can use `npm run build` followed by `npm run start` after pointing your app to a continuous Node.js service.

## Database (Current)
Currently we are leveraging local `data/recipes.json` directly within the Next.js API Routes for zero-overhead startup speed. If you wish to migrate to MongoDB, `mongoose` has already been pre-installed. You can setup connection strings in `.env` and migrate the data model logic inside `src/lib/api.ts` to `mongoose` calls.
