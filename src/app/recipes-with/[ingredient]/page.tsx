import connectDB from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Metadata } from 'next';
import { Search } from 'lucide-react';

export async function generateMetadata({ params }: { params: { ingredient: string } }): Promise<Metadata> {
  const ingredient = decodeURIComponent(params.ingredient);
  const capitalized = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
  
  return {
    title: `Best Indian Recipes with ${capitalized} | CookSmart India`,
    description: `Discover healthy, budget-friendly Indian recipes you can make with ${ingredient}. Get full nutritional information, cost breakdown, and step-by-step instructions.`,
    openGraph: {
      title: `Recipes with ${capitalized}`,
      description: `Cook something amazing with ${ingredient} today.`,
    }
  };
}

export default async function RecipesWithIngredientPage({ params }: { params: { ingredient: string } }) {
  const ingredient = decodeURIComponent(params.ingredient);
  const capitalized = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

  await connectDB();
  
  const rawRecipes = await Recipe.find({
    requiredIngredients: { 
      $elemMatch: { $regex: ingredient, $options: 'i' } 
    }
  }).lean();

  const recipes = rawRecipes.map((r: any) => ({
    ...r,
    id: r._id.toString(),
    time: `${r.cookingTime} mins`,
    ingredients: r.requiredIngredients || []
  }));

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Recipes with ${capitalized}`,
    "description": `A collection of Indian recipes featuring ${ingredient}.`,
    "itemListElement": recipes.map((recipe, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://cooksmartindia.com/recipes/${recipe.slug || recipe.id}`
    }))
  };

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      <div className="bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-[2rem] p-8 md:p-16 mb-12 text-center border border-brand-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Recipes with <span className="text-brand-500 capitalize">{ingredient}</span>
        </h1>
        <p className="text-xl text-foreground/70 font-medium max-w-2xl mx-auto">
          Got some {ingredient.toLowerCase()} in your fridge? Turn it into a delicious, high-protein meal in minutes.
        </p>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <Search className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
          <h2 className="text-2xl font-bold text-foreground/80 mb-2">No recipes found</h2>
          <p className="text-foreground/60">We couldn't find any recipes containing {ingredient.toLowerCase()}. Try searching for something else!</p>
        </div>
      )}
    </div>
  );
}
