import type { RecipePageSEOProps, RecipeStructuredData } from '@/types/seo';
import {
  generateImageUrl,
  formatRecipeRating,
  formatCookingTime,
} from '@/lib/utils/seo';
import { PageSEO } from './PageSEO';

type RecipeSEOProps = RecipePageSEOProps;

// 食譜專用 SEO 組件
const RecipeSEO = ({
  title,
  description,
  keywords,
  canonical,
  image,
  imageAlt,
  robots,
  structuredData = [],
  recipe,
}: RecipeSEOProps) => {
  // 生成食譜結構化數據
  const generateRecipeStructuredData = (): RecipeStructuredData => {
    const recipeStructuredData: RecipeStructuredData = {
      '@type': 'Recipe',
      name: recipe.name,
      description: recipe.description,
      image: recipe.image.map((img) => generateImageUrl(img)),
      author: {
        '@type': 'Person',
        name: recipe.author,
      },
      datePublished: recipe.datePublished,
    };

    // 添加可選欄位
    if (recipe.prepTime) {
      // 假設時間以分鐘為單位，轉換為 ISO 8601 格式
      const prepTimeMinutes = parseInt(recipe.prepTime, 10);
      if (!Number.isNaN(prepTimeMinutes)) {
        recipeStructuredData.prepTime = formatCookingTime(prepTimeMinutes);
      }
    }

    if (recipe.cookTime) {
      const cookTimeMinutes = parseInt(recipe.cookTime, 10);
      if (!Number.isNaN(cookTimeMinutes)) {
        recipeStructuredData.cookTime = formatCookingTime(cookTimeMinutes);
      }
    }

    if (recipe.totalTime) {
      const totalTimeMinutes = parseInt(recipe.totalTime, 10);
      if (!Number.isNaN(totalTimeMinutes)) {
        recipeStructuredData.totalTime = formatCookingTime(totalTimeMinutes);
      }
    }

    if (recipe.recipeYield) {
      recipeStructuredData.recipeYield = recipe.recipeYield;
    }

    if (recipe.recipeCategory) {
      recipeStructuredData.recipeCategory = recipe.recipeCategory;
    }

    if (recipe.recipeCuisine) {
      recipeStructuredData.recipeCuisine = recipe.recipeCuisine;
    }

    if (recipe.recipeIngredient && recipe.recipeIngredient.length > 0) {
      recipeStructuredData.recipeIngredient = recipe.recipeIngredient;
    }

    if (recipe.recipeInstructions && recipe.recipeInstructions.length > 0) {
      recipeStructuredData.recipeInstructions = recipe.recipeInstructions.map(
        (instruction) => ({
          '@type': 'HowToStep',
          name: instruction.name,
          text: instruction.text,
          image: instruction.image
            ? generateImageUrl(instruction.image)
            : undefined,
        }),
      );
    }

    if (recipe.nutrition) {
      recipeStructuredData.nutrition = {
        '@type': 'NutritionInformation',
        calories: recipe.nutrition.calories,
        fatContent: recipe.nutrition.fatContent,
        carbohydrateContent: recipe.nutrition.carbohydrateContent,
        proteinContent: recipe.nutrition.proteinContent,
      };
    }

    if (recipe.aggregateRating) {
      recipeStructuredData.aggregateRating = formatRecipeRating(
        recipe.aggregateRating.ratingValue,
        recipe.aggregateRating.reviewCount,
      );
    }

    if (recipe.video) {
      recipeStructuredData.video = {
        '@type': 'VideoObject',
        name: recipe.video.name,
        description: recipe.video.description,
        thumbnailUrl: generateImageUrl(recipe.video.thumbnailUrl),
        contentUrl: recipe.video.contentUrl,
        embedUrl: recipe.video.embedUrl,
        uploadDate: recipe.video.uploadDate,
        duration: recipe.video.duration,
      };
    }

    return recipeStructuredData;
  };

  // 組合結構化數據
  const combinedStructuredData = [
    generateRecipeStructuredData(),
    ...structuredData,
  ];

  // 使用食譜圖片作為預設 Open Graph 圖片
  const defaultImage = recipe.image[0] || '/images/og-default.jpg';
  const defaultImageAlt = `${recipe.name} 食譜圖片`;

  return (
    <PageSEO
      title={title}
      description={description}
      keywords={keywords}
      canonical={canonical}
      image={image || defaultImage}
      imageAlt={imageAlt || defaultImageAlt}
      robots={robots}
      structuredData={combinedStructuredData}
    />
  );
};

export { RecipeSEO };
