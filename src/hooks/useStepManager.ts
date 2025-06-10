import { useState, useEffect, useCallback } from 'react';
import type { Step } from '@/types/recipe';
import { debounce } from '@/lib/utils';
import {
  DEFAULT_RECIPE_STEPS,
  DEFAULT_TIME_VALUES,
  COMMON_TEXTS,
  DEBOUNCE_DELAYS,
} from '@/lib/constants';

/**
 * 步驟管理 Hook
 */
export function useStepManager(initialSteps: Step[] = DEFAULT_RECIPE_STEPS) {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [startTime, setStartTime] = useState<number>(() => {
    const firstStepTime = initialSteps[0]?.startTime;
    return typeof firstStepTime === 'number'
      ? firstStepTime
      : DEFAULT_TIME_VALUES.START_TIME;
  });
  const [endTime, setEndTime] = useState<number>(() => {
    const firstStepTime = initialSteps[0]?.endTime;
    return typeof firstStepTime === 'number'
      ? firstStepTime
      : DEFAULT_TIME_VALUES.END_TIME;
  });
  const [currentDescription, setCurrentDescription] = useState<string>(
    initialSteps[0]?.description || COMMON_TEXTS.PLACEHOLDER_STEP,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isStepChanging, setIsStepChanging] = useState<boolean>(false);

  /**
   * 設置新的步驟資料
   */
  const setStepsData = useCallback((newSteps: Step[]) => {
    setSteps(newSteps);
    if (newSteps.length > 0) {
      const firstStep = newSteps[0];
      const startTimeValue =
        typeof firstStep.startTime === 'number'
          ? firstStep.startTime
          : DEFAULT_TIME_VALUES.START_TIME;
      const endTimeValue =
        typeof firstStep.endTime === 'number'
          ? firstStep.endTime
          : DEFAULT_TIME_VALUES.END_TIME;

      setStartTime(startTimeValue);
      setEndTime(endTimeValue);
      setCurrentDescription(firstStep.description);
      setCurrentStep(1);
    }
  }, []);

  /**
   * 根據步驟 ID 更新步驟資料
   */
  const updateStepById = useCallback(
    (stepIndex: number, updateFn: (step: Step) => Partial<Step>) => {
      if (stepIndex < 1 || stepIndex > steps.length) return;

      const stepId = steps[stepIndex - 1]?.id;
      if (stepId === undefined) return;

      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId ? { ...step, ...updateFn(step) } : step,
        ),
      );
    },
    [steps],
  );

  /**
   * 前往下一個步驟
   */
  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setIsStepChanging(true);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  /**
   * 前往上一個步驟
   */
  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setIsStepChanging(true);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  /**
   * 添加新的步驟
   */
  const addStep = useCallback(() => {
    const stepIds = steps
      .map((s) => {
        const { id } = s;
        if (typeof id === 'number') {
          return id;
        }
        if (typeof id === 'string') {
          return parseInt(id, 10);
        }
        return 0;
      })
      .filter((id) => !Number.isNaN(id));

    const maxId = stepIds.length > 0 ? Math.max(...stepIds) : 0;
    const newStepId = maxId + 1;

    const newStep: Step = {
      id: newStepId,
      startTime: DEFAULT_TIME_VALUES.START_TIME,
      endTime: DEFAULT_TIME_VALUES.END_TIME,
      description: `步驟 ${newStepId}：${COMMON_TEXTS.PLACEHOLDER_STEP}`,
    };

    setSteps((prevSteps) => [...prevSteps, newStep]);
    // 自動切換到新添加的步驟，使用setTimeout確保在下一個渲染週期執行
    setTimeout(() => {
      setIsStepChanging(true); // 設置步驟切換狀態
      setCurrentStep(steps.length + 1);
    }, DEBOUNCE_DELAYS.STEP_CHANGE);
  }, [steps]);

  /**
   * 刪除當前步驟
   */
  const deleteCurrentStep = useCallback(() => {
    if (steps.length > 1) {
      const currentStepId = steps[currentStep - 1]?.id;
      if (currentStepId) {
        // 先將狀態設為切換中，避免UI閃爍
        setIsStepChanging(true);

        // 移除當前步驟
        const newSteps = steps.filter((step) => step.id !== currentStepId);
        setSteps(newSteps);

        // 計算新的當前步驟索引
        const newCurrentStep =
          currentStep > newSteps.length ? newSteps.length : currentStep;

        // 在短暫延遲後設置新的當前步驟，確保UI平滑過渡
        setTimeout(() => {
          setCurrentStep(newCurrentStep);
          // 在下一個渲染週期完成步驟切換
          setTimeout(() => {
            setIsStepChanging(false);
          }, 50);
        }, 10);
      }
    }
  }, [currentStep, steps]);

  /**
   * 重置所有步驟的時間範圍
   */
  const resetAllSteps = useCallback(() => {
    // 重置所有步驟的時間範圍
    setSteps((prevSteps) =>
      prevSteps.map((step, index) => ({
        ...step,
        startTime: index * 5, // 每個步驟間隔 5 秒
        endTime: index * 5 + 5, // 每個步驟長度為 5 秒
      })),
    );

    // 更新當前步驟的時間
    if (steps.length > 0 && currentStep <= steps.length) {
      const currentStepIndex = currentStep - 1;
      setStartTime(currentStepIndex * 5);
      setEndTime(currentStepIndex * 5 + 5);
    }
  }, [currentStep, steps]);

  /**
   * 更新步驟說明文字
   */
  const updateDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newDescription = e.target.value;
      setCurrentDescription(newDescription);
      updateStepById(currentStep, () => ({ description: newDescription }));
    },
    [currentStep, updateStepById],
  );

  /**
   * 更新時間範圍滑桿值
   */
  const updateTimeRange = useCallback((values: number[]) => {
    if (values.length === 2) {
      const [newStartTime, newEndTime] = values;
      setIsDragging(true);
      setStartTime(newStartTime);
      setEndTime(newEndTime);
    }
  }, []);

  /**
   * 當滑動結束時，更新步驟資料
   */
  const onSliderCommitted = useCallback(
    debounce((values: number[]) => {
      if (values.length === 2) {
        const [newStartTime, newEndTime] = values;
        updateStepById(currentStep, () => ({
          startTime: newStartTime,
          endTime: newEndTime,
        }));
        setIsDragging(false);
      }
    }, 300),
    [currentStep, updateStepById],
  );

  /**
   * 完成步驟切換
   */
  const completeStepChange = useCallback(() => {
    setIsStepChanging(false);
  }, []);

  /**
   * 當前步驟變更時更新起始和結束時間以及描述
   */
  useEffect(() => {
    const stepIndex = currentStep - 1;
    if (steps[stepIndex]) {
      const step = steps[stepIndex];
      const startTimeValue =
        typeof step.startTime === 'number'
          ? step.startTime
          : DEFAULT_TIME_VALUES.START_TIME;
      const endTimeValue =
        typeof step.endTime === 'number'
          ? step.endTime
          : DEFAULT_TIME_VALUES.END_TIME;

      setStartTime(startTimeValue);
      setEndTime(endTimeValue);
      setCurrentDescription(step.description);
    }
  }, [currentStep, steps]);

  return {
    steps,
    currentStep,
    startTime,
    endTime,
    currentDescription,
    isDragging,
    isStepChanging,
    setStepsData,
    updateStepById,
    goToNextStep,
    goToPrevStep,
    addStep,
    deleteCurrentStep,
    resetAllSteps,
    updateDescription,
    updateTimeRange,
    onSliderCommitted,
    completeStepChange,
  };
}
