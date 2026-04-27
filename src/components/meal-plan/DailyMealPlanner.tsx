'use client';

import { useState } from 'react';
import { RefreshCw, Play, IndianRupee, Flame, Beef } from 'lucide-react';
import { RecipeCard } from '@/components/ui/RecipeCard';
import Link from 'next/link';

export function DailyMealPlanner({ 
  initialBreakfast, 
  initialLunch, 
  initialDinner,
  allBreakfasts,
  allLunches,
  allDinners
}: {
  initialBreakfast: any;
  initialLunch: any;
  initialDinner: any;
  allBreakfasts: any[];
  allLunches: any[];
  allDinners: any[];
}) {
  const [breakfast, setBreakfast] = useState(initialBreakfast);
  const [lunch, setLunch] = useState(initialLunch);
  const [dinner, setDinner] = useState(initialDinner);

  const swapMeal = (type: 'breakfast' | 'lunch' | 'dinner') => {
    if (type === 'breakfast') {
      const remaining = allBreakfasts.filter(r => r.id !== breakfast.id);
      if (remaining.length > 0) setBreakfast(remaining[Math.floor(Math.random() * remaining.length)]);
    } else if (type === 'lunch') {
      const remaining = allLunches.filter(r => r.id !== lunch.id);
      if (remaining.length > 0) setLunch(remaining[Math.floor(Math.random() * remaining.length)]);
    } else {
      const remaining = allDinners.filter(r => r.id !== dinner.id);
      if (remaining.length > 0) setDinner(remaining[Math.floor(Math.random() * remaining.length)]);
    }
  };

  const totalCost = (breakfast?.cost || 0) + (lunch?.cost || 0) + (dinner?.cost || 0);
  const totalProtein = (breakfast?.protein || 0) + (lunch?.protein || 0) + (dinner?.protein || 0);
  const totalCalories = (breakfast?.calories || 0) + (lunch?.calories || 0) + (dinner?.calories || 0);

  const MealSlot = ({ title, meal, onSwap }: { title: string, meal: any, onSwap: () => void }) => {
    if (!meal) return null;
    return (
      <div className="flex flex-col relative group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">{title}</h3>
          <button onClick={onSwap} className="text-xs font-bold text-foreground/50 hover:text-brand-500 flex items-center gap-1 transition-colors">
            <RefreshCw className="w-3 h-3" /> Replace
          </button>
        </div>
        
        <div className="relative">
          <RecipeCard recipe={meal} />
          
          <div className="mt-4">
            <Link 
              href={`/recipes/${meal.slug || meal.id}`}
              className="w-full bg-foreground text-background hover:bg-brand-500 hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" /> Cook Now
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Dashboard Stats */}
      <div className="bg-gradient-to-br from-brand-500 to-rose-600 rounded-[2.5rem] p-8 md:p-12 mb-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Today's Optimal Plan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full"><IndianRupee className="w-6 h-6" /></div>
            <div>
              <p className="text-white/70 font-bold text-sm uppercase tracking-widest">Total Cost</p>
              <p className="text-3xl font-black">₹{totalCost}</p>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full"><Beef className="w-6 h-6" /></div>
            <div>
              <p className="text-white/70 font-bold text-sm uppercase tracking-widest">Total Protein</p>
              <p className="text-3xl font-black">{totalProtein}g</p>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full"><Flame className="w-6 h-6" /></div>
            <div>
              <p className="text-white/70 font-bold text-sm uppercase tracking-widest">Total Calories</p>
              <p className="text-3xl font-black">{totalCalories}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <MealSlot title="Breakfast" meal={breakfast} onSwap={() => swapMeal('breakfast')} />
        <MealSlot title="Lunch" meal={lunch} onSwap={() => swapMeal('lunch')} />
        <MealSlot title="Dinner" meal={dinner} onSwap={() => swapMeal('dinner')} />
      </div>
      
    </div>
  );
}
