import { AIGenerator } from '@/components/recipes/AIGenerator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Recipe Generator | CookSmart India',
  description: 'Use our advanced AI to generate unique healthy recipes based on your specific diets and ingredients available in your fridge.',
};

export default function AIGeneratorPage() {
  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <AIGenerator />
    </div>
  );
}
