const fs = require('fs');

const categories = ["Indian Veg", "Non-Veg", "South Indian", "North Indian", "Budget", "Gym/Protein"];
const baseIngredients = [
  "Rice", "Chicken", "Paneer", "Dal", "Onion", "Tomato", "Ginger", "Garlic", 
  "Egg", "Mutton", "Fish", "Cumin", "Turmeric", "Coriander", "Chili Powder", 
  "Potato", "Cauliflower", "Peas", "Spinach", "Yogurt", "Milk", "Besan", "Wheat Flour"
];

const recipes = [];

for (let i = 1; i <= 60; i++) {
  const cat1 = categories[Math.floor(Math.random() * categories.length)];
  const cat2 = categories[Math.floor(Math.random() * categories.length)];
  const isVeg = cat1.includes("Veg") || cat1.includes("South Indian");
  
  const selectedIngredients = [];
  const numIngredients = Math.floor(Math.random() * 5) + 4; // 4 to 8 ingredients
  for (let j = 0; j < numIngredients; j++) {
    const ing = baseIngredients[Math.floor(Math.random() * baseIngredients.length)];
    if (!selectedIngredients.includes(ing)) selectedIngredients.push(ing);
  }

  recipes.push({
    id: `recipe-${i}`,
    name: `Delicious Indian Dish ${i}`,
    ingredients: selectedIngredients,
    category: [cat1, cat2].filter((v, i, a) => a.indexOf(v) === i),
    calories: Math.floor(Math.random() * 500) + 200,
    time: `${Math.floor(Math.random() * 40) + 10} mins`,
    steps: [
      "Prepare all ingredients and chop vegetables/meat.",
      "Heat oil in a pan and add whole spices.",
      "Add onions and sauté until golden brown.",
      "Add ginger-garlic paste and tomatoes, cook until oil separates.",
      "Add the main ingredients and powdered spices.",
      "Cook for 10-15 minutes or until done.",
      "Garnish with fresh coriander and serve hot."
    ],
    tags: ["Indian", "Quick", cat1],
    image: `https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop` // generic placeholder
  });
}

// Add some specific ones for the requested pages
recipes.push({
  id: "recipe-egg-curry",
  name: "Spicy Egg Curry with Rice",
  ingredients: ["Egg", "Rice", "Onion", "Tomato", "Ginger", "Garlic", "Spices"],
  category: ["Non-Veg", "Budget", "Gym/Protein"],
  calories: 450,
  time: "30 mins",
  steps: ["Boil eggs", "Make curry base with onion and tomato", "Simmer eggs in curry", "Serve with steamed rice"],
  tags: ["High Protein", "Budget", "Egg"],
  image: "https://images.unsplash.com/photo-1627308595229-7830f5c90683?q=80&w=600&auto=format&fit=crop"
});

recipes.push({
  id: "recipe-paneer-bhurji",
  name: "Paneer Bhurji",
  ingredients: ["Paneer", "Onion", "Tomato", "Green Chili", "Turmeric"],
  category: ["Indian Veg", "Gym/Protein", "North Indian"],
  calories: 300,
  time: "15 mins",
  steps: ["Crumble paneer", "Sauté onions and tomatoes", "Add spices and paneer", "Cook for 5 mins"],
  tags: ["High Protein", "Quick"],
  image: "https://images.unsplash.com/photo-1632349079963-71ab527964b7?q=80&w=600&auto=format&fit=crop"
});

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/recipes.json', JSON.stringify(recipes, null, 2));
console.log('Recipes generated in src/data/recipes.json');
