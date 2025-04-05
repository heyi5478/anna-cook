import type React from 'react';
import { useRef, useEffect, useState } from 'react';
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
  autoplay?: boolean;
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
  autoplay = false,
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

  /**
   * 初始化 Vimeo 播放器並設置事件監聽
   */
  useEffect(() => {
    let player: Player | undefined;

    if (playerContainer.current && !playerRef.current) {
      try {
        // 計算高度，如果沒有提供高度，則採用 16:9 比例
        const calculatedHeight =
          height || (width && (width * 9) / 16) || undefined;

        const options: Options = {
          url: `https://vimeo.com/${videoId}`,
          width,
          height: calculatedHeight,
          autoplay,
          muted,
          responsive,
        };

        player = new Player(playerContainer.current, options);
        playerRef.current = player;

        // 監聽播放器就緒事件
        player
          .ready()
          .then(() => {
            setIsPlayerReady(true);

            // 設定初始時間點
            if (startTime > 0 && player) {
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
          if (onLoaded) {
            onLoaded();
          }
        });

        player.on('play', () => {
          if (onPlay) {
            onPlay();
          }
        });

        player.on('pause', () => {
          if (onPause) {
            onPause();
          }
        });

        player.on('ended', () => {
          if (onEnded) {
            onEnded();
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
      // 只在組件卸載時銷毀播放器
      if (playerRef.current) {
        const currentPlayer = playerRef.current;
        playerRef.current = null;

        // 使用 try-catch 避免銷毀時的錯誤
        try {
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
    };
  }, [
    videoId,
    width,
    height,
    autoplay,
    muted,
    responsive,
    onDurationChange,
    onLoaded,
    onError,
    startTime,
  ]);

  /**
   * 設置影片播放時間範圍和時間更新事件
   */
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;

    try {
      // 設定影片從指定秒數開始播放
      if (startTime > 0) {
        playerRef.current.setCurrentTime(startTime).catch((error: unknown) => {
          console.error('設定起始時間失敗:', error);
          if (onError) {
            onError(error);
          }
        });
      }

      // 移除之前的監聽器
      playerRef.current.off('timeupdate');

      /**
       * 處理影片時間更新事件
       */
      const atTimeUpdate = (data: { seconds: number }) => {
        if (onTimeUpdate) {
          onTimeUpdate(data.seconds);
        }

        // 時間範圍循環邏輯，如果設定了結束時間且已到達
        if (
          endTime &&
          data.seconds >= endTime &&
          !isLoopingRef.current &&
          loop
        ) {
          isLoopingRef.current = true;
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
      };

      // 添加新的監聽器
      playerRef.current.on('timeupdate', atTimeUpdate);
    } catch (error) {
      console.error('設置播放器時間或事件監聽失敗:', error);
      if (onError) {
        onError(error);
      }
    }
  }, [startTime, endTime, onTimeUpdate, isPlayerReady, loop, onError]);

  /**
   * 控制影片播放或暫停
   */
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;

    try {
      if (isPlaying) {
        playerRef.current.play().catch((error: unknown) => {
          console.error('播放失敗:', error);
          if (onError) {
            onError(error);
          }
        });
      } else {
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

export default VimeoPlayer;
