import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecipe extends Document {
  name: string;
  slug: string;
  description?: string;
  image: string;
  cuisine: string;
  requiredIngredients: string[];
  optionalIngredients?: string[];
  steps?: string[];
  calories: number;
  protein: number;
  cost: number;
  cookingTime: number; // in mins
  category: string[];
  tags: string[];
  isVerified: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

const RecipeSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String, required: true },
  cuisine: { type: String, default: 'Indian' },
  
  requiredIngredients: [{ type: String, required: true }],
  optionalIngredients: [{ type: String }],
  steps: [{ type: String }],
  
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  cost: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  
  category: [{ type: String }],
  tags: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  
  metaTitle: { type: String },
  metaDescription: { type: String },
}, { timestamps: true });

export const Recipe: Model<IRecipe> = mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
