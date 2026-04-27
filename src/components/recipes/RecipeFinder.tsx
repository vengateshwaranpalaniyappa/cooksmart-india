'use client';

import { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { RecipeCard } from '@/components/ui/RecipeCard';
import type { Recipe } from '@/lib/api';

export function RecipeFinder() {
  const [ingredients, setIngredients] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?ingredients=${encodeURIComponent(ingredients)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div className="glass-card p-6 md:p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
          Smart Recipe Finder <Sparkles className="text-brand-500 w-8 h-8" />
        </h1>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl">
          Don't know what to cook? Just tell us what ingredients you have in your fridge, and we'll give you the perfect Indian recipes.
        </p>

        <form onSubmit={handleSearch} className="flex items-center w-full bg-background border-2 border-brand-200 dark:border-brand-900 rounded-full h-16 px-6 shadow-xl shadow-brand-900/5 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20 transition-all">
          <Search className="w-6 h-6 text-brand-500 mr-4 shrink-0" />
          <input 
            type="text" 
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., Rice, Dal, Onion, Tomato" 
            className="w-full h-full bg-transparent border-none outline-none text-lg text-foreground placeholder:text-foreground/40 font-medium"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-8 py-2 ml-4 flex items-center font-bold tracking-wide transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find Recipes'}
          </button>
        </form>
      </div>

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-20 glass-card">
          <h2 className="text-2xl font-bold tracking-tight mb-2">No recipes found 😔</h2>
          <p className="text-foreground/70">Try entering different ingredients or use our AI Generator.</p>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(idx => (
            <div key={idx} className="h-72 glass-card animate-pulse bg-brand-50/50 dark:bg-brand-900/20" />
          ))}
        </div>
      )}

      {results.length > 0 && !loading && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Found {results.length} Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
