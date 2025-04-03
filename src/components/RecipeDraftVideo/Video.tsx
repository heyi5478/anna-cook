import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import Player, { type Options } from '@vimeo/player';

type VimeoPlayerProps = {
  videoId: number | string;
  width?: number;
  startTime: number;
  endTime: number;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  isPlaying?: boolean;
};

/**
 * Vimeo 影片播放器組件
 */
export const Video: React.FC<VimeoPlayerProps> = ({
  videoId,
  width = 640, // 確保 width 有默認值
  startTime,
  endTime,
  onTimeUpdate,
  onDurationChange,
  isPlaying = false,
}) => {
  const playerContainer = useRef<HTMLDivElement>(null);
  // 使用 ref 避免重複重設播放位置
  const isLoopingRef = useRef<boolean>(false);
  const playerRef = useRef<Player | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  /**
   * 初始化 Vimeo 播放器並設置事件監聽
   */
  useEffect(() => {
    let player: Player | undefined;

    if (playerContainer.current && !playerRef.current) {
      try {
        const options: Options = {
          url: `https://vimeo.com/${videoId}`,
          width, // 使用傳入的 width
          autoplay: false,
          muted: true,
        };

        player = new Player(playerContainer.current, options);
        playerRef.current = player;

        // 監聽播放器就緒事件
        player
          .ready()
          .then(() => {
            setIsPlayerReady(true);

            // 獲取影片總長度
            return player?.getDuration() ?? 0;
          })
          .then((duration: number) => {
            if (onDurationChange) {
              onDurationChange(duration);
            }
          })
          .catch((error: unknown) => {
            console.error('播放器初始化失敗:', error);
          });
      } catch (error) {
        console.error('創建播放器失敗:', error);
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
          });
        } catch (error) {
          console.error('播放器銷毀過程中發生錯誤:', error);
        }
      }
    };
  }, [videoId, width, onDurationChange]);

  /**
   * 設置影片播放時間範圍和時間更新事件
   */
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;

    // 設定影片從指定秒數開始播放
    try {
      playerRef.current.setCurrentTime(startTime).catch((error: unknown) => {
        console.error('設定起始時間失敗:', error);
      });

      // 移除之前的監聽器
      playerRef.current.off('timeupdate');

      /**
       * 處理影片時間更新事件
       */
      const atTimeUpdate = (data: { seconds: number }) => {
        if (onTimeUpdate) {
          onTimeUpdate(data.seconds);
        }

        if (data.seconds >= endTime && !isLoopingRef.current) {
          isLoopingRef.current = true;
          playerRef.current
            ?.setCurrentTime(startTime)
            .then(() => {
              isLoopingRef.current = false;
            })
            .catch((error: unknown) => {
              console.error('循環播放段落失敗:', error);
              isLoopingRef.current = false;
            });
        }
      };

      // 添加新的監聽器
      playerRef.current.on('timeupdate', atTimeUpdate);
    } catch (error) {
      console.error('設置播放器時間或事件監聽失敗:', error);
    }
  }, [startTime, endTime, onTimeUpdate, isPlayerReady]);

  /**
   * 控制影片播放或暫停
   */
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;

    try {
      if (isPlaying) {
        playerRef.current.play().catch((error: unknown) => {
          console.error('播放失敗:', error);
        });
      } else {
        playerRef.current.pause().catch((error: unknown) => {
          console.error('暫停失敗:', error);
        });
      }
    } catch (error) {
      console.error('控制播放狀態失敗:', error);
    }
  }, [isPlaying, isPlayerReady]);

  return <div ref={playerContainer} className="w-full h-full" />;
};

type VideoModalProps = {
  videoId: number | string;
  startTime: number;
  endTime: number;
  onClose: () => void;
};

/**
 * 影片模態視窗組件
 */
export const VideoModal: React.FC<VideoModalProps> = ({
  videoId,
  startTime,
  endTime,
  onClose,
}) => {
  /**
   * 處理關閉按鈕點擊事件
   */
  const atClose = () => {
    onClose();
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 800 }}>
      <button
        onClick={atClose}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1001,
        }}
      >
        關閉
      </button>
      <Video
        videoId={videoId}
        width={800}
        startTime={startTime}
        endTime={endTime}
      />
    </div>
  );
};
