'use client';

import { useState } from 'react';
import { Recipe } from '@/lib/api';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { X, Sparkles, UtensilsCrossed } from 'lucide-react';

export function SuggestNextMeal({ recipes }: { recipes: Recipe[] }) {
  const [suggestion, setSuggestion] = useState<Recipe | null>(null);

  const handleSuggest = () => {
    // Pick a random recipe as suggestion, could be enhanced with logic
    const random = recipes[Math.floor(Math.random() * recipes.length)];
    setSuggestion(random);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-500">
        <button 
          onClick={handleSuggest}
          className="bg-foreground text-background px-8 py-4 rounded-full font-black text-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-background/20"
        >
          <UtensilsCrossed className="w-5 h-5" /> Suggest Next Meal
        </button>
      </div>

      {suggestion && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden relative animate-in zoom-in-95 duration-300">
            <div className="p-6 pb-2 flex items-center justify-between relative z-10">
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-rose-500 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-500" /> Next Meal
              </h3>
              <button 
                onClick={() => setSuggestion(null)} 
                className="bg-foreground/5 hover:bg-foreground/10 p-2.5 rounded-full transition-colors active:scale-95"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
            <div className="p-4 pt-2">
              <RecipeCard recipe={suggestion} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
