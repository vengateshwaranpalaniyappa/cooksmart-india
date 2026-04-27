'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bot, Heart } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/recipes', icon: Search },
    { name: 'AI', href: '/ai-generator', icon: Bot },
    { name: 'Saved', href: '/saved', icon: Heart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-brand-500' : 'text-foreground/50 hover:text-foreground/80'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-brand-500/20' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
