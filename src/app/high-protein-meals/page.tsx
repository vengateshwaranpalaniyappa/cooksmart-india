export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Metadata } from 'next';
import { Beef } from 'lucide-react';

export const metadata: Metadata = {
  title: 'High Protein Indian Meals & Recipes | CookSmart India',
  description: 'Build muscle with our curated list of high-protein Indian meals. Discover recipes with over 20g of protein per serving.',
  openGraph: {
    title: 'High Protein Indian Meals',
    description: 'Delicious Indian meals designed for muscle growth and satiety.',
  }
};

export default async function HighProteinMealsPage() {
  await connectDB();
  
  // High protein is considered > 20g
  const rawRecipes = await Recipe.find({
    protein: { $gte: 20 }
  }).sort({ protein: -1 }).lean();

  const recipes = rawRecipes.map((r: any) => ({
    ...r,
    id: r._id.toString(),
    time: `${r.cookingTime} mins`,
    ingredients: r.requiredIngredients || []
  }));

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "High Protein Indian Meals",
    "description": "Indian recipes with more than 20g of protein per serving.",
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
      
      <div className="bg-gradient-to-br from-rose-500/10 to-orange-600/5 rounded-[2rem] p-8 md:p-16 mb-12 text-center border border-rose-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex items-center justify-center gap-3">
          <Beef className="w-10 h-10 text-rose-500" /> High Protein Meals
        </h1>
        <p className="text-xl text-foreground/70 font-medium max-w-2xl mx-auto">
          Fuel your gains with these incredibly rich, muscle-building Indian recipes. Everything here packs over 20g of protein!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
