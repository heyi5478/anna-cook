import {
  Star,
  MessageSquare,
  BookmarkIcon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { toggleRecipePublishStatus } from '@/services/recipes';
import { SUCCESS_MESSAGES, COMMON_TEXTS } from '@/lib/constants/messages';
import {
  cardContainerBaseVariants,
  cardImageVariants,
  cardContentVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardStatsVariants,
  cardStatsItemVariants,
  cardActionButtonVariants,
  dialogVariants,
  dialogTitleVariants,
  statusMessageVariants,
  dialogButtonContainerVariants,
  dialogActionButtonVariants,
  successStateVariants,
  successTitleVariants,
  successDescriptionVariants,
} from '@/styles/cva/user-center';
import { PublishedRecipeCardProps } from './types';

/**
 * 顯示已發布的食譜卡片
 */
export function PublishedRecipeCard({
  title,
  description,
  imageSrc,
  likes,
  comments,
  rating,
  recipeId,
  onToDraft,
  onStatusChanged,
}: PublishedRecipeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);

  /**
   * 處理確認轉為草稿的動作
   */
  const atConfirmToDraft = async () => {
    if (!recipeId) {
      setChangeError('食譜 ID 不存在');
      return;
    }

    try {
      setIsChanging(true);
      setChangeError(null);

      // 調用 API 將食譜狀態切換為「草稿」
      await toggleRecipePublishStatus(recipeId, false);

      // 設置成功狀態
      setChangeSuccess(true);

      // 如果提供了回調函數，調用它
      if (onToDraft) {
        onToDraft(recipeId);
      }

      // 通知父元件狀態已更改
      if (onStatusChanged) {
        onStatusChanged();
      }

      // 2 秒後關閉對話框
      setTimeout(() => {
        setDialogOpen(false);
        setChangeSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('轉為草稿失敗:', error);
      setChangeError(error instanceof Error ? error.message : '轉為草稿失敗');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className={cn(cardContainerBaseVariants())}>
      <div className={cn(cardImageVariants({ size: 'large' }))}>
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className={cn(cardContentVariants())}>
        <h3 className={cn(cardTitleVariants())}>{title}</h3>
        <p className={cn(cardDescriptionVariants())}>{description}</p>

        <div className={cn(cardStatsVariants())}>
          <div className={cn(cardStatsItemVariants())}>
            <BookmarkIcon className="h-5 w-5" />
            <span>{comments}</span>
          </div>
          <div className={cn(cardStatsItemVariants())}>
            <MessageSquare className="h-5 w-5" />
            <span>{likes}</span>
          </div>
          <div className={cn(cardStatsItemVariants())}>
            <Star className="h-5 w-5 text-amber-400" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className={cn(cardActionButtonVariants({ variant: 'toDraft' }))}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            轉草稿
          </Button>
        </DialogTrigger>
        <DialogContent className={cn(dialogVariants())}>
          {changeSuccess ? (
            <div className={cn(successStateVariants())}>
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h2 className={cn(successTitleVariants())}>
                {SUCCESS_MESSAGES.CONVERT_SUCCESS}
              </h2>
              <p className={cn(successDescriptionVariants())}>
                {SUCCESS_MESSAGES.RECIPE_TO_DRAFT}
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle
                  className={cn(dialogTitleVariants({ size: 'large' }))}
                >
                  是否將所選食譜轉成草稿狀態?
                </DialogTitle>
              </DialogHeader>

              {changeError && (
                <div
                  className={cn(
                    statusMessageVariants({ variant: 'error', withIcon: true }),
                  )}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {changeError}
                </div>
              )}

              <div className={cn(dialogButtonContainerVariants())}>
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    atConfirmToDraft();
                  }}
                  className={cn(
                    dialogActionButtonVariants({ variant: 'confirm' }),
                  )}
                  disabled={isChanging}
                >
                  {isChanging ? COMMON_TEXTS.SUBMITTING : COMMON_TEXTS.CONFIRM}
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
                    disabled={isChanging}
                  >
                    {COMMON_TEXTS.CANCEL}
                  </Button>
                </DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
