import { RecipeDraftStep } from '@/types/api';
import type { Step } from '@/types/recipe';

/**
 * 轉換 API 回傳的步驟資料為元件使用的格式
 */
export const convertApiStepsToComponentSteps = (
  apiSteps: RecipeDraftStep[],
): Step[] => {
  return apiSteps.map((step) => ({
    id: step.stepId,
    startTime: step.videoStart,
    endTime: step.videoEnd,
    description: step.stepDescription,
  }));
};
