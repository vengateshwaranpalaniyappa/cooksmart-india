'use client';

import { useState } from 'react';
import { Recipe } from '@/lib/api';
import { ShoppingBag, ShoppingCart, Loader2, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export function BuyIngredients({ recipe }: { recipe: Recipe }) {
  const [ordering, setOrdering] = useState(false);

  // Generate deterministic mock prices based on ingredient name length
  const items = recipe.ingredients.map(ing => {
    const price = (ing.length * 4) + 15; // Random formula for mock price
    return { name: ing, price };
  });

  const totalCost = items.reduce((acc, item) => acc + item.price, 0);

  const handleOrder = () => {
    setOrdering(true);
    // Simulate API delay
    setTimeout(() => {
      setOrdering(false);
      toast.success('Redirecting to partner app...', {
        description: 'Opening Zepto / Blinkit with your cart ready.',
      });
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/20 p-6 md:p-10 mt-8 border-2 border-emerald-500/30 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rounded-2xl">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">Buy Ingredients</h2>
            <p className="text-foreground/70 font-medium text-lg mt-1">10-minute delivery to your door.</p>
          </div>
        </div>
        
        {totalCost < 100 && (
          <div className="px-4 py-2 bg-emerald-500 text-white rounded-full font-black text-sm shadow-lg shadow-emerald-500/20 self-start md:self-auto border border-emerald-400">
            🔥 Under ₹{Math.ceil((totalCost + 10) / 10) * 10} Meal!
          </div>
        )}
      </div>

      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 md:p-8 mb-8 border border-border/50 shadow-inner">
        <ul className="space-y-4 mb-6">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center text-lg font-medium border-b border-border/40 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-foreground/80">{item.name}</span>
              </div>
              <span className="font-bold flex items-center text-foreground">
                <IndianRupee className="w-4 h-4 mr-0.5" />{item.price}
              </span>
            </li>
          ))}
        </ul>
        
        <div className="border-t-2 border-dashed border-border/80 pt-6 flex justify-between items-center">
          <span className="font-black text-xl text-foreground/80 uppercase tracking-widest">Total Cost</span>
          <span className="font-black text-4xl flex items-center text-emerald-600 dark:text-emerald-400 drop-shadow-md">
            <IndianRupee className="w-7 h-7 mr-1" />{totalCost}
          </span>
        </div>
      </div>

      <button 
        onClick={handleOrder}
        disabled={ordering}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 border-2 border-emerald-400/50"
      >
        {ordering ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : (
          <>
            <ShoppingCart className="w-6 h-6" />
            Order Ingredients Now
          </>
        )}
      </button>
    </div>
  );
}
