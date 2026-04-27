import Link from 'next/link';
import { Search, Menu, ChefHat } from 'lucide-react';
import { LoginButton } from '@/components/auth/LoginButton';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border/50 mb-8 transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand-500 p-2 rounded-xl group-hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">
            CookSmart<span className="text-brand-500">India</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-10 text-sm font-bold">
          <Link href="/recipes" className="text-foreground/70 hover:text-foreground transition-colors uppercase tracking-widest text-xs">Recipes</Link>
          
          {/* Categories Dropdown */}
          <div className="relative group/nav">
            <Link href="/categories" className="flex items-center gap-1 text-foreground/70 group-hover/nav:text-foreground transition-colors uppercase tracking-widest text-xs">
              Categories
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover/nav:rotate-180 transition-transform duration-300"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </Link>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300">
              <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-3 flex flex-col min-w-[200px]">
                {[
                  { name: 'Budget Meals', href: '/categories/budget' },
                  { name: 'High Protein', href: '/categories/gym' },
                  { name: 'Quick Snacks', href: '/categories/snacks' },
                  { name: 'Vegetarian', href: '/categories/vegetarian' },
                  { name: 'Healthy & Diet', href: '/categories/healthy' }
                ].map(cat => (
                  <Link 
                    key={cat.name} 
                    href={cat.href}
                    className="px-4 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 text-foreground/80 font-semibold text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/saved" className="text-foreground/70 hover:text-foreground transition-colors uppercase tracking-widest text-xs">Saved</Link>
          <Link href="/meal-plan" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-black transition-colors uppercase tracking-widest text-xs">Meal Plan</Link>
          <Link href="/ai-generator" className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 bg-brand-50 dark:bg-brand-900/30 px-4 py-2 rounded-full transition-colors border border-brand-200 dark:border-brand-800">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
            </span>
            AI MAGIC ✨
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors hidden md:flex">
            <Search className="h-5 w-5" />
          </button>
          <button className="md:hidden p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden md:block">
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}
