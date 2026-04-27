import connectDB from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { Metadata } from 'next';
import { IndianRupee, Frown } from 'lucide-react';

export async function generateMetadata({ params }: { params: { value: string } }): Promise<Metadata> {
  const value = parseInt(params.value, 10) || 100;
  
  return {
    title: `Budget Indian Meals Under ₹${value} | CookSmart India`,
    description: `Save money and hit your macros with our collection of high-protein Indian meals that cost less than ₹${value} per serving.`,
    openGraph: {
      title: `Meals Under ₹${value}`,
      description: `Eat healthy for less than ₹${value}.`,
    }
  };
}

export default async function BudgetMealsPage({ params }: { params: { value: string } }) {
  const value = parseInt(params.value, 10) || 100;

  await connectDB();
  
  const rawRecipes = await Recipe.find({
    cost: { $lte: value }
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
    "name": `Budget Meals Under ₹${value}`,
    "description": `Indian recipes that cost less than ₹${value} per serving.`,
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
      
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/5 rounded-[2rem] p-8 md:p-16 mb-12 text-center border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex items-center justify-center gap-2">
          Meals Under <IndianRupee className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" /> <span className="text-emerald-500">{value}</span>
        </h1>
        <p className="text-xl text-foreground/70 font-medium max-w-2xl mx-auto">
          Eating healthy shouldn't break the bank. Here are the most nutritious recipes that cost less than ₹{value} per serving. Sorted by highest protein.
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
          <Frown className="w-16 h-16 mx-auto mb-4 text-emerald-500/50" />
          <h2 className="text-2xl font-bold text-foreground/80 mb-2">No recipes found under ₹{value}</h2>
          <p className="text-foreground/60">Try increasing your budget to discover more options!</p>
        </div>
      )}
    </div>
  );
}
