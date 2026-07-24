'use client';

import { useEffect } from 'react';

// 註冊 Service Worker（PWA 可安裝；本階段不做離線快取）
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;
    // 於 window load 後註冊，避免影響首屏渲染
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 註冊失敗不影響網站運作
      });
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
