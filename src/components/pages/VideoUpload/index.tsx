import { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import StepIndicator from '@/components/common/StepIndicator';
import { useRouter } from 'next/router';
import { uploadRecipeVideo, updateRecipeSteps } from '@/services/recipes';
import { generateId, isMobileDevice } from '@/lib/utils';

// 引入子元件
import UploadArea from './UploadArea';
import VideoPlayer from './VideoPlayer';
import TrimControls from './TrimControls';
import SegmentNavigation from './SegmentNavigation';
import SegmentDescription from './SegmentDescription';
import ActionButtons from './ActionButtons';

// 引入類型和工具函數
import { Segment, VideoTrimmerProps, ErrorState } from './types';

/**
 * 影片剪輯器元件，用於上傳、預覽和剪輯影片
 */
export default function VideoTrimmer({ onSave, onCancel }: VideoTrimmerProps) {
  // 影片檔案狀態
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('videoexample.avi');

  // 上傳進度狀態
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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

  // 驗證狀態
  const [errors, setErrors] = useState<ErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // API 錯誤狀態
  const [apiError, setApiError] = useState<string | null>(null);

  // 取得路由
  const router = useRouter();
  const { recipeId } = router.query;

  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * 處理影片檔案上傳
   */
  const atFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];

      // 驗證檔案類型
      if (!file.type.startsWith('video/')) {
        setErrors((prev) => ({ ...prev, video: '請上傳有效的影片檔案' }));
        return;
      }

      // 清除所有錯誤訊息
      setErrors({});

      // 開始上傳進度動畫
      setIsUploading(true);
      setUploadProgress(0);
      setVideoFile(file);
      setFileName(file.name);

      // 模擬初始進度更新
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 5;
        });
      }, 300);

      try {
        // 確認 recipeId 存在
        if (!recipeId) {
          clearInterval(progressInterval);
          setIsUploading(false);
          throw new Error(
            '無法取得食譜 ID，請確認網址中包含正確的 recipeId 參數',
          );
        }

        console.log(`開始上傳影片至食譜 ID: ${recipeId}`);

        // 實際上傳到後端
        const response = await uploadRecipeVideo(
          parseInt(recipeId as string, 10),
          file,
        );

        console.log('影片上傳回應:', response);

        // 檢查回應是否成功
        if (response.message && !response.videoUri) {
          throw new Error(response.message || '上傳失敗，伺服器回應錯誤');
        }

        // API 成功回傳後，停止進度模擬並設為 100%
        clearInterval(progressInterval);
        setUploadProgress(100);
        console.log('影片上傳成功，可繼續剪輯操作');
        setApiError(null);

        // 短暫延遲後關閉上傳狀態並顯示預覽
        setTimeout(() => {
          setIsUploading(false);

          // 創建本地URL以預覽影片
          const url = URL.createObjectURL(file);
          setVideoUrl(url);

          // 預先創建一個默認片段
          const initialSegment: Segment = {
            id: generateId(),
            startTime: 0,
            endTime: 0, // 稍後由 atVideoLoaded 更新實際時長
            startPercent: 0,
            endPercent: 100,
            description: '',
          };
          setSegments([initialSegment]);
          setCurrentSegmentIndex(0);
        }, 800); // 稍微延遲以展示 100% 完成進度
      } catch (error) {
        // 停止進度更新
        clearInterval(progressInterval);

        console.error('影片上傳失敗:', error);
        setApiError(
          error instanceof Error ? error.message : '影片上傳失敗，請稍後再試',
        );

        // 重置進度條狀態
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    }
  };

  /**
   * 處理說明文字變更
   */
  const atDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    console.log('說明文字變更:', value.length, '字元');

    // 更新當前片段的說明文字
    const updatedSegments = [...segments];
    updatedSegments[currentSegmentIndex] = {
      ...updatedSegments[currentSegmentIndex],
      description: value,
    };
    setSegments(updatedSegments);

    // 驗證說明文字
    if (value.trim().length < 10) {
      console.log('說明文字不足 10 字，設置錯誤');
      setErrors((prev) => ({ ...prev, description: '說明文字至少需要10個字' }));
    } else {
      console.log('說明文字已達標準，清除錯誤');
      // 完全清除錯誤狀態，確保按鈕可點擊
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });

      // 立即重新驗證表單，確保按鈕狀態更新
      setTimeout(() => {
        validateForm();
      }, 10);
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

    // 儲存當前播放位置
    const currentPos = video.currentTime;

    // 預先創建所有時間點
    const timePoints = Array.from(
      { length: thumbnailCount },
      (_, i) => (videoDuration / thumbnailCount) * i,
    );

    // 創建一個函數來順序處理縮圖
    const processTimePointsSequentially = async (
      points: number[],
      index = 0,
      results: string[] = [],
    ): Promise<string[]> => {
      // 基本情況：處理完所有時間點
      if (index >= points.length) {
        return results;
      }

      // 設置影片時間
      video.currentTime = points[index];

      // 等待影片更新到指定時間
      await new Promise<void>((resolve) => {
        const seeked = () => {
          video.removeEventListener('seeked', seeked);
          resolve();
        };
        video.addEventListener('seeked', seeked);
      });

      // 為當前幀創建縮圖
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = 160; // 縮圖寬度
        canvas.height = 90; // 縮圖高度

        // 繪製縮圖
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.5);

        // 遞迴處理下一個時間點
        return processTimePointsSequentially(points, index + 1, [
          ...results,
          thumbnailUrl,
        ]);
      }

      // 如果無法獲取 ctx，直接處理下一幀
      return processTimePointsSequentially(points, index + 1, results);
    };

    // 開始順序處理縮圖
    const thumbnailResults = await processTimePointsSequentially(timePoints);
    setThumbnails(thumbnailResults);

    // 恢復原始播放位置
    video.currentTime = currentPos;
  };

  /**
   * 簡化版縮圖生成函數 (行動裝置優化)
   */
  const generateSimplifiedThumbnails = async () => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;
    const videoDuration = video.duration;
    // 行動裝置上只生成 3 張縮圖
    const thumbnailCount = 3;

    // 創建均勻分布的時間點
    const timePoints = Array.from(
      { length: thumbnailCount },
      (_, i) => (videoDuration / thumbnailCount) * i,
    );

    // 儲存當前播放位置
    const currentPos = video.currentTime;

    // 使用遞迴處理而非迴圈，避免在迴圈中使用 await
    const processTimePoints = async (
      points: number[],
      index = 0,
      results: string[] = [],
    ): Promise<string[]> => {
      // 基本情況：已處理所有時間點
      if (index >= points.length) {
        return results;
      }

      // 設置影片時間
      video.currentTime = points[index];

      // 等待影片更新到指定時間
      await new Promise<void>((resolve) => {
        const seeked = () => {
          video.removeEventListener('seeked', seeked);
          resolve();
        };
        video.addEventListener('seeked', seeked);
      });

      // 為當前幀創建縮圖
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let newResults = [...results];

      if (ctx) {
        canvas.width = 160; // 縮圖寬度
        canvas.height = 90; // 縮圖高度

        // 繪製縮圖
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.3); // 降低品質以節省資源
        newResults = [...newResults, thumbnailUrl];
      }

      // 遞迴處理下一個時間點
      return processTimePoints(points, index + 1, newResults);
    };

    // 開始處理時間點
    const simplifiedThumbnails = await processTimePoints(timePoints);

    // 更新縮圖狀態並恢復原始播放位置
    setThumbnails(simplifiedThumbnails);
    video.currentTime = currentPos;
  };

  /**
   * 影片載入後的處理，在影片載入後生成縮圖
   */
  const atVideoLoaded = () => {
    if (videoRef.current && videoUrl) {
      console.log('影片載入完成，初始化片段');
      const videoDuration = videoRef.current.duration || 134.63;
      setDuration(videoDuration);

      // 強制再次清除錯誤
      setErrors({});

      // 更新片段的時長
      const updatedSegments =
        segments.length > 0
          ? segments.map((segment, index) =>
              index === 0
                ? { ...segment, endTime: videoDuration, endPercent: 100 }
                : segment,
            )
          : [
              {
                id: generateId(),
                startTime: 0,
                endTime: videoDuration,
                startPercent: 0,
                endPercent: 100,
                description: '',
              },
            ];

      setSegments(updatedSegments);
      setCurrentSegmentIndex(0);
      setTrimValues([0, 100]);

      // 針對移動裝置最佳化：只在非行動裝置上生成縮圖，或減少縮圖數量
      if (!isMobileDevice()) {
        generateThumbnails();
      } else {
        // 行動裝置上只生成少量縮圖或跳過
        generateSimplifiedThumbnails();
      }
    }
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

        // 新增：使用使用者互動觸發播放
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('播放失敗:', error);
            // 提示使用者手動觸發播放
            alert('請再次點擊播放按鈕開始播放');
          });
        }
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
    console.log('驗證表單：', {
      videoFile: !!videoFile,
      segments: segments.length,
      currentSegmentIndex,
      hasDescription: segments[currentSegmentIndex]?.description?.length || 0,
    });

    const newErrors: ErrorState = {};

    // 驗證影片
    if (!videoFile) {
      newErrors.video = '請上傳影片';
    }

    // 驗證說明文字
    // 只有在有片段且影片已上傳的情況下才檢查說明文字
    if (segments.length > 0 && videoFile) {
      const currentDescription =
        segments[currentSegmentIndex]?.description?.trim() || '';
      if (currentDescription.length < 10) {
        newErrors.description = '說明文字至少需要10個字';
      }
    }

    console.log('驗證結果：', newErrors);
    setErrors(newErrors);

    // 再次確認設置後的錯誤數量
    const errorCount = Object.keys(newErrors).length;
    console.log(`驗證完成，錯誤數量: ${errorCount}`);

    return errorCount === 0;
  };

  /**
   * 完成剪輯並提交
   */
  const atSubmit = async () => {
    setIsSubmitting(true);
    setApiError(null);

    // 驗證所有欄位
    const isValid = validateForm();

    if (isValid && videoFile) {
      try {
        // 確認 recipeId 存在
        if (!recipeId) {
          throw new Error('無法取得食譜 ID，請回到步驟一重新開始');
        }

        // 告知父元件已完成剪輯
        onSave({
          file: videoFile,
          segments,
          description: segments[currentSegmentIndex]?.description,
        });

        // 將片段轉換為API需要的格式
        const stepsForAPI = segments.map((segment) => ({
          description: segment.description,
          startTime: Math.round(segment.startTime),
          endTime: Math.round(segment.endTime),
        }));

        console.log('準備更新步驟資訊:', stepsForAPI);

        // 更新步驟資訊
        try {
          const recipeIdNumber = parseInt(recipeId as string, 10);
          const stepResponse = await updateRecipeSteps(
            recipeIdNumber,
            stepsForAPI,
          );
          console.log('步驟更新成功:', stepResponse);

          if (stepResponse.StatusCode !== 200) {
            console.warn('步驟更新回應狀態不是200:', stepResponse);
          }
        } catch (stepError) {
          console.error('更新步驟失敗:', stepError);
          // 不中斷流程，繼續導向到食譜草稿頁面
        }

        // 從 localStorage 獲取用戶 displayId
        let userDisplayId = null;
        try {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            userDisplayId = parsedUserData.displayId || null;
          }
        } catch (error) {
          console.error('獲取用戶資料失敗:', error);
        }

        // 導向到用戶頁面
        console.log('影片剪輯完成，導向到用戶頁面');
        if (userDisplayId) {
          router.push(`/user/${userDisplayId}`);
        } else {
          // 如果沒有取得 displayId，則導向首頁
          router.push('/');
          console.warn('未能獲取用戶 displayId，導向到首頁');
        }
      } catch (error) {
        console.error('操作失敗:', error);
        setApiError(
          error instanceof Error ? error.message : '操作失敗，請稍後再試',
        );

        // 滾動到錯誤訊息
        setTimeout(() => {
          const errorElement = document.querySelector('.api-error');
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 100);

        setIsSubmitting(false);
      }
    } else {
      // 驗證失敗，滾動到第一個錯誤
      setTimeout(() => {
        const firstError = document.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      setIsSubmitting(false);
    }
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

  // 顯示開發環境調試按鈕
  const renderDebugButton = () => {
    if (process.env.NODE_ENV === 'development') {
      return (
        <button
          onClick={() => {
            console.log('Debug 資訊:', {
              videoFile: !!videoFile,
              videoUrl: !!videoUrl,
              segments: segments.length > 0 ? segments.length : '無片段',
              currentSegmentIndex,
              errors: Object.keys(errors).length > 0 ? errors : '無錯誤',
              isSubmitting,
              recipeId,
              description:
                segments[currentSegmentIndex]?.description || '無說明文字',
              descriptionLength:
                segments[currentSegmentIndex]?.description?.trim().length || 0,
            });

            // 強制清除所有錯誤
            setErrors({});

            // 延遲重新驗證以確保狀態更新完成
            setTimeout(() => {
              validateForm();
            }, 100);
          }}
          className="w-full bg-yellow-50 text-yellow-700 border-yellow-300 p-2 rounded mt-2"
        >
          Debug 工具 (重置錯誤狀態)
        </button>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-full bg-gray-50">
      {/* 步驟指示器 */}
      <div className="px-4 py-6">
        <StepIndicator currentStep={3} />
      </div>

      {/* 上傳區域 */}
      {!videoUrl ? (
        <UploadArea
          fileName={fileName}
          error={errors.video}
          onUpload={atFileUpload}
          progress={uploadProgress}
          isUploading={isUploading}
        />
      ) : (
        <div className="px-4 space-y-4">
          {/* 影片播放器 */}
          <VideoPlayer
            videoUrl={videoUrl}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            videoRef={videoRef}
            atTogglePlayPause={atTogglePlayPause}
            atTimeUpdate={atTimeUpdate}
            atVideoLoaded={atVideoLoaded}
          />

          {/* 片段導航 */}
          <SegmentNavigation
            segments={segments}
            currentSegmentIndex={currentSegmentIndex}
            isPlaying={isPlaying}
            atGoPreviousSegment={atGoPreviousSegment}
            atGoNextSegment={atGoNextSegment}
            atTogglePlayPause={atTogglePlayPause}
            atAddSegment={atAddSegment}
            atDeleteCurrentSegment={atDeleteCurrentSegment}
          />

          {/* 剪輯控制 */}
          <TrimControls
            duration={duration}
            currentTime={currentTime}
            trimValues={trimValues}
            thumbnails={thumbnails}
            atTrimChange={atTrimChange}
            atMarkStartPoint={atMarkStartPoint}
            atMarkEndPoint={atMarkEndPoint}
            atResetCurrentSegment={atResetCurrentSegment}
            segments={segments}
            currentSegmentIndex={currentSegmentIndex}
          />

          {/* 說明文字 */}
          <SegmentDescription
            segments={segments}
            currentSegmentIndex={currentSegmentIndex}
            error={errors.description}
            atDescriptionChange={atDescriptionChange}
            validateForm={validateForm}
          />

          {/* API 錯誤訊息 */}
          {apiError && (
            <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-300 rounded-md flex items-center api-error mt-2">
              <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
              {apiError}
            </div>
          )}

          {/* Debug 按鈕 - 開發環境使用 */}
          {renderDebugButton()}

          {/* 操作按鈕 */}
          <ActionButtons
            segments={segments}
            currentSegmentIndex={currentSegmentIndex}
            isSubmitting={isSubmitting}
            errors={errors}
            apiError={apiError}
            atCancel={atCancel}
            atSubmit={atSubmit}
            setErrors={setErrors}
          />
        </div>
      )}
    </div>
  );
}
