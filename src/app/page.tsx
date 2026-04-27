export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';
import { getRecipes } from '@/lib/api';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { HeroSearch } from '@/components/recipes/HeroSearch';
import { QuickDecision } from '@/components/recipes/QuickDecision';
import { PersonalizedRecipes } from '@/components/recipes/PersonalizedRecipes';

export default async function Home() {
  const recipes = await getRecipes();
  
  // Simulated featured and trending recipes
  const featured = recipes.slice(0, 4);
  const budgetMeals = recipes.filter(r => r.category.includes('Budget')).slice(0, 4);

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-card/60 backdrop-blur-2xl border border-border/50 shadow-2xl p-6 md:p-16 flex flex-col items-center justify-center text-center mt-4 group">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400/30 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-400/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000" />
        
        <div className="bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900 dark:to-brand-800 p-4 rounded-full mb-6 relative shadow-xl shadow-brand-500/20">
          <div className="absolute inset-0 rounded-full bg-brand-400 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
          <ChefHat className="w-10 h-10 md:w-12 md:h-12 text-brand-600 dark:text-brand-300 relative z-10" />
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 text-balance leading-tight">
          What's in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-rose-500">fridge today?</span>
        </h1>
        <p className="text-base md:text-xl text-foreground/70 mb-8 max-w-2xl text-balance font-medium">
          Your personal cooking assistant. Enter ingredients, set goals, and let AI do the rest.
        </p>

        <HeroSearch />
      </section>

      <PersonalizedRecipes recipes={recipes} />

      {/* Ad Space Placeholder 1 */}
      <div className="w-full bg-foreground/5 border border-dashed border-border/50 rounded-2xl h-24 md:h-32 flex flex-col items-center justify-center text-foreground/40 font-bold uppercase tracking-widest relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
        <span className="text-sm md:text-base">Ad Space / Partner Integration</span>
        <span className="text-[10px] mt-1 opacity-50">Monetization Ready</span>
      </div>

      <QuickDecision recipes={recipes} />

      {/* Featured Section */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Daily Featured</h2>
            <p className="text-foreground/70">Handpicked Indian recipes just for you.</p>
          </div>
          <Link href="/recipes" className="text-brand-600 font-semibold hover:underline hidden md:block">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Ad Space Placeholder 2 */}
      <div className="w-full bg-foreground/5 border border-dashed border-border/50 rounded-2xl h-24 flex items-center justify-center text-foreground/40 font-bold uppercase tracking-widest text-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
        Ad Space
      </div>

      {/* Budget Meals Section */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Budget Meals</h2>
            <p className="text-foreground/70">Delicious and nutritious meals under ₹50.</p>
          </div>
          <Link href="/categories/budget" className="text-brand-600 font-semibold hover:underline hidden md:block">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {budgetMeals.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Retention Banner */}
      <div className="w-full bg-gradient-to-r from-brand-500 to-rose-500 rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="mb-6 md:mb-0 z-10 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-black mb-2">Get daily meal ideas</h3>
          <p className="text-white/80 font-medium">Join 10,000+ foodies cooking smarter every day.</p>
        </div>
        <button className="z-10 bg-white text-brand-600 font-bold px-8 py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2">
          Subscribe (Coming Soon)
        </button>
      </div>

    </div>
  );
}
