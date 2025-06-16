import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

/**
 * 片段說明輸入元件，處理說明文字的輸入和驗證
 */
type SegmentDescriptionProps = {
  segments: {
    id: string;
    description: string;
  }[];
  currentSegmentIndex: number;
  error?: string;
  atDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  validateForm: () => void;
};

export default function SegmentDescription({
  segments,
  currentSegmentIndex,
  error,
  atDescriptionChange,
  validateForm,
}: SegmentDescriptionProps) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-neutral-700 mb-2">
        說明文字 (步驟 {currentSegmentIndex + 1})
        <span className="ml-2 text-xs text-neutral-500">
          {segments[currentSegmentIndex]?.description?.trim().length || 0}
          /10 字元
        </span>
      </h3>
      <textarea
        value={segments[currentSegmentIndex]?.description || ''}
        onChange={atDescriptionChange}
        onBlur={() => validateForm()}
        className={cn(
          'w-full p-2 text-sm border rounded-md min-h-[80px] resize-none',
          error
            ? 'border-red-500 bg-red-50'
            : 'border-neutral-300 text-neutral-600',
        )}
        placeholder="請輸入此步驟的說明文字，至少需要10個字元..."
      />
      {error && (
        <div className="text-red-500 text-sm mt-1 flex items-center error-message">
          <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
}
