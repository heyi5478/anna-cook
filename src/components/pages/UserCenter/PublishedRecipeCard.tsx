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
import { toggleRecipePublishStatus } from '@/services/recipes';
import { SUCCESS_MESSAGES, COMMON_TEXTS } from '@/lib/constants/messages';
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
    <div className="flex bg-white rounded-lg border p-4 gap-4">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
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

        <div className="flex items-center text-xs text-neutral-500 space-x-4">
          <div className="flex items-center space-x-1">
            <BookmarkIcon className="h-4 w-4" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-amber-400" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="ml-auto bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 text-sm border border-neutral-200"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            轉草稿
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg max-w-md">
          {changeSuccess ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-lg font-medium text-center mb-2">
                {SUCCESS_MESSAGES.CONVERT_SUCCESS}
              </h2>
              <p className="text-sm text-neutral-600 text-center">
                {SUCCESS_MESSAGES.RECIPE_TO_DRAFT}
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-center mb-4">
                  是否將所選食譜轉成草稿狀態?
                </DialogTitle>
              </DialogHeader>

              {changeError && (
                <div className="flex items-center p-3 rounded-md mb-4 bg-red-50 text-red-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {changeError}
                </div>
              )}

              <div className="flex justify-between mt-6 space-x-4">
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    atConfirmToDraft();
                  }}
                  className="flex-1"
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
                    className="flex-1 border border-neutral-300 text-black font-normal"
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
