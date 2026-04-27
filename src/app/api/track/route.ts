import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { ReminderClick } from '@/models/ReminderClick';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const u = searchParams.get('u'); // userId
  const r = searchParams.get('r'); // targetId (recipeId or 'meal-plan')
  const type = searchParams.get('type'); // 'recipe' or 'meal-plan'
  const redirectUrl = searchParams.get('redirect');

  if (!redirectUrl) {
    return NextResponse.json({ error: 'Missing redirect URL' }, { status: 400 });
  }

  try {
    if (u && r && type) {
      await connectDB();
      // Asynchronously log the click so we don't delay the redirect
      ReminderClick.create({
        userId: u,
        targetId: r,
        type: type
      }).catch(err => console.error('Failed to log reminder click:', err));
    }
  } catch (error) {
    console.error('Error in click tracking:', error);
  }

  // Redirect the user to their actual destination
  redirect(decodeURIComponent(redirectUrl));
}
