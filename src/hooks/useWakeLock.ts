import { useEffect, useRef } from 'react';

// Screen Wake Lock API 的最小型別（部分 TS lib 尚未內建）
type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
};

/**
 * 於元件掛載且 `enabled` 為 true 時請求 Screen Wake Lock，避免螢幕自動熄滅
 * （適用食譜煮菜頁）。
 * - feature detection：不支援的瀏覽器安靜略過、不報錯
 * - 分頁重新可見時自動重取（系統會在分頁隱藏時釋放 wake lock）
 * - 卸載或 `enabled` 轉 false 時釋放
 */
export const useWakeLock = (enabled: boolean = true): void => {
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const { wakeLock } = navigator as NavigatorWithWakeLock;
    if (!wakeLock) return undefined;

    let cancelled = false;

    // 請求 wake lock；使用者非前景或裝置拒絕時會拋錯，安靜略過
    const request = async () => {
      try {
        const sentinel = await wakeLock.request('screen');
        if (cancelled) {
          await sentinel.release();
          return;
        }
        sentinelRef.current = sentinel;
      } catch {
        // 忽略：不影響頁面功能
      }
    };

    // 分頁回到前景時重新請求
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        request();
      }
    };

    request();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      const sentinel = sentinelRef.current;
      sentinelRef.current = null;
      if (sentinel && !sentinel.released) {
        sentinel.release().catch(() => undefined);
      }
    };
  }, [enabled]);
};
