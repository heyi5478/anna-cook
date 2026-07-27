'use client';

import { useAuth } from '@/hooks/useAuth';
import RecipeUploadStep2 from '@/components/pages/RecipeUploadStep2';
import { COMMON_TEXTS } from '@/lib/constants/messages';

// 上傳食譜步驟二：登入守衛（未登入時 useAuth 會自動導回登入頁）
export default function UploadRecipeStep2Page() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-neutral-600">{COMMON_TEXTS.LOADING}</div>
      </div>
    );
  }

  // 未認證（理論上不會顯示，useAuth 會自動重定向）
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <RecipeUploadStep2 />
    </div>
  );
}
