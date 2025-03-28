import { useState, useRef, useEffect } from 'react';
import type React from 'react';
import { Edit, Plus, Trash, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Player from '@vimeo/player';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type Step = {
  id: string;
  title: string;
  content: string;
  startTime: string; // 格式: "00:12"
  endTime: string; // 格式: "00:12"
  startSeconds: number; // 秒數表示，例如: 12
  endSeconds: number; // 秒數表示，例如: 24
};

const vimeoPlayerVariants = cva(
  'relative w-full aspect-video bg-black rounded overflow-hidden',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
      },
      variant: {
        default: '',
        outline: 'border border-gray-200',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

type VimeoPlayerProps = {
  videoId: string;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate?: (time: number) => void;
  size?: VariantProps<typeof vimeoPlayerVariants>['size'];
  variant?: VariantProps<typeof vimeoPlayerVariants>['variant'];
  className?: string;
};

/**
 * Vimeo 播放器組件
 */
const VimeoPlayer: React.FC<VimeoPlayerProps> = ({
  videoId,
  currentTime,
  isPlaying,
  size,
  variant,
  className,
  onTimeUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  /**
   * 初始化 Vimeo 播放器
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      // 清理舊的播放器實例
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      // 創建新的播放器實例
      playerRef.current = new Player(containerRef.current, {
        id: parseInt(videoId, 10),
        width: 640,
        height: 360,
        background: true,
        responsive: true,
      });

      /**
       * 設置時間更新事件監聽器
       */
      playerRef.current.on('timeupdate', (data) => {
        if (onTimeUpdate) {
          onTimeUpdate(data.seconds);
        }
      });

      // 設置初始時間
      playerRef.current.setCurrentTime(currentTime);
    }

    return () => {
      // 清理播放器
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, onTimeUpdate, currentTime]);

  /**
   * 控制播放和暫停
   */
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.play().catch((error) => {
          console.error('播放失敗:', error);
        });
      } else {
        playerRef.current.pause().catch((error) => {
          console.error('暫停失敗:', error);
        });
      }
    }
  }, [isPlaying]);

  /**
   * 設置當前時間
   */
  useEffect(() => {
    if (playerRef.current && !isPlaying) {
      playerRef.current.setCurrentTime(currentTime).catch((error) => {
        console.error('設置時間失敗:', error);
      });
    }
  }, [currentTime, isPlaying]);

  return (
    <div className={cn(vimeoPlayerVariants({ size, variant }), className)}>
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};

const cookingStepsVariants = cva('px-4 py-2', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    variant: {
      default: 'bg-white',
      outline: 'border rounded-md',
      ghost: 'bg-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

type CookingStepsProps = VariantProps<typeof cookingStepsVariants> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * 時間格式轉換函數：將 "00:12" 格式轉為秒數
 */
const timeToSeconds = (timeStr: string): number => {
  const [minutes, seconds] = timeStr.split(':').map(Number);
  return minutes * 60 + seconds;
};

/**
 * 秒數轉換為時間格式函數：將秒數轉為 "00:12" 格式
 */
const secondsToTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 顯示料理步驟區域，支持編輯、新增和刪除步驟
 */
export const CookingSteps: React.FC<CookingStepsProps> = ({
  size,
  variant,
  className,
  ...props
}) => {
  // 假設的 Vimeo 影片 ID
  const videoId = '1062288466';

  // 步驟資料 - 使用 timeToSeconds 確保一致性
  const [steps, setSteps] = useState<Step[]>([
    {
      id: '1',
      title: '步驟 1',
      content: '將高麗菜切絲，放入熱鍋中快炒',
      startTime: '00:12',
      endTime: '00:24',
      startSeconds: timeToSeconds('00:12'),
      endSeconds: timeToSeconds('00:24'),
    },
    {
      id: '2',
      title: '步驟 2',
      content: '加入調味料攪拌均勻',
      startTime: '00:25',
      endTime: '00:35',
      startSeconds: timeToSeconds('00:25'),
      endSeconds: timeToSeconds('00:35'),
    },
    {
      id: '3',
      title: '步驟 3',
      content: '',
      startTime: '00:36',
      endTime: '00:48',
      startSeconds: timeToSeconds('00:36'),
      endSeconds: timeToSeconds('00:48'),
    },
  ]);

  // 編輯相關狀態
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editStartSeconds, setEditStartSeconds] = useState(0);
  const [editEndSeconds, setEditEndSeconds] = useState(0);

  // 播放器相關狀態
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreviewingRange, setIsPreviewingRange] = useState(false);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 處理開始編輯步驟
   */
  const atStartEdit = (step: Step) => {
    setEditingStep(step);
    setEditContent(step.content);
    setEditStartSeconds(step.startSeconds);
    setEditEndSeconds(step.endSeconds);
    setCurrentTime(step.startSeconds);
    setIsDialogOpen(true);
  };

  /**
   * 處理取消編輯
   */
  const atCancelEdit = () => {
    setIsDialogOpen(false);
    setEditingStep(null);
    // 停止任何正在進行的預覽
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
    }
    setIsPlaying(false);
  };

  /**
   * 處理保存編輯
   */
  const atSaveEdit = () => {
    if (editingStep) {
      const updatedSteps = steps.map((step) =>
        step.id === editingStep.id
          ? {
              ...step,
              content: editContent,
              startTime: secondsToTime(editStartSeconds),
              endTime: secondsToTime(editEndSeconds),
              startSeconds: editStartSeconds,
              endSeconds: editEndSeconds,
            }
          : step,
      );
      setSteps(updatedSteps);
    }
    setIsDialogOpen(false);
    setEditingStep(null);
    // 停止任何正在進行的預覽
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
    }
    setIsPlaying(false);
  };

  /**
   * 處理新增步驟
   */
  const atAddStep = () => {
    const newStepNumber = steps.length + 1;
    // 計算新步驟的預設時間範圍
    const lastStep = steps[steps.length - 1];
    const defaultStartSeconds = lastStep ? lastStep.endSeconds + 1 : 0;
    const defaultEndSeconds = defaultStartSeconds + 10; // 預設 10 秒長度

    const newStep = {
      id: Date.now().toString(),
      title: `步驟 ${newStepNumber}`,
      content: '',
      startTime: secondsToTime(defaultStartSeconds),
      endTime: secondsToTime(defaultEndSeconds),
      startSeconds: defaultStartSeconds,
      endSeconds: defaultEndSeconds,
    };

    setSteps([...steps, newStep]);
    // 直接開始編輯新步驟
    atStartEdit(newStep);
  };

  /**
   * 處理刪除步驟
   */
  const atDeleteStep = (id: string) => {
    // 刪除步驟
    const filteredSteps = steps.filter((step) => step.id !== id);

    // 重新編號步驟
    const renamedSteps = filteredSteps.map((step, index) => ({
      ...step,
      title: `步驟 ${index + 1}`,
    }));

    setSteps(renamedSteps);
  };

  /**
   * 處理預覽時間範圍
   */
  const atPreviewRange = () => {
    if (!editingStep) return;

    // 停止任何正在進行的預覽
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      setIsPlaying(false);
      setIsPreviewingRange(false);
      previewTimerRef.current = null;
      return;
    }

    // 開始預覽
    setCurrentTime(editStartSeconds);
    setIsPlaying(true);
    setIsPreviewingRange(true);

    // 設置計時器在結束時間停止播放
    const duration = (editEndSeconds - editStartSeconds) * 1000;
    previewTimerRef.current = setTimeout(() => {
      setIsPlaying(false);
      setIsPreviewingRange(false);
      previewTimerRef.current = null;
    }, duration);
  };

  /**
   * 處理時間滑桿變更
   */
  const atTimeSliderChange = (value: number[], type: 'start' | 'end') => {
    if (type === 'start') {
      setEditStartSeconds(value[0]);
      // 確保起始時間不超過結束時間
      if (value[0] >= editEndSeconds) {
        setEditEndSeconds(value[0] + 1);
      }
    } else {
      setEditEndSeconds(value[0]);
      // 確保結束時間不小於起始時間
      if (value[0] <= editStartSeconds) {
        setEditStartSeconds(value[0] - 1);
      }
    }

    // 更新播放器當前時間
    setCurrentTime(type === 'start' ? value[0] : value[0]);
  };

  /**
   * 處理內容變更
   */
  const atContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
  };

  /**
   * 處理使用當前時間作為起始時間
   */
  const atUseCurrentTimeForStart = () => {
    setEditStartSeconds(Math.floor(currentTime));
  };

  /**
   * 處理使用當前時間作為結束時間
   */
  const atUseCurrentTimeForEnd = () => {
    setEditEndSeconds(Math.floor(currentTime));
  };

  return (
    <div
      className={cn(cookingStepsVariants({ size, variant }), className)}
      {...props}
    >
      <h3
        className={cn('font-medium mb-2', {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        })}
      >
        料理步驟
      </h3>

      {steps.map((step) => (
        <div key={step.id} className="border rounded mb-4">
          <div className="flex justify-between items-center p-2 border-b">
            <h4 className="font-medium">{step.title}</h4>
            <div className="flex space-x-1">
              <button
                type="button"
                className="p-1"
                onClick={() => atStartEdit(step)}
              >
                <Edit size={16} />
              </button>
              <button
                type="button"
                className="p-1 text-red-500"
                onClick={() => atDeleteStep(step.id)}
              >
                <Trash size={16} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div
              className={cn({
                'text-xs': size === 'sm',
                'text-sm': size === 'md',
                'text-base': size === 'lg',
              })}
            >
              {step.content || (
                <span className="text-gray-400">點擊編輯按鈕添加步驟內容</span>
              )}
            </div>

            {step.content && (
              <div
                className={cn('bg-gray-100 p-2 mt-2 rounded', {
                  'text-xs': size === 'sm',
                  'text-sm': size === 'md',
                  'text-base': size === 'lg',
                })}
              >
                <div className="flex justify-between">
                  <span>起始秒數</span>
                  <span>{step.startTime}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>結束秒數</span>
                  <span>{step.endTime}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="w-full p-2 border border-dashed rounded flex items-center justify-center"
        onClick={atAddStep}
      >
        <Plus size={16} className="mr-1" />
        <span
          className={cn({
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          })}
        >
          新增步驟
        </span>
      </button>

      {/* 步驟編輯模態視窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStep?.title || '編輯步驟'}</DialogTitle>
          </DialogHeader>

          {/* Vimeo 播放器 */}
          <div className="mb-4">
            <VimeoPlayer
              videoId={videoId}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTimeUpdate={(time) => setCurrentTime(time)}
              size={size}
            />

            <div className="flex justify-between items-center mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={atPreviewRange}
                className="flex items-center"
                type="button"
              >
                {isPreviewingRange ? (
                  <>
                    <Pause size={16} className="mr-1" />
                    <span>停止預覽</span>
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-1" />
                    <span>預覽時間段</span>
                  </>
                )}
              </Button>
              <span
                className={cn({
                  'text-xs': size === 'sm',
                  'text-sm': size === 'md',
                  'text-base': size === 'lg',
                })}
              >
                當前時間: {secondsToTime(currentTime)}
              </span>
            </div>
          </div>

          {/* 步驟內容編輯 */}
          <div className="mb-4">
            <div
              className={cn('font-medium block mb-1', {
                'text-xs': size === 'sm',
                'text-sm': size === 'md',
                'text-base': size === 'lg',
              })}
            >
              步驟說明
            </div>
            <textarea
              className={cn('w-full p-2 border rounded', {
                'text-xs': size === 'sm',
                'text-sm': size === 'md',
                'text-base': size === 'lg',
              })}
              value={editContent}
              onChange={atContentChange}
              rows={3}
              placeholder="輸入步驟說明..."
              aria-label="步驟說明"
            />
          </div>

          {/* 時間範圍設置 */}
          <div className="space-y-4">
            <div>
              <div
                className={cn('font-medium flex justify-between', {
                  'text-xs': size === 'sm',
                  'text-sm': size === 'md',
                  'text-base': size === 'lg',
                })}
              >
                <span>起始時間: {secondsToTime(editStartSeconds)}</span>
                <button
                  type="button"
                  className="text-xs text-blue-500"
                  onClick={atUseCurrentTimeForStart}
                  aria-label="使用當前時間作為起始時間"
                >
                  使用當前時間
                </button>
              </div>
              <Slider
                value={[editStartSeconds]}
                min={0}
                max={300} // 假設影片最長 5 分鐘
                step={1}
                onValueChange={(value) => atTimeSliderChange(value, 'start')}
                className="mt-2"
                aria-label="起始時間滑桿"
              />
            </div>

            <div>
              <div
                className={cn('font-medium flex justify-between', {
                  'text-xs': size === 'sm',
                  'text-sm': size === 'md',
                  'text-base': size === 'lg',
                })}
              >
                <span>結束時間: {secondsToTime(editEndSeconds)}</span>
                <button
                  type="button"
                  className="text-xs text-blue-500"
                  onClick={atUseCurrentTimeForEnd}
                  aria-label="使用當前時間作為結束時間"
                >
                  使用當前時間
                </button>
              </div>
              <Slider
                value={[editEndSeconds]}
                min={0}
                max={300} // 假設影片最長 5 分鐘
                step={1}
                onValueChange={(value) => atTimeSliderChange(value, 'end')}
                className="mt-2"
                aria-label="結束時間滑桿"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={atCancelEdit} type="button">
              取消
            </Button>
            <Button onClick={atSaveEdit} type="button">
              確認
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
