import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { ingredients, goal, time } = await request.json();

    if (!ingredients || !goal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        id: "ai-" + Date.now(),
        name: `Quick AI Stir Fry (${goal})`,
        ingredients: typeof ingredients === 'string' ? ingredients.split(',').map((i: string) => i.trim()) : ingredients,
        steps: [
          "Heat oil in a pan over medium heat.",
          `Add the main ingredients and sauté until golden.`,
          "Add the remaining ingredients and toss well.",
          "Season with salt, pepper, and your favorite Indian spices.",
          "Serve hot and enjoy your quick meal!"
        ],
        calories: goal.toLowerCase().includes('muscle') ? 600 : 350,
        protein: goal.toLowerCase().includes('muscle') ? 45 : 15,
        time: time || "20 mins",
        category: ["AI Assisted Recipe"],
        tags: ["AI Assisted Recipe"],
        image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80"
      });
    }

    const prompt = `Generate a realistic Indian recipe using these ingredients: ${ingredients}.
Goal: ${goal}.
Ensure:
- simple steps
- accurate cooking method
- include calories and protein estimate
- avoid unsafe or unrealistic combinations

Return ONLY valid JSON. No extra text.
Format strictly as: { "name": "", "ingredients": [], "steps": [], "calories": 0, "protein": 0, "time": "${time || '30 mins'}" }`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert Indian chef. You output JSON only. Return ONLY valid JSON. No extra text.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let recipeData;
    try {
      recipeData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON response:', content);
      throw new Error('Invalid JSON received from AI');
    }
    
    // Assign labels and default mock fields for UI
    recipeData.id = "ai-" + Date.now();
    recipeData.category = ["AI Assisted Recipe"];
    recipeData.tags = ["AI Assisted Recipe"];
    recipeData.image = "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80";

    return NextResponse.json(recipeData);

  } catch (error: any) {
    console.error('AI Generator Error:', error.message || error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'AI took too long to respond. Please try again.' },
        { status: 504 }
      );
    }

    // Fallback on error
    return NextResponse.json({
      id: "ai-fallback",
      name: "Simple Indian Style Sauté (Fallback)",
      ingredients: ["Mixed vegetables", "Spices", "Oil"],
      steps: ["Heat oil.", "Sauté vegetables.", "Add spices and serve."],
      calories: 250,
      protein: 10,
      time: "15 mins",
      category: ["AI Assisted Recipe"],
      tags: ["AI Assisted Recipe"],
      image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80"
    });
  }
}
