'use client';

import { useEffect } from 'react';
import { Recipe } from '@/lib/api';

export function TrackView({ recipe }: { recipe: Recipe }) {
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = saved.filter((r: Recipe) => r.id !== recipe.id);
      filtered.unshift(recipe);
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)));
    } catch (e) {
      console.error(e);
    }
  }, [recipe]);

  return null;
}
