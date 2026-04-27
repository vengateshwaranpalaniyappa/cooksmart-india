import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMealPlan extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  breakfast: mongoose.Types.ObjectId;
  lunch: mongoose.Types.ObjectId;
  dinner: mongoose.Types.ObjectId;
}

const MealPlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  breakfast: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  lunch: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  dinner: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
}, { timestamps: true });

// Ensure one plan per user per date
MealPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

export const MealPlan: Model<IMealPlan> = mongoose.models.MealPlan || mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);
