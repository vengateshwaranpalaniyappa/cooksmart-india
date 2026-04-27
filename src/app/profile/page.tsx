export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { SearchHistory } from "@/models/SearchHistory";
import { RecipeCard } from "@/components/ui/RecipeCard";
import { Settings, History, Heart, User as UserIcon } from "lucide-react";
import { DailyReminderOptIn } from "@/components/profile/DailyReminderOptIn";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  await connectDB();
  
  const userId = (session.user as any).id;
  const user = await User.findById(userId).populate('savedRecipes').lean();
  
  if (!user) {
    redirect("/");
  }

  const history = await SearchHistory.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean();

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex items-center gap-6 mb-12 bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        {session.user.image ? (
          <Image src={session.user.image} alt="Profile" width={96} height={96} className="w-24 h-24 rounded-full border-4 border-brand-500/20 shadow-lg" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center border-4 border-brand-500/20 shadow-lg">
            <UserIcon className="w-12 h-12" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">{session.user.name}</h1>
          <p className="text-foreground/60 font-medium">{session.user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Preferences Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <DailyReminderOptIn initialData={user.reminder} />

          <div className="glass-card p-6 border border-border/50 rounded-3xl sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
              <Settings className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-bold">Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-2 block">Daily Budget Goal</label>
                <div className="flex items-center gap-2 bg-foreground/5 p-3 rounded-xl border border-foreground/5 font-bold text-lg">
                  <span className="text-brand-500">₹</span> {user.preferences?.budget || 150}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-bold text-foreground/60 uppercase tracking-widest mb-2 block">Daily Protein Goal</label>
                <div className="flex items-center gap-2 bg-foreground/5 p-3 rounded-xl border border-foreground/5 font-bold text-lg">
                  <span className="text-rose-500">P</span> {user.preferences?.proteinGoal || 100}g
                </div>
              </div>
            </div>
            <p className="text-xs text-foreground/40 mt-6 font-medium text-center">Settings update automatically based on your usage.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 flex flex-col gap-8">
          
          {/* Saved Recipes */}
          <section className="bg-card p-8 rounded-3xl border border-border/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold tracking-tight">Saved Recipes</h2>
              </div>
              <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-bold">{user.savedRecipes?.length || 0} Saved</span>
            </div>

            {user.savedRecipes && user.savedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user.savedRecipes.map((recipe: any) => (
                  <RecipeCard key={recipe._id.toString()} recipe={{...recipe, id: recipe._id.toString()}} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-foreground/5 rounded-2xl border border-dashed border-foreground/10">
                <Heart className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
                <p className="text-foreground/60 font-medium">You haven't saved any recipes yet.</p>
              </div>
            )}
          </section>

          {/* Search History */}
          <section className="bg-card p-8 rounded-3xl border border-border/50 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-6 h-6 text-brand-500" />
              <h2 className="text-2xl font-bold tracking-tight">Recent Searches</h2>
            </div>
            
            {history.length > 0 ? (
              <ul className="space-y-3">
                {history.map((h: any) => (
                  <li key={h._id.toString()} className="flex items-center justify-between p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-xl font-medium border border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      {h.ingredients.join(', ')}
                    </div>
                    <span className="text-xs text-foreground/50">{new Date(h.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/60 font-medium">No recent searches.</p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
