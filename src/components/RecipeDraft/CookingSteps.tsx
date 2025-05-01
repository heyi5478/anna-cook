import type React from 'react';

import { ImageIcon, Trash, Play, Pause, Edit } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { VimeoPlayer, timeToSeconds } from '@/components/ui/VimeoPlayer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

// 型別定義區塊
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

/**
 * 料理步驟元件 - 顯示烹飪過程的步驟列表及相關影片
 */
export const CookingStep = ({ steps, onRemoveStep }: CookingStepProps) => {
  // 設定初始展開的步驟值（只有步驟1展開）
  const defaultValue = ['step-0'];
  // 追踪每個步驟的播放狀態
  const [playingSteps, setPlayingSteps] = useState<Record<string, boolean>>({});
  // 使用路由器進行頁面導航
  const router = useRouter();

  /**
   * 導航到影片編輯頁面
   */
  const atNavigateToVideoEdit = (e: React.MouseEvent) => {
    // 阻止事件冒泡，防止觸發表單提交事件
    e.preventDefault();
    e.stopPropagation();

    // 保存當前的 recipeId，以便在影片編輯頁面使用
    const { recipeId } = router.query;

    // 如果有 recipeId，則帶著 recipeId 導航到影片編輯頁面
    if (recipeId) {
      router.push(`/recipe-draft-video?recipeId=${recipeId}`);
    } else {
      router.push('/recipe-draft-video');
    }
  };

  /**
   * 切換步驟影片的播放狀態
   */
  const atTogglePlay = (stepId: string, e: React.MouseEvent) => {
    // 阻止事件冒泡和默認行為，防止觸發表單提交
    e.preventDefault();
    e.stopPropagation();

    setPlayingSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  /**
   * 渲染步驟影片區塊
   */
  const renderStepVideo = (step: Step, index: number) => {
    const stepId = step.id || `step-${index}`;
    const isPlaying = playingSteps[stepId] || false;

    return (
      <div className="mb-4">
        <div className="block mb-2 text-sm font-medium">步驟影片</div>
        <div className="relative aspect-video bg-gray-200 rounded overflow-hidden mb-2">
          {step.vimeoId ? (
            <VimeoPlayer
              videoId={step.vimeoId}
              startTime={timeToSeconds(step.startTime)}
              endTime={timeToSeconds(step.endTime)}
              responsive
              muted
              loop
              isPlaying={isPlaying}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * 渲染步驟資訊區塊
   */
  const renderStepInfo = (step: Step, index: number) => {
    const stepId = step.id || `step-${index}`;
    const isPlaying = playingSteps[stepId] || false;

    return (
      <>
        {/* 步驟描述與播放按鈕 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">步驟描述</div>
            {step.vimeoId && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => atTogglePlay(stepId, e)}
                className="text-xs"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 mr-1" /> 暫停
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-1" /> 播放
                  </>
                )}
              </Button>
            )}
          </div>
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
            <div className="p-2 bg-gray-50 rounded border">{step.endTime}</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">料理步驟</h2>
        <button
          className="p-1"
          aria-label="修改步驟"
          onClick={atNavigateToVideoEdit}
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <Accordion type="multiple" defaultValue={defaultValue} className="w-full">
        {steps.map((step, index) => (
          <AccordionItem
            key={
              step.id || `step-${step.description}-${step.startTime}-${index}`
            }
            value={`step-${index}`}
            className="mb-2 border rounded"
          >
            <div className="grid grid-cols-[1fr_auto] items-center">
              <AccordionTrigger className="px-2 py-3 hover:no-underline">
                <h3 className="font-medium text-left">步驟 {index + 1}</h3>
              </AccordionTrigger>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveStep(index);
                }}
                className="mr-2 p-1 text-gray-500 z-10"
                aria-label={`刪除步驟 ${index + 1}`}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
            <AccordionContent className="p-4 pt-2 border-t">
              {renderStepVideo(step, index)}
              {renderStepInfo(step, index)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
