import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AlertCircle } from 'lucide-react';
import { useRecipeVideoStore } from '@/stores/video/useRecipeVideoStore';
import { useRecipeTeaching } from '@/hooks/useRecipeTeaching';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { VideoPlayer } from '@/components/features/VideoPlayer';
import { StepPanel } from '@/components/features/StepPanel';
import { NavigationBar } from '@/components/features/NavigationBar';

/**
 * 食譜視頻頁面組件
 */
export default function RecipeVideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const recipeId = typeof id === 'string' ? parseInt(id, 10) : undefined;

  // 使用 Zustand store 管理狀態
  const {
    currentTime,
    isPlaying,
    currentStepIndex,
    showRightPanel,
    dialogOpen,
    setCurrentTime,
    setDuration,
    setCurrentStepIndex,
    togglePlay,
    toggleRightPanel,
    toggleDialog,
    nextStep,
    prevStep,
    reset,
  } = useRecipeVideoStore();

  // 使用自定義 hooks
  const { teachingData, steps, videoId, loading, error } =
    useRecipeTeaching(recipeId);
  useScreenOrientation();

  // 重置狀態當組件卸載時
  useEffect(() => {
    return () => reset();
  }, [reset]);

  /**
   * 處理步驟選擇
   */
  const atSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    setCurrentTime(steps[index].startTime);
    toggleDialog();

    if (!isPlaying) {
      togglePlay();
    }
  };

  /**
   * 處理下一步
   */
  const atNextStep = () => {
    nextStep(steps.length);
    if (currentStepIndex < steps.length - 1) {
      setCurrentTime(steps[currentStepIndex + 1].startTime);
    }
  };

  /**
   * 處理上一步
   */
  const atPrevStep = () => {
    prevStep();
    if (currentStepIndex > 0) {
      setCurrentTime(steps[currentStepIndex - 1].startTime);
    }
  };

  // 獲取當前步驟
  const currentStep = steps[currentStepIndex] || {
    id: 0,
    description: '',
    stepOrder: 0,
    startTime: 0,
    endTime: 0,
  };

  // 如果正在載入或沒有ID，顯示載入中狀態
  if (loading || !recipeId) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4" />
          <p>載入教學資訊中...</p>
        </div>
      </div>
    );
  }

  // 如果發生錯誤，顯示錯誤信息
  if (error || !teachingData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center p-6 bg-gray-800 rounded-lg max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-2">無法載入教學資訊</h2>
          <p className="mb-4">{error || '未知錯誤'}</p>
          <Link
            href={recipeId ? `/recipe-page/${recipeId}` : '/'}
            className="bg-white text-black px-4 py-2 rounded-md inline-block"
          >
            返回食譜頁面
          </Link>
        </div>
      </div>
    );
  }

  // 如果食譜沒有視頻，顯示提示
  if (!videoId) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center p-6 bg-gray-800 rounded-lg max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-bold mb-2">{teachingData.recipeName}</h2>
          <p className="mb-4">此食譜尚未上傳教學視頻</p>
          <Link
            href={`/recipe-page/${recipeId}`}
            className="bg-white text-black px-4 py-2 rounded-md inline-block"
          >
            返回食譜頁面
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
      relative w-full h-screen bg-black overflow-hidden
      mobile-portrait:transform mobile-portrait:rotate-90 mobile-portrait:origin-center
      mobile-portrait:[width:100vh] mobile-portrait:[height:100vw]
      mobile-portrait:fixed mobile-portrait:top-0 mobile-portrait:left-0
      mobile-portrait:z-50
    "
    >
      <Head>
        <title>{teachingData.recipeName} - 教學視頻 | Anna Cook</title>
        <meta
          name="description"
          content={`${teachingData.recipeName} 的製作教學`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      {/* 視頻區域 */}
      <div className="relative flex h-full mobile-portrait:w-full mobile-portrait:h-full mobile-portrait:transform-gpu">
        <NavigationBar recipeId={recipeId} currentTime={currentTime} />

        <VideoPlayer
          videoId={videoId}
          isPlaying={isPlaying}
          currentStep={currentStep}
          showRightPanel={showRightPanel}
          onTimeUpdate={setCurrentTime}
          onDurationChange={setDuration}
          onTogglePlay={togglePlay}
        />

        <StepPanel
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          steps={steps}
          showRightPanel={showRightPanel}
          dialogOpen={dialogOpen}
          onTogglePanel={toggleRightPanel}
          onToggleDialog={toggleDialog}
          onPrevStep={atPrevStep}
          onNextStep={atNextStep}
          onSelectStep={atSelectStep}
        />
      </div>
    </div>
  );
}
