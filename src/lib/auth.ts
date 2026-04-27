import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './mongodb';
import { User } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          if (!user.email) return false;
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              email: user.email,
              savedRecipes: [],
              preferences: {
                budget: 150,
                proteinGoal: 100
              }
            });
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign-in", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user?.email }).lean();
        if (dbUser) {
          (session.user as any).id = dbUser._id.toString();
          (session.user as any).preferences = dbUser.preferences;
        }
      } catch (error) {
        console.error("Error populating session", error);
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_development_only_12345',
};
