import { useEffect } from 'react';

/**
 * 管理螢幕方向的 Hook
 */
export const useScreenOrientation = () => {
  useEffect(() => {
    // 檢查是否為移動裝置
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) return undefined;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const screenAPI = window.screen as any;

      if ('orientation' in screenAPI && 'lock' in screenAPI.orientation) {
        screenAPI.orientation.lock('landscape').catch((error: unknown) => {
          console.error('無法鎖定螢幕方向:', error);
        });
      }

      /**
       * 監聽方向變化，嘗試再次強制橫向
       */
      const atOrientationChange = () => {
        if (
          'orientation' in screenAPI &&
          'type' in screenAPI.orientation &&
          screenAPI.orientation.type.includes('portrait')
        ) {
          if ('lock' in screenAPI.orientation) {
            screenAPI.orientation.lock('landscape').catch((error: unknown) => {
              console.error('無法鎖定螢幕方向:', error);
            });
          }
        }
      };

      window.addEventListener('orientationchange', atOrientationChange);

      return () => {
        window.removeEventListener('orientationchange', atOrientationChange);
        if ('orientation' in screenAPI && 'unlock' in screenAPI.orientation) {
          screenAPI.orientation.unlock();
        }
      };
    } catch (error) {
      console.error('螢幕方向 API 不支援:', error);
      return undefined;
    }
  }, []);
};
