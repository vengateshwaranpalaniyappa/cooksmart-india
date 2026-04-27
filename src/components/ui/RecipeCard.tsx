import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, ArrowRight, Star, IndianRupee, Beef, CheckCircle2 } from 'lucide-react';
import { Recipe } from '@/lib/api';
import { SaveButton } from './SaveButton';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const isPopular = (recipe.rating || 0) >= 4.5;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-card border border-border/40 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_40px_-15px_rgba(254,125,31,0.2)] dark:hover:shadow-[0_20px_40px_-15px_rgba(254,125,31,0.15)] hover:border-brand-500/30">
      <div className="relative h-56 w-full overflow-hidden">
        <Image 
          src={recipe.image} 
          alt={recipe.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        <SaveButton recipe={recipe} className="top-4 right-4" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          <div className="flex gap-2">
            {isPopular && (
              <span className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-lg">
                Popular
              </span>
            )}
            {recipe.tags.slice(0, isPopular ? 1 : 2).map(tag => (
              <span key={tag} className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-white/95 text-brand-900 rounded-full shadow-lg backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/90 text-white rounded-full shadow-md backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3" /> Tested Recipe
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/10">
              <Clock className="w-3.5 h-3.5 text-brand-300" />
              {recipe.time}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white px-2.5 py-1.5 rounded-full text-xs font-bold border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {recipe.rating?.toFixed(1)}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-5 md:p-6">
        <h3 className="text-xl font-extrabold tracking-tight mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-brand-600 transition-all">
          {recipe.name}
        </h3>
        
        <p className="text-sm text-foreground/70 mb-5 line-clamp-2 leading-relaxed">
          Made with <span className="font-semibold text-foreground/90">{recipe.ingredients.slice(0, 3).join(', ')}</span>...
        </p>

        <div className="mt-auto grid grid-cols-3 gap-2 py-4 border-t border-border/50 mb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="text-xs font-bold text-foreground/80">₹{recipe.cost}</span>
            <span className="text-[10px] text-foreground/50 uppercase tracking-widest">Est. Cost</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-l border-r border-border/50">
            <Beef className="w-4 h-4 text-rose-500 mb-1" />
            <span className="text-xs font-bold text-foreground/80">{recipe.protein}g</span>
            <span className="text-[10px] text-foreground/50 uppercase tracking-widest">Protein</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <Flame className="w-4 h-4 text-orange-500 mb-1" />
            <span className="text-xs font-bold text-foreground/80">{recipe.calories}</span>
            <span className="text-[10px] text-foreground/50 uppercase tracking-widest">Kcal</span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full z-10">
          <Link 
            href={`/recipes/${recipe.slug || recipe.id}`}
            className="flex-1 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-600 dark:text-brand-400 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center transition-colors mr-2"
          >
            Quick View
          </Link>
          <div className="flex items-center font-bold text-brand-600 text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        <Link href={`/recipes/${recipe.slug || recipe.id}`} className="absolute inset-0 z-0" aria-label={`View ${recipe.name}`} />
      </div>
    </div>
  );
}
