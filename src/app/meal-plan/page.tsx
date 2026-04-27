import { getRecipes } from '@/lib/api';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Calendar, Flame, IndianRupee, Beef, Sparkles } from 'lucide-react';

export const revalidate = 86400; // Cache for 24 hours

export default async function MealPlanPage() {
  const recipes = await getRecipes();
  
  // Deterministic seed based on today's date so it changes every day
  // Since we are using ISR (revalidate: 86400), it will regenerate once a day anyway.
  
  // Categorize pools
  const breakfastPool = recipes.filter(r => r.calories < 400 || r.category.some(c => c.toLowerCase().includes('snack') || c.toLowerCase().includes('breakfast')));
  const lunchPool = recipes.filter(r => (r.calories >= 400 && r.calories <= 600) || r.category.some(c => c.toLowerCase().includes('lunch') || c.toLowerCase().includes('budget')));
  const dinnerPool = recipes.filter(r => (r.protein && r.protein > 20) || r.category.some(c => c.toLowerCase().includes('gym') || c.toLowerCase().includes('dinner')));

  // Deterministic seed based on today's date so it changes exactly once per day
  const now = new Date();
  const seed = now.getFullYear() + now.getMonth() + now.getDate();
  
  const getDailyRecipe = (pool: any[]) => {
    if (pool.length === 0) return recipes[0];
    return pool[seed % pool.length];
  };

  const breakfast = getDailyRecipe(breakfastPool);
  const lunch = getDailyRecipe(lunchPool);
  const dinner = getDailyRecipe(dinnerPool);

  const plan = [
    { label: "Breakfast (Light & Energetic)", recipe: breakfast },
    { label: "Lunch (Balanced & Filling)", recipe: lunch },
    { label: "Dinner (High Protein Recovery)", recipe: dinner }
  ];

  const totalCalories = plan.reduce((acc, meal) => acc + meal.recipe.calories, 0);
  const totalCost = plan.reduce((acc, meal) => acc + (meal.recipe.cost || 0), 0);
  const totalProtein = plan.reduce((acc, meal) => acc + (meal.recipe.protein || 0), 0);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-brand-600 to-rose-600 p-8 md:p-16 text-white overflow-hidden shadow-2xl mb-12 mt-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-widest flex items-center gap-2 border border-white/20">
            <Calendar className="w-4 h-4" /> {today}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-balance">
          Your Daily Meal Plan
        </h1>
        <p className="text-lg text-white/80 max-w-2xl font-medium text-balance">
          We've curated a perfect, balanced day of eating to help you hit your goals while staying within budget.
        </p>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="glass-card p-6 flex items-center gap-5 group hover:border-brand-500/50 transition-colors">
          <div className="p-4 bg-orange-100 dark:bg-orange-900/40 rounded-2xl text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-foreground/60 font-bold uppercase tracking-widest mb-1">Total Calories</p>
            <p className="text-3xl font-black">{totalCalories} <span className="text-lg text-foreground/40 font-semibold">kcal</span></p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5 group hover:border-emerald-500/50 transition-colors">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <IndianRupee className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-foreground/60 font-bold uppercase tracking-widest mb-1">Estimated Cost</p>
            <p className="text-3xl font-black">{totalCost}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5 group hover:border-rose-500/50 transition-colors">
          <div className="p-4 bg-rose-100 dark:bg-rose-900/40 rounded-2xl text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
            <Beef className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-foreground/60 font-bold uppercase tracking-widest mb-1">Total Protein</p>
            <p className="text-3xl font-black">{totalProtein}<span className="text-lg text-foreground/40 font-semibold">g</span></p>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-12 relative">
        <div className="absolute left-8 top-12 bottom-12 w-1 bg-border/50 hidden lg:block -z-10 rounded-full"></div>
        
        {plan.map((meal, idx) => (
          <div key={idx} className="flex flex-col lg:flex-row gap-6 lg:gap-12 relative">
            <div className="lg:w-1/3 flex lg:justify-end items-start pt-6">
              <div className="bg-card border-2 border-border/60 shadow-xl px-6 py-4 rounded-2xl flex items-center gap-3 relative z-10">
                <span className="w-3 h-3 rounded-full bg-brand-500 animate-pulse" />
                <h3 className="text-xl font-bold">{meal.label}</h3>
              </div>
            </div>
            
            <div className="lg:w-2/3">
              <RecipeCard recipe={meal.recipe} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button className="bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl flex items-center gap-2 mx-auto">
          <Sparkles className="w-5 h-5" /> Generate Another Plan
        </button>
      </div>

    </div>
  );
}
