import type React from 'react';

import { ChevronDown, ImageIcon, Plus, Trash } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import Player, { type Options } from '@vimeo/player';

type Step = {
  description: string;
  startTime: string;
  endTime: string;
  video?: string;
  vimeoId?: string;
  id?: string;
};

type CookingStepProps = {
  steps: Step[];
  onRemoveStep: (index: number) => void;
};

// Vimeo 播放器屬性
type VimeoPlayerProps = {
  videoId: string;
  width?: number;
  startTime: number;
  endTime: number;
};

/**
 * 將時間字串轉換為秒數
 */
const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    const minutes = Number.parseInt(parts[0], 10);
    const seconds = Number.parseInt(parts[1], 10);
    return minutes * 60 + seconds;
  }
  return 0;
};

/**
 * Vimeo 播放器元件
 */
export const Video: React.FC<VimeoPlayerProps> = ({
  videoId,
  width = 640,
  startTime,
  endTime,
}) => {
  const playerContainer = useRef<HTMLDivElement>(null);
  // 使用 ref 避免重複重設播放位置
  const isLoopingRef = useRef<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let player: Player | undefined;
    if (playerContainer.current) {
      const options: Options = {
        url: `https://vimeo.com/${videoId}`,
        autoplay: true,
        // muted: true,
        responsive: true,
        width,
        height: (width * 9) / 16,
      };
      player = new Player(playerContainer.current, options);

      // 設定影片從指定時間開始播放
      player.setCurrentTime(startTime).catch((error: unknown) => {
        console.error('設定起始時間失敗:', error);
      });

      // 監聽播放進度，達到結束時間時跳回起始時間以達成循環效果
      player.on('timeupdate', (data: { seconds: number }) => {
        if (data.seconds >= endTime && !isLoopingRef.current) {
          isLoopingRef.current = true;
          player
            ?.setCurrentTime(startTime)
            .then(() => {
              isLoopingRef.current = false;
            })
            .catch((error: unknown) => {
              console.error('循環播放段落失敗:', error);
              isLoopingRef.current = false;
            });
        }
      });

      // 監聽載入完成事件
      player.on('loaded', () => {
        setIsLoaded(true);
      });
    }

    return () => {
      if (player) {
        // 此處明確將 error 參數型別設為 unknown
        player
          .destroy()
          .catch((error: unknown) => console.error('播放器銷毀失敗:', error));
      }
    };
  }, [videoId, width, startTime, endTime]);

  return (
    <div className="w-full h-full relative">
      <div ref={playerContainer} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

/**
 * 料理步驟元件
 */
export const CookingStep = ({ steps, onRemoveStep }: CookingStepProps) => {
  /**
   * 切換步驟展開狀態
   */
  const atToggleStep = (index: number) => {
    const stepElement = document.getElementById(`step-${index}`);
    if (stepElement) {
      stepElement.classList.toggle('hidden');
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">料理步驟</h2>
        <button className="p-1">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {steps.map((step, index) => (
        <div
          key={step.id || `step-${step.description}-${step.startTime}-${index}`}
          className="mb-4"
        >
          <div
            className="flex items-center justify-between p-2 bg-gray-100 rounded cursor-pointer"
            onClick={() => atToggleStep(index)}
          >
            <h3 className="font-medium">步驟 {index + 1}</h3>
            <div className="flex items-center">
              <ChevronDown className="w-4 h-4" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveStep(index);
                }}
                className="ml-2"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div id={`step-${index}`} className="p-4 mt-2 border rounded">
            {/* 步驟影片 - 使用 Vimeo Player */}
            <div className="mb-4">
              <div className="block mb-2 text-sm font-medium">步驟影片</div>
              <div className="relative aspect-video bg-gray-200 rounded overflow-hidden mb-2">
                {step.vimeoId ? (
                  <Video
                    videoId={step.vimeoId}
                    startTime={timeToSeconds(step.startTime)}
                    endTime={timeToSeconds(step.endTime)}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* 步驟描述 - 只讀 */}
            <div className="mb-4">
              <div className="block mb-2 text-sm font-medium">步驟描述</div>
              <div className="p-3 bg-gray-50 rounded border min-h-[100px]">
                {step.description}
              </div>
            </div>

            {/* 影片時間點 - 只讀 */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <div className="block mb-1 text-sm font-medium">開始時間</div>
                <div className="p-2 bg-gray-50 rounded border">
                  {step.startTime}
                </div>
              </div>
              <div>
                <div className="block mb-1 text-sm font-medium">結束時間</div>
                <div className="p-2 bg-gray-50 rounded border">
                  {step.endTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
