import { AlertCircle } from 'lucide-react';
import StepIndicator from '@/components/common/StepIndicator';
import { useVideoEditor } from '@/hooks/useVideoEditor';
import { Segment } from '@/stores/video/useVideoEditStore';
import { cn } from '@/lib/utils';
import {
  videoEditorContainerVariants,
  errorMessageVariants,
  debugButtonVariants,
  stepIndicatorContainerVariants,
  contentAreaVariants,
} from '@/styles/cva/video-upload';

// 引入子元件
import UploadArea from './UploadArea';
import VideoPlayer from './VideoPlayer';
import TrimControls from './TrimControls';
import SegmentNavigation from './SegmentNavigation';
import SegmentDescription from './SegmentDescription';
import ActionButtons from './ActionButtons';

/**
 * 影片剪輯器元件屬性
 */
export type VideoTrimmerProps = {
  onSave: (trimmedVideo: {
    file: File;
    segments: Segment[];
    description?: string;
  }) => void;
  onCancel: () => void;
};

// 影片剪輯器主元件 - 提供完整的視頻上傳、編輯和剪輯功能
export default function VideoTrimmer({ onSave, onCancel }: VideoTrimmerProps) {
  // 使用自定義 hook 管理視頻編輯狀態
  const {
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

    videoRef,

    atFileUpload,
    atDescriptionChange,
    atVideoLoaded,
    atTimeUpdate,
    atTogglePlayPause,
    atTrimChange,
    atMarkStartPoint,
    atMarkEndPoint,
    atSubmit,
    atCancel: handleCancel,
    validateForm,

    atAddSegment,
    deleteCurrentSegment,
    atGoPreviousSegment,
    atGoNextSegment,
    resetCurrentSegment,
  } = useVideoEditor();

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
              description:
                segments[currentSegmentIndex]?.description || '無說明文字',
              descriptionLength:
                segments[currentSegmentIndex]?.description?.trim().length || 0,
            });

            // 延遲重新驗證以確保狀態更新完成
            setTimeout(() => {
              validateForm();
            }, 100);
          }}
          className={debugButtonVariants({
            environment:
              process.env.NODE_ENV === 'development'
                ? 'development'
                : 'production',
          })}
        >
          Debug 工具 (重置錯誤狀態)
        </button>
      );
    }
    return null;
  };

  // 處理取消
  const handleAtCancel = () => {
    handleCancel(onCancel);
  };

  // 處理提交
  const handleAtSubmit = async () => {
    await atSubmit(onSave);
  };

  // 獲取容器狀態
  const getContainerState = () => {
    if (isUploading) return 'uploading';
    if (videoUrl) return 'editing';
    return 'default';
  };

  return (
    <div
      className={videoEditorContainerVariants({ state: getContainerState() })}
    >
      {/* 步驟指示器 */}
      <div className={stepIndicatorContainerVariants()}>
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
        <div className={contentAreaVariants()}>
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
            atDeleteCurrentSegment={deleteCurrentSegment}
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
            atResetCurrentSegment={resetCurrentSegment}
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
            <div
              className={cn(errorMessageVariants({ type: 'api' }), 'api-error')}
            >
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
            atCancel={handleAtCancel}
            atSubmit={handleAtSubmit}
            setErrors={() => {}}
          />
        </div>
      )}
    </div>
  );
}
