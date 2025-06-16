import { Slider } from '@/components/ui/slider';
import {
  formatTime as formatTimeHMS,
  formatSeconds as formatSec,
} from '@/components/common/VimeoPlayer';

type TimelineSliderProps = {
  startTime: number;
  endTime: number;
  videoDuration: number;
  isDragging: boolean;
  onTimeRangeChange: (values: number[]) => void;
  onSliderCommitted: (values: number[]) => void;
};

/**
 * 時間軸滑桿元件
 */
export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  startTime,
  endTime,
  videoDuration,
  isDragging,
  onTimeRangeChange,
  onSliderCommitted,
}) => (
  <>
    {/* 時間軸 */}
    <div className="px-4 py-2">
      <div className="flex justify-between text-xs text-neutral-500 mb-1">
        <span>0:00</span>
        <span>{formatTimeHMS(videoDuration)}</span>
      </div>
      <div className="py-6">
        <Slider
          defaultValue={[startTime, endTime]}
          value={[startTime, endTime]}
          max={videoDuration}
          min={0}
          step={0.1}
          onValueChange={onTimeRangeChange}
          onValueCommit={onSliderCommitted}
          className={`[&>span:first-child]:h-3 [&>span:first-child]:bg-neutral-200 [&>span:first-child]:rounded-md [&>span:nth-child(2)]:bg-neutral-400 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          thumbClassName="h-6 w-4 bg-white border-2 border-neutral-400 rounded-sm shadow-md hover:border-neutral-600 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 transition-colors"
          disabled={false}
        />
      </div>
    </div>

    {/* 起點和終點 */}
    <div className="flex justify-between px-4 py-2 text-sm">
      <div>起點: {formatSec(startTime)}</div>
      <div>終點: {formatSec(endTime)}</div>
    </div>
  </>
);
