import { Page, expect } from '@playwright/test';

/**
 * 影片播放狀態型別
 */
export type VideoPlaybackState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
};

/**
 * 影片播放控制選項型別
 */
export type VideoPlaybackOptions = {
  timeout?: number;
  volume?: number;
  playbackRate?: number;
  autoplay?: boolean;
};

/**
 * 影片時間軸位置型別
 */
export type VideoTimePosition = {
  seconds: number;
  percentage: number;
  formatted: string;
};

/**
 * 預設播放設定
 */
const DEFAULT_PLAYBACK_OPTIONS: VideoPlaybackOptions = {
  timeout: 30000,
  volume: 0.5,
  playbackRate: 1.0,
  autoplay: false,
};

/**
 * 取得影片播放器元素
 */
export const getVideoPlayer = async (page: Page): Promise<any> => {
  return page.locator('[data-testid="video-player"]');
};

/**
 * 取得影片播放按鈕
 */
export const getPlayButton = async (page: Page): Promise<any> => {
  return page.locator('[data-testid="play-button"]');
};

/**
 * 取得影片暫停按鈕
 */
export const getPauseButton = async (page: Page): Promise<any> => {
  return page.locator('[data-testid="pause-button"]');
};

/**
 * 等待影片載入完成
 */
export const waitForVideoLoaded = async (
  page: Page,
  options: VideoPlaybackOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_PLAYBACK_OPTIONS, ...options };

  // 等待影片元素出現
  const videoElement = await getVideoPlayer(page);
  await expect(videoElement).toBeVisible({ timeout: finalOptions.timeout });

  // 等待影片載入完成
  await page.waitForFunction(
    () => {
      const video = document.querySelector(
        '[data-testid="video-player"]',
      ) as HTMLVideoElement;
      return video && video.readyState >= 3; // HAVE_FUTURE_DATA
    },
    { timeout: finalOptions.timeout },
  );

  console.log('影片載入完成');
};

/**
 * 播放影片
 */
export const playVideo = async (
  page: Page,
  options: VideoPlaybackOptions = {},
): Promise<void> => {
  const finalOptions = { ...DEFAULT_PLAYBACK_OPTIONS, ...options };

  // 等待影片載入
  await waitForVideoLoaded(page, finalOptions);

  // 點擊播放按鈕
  const playButton = await getPlayButton(page);
  await expect(playButton).toBeVisible();
  await playButton.click();

  // 等待影片開始播放
  await page.waitForFunction(
    () => {
      const video = document.querySelector(
        '[data-testid="video-player"]',
      ) as HTMLVideoElement;
      return video && !video.paused;
    },
    { timeout: 5000 },
  );

  console.log('影片開始播放');
};

/**
 * 暫停影片
 */
export const pauseVideo = async (page: Page): Promise<void> => {
  // 點擊暫停按鈕
  const pauseButton = await getPauseButton(page);
  await expect(pauseButton).toBeVisible();
  await pauseButton.click();

  // 等待影片暫停
  await page.waitForFunction(
    () => {
      const video = document.querySelector(
        '[data-testid="video-player"]',
      ) as HTMLVideoElement;
      return video && video.paused;
    },
    { timeout: 3000 },
  );

  console.log('影片已暫停');
};

/**
 * 切換播放/暫停狀態
 */
export const togglePlayPause = async (page: Page): Promise<boolean> => {
  const currentState = await getVideoPlaybackState(page);

  if (currentState.isPlaying) {
    await pauseVideo(page);
    return false;
  }
  await playVideo(page);
  return true;
};

/**
 * 設定影片播放時間
 */
export const seekToTime = async (
  page: Page,
  seconds: number,
): Promise<void> => {
  await page.evaluate((time) => {
    const video = document.querySelector(
      '[data-testid="video-player"]',
    ) as HTMLVideoElement;
    if (video) {
      video.currentTime = time;
    }
  }, seconds);

  // 等待時間更新完成
  await page.waitForFunction(
    (targetTime) => {
      const video = document.querySelector(
        '[data-testid="video-player"]',
      ) as HTMLVideoElement;
      return video && Math.abs(video.currentTime - targetTime) < 0.5;
    },
    seconds,
    { timeout: 3000 },
  );

  console.log(`影片時間設定為 ${seconds} 秒`);
};

/**
 * 設定影片播放位置（百分比）
 */
export const seekToPercentage = async (
  page: Page,
  percentage: number,
): Promise<void> => {
  const duration = await getVideoDuration(page);
  const targetTime = (duration * percentage) / 100;
  await seekToTime(page, targetTime);
};

/**
 * 取得影片總時長
 */
export const getVideoDuration = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    const video = document.querySelector(
      '[data-testid="video-player"]',
    ) as HTMLVideoElement;
    return video ? video.duration : 0;
  });
};

/**
 * 取得影片當前播放時間
 */
export const getCurrentTime = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    const video = document.querySelector(
      '[data-testid="video-player"]',
    ) as HTMLVideoElement;
    return video ? video.currentTime : 0;
  });
};

/**
 * 取得影片播放狀態
 */
export const getVideoPlaybackState = async (
  page: Page,
): Promise<VideoPlaybackState> => {
  return page.evaluate(() => {
    const video = document.querySelector(
      '[data-testid="video-player"]',
    ) as HTMLVideoElement;

    if (!video) {
      throw new Error('找不到影片播放器元素');
    }

    return {
      isPlaying: !video.paused,
      currentTime: video.currentTime,
      duration: video.duration,
      volume: video.volume,
      muted: video.muted,
      playbackRate: video.playbackRate,
    };
  });
};

/**
 * 設定影片音量
 */
export const setVideoVolume = async (
  page: Page,
  volume: number,
): Promise<void> => {
  // 確保音量在有效範圍內
  const normalizedVolume = Math.max(0, Math.min(1, volume));

  await page.evaluate((vol) => {
    const video = document.querySelector(
      '[data-testid="video-player"]',
    ) as HTMLVideoElement;
    if (video) {
      video.volume = vol;
    }
  }, normalizedVolume);

  console.log(`影片音量設定為 ${normalizedVolume}`);
};

/**
 * 設定影片播放速度
 */
export const setPlaybackRate = async (
  page: Page,
  rate: number,
): Promise<void> => {
  await page.evaluate((playbackRate) => {
    const video = document.querySelector(
      '[data-testid="video-player"]',
    ) as HTMLVideoElement;
    if (video) {
      video.playbackRate = playbackRate;
    }
  }, rate);

  console.log(`影片播放速度設定為 ${rate}x`);
};

/**
 * 切換靜音狀態
 */
export const toggleMute = async (page: Page): Promise<boolean> => {
  const newMuteState = await page.evaluate(() => {
    const video = document.querySelector(
      '[data-testid="video-player"]',
    ) as HTMLVideoElement;
    if (video) {
      video.muted = !video.muted;
      return video.muted;
    }
    return false;
  });

  console.log(`影片靜音狀態: ${newMuteState ? '開啟' : '關閉'}`);
  return newMuteState;
};

/**
 * 等待影片播放到指定時間
 */
export const waitForTimeReached = async (
  page: Page,
  targetTime: number,
  tolerance: number = 0.5,
): Promise<void> => {
  await page.waitForFunction(
    ({ target, tol }) => {
      const video = document.querySelector(
        '[data-testid="video-player"]',
      ) as HTMLVideoElement;
      return video && Math.abs(video.currentTime - target) <= tol;
    },
    { target: targetTime, tol: tolerance },
    { timeout: 30000 },
  );

  console.log(`影片播放到達 ${targetTime} 秒`);
};

/**
 * 驗證影片播放狀態
 */
export const verifyVideoState = async (
  page: Page,
  expectedState: Partial<VideoPlaybackState>,
): Promise<void> => {
  const currentState = await getVideoPlaybackState(page);

  if (expectedState.isPlaying !== undefined) {
    expect(currentState.isPlaying).toBe(expectedState.isPlaying);
  }

  if (expectedState.currentTime !== undefined) {
    expect(
      Math.abs(currentState.currentTime - expectedState.currentTime),
    ).toBeLessThan(1);
  }

  if (expectedState.volume !== undefined) {
    expect(Math.abs(currentState.volume - expectedState.volume)).toBeLessThan(
      0.1,
    );
  }

  if (expectedState.muted !== undefined) {
    expect(currentState.muted).toBe(expectedState.muted);
  }

  if (expectedState.playbackRate !== undefined) {
    expect(currentState.playbackRate).toBe(expectedState.playbackRate);
  }

  console.log('影片狀態驗證通過');
};

/**
 * 格式化時間顯示
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * 取得影片時間位置資訊
 */
export const getVideoTimePosition = async (
  page: Page,
): Promise<VideoTimePosition> => {
  const currentTime = await getCurrentTime(page);
  const duration = await getVideoDuration(page);
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    seconds: currentTime,
    percentage,
    formatted: formatTime(currentTime),
  };
};

/**
 * 驗證影片播放進度
 */
export const verifyPlaybackProgress = async (
  page: Page,
  expectedProgress: number,
  tolerance: number = 5,
): Promise<void> => {
  const position = await getVideoTimePosition(page);
  const actualProgress = position.percentage;

  expect(Math.abs(actualProgress - expectedProgress)).toBeLessThanOrEqual(
    tolerance,
  );
  console.log(`影片播放進度驗證通過: ${actualProgress.toFixed(1)}%`);
};
