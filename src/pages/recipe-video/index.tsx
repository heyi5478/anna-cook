import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { VimeoPlayer } from '@/components/ui/VimeoPlayer';
import {
  ArrowLeft,
  Play,
  Pause,
  ListOrdered,
  StepBack,
  StepForward,
  ChevronsLeft,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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
  console.log('RecipeVideoPage 重新渲染');
  const mountCountRef = useRef<number>(0);

  // 組件掛載次數追蹤
  useEffect(() => {
    mountCountRef.current += 1;
    console.log(`RecipeVideoPage 已掛載 ${mountCountRef.current} 次`);

    return () => {
      console.log('RecipeVideoPage 準備卸載');
    };
  }, []);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(2); // 從第三步開始，索引為2
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const prevPlayingStateRef = useRef<boolean>(false);

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
    console.log(`時間更新: ${time.toFixed(2)}秒`);
    setCurrentTime(time);

    // 查找當前步驟
    const stepIndex = steps.findIndex(
      (step) => time >= step.startTime && time < step.endTime,
    );

    if (stepIndex !== -1 && stepIndex !== currentStepIndex) {
      console.log(
        `步驟變更: 從步驟 ${currentStepIndex + 1} 到步驟 ${stepIndex + 1}`,
      );
      setCurrentStepIndex(stepIndex);
    }
  };

  /**
   * 處理時長變更
   */
  const atDurationChange = (newDuration: number) => {
    console.log(`視頻時長: ${newDuration.toFixed(2)}秒`);
    setDuration(newDuration);
  };

  /**
   * 前往下一步
   */
  const atNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setCurrentStepIndex(currentStepIndex + 1);
      // 明確設置新的時間
      console.log(`跳轉到下一步驟的開始時間: ${nextStep.startTime}秒`);
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
      // 明確設置新的時間
      console.log(`跳轉到上一步驟的開始時間: ${prevStep.startTime}秒`);
      setCurrentTime(prevStep.startTime);
    }
  };

  /**
   * 切換播放狀態
   */
  const atTogglePlay = () => {
    console.log(`切換播放狀態: ${!isPlaying ? '播放' : '暫停'}`);
    setIsPlaying(!isPlaying);
  };

  /**
   * 選擇特定步驟
   */
  const atSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    console.log(
      `跳轉到選擇的步驟 ${index + 1} 的開始時間: ${steps[index].startTime}秒`,
    );
    setCurrentTime(steps[index].startTime);
    setDialogOpen(false); // 關閉步驟選單對話框
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

  // 監控播放狀態變化
  useEffect(() => {
    if (prevPlayingStateRef.current !== isPlaying) {
      console.log(`播放狀態實際變更為: ${isPlaying ? '播放中' : '已暫停'}`);
      prevPlayingStateRef.current = isPlaying;
    }
  }, [isPlaying]);

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
        <div className={`relative ${showRightPanel ? 'flex-1' : 'w-full'}`}>
          <VimeoPlayer
            videoId={videoId}
            responsive
            muted={false}
            loop={false}
            isPlaying={isPlaying}
            startTime={steps[currentStepIndex]?.startTime || 0}
            endTime={steps[currentStepIndex]?.endTime || undefined}
            onTimeUpdate={atTimeUpdate}
            onDurationChange={atDurationChange}
            onLoaded={() => console.log('Vimeo 播放器加載完成')}
            onPlay={() => console.log('Vimeo 播放器開始播放')}
            onPause={() => console.log('Vimeo 播放器已暫停')}
            onEnded={() => console.log('Vimeo 播放器播放結束')}
            onError={(error) => console.error('Vimeo 播放器錯誤:', error)}
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
                  {steps[currentStepIndex]?.title}
                </h2>
                <p className="text-gray-300">
                  {steps[currentStepIndex]?.description}
                </p>
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
                          步驟{index + 1}
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
