import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { COMMON_TEXTS } from '@/lib/constants/messages';

/**
 * 操作按鈕元件，處理取消和確認操作
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
  return (
    <div className="space-y-4">
      {/* API 錯誤訊息 */}
      {apiError && (
        <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-300 rounded-md flex items-center api-error mt-2">
          <div
            className="h-4 w-4 mr-1 rounded-full bg-red-500"
            aria-hidden="true"
          />
          {apiError}
        </div>
      )}

      {/* 按鈕群組 */}
      <div className="flex gap-3 mt-6">
        <Button onClick={atCancel} variant="outline" className="w-1/2">
          {COMMON_TEXTS.CANCEL}
        </Button>
        <Button
          onClick={() => {
            // 先檢查文字字數，如果已達標準但按鈕仍禁用，強制清除錯誤
            const currentDescription =
              segments[currentSegmentIndex]?.description?.trim() || '';
            if (
              currentDescription.length >= 10 &&
              Object.keys(errors).length > 0
            ) {
              console.log('文字已符合標準但按鈕仍禁用，強制清除錯誤');
              setErrors({});
              setTimeout(() => atSubmit(), 50);
            } else {
              atSubmit();
            }
          }}
          disabled={isSubmitting || Object.keys(errors).length > 0}
          variant={
            isSubmitting || Object.keys(errors).length > 0
              ? 'secondary'
              : 'default'
          }
          className="w-1/2"
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
      {Object.keys(errors).length > 0 &&
        segments[currentSegmentIndex]?.description?.trim().length >= 10 && (
          <Button
            onClick={() => {
              console.log('強制重設狀態並提交');
              setErrors({});
              setTimeout(() => {
                if (Object.keys(errors).length === 0) {
                  atSubmit();
                }
              }, 100);
            }}
            variant="default"
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
          >
            強制繼續 (狀態已修復)
          </Button>
        )}
    </div>
  );
}
