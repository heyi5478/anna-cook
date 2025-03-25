import type React from 'react';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// 定義表單驗證 schema
const recipeStep3Schema = z.object({
  video: z
    .instanceof(File)
    .refine((file) => file.size <= 100 * 1024 * 1024, {
      message: '影片檔案大小不能超過 100MB',
    })
    .refine(
      (file) =>
        [
          'video/mp4',
          'video/quicktime',
          'video/x-msvideo',
          'video/x-ms-wmv',
        ].includes(file.type),
      {
        message: '請上傳有效的影片檔案 (MP4, MOV, AVI, WMV)',
      },
    )
    .optional(),
});

// 定義表單資料型別
type RecipeStep3Values = z.infer<typeof recipeStep3Schema>;

// 食譜上傳第三步驟元件
export default function RecipeUploadStep3() {
  // 設定目前步驟狀態
  const currentStep = 3;

  // 設定影片預覽狀態
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  // 建立檔案輸入參考
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化 react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeStep3Values>({
    resolver: zodResolver(recipeStep3Schema),
  });

  // 處理表單提交
  const atSubmit = (data: RecipeStep3Values) => {
    console.log('表單資料:', data);
    // 這裡可以處理表單提交後的邏輯，例如導航到下一頁或顯示成功訊息
    alert('食譜上傳成功！');
  };

  // 處理影片上傳
  const atVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  // 處理點擊上傳區域
  const atUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // 註冊 video 輸入框
  const videoRegister = register('video');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 麵包屑導航 */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="hover:underline">
          首頁
        </Link>
        <span>&gt;</span>
        <Link href="/recipes" className="hover:underline">
          建立食譜
        </Link>
        <span>&gt;</span>
        <span className="text-gray-500">上傳食譜影片</span>
      </nav>

      {/* 步驟指示器 */}
      <div className="mb-10">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200" />

          {[1, 2, 3].map((step) => (
            <div key={step} className="relative flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center z-10',
                  currentStep >= step
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-500',
                )}
              >
                {step}
              </div>
              <span className="mt-2 text-sm font-medium">Step {step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 表單 */}
      <form onSubmit={handleSubmit(atSubmit)}>
        {/* 上傳影片區域 */}
        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="video" className="block text-lg font-medium mb-2">
            上傳您的影片
          </label>
          <div
            className="border border-gray-300 rounded-md bg-gray-50 p-4 h-96 flex flex-col items-center justify-center cursor-pointer"
            onClick={atUploadAreaClick}
          >
            {videoPreviewUrl ? (
              <video
                src={videoPreviewUrl}
                controls
                className="max-h-full max-w-full object-contain"
              >
                <track kind="captions" src="" label="中文" default />
                您的瀏覽器不支援影片標籤
              </video>
            ) : (
              <div className="text-gray-500 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <p className="mt-4 text-center">
                  點擊上傳影片或拖放檔案至此處
                  <br />
                  <span className="text-sm">
                    支援的格式：MP4, MOV, AVI, WMV (最大 100MB)
                  </span>
                </p>
              </div>
            )}
            <input
              id="video"
              type="file"
              accept="video/*"
              className="hidden"
              ref={(e) => {
                fileInputRef.current = e;
                videoRegister.ref(e);
              }}
              onChange={(e) => {
                videoRegister.onChange(e);
                atVideoChange(e);
              }}
              name={videoRegister.name}
              onBlur={videoRegister.onBlur}
            />
          </div>
          {videoFile && (
            <p className="mt-1 text-sm text-gray-500">{videoFile.name}</p>
          )}
          {!videoFile && (
            <p className="mt-1 text-sm text-gray-500">videoexample.avi</p>
          )}
          {errors.video && (
            <p className="mt-1 text-sm text-red-500">{errors.video.message}</p>
          )}
        </div>

        {/* 下一步按鈕 */}
        <button
          type="submit"
          className="w-full py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
        >
          下一步
        </button>
      </form>
    </div>
  );
}
