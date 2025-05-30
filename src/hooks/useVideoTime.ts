import { useState, useCallback } from 'react';
import { formatTime as formatTimeHMS } from '@/components/common/VimeoPlayer';

/**
 * 處理影片時間相關的 Hook
 */
export function useVideoTime(initialDuration: number = 100) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(initialDuration);

  /**
   * 更新影片總時長
   */
  const updateDuration = useCallback((duration: number) => {
    setVideoDuration(duration || 100);
  }, []);

  /**
   * 更新當前影片播放時間
   */
  const updateCurrentTime = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return {
    currentTime,
    videoDuration,
    updateDuration,
    updateCurrentTime,
    formatTimeHMS,
  };
}
