import {
  VimeoPlayer,
  formatSeconds as formatSec,
} from '@/components/common/VimeoPlayer';

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
};

/**
 * 影片播放器區域元件
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
}) => (
  <>
    {/* 影片預覽 */}
    <div className="bg-gray-100 aspect-video flex items-center justify-center my-2">
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
    </div>

    {/* 當前時間和總長度 */}
    <div className="flex justify-between px-4 py-2 text-sm">
      <div>當前: {formatSec(currentTime)}</div>
      <div>總長: {formatSec(videoDuration)}</div>
    </div>
  </>
);
