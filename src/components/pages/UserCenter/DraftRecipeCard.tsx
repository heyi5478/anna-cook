import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toggleRecipePublishStatus } from '@/services/recipes';
import { SUCCESS_MESSAGES, COMMON_TEXTS } from '@/lib/constants/messages';
import { DraftRecipeCardProps } from './types';

/**
 * 顯示草稿的食譜卡片
 */
export function DraftRecipeCard({
  title,
  description,
  imageSrc,
  recipeId,
  onPublish,
  isDeleteMode,
  onStatusChanged,
}: DraftRecipeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  /**
   * 處理確認發佈的動作
   */
  const atConfirmPublish = async () => {
    if (!recipeId) {
      setPublishError('食譜 ID 不存在');
      return;
    }

    try {
      setIsPublishing(true);
      setPublishError(null);

      // 調用 API 將食譜狀態切換為「已發佈」
      await toggleRecipePublishStatus(recipeId, true);

      // 設置成功狀態
      setPublishSuccess(true);

      // 如果提供了回調函數，調用它
      if (onPublish) {
        onPublish(recipeId);
      }

      // 通知父元件狀態已更改
      if (onStatusChanged) {
        onStatusChanged();
      }

      // 2 秒後關閉對話框
      setTimeout(() => {
        setDialogOpen(false);
        setPublishSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('發佈食譜失敗:', error);
      setPublishError(error instanceof Error ? error.message : '發佈食譜失敗');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex bg-white rounded-lg border p-4 gap-4">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-neutral-900 mb-2 truncate">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {description}
        </p>
      </div>

      {!isDeleteMode && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              轉發佈
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg max-w-md">
            {publishSuccess ? (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-lg font-medium text-center mb-2">
                  {SUCCESS_MESSAGES.PUBLISH_SUCCESS}
                </h2>
                <p className="text-sm text-neutral-600 text-center">
                  {SUCCESS_MESSAGES.RECIPE_PUBLISHED}
                </p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-medium text-center mb-4">
                    是否將所選食譜轉成發佈狀態?
                  </DialogTitle>
                </DialogHeader>

                {publishError && (
                  <div className="flex items-center p-3 rounded-md mb-4 bg-red-50 text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {publishError}
                  </div>
                )}

                <div className="flex justify-between mt-6 space-x-4">
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      atConfirmPublish();
                    }}
                    className="flex-1"
                    disabled={isPublishing}
                  >
                    {isPublishing
                      ? COMMON_TEXTS.SUBMITTING
                      : COMMON_TEXTS.CONFIRM}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDialogOpen(false);
                      }}
                      className="flex-1 border border-neutral-300 text-black font-normal"
                      disabled={isPublishing}
                    >
                      {COMMON_TEXTS.CANCEL}
                    </Button>
                  </DialogClose>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
