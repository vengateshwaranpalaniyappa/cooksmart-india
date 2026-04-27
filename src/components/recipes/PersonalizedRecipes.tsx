'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/api';
import { RecipeCard } from '@/components/ui/RecipeCard';

export function PersonalizedRecipes({ recipes }: { recipes: Recipe[] }) {
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentRecipes(saved.slice(0, 4));
  }, []);

  // Mock recommended logic: just take some random ones for now
  // In a real app, this would be based on user preference or last search
  const recommended = recipes.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 w-full">
      {/* Recommended Section */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Recommended for You</h2>
            <p className="text-foreground/70">Based on your High Protein preferences.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentRecipes.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Recently Viewed</h2>
              <p className="text-foreground/70">Pick up where you left off.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
