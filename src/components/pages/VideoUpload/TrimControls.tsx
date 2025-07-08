import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import { VIDEO_SEGMENT_LIMITS, VIDEO_SEGMENT_STATUS } from '@/lib/constants';
import {
  trimControlVariants,
  timelineContainerVariants,
  timeMarkerVariants,
  thumbnailContainerVariants,
  thumbnailVariants,
  segmentMarkerVariants,
  segmentMarkerLabelVariants,
  maskVariants,
  playbackIndicatorVariants,
  playbackIndicatorMarkerVariants,
  sliderHandleVariants,
  sliderHandleMarkerVariants,
  timeRangeDisplayVariants,
  markButtonGroupVariants,
  markButtonVariants,
  statusIndicatorVariants,
  statusIndicatorContentVariants,
  statusLightVariants,
  statusTextVariants,
  resetButtonVariants,
} from './styles';

/**
 * 影片剪輯控制元件屬性
 */
type TrimControlsProps = {
  duration: number;
  currentTime: number;
  trimValues: [number, number];
  thumbnails: string[];
  atTrimChange: (values: number[]) => void;
  atMarkStartPoint: () => void;
  atMarkEndPoint: () => void;
  atResetCurrentSegment: () => void;
  segments: {
    id: string;
    startTime: number;
    endTime: number;
    startPercent: number;
    endPercent: number;
    description: string;
  }[];
  currentSegmentIndex: number;
};

// 影片剪輯控制元件 - 處理影片片段的時間軸及剪輯控制
export default function TrimControls({
  duration,
  currentTime,
  trimValues,
  thumbnails,
  atTrimChange,
  atMarkStartPoint,
  atMarkEndPoint,
  atResetCurrentSegment,
  segments,
  currentSegmentIndex,
}: TrimControlsProps) {
  // 獲取當前片段
  const currentSegment = segments[currentSegmentIndex] || {
    startTime: 0,
    endTime: 0,
    startPercent: 0,
    endPercent: 0,
    description: '',
  };

  // 獲取狀態指示器狀態
  const getStatusIndicatorState = () => {
    const segmentDuration = currentSegment.endTime - currentSegment.startTime;

    if (
      segmentDuration < VIDEO_SEGMENT_LIMITS.MIN_DURATION ||
      segmentDuration > VIDEO_SEGMENT_LIMITS.MAX_DURATION
    ) {
      return 'error';
    }
    if (
      (segmentDuration >= VIDEO_SEGMENT_LIMITS.MIN_DURATION &&
        segmentDuration < VIDEO_SEGMENT_LIMITS.IDEAL_MIN) ||
      (segmentDuration > VIDEO_SEGMENT_LIMITS.IDEAL_MAX &&
        segmentDuration <= VIDEO_SEGMENT_LIMITS.MAX_DURATION)
    ) {
      return 'warning';
    }
    return 'success';
  };

  // 獲取狀態文字
  const getStatusText = () => {
    const segmentDuration = currentSegment.endTime - currentSegment.startTime;

    if (
      segmentDuration < VIDEO_SEGMENT_LIMITS.MIN_DURATION ||
      segmentDuration > VIDEO_SEGMENT_LIMITS.MAX_DURATION
    ) {
      return segmentDuration < VIDEO_SEGMENT_LIMITS.MIN_DURATION
        ? VIDEO_SEGMENT_STATUS.TOO_SHORT
        : VIDEO_SEGMENT_STATUS.TOO_LONG;
    }
    if (
      (segmentDuration >= VIDEO_SEGMENT_LIMITS.MIN_DURATION &&
        segmentDuration < VIDEO_SEGMENT_LIMITS.IDEAL_MIN) ||
      (segmentDuration > VIDEO_SEGMENT_LIMITS.IDEAL_MAX &&
        segmentDuration <= VIDEO_SEGMENT_LIMITS.MAX_DURATION)
    ) {
      return segmentDuration < VIDEO_SEGMENT_LIMITS.IDEAL_MIN
        ? VIDEO_SEGMENT_STATUS.SLIGHTLY_SHORT
        : VIDEO_SEGMENT_STATUS.SLIGHTLY_LONG;
    }
    return VIDEO_SEGMENT_STATUS.IDEAL;
  };

  return (
    <div className={trimControlVariants()}>
      {/* 雙滑桿剪輯 (YouTube 風格) */}
      <div className={timelineContainerVariants()}>
        {/* 時間標記 */}
        <div className={timeMarkerVariants()}>
          <span>0:00</span>
          <span>
            {Math.floor(duration / 60)}:
            {Math.floor(duration % 60)
              .toString()
              .padStart(2, '0')}
          </span>
        </div>

        {/* 整合縮圖預覽和滑桿 */}
        <div className={thumbnailContainerVariants()}>
          {/* 縮圖容器 */}
          <div className={thumbnailVariants()}>
            {thumbnails.map((thumbnail, i) => {
              // 生成唯一且穩定的 key，使用縮圖資料的前10字元作為唯一標識
              const uniqueId = `${i}-${thumbnail.slice(-10)}`;
              return (
                <div
                  key={uniqueId}
                  className="h-full flex-grow"
                  style={{ width: `${100 / thumbnails.length}%` }}
                >
                  <img
                    src={thumbnail || '/placeholder.svg'}
                    alt={`影片縮圖 ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            })}
          </div>

          {/* 所有片段標記 */}
          {segments.map((segment, index) => (
            <div
              key={segment.id}
              className={segmentMarkerVariants({
                state: index === currentSegmentIndex ? 'current' : 'normal',
              })}
              style={{
                left: `${segment.startPercent}%`,
                width: `${segment.endPercent - segment.startPercent}%`,
              }}
            >
              <div className={segmentMarkerLabelVariants()}>{index + 1}</div>
            </div>
          ))}

          {/* 非選中區域遮罩 (左側) */}
          <div
            className={maskVariants({ side: 'left' })}
            style={{
              left: 0,
              width: `${trimValues[0]}%`,
            }}
          />

          {/* 非選中區域遮罩 (右側) */}
          <div
            className={maskVariants({ side: 'right' })}
            style={{
              right: 0,
              width: `${100 - trimValues[1]}%`,
            }}
          />

          {/* 當前播放位置指示器 */}
          <div
            className={playbackIndicatorVariants()}
            style={{
              left: `${(currentTime / duration) * 100}%`,
            }}
          >
            <div className={playbackIndicatorMarkerVariants()} />
          </div>

          {/* 自定義樣式的 Slider */}
          <Slider
            value={trimValues}
            min={0}
            max={100}
            step={0.1}
            onValueChange={atTrimChange}
            className="absolute inset-0 z-30 [&_[data-orientation=horizontal]]:bg-transparent [&_[role=slider]]:opacity-0 [&_[data-orientation=horizontal]>.range]:bg-transparent"
            thumbClassName="group h-full w-1 top-0 rounded-none -mt-0 bg-transparent"
          />

          {/* 左側把手 (與 Slider 的第一個滑塊對齊) */}
          <div
            className={sliderHandleVariants()}
            style={{ left: `${trimValues[0]}%` }}
          >
            <div className={sliderHandleMarkerVariants()}>
              <div className="h-4 w-0.5 bg-white" />
            </div>
          </div>

          {/* 右側把手 (與 Slider 的第二個滑塊對齊) */}
          <div
            className={sliderHandleVariants()}
            style={{ left: `${trimValues[1]}%` }}
          >
            <div className={sliderHandleMarkerVariants()}>
              <div className="h-4 w-0.5 bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 剪輯時間顯示 */}
      <div className={timeRangeDisplayVariants()}>
        <span>起點: {formatTime(currentSegment.startTime)} 秒</span>
        <span>終點: {formatTime(currentSegment.endTime)} 秒</span>
      </div>

      {/* 標記按鈕 */}
      <div className={markButtonGroupVariants()}>
        <Button
          onClick={atMarkStartPoint}
          variant="outline"
          className={markButtonVariants()}
        >
          標記起點
        </Button>
        <Button
          onClick={atMarkEndPoint}
          variant="outline"
          className={markButtonVariants()}
        >
          標記終點
        </Button>
      </div>

      {/* 狀態指示器 */}
      <div className={statusIndicatorVariants()}>
        <div className={statusIndicatorContentVariants()}>
          <div
            className={statusLightVariants({
              status: getStatusIndicatorState(),
            })}
          />
          <div className={statusTextVariants()}>
            <span>
              步驟時長:{' '}
              {(currentSegment.endTime - currentSegment.startTime).toFixed(2)}{' '}
              秒
            </span>
            <span className="ml-2 text-xs text-neutral-500">
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {/* 重置按鈕 */}
      <Button
        onClick={atResetCurrentSegment}
        variant="outline"
        className={resetButtonVariants()}
      >
        <span className="mr-2">↻</span>
        該步驟重置
      </Button>
    </div>
  );
}
