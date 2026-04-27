'use client';

import { useState } from 'react';
import { Bell, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function DailyReminderOptIn({ 
  initialData 
}: { 
  initialData?: { type: 'email' | 'whatsapp', contact: string, optedIn: boolean } 
}) {
  const [optedIn, setOptedIn] = useState(initialData?.optedIn || false);
  const [type, setType] = useState<'email' | 'whatsapp'>(initialData?.type || 'email');
  const [contact, setContact] = useState(initialData?.contact || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (optedIn && !contact) {
      toast.error('Please enter your contact detail');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optedIn, type, contact })
      });

      if (res.ok) {
        toast.success(optedIn ? 'Subscribed to daily meal plans!' : 'Unsubscribed from reminders');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-3xl p-6 md:p-8 border border-brand-500/20 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/20">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Daily Meal Reminder</h2>
          <p className="text-sm font-medium text-foreground/60">Get your curated meal plan + 1 secret recipe daily.</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-12 h-6 rounded-full transition-colors relative ${optedIn ? 'bg-brand-500' : 'bg-foreground/20'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${optedIn ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
          <span className="font-bold text-lg group-hover:text-brand-500 transition-colors">Enable Daily Reminders</span>
          <input type="checkbox" className="hidden" checked={optedIn} onChange={e => setOptedIn(e.target.checked)} />
        </label>

        {optedIn && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${type === 'email' ? 'border-brand-500 bg-brand-500/10 text-brand-600' : 'border-border/50 bg-foreground/5 hover:bg-foreground/10'}`}>
                <input type="radio" name="type" value="email" className="hidden" checked={type === 'email'} onChange={() => setType('email')} />
                <Mail className="w-5 h-5" /> <span className="font-bold">Email</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${type === 'whatsapp' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-border/50 bg-foreground/5 hover:bg-foreground/10'}`}>
                <input type="radio" name="type" value="whatsapp" className="hidden" checked={type === 'whatsapp'} onChange={() => setType('whatsapp')} />
                <Phone className="w-5 h-5" /> <span className="font-bold">WhatsApp</span>
              </label>
            </div>

            <div>
              <input 
                type={type === 'email' ? 'email' : 'tel'} 
                placeholder={type === 'email' ? 'your@email.com' : '+91 9876543210'} 
                value={contact}
                onChange={e => setContact(e.target.value)}
                className={`w-full bg-card border-2 rounded-xl px-4 py-3 font-semibold outline-none transition-all focus:ring-4 ${type === 'whatsapp' ? 'border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/20' : 'border-brand-500/30 focus:border-brand-500 focus:ring-brand-500/20'}`}
              />
            </div>
          </div>
        )}

        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-foreground text-background py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-xl"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Save Preferences</>}
        </button>
      </div>
    </div>
  );
}
