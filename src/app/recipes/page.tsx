import { RecipeFinder } from '@/components/recipes/RecipeFinder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Indian Recipes by Ingredients | CookSmart India',
  description: 'Enter the ingredients you have and find the perfect Indian recipe. Simple, fast, and healthy.',
};

export default function RecipesPage() {
  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <RecipeFinder />
    </div>
  );
}
