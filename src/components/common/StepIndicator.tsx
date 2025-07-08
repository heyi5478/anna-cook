import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// 步驟指示器容器樣式變體
const stepIndicatorContainerVariants = cva('', {
  variants: {
    spacing: {
      compact: 'mb-6',
      default: 'mb-10',
      relaxed: 'mb-14',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

// 步驟圓圈樣式變體
const stepCircleVariants = cva(
  'rounded-full flex items-center justify-center z-10 font-medium',
  {
    variants: {
      state: {
        completed: 'bg-gray-700 text-white',
        current: 'bg-gray-700 text-white',
        pending: 'bg-gray-200 text-neutral-500',
      },
      size: {
        sm: 'w-6 h-6 text-xs',
        default: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
      },
    },
    defaultVariants: {
      state: 'pending',
      size: 'default',
    },
  },
);

// 連接線樣式變體
const stepLineVariants = cva('absolute bg-gray-200', {
  variants: {
    size: {
      sm: 'left-3 right-3 top-3 h-0.5',
      default: 'left-4 right-4 top-4 h-0.5',
      lg: 'left-5 right-5 top-5 h-0.5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

// 步驟標籤樣式變體
const stepLabelVariants = cva('font-medium text-center', {
  variants: {
    size: {
      sm: 'mt-1 text-xs',
      default: 'mt-2 text-sm',
      lg: 'mt-3 text-base',
    },
    spacing: {
      compact: 'max-w-12',
      default: 'max-w-16',
      relaxed: 'max-w-20',
    },
  },
  defaultVariants: {
    size: 'default',
    spacing: 'default',
  },
});

/**
 * 步驟指示器元件屬性
 */
type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
  className?: string;
} & VariantProps<typeof stepIndicatorContainerVariants> &
  Pick<VariantProps<typeof stepCircleVariants>, 'size'> &
  Pick<VariantProps<typeof stepLabelVariants>, 'spacing'>;

/**
 * 通用步驟指示器元件 - 用於顯示多步驟流程的進度狀態
 */
export default function StepIndicator({
  currentStep,
  totalSteps = 3,
  labels = Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`),
  className,
  spacing = 'default',
  size = 'default',
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  // 根據當前步驟確定每個步驟的狀態
  const getStepState = (step: number): 'completed' | 'current' | 'pending' => {
    if (currentStep > step) return 'completed';
    if (currentStep === step) return 'current';
    return 'pending';
  };

  return (
    <div className={cn(stepIndicatorContainerVariants({ spacing }), className)}>
      <div className="relative flex items-center justify-between">
        <div className={stepLineVariants({ size })} />

        {steps.map((step) => (
          <div key={step} className="relative flex flex-col items-center">
            <div
              className={stepCircleVariants({
                state: getStepState(step),
                size,
              })}
            >
              {step}
            </div>
            <span className={stepLabelVariants({ size, spacing })}>
              {labels[step - 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
