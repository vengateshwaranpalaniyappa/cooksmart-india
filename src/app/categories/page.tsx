import { getRecipes } from '@/lib/api';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipe Categories | CookSmart India',
  description: 'Browse our collection of Indian recipes by category. Veg, Non-Veg, High Protein, Budget, and more.',
};

export default async function CategoriesPage() {
  const recipes = await getRecipes();
  
  // Extract unique categories
  const categoriesMap = new Map<string, number>();
  recipes.forEach(r => {
    r.category.forEach(c => {
      categoriesMap.set(c, (categoriesMap.get(c) || 0) + 1);
    });
  });

  const categoriesList = Array.from(categoriesMap.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Recipe Categories</h1>
      <p className="text-xl text-foreground/70 mb-12">Browse recipes by category and diet, tailored for Indian kitchens.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.map(([cat, count]) => (
          <Link 
            key={cat} 
            href={`/categories/${encodeURIComponent(cat.toLowerCase())}`}
            className="glass-card p-6 flex flex-col justify-between h-40 group hover:-translate-y-1 transition-transform"
          >
            <h2 className="text-2xl font-bold group-hover:text-brand-600 transition-colors">{cat}</h2>
            <div className="flex justify-between items-end">
              <span className="text-foreground/60 font-medium">{count} Recipes</span>
              <span className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 group-hover:bg-brand-500 text-brand-600 dark:text-brand-400 group-hover:text-white flex items-center justify-center transition-colors">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
