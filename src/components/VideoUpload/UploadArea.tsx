import type React from 'react';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';

/**
 * 上傳區域元件屬性
 */
type UploadAreaProps = {
  fileName: string;
  error?: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * 影片上傳區域元件，顯示上傳介面和檔案選擇功能
 */
export default function UploadArea({
  fileName,
  error,
  onUpload,
}: UploadAreaProps) {
  return (
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
          onChange={onUpload}
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
      {error && (
        <div className="text-red-500 text-sm mt-1 flex items-center error-message">
          <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
}
