import { useEffect, useState } from 'react';

type OrientationInfo = {
  isMobile: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  orientation: string;
};

/**
 * 螢幕方向偵測 Hook (CSS-First 方案)
 * 主要依賴 CSS 媒體查詢，JavaScript 僅用於偵測和分析
 * 不再嘗試強制鎖定方向，改為配合 Tailwind CSS 方案
 */
export const useScreenOrientation = () => {
  const [orientationInfo, setOrientationInfo] = useState<OrientationInfo>({
    isMobile: false,
    isPortrait: false,
    isLandscape: false,
    orientation: 'unknown',
  });

  useEffect(() => {
    // 檢查是否為移動裝置
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    /**
     * 更新方向資訊
     */
    const updateOrientationInfo = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isLandscape = window.innerWidth > window.innerHeight;

      // 嘗試獲取 orientation 資訊 (如果可用)
      let orientation = 'unknown';
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const screenAPI = window.screen as any;
        if ('orientation' in screenAPI && 'type' in screenAPI.orientation) {
          orientation = screenAPI.orientation.type;
        } else if (typeof window.orientation !== 'undefined') {
          orientation = `${window.orientation}deg`;
        }
      } catch (error) {
        // 靜默處理錯誤，降級到基本偵測
        console.debug('Orientation API 不可用，使用基本偵測');
      }

      setOrientationInfo({
        isMobile,
        isPortrait,
        isLandscape,
        orientation,
      });

      // 在開發環境下提供偵測資訊
      if (process.env.NODE_ENV === 'development' && isMobile) {
        console.debug('螢幕方向偵測:', {
          isPortrait,
          isLandscape,
          orientation,
          dimensions: `${window.innerWidth}x${window.innerHeight}`,
        });
      }
    };

    // 初始化
    updateOrientationInfo();

    // 監聽視窗大小和方向變化
    const handleResize = () => updateOrientationInfo();
    const handleOrientationChange = () => {
      // 延遲執行，確保方向變化完成
      setTimeout(updateOrientationInfo, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientationInfo;
};
