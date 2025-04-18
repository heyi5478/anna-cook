import type React from 'react';
import { useRef, useEffect, useState, useCallback } from 'react';
import Player, { type Options } from '@vimeo/player';

/**
 * Vimeo 播放器屬性介面
 */
export type VimeoPlayerProps = {
  videoId: number | string;
  width?: number;
  height?: number;
  startTime?: number;
  endTime?: number;
  muted?: boolean;
  loop?: boolean;
  responsive?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onLoaded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  isPlaying?: boolean;
};

/**
 * 通用 Vimeo 播放器組件，用於顯示 Vimeo 影片
 */
export const VimeoPlayer: React.FC<VimeoPlayerProps> = ({
  videoId,
  width = 640,
  height,
  startTime = 0,
  endTime,
  muted = true,
  loop = false,
  responsive = true,
  className = '',
  onTimeUpdate,
  onDurationChange,
  onLoaded,
  onPlay,
  onPause,
  onEnded,
  onError,
  isPlaying = false,
}) => {
  const playerContainer = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const isLoopingRef = useRef<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const lastVideoIdRef = useRef<string | number>(videoId);
  const initializedRef = useRef<boolean>(false);
  const shouldUpdateStartTimeRef = useRef<boolean>(true);
  const lastSetStartTimeRef = useRef<number>(startTime);

  console.log(
    `VimeoPlayer 渲染 - videoId: ${videoId}, isPlaying: ${isPlaying}, isPlayerReady: ${isPlayerReady}`,
  );

  useEffect(() => {
    if (startTime !== lastSetStartTimeRef.current) {
      console.log(`startTime 變更為 ${startTime}，標記需要更新時間點`);
      shouldUpdateStartTimeRef.current = true;
      lastSetStartTimeRef.current = startTime;
    }
  }, [startTime]);

  /**
   * 處理影片時間更新事件
   */
  const atTimeUpdate = useCallback(
    (data: { seconds: number }) => {
      console.log(`Vimeo 內部時間更新: ${data.seconds.toFixed(2)}秒`);

      if (onTimeUpdate) {
        onTimeUpdate(data.seconds);
      }

      // 時間範圍循環邏輯，如果設定了結束時間且已到達
      if (endTime && data.seconds >= endTime && !isLoopingRef.current && loop) {
        isLoopingRef.current = true;
        console.log(`達到結束時間 ${endTime}，重置到開始時間 ${startTime}`);
        playerRef.current
          ?.setCurrentTime(startTime)
          .then(() => {
            isLoopingRef.current = false;
          })
          .catch((error: unknown) => {
            console.error('循環播放段落失敗:', error);
            isLoopingRef.current = false;
            if (onError) {
              onError(error);
            }
          });
      }
    },
    [startTime, endTime, onTimeUpdate, loop, onError],
  );

  /**
   * 初始化 Vimeo 播放器並設置事件監聽
   */
  useEffect(() => {
    // 防止在已初始化的情況下重複創建播放器
    if (initializedRef.current && lastVideoIdRef.current === videoId) {
      console.log('播放器已初始化且 videoId 相同，跳過初始化');
      return undefined;
    }

    console.log(`初始化 Vimeo 播放器 - videoId: ${videoId}`);

    shouldUpdateStartTimeRef.current = true;

    // 如果已存在播放器，先清理
    if (playerRef.current) {
      console.log('清理現有播放器');
      try {
        const currentPlayer = playerRef.current;
        playerRef.current = null;
        setIsPlayerReady(false);

        currentPlayer.destroy().catch((error: unknown) => {
          console.error('播放器銷毀失敗:', error);
          if (onError) {
            onError(error);
          }
        });
      } catch (error) {
        console.error('播放器銷毀過程中發生錯誤:', error);
        if (onError) {
          onError(error);
        }
      }
    }

    let player: Player | undefined;

    if (playerContainer.current) {
      try {
        // 計算高度，如果沒有提供高度，則採用 16:9 比例
        const calculatedHeight =
          height || (width && (width * 9) / 16) || undefined;

        console.log(`創建播放器 - 尺寸: ${width}x${calculatedHeight}`);

        const options: Options = {
          url: `https://vimeo.com/${videoId}`,
          width,
          height: calculatedHeight,
          autoplay: false, // 明確設為 false，我們會通過 isPlaying 控制
          muted,
          responsive,
          playsinline: true,
          dnt: true, // 不追蹤
        };

        player = new Player(playerContainer.current, options);
        playerRef.current = player;

        console.log(`播放器實例已創建 - videoId: ${videoId}`);

        // 監聽播放器就緒事件
        player
          .ready()
          .then(() => {
            console.log('播放器準備就緒');
            setIsPlayerReady(true);
            initializedRef.current = true;
            lastVideoIdRef.current = videoId;

            // 設定初始時間點
            if (startTime > 0 && player) {
              console.log(`設置初始時間點: ${startTime}秒`);
              lastSetStartTimeRef.current = startTime;
              shouldUpdateStartTimeRef.current = false;
              return player.setCurrentTime(startTime);
            }
            return undefined;
          })
          .then(() => {
            // 獲取影片總長度
            if (player) {
              return player.getDuration();
            }
            return 0;
          })
          .then((duration: number) => {
            console.log(`獲取到影片總長度: ${duration}秒`);
            if (onDurationChange) {
              onDurationChange(duration);
            }
          })
          .catch((error: unknown) => {
            console.error('播放器初始化失敗:', error);
            if (onError) {
              onError(error);
            }
          });

        // 註冊其他事件監聽器
        player.on('loaded', () => {
          console.log('影片已載入');
          if (onLoaded) {
            onLoaded();
          }
        });

        player.on('play', () => {
          console.log('影片開始播放');
          if (onPlay) {
            onPlay();
          }
        });

        player.on('pause', () => {
          console.log('影片已暫停');
          if (onPause) {
            onPause();
          }
        });

        player.on('ended', () => {
          console.log('影片播放結束');
          if (onEnded) {
            onEnded();
          }
        });

        player.on('error', (error) => {
          console.error('播放器錯誤:', error);
          if (onError) {
            onError(error);
          }
        });
      } catch (error) {
        console.error('創建播放器失敗:', error);
        if (onError) {
          onError(error);
        }
      }
    }

    /**
     * 清理函式：銷毀播放器實例
     */
    return () => {
      // 只在組件卸載或 videoId 改變時銷毀播放器
      console.log('VimeoPlayer useEffect 清理函數執行');
      // 實際銷毀邏輯在下一次初始化時處理，或在組件卸載時
    };
  }, [
    videoId,
    width,
    height,
    muted,
    responsive,
    onDurationChange,
    onLoaded,
    onPlay,
    onPause,
    onEnded,
    onError,
    startTime,
  ]);

  /**
   * 設置影片播放時間範圍和時間更新事件
   */
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) {
      console.log('播放器未就緒，無法設置時間更新監聽器');
      return;
    }

    try {
      console.log('設置時間更新監聽器');
      // 移除之前的監聽器
      playerRef.current.off('timeupdate');

      // 添加新的監聽器
      playerRef.current.on('timeupdate', atTimeUpdate);

      // 設定影片從指定秒數開始播放，但只在需要時設置
      if (startTime > 0 && shouldUpdateStartTimeRef.current) {
        console.log(`設置開始時間: ${startTime}秒 (手動設置)`);
        shouldUpdateStartTimeRef.current = false;
        lastSetStartTimeRef.current = startTime;

        playerRef.current.setCurrentTime(startTime).catch((error: unknown) => {
          console.error('設定起始時間失敗:', error);
          if (onError) {
            onError(error);
          }
        });
      }
    } catch (error) {
      console.error('設置播放器時間或事件監聽失敗:', error);
      if (onError) {
        onError(error);
      }
    }
  }, [isPlayerReady, atTimeUpdate, onError]);

  /**
   * 控制影片播放或暫停
   */
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) {
      console.log('播放器未就緒，無法控制播放狀態');
      return;
    }

    try {
      if (isPlaying) {
        console.log('嘗試播放影片');
        playerRef.current.play().catch((error: unknown) => {
          console.error('播放失敗:', error);
          if (onError) {
            onError(error);
          }
        });
      } else {
        console.log('嘗試暫停影片');
        playerRef.current.pause().catch((error: unknown) => {
          console.error('暫停失敗:', error);
          if (onError) {
            onError(error);
          }
        });
      }
    } catch (error) {
      console.error('控制播放狀態失敗:', error);
      if (onError) {
        onError(error);
      }
    }
  }, [isPlaying, isPlayerReady, onError]);

  return <div ref={playerContainer} className={`w-full h-full ${className}`} />;
};

/**
 * 格式化時間為 mm:ss 格式
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 將時間字串轉換為秒數
 */
export const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    const minutes = Number.parseInt(parts[0], 10);
    const seconds = Number.parseInt(parts[1], 10);
    return minutes * 60 + seconds;
  }
  return 0;
};

/**
 * 格式化時間為 0.00 秒格式
 */
export const formatSeconds = (seconds: number): string => {
  return `${seconds.toFixed(2)} 秒`;
};
