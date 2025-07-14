import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { formatTime, cn } from '@/lib/utils';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import {
  videoPlayerVariants,
  videoPlayerContainerVariants,
  playControlButtonVariants,
  timeDisplayVariants,
} from '@/styles/cva/video-upload';

/**
 * 影片播放器元件屬性
 */
type VideoPlayerProps = {
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  atTogglePlayPause: () => void;
  atTimeUpdate: () => void;
  atVideoLoaded: () => void;
};

// 影片播放器元件 - 處理影片的顯示、播放與暫停控制
export default function VideoPlayer({
  videoUrl,
  isPlaying,
  currentTime,
  duration,
  videoRef,
  atTogglePlayPause,
  atTimeUpdate,
  atVideoLoaded,
}: VideoPlayerProps) {
  // 獲取播放器狀態
  const getPlayerState = () => {
    if (!videoUrl) return 'loading';
    if (isPlaying) return 'playing';
    return 'paused';
  };

  // 獲取容器狀態
  const getContainerState = () => {
    if (!videoUrl) return 'loading';
    if (duration === 0) return 'loading';
    return 'ready';
  };

  return (
    <div className={videoPlayerVariants({ state: getPlayerState() })}>
      {/* 影片預覽 */}
      <div
        className={videoPlayerContainerVariants({ state: getContainerState() })}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onLoadedMetadata={atVideoLoaded}
            onTimeUpdate={atTimeUpdate}
            onClick={atTogglePlayPause}
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
          >
            <track kind="captions" label="中文" default />
            您的瀏覽器不支援影片標籤
          </video>
        ) : (
          <div className="flex items-center justify-center h-full">
            影片{COMMON_TEXTS.LOADING}
          </div>
        )}

        {/* 播放/暫停按鈕覆蓋層 */}
        {videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                playControlButtonVariants({
                  size: 'default',
                  state: 'normal',
                }),
                'h-16 w-16',
              )}
              onClick={atTogglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* 時間顯示 */}
      <div className={timeDisplayVariants({ style: 'default' })}>
        <div>當前: {formatTime(currentTime)} 秒</div>
        <div>總長: {formatTime(duration)} 秒</div>
      </div>
    </div>
  );
}
