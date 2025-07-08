import type React from 'react';
import {
  VimeoPlayer,
  formatSeconds as formatSec,
} from '@/components/common/VimeoPlayer';
import { cn } from '@/lib/utils';
import {
  videoPlayerSectionVariants,
  videoContainerVariants,
  timeDisplayVariants,
} from './styles';

type VideoPlayerSectionProps = {
  actualVideoId: string | number;
  startTime?: number;
  endTime?: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  isPlaying: boolean;
  onLoaded: () => void;
  currentTime: number;
  videoDuration: number;
  loading?: boolean;
  error?: boolean;
};

/**
 * 影片播放器區域元件，負責顯示影片播放器和時間資訊
 */
export const VideoPlayerSection: React.FC<VideoPlayerSectionProps> = ({
  actualVideoId,
  startTime,
  endTime,
  onTimeUpdate,
  onDurationChange,
  isPlaying,
  onLoaded,
  currentTime,
  videoDuration,
  loading = false,
  error = false,
}) => {
  // 確定播放器狀態
  let playerState: 'loading' | 'error' | 'ready' = 'ready';
  if (loading) {
    playerState = 'loading';
  } else if (error) {
    playerState = 'error';
  }

  const sectionState = isPlaying ? 'playing' : 'paused';

  return (
    <div className={cn(videoPlayerSectionVariants({ state: sectionState }))}>
      {/* 影片預覽容器 */}
      <div className={cn(videoContainerVariants({ state: playerState }))}>
        {!loading && !error && (
          <VimeoPlayer
            videoId={actualVideoId}
            width={400}
            startTime={startTime}
            endTime={endTime}
            onTimeUpdate={onTimeUpdate}
            onDurationChange={onDurationChange}
            isPlaying={isPlaying}
            onLoaded={onLoaded}
            loop
          />
        )}
        {loading && <div className="text-gray-500">載入中...</div>}
        {error && <div className="text-red-500">影片載入失敗</div>}
      </div>

      {/* 當前時間和總長度顯示 */}
      <div className={cn(timeDisplayVariants({ style: 'default' }))}>
        <div>當前: {formatSec(currentTime)}</div>
        <div>總長: {formatSec(videoDuration)}</div>
      </div>
    </div>
  );
};
