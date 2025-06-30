import { Page } from '@playwright/test';

/**
 * 裝置類型定義
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * 瀏覽器類型定義
 */
export type BrowserType =
  | 'chromium'
  | 'firefox'
  | 'webkit'
  | 'chrome'
  | 'edge'
  | 'safari';

/**
 * 裝置能力資訊型別
 */
export type DeviceCapabilities = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  touchSupport: boolean;
  browserType: BrowserType;
  userAgent: string;
  supportsVideo: boolean;
  supportsH264: boolean;
  supportsWebM: boolean;
  supportsMP4: boolean;
  maxVideoSize?: number;
};

/**
 * 媒體格式支援資訊型別
 */
export type MediaFormatSupport = {
  video: {
    mp4: boolean;
    webm: boolean;
    ogg: boolean;
    h264: boolean;
    vp8: boolean;
    vp9: boolean;
    av1: boolean;
  };
  audio: {
    mp3: boolean;
    aac: boolean;
    ogg: boolean;
    wav: boolean;
  };
};

// 行動裝置斷點常數 - 由於目前使用動態檢測，暫時註釋
// const MOBILE_BREAKPOINTS = {
//   mobile: { maxWidth: 768 },
//   tablet: { minWidth: 768, maxWidth: 1024 },
//   desktop: { minWidth: 1024 },
// };

/**
 * 檢測是否為行動裝置
 */
export const isMobileDevice = async (page: Page): Promise<boolean> => {
  return page.evaluate(() => {
    // 檢查視窗寬度
    const width = window.innerWidth;
    if (width <= 768) return true;

    // 檢查 User Agent
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      'mobile',
      'android',
      'iphone',
      'ipad',
      'ipod',
      'blackberry',
      'windows phone',
    ];

    return mobileKeywords.some((keyword) => userAgent.includes(keyword));
  });
};

/**
 * 檢測是否為平板裝置
 */
export const isTabletDevice = async (page: Page): Promise<boolean> => {
  return page.evaluate(() => {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();

    // 檢查視窗寬度範圍
    if (width >= 768 && width <= 1024) {
      return true;
    }

    // 檢查特定平板關鍵字
    const tabletKeywords = ['ipad', 'tablet', 'kindle'];
    return tabletKeywords.some((keyword) => userAgent.includes(keyword));
  });
};

/**
 * 檢測是否為桌面裝置
 */
export const isDesktopDevice = async (page: Page): Promise<boolean> => {
  const mobile = await isMobileDevice(page);
  const tablet = await isTabletDevice(page);
  return !mobile && !tablet;
};

/**
 * 取得裝置類型
 */
export const getDeviceType = async (page: Page): Promise<DeviceType> => {
  if (await isMobileDevice(page)) return 'mobile';
  if (await isTabletDevice(page)) return 'tablet';
  return 'desktop';
};

/**
 * 檢測觸控支援
 */
export const hasTouchSupport = async (page: Page): Promise<boolean> => {
  return page.evaluate(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });
};

/**
 * 取得螢幕資訊
 */
export const getScreenInfo = async (page: Page) => {
  return page.evaluate(() => {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: window.screen.orientation?.angle || 0,
    };
  });
};

/**
 * 取得視窗大小資訊
 */
export const getViewportInfo = async (page: Page) => {
  return page.evaluate(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    };
  });
};

/**
 * 檢測瀏覽器類型
 */
export const getBrowserType = async (page: Page): Promise<BrowserType> => {
  return page.evaluate(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('safari') && !userAgent.includes('chrome'))
      return 'safari';
    if (userAgent.includes('edge')) return 'edge';
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('webkit')) return 'webkit';

    return 'chromium';
  }) as Promise<BrowserType>;
};

/**
 * 檢測媒體格式支援
 */
export const getMediaFormatSupport = async (
  page: Page,
): Promise<MediaFormatSupport> => {
  return page.evaluate(() => {
    const video = document.createElement('video');
    const audio = document.createElement('audio');

    return {
      video: {
        mp4: video.canPlayType('video/mp4') !== '',
        webm: video.canPlayType('video/webm') !== '',
        ogg: video.canPlayType('video/ogg') !== '',
        h264: video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '',
        vp8: video.canPlayType('video/webm; codecs="vp8"') !== '',
        vp9: video.canPlayType('video/webm; codecs="vp9"') !== '',
        av1: video.canPlayType('video/mp4; codecs="av01.0.08M.08"') !== '',
      },
      audio: {
        mp3: audio.canPlayType('audio/mpeg') !== '',
        aac: audio.canPlayType('audio/aac') !== '',
        ogg: audio.canPlayType('audio/ogg') !== '',
        wav: audio.canPlayType('audio/wav') !== '',
      },
    };
  });
};

/**
 * 檢測影片播放能力
 */
export const getVideoCapabilities = async (page: Page) => {
  return page.evaluate(() => {
    const video = document.createElement('video');

    return {
      supportsAutoplay: 'autoplay' in video,
      supportsFullscreen: 'requestFullscreen' in video,
      supportsPictureInPicture: 'requestPictureInPicture' in video,
      supportsPlaybackRate: 'playbackRate' in video,
      supportsVolume: 'volume' in video,
      supportsMuted: 'muted' in video,
      supportsControls: 'controls' in video,
      supportsPreload: 'preload' in video,
    };
  });
};

/**
 * 取得完整的裝置能力資訊
 */
export const getDeviceCapabilities = async (
  page: Page,
): Promise<DeviceCapabilities> => {
  const [
    deviceType,
    screenInfo,
    browserType,
    touchSupport,
    mediaSupport,
    userAgent,
  ] = await Promise.all([
    getDeviceType(page),
    getScreenInfo(page),
    getBrowserType(page),
    hasTouchSupport(page),
    getMediaFormatSupport(page),
    page.evaluate(() => navigator.userAgent),
  ]);

  return {
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    screenWidth: screenInfo.width,
    screenHeight: screenInfo.height,
    pixelRatio: screenInfo.pixelRatio,
    touchSupport,
    browserType,
    userAgent,
    supportsVideo: mediaSupport.video.mp4 || mediaSupport.video.webm,
    supportsH264: mediaSupport.video.h264,
    supportsWebM: mediaSupport.video.webm,
    supportsMP4: mediaSupport.video.mp4,
  };
};

/**
 * 檢查是否為低效能裝置
 */
export const isLowPerformanceDevice = async (page: Page): Promise<boolean> => {
  return page.evaluate(() => {
    // 檢查記憶體資訊（如果可用）
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) return true;

    // 檢查 CPU 核心數（如果可用）
    const cores = navigator.hardwareConcurrency;
    if (cores && cores < 4) return true;

    // 檢查連線品質（如果可用）
    const { connection } = navigator as any;
    if (
      connection &&
      connection.effectiveType &&
      ['slow-2g', '2g', '3g'].includes(connection.effectiveType)
    ) {
      return true;
    }

    return false;
  });
};

/**
 * 檢測網路連線狀態
 */
export const getNetworkInfo = async (page: Page) => {
  return page.evaluate(() => {
    const { connection } = navigator as any;

    if (connection) {
      return {
        online: navigator.onLine,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }

    return {
      online: navigator.onLine,
      effectiveType: 'unknown',
      downlink: undefined,
      rtt: undefined,
      saveData: false,
    };
  });
};

/**
 * 適應行動裝置設定
 */
export const adaptForMobileDevice = async (page: Page): Promise<void> => {
  const isMobile = await isMobileDevice(page);

  if (isMobile) {
    // 調整視窗大小為行動裝置
    await page.setViewportSize({ width: 375, height: 667 });

    // 模擬觸控事件
    await page.evaluate(() => {
      // 添加觸控事件支援
      document.addEventListener('touchstart', () => {}, { passive: true });
      document.addEventListener('touchmove', () => {}, { passive: true });
      document.addEventListener('touchend', () => {}, { passive: true });
    });

    console.log('已適應行動裝置設定');
  }
};

/**
 * 檢測影片上傳限制
 */
export const getVideoUploadLimits = async (page: Page) => {
  const capabilities = await getDeviceCapabilities(page);
  const isLowPerf = await isLowPerformanceDevice(page);

  // 根據裝置類型設定限制
  let maxFileSize = 100 * 1024 * 1024; // 100MB 預設
  let maxDuration = 600; // 10分鐘預設

  if (capabilities.isMobile || isLowPerf) {
    maxFileSize = 50 * 1024 * 1024; // 50MB
    maxDuration = 300; // 5分鐘
  }

  return {
    maxFileSize,
    maxDuration,
    recommendedFormats: capabilities.supportsMP4 ? ['mp4'] : ['webm'],
    supportsHardwareAcceleration: capabilities.supportsH264,
  };
};

/**
 * 檢測瀏覽器功能支援
 */
export const checkBrowserFeatureSupport = async (page: Page) => {
  return page.evaluate(() => {
    return {
      // File API 支援
      fileAPI:
        'File' in window && 'FileReader' in window && 'FormData' in window,

      // 拖放支援
      dragAndDrop: 'draggable' in document.createElement('div'),

      // Web Workers 支援
      webWorkers: 'Worker' in window,

      // Local Storage 支援
      localStorage: 'localStorage' in window,

      // Session Storage 支援
      sessionStorage: 'sessionStorage' in window,

      // Canvas 支援
      canvas: 'getContext' in document.createElement('canvas'),

      // WebGL 支援
      webgl: (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')
          );
        } catch {
          return false;
        }
      })(),

      // IndexedDB 支援
      indexedDB: 'indexedDB' in window,

      // Geolocation 支援
      geolocation: 'geolocation' in navigator,

      // Notification 支援
      notifications: 'Notification' in window,
    };
  });
};
