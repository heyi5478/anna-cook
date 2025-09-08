import type React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/ui';
import {
  stepNavigationVariants,
  stepNavigationButtonVariants,
  stepIndicatorVariants,
} from '@/styles/cva/recipe-draft-video';

type StepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isDragging: boolean;
  isStepChanging: boolean;
  onStepChange: (direction: 'prev' | 'next') => void;
  onTogglePlay: () => void;
  onAddStep: () => void;
  disabled?: boolean;
};

/**
 * 步驟導航元件，提供步驟切換、播放控制和新增步驟功能
 */
export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  isDragging,
  isStepChanging,
  onStepChange,
  onTogglePlay,
  onAddStep,
  disabled = false,
}) => {
  // 確定導航容器狀態
  let navigationState: 'normal' | 'disabled' | 'transitioning' = 'normal';
  if (disabled) {
    navigationState = 'disabled';
  } else if (isStepChanging) {
    navigationState = 'transitioning';
  }

  // 確定各按鈕狀態
  const isPrevDisabled = disabled || currentStep === 1;
  const isNextDisabled = disabled || currentStep === totalSteps;
  const isPlayDisabled = disabled || isDragging || isStepChanging;

  const prevButtonState = isPrevDisabled ? 'disabled' : 'normal';
  const nextButtonState = isNextDisabled ? 'disabled' : 'normal';
  const playButtonState = isPlayDisabled ? 'restricted' : 'active';
  const addButtonState = disabled ? 'disabled' : 'normal';

  // 確定步驟指示器狀態
  const indicatorState = isStepChanging ? 'transitioning' : 'normal';

  return (
    <div className={cn(stepNavigationVariants({ state: navigationState }))}>
      {/* 上一步按鈕 */}
      <button
        onClick={() => onStepChange('prev')}
        className={cn(stepNavigationButtonVariants({ state: prevButtonState }))}
        disabled={isPrevDisabled}
        aria-label="上一步"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* 步驟指示器 */}
      <div className={cn(stepIndicatorVariants({ state: indicatorState }))}>
        步驟 {currentStep}/{totalSteps}
      </div>

      {/* 下一步按鈕 */}
      <button
        onClick={() => onStepChange('next')}
        className={cn(stepNavigationButtonVariants({ state: nextButtonState }))}
        disabled={isNextDisabled}
        aria-label="下一步"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* 播放/暫停按鈕 */}
      <button
        onClick={onTogglePlay}
        className={cn(stepNavigationButtonVariants({ state: playButtonState }))}
        disabled={isPlayDisabled}
        aria-label={isPlaying ? '暫停' : '播放'}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </button>

      {/* 新增步驟按鈕 */}
      <button
        onClick={onAddStep}
        className={cn(stepNavigationButtonVariants({ state: addButtonState }))}
        disabled={disabled}
        aria-label="新增步驟"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
};
