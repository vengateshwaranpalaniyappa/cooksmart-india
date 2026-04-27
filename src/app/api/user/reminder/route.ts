import { NextResponse } from 'next/server';
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
    const { type, contact, optedIn } = body;

    if (optedIn && (!type || !contact)) {
      return NextResponse.json({ success: false, error: 'Type and contact required' }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    
    await User.findByIdAndUpdate(userId, {
      reminder: {
        type,
        contact,
        optedIn
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
