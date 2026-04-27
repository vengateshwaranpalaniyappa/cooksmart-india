import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';
import { SearchHistory } from '@/models/SearchHistory';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { ingredients } = body;
    
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : 'anonymous';

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide an array of ingredients' },
        { status: 400 }
      );
    }

    // Log the search history asynchronously
    SearchHistory.create({
      userId: userId,
      ingredients: ingredients
    }).catch(err => console.error('Failed to log search history:', err));

    // Ingredient Matching Engine Stub
    // Finds recipes where ANY of the requiredIngredients match the input ingredients
    // For a more advanced matching, we would score them, but this is a stub as requested.
    
    // Normalize input
    const normalizedInput = ingredients.map(i => i.toLowerCase().trim());
    
    // Fetch all recipes (in a huge DB, we'd use MongoDB $in operator or Atlas Search)
    // For this stub, we'll use a regex matching approach in MongoDB
    const regexPattern = normalizedInput.join('|');
    
    const matchedRecipes = await Recipe.find({
      requiredIngredients: { 
        $elemMatch: { 
          $regex: regexPattern, 
          $options: 'i' 
        } 
      }
    }).lean().limit(10); // Limit to top 10 for performance

    // Map _id to id for frontend compatibility
    const mappedRecipes = matchedRecipes.map((r: any) => ({
      ...r,
      id: r._id.toString()
    }));

    return NextResponse.json({ success: true, data: mappedRecipes });
  } catch (error) {
    console.error('Error in search engine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process search' },
      { status: 500 }
    );
  }
}
