import { AlertCircle } from 'lucide-react';
import StepIndicator from '@/components/common/StepIndicator';
import { useVideoEditor } from '@/hooks/useVideoEditor';
import { Segment } from '@/stores/video/useVideoEditStore';

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

/**
 * 影片剪輯器元件，用於上傳、預覽和剪輯影片
 */
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

    addSegment,
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
          className="w-full bg-yellow-50 text-yellow-700 border-yellow-300 p-2 rounded mt-2"
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
            atAddSegment={addSegment}
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
            atCancel={handleAtCancel}
            atSubmit={handleAtSubmit}
            setErrors={() => {}}
          />
        </div>
      )}
    </div>
  );
}
