import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { VimeoPlayer } from '@/components/ui/VimeoPlayer';
import {
  ArrowLeft,
  Play,
  Pause,
  ListOrdered,
  StepBack,
  StepForward,
  ChevronsLeft,
  AlertCircle,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { fetchRecipeTeaching } from '@/services/api';
import { RecipeTeachingResponse } from '@/types/api';

/**
 * 食譜視頻頁面的 Props 介面
 */

/**
 * 步驟介面
 */
interface Step {
  id: number;
  description: string;
  stepOrder: number;
  startTime: number;
  endTime: number;
}

/**
 * 格式化時間為 mm:ss 格式
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 食譜視頻頁面組件
 */
export default function RecipeVideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const recipeId = typeof id === 'string' ? parseInt(id, 10) : undefined;

  const mountCountRef = useRef<number>(0);

  // 組件狀態
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // API 狀態
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [teachingData, setTeachingData] = useState<
    RecipeTeachingResponse['data'] | null
  >(null);
  const [videoId, setVideoId] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);

  // 獲取食譜教學資訊
  useEffect(() => {
    /**
     * 獲取教學資訊
     */
    const fetchTeachingData = async () => {
      if (!recipeId) return;

      try {
        setLoading(true);
        setApiError(null);

        const response = await fetchRecipeTeaching(recipeId);

        if (response.StatusCode === 200 && response.data) {
          setTeachingData(response.data);
          setSteps(response.data.steps);

          // 從視頻URL提取Vimeo視頻ID
          if (response.data.video) {
            const videoPath = response.data.video;
            // 假設視頻路徑格式為 "/videos/12345" 或包含完整Vimeo URL
            const videoIdMatch =
              videoPath.match(/\/(\d+)(?:\/|$)/) ||
              videoPath.match(/vimeo\.com\/(\d+)/);

            if (videoIdMatch && videoIdMatch[1]) {
              setVideoId(videoIdMatch[1]);
            } else {
              // 如果無法提取，使用完整路徑
              setVideoId(videoPath);
            }
          }
        } else {
          setApiError(response.msg || '無法加載教學資訊');
        }
      } catch (err) {
        console.error('獲取教學資訊失敗:', err);
        setApiError('無法加載教學資訊，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchTeachingData();
    }
  }, [recipeId]);

  // 移除組件掛載次數追蹤相關代碼
  useEffect(() => {
    mountCountRef.current += 1;

    return () => {
      // 清理
    };
  }, []);

  /**
   * 處理時間更新
   */
  const atTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  /**
   * 處理時長變更
   */
  const atDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  /**
   * 前往下一步
   */
  const atNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentTime(nextStep.startTime);

      // 確保開始播放
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  /**
   * 前往上一步
   */
  const atPrevStep = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentTime(prevStep.startTime);

      // 確保開始播放
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  /**
   * 切換播放狀態
   */
  const atTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  /**
   * 選擇特定步驟
   */
  const atSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    setCurrentTime(steps[index].startTime);
    setDialogOpen(false); // 關閉步驟選單對話框

    // 確保開始播放
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  /**
   * 強制手機橫屏顯示
   */
  useEffect(() => {
    // 檢查是否為移動裝置
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      try {
        // 使用 try-catch 處理可能不支援的 API
        // 嘗試強制橫向
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const screenAPI = window.screen as any;

        if ('orientation' in screenAPI && 'lock' in screenAPI.orientation) {
          screenAPI.orientation
            .lock('landscape')
            .catch((orientationError: unknown) => {
              console.error('無法鎖定螢幕方向:', orientationError);
            });
        }

        // 監聽方向變化，嘗試再次強制橫向
        const atOrientationChange = () => {
          if (
            'orientation' in screenAPI &&
            'type' in screenAPI.orientation &&
            screenAPI.orientation.type.includes('portrait')
          ) {
            if ('lock' in screenAPI.orientation) {
              screenAPI.orientation
                .lock('landscape')
                .catch((orientationError: unknown) => {
                  console.error('無法鎖定螢幕方向:', orientationError);
                });
            }
          }
        };

        window.addEventListener('orientationchange', atOrientationChange);

        return () => {
          window.removeEventListener('orientationchange', atOrientationChange);
          // 釋放方向鎖定
          if ('orientation' in screenAPI && 'unlock' in screenAPI.orientation) {
            screenAPI.orientation.unlock();
          }
        };
      } catch (screenError) {
        console.error('螢幕方向 API 不支援:', screenError);
        return undefined;
      }
    }

    return undefined;
  }, []);

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
  if (apiError || !teachingData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center p-6 bg-gray-800 rounded-lg max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-2">無法載入教學資訊</h2>
          <p className="mb-4">{apiError || '未知錯誤'}</p>
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
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
      <div className="relative flex h-full">
        {/* 視頻播放器 */}
        <div className={`relative ${showRightPanel ? 'flex-1' : 'w-full'}`}>
          <VimeoPlayer
            videoId={videoId}
            responsive
            muted={false}
            loop
            isPlaying={isPlaying}
            startTime={currentStep.startTime}
            endTime={currentStep.endTime}
            onTimeUpdate={atTimeUpdate}
            onDurationChange={atDurationChange}
            className="w-full h-full"
          />

          {/* 上方導航欄 */}
          <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent p-4 flex items-center z-20">
            <Link
              href={`/recipe-page/${recipeId}`}
              className="flex items-center text-white hover:text-gray-300 transition"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              <span className="underline">回到食譜</span>
            </Link>
            <div className="ml-auto text-white">
              {Math.floor(currentTime / 60)}:
              {(currentTime % 60).toFixed(0).padStart(2, '0')}
            </div>
          </div>

          {/* 播放控制覆蓋層 - 總是顯示，但圖標根據播放狀態變化 */}
          <div
            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
            onClick={atTogglePlay}
          >
            {isPlaying ? (
              <Pause
                className="w-24 h-24 text-white opacity-80 hover:opacity-100 transition"
                strokeWidth={1}
              />
            ) : (
              <Play
                className="w-24 h-24 text-white opacity-80 hover:opacity-100 transition"
                fill="white"
                strokeWidth={1}
              />
            )}
          </div>
        </div>

        {/* 當面板收起時的展開按鈕 */}
        {!showRightPanel && (
          <button
            className="absolute right-0 top-2 bg-gray-800 text-white p-1.5 rounded-l-lg z-20"
            onClick={() => setShowRightPanel(true)}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* 右側步驟說明區域 */}
        {showRightPanel && (
          <div className="w-[200px] bg-gray-800 text-white p-6 flex flex-col h-full overflow-auto relative">
            {/* 面板內的收起按鈕 */}
            <button
              className="absolute top-2 left-2 bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-lg z-10"
              onClick={() => setShowRightPanel(false)}
            >
              <ChevronsLeft className="w-4 h-4 rotate-180" />
            </button>

            <div className="flex-1 mt-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <button
                    className="bg-gray-900 hover:bg-gray-700 text-white p-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={atPrevStep}
                    disabled={currentStepIndex === 0}
                  >
                    <StepBack className="w-6 h-6" />
                  </button>
                  <div className="text-4xl font-bold">
                    {currentStepIndex + 1}/{steps.length}
                  </div>
                  <button
                    className="bg-gray-900 hover:bg-gray-700 text-white p-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={atNextStep}
                    disabled={currentStepIndex === steps.length - 1}
                  >
                    <StepForward className="w-6 h-6" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  步驟 {currentStep.stepOrder}
                </h2>
                <p className="text-gray-300">{currentStep.description}</p>
                <div className="mt-4 text-sm text-gray-400">
                  時間段: {formatTime(currentStep.startTime)} -{' '}
                  {formatTime(currentStep.endTime)}
                </div>
              </div>
            </div>

            {/* 底部導航控制區域 */}
            <div className="mt-auto pt-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center">
                    <ListOrdered className="w-5 h-5 mr-2" />
                    步驟列表
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] bg-gray-800 border-none text-white">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 p-2">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`p-4 rounded-lg cursor-pointer flex flex-col justify-center items-center border border-gray-700 transition ${
                          index === currentStepIndex
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-gray-800 hover:bg-gray-100'
                        }`}
                        onClick={() => atSelectStep(index)}
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
        )}
      </div>
    </div>
  );
}
