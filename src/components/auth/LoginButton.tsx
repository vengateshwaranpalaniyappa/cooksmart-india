'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogIn, LogOut } from 'lucide-react';

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-foreground/10 animate-pulse"></div>;
  }

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/profile" className="flex items-center gap-2 text-sm font-bold text-foreground/80 hover:text-brand-500 transition-colors">
          {session.user.image ? (
            <Image src={session.user.image} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-brand-500/50" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center border-2 border-brand-500/50">
              <User className="w-4 h-4" />
            </div>
          )}
          <span className="hidden md:inline-block">{session.user.name?.split(' ')[0]}</span>
        </Link>
        <button 
          onClick={() => signOut()}
          className="text-foreground/50 hover:text-rose-500 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn('google')}
      className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden md:inline-block">Sign In</span>
    </button>
  );
}
