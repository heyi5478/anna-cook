import { VimeoPlayer } from '@/components/common/VimeoPlayer';
import { Play, Pause } from 'lucide-react';

type Step = {
  id: number;
  description: string;
  stepOrder: number;
  startTime: number;
  endTime: number;
};

type VideoPlayerProps = {
  videoId: string;
  isPlaying: boolean;
  currentStep: Step;
  showRightPanel: boolean;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onTogglePlay: () => void;
};

/**
 * 視頻播放器元件
 */
export const VideoPlayer = ({
  videoId,
  isPlaying,
  currentStep,
  showRightPanel,
  onTimeUpdate,
  onDurationChange,
  onTogglePlay,
}: VideoPlayerProps) => {
  return (
    <div className={`relative ${showRightPanel ? 'flex-1' : 'w-full'}`}>
      <VimeoPlayer
        videoId={videoId}
        responsive
        muted={false}
        loop
        isPlaying={isPlaying}
        startTime={currentStep.startTime}
        endTime={currentStep.endTime}
        onTimeUpdate={onTimeUpdate}
        onDurationChange={onDurationChange}
        className="w-full h-full"
      />

      {/* 播放控制覆蓋層 - 總是顯示，但圖標根據播放狀態變化 */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
        onClick={onTogglePlay}
      >
        {isPlaying ? (
          <Pause
            className="w-24 h-24 text-white opacity-80 hover:opacity-100 transition"
            strokeWidth={1}
          />
        ) : (
          <Play
            className="w-24 h-24 text-white opacity-80 hover:opacity-100 transition"
            fill="white"
            strokeWidth={1}
          />
        )}
      </div>
    </div>
  );
};
