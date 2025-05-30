import { ChevronLeft, ChevronRight, Play, Pause, Plus } from 'lucide-react';

type StepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isDragging: boolean;
  isStepChanging: boolean;
  onStepChange: (direction: 'prev' | 'next') => void;
  onTogglePlay: () => void;
  onAddStep: () => void;
};

/**
 * 步驟導航元件
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
}) => (
  <div className="flex items-center justify-between px-4 py-2">
    <button
      onClick={() => onStepChange('prev')}
      className="p-2 text-gray-600"
      disabled={currentStep === 1}
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
    <div className="text-sm">
      步驟 {currentStep}/{totalSteps}
    </div>
    <button
      onClick={() => onStepChange('next')}
      className="p-2 text-gray-600"
      disabled={currentStep === totalSteps}
    >
      <ChevronRight className="h-5 w-5" />
    </button>
    <button
      onClick={onTogglePlay}
      className={`p-2 ${isDragging || isStepChanging ? 'text-gray-400' : 'text-gray-600'}`}
      disabled={isDragging || isStepChanging}
    >
      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
    </button>
    <button onClick={onAddStep} className="p-2 text-gray-600">
      <Plus className="h-5 w-5" />
    </button>
  </div>
);
