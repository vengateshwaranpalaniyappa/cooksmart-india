import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ReminderClick } from '@/models/ReminderClick';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const recipeId = searchParams.get('recipeId') || searchParams.get('targetId');
  const redirectUrl = searchParams.get('redirect');

  if (!userId || !redirectUrl) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    await connectDB();
    
    // Store in MongoDB
    await ReminderClick.create({
      userId,
      targetId: recipeId || 'meal-plan',
      type: recipeId ? 'recipe' : 'meal-plan',
    });

  } catch (error) {
    console.error('Error tracking click:', error);
    // Even if tracking fails, we should still redirect the user so the UX isn't broken
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
