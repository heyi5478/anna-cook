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
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * DraftRecipeCard 元件的 props 類型
 */
type DraftRecipeCardProps = {
  title?: string;
  description?: string;
  imageSrc?: string;
  recipeId?: number;
  onPublish?: (recipeId: number) => void;
  isDeleteMode?: boolean;
  onStatusChanged?: () => void;
};

/**
 * 顯示草稿的食譜卡片
 */
export function DraftRecipeCard({
  title = '馬鈴薯烤蛋',
  description = '食譜故事敘述食譜故事敘述食譜故事敘述...',
  imageSrc = '/placeholder.svg',
  recipeId,
  onPublish,
  isDeleteMode = false,
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
    <div className="border rounded-lg p-4 flex relative ">
      <div className="w-[96px] h-[96px] bg-gray-200 shrink-0 rounded-md overflow-hidden relative">
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 ml-4 flex flex-col">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-auto line-clamp-2 mt-3">
          {description}
        </p>
      </div>

      {!isDeleteMode && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="absolute top-4 right-4 px-5 py-1 h-8 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-normal text-sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              轉發佈
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white rounded-lg p-6">
            {publishSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-lg font-medium text-center mb-2">
                  發佈成功
                </h2>
                <p className="text-gray-500 text-center">食譜已成功發佈</p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-center font-medium text-xl mb-2">
                    是否將所選食譜轉成發佈狀態?
                  </DialogTitle>
                </DialogHeader>

                {publishError && (
                  <div className="p-3 rounded-md bg-red-50 text-red-700 mb-4 flex items-center">
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
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    disabled={isPublishing}
                  >
                    {isPublishing ? '處理中...' : '確認'}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDialogOpen(false);
                      }}
                      className="flex-1 border border-gray-200"
                      disabled={isPublishing}
                    >
                      取消
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
