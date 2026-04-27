const fs = require('fs');
const path = require('path');

const files = [
  'src/app/categories/page.tsx',
  'src/app/categories/[category]/page.tsx',
  'src/app/results/page.tsx',
  'src/app/recipes/page.tsx',
  'src/app/recipes/[slug]/page.tsx',
  'src/app/high-protein-meals/page.tsx',
  'src/app/budget-meals-under/[value]/page.tsx',
  'src/app/recipes-with/[ingredient]/page.tsx',
  'src/app/meal-plan/page.tsx',
  'src/app/meal-plan/today/page.tsx',
  'src/app/page.tsx',
  'src/app/saved/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/sitemap.ts'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('export const dynamic')) {
      const newContent = `export const dynamic = 'force-dynamic';\n` + content;
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated', file);
    }
  }
});
