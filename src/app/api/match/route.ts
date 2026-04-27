import { NextResponse } from 'next/server';
import { getRecipes } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userIngredients: string[] = body.ingredients || [];

    if (!Array.isArray(userIngredients) || userIngredients.length === 0) {
      return NextResponse.json({ error: 'Please provide an array of ingredients.' }, { status: 400 });
    }

    // 1. Normalize user ingredients
    const normalizedUserIngs = userIngredients.map(ing => ing.toLowerCase().trim());

    // Fetch all recipes from DB / mock
    const recipes = await getRecipes();

    // 2. Calculate match score for each recipe
    const scoredRecipes = recipes.map(recipe => {
      // Fallback: if requiredIngredients doesn't exist, assume all `ingredients` are required
      const reqIngs = (recipe.requiredIngredients && recipe.requiredIngredients.length > 0) 
        ? recipe.requiredIngredients 
        : recipe.ingredients;
      
      const optIngs = recipe.optionalIngredients || [];

      // Helper function to check if a recipe ingredient is matched by any user ingredient
      const isMatched = (recipeIng: string) => {
        const normalizedRecipeIng = recipeIng.toLowerCase().trim();
        // Simple substring match (e.g. 'tomato' matches 'tomatoes', 'chicken' matches 'chicken breast')
        return normalizedUserIngs.some(userIng => 
          normalizedRecipeIng.includes(userIng) || userIng.includes(normalizedRecipeIng)
        );
      };

      const matchedReqCount = reqIngs.filter(isMatched).length;
      const matchedOptCount = optIngs.filter(isMatched).length;

      const totalReq = reqIngs.length;
      const totalOpt = optIngs.length;

      let score = 0;

      if (totalOpt > 0) {
        // Both required and optional exist
        const reqScore = totalReq > 0 ? (matchedReqCount / totalReq) : 1;
        const optScore = matchedOptCount / totalOpt;
        score = (reqScore * 0.7) + (optScore * 0.3);
      } else {
        // Only required exist
        score = totalReq > 0 ? (matchedReqCount / totalReq) : 0;
      }

      // Determine label
      let matchLabel = 'Try These';
      if (score >= 1.0) {
        matchLabel = 'Exact Match';
      } else if (score >= 0.7) {
        matchLabel = 'Good Match';
      }

      return {
        recipe,
        score,
        matchLabel,
        matchedReqCount,
        matchedOptCount,
        totalReq,
        totalOpt
      };
    });

    // 3. Sort recipes by score (descending)
    // Filter out 0 score to optimize output, or just sort and take top 10
    const sortedRecipes = scoredRecipes
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);

    // 4. Return top 10 results
    const top10 = sortedRecipes.slice(0, 10);

    return NextResponse.json({
      success: true,
      matches: top10
    });

  } catch (error) {
    console.error('Ingredient Match Engine Error:', error);
    return NextResponse.json({ error: 'Failed to process ingredient matching.' }, { status: 500 });
  }
}
