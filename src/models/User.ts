import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  savedRecipes: mongoose.Types.ObjectId[];
  preferences: {
    budget: number;
    proteinGoal: number;
  };
  reminder?: {
    type: 'email' | 'whatsapp';
    contact: string;
    optedIn: boolean;
  };
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  preferences: {
    budget: { type: Number, default: 150 },
    proteinGoal: { type: Number, default: 100 }
  },
  reminder: {
    type: { type: String, enum: ['email', 'whatsapp'] },
    contact: { type: String },
    optedIn: { type: Boolean, default: false }
  }
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
