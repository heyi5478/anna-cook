// Playwright 瀏覽器匯入已移除，因為此檔案主要用於配置選項

/**
 * 瀏覽器媒體設定選項型別
 */
export type BrowserMediaSetupOptions = {
  enableVideo?: boolean;
  enableAudio?: boolean;
  enableCamera?: boolean;
  enableMicrophone?: boolean;
  fakeMediaStream?: boolean;
  permissions?: string[];
};

/**
 * 預設媒體設定
 */
const DEFAULT_MEDIA_SETUP: BrowserMediaSetupOptions = {
  enableVideo: true,
  enableAudio: true,
  enableCamera: false,
  enableMicrophone: false,
  fakeMediaStream: true,
  permissions: ['camera', 'microphone'],
};

/**
 * 設定瀏覽器媒體權限和功能
 */
export const setupBrowserMedia = async (
  browserName: 'chromium' | 'firefox' | 'webkit',
  options: BrowserMediaSetupOptions = {},
) => {
  const finalOptions = { ...DEFAULT_MEDIA_SETUP, ...options };

  // 基本瀏覽器啟動參數
  const baseArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
  ];

  // 媒體相關參數
  const mediaArgs = [];

  if (finalOptions.fakeMediaStream) {
    mediaArgs.push(
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--allow-running-insecure-content',
    );
  }

  if (finalOptions.enableCamera) {
    mediaArgs.push('--enable-usermedia-screen-capturing');
  }

  // 自動授予媒體權限
  if (finalOptions.permissions && finalOptions.permissions.length > 0) {
    mediaArgs.push('--autoplay-policy=no-user-gesture-required');
  }

  const launchOptions = {
    headless: false, // 媒體測試通常需要可見瀏覽器
    args: [...baseArgs, ...mediaArgs],
    ignoreDefaultArgs: ['--mute-audio'], // 允許音訊
  };

  // 根據瀏覽器類型調整設定
  switch (browserName) {
    case 'chromium':
      return {
        ...launchOptions,
        args: [
          ...launchOptions.args,
          '--disable-features=VizDisplayCompositor',
          '--enable-features=VaapiVideoDecoder',
        ],
      };

    case 'firefox':
      return {
        ...launchOptions,
        firefoxUserPrefs: {
          'media.navigator.streams.fake': finalOptions.fakeMediaStream,
          'media.autoplay.default': 0, // 允許自動播放
          'dom.disable_open_during_load': false,
        },
      };

    case 'webkit':
      return {
        ...launchOptions,
        args: [...launchOptions.args, '--enable-features=WebRTC'],
      };

    default:
      return launchOptions;
  }
};

/**
 * 在頁面中設定媒體權限
 */
export const grantMediaPermissions = async (
  page: any,
  permissions: string[] = ['camera', 'microphone'],
) => {
  // 授予權限
  const context = page.context();
  await context.grantPermissions(permissions);

  console.log(`已授予媒體權限: ${permissions.join(', ')}`);
};

/**
 * 模擬媒體設備
 */
export const setupFakeMediaDevices = async (page: any) => {
  await page.addInitScript(() => {
    // 模擬 getUserMedia
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: async (constraints: any) => {
          // 創建假的媒體串流
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // 繪製測試圖案
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(100, 100, 200, 200);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px Arial';
            ctx.fillText('Test Video', 200, 250);
          }

          const stream = canvas.captureStream(30);

          // 如果需要音訊，添加假的音訊軌道
          if (constraints.audio) {
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const destination = audioContext.createMediaStreamDestination();
            oscillator.connect(destination);
            oscillator.start();

            destination.stream.getAudioTracks().forEach((track) => {
              stream.addTrack(track);
            });
          }

          return stream;
        },

        enumerateDevices: async () => {
          return [
            {
              deviceId: 'fake-camera-1',
              kind: 'videoinput',
              label: 'Fake Camera 1',
              groupId: 'fake-group-1',
            },
            {
              deviceId: 'fake-mic-1',
              kind: 'audioinput',
              label: 'Fake Microphone 1',
              groupId: 'fake-group-1',
            },
          ];
        },
      },
    });

    // 模擬檔案讀取 API
    Object.defineProperty(window, 'FileReader', {
      writable: true,
      value: class MockFileReader {
        readAsDataURL(file: File) {
          setTimeout(() => {
            if (this.onload) {
              this.onload({
                target: {
                  result: `data:${file.type};base64,fake-file-content`,
                },
              } as any);
            }
          }, 100);
        }

        readAsArrayBuffer(file: File) {
          setTimeout(() => {
            if (this.onload) {
              this.onload({
                target: {
                  result: new ArrayBuffer(file.size),
                },
              } as any);
            }
          }, 100);
        }

        onload: ((event: any) => void) | null = null;

        onerror: ((event: any) => void) | null = null;
      },
    });
  });

  console.log('已設定假媒體設備');
};

/**
 * 檢查瀏覽器媒體支援
 */
export const checkMediaSupport = async (page: any) => {
  return page.evaluate(() => {
    return {
      hasMediaDevices: 'mediaDevices' in navigator,
      hasGetUserMedia:
        'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      hasFileAPI:
        'File' in window && 'FileReader' in window && 'FormData' in window,
      hasVideoElement: 'HTMLVideoElement' in window,
      hasAudioElement: 'HTMLAudioElement' in window,
      hasCanvas: 'HTMLCanvasElement' in window,
      hasWebRTC: 'RTCPeerConnection' in window,
      hasWebGL: (() => {
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
    };
  });
};

/**
 * 等待媒體元素準備就緒
 */
export const waitForMediaReady = async (
  page: any,
  selector: string,
  timeout: number = 10000,
) => {
  await page.waitForFunction(
    (sel: string) => {
      const element = document.querySelector(sel) as HTMLVideoElement;
      return element && element.readyState >= 2; // HAVE_CURRENT_DATA
    },
    selector,
    { timeout },
  );

  console.log(`媒體元素 ${selector} 已準備就緒`);
};

/**
 * 清理媒體資源
 */
export const cleanupMediaResources = async (page: any) => {
  await page.evaluate(() => {
    // 停止所有媒體串流
    document.querySelectorAll('video, audio').forEach((mediaElement: any) => {
      const element = mediaElement;
      if (element.srcObject) {
        const stream = element.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        element.srcObject = null;
      }
      element.pause();
      element.removeAttribute('src');
      element.load();
    });

    // 清理 Canvas
    document.querySelectorAll('canvas').forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  });

  console.log('已清理媒體資源');
};
