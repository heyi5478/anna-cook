import type React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Plus,
  RotateCcw,
  Trash2,
  Check,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  VimeoPlayer,
  formatTime as formatTimeHMS,
  formatSeconds as formatSec,
} from '@/components/ui/VimeoPlayer';
import { fetchRecipeDraft } from '@/services/api';
import { RecipeDraftStep } from '@/types/api';
import { useRouter } from 'next/router';

/**
 * 步驟資料型別
 * @property {number} id - 步驟唯一識別碼
 * @property {number} startTime - 步驟在影片中的開始時間（秒）
 * @property {number} endTime - 步驟在影片中的結束時間（秒）
 * @property {string} description - 步驟的說明文字
 */
type Step = {
  id: number;
  startTime: number;
  endTime: number;
  description: string;
};

type VideoEditorProps = {
  videoId?: number | string;
  totalDuration?: number;
  recipeId?: number;
};

// 初始範例步驟資料 (作為備用)
const DEFAULT_STEPS: Step[] = [
  {
    id: 1,
    startTime: 0.12,
    endTime: 0.3,
    description: '步驟一：加入花生醬燒煮，醬汁香濃醇厚',
  },
  {
    id: 2,
    startTime: 10,
    endTime: 20,
    description: '步驟二：混合調味料，增添風味',
  },
  {
    id: 3,
    startTime: 23,
    endTime: 30,
    description: '步驟三：完成料理，裝盤即可享用',
  },
];

/**
 * 轉換 API 回傳的步驟資料為元件使用的格式
 */
const convertApiStepsToComponentSteps = (
  apiSteps: RecipeDraftStep[],
): Step[] => {
  return apiSteps.map((step) => ({
    id: step.stepId,
    startTime: step.videoStart,
    endTime: step.videoEnd,
    description: step.stepDescription,
  }));
};

/**
 * 時間標記按鈕元件
 */
const TimeMarkButtons = ({
  onMarkStart,
  onMarkEnd,
  onResetAll,
  onDeleteStep,
}: {
  onMarkStart: () => void;
  onMarkEnd: () => void;
  onResetAll: () => void;
  onDeleteStep: () => void;
}) => (
  <>
    <div className="grid grid-cols-2 gap-4 px-4 py-2">
      <Button
        variant="outline"
        onClick={onMarkStart}
        className="border border-gray-300 rounded-md py-2"
      >
        標記起點
      </Button>
      <Button
        variant="outline"
        onClick={onMarkEnd}
        className="border border-gray-300 rounded-md py-2"
      >
        標記終點
      </Button>
    </div>

    <div className="px-4 py-2">
      <Button
        variant="outline"
        onClick={onResetAll}
        className="w-full border border-gray-300 rounded-md py-2 mb-2 flex items-center justify-center"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        全部步驟初始化
      </Button>
      <Button
        variant="outline"
        onClick={onDeleteStep}
        className="w-full bg-gray-200 text-gray-700 rounded-md py-2 flex items-center justify-center"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        刪除此步驟
      </Button>
    </div>
  </>
);

/**
 * 處理影片時間相關的 Hook
 */
function useVideoTime(initialDuration: number = 100) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(initialDuration);

  /**
   * 更新影片總時長
   */
  const updateDuration = useCallback((duration: number) => {
    setVideoDuration(duration || 100);
  }, []);

  /**
   * 更新當前影片播放時間
   */
  const updateCurrentTime = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return {
    currentTime,
    videoDuration,
    updateDuration,
    updateCurrentTime,
    formatTimeHMS,
  };
}

/**
 * 創建防抖動函數
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * 步驟管理 Hook
 */
function useStepManager(initialSteps: Step[] = DEFAULT_STEPS) {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [startTime, setStartTime] = useState<number>(
    initialSteps[0]?.startTime || 0,
  );
  const [endTime, setEndTime] = useState<number>(
    initialSteps[0]?.endTime || 10,
  );
  const [currentDescription, setCurrentDescription] = useState<string>(
    initialSteps[0]?.description || '請輸入步驟說明',
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isStepChanging, setIsStepChanging] = useState<boolean>(false);

  /**
   * 設置新的步驟資料
   */
  const setStepsData = useCallback((newSteps: Step[]) => {
    setSteps(newSteps);
    if (newSteps.length > 0) {
      setStartTime(newSteps[0].startTime);
      setEndTime(newSteps[0].endTime);
      setCurrentDescription(newSteps[0].description);
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
    const newStepId = Math.max(...steps.map((s) => s.id), 0) + 1;
    const newStep = {
      id: newStepId,
      startTime: 0,
      endTime: 10,
      description: `步驟 ${newStepId}：請輸入步驟說明`,
    };

    setSteps((prevSteps) => [...prevSteps, newStep]);
    // 自動切換到新添加的步驟，使用setTimeout確保在下一個渲染週期執行
    setTimeout(() => {
      setIsStepChanging(true); // 設置步驟切換狀態
      setCurrentStep(steps.length + 1);
    }, 10);
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
      setStartTime(steps[stepIndex].startTime);
      setEndTime(steps[stepIndex].endTime);
      setCurrentDescription(steps[stepIndex].description);
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

/**
 * 食譜影片編輯器元件，用於切割食譜影片並添加步驟說明
 */
const VideoEditor: React.FC<VideoEditorProps> = ({
  videoId = '',
  totalDuration = 0,
  recipeId,
}) => {
  const router = useRouter();
  const { recipeId: urlRecipeId } = router.query;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [actualVideoId, setActualVideoId] = useState<string | number>(videoId);

  const { currentTime, videoDuration, updateDuration, updateCurrentTime } =
    useVideoTime(totalDuration);

  const {
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
  } = useStepManager();

  /**
   * 從 API 獲取食譜草稿資料
   */
  useEffect(() => {
    const fetchRecipeData = async () => {
      setLoading(true);
      setError('');
      try {
        // 使用 URL 中的 recipeId 參數或 props 中的 recipeId
        const recipeIdValue = Number(urlRecipeId) || recipeId;

        console.log('取得食譜 ID:', recipeIdValue);

        if (!recipeIdValue) {
          setLoading(false);
          console.log('未提供食譜 ID，使用預設資料');
          return; // 如果沒有 ID，使用預設資料
        }

        console.log('開始從 API 獲取食譜草稿，ID:', recipeIdValue);
        const response = await fetchRecipeDraft(recipeIdValue);
        console.log('API 回應資料:', response);

        if (response.StatusCode !== 200) {
          throw new Error(response.msg || '獲取食譜草稿失敗');
        }

        // 設置影片 ID
        if (response.recipe.videoId) {
          // 從 URL 路徑中提取最後的數字部分作為 Vimeo ID
          const videoIdMatch = response.recipe.videoId.match(/\/([^/]+)$/);
          const extractedVideoId = videoIdMatch
            ? videoIdMatch[1]
            : response.recipe.videoId;
          console.log('提取的影片 ID:', extractedVideoId);
          setActualVideoId(extractedVideoId);
        } else {
          console.log('回應中沒有影片 ID，使用預設值:', videoId);
        }

        // 轉換步驟資料並設置
        if (response.steps && response.steps.length > 0) {
          console.log('API 回傳步驟數量:', response.steps.length);
          const convertedSteps = convertApiStepsToComponentSteps(
            response.steps,
          );
          console.log('轉換後的步驟資料:', convertedSteps);
          setStepsData(convertedSteps);
        } else {
          console.log('API 回傳步驟為空，使用預設步驟');
        }
      } catch (err) {
        console.error('獲取食譜草稿失敗:', err);
        setError(err instanceof Error ? err.message : '獲取食譜草稿時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [urlRecipeId, recipeId, setStepsData, videoId]);

  /**
   * 處理影片載入完成事件
   */
  const handleVideoLoaded = useCallback(() => {
    if (isStepChanging) {
      completeStepChange();
    }
  }, [isStepChanging, completeStepChange]);

  /**
   * 處理時間軸滑塊變化
   */
  const handleTimeRangeChange = useCallback(
    (values: number[]) => {
      if (!isDragging) {
        setIsPlaying(false); // 開始拖動時暫停影片
      }
      updateTimeRange(values);
    },
    [isDragging, updateTimeRange],
  );

  /**
   * 標記當前時間為步驟起點
   */
  const atMarkStart = useCallback(() => {
    updateStepById(currentStep, () => ({ startTime: currentTime }));
    setIsPlaying(false);
  }, [currentStep, currentTime, updateStepById]);

  /**
   * 標記當前時間為步驟終點
   */
  const atMarkEnd = useCallback(() => {
    updateStepById(currentStep, () => ({ endTime: currentTime }));
    setIsPlaying(false);
  }, [currentStep, currentTime, updateStepById]);

  /**
   * 切換影片播放/暫停狀態
   */
  const atTogglePlay = useCallback(() => {
    // 只有在非拖動狀態且非步驟切換狀態下才允許切換播放狀態
    if (!isDragging && !isStepChanging) {
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isDragging, isStepChanging]);

  /**
   * 處理步驟切換
   */
  const handleStepChange = useCallback(
    (direction: 'prev' | 'next') => {
      if (isPlaying) {
        setIsPlaying(false);
      }

      if (direction === 'prev') {
        goToPrevStep();
      } else {
        goToNextStep();
      }
    },
    [isPlaying, goToPrevStep, goToNextStep],
  );

  /**
   * 使用 useMemo 記憶化時間軸 Slider 元件
   */
  const timelineSlider = useMemo(
    () => (
      <div className="py-6">
        <Slider
          defaultValue={[startTime, endTime]}
          value={[startTime, endTime]}
          max={videoDuration}
          min={0}
          step={0.1}
          onValueChange={handleTimeRangeChange}
          onValueCommit={onSliderCommitted}
          className={`[&>span:first-child]:h-3 [&>span:first-child]:bg-gray-200 [&>span:first-child]:rounded-md [&>span:nth-child(2)]:bg-gray-400 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          thumbClassName="h-6 w-4 bg-white border-2 border-gray-400 rounded-sm shadow-md hover:border-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          disabled={false}
        />
      </div>
    ),
    [
      startTime,
      endTime,
      videoDuration,
      handleTimeRangeChange,
      onSliderCommitted,
      isDragging,
    ],
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">載入中...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-gray-50">
      {/* 麵包屑導航 */}
      <div className="flex items-center p-2 text-sm text-gray-600">
        <span>首頁</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>建立食譜</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>切割食譜影片</span>
      </div>
      {/* 影片預覽 */}
      <div className="bg-gray-100 aspect-video flex items-center justify-center my-2">
        <VimeoPlayer
          videoId={actualVideoId}
          width={400}
          startTime={isDragging || isStepChanging ? undefined : startTime}
          endTime={isDragging || isStepChanging ? undefined : endTime}
          onTimeUpdate={updateCurrentTime}
          onDurationChange={updateDuration}
          isPlaying={isPlaying}
          onLoaded={handleVideoLoaded}
          loop
        />
      </div>

      {/* 當前時間和總長度 */}
      <div className="flex justify-between px-4 py-2 text-sm">
        <div>當前: {formatSec(currentTime)}</div>
        <div>總長: {formatSec(videoDuration)}</div>
      </div>

      {/* 步驟導航 */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={() => handleStepChange('prev')}
          className="p-2 text-gray-600"
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-sm">
          步驟 {currentStep}/{steps.length}
        </div>
        <button
          onClick={() => handleStepChange('next')}
          className="p-2 text-gray-600"
          disabled={currentStep === steps.length}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={atTogglePlay}
          className={`p-2 ${isDragging || isStepChanging ? 'text-gray-400' : 'text-gray-600'}`}
          disabled={isDragging || isStepChanging}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
        <button onClick={addStep} className="p-2 text-gray-600">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* 時間軸 */}
      <div className="px-4 py-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0:00</span>
          <span>{formatTimeHMS(videoDuration)}</span>
        </div>
        {timelineSlider}
      </div>

      {/* 起點和終點 */}
      <div className="flex justify-between px-4 py-2 text-sm">
        <div>起點: {formatSec(startTime)}</div>
        <div>終點: {formatSec(endTime)}</div>
      </div>

      {/* 標記按鈕 */}
      <TimeMarkButtons
        onMarkStart={atMarkStart}
        onMarkEnd={atMarkEnd}
        onResetAll={resetAllSteps}
        onDeleteStep={deleteCurrentStep}
      />

      {/* 說明文字 */}
      <div className="px-4 py-2">
        <div className="text-sm mb-2">步驟 {currentStep} 說明文字</div>
        <textarea
          value={currentDescription}
          onChange={updateDescription}
          className="w-full bg-gray-100 p-3 rounded-md text-sm min-h-[100px] border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none"
          placeholder="請輸入此步驟的說明文字..."
        />
      </div>

      {/* 完成按鈕 */}
      <div className="px-4 py-2">
        <Button
          variant="default"
          className="w-full bg-gray-500 text-white rounded-md py-2 flex items-center justify-center"
        >
          <Check className="h-4 w-4 mr-2" />
          完成草稿
        </Button>
      </div>
    </div>
  );
};

export default VideoEditor;
