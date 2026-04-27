import connectDB from './mongodb';
import { Recipe as RecipeModel } from '@/models/Recipe';

export interface Recipe {
  id: string;
  name: string;
  slug?: string;
  ingredients: string[]; // Keep for backwards compatibility
  requiredIngredients?: string[];
  optionalIngredients?: string[];
  category: string[];
  calories: number;
  time: string;
  steps: string[];
  tags: string[];
  image: string;
  cost?: number;
  protein?: number;
  rating?: number;
  reviews?: number;
}

export async function getRecipes(): Promise<Recipe[]> {
  try {
    await connectDB();
    const recipes = await RecipeModel.find({}).lean();
    
    if (!recipes || recipes.length === 0) {
      return [];
    }
    
    return recipes.map((r: any) => ({
      id: r._id.toString(),
      name: r.name,
      slug: r.slug,
      ingredients: r.requiredIngredients || [],
      requiredIngredients: r.requiredIngredients || [],
      optionalIngredients: r.optionalIngredients || [],
      category: r.category || [],
      calories: r.calories || 0,
      time: r.cookingTime ? `${r.cookingTime} mins` : '30 mins',
      steps: r.steps || [],
      tags: r.tags || [],
      image: r.image || '',
      cost: r.cost || 0,
      protein: r.protein || 0,
      rating: r.rating || 4.5,
      reviews: r.reviews || 100
    }));
  } catch (error) {
    console.error("MongoDB connection or fetch failed:", error);
    throw new Error('Failed to fetch recipes from database');
  }
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const recipes = await getRecipes();
  return recipes.find(r => r.id === id);
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const recipes = await getRecipes();
  return recipes.filter(r => r.category.includes(category) || r.tags.includes(category));
}

export async function searchRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
  const recipes = await getRecipes();
  // Find recipes where ingredients match.
  const scored = recipes.map(recipe => {
    const matchedCount = recipe.ingredients.filter(ing => 
      ingredients.some(searchIng => ing.toLowerCase().includes(searchIng.toLowerCase()))
    ).length;
    return { recipe, matchedCount };
  });

  return scored
    .filter(r => r.matchedCount > 0)
    .sort((a, b) => b.matchedCount - a.matchedCount)
    .map(r => r.recipe);
}
