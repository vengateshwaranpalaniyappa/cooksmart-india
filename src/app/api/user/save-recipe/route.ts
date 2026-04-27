import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { recipeId, action } = body;

    if (!recipeId) {
      return NextResponse.json({ success: false, error: 'Recipe ID required' }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    
    if (action === 'save') {
      await User.findByIdAndUpdate(userId, { $addToSet: { savedRecipes: recipeId } });
    } else if (action === 'unsave') {
      await User.findByIdAndUpdate(userId, { $pull: { savedRecipes: recipeId } });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
