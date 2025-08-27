import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useVideoEditStore } from '@/stores/video/useVideoEditStore';
import { uploadRecipeVideo, updateRecipeSteps } from '@/services/recipes';
import { isMobileDevice } from '@/lib/utils';
import { HTTP_STATUS } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/constants/messages';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';

/**
 * 提供視頻編輯功能的自定義 Hook
 */
export const useVideoEditor = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const { recipeId } = router.query;

  // 從 store 獲取狀態和動作
  const {
    upload: {
      videoFile,
      videoUrl,
      fileName,
      uploadProgress,
      isUploading,
      apiError,
    },
    player: { isPlaying, currentTime, duration, thumbnails },
    segments: { segments, currentSegmentIndex, trimValues },
    form: { errors, isSubmitting },

    setVideoFile,
    setVideoUrl,
    setFileName,
    setUploadProgress,
    setIsUploading,
    setApiError,

    setIsPlaying,
    setCurrentTime,
    setDuration,
    setThumbnails,

    setSegments,
    updateCurrentSegmentDescription,
    setCurrentSegmentIndex,
    setTrimValues,
    addSegment,
    deleteCurrentSegment,
    goToPreviousSegment,
    goToNextSegment,
    markStartPoint,
    markEndPoint,
    resetCurrentSegment,

    setErrors,
    setIsSubmitting,
    reset,
  } = useVideoEditStore();

  /**
   * 清理資源
   */
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  /**
   * 初始驗證說明文字 - 移除無限迴圈的 useEffect
   */
  // 移除此 useEffect 以避免無限迴圈問題
  // 驗證邏輯改在 atDescriptionChange 和 validateForm 中處理

  /**
   * 處理影片檔案上傳
   */
  const atFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];

      // 驗證檔案類型
      if (!file.type.startsWith('video/')) {
        setErrors({ ...errors, video: VALIDATION_MESSAGES.UPLOAD_VALID_VIDEO });
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
      let simulatedProgress = 0; // 在閉包外部追蹤進度
      const progressInterval = setInterval(() => {
        // 根據已模擬的進度動態調整增量，讓進度條增長更加平滑
        const increment = Math.max(
          0.5,
          Math.random() * (10 - simulatedProgress / 10),
        );
        simulatedProgress += increment;

        if (simulatedProgress >= 95) {
          clearInterval(progressInterval);
          setUploadProgress(95);
        } else {
          setUploadProgress(simulatedProgress);
        }
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
          throw new Error(
            response.message ||
              `${ERROR_MESSAGES.UPLOAD_FAILED}，伺服器回應錯誤`,
          );
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
          const initialSegment = {
            id: 'segment-1',
            startTime: 0,
            endTime: 0, // 稍後由 atVideoLoaded 更新實際時長
            startPercent: 0,
            endPercent: 100,
            description: '',
          };
          setSegments([initialSegment]);
          setCurrentSegmentIndex(0);
        }, 1000); // 延長到 1.0 秒，讓用戶能夠看到 100% 進度
      } catch (error) {
        // 停止進度更新
        clearInterval(progressInterval);

        console.error('影片上傳失敗:', error);
        setApiError(
          error instanceof Error
            ? error.message
            : `${ERROR_MESSAGES.VIDEO_UPLOAD_FAILED}，請稍後再試`,
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
    updateCurrentSegmentDescription(value);

    // 驗證說明文字
    if (value.trim().length < 10) {
      console.log('說明文字不足 10 字，設置錯誤');
      // 避免無限迴圈，不依賴當前 errors 狀態
      setErrors({
        ...errors,
        description: VALIDATION_MESSAGES.MIN_VIDEO_DESCRIPTION_LENGTH,
      });
    } else {
      console.log('說明文字已達標準，清除錯誤');
      // 完全清除錯誤狀態，確保按鈕可點擊
      const newErrors = { ...errors };
      delete newErrors.description;
      setErrors(newErrors);

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
                id: 'segment-1',
                startTime: 0,
                endTime: videoDuration,
                startPercent: 0,
                endPercent: 100,
                description: '',
              },
            ];

      setSegments(updatedSegments);

      // 只有在沒有現有片段或是第一次載入時才重置到第一個片段
      if (segments.length === 0 || currentSegmentIndex === -1) {
        setCurrentSegmentIndex(0);
        setTrimValues([0, 100]);
      }

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
   * 智慧錯誤處理機制
   */
  const handlePlaybackError = (error: any) => {
    // 記錄詳細錯誤資訊
    console.error('影片播放失敗詳細資訊:', {
      error: error.message || error,
      videoReadyState: videoRef.current?.readyState,
      videoSrc: videoUrl,
      isMobile: isMobileDevice(),
      userAgent: navigator.userAgent,
    });

    // 根據錯誤類型提供不同處理方式
    if (error.name === 'NotAllowedError') {
      // 自動播放被阻擋
      setApiError('請手動點擊播放按鈕開始播放影片');
    } else if (error.name === 'AbortError') {
      // 載入中斷，嘗試重新載入
      if (videoRef.current) {
        videoRef.current.load();
      }
      setApiError('影片載入中斷，請稍後再試');
    } else {
      // 其他錯誤
      setApiError('影片播放失敗，請檢查影片格式或重新上傳');
    }
  };

  /**
   * 處理播放/暫停切換
   */
  const atTogglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
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

        // iOS 特殊處理
        if (isMobileDevice()) {
          // 確保影片已載入
          if (videoRef.current.readyState < 2) {
            videoRef.current.load();
          }
        }

        // 使用 Promise 處理播放
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // 播放成功
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('播放失敗:', error);
              setIsPlaying(false);
              handlePlaybackError(error);
            });
        } else {
          // 對於不支援 Promise 的舊瀏覽器
          setIsPlaying(true);
        }
      }
    }
  };

  /**
   * 處理滑桿值變更
   */
  const atTrimChange = (values: number[]) => {
    if (values.length === 2) {
      setTrimValues([values[0], values[1]]);

      // 更新影片當前時間到新的開始點
      if (videoRef.current) {
        const newStartTime = (values[0] / 100) * duration;
        videoRef.current.currentTime = newStartTime;
      }
    }
  };

  /**
   * 標記當前時間為片段起點
   */
  const atMarkStartPoint = () => {
    if (videoRef.current) {
      markStartPoint(videoRef.current.currentTime);
    }
  };

  /**
   * 標記當前時間為片段終點
   */
  const atMarkEndPoint = () => {
    if (videoRef.current) {
      markEndPoint(videoRef.current.currentTime);
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

    const newErrors: Record<string, string> = {};

    // 驗證影片
    if (!videoFile) {
      newErrors.video = VALIDATION_MESSAGES.UPLOAD_VIDEO;
    }

    // 驗證說明文字
    // 只有在有片段且影片已上傳的情況下才檢查說明文字
    if (segments.length > 0 && videoFile) {
      const currentDescription =
        segments[currentSegmentIndex]?.description?.trim() || '';
      if (currentDescription.length < 10) {
        newErrors.description =
          VALIDATION_MESSAGES.MIN_VIDEO_DESCRIPTION_LENGTH;
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
  const atSubmit = async (onSave: (data: any) => void) => {
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

          if (stepResponse.StatusCode !== HTTP_STATUS.OK) {
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
  const atCancel = (onCancel: () => void) => {
    // 清理資源
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    // 重置狀態
    reset();
    // 呼叫父元件的取消函數
    onCancel();
  };

  /**
   * 創建影片時間同步回調函數
   */
  const createVideoTimeSyncCallback = () => {
    return (startTime: number) => {
      if (videoRef.current) {
        // 如果正在播放，先暫停再跳轉時間
        const wasPlaying = isPlaying;
        if (wasPlaying && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }

        videoRef.current.currentTime = startTime;

        // 短暫延遲後恢復播放狀態（如果之前在播放）
        if (wasPlaying) {
          setTimeout(() => {
            if (videoRef.current) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch((error) => {
                    console.error('恢復播放失敗:', error);
                    handlePlaybackError(error);
                  });
              } else {
                setIsPlaying(true);
              }
            }
          }, 100);
        }
      }
    };
  };

  /**
   * 包裝的新增片段函數，確保同步影片時間軸
   */
  const atAddSegment = () => {
    const onSegmentAdded = createVideoTimeSyncCallback();
    addSegment(onSegmentAdded);
  };

  /**
   * 包裝的前一個片段函數，確保同步影片時間
   */
  const atGoToPreviousSegment = () => {
    const onSegmentChange = createVideoTimeSyncCallback();
    goToPreviousSegment(onSegmentChange);
  };

  /**
   * 包裝的下一個片段函數，確保同步影片時間
   */
  const atGoToNextSegment = () => {
    const onSegmentChange = createVideoTimeSyncCallback();
    goToNextSegment(onSegmentChange);
  };

  /**
   * 包裝的刪除當前片段函數，確保同步影片時間到新的當前片段
   */
  const atDeleteCurrentSegment = () => {
    const onSegmentDeleted = createVideoTimeSyncCallback();
    deleteCurrentSegment(onSegmentDeleted);
  };

  /**
   * 包裝的設置當前片段索引函數，確保同步影片時間
   */
  const atSetCurrentSegmentIndex = (index: number) => {
    const onSegmentChange = createVideoTimeSyncCallback();
    setCurrentSegmentIndex(index, onSegmentChange);
  };

  /**
   * 獲取當前片段文字描述
   */
  const getCurrentDescription = () => {
    return segments[currentSegmentIndex]?.description || '';
  };

  return {
    // 狀態
    videoFile,
    videoUrl,
    fileName,
    uploadProgress,
    isUploading,
    apiError,
    isPlaying,
    currentTime,
    duration,
    thumbnails,
    segments,
    currentSegmentIndex,
    trimValues,
    errors,
    isSubmitting,

    // 引用
    videoRef,

    // 方法
    atFileUpload,
    atDescriptionChange,
    atVideoLoaded,
    atTimeUpdate,
    atTogglePlayPause,
    atTrimChange,
    atMarkStartPoint,
    atMarkEndPoint,
    atSubmit,
    atCancel,
    validateForm,
    getCurrentDescription,

    // 導航 (使用包裝函數確保影片時間同步)
    atAddSegment,
    atDeleteCurrentSegment,
    atGoPreviousSegment: atGoToPreviousSegment,
    atGoNextSegment: atGoToNextSegment,
    atSetCurrentSegmentIndex,
    resetCurrentSegment,
  };
};
