import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ListOrdered, StepBack, StepForward, ChevronsLeft } from 'lucide-react';
import { cva } from 'class-variance-authority';

// 面板容器樣式變體
const stepPanelVariants = cva('flex flex-col h-full overflow-auto relative', {
  variants: {
    state: {
      expanded: 'w-[200px] bg-gray-800 text-white p-6',
      collapsed: 'w-0 h-0 opacity-0 pointer-events-none',
    },
  },
  defaultVariants: {
    state: 'expanded',
  },
});

// 按鈕樣式變體
const stepButtonVariants = cva(
  'flex items-center justify-center rounded-lg transition-colors',
  {
    variants: {
      variant: {
        navigation:
          'bg-gray-900 hover:bg-gray-700 text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed',
        navigationAlt:
          'bg-neutral-900 hover:bg-neutral-700 text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed',
        stepList: 'w-full bg-neutral-700 hover:bg-neutral-600 text-white p-3',
        panelToggle:
          'bg-gray-700 hover:bg-gray-600 text-white p-1.5 absolute top-2 left-2 z-10',
      },
    },
    defaultVariants: {
      variant: 'navigation',
    },
  },
);

// 步驟項目樣式變體
const stepItemVariants = cva(
  'p-4 rounded-lg cursor-pointer flex flex-col justify-center items-center border border-gray-700 transition',
  {
    variants: {
      state: {
        current: 'bg-orange-500 text-white',
        normal: 'bg-white text-neutral-800 hover:bg-neutral-100',
      },
    },
    defaultVariants: {
      state: 'normal',
    },
  },
);

// 收起狀態按鈕樣式變體
const collapsedButtonVariants = cva(
  'absolute right-0 top-2 bg-gray-800 text-white p-1.5 rounded-l-lg z-20',
);

type Step = {
  id: number;
  description: string;
  stepOrder: number;
  startTime: number;
  endTime: number;
};

type StepPanelProps = {
  currentStep: Step;
  currentStepIndex: number;
  steps: Step[];
  showRightPanel: boolean;
  dialogOpen: boolean;
  onTogglePanel: () => void;
  onToggleDialog: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSelectStep: (index: number) => void;
};

/**
 * 格式化時間為 mm:ss 格式
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 步驟面板元件
 */
export const StepPanel = ({
  currentStep,
  currentStepIndex,
  steps,
  showRightPanel,
  dialogOpen,
  onTogglePanel,
  onToggleDialog,
  onPrevStep,
  onNextStep,
  onSelectStep,
}: StepPanelProps) => {
  if (!showRightPanel) {
    return (
      <button className={collapsedButtonVariants()} onClick={onTogglePanel}>
        <ChevronsLeft className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className={stepPanelVariants({ state: 'expanded' })}>
      {/* 面板內的收起按鈕 */}
      <button
        className={stepButtonVariants({ variant: 'panelToggle' })}
        onClick={onTogglePanel}
      >
        <ChevronsLeft className="w-4 h-4 rotate-180" />
      </button>

      <div className="flex-1 mt-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              className={stepButtonVariants({ variant: 'navigation' })}
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
            >
              <StepBack className="w-6 h-6" />
            </button>
            <div className="text-4xl font-bold">
              {currentStepIndex + 1}/{steps.length}
            </div>
            <button
              className={stepButtonVariants({ variant: 'navigationAlt' })}
              onClick={onNextStep}
              disabled={currentStepIndex === steps.length - 1}
            >
              <StepForward className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            步驟 {currentStep.stepOrder}
          </h2>
          <p className="text-neutral-300">{currentStep.description}</p>
          <div className="mt-4 text-sm text-neutral-400">
            時間段: {formatTime(currentStep.startTime)} -{' '}
            {formatTime(currentStep.endTime)}
          </div>
        </div>
      </div>

      {/* 底部導航控制區域 */}
      <div className="mt-auto pt-4">
        <Dialog open={dialogOpen} onOpenChange={onToggleDialog}>
          <DialogTrigger asChild>
            <button className={stepButtonVariants({ variant: 'stepList' })}>
              <ListOrdered className="w-5 h-5 mr-2" />
              步驟列表
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] bg-neutral-800 border-none text-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 p-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={stepItemVariants({
                    state: index === currentStepIndex ? 'current' : 'normal',
                  })}
                  onClick={() => onSelectStep(index)}
                >
                  <span className="text-lg font-semibold">
                    步驟{step.stepOrder}
                  </span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
