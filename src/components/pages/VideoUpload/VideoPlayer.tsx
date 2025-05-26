import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { formatTime } from '@/lib/utils';

/**
 * 影片播放器元件，處理影片的顯示、播放與暫停控制
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
  return (
    <div className="space-y-4">
      {/* 影片預覽 */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
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
            影片載入中...
          </div>
        )}

        {/* 播放/暫停按鈕覆蓋層 */}
        {videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-black/30 text-white hover:bg-black/50"
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
      <div className="flex justify-between px-4 py-2 text-sm">
        <div>當前: {formatTime(currentTime)} 秒</div>
        <div>總長: {formatTime(duration)} 秒</div>
      </div>
    </div>
  );
}
