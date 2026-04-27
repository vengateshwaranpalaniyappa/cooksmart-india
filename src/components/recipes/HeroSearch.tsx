'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bot, Flame, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Recipe } from '@/lib/api';

export function HeroSearch() {
  const [tab, setTab] = useState<'search' | 'ai'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tab === 'search' && searchQuery.trim().length > 2) {
        performSearch(searchQuery);
      } else if (searchQuery.trim().length === 0) {
        setResults([]);
        setHasSearched(false);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, tab]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const ingredients = query.split(',').map(i => i.trim()).filter(Boolean);
      
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'search' && searchQuery) {
      // Navigate to results page
      router.push(`/results?q=${encodeURIComponent(searchQuery)}`);
    } else if (tab === 'ai') {
      router.push(`/ai-generator`);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Dynamic Daily Hook */}
      <div className="mb-6 flex items-center gap-2 bg-foreground/5 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 text-sm font-bold text-foreground/80 animate-fade-in">
        <Flame className="w-4 h-4 text-orange-500" />
        Today’s Budget Meal: Paneer Bhurji (₹45, 22g protein)
      </div>

      {/* Tabs */}
      <div className="flex bg-foreground/5 p-1 rounded-full mb-6 w-full max-w-sm relative z-10 border border-border/50">
        <button 
          type="button"
          onClick={() => setTab('search')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${tab === 'search' ? 'bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-400 shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
        >
          <Search className="w-4 h-4" />
          By Ingredients
        </button>
        <button 
          type="button"
          onClick={() => setTab('ai')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${tab === 'ai' ? 'bg-gradient-to-r from-brand-500 to-rose-500 text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
        >
          <Bot className="w-4 h-4" />
          Generate with AI
        </button>
      </div>

      {/* Input Area */}
      <div className="w-full relative group/search z-20">
        <div className={`absolute inset-0 rounded-[2rem] blur opacity-20 transition-opacity duration-500 ${tab === 'ai' ? 'bg-gradient-to-r from-brand-500 to-rose-500 group-hover/search:opacity-50' : 'bg-brand-500 group-hover/search:opacity-40'}`}></div>
        
        <form onSubmit={handleSearchSubmit} className="relative flex flex-col w-full bg-card/95 backdrop-blur-md border border-border/60 rounded-[2rem] p-3 shadow-2xl focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20 transition-all">
          
          {tab === 'search' ? (
            <div className="flex items-center h-16 px-4">
              <Search className="w-6 h-6 text-brand-500 mr-4 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="E.g., Chicken, Onion, Tomato, Rice..." 
                className="w-full h-full bg-transparent border-none outline-none text-lg text-foreground placeholder:text-foreground/40 font-semibold"
              />
              {isSearching && <Loader2 className="w-6 h-6 animate-spin text-brand-500 mr-4 shrink-0" />}
              <button 
                type="submit"
                className="hidden md:flex ml-2 bg-brand-500 hover:bg-brand-600 text-white rounded-full px-6 h-12 items-center justify-center font-bold text-sm tracking-wide transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/30 whitespace-nowrap"
              >
                Find Recipes
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1.5 ml-1">Ingredients</label>
                  <input type="text" placeholder="What do you have?" className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1.5 ml-1">Goal</label>
                  <select className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all appearance-none cursor-pointer">
                    <option>High Protein / Muscle Gain</option>
                    <option>Weight Loss / Low Calorie</option>
                    <option>Budget Friendly (Under ₹100)</option>
                    <option>Quick & Easy (Under 15m)</option>
                  </select>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => router.push('/ai-generator')}
                className="w-full mt-2 bg-gradient-to-r from-brand-500 to-rose-500 hover:from-brand-600 hover:to-rose-600 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-500/25"
              >
                <Sparkles className="w-5 h-5" />
                Generate Smart Recipe
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Live Search Results Panel */}
      {tab === 'search' && hasSearched && (
        <div className="w-full mt-6 bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 z-10 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Instant Matches</h3>
          </div>
          
          {!isSearching && results.length === 0 && (
            <div className="bg-foreground/5 rounded-2xl p-6 text-center text-foreground/60 font-medium">
              No recipes found for these ingredients. Try adding something else or use AI!
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.slice(0, 4).map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}

          {isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="h-48 rounded-[2rem] bg-foreground/5 animate-pulse"></div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pills */}
      {!hasSearched && (
        <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3 items-center z-10">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest mr-1 md:mr-2">Trending:</span>
          {['Paneer', 'High Protein Diet', 'Under ₹50', 'Quick Snacks'].map(tag => (
            <Link key={tag} href={`/categories`} className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-foreground/5 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 text-xs md:text-sm font-bold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/30 border border-foreground/10">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
