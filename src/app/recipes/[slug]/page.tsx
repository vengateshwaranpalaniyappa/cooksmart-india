export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Flame, Tag, CheckCircle2, Calendar } from 'lucide-react';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { SaveButton } from '@/components/ui/SaveButton';
import { TrackView } from '@/components/recipes/TrackView';
import { BuyIngredients } from '@/components/recipes/BuyIngredients';
import { SuggestNextMeal } from '@/components/recipes/SuggestNextMeal';
import type { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    await connectDB();
    const recipe = await Recipe.findOne({ slug: params.slug }).lean();
    
    if (!recipe) return { title: 'Recipe Not Found' };
    
    return {
      title: recipe.metaTitle || `${recipe.name} Recipe | CookSmart India`,
      description: recipe.metaDescription || `Learn how to make ${recipe.name}. A delicious ${recipe.category?.join(', ')} recipe that takes ${recipe.cookingTime} mins to cook.`,
      openGraph: {
        images: [recipe.image],
      }
    };
  } catch (e) {
    console.error("DB error in generateMetadata:", e);
    return { title: 'Recipe | CookSmart India' };
  }
}

export default async function RecipeDetailPage({ params }: { params: { slug: string } }) {
  let rawRecipe = null;
  try {
    await connectDB();
    rawRecipe = await Recipe.findOne({ slug: params.slug }).lean();
  } catch (e) {
    console.error("DB error in RecipeDetailPage:", e);
  }
  
  if (!rawRecipe) {
    notFound();
  }

  // Map backend format to frontend format where necessary
  const recipe = {
    ...rawRecipe,
    id: rawRecipe._id.toString(),
    time: `${rawRecipe.cookingTime} mins`,
    ingredients: rawRecipe.requiredIngredients || [], 
    steps: rawRecipe.steps ?? []
  } as any;

  // Advanced data fetching & logic
  const allRecipes = await Recipe.find({}).lean();

  // "Today's Meal Plan" Logic
  const getMeal = (type: string, excludeId: string) => {
    return allRecipes.find((r: any) => 
      r.category.some((c: string) => c.toLowerCase().includes(type)) && r._id.toString() !== excludeId
    ) || allRecipes.find((r: any) => r._id.toString() !== excludeId);
  };

  const mealPlan = [
    { label: "Breakfast", recipe: getMeal('breakfast', recipe.id) },
    { label: "Lunch", recipe: getMeal('lunch', recipe.id) },
    { label: "Dinner", recipe: getMeal('dinner', recipe.id) }
  ].map(m => ({
    ...m,
    recipe: m.recipe ? {
      ...m.recipe,
      id: m.recipe._id.toString(),
      _id: m.recipe._id.toString(),
      time: `${m.recipe.cookingTime} mins`,
      ingredients: m.recipe.requiredIngredients || []
    } : null
  })).filter(m => m.recipe !== null);

  // Improved Similar Recipes Query
  const primaryCategory = recipe.category?.[0] || 'Indian';
  const allInCategory = allRecipes.filter((r: any) => r.category.includes(primaryCategory));
  
  // Strict matching logic
  let strictSimilar = allInCategory.filter((r: any) => 
    r._id.toString() !== recipe.id &&
    r.protein >= recipe.protein - 5 && r.protein <= recipe.protein + 5 &&
    r.cost >= recipe.cost - 20 && r.cost <= recipe.cost + 20
  );

  // Sort by closest match (smallest delta in protein and cost)
  strictSimilar.sort((a: any, b: any) => {
    const deltaA = Math.abs(a.protein - recipe.protein) + Math.abs(a.cost - recipe.cost);
    const deltaB = Math.abs(b.protein - recipe.protein) + Math.abs(b.cost - recipe.cost);
    return deltaA - deltaB;
  });

  let similarRecipes = strictSimilar.slice(0, 4);

  // Fallback to category only if strict matching yields less than 4
  if (similarRecipes.length < 4) {
    const fallback = allInCategory
      .filter((r: any) => r._id.toString() !== recipe.id && !similarRecipes.find((sr: any) => sr._id.toString() === r._id.toString()))
      .slice(0, 4 - similarRecipes.length);
    similarRecipes = [...similarRecipes, ...fallback];
  }

  const mappedSimilar = similarRecipes.map((r: any) => ({
    ...r,
    id: r._id.toString(),
    _id: r._id.toString(),
    time: `${r.cookingTime} mins`,
    ingredients: r.requiredIngredients || []
  }));

  const allMappedRecipes = allRecipes.map((r: any) => ({
    ...r,
    id: r._id.toString(),
    _id: r._id.toString(),
    time: `${r.cookingTime} mins`,
    ingredients: r.requiredIngredients || []
  }));

  // Generate Recipe Schema
  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": recipe.name,
    "image": [
      recipe.image
    ],
    "author": {
      "@type": "Organization",
      "name": "CookSmart India"
    },
    "datePublished": new Date().toISOString().split('T')[0],
    "description": recipe.description || `Delicious ${recipe.name} made right at home.`,
    "prepTime": "PT15M",
    "cookTime": `PT${recipe.cookingTime}M`,
    "totalTime": `PT${recipe.cookingTime + 15}M`,
    "keywords": recipe.tags?.join(', '),
    "recipeYield": "2 servings",
    "recipeCategory": recipe.category?.[0],
    "recipeCuisine": recipe.cuisine || "Indian",
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": `${recipe.calories} calories`,
      "proteinContent": `${recipe.protein} grams`
    },
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": recipe.steps.map((step: string, index: number) => ({
      "@type": "HowToStep",
      "name": `Step ${index + 1}`,
      "text": step
    }))
  };

  return (
    <div className="pb-24 flex flex-col gap-12 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <TrackView recipe={recipe} />

      {/* Today's Meal Plan Section */}
      {mealPlan.length > 0 && (
        <section className="bg-foreground/5 rounded-[2.5rem] p-6 md:p-10 border border-border/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Today's Meal Plan</h2>
              <p className="text-sm font-medium text-foreground/60">Curated to hit your protein and budget goals.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealPlan.map((meal, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 px-2">{meal.label}</span>
                {meal.recipe && (
                  <RecipeCard
                    recipe={{
                      ...meal.recipe,
                      steps: meal.recipe.steps ?? [],
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-[2rem] overflow-hidden aspect-square lg:aspect-auto lg:h-[500px] shadow-2xl glass-card group">
          <Image 
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <SaveButton recipe={recipe} className="w-14 h-14 flex items-center justify-center [&>svg]:w-7 [&>svg]:h-7 absolute top-6 right-6" />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.category?.map((cat: string) => (
              <span key={cat} className="px-3 py-1 bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 rounded-full text-sm font-bold uppercase tracking-wider">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            {recipe.name}
          </h1>
          
          {recipe.description && (
            <p className="text-lg text-foreground/70 font-medium mb-4">
              {recipe.description}
            </p>
          )}

          <div className="flex items-center gap-6 mb-8 mt-2 pb-8 border-b border-border/60">
            <div className="flex flex-col">
              <span className="text-sm text-foreground/60 font-semibold mb-1 uppercase tracking-widest">Time</span>
              <div className="flex items-center gap-2 font-bold text-lg">
                <Clock className="w-5 h-5 text-brand-500" />
                {recipe.time}
              </div>
            </div>
            
            <div className="w-px h-10 bg-border/60"></div>
            
            <div className="flex flex-col">
              <span className="text-sm text-foreground/60 font-semibold mb-1 uppercase tracking-widest">Calories</span>
              <div className="flex items-center gap-2 font-bold text-lg">
                <Flame className="w-5 h-5 text-red-500" />
                {recipe.calories} kcal
              </div>
            </div>
            
            <div className="w-px h-10 bg-border/60"></div>
            
            <div className="flex flex-col">
              <span className="text-sm text-foreground/60 font-semibold mb-1 uppercase tracking-widest">Protein</span>
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="w-5 h-5 flex items-center justify-center bg-brand-100 dark:bg-brand-900 text-brand-600 rounded-full text-[10px]">P</span>
                {recipe.protein}g
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <Tag className="w-6 h-6 text-brand-500" />
              Ingredients Needed
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.ingredients.map((ing: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3 p-3 bg-foreground/5 rounded-xl border border-foreground/5 text-foreground/90 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <BuyIngredients recipe={recipe} />

      {/* Steps */}
      <div className="glass-card p-8 md:p-12 mt-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <h2 className="text-3xl font-bold tracking-tight mb-8">Step-by-Step Instructions</h2>
        <div className="space-y-8">
          {recipe.steps.map((step: string, idx: number) => (
            <div key={idx} className="flex gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 border-2 border-brand-200 dark:border-brand-800 flex items-center justify-center font-black text-brand-600 dark:text-brand-400 text-xl group-hover:scale-110 transition-transform shadow-lg">
                {idx + 1}
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-2">Step {idx + 1}</h3>
                <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Recipes */}
      {mappedSimilar.length > 0 && (
        <section className="mt-8">
          <h2 className="text-3xl font-bold tracking-tight mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mappedSimilar.map(sr => (
              <RecipeCard key={sr.id} recipe={{ ...sr, steps: sr.steps ?? [] }} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Suggestion CTA */}
      <SuggestNextMeal recipes={allMappedRecipes} />
      
    </div>
  );
}
