import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from '@/hooks/use-toast';

// 型別
import type { VideoEditorProps, SubmitData, Tag } from '@/types/video-editor';
import type { Ingredient, Step } from '@/types/recipe';

// Hooks
import { useVideoTime } from '@/hooks/useVideoTime';
import { useStepManager } from '@/hooks/useStepManager';
import { useUserDisplayId } from '@/hooks/useUserDisplayId';

// 服務
import { fetchRecipeDraft, submitRecipeDraft } from '@/services/recipes';

// 工具函數
import { convertApiStepsToComponentSteps } from '@/lib/utils/data';
import { cn } from '@/lib/utils/ui';
import { formatSeconds as formatSec } from '@/components/common/VimeoPlayer';

// 子元件
import {
  SUCCESS_MESSAGES,
  COMMON_TEXTS,
  ERROR_MESSAGES,
} from '@/lib/constants/messages';
import {
  draftVideoEditorVariants,
  loadingStateVariants,
  errorStateVariants,
} from '@/styles/cva/recipe-draft-video';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { VideoPlayerSection } from './VideoPlayerSection';
import { StepNavigation } from './StepNavigation';
import { TimelineSlider } from './TimelineSlider';
import { TimeMarkButtons } from './TimeMarkButtons';
import { StepDescription } from './StepDescription';
import { SubmitButton } from './SubmitButton';

// 樣式系統

/**
 * 構建提交草稿的資料
 */
const buildSubmitData = (recipeData: any, steps: Step[]): SubmitData => {
  const { recipe, ingredients, tags } = recipeData;

  return {
    recipeName: recipe.recipeName,
    recipeIntro: recipe.description || '',
    cookingTime: recipe.cookingTime || 0,
    portion: recipe.portion || 0,
    ingredients: [
      // 食材列表 (非調味料)
      ...ingredients
        .filter((item: Ingredient) => !item.isFlavoring)
        .map((item: Ingredient) => ({
          name: item.ingredientName,
          amount: `${item.ingredientAmount || 0} ${item.ingredientUnit || ''}`,
          isFlavoring: false,
        })),
      // 調味料列表
      ...ingredients
        .filter((item: Ingredient) => item.isFlavoring)
        .map((item: Ingredient) => ({
          name: item.ingredientName,
          amount: `${item.ingredientAmount || 0} ${item.ingredientUnit || ''}`,
          isFlavoring: true,
        })),
    ],
    tags: tags.map((tag: Tag) => tag.tagName),
    steps: steps.map((step) => ({
      description: step.description,
      startTime: formatSec(
        typeof step.startTime === 'number' ? step.startTime : 0,
      ),
      endTime: formatSec(typeof step.endTime === 'number' ? step.endTime : 0),
    })),
  };
};

/**
 * 提交影片編輯結果
 */
const submitVideoEditorSteps = async (
  recipeId: number,
  submitData: SubmitData,
) => {
  return submitRecipeDraft(recipeId, submitData);
};

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
  const userDisplayId = useUserDisplayId();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [recipeData, setRecipeData] = useState<any>(null);

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
    // 獲取食譜草稿資料
    const fetchRecipeData = async () => {
      setLoading(true);
      setError('');
      try {
        // 使用 URL 中的 recipeId 參數或 props 中的 recipeId
        let recipeIdValue = 0;
        if (typeof urlRecipeId === 'string') {
          recipeIdValue = parseInt(urlRecipeId, 10);
        } else if (typeof recipeId === 'number') {
          recipeIdValue = recipeId;
        }

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
          throw new Error(
            response.msg || ERROR_MESSAGES.FETCH_RECIPE_DRAFT_FAILED,
          );
        }

        // 保存完整的食譜資料
        setRecipeData(response);

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
        setError(
          err instanceof Error
            ? err.message
            : ERROR_MESSAGES.LOAD_RECIPE_DRAFT_ERROR,
        );
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

      // 添加計時器，確保在步驟切換後重置 isStepChanging 狀態
      setTimeout(() => {
        completeStepChange();
      }, 500);
    },
    [isPlaying, goToPrevStep, goToNextStep, completeStepChange],
  );

  /**
   * 提交步驟編輯結果
   */
  const atSubmitSteps = async () => {
    try {
      let recipeIdValue = 0;
      if (typeof urlRecipeId === 'string') {
        recipeIdValue = parseInt(urlRecipeId, 10);
      } else if (typeof recipeId === 'number') {
        recipeIdValue = recipeId;
      }

      if (!recipeIdValue) {
        toast({
          title: '錯誤',
          description: '找不到食譜 ID，無法提交',
          variant: 'destructive',
        });
        return;
      }

      if (!recipeData) {
        toast({
          title: '錯誤',
          description: '食譜資料不完整，無法提交',
          variant: 'destructive',
        });
        return;
      }

      setSubmitting(true);

      // 構建提交資料
      const submitData = buildSubmitData(recipeData, steps);

      // 提交草稿
      const response = await submitVideoEditorSteps(recipeIdValue, submitData);

      if (response.StatusCode === 200) {
        toast({
          title: '成功',
          description: SUCCESS_MESSAGES.DRAFT_SUBMITTED,
        });

        // 導轉到食譜草稿頁面，帶上 recipeId 參數
        router.push(`/recipe-draft?recipeId=${recipeIdValue}`);
      } else {
        throw new Error(response.msg || ERROR_MESSAGES.SUBMIT_DRAFT_FAILED);
      }
    } catch (err) {
      console.error('提交步驟編輯結果失敗:', err);
      toast({
        title: '錯誤',
        description:
          err instanceof Error ? err.message : '提交草稿時發生未知錯誤',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 確定編輯器狀態
  let editorState: 'loading' | 'ready' | 'submitting' | 'error' = 'ready';
  if (loading) {
    editorState = 'loading';
  } else if (error) {
    editorState = 'error';
  } else if (submitting) {
    editorState = 'submitting';
  }

  if (loading) {
    return (
      <div className={cn(loadingStateVariants({ type: 'message' }))}>
        {COMMON_TEXTS.LOADING}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(errorStateVariants({ severity: 'error' }))}>
        {error}
      </div>
    );
  }

  return (
    <div className={cn(draftVideoEditorVariants({ state: editorState }))}>
      <BreadcrumbNavigation userDisplayId={userDisplayId} />

      <VideoPlayerSection
        actualVideoId={actualVideoId}
        startTime={isDragging || isStepChanging ? undefined : startTime}
        endTime={isDragging || isStepChanging ? undefined : endTime}
        onTimeUpdate={updateCurrentTime}
        onDurationChange={updateDuration}
        isPlaying={isPlaying}
        onLoaded={handleVideoLoaded}
        currentTime={currentTime}
        videoDuration={videoDuration}
        loading={loading}
        error={!!error}
      />

      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        isDragging={isDragging}
        isStepChanging={isStepChanging}
        onStepChange={handleStepChange}
        onTogglePlay={atTogglePlay}
        onAddStep={addStep}
        disabled={submitting}
      />

      <TimelineSlider
        startTime={startTime}
        endTime={endTime}
        videoDuration={videoDuration}
        isDragging={isDragging}
        onTimeRangeChange={handleTimeRangeChange}
        onSliderCommitted={onSliderCommitted}
        disabled={submitting}
      />

      <TimeMarkButtons
        onMarkStart={atMarkStart}
        onMarkEnd={atMarkEnd}
        onResetAll={resetAllSteps}
        onDeleteStep={deleteCurrentStep}
      />

      <StepDescription
        currentStep={currentStep}
        currentDescription={currentDescription}
        onUpdateDescription={updateDescription}
      />

      <SubmitButton onSubmit={atSubmitSteps} submitting={submitting} />
    </div>
  );
};

export default VideoEditor;
