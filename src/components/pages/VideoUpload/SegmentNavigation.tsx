import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Plus,
  Trash2,
} from 'lucide-react';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { cn } from '@/lib/utils';
import {
  segmentNavigationVariants,
  segmentNavigationControlsVariants,
  segmentNavigationButtonVariants,
  segmentIndicatorVariants,
  segmentDeleteButtonVariants,
} from './styles';

/**
 * 片段導航元件屬性
 */
type SegmentNavigationProps = {
  segments: {
    id: string;
    description: string;
  }[];
  currentSegmentIndex: number;
  isPlaying: boolean;
  atGoPreviousSegment: () => void;
  atGoNextSegment: () => void;
  atTogglePlayPause: () => void;
  atAddSegment: () => void;
  atDeleteCurrentSegment: () => void;
};

// 片段導航元件 - 處理片段間的切換和管理功能
export default function SegmentNavigation({
  segments,
  currentSegmentIndex,
  isPlaying,
  atGoPreviousSegment,
  atGoNextSegment,
  atTogglePlayPause,
  atAddSegment,
  atDeleteCurrentSegment,
}: SegmentNavigationProps) {
  // 獲取導航按鈕狀態
  const getPreviousButtonState = () => {
    return currentSegmentIndex === 0 ? 'disabled' : 'normal';
  };

  const getNextButtonState = () => {
    return currentSegmentIndex === segments.length - 1 ? 'disabled' : 'normal';
  };

  const getPlayButtonState = () => {
    return isPlaying ? 'active' : 'normal';
  };

  const getDeleteButtonState = () => {
    return segments.length <= 1 ? 'disabled' : 'normal';
  };

  return (
    <div className={segmentNavigationVariants()}>
      {/* 片段導航控制 */}
      <div className={segmentNavigationControlsVariants()}>
        <button
          onClick={atGoPreviousSegment}
          className={segmentNavigationButtonVariants({
            state: getPreviousButtonState(),
          })}
          disabled={currentSegmentIndex === 0}
          aria-label="上一個片段"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className={segmentIndicatorVariants()}>
          步驟 {currentSegmentIndex + 1}/{segments.length}
        </div>

        <button
          onClick={atGoNextSegment}
          className={segmentNavigationButtonVariants({
            state: getNextButtonState(),
          })}
          disabled={currentSegmentIndex === segments.length - 1}
          aria-label="下一個片段"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          onClick={atTogglePlayPause}
          className={segmentNavigationButtonVariants({
            state: getPlayButtonState(),
          })}
          aria-label={isPlaying ? '暫停播放' : '開始播放'}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>

        <button
          onClick={atAddSegment}
          className={segmentNavigationButtonVariants({ state: 'normal' })}
          aria-label="新增片段"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* 刪除步驟按鈕 */}
      <Button
        onClick={atDeleteCurrentSegment}
        variant="outline"
        disabled={segments.length <= 1}
        className={cn(
          segmentDeleteButtonVariants({
            state: getDeleteButtonState(),
          }),
          'outline-none border-none',
        )}
        aria-label="刪除當前片段"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {COMMON_TEXTS.DELETE}此步驟
      </Button>
    </div>
  );
}
