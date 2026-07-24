'use client';

import { type ComponentProps } from 'react';
import { useWakeLock } from '@/hooks/useWakeLock';
import RecipePageComponent from '@/components/pages/RecipePage';

type RecipePageClientProps = {
  recipeData: ComponentProps<typeof RecipePageComponent>['recipeData'];
};

/**
 * 食譜頁 client 包裝：顯示食譜時請求 Wake Lock，避免煮菜時螢幕自動熄滅
 * （只有在 server 端確認資料成功後才會渲染此元件）
 */
export function RecipePageClient({ recipeData }: RecipePageClientProps) {
  useWakeLock(true);
  return <RecipePageComponent recipeData={recipeData} />;
}
