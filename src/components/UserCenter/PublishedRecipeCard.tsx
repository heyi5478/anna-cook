import { Star, MessageSquare, BookmarkIcon } from 'lucide-react';
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
 * PublishedRecipeCard 元件的 props 類型
 */
type PublishedRecipeCardProps = {
  title?: string;
  description?: string;
  imageSrc?: string;
  likes?: number;
  comments?: number;
  rating?: number;
  onToDraft?: () => void;
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
  onToDraft,
}: PublishedRecipeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * 處理確認轉為草稿的動作
   */
  const atConfirmToDraft = () => {
    if (onToDraft) {
      onToDraft();
    }
    setDialogOpen(false);
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
          >
            轉草稿
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-center font-medium text-xl mb-2">
              是否將所選食譜轉成草稿狀態?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-between mt-6 space-x-4">
            <Button
              variant="destructive"
              onClick={atConfirmToDraft}
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
