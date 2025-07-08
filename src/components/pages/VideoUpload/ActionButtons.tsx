import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import { cn } from '@/lib/utils';
import {
  actionButtonVariants,
  errorMessageVariants,
  buttonGroupVariants,
  primaryActionButtonVariants,
  forceSubmitButtonVariants,
} from './styles';

/**
 * 操作按鈕元件屬性
 */
type ActionButtonsProps = {
  segments: {
    id: string;
    description: string;
  }[];
  currentSegmentIndex: number;
  isSubmitting: boolean;
  errors: Record<string, string | undefined>;
  apiError: string | null;
  atCancel: () => void;
  atSubmit: () => void;
  setErrors: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >;
};

// 操作按鈕元件 - 處理取消和確認操作，包含錯誤處理機制
export default function ActionButtons({
  segments,
  currentSegmentIndex,
  isSubmitting,
  errors,
  apiError,
  atCancel,
  atSubmit,
  setErrors,
}: ActionButtonsProps) {
  // 獲取提交按鈕狀態
  const getSubmitButtonState = () => {
    if (isSubmitting) return 'loading';
    if (Object.keys(errors).length > 0) return 'disabled';
    return 'normal';
  };

  // 檢查是否顯示強制提交按鈕
  const shouldShowForceSubmit = () => {
    return (
      Object.keys(errors).length > 0 &&
      segments[currentSegmentIndex]?.description?.trim().length >= 10
    );
  };

  // 處理主提交按鈕點擊
  const handleSubmitClick = () => {
    // 先檢查文字字數，如果已達標準但按鈕仍禁用，強制清除錯誤
    const currentDescription =
      segments[currentSegmentIndex]?.description?.trim() || '';
    if (currentDescription.length >= 10 && Object.keys(errors).length > 0) {
      console.log('文字已符合標準但按鈕仍禁用，強制清除錯誤');
      setErrors({});
      setTimeout(() => atSubmit(), 50);
    } else {
      atSubmit();
    }
  };

  // 處理強制提交按鈕點擊
  const handleForceSubmitClick = () => {
    console.log('強制重設狀態並提交');
    setErrors({});
    setTimeout(() => {
      if (Object.keys(errors).length === 0) {
        atSubmit();
      }
    }, 100);
  };

  return (
    <div className={actionButtonVariants()}>
      {/* API 錯誤訊息 */}
      {apiError && (
        <div className={cn(errorMessageVariants({ type: 'api' }), 'api-error')}>
          <div
            className="h-4 w-4 mr-1 rounded-full bg-red-500"
            aria-hidden="true"
          />
          {apiError}
        </div>
      )}

      {/* 按鈕群組 */}
      <div className={buttonGroupVariants()}>
        <Button
          onClick={atCancel}
          variant="outline"
          className={primaryActionButtonVariants({ state: 'normal' })}
        >
          {COMMON_TEXTS.CANCEL}
        </Button>
        <Button
          onClick={handleSubmitClick}
          disabled={isSubmitting || Object.keys(errors).length > 0}
          variant={
            isSubmitting || Object.keys(errors).length > 0
              ? 'secondary'
              : 'default'
          }
          className={primaryActionButtonVariants({
            state: getSubmitButtonState(),
          })}
        >
          {isSubmitting ? (
            COMMON_TEXTS.UPLOADING
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              {COMMON_TEXTS.COMPLETE}
            </>
          )}
        </Button>
      </div>

      {/* 強制重設狀態按鈕 - 當文字已足夠但按鈕仍然禁用時使用 */}
      {shouldShowForceSubmit() && (
        <Button
          onClick={handleForceSubmitClick}
          variant="default"
          className={forceSubmitButtonVariants()}
        >
          強制繼續 (狀態已修復)
        </Button>
      )}
    </div>
  );
}
