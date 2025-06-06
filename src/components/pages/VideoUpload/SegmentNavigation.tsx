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

/**
 * 片段導航元件，處理片段間的切換和管理
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
  return (
    <div className="space-y-4">
      {/* 片段導航 */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={atGoPreviousSegment}
          className="p-2 text-gray-600"
          disabled={currentSegmentIndex === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-sm">
          步驟 {currentSegmentIndex + 1}/{segments.length}
        </div>
        <button
          onClick={atGoNextSegment}
          className="p-2 text-gray-600"
          disabled={currentSegmentIndex === segments.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button onClick={atTogglePlayPause} className="p-2 text-gray-600">
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
        <button onClick={atAddSegment} className="p-2 text-gray-600">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* 刪除步驟按鈕 */}
      <Button
        onClick={atDeleteCurrentSegment}
        variant="outline"
        disabled={segments.length <= 1}
        className="w-full bg-gray-200 text-gray-700 rounded-md py-2 flex items-center justify-center"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {COMMON_TEXTS.DELETE}此步驟
      </Button>
    </div>
  );
}
