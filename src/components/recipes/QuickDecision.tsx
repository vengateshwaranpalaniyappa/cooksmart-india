'use client';

import { useState } from 'react';
import { Recipe } from '@/lib/api';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Sparkles } from 'lucide-react';

export function QuickDecision({ recipes }: { recipes: Recipe[] }) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleSuggest = () => {
    // Mock logic: randomly pick one
    const randomIdx = Math.floor(Math.random() * recipes.length);
    setSelectedRecipe(recipes[randomIdx]);
  };

  return (
    <section className="bg-brand-50/50 dark:bg-brand-900/10 rounded-[2.5rem] p-8 md:p-12 border border-brand-100 dark:border-brand-900/50 flex flex-col items-center text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-rose-500/5 z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
          What Should I Cook Now?
        </h2>
        <p className="text-foreground/70 mb-8 max-w-md">
          Can't decide? Let us pick the perfect meal for you based on your goals, time, and budget.
        </p>
        
        <button 
          onClick={handleSuggest}
          className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-500/20 mb-10"
        >
          <Sparkles className="w-5 h-5" />
          Suggest Meal Instantly
        </button>

        {selectedRecipe && (
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
            <RecipeCard recipe={selectedRecipe} />
          </div>
        )}
      </div>
    </section>
  );
}
