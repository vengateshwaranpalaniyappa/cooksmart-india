import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISearchHistory extends Document {
  userId?: string;
  ingredients: string[];
  timestamp: Date;
}

const SearchHistorySchema: Schema = new Schema({
  userId: { type: String }, // Optional, for anonymous searches
  ingredients: [{ type: String, required: true }],
  timestamp: { type: Date, default: Date.now }
});

export const SearchHistory: Model<ISearchHistory> = mongoose.models.SearchHistory || mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema);
