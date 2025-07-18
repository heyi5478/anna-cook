import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2 } from 'lucide-react';
import type { TimeMarkButtonsProps } from '@/types/video-editor';
import { COMMON_TEXTS } from '@/lib/constants/messages';

/**
 * 時間標記按鈕元件
 */
export const TimeMarkButtons: React.FC<TimeMarkButtonsProps> = ({
  onMarkStart,
  onMarkEnd,
  onResetAll,
  onDeleteStep,
}) => (
  <>
    <div className="grid grid-cols-2 gap-4 px-4 py-2">
      <Button
        variant="outline"
        onClick={onMarkStart}
        className="border border-neutral-300 rounded-md py-2"
      >
        標記起點
      </Button>
      <Button
        variant="outline"
        onClick={onMarkEnd}
        className="border border-neutral-300 rounded-md py-2"
      >
        標記終點
      </Button>
    </div>

    <div className="px-4 py-2">
      <Button
        variant="outline"
        onClick={onResetAll}
        className="w-full border border-neutral-300 rounded-md py-2 mb-2 flex items-center justify-center"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        全部步驟初始化
      </Button>
      <Button
        variant="outline"
        onClick={onDeleteStep}
        className="w-full bg-neutral-200 text-neutral-700 rounded-md py-2 flex items-center justify-center"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {COMMON_TEXTS.DELETE}此步驟
      </Button>
    </div>
  </>
);
