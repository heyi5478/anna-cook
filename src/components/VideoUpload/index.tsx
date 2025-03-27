import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

// 定義片段類型
type Segment = {
  id: string;
  startTime: number;
  endTime: number;
  startPercent: number;
  endPercent: number;
  description: string;
};

// 影片剪輯器元件屬性
type VideoTrimmerProps = {
  onSave: (trimmedVideo: {
    file: File;
    segments: Segment[];
    description?: string;
  }) => void;
  onCancel: () => void;
};

/**
 * 影片剪輯器元件，用於上傳、預覽和剪輯影片
 */
export default function VideoTrimmer({ onSave, onCancel }: VideoTrimmerProps) {
  // 影片檔案狀態
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('videoexample.avi');

  // 影片播放狀態
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(134.63);

  // 多片段剪輯狀態
  const [segments, setSegments] = useState<Segment[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [trimValues, setTrimValues] = useState<[number, number]>([0, 100]);

  // 縮圖狀態
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // 說明文字狀態
  // 移除這一行
  // const [description, setDescription] = useState<string>("食譜簡介料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！食譜料理中加入花生醬燉煮");

  // 驗證狀態
  const [errors, setErrors] = useState<{
    video?: string;
    description?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * 處理影片檔案上傳
   */
  const atFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];

      // 驗證檔案類型
      if (!file.type.startsWith('video/')) {
        setErrors((prev) => ({ ...prev, video: '請上傳有效的影片檔案' }));
        return;
      }

      // 清除錯誤訊息
      setErrors((prev) => ({ ...prev, video: undefined }));

      // 模擬上傳進度
      setIsUploading(true);
      setVideoFile(file);
      setFileName(file.name);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // 創建本地URL以預覽影片
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  /**
   * 處理說明文字變更
   */
  const atDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    // 更新當前片段的說明文字
    const updatedSegments = [...segments];
    updatedSegments[currentSegmentIndex] = {
      ...updatedSegments[currentSegmentIndex],
      description: value,
    };
    setSegments(updatedSegments);

    // 驗證說明文字
    if (value.trim().length < 10) {
      setErrors((prev) => ({ ...prev, description: '說明文字至少需要10個字' }));
    } else {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  /**
   * 生成影片縮圖
   */
  const generateThumbnails = async () => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;
    const videoDuration = video.duration;
    const thumbnailCount = 10; // 生成10張縮圖
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = 160; // 縮圖寬度
    canvas.height = 90; // 縮圖高度

    // 儲存當前播放位置
    const currentPos = video.currentTime;

    // 預先創建所有時間點
    const timePoints = Array.from(
      { length: thumbnailCount },
      (_, i) => (videoDuration / thumbnailCount) * i,
    );

    // 使用 Promise.all 處理所有縮圖生成
    const generateThumbnail = async (time: number) => {
      video.currentTime = time;

      // 等待影片更新到指定時間
      await new Promise<void>((resolve) => {
        const seeked = () => {
          video.removeEventListener('seeked', seeked);
          resolve();
        };
        video.addEventListener('seeked', seeked);
      });

      // 繪製縮圖
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.5);
    };

    // 並行處理所有縮圖
    const thumbnailResults = await Promise.all(
      timePoints.map(generateThumbnail),
    );
    setThumbnails(thumbnailResults);

    // 恢復原始播放位置
    video.currentTime = currentPos;
  };

  /**
   * 影片載入後的處理，在影片載入後生成縮圖
   */
  const atVideoLoaded = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration || 134.63;
      setDuration(videoDuration);

      // 創建第一個片段
      const initialSegment: Segment = {
        id: generateId(),
        startTime: 0,
        endTime: videoDuration,
        startPercent: 0,
        endPercent: 100,
        description:
          '食譜簡介料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！食譜料理中加入花生醬燉煮',
      };

      setSegments([initialSegment]);
      setCurrentSegmentIndex(0);
      setTrimValues([0, 100]);
      generateThumbnails(); // 生成縮圖
    }
  };

  /**
   * 生成唯一ID，用於標識片段
   */
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  /**
   * 處理影片時間更新
   */
  const atTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // 如果播放到當前片段結束點，跳到下一個片段或回到當前片段開始點
      const currentSegment = segments[currentSegmentIndex];
      if (
        currentSegment &&
        videoRef.current.currentTime >= currentSegment.endTime
      ) {
        if (currentSegmentIndex < segments.length - 1) {
          // 跳到下一個片段
          const nextSegment = segments[currentSegmentIndex + 1];
          videoRef.current.currentTime = nextSegment.startTime;
          setCurrentSegmentIndex(currentSegmentIndex + 1);
        } else {
          // 回到當前片段開始點
          videoRef.current.currentTime = currentSegment.startTime;
          if (!isPlaying) {
            videoRef.current.pause();
          }
        }
      }
    }
  };

  /**
   * 處理播放/暫停切換
   */
  const atTogglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // 確保在當前選中片段的範圍內播放
        const currentSegment = segments[currentSegmentIndex];
        if (currentSegment) {
          if (
            videoRef.current.currentTime < currentSegment.startTime ||
            videoRef.current.currentTime > currentSegment.endTime
          ) {
            videoRef.current.currentTime = currentSegment.startTime;
          }
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  /**
   * 處理滑桿值變更，更新當前片段的開始和結束時間
   */
  const atTrimChange = (values: number[]) => {
    if (values.length === 2 && segments.length > 0) {
      const newStartPercent = values[0];
      const newEndPercent = values[1];

      const newStartTime = (newStartPercent / 100) * duration;
      const newEndTime = (newEndPercent / 100) * duration;

      // 更新當前片段
      const updatedSegments = [...segments];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        startTime: newStartTime,
        endTime: newEndTime,
        startPercent: newStartPercent,
        endPercent: newEndPercent,
        description: updatedSegments[currentSegmentIndex].description,
      };

      setSegments(updatedSegments);
      setTrimValues([newStartPercent, newEndPercent]);

      // 更新影片當前時間到新的開始點
      if (videoRef.current) {
        videoRef.current.currentTime = newStartTime;
      }
    }
  };

  /**
   * 添加新片段
   */
  const atAddSegment = () => {
    if (duration > 0) {
      // 默認新片段從影片中間開始，持續5秒（或到影片結束）
      const middleTime = duration / 2;
      const endTime = Math.min(middleTime + 5, duration);

      const startPercent = (middleTime / duration) * 100;
      const endPercent = (endTime / duration) * 100;

      const newSegment: Segment = {
        id: generateId(),
        startTime: middleTime,
        endTime,
        startPercent,
        endPercent,
        description: '',
      };

      const newSegments = [...segments, newSegment];
      setSegments(newSegments);

      // 切換到新片段
      const newIndex = newSegments.length - 1;
      setCurrentSegmentIndex(newIndex);
      setTrimValues([startPercent, endPercent]);

      // 更新影片當前時間
      if (videoRef.current) {
        videoRef.current.currentTime = middleTime;
      }
    }
  };

  /**
   * 刪除當前片段
   */
  const atDeleteCurrentSegment = () => {
    if (segments.length <= 1) {
      // 至少保留一個片段
      return;
    }

    const newSegments = segments.filter(
      (_, index) => index !== currentSegmentIndex,
    );
    setSegments(newSegments);

    // 調整當前索引
    const newIndex = Math.min(currentSegmentIndex, newSegments.length - 1);
    setCurrentSegmentIndex(newIndex);

    // 更新滑桿值
    const currentSegment = newSegments[newIndex];
    setTrimValues([currentSegment.startPercent, currentSegment.endPercent]);

    // 更新影片當前時間
    if (videoRef.current) {
      videoRef.current.currentTime = currentSegment.startTime;
    }
  };

  /**
   * 切換到上一個片段
   */
  const atGoPreviousSegment = () => {
    if (currentSegmentIndex > 0) {
      const newIndex = currentSegmentIndex - 1;
      setCurrentSegmentIndex(newIndex);

      const segment = segments[newIndex];
      setTrimValues([segment.startPercent, segment.endPercent]);

      // 更新影片當前時間
      if (videoRef.current) {
        videoRef.current.currentTime = segment.startTime;
      }
    }
  };

  /**
   * 切換到下一個片段
   */
  const atGoNextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      const newIndex = currentSegmentIndex + 1;
      setCurrentSegmentIndex(newIndex);

      const segment = segments[newIndex];
      setTrimValues([segment.startPercent, segment.endPercent]);

      // 更新影片當前時間
      if (videoRef.current) {
        videoRef.current.currentTime = segment.startTime;
      }
    }
  };

  /**
   * 標記當前時間為片段起點
   */
  const atMarkStartPoint = () => {
    if (videoRef.current && segments.length > 0) {
      const newStartTime = videoRef.current.currentTime;
      const newStartPercent = (newStartTime / duration) * 100;

      // 更新當前片段
      const updatedSegments = [...segments];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        startTime: newStartTime,
        startPercent: newStartPercent,
        description: updatedSegments[currentSegmentIndex].description,
      };

      setSegments(updatedSegments);
      setTrimValues([
        newStartPercent,
        updatedSegments[currentSegmentIndex].endPercent,
      ]);
    }
  };

  /**
   * 標記當前時間為片段終點
   */
  const atMarkEndPoint = () => {
    if (videoRef.current && segments.length > 0) {
      const newEndTime = videoRef.current.currentTime;
      const newEndPercent = (newEndTime / duration) * 100;

      // 更新當前片段
      const updatedSegments = [...segments];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        endTime: newEndTime,
        endPercent: newEndPercent,
        description: updatedSegments[currentSegmentIndex].description,
      };

      setSegments(updatedSegments);
      setTrimValues([
        updatedSegments[currentSegmentIndex].startPercent,
        newEndPercent,
      ]);
    }
  };

  /**
   * 重置當前片段為整個影片長度
   */
  const atResetCurrentSegment = () => {
    if (segments.length > 0) {
      // 重置當前片段為整個影片長度
      const updatedSegments = [...segments];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        startTime: 0,
        endTime: duration,
        startPercent: 0,
        endPercent: 100,
        description: updatedSegments[currentSegmentIndex].description,
      };

      setSegments(updatedSegments);
      setTrimValues([0, 100]);

      // 更新影片當前時間
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  /**
   * 驗證所有欄位
   */
  const validateForm = (): boolean => {
    const newErrors: {
      video?: string;
      description?: string;
    } = {};

    // 驗證影片
    if (!videoFile) {
      newErrors.video = '請上傳影片';
    }

    // 驗證說明文字
    const currentDescription = segments[currentSegmentIndex]?.description || '';
    if (!currentDescription || currentDescription.trim().length < 10) {
      newErrors.description = '說明文字至少需要10個字';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 完成剪輯並提交
   */
  const atSubmit = () => {
    setIsSubmitting(true);

    // 驗證所有欄位
    const isValid = validateForm();

    if (isValid && videoFile) {
      onSave({
        file: videoFile,
        segments,
        description: segments[currentSegmentIndex]?.description,
      });
    } else {
      // 驗證失敗，滾動到第一個錯誤
      setTimeout(() => {
        const firstError = document.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    setIsSubmitting(false);
  };

  /**
   * 格式化時間顯示 (秒)
   */
  const formatTime = (timeInSeconds: number) => {
    return timeInSeconds.toFixed(2);
  };

  /**
   * 取消上傳並返回
   */
  const atCancel = () => {
    // 清理資源
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    // 呼叫父元件的取消函數
    onCancel();
  };

  // 清理資源
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // 初始驗證
  useEffect(() => {
    // 初始驗證說明文字
    if (
      segments[currentSegmentIndex]?.description &&
      segments[currentSegmentIndex]?.description.trim().length < 10
    ) {
      setErrors((prev) => ({ ...prev, description: '說明文字至少需要10個字' }));
    }
  }, [segments, currentSegmentIndex]);

  // 獲取當前片段
  const currentSegment = segments[currentSegmentIndex] || {
    startTime: 0,
    endTime: 0,
    startPercent: 0,
    endPercent: 0,
    description: '',
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-full bg-gray-50">
      {/* 步驟指示器 */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <div className="h-0.5 bg-gray-700 w-full relative">
            <div className="absolute left-0 -top-1.5 w-4 h-4 bg-gray-700 rounded-full" />
            <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-4 h-4 bg-gray-700 rounded-full" />
            <div className="absolute right-0 -top-1.5 w-4 h-4 bg-gray-700 rounded-full" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-900 font-medium">Step 1</div>
          <div className="text-gray-900 font-medium">Step 2</div>
          <div className="text-gray-900 font-medium">Step 3</div>
        </div>
      </div>

      {/* 上傳區域 */}
      {!videoUrl ? (
        <div className="px-4">
          <h2 className="text-xl font-semibold mb-4">上傳您的影片</h2>
          <div
            className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 h-64 bg-white"
            onClick={() => document.getElementById('video-upload')?.click()}
          >
            <input
              type="file"
              accept="video/*"
              id="video-upload"
              className="hidden"
              onChange={atFileUpload}
              aria-label="上傳影片"
            />
            <div className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
              <ImageIcon
                className="h-12 w-12 text-gray-400 mb-2"
                aria-hidden="true"
              />
              <span className="text-gray-500">點擊選擇影片檔案上傳</span>
            </div>
          </div>
          <div className="text-gray-500 mt-2">{fileName}</div>
          {errors.video && (
            <div className="text-red-500 text-sm mt-1 flex items-center error-message">
              <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
              {errors.video}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 space-y-4">
          {/* 上傳進度 */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>上傳中...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* 影片預覽 */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onLoadedMetadata={atVideoLoaded}
              onTimeUpdate={atTimeUpdate}
              onClick={atTogglePlayPause}
            >
              <track kind="captions" src="" label="中文" default />
              您的瀏覽器不支援影片標籤
            </video>

            {!videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon
                  className="h-12 w-12 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            )}

            {/* 播放/暫停按鈕覆蓋層 */}
            {videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={atTogglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* 時間顯示 */}
          <div className="flex justify-between text-sm text-gray-700">
            <span>當前: {formatTime(currentTime)} 秒</span>
            <span>總長: {formatTime(duration)} 秒</span>
          </div>

          {/* 片段導航 */}
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={atGoPreviousSegment}
              className="h-8 w-8 text-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700">
              步驟 {currentSegmentIndex + 1}/{segments.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={atGoNextSegment}
              className="h-8 w-8 text-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={atAddSegment}
                className="h-8 w-8 text-gray-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={atDeleteCurrentSegment}
                disabled={segments.length <= 1}
                className="h-8 w-8 text-gray-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 雙滑桿剪輯 (YouTube 風格) */}
          <div className="space-y-2 mt-6">
            {/* 時間標記 */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>0:00</span>
              <span>
                {Math.floor(duration / 60)}:
                {Math.floor(duration % 60)
                  .toString()
                  .padStart(2, '0')}
              </span>
            </div>

            {/* 整合縮圖預覽和滑桿 */}
            <div className="relative h-16">
              {/* 縮圖容器 */}
              <div className="absolute inset-0 flex rounded overflow-hidden">
                {thumbnails.map((thumbnail, i) => {
                  // 生成唯一且穩定的 key，使用縮圖資料的前10字元作為唯一標識
                  const uniqueId = `${i}-${thumbnail.slice(-10)}`;
                  return (
                    <div
                      key={uniqueId}
                      className="h-full flex-grow"
                      style={{ width: `${100 / thumbnails.length}%` }}
                    >
                      <img
                        src={thumbnail || '/placeholder.svg'}
                        alt={`影片縮圖 ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>

              {/* 所有片段標記 */}
              {segments.map((segment, index) => (
                <div
                  key={segment.id}
                  className={`absolute top-0 bottom-0 border-2 pointer-events-none z-10 ${
                    index === currentSegmentIndex
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-blue-300 bg-blue-300/10'
                  }`}
                  style={{
                    left: `${segment.startPercent}%`,
                    width: `${segment.endPercent - segment.startPercent}%`,
                  }}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium px-1 py-0.5 rounded bg-blue-600 text-white">
                    {index + 1}
                  </div>
                </div>
              ))}

              {/* 非選中區域遮罩 (左側) */}
              <div
                className="absolute top-0 bottom-0 bg-black/50 pointer-events-none z-10 rounded-l"
                style={{
                  left: 0,
                  width: `${trimValues[0]}%`,
                }}
              />

              {/* 非選中區域遮罩 (右側) */}
              <div
                className="absolute top-0 bottom-0 bg-black/50 pointer-events-none z-10 rounded-r"
                style={{
                  right: 0,
                  width: `${100 - trimValues[1]}%`,
                }}
              />

              {/* 當前播放位置指示器 */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                style={{
                  left: `${(currentTime / duration) * 100}%`,
                }}
              >
                <div className="absolute -top-1 -ml-1.5 w-3 h-3 bg-red-500 rounded-full" />
              </div>

              {/* 自定義樣式的 Slider */}
              <Slider
                value={trimValues as [number, number]}
                min={0}
                max={100}
                step={0.1}
                onValueChange={atTrimChange}
                className="absolute inset-0 z-30 [&_[data-orientation=horizontal]]:bg-transparent [&_[role=slider]]:opacity-0 [&_[data-orientation=horizontal]>.range]:bg-transparent"
                thumbClassName="group h-full w-1 top-0 rounded-none -mt-0 bg-transparent"
              />

              {/* 左側把手 (與 Slider 的第一個滑塊對齊) */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-blue-500 z-40 pointer-events-none"
                style={{ left: `${trimValues[0]}%` }}
              >
                <div className="absolute h-6 w-6 bg-blue-500 rounded-full -ml-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="h-4 w-0.5 bg-white" />
                </div>
              </div>

              {/* 右側把手 (與 Slider 的第二個滑塊對齊) */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-blue-500 z-40 pointer-events-none"
                style={{ left: `${trimValues[1]}%` }}
              >
                <div className="absolute h-6 w-6 bg-blue-500 rounded-full -ml-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="h-4 w-0.5 bg-white" />
                </div>
              </div>
            </div>
          </div>

          {/* 剪輯時間顯示 */}
          <div className="flex justify-between text-sm">
            <span>起點: {formatTime(currentSegment.startTime)} 秒</span>
            <span>終點: {formatTime(currentSegment.endTime)} 秒</span>
          </div>

          {/* 標記按鈕 */}
          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={atMarkStartPoint}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              標記起點
            </button>
            <button
              onClick={atMarkEndPoint}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              標記終點
            </button>
          </div>

          {/* 說明文字 */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              說明文字 (步驟 {currentSegmentIndex + 1})
            </h3>
            <textarea
              value={segments[currentSegmentIndex]?.description || ''}
              onChange={atDescriptionChange}
              className={`w-full p-2 text-sm border rounded-md min-h-[80px] resize-none ${
                errors.description
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 text-gray-600'
              }`}
              placeholder="請輸入此步驟的說明文字..."
            />
            {errors.description && (
              <div className="text-red-500 text-sm mt-1 flex items-center error-message">
                <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                {errors.description}
              </div>
            )}
          </div>

          {/* 重置按鈕 */}
          <button
            onClick={atResetCurrentSegment}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            <span className="mr-2">↻</span>
            重置
          </button>

          {/* 按鈕群組 */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={atCancel}
              className="w-1/2 py-3 px-4 text-gray-700 border border-gray-300 rounded-md flex items-center justify-center"
            >
              取消
            </button>
            <button
              onClick={atSubmit}
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`w-1/2 py-3 px-4 text-white rounded-md flex items-center justify-center ${
                isSubmitting || Object.keys(errors).length > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              <Check className="h-5 w-5 mr-2" />
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
