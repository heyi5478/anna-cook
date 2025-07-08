import type React from 'react';
import { Slider } from '@/components/ui/slider';
import {
  formatTime as formatTimeHMS,
  formatSeconds as formatSec,
} from '@/components/common/VimeoPlayer';
import { cn } from '@/lib/utils';
import {
  timelineVariants,
  timelineMarkerVariants,
  timelineControlVariants,
  sliderVariants,
  sliderThumbVariants,
  timeRangeDisplayVariants,
} from './styles';

type TimelineSliderProps = {
  startTime: number;
  endTime: number;
  videoDuration: number;
  isDragging: boolean;
  onTimeRangeChange: (values: number[]) => void;
  onSliderCommitted: (values: number[]) => void;
  disabled?: boolean;
};

/**
 * 時間軸滑桿元件，提供影片時間範圍選擇功能
 */
export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  startTime,
  endTime,
  videoDuration,
  isDragging,
  onTimeRangeChange,
  onSliderCommitted,
  disabled = false,
}) => {
  // 確定時間軸狀態
  let timelineState: 'normal' | 'dragging' | 'disabled' = 'normal';
  if (disabled) {
    timelineState = 'disabled';
  } else if (isDragging) {
    timelineState = 'dragging';
  }

  // 確定滑桿狀態
  let sliderState: 'normal' | 'dragging' | 'disabled' = 'normal';
  if (disabled) {
    sliderState = 'disabled';
  } else if (isDragging) {
    sliderState = 'dragging';
  }

  // 確定交互狀態
  let interactionState: 'grab' | 'grabbing' | 'disabled' = 'grab';
  if (disabled) {
    interactionState = 'disabled';
  } else if (isDragging) {
    interactionState = 'grabbing';
  }

  return (
    <>
      {/* 時間軸滑桿控制區域 */}
      <div className={cn(timelineVariants({ state: timelineState }))}>
        {/* 時間軸刻度標記 */}
        <div className={cn(timelineMarkerVariants())}>
          <span>0:00</span>
          <span>{formatTimeHMS(videoDuration)}</span>
        </div>

        {/* 時間軸控制器 */}
        <div
          className={cn(
            timelineControlVariants({ interaction: interactionState }),
          )}
        >
          <Slider
            defaultValue={[startTime, endTime]}
            value={[startTime, endTime]}
            max={videoDuration}
            min={0}
            step={0.1}
            onValueChange={onTimeRangeChange}
            onValueCommit={onSliderCommitted}
            className={cn(sliderVariants({ state: sliderState }))}
            thumbClassName={cn(sliderThumbVariants())}
            disabled={disabled}
          />
        </div>
      </div>

      {/* 起點和終點時間顯示 */}
      <div className={cn(timeRangeDisplayVariants({ style: 'default' }))}>
        <div>起點: {formatSec(startTime)}</div>
        <div>終點: {formatSec(endTime)}</div>
      </div>
    </>
  );
};
