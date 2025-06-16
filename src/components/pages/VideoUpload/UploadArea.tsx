import type React from 'react';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { COMMON_TEXTS } from '@/lib/constants/messages';

/**
 * 上傳區域元件屬性
 */
type UploadAreaProps = {
  fileName: string;
  error?: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  progress?: number;
  isUploading?: boolean;
};

/**
 * 影片上傳區域元件，顯示上傳介面和檔案選擇功能
 */
export default function UploadArea({
  fileName,
  error,
  onUpload,
  progress = 0,
  isUploading = false,
}: UploadAreaProps) {
  return (
    <div className="px-4">
      <h2 className="text-xl font-semibold mb-4">上傳您的影片</h2>

      {/* 上傳進度顯示 */}
      {isUploading && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>{COMMON_TEXTS.UPLOADING}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div
        className={`flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 h-64 bg-white ${isUploading ? 'opacity-50' : ''}`}
        onClick={() =>
          !isUploading && document.getElementById('video-upload')?.click()
        }
      >
        <input
          type="file"
          accept="video/*"
          id="video-upload"
          className="hidden"
          onChange={onUpload}
          disabled={isUploading}
          aria-label="上傳影片"
        />
        <div className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
          <ImageIcon
            className="h-12 w-12 text-neutral-400 mb-2"
            aria-hidden="true"
          />
          <span className="text-neutral-500">
            {isUploading ? '正在上傳...' : '點擊選擇影片檔案上傳'}
          </span>
        </div>
      </div>
      <div className="text-neutral-500 mt-2">{fileName}</div>
      <div className="text-neutral-500 mt-2">
        {isUploading ? '正在上傳影片中 ，請稍後...' : ''}
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-1 flex items-center error-message">
          <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
}
