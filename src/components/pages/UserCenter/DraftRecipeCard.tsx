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
import { cn } from '@/lib/utils';
import { toggleRecipePublishStatus } from '@/services/recipes';
import { SUCCESS_MESSAGES, COMMON_TEXTS } from '@/lib/constants/messages';
import { DraftRecipeCardProps } from './types';
import {
  cardContainerBaseVariants,
  cardImageVariants,
  cardContentVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardActionButtonVariants,
  dialogVariants,
  dialogTitleVariants,
  statusMessageVariants,
  dialogButtonContainerVariants,
  dialogActionButtonVariants,
  successStateVariants,
  successTitleVariants,
  successDescriptionVariants,
} from './styles';

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
    <div className={cn(cardContainerBaseVariants())}>
      <div className={cn(cardImageVariants({ size: 'small' }))}>
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className={cn(cardContentVariants())}>
        <h3 className={cn(cardTitleVariants())}>{title}</h3>
        <p className={cn(cardDescriptionVariants({ spacing: 'withMargin' }))}>
          {description}
        </p>
      </div>

      {!isDeleteMode && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className={cn(cardActionButtonVariants({ variant: 'toPublish' }))}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              轉發佈
            </Button>
          </DialogTrigger>
          <DialogContent className={cn(dialogVariants())}>
            {publishSuccess ? (
              <div className={cn(successStateVariants())}>
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h2 className={cn(successTitleVariants())}>
                  {SUCCESS_MESSAGES.PUBLISH_SUCCESS}
                </h2>
                <p className={cn(successDescriptionVariants())}>
                  {SUCCESS_MESSAGES.RECIPE_PUBLISHED}
                </p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle
                    className={cn(dialogTitleVariants({ size: 'large' }))}
                  >
                    是否將所選食譜轉成發佈狀態?
                  </DialogTitle>
                </DialogHeader>

                {publishError && (
                  <div
                    className={cn(
                      statusMessageVariants({
                        variant: 'error',
                        withIcon: true,
                      }),
                    )}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {publishError}
                  </div>
                )}

                <div className={cn(dialogButtonContainerVariants())}>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      atConfirmPublish();
                    }}
                    className={cn(
                      dialogActionButtonVariants({ variant: 'confirm' }),
                    )}
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
                      className={cn(
                        dialogActionButtonVariants({ variant: 'cancel' }),
                      )}
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
