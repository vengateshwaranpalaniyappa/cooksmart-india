import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReminderClick extends Document {
  userId: mongoose.Types.ObjectId;
  targetId?: string; // Can be a recipeId or 'meal-plan'
  type: 'recipe' | 'meal-plan';
  createdAt: Date;
}

const ReminderClickSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: String, required: true },
  type: { type: String, enum: ['recipe', 'meal-plan'], required: true },
}, { timestamps: true });

export const ReminderClick: Model<IReminderClick> = mongoose.models.ReminderClick || mongoose.model<IReminderClick>('ReminderClick', ReminderClickSchema);
