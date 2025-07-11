import type React from 'react';
import { Trash, Play, Pause, Edit } from 'lucide-react';
import { useState } from 'react';
import { VimeoPlayer, timeToSeconds } from '@/components/common/VimeoPlayer';
import { COMMON_TEXTS } from '@/lib/constants/messages';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { Step } from '@/types/recipe';
// 導入 CVA 樣式系統
import {
  draftSectionVariants,
  draftLabelVariants,
  draftButtonVariants,
  stepAccordionVariants,
  videoContainerVariants,
  draftFieldVariants,
} from './styles';

type CookingStepProps = {
  steps: Step[];
  onRemoveStep: (index: number) => void;
  onNavigateToVideoEdit: () => void;
};

/**
 * 料理步驟元件 - 顯示烹飪過程的步驟列表及相關影片
 * 純視覺組件，不包含導航邏輯
 * 使用 CVA 樣式系統統一管理手風琴和影片容器樣式
 */
export const CookingStep = ({
  steps,
  onRemoveStep,
  onNavigateToVideoEdit,
}: CookingStepProps) => {
  // 設定初始展開的步驟值（只有步驟1展開）
  const defaultValue = ['step-0'];
  // 追踪每個步驟的播放狀態
  const [playingSteps, setPlayingSteps] = useState<Record<string, boolean>>({});

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
   * 處理導航到影片編輯頁面
   */
  const atHandleNavigateToVideoEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNavigateToVideoEdit();
  };

  /**
   * 渲染步驟影片區塊 - 使用 CVA 影片容器樣式
   */
  const renderStepVideo = (step: Step, index: number) => {
    const stepId = step.id || `step-${index}`;
    const isPlaying = playingSteps[stepId] || false;

    return (
      <div className={draftSectionVariants({ spacing: 'default' })}>
        <div
          className={draftLabelVariants({
            size: 'sm',
            display: 'block',
            spacing: 'default',
          })}
        >
          步驟影片
        </div>
        <div
          className={videoContainerVariants({
            aspect: 'video',
            background: 'default',
            spacing: 'default',
            state: step.vimeoId ? 'default' : 'loading',
          })}
        >
          {step.vimeoId ? (
            <VimeoPlayer
              videoId={step.vimeoId}
              startTime={timeToSeconds(
                typeof step.startTime === 'string' ? step.startTime : '0:00',
              )}
              endTime={timeToSeconds(
                typeof step.endTime === 'string' ? step.endTime : '0:00',
              )}
              responsive
              muted
              loop
              isPlaying={isPlaying}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p
                className={`${draftLabelVariants({
                  size: 'sm',
                  weight: 'normal',
                  spacing: 'none',
                })} text-neutral-500`}
              >
                影片上傳中 ... 請稍後
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * 渲染步驟資訊區塊 - 使用 CVA 區塊和欄位樣式
   */
  const renderStepInfo = (step: Step, index: number) => {
    const stepId = step.id ? String(step.id) : `step-${index}`;
    const isPlaying = playingSteps[stepId] || false;

    return (
      <>
        {/* 步驟描述與播放按鈕 - 使用 CVA 區塊樣式 */}
        <div className={draftSectionVariants({ spacing: 'default' })}>
          <div
            className={draftSectionVariants({
              layout: 'flexBetween',
              spacing: 'default',
            })}
          >
            <div className={draftLabelVariants({ size: 'sm' })}>步驟描述</div>
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
          <div className={draftFieldVariants({ type: 'description' })}>
            {step.description}
          </div>
        </div>

        {/* 影片時間點 - 只讀，使用 CVA 網格和欄位樣式 */}
        <div
          className={draftSectionVariants({
            layout: 'grid',
            spacing: 'sm',
          })}
        >
          <div>
            <div
              className={draftLabelVariants({
                size: 'sm',
                display: 'block',
                spacing: 'tight',
              })}
            >
              開始時間
            </div>
            <div className={draftFieldVariants({ type: 'readonly' })}>
              {step.startTime}
            </div>
          </div>
          <div>
            <div
              className={draftLabelVariants({
                size: 'sm',
                display: 'block',
                spacing: 'tight',
              })}
            >
              結束時間
            </div>
            <div className={draftFieldVariants({ type: 'readonly' })}>
              {step.endTime}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={draftSectionVariants({ spacing: 'default' })}>
      <div
        className={draftSectionVariants({
          layout: 'flexBetween',
          spacing: 'default',
        })}
      >
        <h2 className={draftLabelVariants({ size: 'default' })}>料理步驟</h2>
        <button
          type="button"
          className={draftButtonVariants({ size: 'icon' })}
          aria-label="修改步驟"
          onClick={atHandleNavigateToVideoEdit}
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={defaultValue}
        className={stepAccordionVariants()}
      >
        {steps.map((step, index) => (
          <AccordionItem
            key={
              step.id || `step-${step.description}-${step.startTime}-${index}`
            }
            value={`step-${index}`}
            className={stepAccordionVariants({ item: 'default' })}
          >
            <div className={stepAccordionVariants({ grid: 'default' })}>
              <AccordionTrigger
                className={stepAccordionVariants({ trigger: 'default' })}
              >
                <h3
                  className={draftLabelVariants({
                    weight: 'medium',
                    position: 'left',
                    spacing: 'none',
                  })}
                >
                  步驟 {index + 1}
                </h3>
              </AccordionTrigger>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveStep(index);
                }}
                className={draftButtonVariants({ variant: 'edit' })}
                aria-label={`${COMMON_TEXTS.DELETE}步驟 ${index + 1}`}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
            <AccordionContent
              className={stepAccordionVariants({ content: 'default' })}
            >
              {renderStepVideo(step, index)}
              {renderStepInfo(step, index)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
