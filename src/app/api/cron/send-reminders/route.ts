import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Recipe } from '@/models/Recipe';
import nodemailer from 'nodemailer';

// MOCK: In production, this would be secured behind an API key or called via Vercel Cron
export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Find all users who opted in to reminders
    const usersToRemind = await User.find({ 'reminder.optedIn': true }).lean();
    
    if (usersToRemind.length === 0) {
      return NextResponse.json({ success: true, message: 'No users opted in for reminders.' });
    }

    const allRecipes = await Recipe.find({}).lean();
    if (allRecipes.length === 0) {
      return NextResponse.json({ success: false, error: 'No recipes in DB to suggest.' }, { status: 400 });
    }

    const remindersSent = [];

    // Optional Nodemailer Setup (If env vars are present)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    for (const user of usersToRemind) {
      // Pick a random recommended recipe
      const recommendedRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      
      // Pick a random meal plan
      const breakfast = allRecipes.find(r => r.category.includes('Breakfast') && r._id.toString() !== recommendedRecipe._id.toString());
      const lunch = allRecipes.find(r => r.category.includes('Lunch') && r._id.toString() !== recommendedRecipe._id.toString());
      const dinner = allRecipes.find(r => r.category.includes('Dinner') && r._id.toString() !== recommendedRecipe._id.toString());
      
      const mealPlan = [breakfast, lunch, dinner].filter(Boolean);
      const mealIds = mealPlan.map(m => m?._id.toString()).join(',');

      // Base URL from env or fallback
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cooksmartindia.com';

      // Deep URLs
      const rawMealPlanUrl = `${baseUrl}/meal-plan?preloaded=true&ids=${mealIds}`;
      const rawRecipeUrl = `${baseUrl}/recipes/${recommendedRecipe.slug || recommendedRecipe._id}`;
      
      const mealPlanUrl = `${baseUrl}/api/track-click?userId=${user._id}&redirect=${encodeURIComponent(rawMealPlanUrl)}`;
      const recipeUrl = `${baseUrl}/api/track-click?userId=${user._id}&recipeId=${recommendedRecipe._id}&redirect=${encodeURIComponent(rawRecipeUrl)}`;

      const transportType = user.reminder?.type === 'whatsapp' ? 'WhatsApp' : 'Email';
      const destination = user.reminder?.contact || user.email;

      if (transportType === 'whatsapp') {
        console.log(`\n=== MOCK WHATSAPP SEND TO: ${destination} ===`);
        console.log(`🔥 Today’s ₹50 High Protein Plan is ready!\n`);
        mealPlan.forEach(meal => {
          console.log(`• ${meal?.name} (₹${meal?.cost}, ${meal?.protein}g protein)`);
        });
        console.log(`\n👉 *View Today's Meal Plan*: ${mealPlanUrl}`);
        console.log(`\n🔥 *Secret Recipe*: ${recommendedRecipe.name}`);
        console.log(`👉 *Cook This Now*: ${recipeUrl}`);
        console.log(`===========================================\n`);
      } else {
        // Real Email Sending (or mock log if credentials missing)
        const htmlContent = `
          <h3>🔥 Today’s ₹50 High Protein Plan is ready!</h3>
          <ul>
            ${mealPlan.map(meal => `<li><strong>${meal?.name}</strong> - ₹${meal?.cost}, ${meal?.protein}g protein</li>`).join('')}
          </ul>
          <a href="${mealPlanUrl}" style="padding:10px 20px; background:#10b981; color:white; border-radius:5px; text-decoration:none; display:inline-block; margin-bottom:10px;">View Today's Meal Plan</a>
          <br><br>
          <h3>🔥 Secret Recommended Recipe: ${recommendedRecipe.name}</h3>
          <a href="${recipeUrl}" style="padding:10px 20px; background:#f43f5e; color:white; border-radius:5px; text-decoration:none; display:inline-block;">Cook This Now</a>
        `;

        if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
          try {
            await transporter.sendMail({
              from: process.env.EMAIL_FROM || '"CookSmart India" <noreply@cooksmartindia.com>',
              to: destination,
              subject: 'Your Daily CookSmart Meal Plan! 🍳',
              html: htmlContent,
            });
            console.log(`Email successfully sent to ${destination}`);
          } catch (e) {
            console.error(`Failed to send real email to ${destination}`, e);
          }
        } else {
          console.log(`\n=== MOCK EMAIL SEND TO: ${destination} (Missing SMTP config) ===`);
          console.log(htmlContent);
          console.log(`===========================================\n`);
        }
      }

      remindersSent.push({
        userId: user._id,
        destination,
        transport: transportType,
        status: 'Sent'
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${remindersSent.length} daily reminders.`,
      log: remindersSent
    });

  } catch (error) {
    console.error('Error in CRON send-reminders:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
