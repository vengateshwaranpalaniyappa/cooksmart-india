export const dynamic = 'force-dynamic';
import { getRecipes } from '@/lib/api';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const decodedCategory = decodeURIComponent(params.category).replace(/-/g, ' ');
  // Capitalize first letters for proper title
  const formattedCategory = decodedCategory.replace(/\b\w/g, c => c.toUpperCase());
  
  return {
    title: `${formattedCategory} Recipes | CookSmart India`,
    description: `Discover healthy and delicious ${formattedCategory} Indian recipes. Easy step-by-step cooking instructions.`,
  };
}

export default async function CategorySearchPage({ params }: { params: { category: string } }) {
  const decodedCategory = decodeURIComponent(params.category).replace(/-/g, ' ');
  
  const allRecipes = await getRecipes();
  const recipes = allRecipes.filter(r => 
    r.category.some(c => c.toLowerCase() === decodedCategory.toLowerCase()) || 
    r.tags.some(t => t.toLowerCase() === decodedCategory.toLowerCase())
  );

  if (!recipes || recipes.length === 0) {
    notFound();
  }

  const formattedCategory = decodedCategory.replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12 border-b border-border/50 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          {formattedCategory} Recipes
        </h1>
        <p className="text-xl text-foreground/70">
          Showing {recipes.length} carefully-selected recipes matching this category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
