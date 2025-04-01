import { useState, useRef, useEffect } from 'react';
import type React from 'react';
import { Edit, Play, Pause } from 'lucide-react';
import { useRouter } from 'next/router';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Player from '@vimeo/player';
import { Button } from '@/components/ui/button';

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
  'relative w-full aspect-video bg-black rounded overflow-hidden mb-4',
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
  startTime: number;
  endTime: number;
  onTimeUpdate?: (time: number) => void;
  size?: VariantProps<typeof vimeoPlayerVariants>['size'];
  variant?: VariantProps<typeof vimeoPlayerVariants>['variant'];
  className?: string;
  isPlaying: boolean;
};

/**
 * Vimeo 播放器組件
 */
const VimeoPlayer: React.FC<VimeoPlayerProps> = ({
  videoId,
  startTime,
  endTime,
  size,
  variant,
  className,
  onTimeUpdate,
  isPlaying,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const isLoopingRef = useRef<boolean>(false);

  // 初始化播放器
  useEffect(() => {
    let player: Player | null = null;

    if (typeof window !== 'undefined' && containerRef.current) {
      // 創建新的播放器實例
      player = new Player(containerRef.current, {
        id: parseInt(videoId, 10),
        width: 640,
        height: 360,
        background: true,
        responsive: true,
      });

      playerRef.current = player;

      // 設定初始播放位置
      player.setCurrentTime(startTime).catch((error) => {
        console.error('設定初始時間失敗:', error);
      });

      // 監聽播放進度
      player.on('timeupdate', (data) => {
        // 更新當前時間
        if (onTimeUpdate) {
          onTimeUpdate(data.seconds);
        }

        // 到達結束時間時重新回到起始時間
        if (data.seconds >= endTime && !isLoopingRef.current) {
          isLoopingRef.current = true;
          player
            ?.setCurrentTime(startTime)
            .then(() => {
              isLoopingRef.current = false;
            })
            .catch((error) => {
              console.error('循環播放段落失敗:', error);
              isLoopingRef.current = false;
            });
        }
      });
    }

    return () => {
      // 清理播放器
      if (player) {
        player.destroy().catch((error) => {
          console.error('播放器銷毀失敗:', error);
        });
        playerRef.current = null;
      }
    };
  }, [videoId, startTime, endTime, onTimeUpdate]);

  // 控制播放狀態
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.play().catch((error) => {
        console.error('播放失敗:', error);
      });
    } else {
      player.pause().catch((error) => {
        console.error('暫停失敗:', error);
      });
    }
  }, [isPlaying]);

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
 * 顯示料理步驟區域，支持查看步驟影片並跳轉到編輯頁面
 */
export const CookingSteps: React.FC<CookingStepsProps> = ({
  size,
  variant,
  className,
  ...props
}) => {
  const router = useRouter();
  // 假設的 Vimeo 影片 ID
  const videoId = '1062288466';

  // 步驟資料 - 使用 timeToSeconds 確保一致性
  const [steps] = useState<Step[]>([
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

  // 獲取第一個步驟用於預設播放
  const firstStep = steps[0];

  // 視頻播放相關狀態 - 預設播放步驟1
  const [currentTime, setCurrentTime] = useState(firstStep.startSeconds);
  const [isPlaying, setIsPlaying] = useState(true); // 預設播放
  const [activeStepId, setActiveStepId] = useState<string | null>(firstStep.id); // 預設選中步驟1
  const [activeStartTime, setActiveStartTime] = useState(
    firstStep.startSeconds,
  );
  const [activeEndTime, setActiveEndTime] = useState(firstStep.endSeconds);

  /**
   * 處理導航到步驟編輯頁面
   */
  const atNavigateToStepEditor = () => {
    // 透過 URL 查詢參數傳遞步驟資料
    const queryParams = new URLSearchParams({
      videoId,
      // 將步驟數據序列化為 JSON 並傳遞
      stepsData: JSON.stringify(steps),
    }).toString();

    router.push(`/recipe/edit-steps?${queryParams}`);
  };

  /**
   * 處理預覽步驟視頻範圍
   */
  const atPreviewStep = (step: Step) => {
    // 如果正在播放同一個步驟，則停止播放
    if (isPlaying && activeStepId === step.id) {
      setIsPlaying(false);
      setActiveStepId(null);
      return;
    }

    // 設置活動步驟和時間範圍
    setActiveStartTime(step.startSeconds);
    setActiveEndTime(step.endSeconds);
    setActiveStepId(step.id);

    // 開始播放
    setIsPlaying(true);
  };

  return (
    <div
      className={cn(cookingStepsVariants({ size, variant }), className)}
      {...props}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className={cn('font-medium', {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          })}
        >
          料理步驟
        </h3>
        <button
          type="button"
          className="p-1 bg-gray-100 rounded-full"
          onClick={atNavigateToStepEditor}
          aria-label="編輯料理步驟"
        >
          <Edit size={16} />
        </button>
      </div>

      {/* Vimeo 播放器 */}
      <VimeoPlayer
        videoId={videoId}
        startTime={activeStartTime}
        endTime={activeEndTime}
        isPlaying={isPlaying}
        onTimeUpdate={setCurrentTime}
        size={size}
      />

      <div
        className={cn('mb-2 text-right', {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        })}
      >
        當前時間: {secondsToTime(currentTime)}
      </div>

      {steps.map((step) => (
        <div key={step.id} className="border rounded mb-4">
          <div className="p-2 border-b flex justify-between items-center">
            <h4 className="font-medium">{step.title}</h4>
            {step.content ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => atPreviewStep(step)}
                className="flex items-center h-8"
              >
                {isPlaying && activeStepId === step.id ? (
                  <>
                    <Pause size={14} className="mr-1" />
                    <span>停止</span>
                  </>
                ) : (
                  <>
                    <Play size={14} className="mr-1" />
                    <span>播放</span>
                  </>
                )}
              </Button>
            ) : null}
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
                <span className="text-gray-400">
                  點擊上方編輯按鈕修改步驟內容
                </span>
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
    </div>
  );
};
