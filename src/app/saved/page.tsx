'use client';

import { useState, useEffect } from 'react';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Recipe } from '@/lib/api';
import { HeartCrack } from 'lucide-react';
import Link from 'next/link';

export default function SavedRecipesPage() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchSaved = () => {
      const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      setSavedRecipes(saved);
    };

    fetchSaved();

    window.addEventListener('savedRecipesUpdated', fetchSaved);
    return () => window.removeEventListener('savedRecipesUpdated', fetchSaved);
  }, []);

  if (!mounted) {
    return <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12 border-b border-border/50 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Saved Recipes
        </h1>
        <p className="text-xl text-foreground/70">
          Your favorite handpicked recipes, saved for later.
        </p>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <HeartCrack className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
          <h2 className="text-2xl font-bold tracking-tight mb-2">No saved recipes yet</h2>
          <p className="text-foreground/70 mb-6">Start exploring and save your favorite meals!</p>
          <Link href="/recipes" className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-6 rounded-full transition-colors inline-block">
            Explore Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
