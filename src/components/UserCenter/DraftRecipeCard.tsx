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

/**
 * DraftRecipeCard 元件的 props 類型
 */
type DraftRecipeCardProps = {
  title?: string;
  description?: string;
  imageSrc?: string;
  onPublish?: () => void;
};

/**
 * 顯示草稿的食譜卡片
 */
export function DraftRecipeCard({
  title = '馬鈴薯烤蛋',
  description = '食譜故事敘述食譜故事敘述食譜故事敘述...',
  imageSrc = '/placeholder.svg',
  onPublish,
}: DraftRecipeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * 處理確認發佈的動作
   */
  const atConfirmPublish = () => {
    if (onPublish) {
      onPublish();
    }
    setDialogOpen(false);
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="absolute top-4 right-4 px-5 py-1 h-8 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-normal text-sm"
          >
            轉發佈
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-center font-medium text-xl mb-2">
              是否將所選食譜轉成發佈狀態?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-between mt-6 space-x-4">
            <Button
              variant="destructive"
              onClick={atConfirmPublish}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              確認
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1 border border-gray-200"
              >
                取消
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
