import { COMMON_TEXTS } from '@/lib/constants/messages';

// 按需 ISR 生成頁面時的載入畫面（取代原 Pages Router 的 router.isFallback 狀態）
export default function Loading() {
  return (
    <div className="container mx-auto py-10 text-center">
      {COMMON_TEXTS.LOADING}
    </div>
  );
}
