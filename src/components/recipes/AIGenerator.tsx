'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Clock, Target, ChefHat } from 'lucide-react';
import { Recipe } from '@/lib/api';

export function AIGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [goal, setGoal] = useState('Healthy Meal');
  const [time, setTime] = useState('30 mins');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recipe | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, goal, time })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-brand-400/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-brand-100 dark:bg-brand-900 rounded-2xl">
            <Sparkles className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">AI Recipe Magic ✨</h1>
            <p className="text-foreground/70">Create a unique recipe tailored to your fitness goals.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-semibold mb-2">Ingredients you have (comma separated)</label>
            <input 
              type="text" 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="E.g., Chicken breast, Spinach, Garlic, Spices"
              className="w-full bg-background border border-border rounded-xl h-14 px-4 shadow-inner focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-500" /> Meal Goal
              </label>
              <select 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-background border border-border rounded-xl h-14 px-4 shadow-inner focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              >
                <option value="Healthy Meal">Healthy Meal</option>
                <option value="Muscle Gain (High Protein)">Muscle Gain (High Protein)</option>
                <option value="Weight Loss (Low Calorie)">Weight Loss (Low Calorie)</option>
                <option value="Budget friendly">Budget Friendly</option>
                <option value="Keto / Low Carb">Keto / Low Carb</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-500" /> Max Cooking Time
              </label>
              <select 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-background border border-border rounded-xl h-14 px-4 shadow-inner focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              >
                <option value="15 mins">15 mins (Quick)</option>
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="1 hour">1 hour+</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !ingredients}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl h-14 flex items-center justify-center font-bold text-lg tracking-wide transition-colors shadow-lg shadow-brand-500/30 disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generate Custom Recipe'}
          </button>
        </form>
      </div>

      {result && !loading && (
        <div className="glass-card p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 border-2 border-brand-500/30">
          <div className="flex items-center gap-3 mb-6">
            <ChefHat className="w-8 h-8 text-brand-500" />
            <h2 className="text-3xl font-bold">{result.name}</h2>
          </div>
          
          <div className="flex gap-4 mb-8 flex-wrap">
            <span className="px-3 py-1 bg-brand-500 text-white rounded-full text-sm font-bold uppercase shadow-md shadow-brand-500/20 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> AI Assisted Recipe
            </span>
            <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-bold uppercase">
              {result.time}
            </span>
            <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-bold uppercase">
              {result.calories} Calories
            </span>
            {result.protein && (
              <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-full text-sm font-bold uppercase">
                {result.protein}g Protein
              </span>
            )}
            <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-bold uppercase">
              {goal}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-border pb-2">Ingredients</h3>
              <ul className="space-y-2">
                {result.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-border pb-2">Instructions</h3>
              <ul className="space-y-4">
                {result.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-black text-brand-500 mt-0.5">{i + 1}.</span>
                    <p className="text-foreground/90">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
