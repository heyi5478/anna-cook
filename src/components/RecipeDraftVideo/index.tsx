import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  RotateCcw,
  Trash2,
  Check,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import VimeoPlayer, {
  formatTime as formatTimeHMS,
  formatSeconds as formatSec,
} from '@/components/ui/VimeoPlayer';

type Step = {
  id: number;
  startTime: number;
  endTime: number;
  description: string;
};

type VideoEditorProps = {
  videoId: number | string;
  totalDuration?: number;
};

/**
 * 食譜影片編輯器元件，用於切割食譜影片並添加步驟說明
 */
const VideoEditor: React.FC<VideoEditorProps> = ({
  videoId,
  totalDuration = 0,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<Step[]>([
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
  ]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(steps[0].startTime);
  const [endTime, setEndTime] = useState<number>(steps[0].endTime);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(
    totalDuration || 100,
  );
  const [currentDescription, setCurrentDescription] = useState<string>(
    steps[0].description,
  );

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

  /**
   * 標記當前時間為步驟起點
   */
  const atMarkStart = useCallback(() => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === currentStep ? { ...step, startTime: currentTime } : step,
      ),
    );
    setStartTime(currentTime);
  }, [currentStep, currentTime]);

  /**
   * 標記當前時間為步驟終點
   */
  const atMarkEnd = useCallback(() => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === currentStep ? { ...step, endTime: currentTime } : step,
      ),
    );
    setEndTime(currentTime);
  }, [currentStep, currentTime]);

  /**
   * 重置所有步驟的時間範圍
   */
  const atResetAll = useCallback(() => {
    // 重置所有步驟的時間範圍
    setSteps((prevSteps) =>
      prevSteps.map((step, index) => ({
        ...step,
        startTime: index * 5, // 每個步驟間隔 5 秒
        endTime: index * 5 + 5, // 每個步驟長度為 5 秒
      })),
    );
    // 更新當前步驟的時間
    const currentStepIndex = currentStep - 1;
    setStartTime(currentStepIndex * 5);
    setEndTime(currentStepIndex * 5 + 5);
  }, [currentStep]);

  /**
   * 刪除當前步驟
   */
  const atDeleteStep = useCallback(() => {
    if (steps.length > 1) {
      const newSteps = steps.filter((step) => step.id !== currentStep);
      setSteps(newSteps);
      setCurrentStep(Math.min(currentStep, newSteps.length));
    }
  }, [currentStep, steps]);

  /**
   * 前往下一個步驟
   */
  const atNextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  /**
   * 前往上一個步驟
   */
  const atPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  /**
   * 切換影片播放/暫停狀態
   */
  const atTogglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  /**
   * 添加新的步驟
   */
  const atAddStep = useCallback(() => {
    const newStepId = Math.max(...steps.map((s) => s.id)) + 1;
    setSteps([
      ...steps,
      {
        id: newStepId,
        startTime: 0,
        endTime: 10,
        description: `步驟 ${newStepId}：請輸入步驟說明`,
      },
    ]);
  }, [steps]);

  /**
   * 更新時間範圍滑桿值
   */
  const atTimeRangeChange = useCallback(
    (values: number[]) => {
      if (values.length === 2) {
        const [newStartTime, newEndTime] = values;
        setSteps((prevSteps) =>
          prevSteps.map((step) =>
            step.id === currentStep
              ? { ...step, startTime: newStartTime, endTime: newEndTime }
              : step,
          ),
        );
        setStartTime(newStartTime);
        setEndTime(newEndTime);
      }
    },
    [currentStep],
  );

  /**
   * 更新影片總時長
   */
  const atDurationChange = useCallback((duration: number) => {
    setVideoDuration(duration || 100);
  }, []);

  /**
   * 更新當前影片播放時間
   */
  const atTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  /**
   * 更新步驟說明文字
   */
  const atDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newDescription = e.target.value;
      setCurrentDescription(newDescription);
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === currentStep
            ? { ...step, description: newDescription }
            : step,
        ),
      );
    },
    [currentStep],
  );

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-gray-50">
      {/* 頂部導航 */}
      <div className="flex items-center p-2 bg-white border-b">
        <button className="p-2" aria-label="選單">
          <div className="w-6 h-6 flex flex-col justify-around">
            <div className="h-0.5 bg-gray-600 w-full" />
            <div className="h-0.5 bg-gray-600 w-full" />
            <div className="h-0.5 bg-gray-600 w-full" />
          </div>
        </button>
        <div className="mx-2 font-bold">Logo</div>
        <div className="flex-1 mx-2">
          <div className="bg-gray-100 rounded-full flex items-center px-3 py-1">
            <span className="text-gray-500 text-sm">簡單字搜尋</span>
            <div className="ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <button className="p-2" aria-label="使用者設定檔">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>

      {/* 麵包屑導航 */}
      <div className="flex items-center p-2 text-sm text-gray-600">
        <span>首頁</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>建立食譜</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>切割食譜影片</span>
      </div>

      {/* 步驟指示器 */}
      <div className="px-4 py-2">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300 -z-10" />
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center z-10 ${currentStep === step.id ? 'text-black' : 'text-gray-500'}`}
            >
              <div
                className={`w-4 h-4 rounded-full ${currentStep === step.id ? 'bg-black' : 'bg-gray-400'} mb-1`}
              />
              <span className="text-xs">Step {index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 影片預覽 */}
      <div className="bg-gray-100 aspect-video flex items-center justify-center my-2">
        <VimeoPlayer
          videoId={videoId}
          width={400}
          startTime={startTime}
          endTime={endTime}
          onTimeUpdate={atTimeUpdate}
          onDurationChange={atDurationChange}
          isPlaying={isPlaying}
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
          onClick={atPrevStep}
          className="p-2 text-gray-600"
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-sm">
          步驟 {currentStep}/{steps.length}
        </div>
        <button
          onClick={atNextStep}
          className="p-2 text-gray-600"
          disabled={currentStep === steps.length}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button onClick={atTogglePlay} className="p-2 text-gray-600">
          <Play className="h-5 w-5" />
        </button>
        <button onClick={atAddStep} className="p-2 text-gray-600">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* 時間軸 */}
      <div className="px-4 py-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0:00</span>
          <span>{formatTimeHMS(videoDuration)}</span>
        </div>
        <div className="py-6">
          <Slider
            defaultValue={[startTime, endTime]}
            value={[startTime, endTime]}
            max={videoDuration}
            min={0}
            step={0.1}
            onValueChange={atTimeRangeChange}
            className="[&>span:first-child]:h-3 [&>span:first-child]:bg-gray-200 [&>span:first-child]:rounded-md [&>span:nth-child(2)]:bg-gray-400"
            thumbClassName="h-6 w-4 bg-white border-2 border-gray-400 rounded-sm shadow-md hover:border-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          />
        </div>
      </div>

      {/* 起點和終點 */}
      <div className="flex justify-between px-4 py-2 text-sm">
        <div>起點: {formatSec(startTime)}</div>
        <div>終點: {formatSec(endTime)}</div>
      </div>

      {/* 標記按鈕 */}
      <div className="grid grid-cols-2 gap-4 px-4 py-2">
        <Button
          variant="outline"
          onClick={atMarkStart}
          className="border border-gray-300 rounded-md py-2"
        >
          標記起點
        </Button>
        <Button
          variant="outline"
          onClick={atMarkEnd}
          className="border border-gray-300 rounded-md py-2"
        >
          標記終點
        </Button>
      </div>

      {/* 重置和刪除按鈕 */}
      <div className="px-4 py-2">
        <Button
          variant="outline"
          onClick={atResetAll}
          className="w-full border border-gray-300 rounded-md py-2 mb-2 flex items-center justify-center"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          全部步驟初始化
        </Button>
        <Button
          variant="outline"
          onClick={atDeleteStep}
          className="w-full bg-gray-200 text-gray-700 rounded-md py-2 flex items-center justify-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          刪除此步驟
        </Button>
      </div>

      {/* 說明文字 */}
      <div className="px-4 py-2">
        <div className="text-sm mb-2">步驟 {currentStep} 說明文字</div>
        <textarea
          value={currentDescription}
          onChange={atDescriptionChange}
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
          全部完成
        </Button>
      </div>

      {/* 底部導航 */}
      <div className="mt-4 bg-gray-100 p-4">
        <div className="bg-gray-400 text-white px-4 py-1 w-16 mb-4">商標</div>
        <div className="border-b border-gray-300 py-2 flex justify-between items-center">
          <div>人氣食譜</div>
          <ChevronRight className="h-5 w-5" />
        </div>
        <div className="border-b border-gray-300 py-2 flex justify-between items-center">
          <div>最新食譜</div>
          <ChevronRight className="h-5 w-5" />
        </div>
        <div className="border-b border-gray-300 py-2 flex justify-between items-center">
          <div>關於我們</div>
          <ChevronRight className="h-5 w-5" />
        </div>
        <div className="text-center text-gray-500 text-xs mt-4">
          <div>需要協助? 聯絡我們</div>
          <div className="mt-1">© 版權所有來自Createx studio</div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
