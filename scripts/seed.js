const mongoose = require('mongoose');

// Load env variables
require('dotenv').config({ path: '.env.local' });

// We define the schema inline here just for seeding purposes without relying on TypeScript compilation
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String, required: true },
  cuisine: { type: String, default: 'Indian' },
  requiredIngredients: [{ type: String, required: true }],
  optionalIngredients: [{ type: String }],
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  cost: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  category: [{ type: String }],
  tags: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  metaTitle: { type: String },
  metaDescription: { type: String },
});

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

const recipesData = [
  {
    name: "High-Protein Paneer Bhurji",
    slug: "high-protein-paneer-bhurji",
    description: "A quick, protein-packed scrambled paneer dish perfect for breakfast or dinner.",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Paneer", "Onions", "Tomatoes", "Green Chilies"],
    optionalIngredients: ["Coriander", "Garam Masala"],
    calories: 320,
    protein: 22,
    cost: 45,
    cookingTime: 15,
    category: ["Breakfast", "High Protein", "Vegetarian"],
    tags: ["quick", "budget"],
    isVerified: true
  },
  {
    name: "Soya Chunk Curry",
    slug: "soya-chunk-curry",
    description: "The ultimate budget-friendly high protein muscle building meal.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Soya Chunks", "Tomatoes", "Ginger Garlic Paste"],
    optionalIngredients: ["Kasuri Methi", "Cream"],
    calories: 380,
    protein: 35,
    cost: 30,
    cookingTime: 25,
    category: ["Lunch", "High Protein", "Budget"],
    tags: ["muscle-gain", "vegetarian"],
    isVerified: true
  },
  {
    name: "Dal Tadka & Brown Rice",
    slug: "dal-tadka-brown-rice",
    description: "Classic Indian comfort food elevated with complex carbs.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Toor Dal", "Brown Rice", "Ghee", "Garlic", "Cumin"],
    optionalIngredients: ["Red Chili", "Coriander"],
    calories: 450,
    protein: 20,
    cost: 40,
    cookingTime: 30,
    category: ["Lunch", "Vegetarian", "Healthy"],
    tags: ["comfort", "budget"],
    isVerified: true
  },
  {
    name: "Egg Bhurji Wrap",
    slug: "egg-bhurji-wrap",
    description: "Spicy scrambled eggs wrapped in a whole wheat roti.",
    image: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Eggs", "Whole Wheat Roti", "Onions", "Green Chilies"],
    optionalIngredients: ["Cheese", "Mint Chutney"],
    calories: 380,
    protein: 24,
    cost: 35,
    cookingTime: 10,
    category: ["Breakfast", "Snack", "High Protein"],
    tags: ["quick", "egg"],
    isVerified: true
  },
  {
    name: "Chicken Tikka Salad",
    slug: "chicken-tikka-salad",
    description: "Grilled chicken tikka tossed with fresh greens.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Chicken Breast", "Yogurt", "Tikka Masala", "Cucumber", "Lettuce"],
    optionalIngredients: ["Lemon", "Mint"],
    calories: 300,
    protein: 40,
    cost: 80,
    cookingTime: 25,
    category: ["Dinner", "High Protein", "Weight Loss"],
    tags: ["chicken", "salad"],
    isVerified: true
  },
  {
    name: "Masala Oats with Egg Whites",
    slug: "masala-oats-egg-whites",
    description: "A savory, protein-packed start to your day.",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Oats", "Egg Whites", "Mixed Veggies", "Turmeric"],
    optionalIngredients: ["Coriander"],
    calories: 280,
    protein: 22,
    cost: 25,
    cookingTime: 10,
    category: ["Breakfast", "High Protein", "Budget"],
    tags: ["quick", "healthy"],
    isVerified: true
  },
  {
    name: "Chole (Chickpea) Masala",
    slug: "chole-masala",
    description: "Spicy, tangy, and rich in plant-based protein.",
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Chickpeas", "Onions", "Tomatoes", "Chole Masala"],
    optionalIngredients: ["Amchur", "Ginger"],
    calories: 350,
    protein: 18,
    cost: 30,
    cookingTime: 40,
    category: ["Lunch", "Vegetarian", "Healthy"],
    tags: ["curry", "vegan"],
    isVerified: true
  },
  {
    name: "Sprout Chaat",
    slug: "sprout-chaat",
    description: "A refreshing, crunchy, and highly nutritious snack.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Moong Sprouts", "Onions", "Tomatoes", "Lemon", "Chaat Masala"],
    optionalIngredients: ["Pomegranate", "Green Chutney"],
    calories: 150,
    protein: 12,
    cost: 20,
    cookingTime: 5,
    category: ["Snack", "Vegetarian", "Weight Loss"],
    tags: ["quick", "raw"],
    isVerified: true
  },
  {
    name: "Palak Chicken",
    slug: "palak-chicken",
    description: "Lean chicken breast cooked in a nutritious spinach gravy.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Chicken Breast", "Spinach", "Garlic", "Garam Masala"],
    optionalIngredients: ["Cream", "Kasuri Methi"],
    calories: 320,
    protein: 38,
    cost: 90,
    cookingTime: 35,
    category: ["Dinner", "High Protein", "Healthy"],
    tags: ["chicken", "curry"],
    isVerified: true
  },
  {
    name: "Rajma Chawal",
    slug: "rajma-chawal",
    description: "Kidney beans in a thick gravy served with rice.",
    image: "https://images.unsplash.com/photo-1625398407796-a29b62c02811?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Kidney Beans", "Rice", "Onions", "Tomatoes", "Rajma Masala"],
    optionalIngredients: ["Coriander", "Ghee"],
    calories: 450,
    protein: 18,
    cost: 35,
    cookingTime: 45,
    category: ["Lunch", "Vegetarian", "Comfort"],
    tags: ["comfort", "budget"],
    isVerified: true
  },
  // Adding more to reach 25
  ...Array.from({ length: 15 }).map((_, i) => ({
    name: `Budget Muscle Meal ${i + 1}`,
    slug: `budget-muscle-meal-${i + 1}`,
    description: "A randomly generated high protein meal.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: ["Soya Chunks", "Lentils", "Chicken", "Eggs", "Paneer"].sort(() => 0.5 - Math.random()).slice(0, 2),
    optionalIngredients: ["Spices"],
    calories: Math.floor(Math.random() * 300) + 300,
    protein: Math.floor(Math.random() * 20) + 20,
    cost: Math.floor(Math.random() * 50) + 30,
    cookingTime: Math.floor(Math.random() * 20) + 10,
    category: ["High Protein", "Budget"],
    tags: ["gym"],
    isVerified: true
  }))
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Please define MONGODB_URI in .env.local");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected.");

    console.log("Clearing existing recipes...");
    await Recipe.deleteMany({});
    
    console.log("Inserting 25 recipes...");
    await Recipe.insertMany(recipesData);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
