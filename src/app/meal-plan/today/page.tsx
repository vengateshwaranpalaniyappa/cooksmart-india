export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import { Recipe } from '@/models/Recipe';
import { MealPlan } from '@/models/MealPlan';
import { User } from '@/models/User';
import { DailyMealPlanner } from '@/components/meal-plan/DailyMealPlanner';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Disable caching for this route so user sessions and dynamic db generation work correctly
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Today's Optimal Meal Plan | CookSmart India",
  description: "Your personalized daily curated meal plan for breakfast, lunch, and dinner to hit your protein and budget goals.",
};

export default async function TodayMealPlanPage() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const todayStr = new Date().toISOString().split('T')[0];

  const rawRecipes = await Recipe.find({}).lean();
  const formatRecipe = (r: any) => ({
    ...r,
    id: r._id.toString(),
    time: `${r.cookingTime} mins`,
    ingredients: r.requiredIngredients || []
  });

  const allRecipes = rawRecipes.map(formatRecipe);
  const allBreakfasts = allRecipes.filter(r => r.category.includes('Breakfast'));
  const allLunches = allRecipes.filter(r => r.category.includes('Lunch'));
  const allDinners = allRecipes.filter(r => r.category.includes('Dinner'));

  let initialBreakfast = null;
  let initialLunch = null;
  let initialDinner = null;

  if (session && session.user) {
    const userId = (session.user as any).id;
    
    // Check if a plan already exists for today
    const existingPlan = await MealPlan.findOne({ userId, date: todayStr })
      .populate('breakfast lunch dinner')
      .lean();

    if (existingPlan && existingPlan.breakfast && existingPlan.lunch && existingPlan.dinner) {
      initialBreakfast = formatRecipe(existingPlan.breakfast);
      initialLunch = formatRecipe(existingPlan.lunch);
      initialDinner = formatRecipe(existingPlan.dinner);
    } else {
      // 1. Get preferences and past meals
      const user = await User.findById(userId).lean();
      const budget = user?.preferences?.budget || 150;
      const proteinGoal = user?.preferences?.proteinGoal || 100;

      const pastPlans = await MealPlan.find({ userId }).lean();
      const usedRecipeIds = new Set<string>();
      pastPlans.forEach(plan => {
        usedRecipeIds.add(plan.breakfast.toString());
        usedRecipeIds.add(plan.lunch.toString());
        usedRecipeIds.add(plan.dinner.toString());
      });

      // 2. Filter recipes (avoid repeats, fallback if running out)
      const getUnused = (pool: any[]) => {
        const unused = pool.filter(r => !usedRecipeIds.has(r.id));
        return unused.length > 0 ? unused : pool; // fallback if all used
      };

      const freshBreakfasts = getUnused(allBreakfasts);
      const freshLunches = getUnused(allLunches);
      const freshDinners = getUnused(allDinners);

      // 3. Simple algorithm to find a combo that meets constraints (budget, protein)
      // We try 50 random combos and pick the best one
      let bestCombo = { b: freshBreakfasts[0], l: freshLunches[0], d: freshDinners[0], score: -9999 };

      for (let i = 0; i < 50; i++) {
        const b = freshBreakfasts[Math.floor(Math.random() * freshBreakfasts.length)];
        const l = freshLunches[Math.floor(Math.random() * freshLunches.length)];
        const d = freshDinners[Math.floor(Math.random() * freshDinners.length)];

        const totalCost = b.cost + l.cost + d.cost;
        const totalProtein = b.protein + l.protein + d.protein;

        // Score: heavily penalize going over budget. Reward hitting protein.
        let score = totalProtein;
        if (totalCost > budget) {
          score -= (totalCost - budget) * 10; // massive penalty for going over budget
        }

        if (score > bestCombo.score) {
          bestCombo = { b, l, d, score };
        }
      }

      initialBreakfast = bestCombo.b;
      initialLunch = bestCombo.l;
      initialDinner = bestCombo.d;

      // 4. Store the newly generated plan
      try {
        await MealPlan.create({
          userId,
          date: todayStr,
          breakfast: initialBreakfast.id,
          lunch: initialLunch.id,
          dinner: initialDinner.id
        });
      } catch (err) {
        console.error("Failed to save new meal plan:", err);
      }
    }

  } else {
    // Guest Fallback (Deterministic Hash based on Date)
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = ((hash << 5) - hash) + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    initialBreakfast = allBreakfasts.length > 0 ? allBreakfasts[seed % allBreakfasts.length] : null;
    initialLunch = allLunches.length > 0 ? allLunches[seed % allLunches.length] : null;
    initialDinner = allDinners.length > 0 ? allDinners[seed % allDinners.length] : null;
  }

  return (
    <DailyMealPlanner 
      initialBreakfast={initialBreakfast}
      initialLunch={initialLunch}
      initialDinner={initialDinner}
      allBreakfasts={allBreakfasts}
      allLunches={allLunches}
      allDinners={allDinners}
    />
  );
}
