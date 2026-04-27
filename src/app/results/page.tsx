'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Recipe } from '@/lib/api';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Loader2, SlidersHorizontal, Search, TrendingUp } from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [rawRecipes, setRawRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [maxCost, setMaxCost] = useState<number>(500);
  const [minProtein, setMinProtein] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(120);
  
  // Sorting state
  const [sortMethod, setSortMethod] = useState<'bestMatch' | 'highestProtein' | 'lowestCost'>('bestMatch');

  useEffect(() => {
    setSearchInput(query);
    if (query) {
      fetchResults(query);
    } else {
      setRawRecipes([]);
      setLoading(false);
    }
  }, [query]);

  const fetchResults = async (q: string) => {
    setLoading(true);
    try {
      const ingredients = q.split(',').map(i => i.trim()).filter(Boolean);
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
      });
      const data = await res.json();
      if (data.success) {
        setRawRecipes(data.data);
      } else {
        setRawRecipes([]);
      }
    } catch (err) {
      console.error(err);
      setRawRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters and sorting
    let result = [...rawRecipes];

    // Filter
    result = result.filter(recipe => {
      const cost = recipe.cost || 0;
      const protein = recipe.protein || 0;
      // time format could be "30 mins", parse it
      const timeMatch = recipe.time ? recipe.time.toString().match(/\d+/) : null;
      const timeValue = timeMatch ? parseInt(timeMatch[0], 10) : 0;

      return cost <= maxCost && protein >= minProtein && timeValue <= maxTime;
    });

    // Sort
    if (sortMethod === 'highestProtein') {
      result.sort((a, b) => (b.protein || 0) - (a.protein || 0));
    } else if (sortMethod === 'lowestCost') {
      result.sort((a, b) => (a.cost || 0) - (b.cost || 0));
    }
    // For 'bestMatch', we just leave it in the order returned by the API (which is already sorted)

    setFilteredRecipes(result);
  }, [rawRecipes, maxCost, minProtein, maxTime, sortMethod]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/results?q=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto w-full">
      
      {/* Header Search Bar */}
      <div className="bg-brand-500 rounded-[2rem] p-6 md:p-10 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-3xl font-black text-white mb-6">Find Your Perfect Meal</h1>
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" />
            <input 
              type="text" 
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by ingredients..."
              className="w-full pl-12 pr-4 h-14 rounded-xl border-none outline-none font-semibold text-lg shadow-inner"
            />
          </div>
          <button type="submit" className="h-14 px-8 bg-foreground text-background font-bold rounded-xl whitespace-nowrap hover:scale-105 transition-transform shadow-lg">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 flex flex-col gap-6">
          <div className="glass-card p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
              <SlidersHorizontal className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-bold">Filters</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-semibold mb-2">
                  <span>Max Cost</span>
                  <span className="text-brand-600">₹{maxCost}</span>
                </label>
                <input 
                  type="range" 
                  min="20" max="500" step="10"
                  value={maxCost}
                  onChange={e => setMaxCost(parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-semibold mb-2">
                  <span>Min Protein</span>
                  <span className="text-rose-600">{minProtein}g</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="80" step="5"
                  value={minProtein}
                  onChange={e => setMinProtein(parseInt(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-semibold mb-2">
                  <span>Max Cooking Time</span>
                  <span className="text-emerald-600">{maxTime} mins</span>
                </label>
                <input 
                  type="range" 
                  min="5" max="120" step="5"
                  value={maxTime}
                  onChange={e => setMaxTime(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-brand-500" />
                <h2 className="text-lg font-bold">Sort By</h2>
              </div>
              <select 
                value={sortMethod}
                onChange={e => setSortMethod(e.target.value as any)}
                className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-500 focus:ring-1 transition-all"
              >
                <option value="bestMatch">Best Match</option>
                <option value="highestProtein">Highest Protein</option>
                <option value="lowestCost">Lowest Cost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:w-3/4 flex flex-col min-h-[500px]">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-500">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-bold text-lg animate-pulse">Finding the best recipes...</p>
            </div>
          ) : rawRecipes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-foreground/50 glass-card p-12 text-center">
              <Search className="w-16 h-16 mb-4 text-foreground/30" />
              <h3 className="text-2xl font-bold mb-2 text-foreground/70">No Recipes Found</h3>
              <p className="max-w-md">We couldn't find anything matching "{query}". Try adjusting your ingredients or use our AI Generator!</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-foreground/50 glass-card p-12 text-center">
              <SlidersHorizontal className="w-16 h-16 mb-4 text-foreground/30" />
              <h3 className="text-2xl font-bold mb-2 text-foreground/70">No Recipes Match Filters</h3>
              <p className="max-w-md">You've found recipes, but your current filters are too strict. Try increasing max cost or lowering min protein.</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-foreground/50 mb-6">
                Showing {filteredRecipes.length} recipes
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id || recipe._id} recipe={recipe as any} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-500" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
