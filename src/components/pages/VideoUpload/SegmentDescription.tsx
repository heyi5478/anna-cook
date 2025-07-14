import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  descriptionFieldVariants,
  descriptionFieldTitleVariants,
  characterCounterVariants,
  descriptionTextareaVariants,
  errorMessageVariants,
} from '@/styles/cva/video-upload';

/**
 * 片段說明輸入元件屬性
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

// 片段說明輸入元件 - 處理說明文字的輸入和驗證
export default function SegmentDescription({
  segments,
  currentSegmentIndex,
  error,
  atDescriptionChange,
  validateForm,
}: SegmentDescriptionProps) {
  // 獲取當前描述
  const currentDescription = segments[currentSegmentIndex]?.description || '';
  const currentLength = currentDescription.trim().length;

  // 獲取文字區域狀態
  const getTextareaState = () => {
    if (error) return 'error';
    if (currentLength >= 10) return 'valid';
    return 'normal';
  };

  return (
    <div className={descriptionFieldVariants()}>
      <h3 className={descriptionFieldTitleVariants()}>
        說明文字 (步驟 {currentSegmentIndex + 1})
        <span className={characterCounterVariants()}>
          {currentLength}/10 字元
        </span>
      </h3>
      <textarea
        value={currentDescription}
        onChange={atDescriptionChange}
        onBlur={() => validateForm()}
        className={descriptionTextareaVariants({
          state: getTextareaState(),
        })}
        placeholder="請輸入此步驟的說明文字，至少需要10個字元..."
        aria-label="片段說明文字"
        aria-describedby={error ? 'description-error' : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <div
          id="description-error"
          className={cn(
            errorMessageVariants({ type: 'general' }),
            'error-message',
          )}
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
}
