import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { VimeoPlayer } from '@/components/ui/VimeoPlayer';
import {
  ArrowLeft,
  Play,
  ArrowLeft as StepPrevious,
  ArrowRight as StepNext,
  ListOrdered,
} from 'lucide-react';

/**
 * 食譜視頻頁面的 Props 介面
 */

/**
 * 步驟介面
 */
interface Step {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
}

/**
 * 食譜視頻頁面組件
 */
export default function RecipeVideoPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(2); // 從第三步開始，索引為2
  const [showStepsList, setShowStepsList] = useState<boolean>(false);

  // 模擬步驟數據 - 實際應用中應從 API 獲取
  const steps: Step[] = [
    {
      id: 1,
      title: '準備食材',
      description: '準備所有需要的食材和調味料',
      startTime: 0,
      endTime: 30,
    },
    {
      id: 2,
      title: '清洗食材',
      description: '將所有食材徹底清洗乾淨',
      startTime: 30,
      endTime: 60,
    },
    {
      id: 3,
      title: '醃製肉類',
      description: '將五花肉切 3~4 公分冷水下鍋氽燙去除血水與雜質',
      startTime: 60,
      endTime: 90,
    },
    {
      id: 4,
      title: '烹飪步驟 1',
      description: '開始烹飪主菜',
      startTime: 90,
      endTime: 120,
    },
    {
      id: 5,
      title: '烹飪步驟 2',
      description: '繼續烹飪，注意火候',
      startTime: 120,
      endTime: 150,
    },
    {
      id: 6,
      title: '完成',
      description: '裝盤並準備上菜',
      startTime: 150,
      endTime: 180,
    },
  ];

  // Vimeo 視頻 ID - 實際應用中應從 API 獲取
  const videoId = '115189988'; // 示例 ID

  /**
   * 處理時間更新
   */
  const atTimeUpdate = (time: number) => {
    setCurrentTime(time);

    // 查找當前步驟
    const stepIndex = steps.findIndex(
      (step) => time >= step.startTime && time < step.endTime,
    );

    if (stepIndex !== -1 && stepIndex !== currentStepIndex) {
      setCurrentStepIndex(stepIndex);
    }
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
      // 如果有播放器引用，則跳轉到下一步驟的起始時間
      setCurrentTime(nextStep.startTime);
    }
  };

  /**
   * 前往上一步
   */
  const atPrevStep = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStepIndex(currentStepIndex - 1);
      // 如果有播放器引用，則跳轉到上一步驟的起始時間
      setCurrentTime(prevStep.startTime);
    }
  };

  /**
   * 切換播放狀態
   */
  const atTogglePlay = () => {
    setIsPlaying(!isPlaying);
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
          screenAPI.orientation.lock('landscape').catch((error: unknown) => {
            console.error('無法鎖定螢幕方向:', error);
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
                .catch((error: unknown) => {
                  console.error('無法鎖定螢幕方向:', error);
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
      } catch (error) {
        console.error('螢幕方向 API 不支援:', error);
        return undefined;
      }
    }

    return undefined;
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Head>
        <title>食譜視頻 | Anna Cook</title>
        <meta name="description" content="跟著視頻學習美味料理" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      {/* 視頻區域 */}
      <div className="relative flex h-full">
        {/* 視頻播放器 */}
        <div className="flex-1 relative">
          <VimeoPlayer
            videoId={videoId}
            responsive
            autoplay={false}
            muted={false}
            loop={false}
            isPlaying={isPlaying}
            startTime={steps[currentStepIndex]?.startTime || 0}
            endTime={steps[currentStepIndex]?.endTime || undefined}
            onTimeUpdate={atTimeUpdate}
            onDurationChange={atDurationChange}
            className="w-full h-full"
          />

          {/* 上方導航欄 */}
          <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent p-4 flex items-center z-10">
            <Link
              href="/recipe-page"
              className="flex items-center text-white hover:text-gray-300 transition"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              <span className="underline">回到食譜</span>
            </Link>
          </div>

          {/* 播放按鈕覆蓋層 */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
              onClick={atTogglePlay}
            >
              <Play
                className="w-24 h-24 text-white opacity-80 hover:opacity-100 transition"
                fill="white"
                strokeWidth={1}
              />
            </div>
          )}
        </div>

        {/* 右側步驟說明區域 */}
        <div className="w-[200px] bg-gray-800 text-white p-6 flex flex-col h-full overflow-auto">
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-xl font-bold mb-3">當前步驟</h1>
              <div className="text-4xl font-bold mb-4">
                {currentStepIndex + 1}/{steps.length}
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {steps[currentStepIndex]?.title}
              </h2>
              <p className="text-gray-300">
                {steps[currentStepIndex]?.description}
              </p>
            </div>

            {/* 其他步驟說明 */}
            {showStepsList && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">所有步驟</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-3 rounded cursor-pointer ${
                        index === currentStepIndex
                          ? 'bg-gray-700'
                          : 'bg-gray-900 hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        setCurrentStepIndex(index);
                        setCurrentTime(step.startTime);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">步驟 {index + 1}</span>
                        {index === currentStepIndex && (
                          <span className="text-green-400 text-sm">當前</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 truncate">
                        {step.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部導航控制區域 */}
          <div className="mt-auto pt-4">
            <button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center mb-4"
              onClick={() => setShowStepsList(!showStepsList)}
            >
              <ListOrdered className="w-5 h-5 mr-2" />
              {showStepsList ? '隱藏步驟列表' : '顯示步驟列表'}
            </button>

            <div className="flex justify-between">
              <button
                className="flex-1 bg-gray-900 hover:bg-gray-700 text-white p-3 rounded-l-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={atPrevStep}
                disabled={currentStepIndex === 0}
              >
                <StepPrevious className="w-5 h-5 mr-1" />
                上一步
              </button>
              <button
                className="flex-1 bg-gray-900 hover:bg-gray-700 text-white p-3 rounded-r-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={atNextStep}
                disabled={currentStepIndex === steps.length - 1}
              >
                下一步
                <StepNext className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
