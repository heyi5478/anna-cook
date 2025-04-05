import type React from 'react';

import { ChevronDown, ImageIcon, Plus, Trash } from 'lucide-react';
import VimeoPlayer, { timeToSeconds } from '@/components/ui/VimeoPlayer';

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
  /**
   * 切換步驟展開/收合狀態
   */
  const atToggleStep = (index: number) => {
    const stepElement = document.getElementById(`step-${index}`);
    if (stepElement) {
      stepElement.classList.toggle('hidden');
    }
  };

  /**
   * 處理步驟刪除事件
   */
  const atHandleRemoveStep = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.stopPropagation();
    onRemoveStep(index);
  };

  /**
   * 渲染步驟影片區塊
   */
  const renderStepVideo = (step: Step) => {
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
  const renderStepInfo = (step: Step) => {
    return (
      <>
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
            <div className="p-2 bg-gray-50 rounded border">{step.endTime}</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mb-4">
      {/* 標題列 */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">料理步驟</h2>
        <button className="p-1" aria-label="新增步驟">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 步驟列表 */}
      {steps.map((step, index) => (
        <div
          key={step.id || `step-${step.description}-${step.startTime}-${index}`}
          className="mb-4"
        >
          {/* 步驟標題列 */}
          <div
            className="flex items-center justify-between p-2 bg-gray-100 rounded cursor-pointer"
            onClick={() => atToggleStep(index)}
          >
            <h3 className="font-medium">步驟 {index + 1}</h3>
            <div className="flex items-center">
              <ChevronDown className="w-4 h-4" />
              <button
                onClick={(e) => atHandleRemoveStep(e, index)}
                className="ml-2"
                aria-label={`刪除步驟 ${index + 1}`}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 步驟詳細內容 */}
          <div id={`step-${index}`} className="p-4 mt-2 border rounded">
            {renderStepVideo(step)}
            {renderStepInfo(step)}
          </div>
        </div>
      ))}
    </div>
  );
};
