'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Recipe } from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export function SaveButton({ recipe, className = '' }: { recipe: Recipe; className?: string }) {
  const [saved, setSaved] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Determine if saved
    // For unauthenticated users, check localStorage
    // For authenticated users, theoretically we should pass down the state, but we can do a quick local check or rely on a global state.
    // Assuming local storage sync for now to avoid n+1 queries, but DB is source of truth.
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSaved(savedRecipes.some((r: Recipe) => r.id === recipe.id));
  }, [recipe.id]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !saved;
    setSaved(newState);

    if (newState) {
      toast.success('Saved to your recipes', { description: recipe.name });
    } else {
      toast.info('Removed from saved recipes');
    }

    // Local Storage Fallback
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    if (newState) {
      if (!savedRecipes.some((r: Recipe) => r.id === recipe.id)) {
        savedRecipes.push(recipe);
      }
    } else {
      savedRecipes = savedRecipes.filter((r: Recipe) => r.id !== recipe.id);
    }
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    window.dispatchEvent(new Event('savedRecipesUpdated'));

    // DB Sync if logged in
    if (session && session.user) {
      try {
        await fetch('/api/user/save-recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            recipeId: recipe.id, 
            action: newState ? 'save' : 'unsave' 
          })
        });
      } catch (err) {
        console.error('Failed to sync save state to DB', err);
      }
    } else {
      if (newState) {
        toast('Login to save recipes permanently!', {
          action: {
            label: 'Sign In',
            onClick: () => document.getElementById('login-btn')?.click()
          }
        });
      }
    }
  };

  return (
    <button 
      onClick={toggleSave}
      className={`absolute top-3 right-3 z-20 bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-md cursor-pointer hover:bg-brand-50 transition-all active:scale-95 ${className}`}
      aria-label={saved ? "Unsave recipe" : "Save recipe"}
    >
      <Heart className={`w-5 h-5 ${saved ? 'fill-rose-500 text-rose-500' : 'text-foreground/50'}`} />
    </button>
  );
}
