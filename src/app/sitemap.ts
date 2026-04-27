import { MetadataRoute } from 'next';
import { getRecipes } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cooksmartindia.com';
  
  // Get all recipes to generate dynamic recipe URLs
  const recipes = await getRecipes();
  const recipeUrls = recipes.map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Define static routes
  const staticRoutes = [
    '',
    '/recipes',
    '/categories',
    '/ai-generator',
    '/categories/budget',
    '/categories/gym',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...staticRoutes, ...recipeUrls];
}
