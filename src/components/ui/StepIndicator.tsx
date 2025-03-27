import { cn } from '@/lib/utils';

/**
 * 步驟指示器元件屬性
 */
type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
  className?: string;
};

/**
 * 通用步驟指示器元件，用於顯示多步驟流程的進度
 */
export default function StepIndicator({
  currentStep,
  totalSteps = 3,
  labels = Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`),
  className,
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={cn('mb-10', className)}>
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200" />

        {steps.map((step) => (
          <div key={step} className="relative flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center z-10',
                currentStep >= step
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-500',
              )}
            >
              {step}
            </div>
            <span className="mt-2 text-sm font-medium">{labels[step - 1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
