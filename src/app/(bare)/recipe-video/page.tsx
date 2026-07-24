import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { RecipeVideoClient } from './recipe-video-client';

// 教學視頻頁 Metadata（取代 next/head 的靜態部分；動態標題於 client 端以 document.title 設定）
export const metadata: Metadata = {
  title: '教學視頻',
  description: '安那煮 Anna Cook 食譜教學視頻',
};

// 視頻頁 viewport：停用縮放以獲得最佳觀影體驗（取代原 next/head 的 viewport meta）
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 載入中畫面（Suspense fallback；client 端 useSearchParams 在靜態渲染時需 Suspense 邊界）
function VideoLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4" />
        <p>載入教學資訊中...</p>
      </div>
    </div>
  );
}

// 教學視頻頁（server 外殼）：提供 metadata/viewport，並以 Suspense 包住讀取 query 的 client 元件
export default function RecipeVideoPage() {
  return (
    <Suspense fallback={<VideoLoading />}>
      <RecipeVideoClient />
    </Suspense>
  );
}
