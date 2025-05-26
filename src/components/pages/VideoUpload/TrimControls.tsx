import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn, formatTime } from '@/lib/utils';

/**
 * 影片剪輯控制元件，處理影片片段的時間軸及剪輯控制
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

  return (
    <div className="space-y-4">
      {/* 雙滑桿剪輯 (YouTube 風格) */}
      <div className="space-y-2 mt-6">
        {/* 時間標記 */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>0:00</span>
          <span>
            {Math.floor(duration / 60)}:
            {Math.floor(duration % 60)
              .toString()
              .padStart(2, '0')}
          </span>
        </div>

        {/* 整合縮圖預覽和滑桿 */}
        <div className="relative h-16">
          {/* 縮圖容器 */}
          <div className="absolute inset-0 flex rounded overflow-hidden">
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
              className={cn(
                'absolute top-0 bottom-0 border-2 pointer-events-none z-10',
                index === currentSegmentIndex
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-blue-300 bg-blue-300/10',
              )}
              style={{
                left: `${segment.startPercent}%`,
                width: `${segment.endPercent - segment.startPercent}%`,
              }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium px-1 py-0.5 rounded bg-blue-600 text-white">
                {index + 1}
              </div>
            </div>
          ))}

          {/* 非選中區域遮罩 (左側) */}
          <div
            className="absolute top-0 bottom-0 bg-black/50 pointer-events-none z-10 rounded-l"
            style={{
              left: 0,
              width: `${trimValues[0]}%`,
            }}
          />

          {/* 非選中區域遮罩 (右側) */}
          <div
            className="absolute top-0 bottom-0 bg-black/50 pointer-events-none z-10 rounded-r"
            style={{
              right: 0,
              width: `${100 - trimValues[1]}%`,
            }}
          />

          {/* 當前播放位置指示器 */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
            style={{
              left: `${(currentTime / duration) * 100}%`,
            }}
          >
            <div className="absolute -top-1 -ml-1.5 w-3 h-3 bg-red-500 rounded-full" />
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
            className="absolute top-0 bottom-0 w-1 bg-blue-500 z-40 pointer-events-none"
            style={{ left: `${trimValues[0]}%` }}
          >
            <div className="absolute h-6 w-6 bg-blue-500 rounded-full -ml-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="h-4 w-0.5 bg-white" />
            </div>
          </div>

          {/* 右側把手 (與 Slider 的第二個滑塊對齊) */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-blue-500 z-40 pointer-events-none"
            style={{ left: `${trimValues[1]}%` }}
          >
            <div className="absolute h-6 w-6 bg-blue-500 rounded-full -ml-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="h-4 w-0.5 bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 剪輯時間顯示 */}
      <div className="flex justify-between text-sm">
        <span>起點: {formatTime(currentSegment.startTime)} 秒</span>
        <span>終點: {formatTime(currentSegment.endTime)} 秒</span>
      </div>

      {/* 標記按鈕 */}
      <div className="flex justify-between gap-4 mt-4">
        <Button onClick={atMarkStartPoint} variant="outline" className="flex-1">
          標記起點
        </Button>
        <Button onClick={atMarkEndPoint} variant="outline" className="flex-1">
          標記終點
        </Button>
      </div>

      {/* 紅綠燈警示 */}
      <div className="mt-3 mb-1">
        {(() => {
          const segmentDuration =
            currentSegment.endTime - currentSegment.startTime;
          let statusColor = '';
          let statusText = '';

          if (segmentDuration < 5 || segmentDuration > 30) {
            statusColor = 'bg-red-500';
            statusText =
              segmentDuration < 5
                ? '時間太短 (建議至少5秒)'
                : '時間太長 (建議不超過30秒)';
          } else if (
            (segmentDuration >= 5 && segmentDuration < 10) ||
            (segmentDuration > 25 && segmentDuration <= 30)
          ) {
            statusColor = 'bg-yellow-500';
            statusText =
              segmentDuration < 10
                ? '時間略短 (適中為10-25秒)'
                : '時間略長 (適中為10-25秒)';
          } else {
            statusColor = 'bg-green-500';
            statusText = '時間長度適中';
          }

          return (
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${statusColor} mr-2`} />
              <div className="text-sm text-gray-700">
                <span>步驟時長: {segmentDuration.toFixed(2)} 秒</span>
                <span className="ml-2 text-xs text-gray-500">{statusText}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 重置按鈕 */}
      <Button
        onClick={atResetCurrentSegment}
        variant="outline"
        className="w-full flex items-center justify-center"
      >
        <span className="mr-2">↻</span>
        該步驟重置
      </Button>
    </div>
  );
}
