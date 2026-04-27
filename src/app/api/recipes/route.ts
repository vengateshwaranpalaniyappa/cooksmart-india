import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';

export async function GET() {
  try {
    await connectDB();
    
    // Lean query for performance
    const recipes = await Recipe.find({}).lean();
    
    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.slug || !body.requiredIngredients || !body.calories) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recipe = await Recipe.create(body);
    
    return NextResponse.json({ success: true, data: recipe }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating recipe:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A recipe with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}
