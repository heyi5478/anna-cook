import { BrowserContext, Page } from '@playwright/test';

// 裝置能力配置介面
type DeviceCapabilitiesConfig = {
  screenSize: {
    width: number;
    height: number;
  };
  devicePixelRatio: number;
  isMobile: boolean;
  userAgent: string;
  permissions: string[];
  mediaDevices: boolean;
  networkCondition?: 'fast' | 'slow' | 'offline';
};

// 媒體裝置能力介面
type MediaDeviceCapabilities = {
  video: boolean;
  audio: boolean;
  microphone: boolean;
  camera: boolean;
  screen: boolean;
};

// 網路條件設定介面
type NetworkCondition = {
  name: string;
  downloadThroughput: number;
  uploadThroughput: number;
  latency: number;
};

// 瀏覽器功能支援介面
type BrowserFeatureSupport = {
  webRTC: boolean;
  mediaRecorder: boolean;
  getUserMedia: boolean;
  getDisplayMedia: boolean;
  webGL: boolean;
  webAssembly: boolean;
};

// 預設裝置配置
const DEFAULT_DEVICES: Record<string, DeviceCapabilitiesConfig> = {
  desktop: {
    screenSize: { width: 1920, height: 1080 },
    devicePixelRatio: 1,
    isMobile: false,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    permissions: ['camera', 'microphone', 'clipboard-read', 'clipboard-write'],
    mediaDevices: true,
  },
  mobile: {
    screenSize: { width: 375, height: 812 },
    devicePixelRatio: 3,
    isMobile: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    permissions: ['camera', 'microphone'],
    mediaDevices: true,
  },
  tablet: {
    screenSize: { width: 768, height: 1024 },
    devicePixelRatio: 2,
    isMobile: true,
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    permissions: ['camera', 'microphone'],
    mediaDevices: true,
  },
};

// 網路條件預設值
const NETWORK_CONDITIONS: Record<string, NetworkCondition> = {
  fast: {
    name: 'Fast 3G',
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  },
  slow: {
    name: 'Slow 3G',
    downloadThroughput: (500 * 1024) / 8,
    uploadThroughput: (500 * 1024) / 8,
    latency: 2000,
  },
  offline: {
    name: 'Offline',
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
};

/**
 * 設定裝置能力模擬
 */
async function setupDeviceCapabilities(
  context: BrowserContext,
  deviceType: string = 'desktop',
): Promise<void> {
  const config = DEFAULT_DEVICES[deviceType];
  if (!config) {
    throw new Error(`未知的裝置類型: ${deviceType}`);
  }

  // 設定螢幕大小 - 需要在每個頁面上設置
  context.on('page', async (page) => {
    await page.setViewportSize(config.screenSize);
  });

  await context.setExtraHTTPHeaders({
    'User-Agent': config.userAgent,
  });

  // 授予媒體權限
  await context.grantPermissions(config.permissions);
}

/**
 * 模擬媒體裝置能力
 */
async function setupMediaDeviceCapabilities(
  page: Page,
  capabilities: Partial<MediaDeviceCapabilities> = {},
): Promise<void> {
  const defaultCapabilities: MediaDeviceCapabilities = {
    video: true,
    audio: true,
    microphone: true,
    camera: true,
    screen: true,
    ...capabilities,
  };

  await page.addInitScript((caps) => {
    // 模擬 getUserMedia
    if (caps.microphone || caps.camera) {
      Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
        writable: true,
        value: async (constraints: MediaStreamConstraints) => {
          const stream = new MediaStream();

          if (constraints.video && caps.camera) {
            const videoTrack = new MediaStreamTrack();
            Object.defineProperty(videoTrack, 'kind', { value: 'video' });
            Object.defineProperty(videoTrack, 'label', {
              value: 'fake-camera',
            });
            stream.addTrack(videoTrack);
          }

          if (constraints.audio && caps.microphone) {
            const audioTrack = new MediaStreamTrack();
            Object.defineProperty(audioTrack, 'kind', { value: 'audio' });
            Object.defineProperty(audioTrack, 'label', {
              value: 'fake-microphone',
            });
            stream.addTrack(audioTrack);
          }

          return stream;
        },
      });
    }

    // 模擬 getDisplayMedia
    if (caps.screen) {
      Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', {
        writable: true,
        value: async () => {
          const stream = new MediaStream();
          const videoTrack = new MediaStreamTrack();
          Object.defineProperty(videoTrack, 'kind', { value: 'video' });
          Object.defineProperty(videoTrack, 'label', { value: 'fake-screen' });
          stream.addTrack(videoTrack);
          return stream;
        },
      });
    }

    // 模擬裝置列舉
    Object.defineProperty(navigator.mediaDevices, 'enumerateDevices', {
      writable: true,
      value: async () => {
        const devices: MediaDeviceInfo[] = [];

        if (caps.camera) {
          const cameraDevice = {
            deviceId: 'fake-camera-id',
            groupId: 'fake-group-1',
            kind: 'videoinput' as MediaDeviceKind,
            label: 'Fake Camera',
          };
          devices.push(cameraDevice as MediaDeviceInfo);
        }

        if (caps.microphone) {
          const micDevice = {
            deviceId: 'fake-mic-id',
            groupId: 'fake-group-2',
            kind: 'audioinput' as MediaDeviceKind,
            label: 'Fake Microphone',
          };
          devices.push(micDevice as MediaDeviceInfo);
        }

        return devices;
      },
    });
  }, defaultCapabilities);
}

/**
 * 設定網路條件
 */
async function setupNetworkCondition(
  context: BrowserContext,
  condition: string = 'fast',
): Promise<void> {
  const networkCondition = NETWORK_CONDITIONS[condition];
  if (!networkCondition) {
    throw new Error(`未知的網路條件: ${condition}`);
  }

  // 使用 CDP 設定網路節流
  const page = await context.newPage();
  const client = await page.context().newCDPSession(page);

  if (condition === 'offline') {
    await client.send('Network.emulateNetworkConditions', {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0,
    });
  } else {
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: networkCondition.latency,
      downloadThroughput: networkCondition.downloadThroughput,
      uploadThroughput: networkCondition.uploadThroughput,
    });
  }

  await page.close();
}

/**
 * 檢測瀏覽器功能支援
 */
async function detectBrowserFeatureSupport(
  page: Page,
): Promise<BrowserFeatureSupport> {
  return page.evaluate(() => {
    const support: BrowserFeatureSupport = {
      webRTC: !!(window as any).RTCPeerConnection,
      mediaRecorder: !!(window as any).MediaRecorder,
      getUserMedia: !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      ),
      getDisplayMedia: !!(
        navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
      ),
      webGL: (() => {
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
      webAssembly: !!(window as any).WebAssembly,
    };
    return support;
  });
}

/**
 * 重設裝置能力到預設狀態
 */
async function resetDeviceCapabilities(context: BrowserContext): Promise<void> {
  // 重設權限
  await context.clearPermissions();

  // 重設網路條件
  await setupNetworkCondition(context, 'fast');

  // 重設螢幕大小 - 需要在各頁面上設置
  const pages = context.pages();
  await Promise.all(
    pages.map((page) => page.setViewportSize({ width: 1280, height: 720 })),
  );
}

/**
 * 獲取裝置資訊
 */
async function getDeviceInfo(page: Page): Promise<Record<string, any>> {
  return page.evaluate(() => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      languages: navigator.languages,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      connection: (navigator as any).connection
        ? {
            effectiveType: (navigator as any).connection.effectiveType,
            downlink: (navigator as any).connection.downlink,
            rtt: (navigator as any).connection.rtt,
          }
        : null,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
    };
  });
}

export {
  setupDeviceCapabilities,
  setupMediaDeviceCapabilities,
  setupNetworkCondition,
  detectBrowserFeatureSupport,
  resetDeviceCapabilities,
  getDeviceInfo,
  DEFAULT_DEVICES,
  NETWORK_CONDITIONS,
  type DeviceCapabilitiesConfig,
  type MediaDeviceCapabilities,
  type NetworkCondition,
  type BrowserFeatureSupport,
};
