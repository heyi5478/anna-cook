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
import { toggleRecipePublishStatus } from '@/services/api';

/**
 * PublishedRecipeCard 元件的 props 類型
 */
type PublishedRecipeCardProps = {
  title?: string;
  description?: string;
  imageSrc?: string;
  likes?: number;
  comments?: number;
  rating?: number;
  recipeId?: number;
  onToDraft?: (recipeId: number) => void;
  onStatusChanged?: () => void;
};

/**
 * 顯示已發布的食譜卡片
 */
export function PublishedRecipeCard({
  title = '馬鈴薯烤蛋',
  description = '食譜故事敘述食譜故事敘述食譜故事敘述...',
  imageSrc = '/placeholder.svg',
  likes = 3,
  comments = 2,
  rating = 4.3,
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
    <div className="border rounded-lg p-4 flex relative">
      <div className="w-[132px] h-[132px] bg-gray-200 shrink-0 rounded-none overflow-hidden relative">
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 ml-4 flex flex-col">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-auto line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-6 mt-2 text-sm text-gray-800">
          <div className="flex items-center gap-1">
            <BookmarkIcon className="h-5 w-5" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-5 w-5" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-amber-400" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="absolute top-4 right-4 px-5 py-1 h-8 rounded-md bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 font-normal text-sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            轉草稿
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white rounded-lg p-6">
          {changeSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-lg font-medium text-center mb-2">轉換成功</h2>
              <p className="text-gray-500 text-center">食譜已成功轉為草稿</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-center font-medium text-xl mb-2">
                  是否將所選食譜轉成草稿狀態?
                </DialogTitle>
              </DialogHeader>

              {changeError && (
                <div className="p-3 rounded-md bg-red-50 text-red-700 mb-4 flex items-center">
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
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={isChanging}
                >
                  {isChanging ? '處理中...' : '確認'}
                </Button>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDialogOpen(false);
                    }}
                    className="flex-1 border border-gray-200"
                    disabled={isChanging}
                  >
                    取消
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
