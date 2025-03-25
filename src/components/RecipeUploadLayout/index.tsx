import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

// 定義表單驗證 schema
const recipeFormSchema = z.object({
  recipeName: z.string().min(2, { message: "食譜名稱至少需要 2 個字元" }),
  coverImage: z.instanceof(File).optional(),
  agreement: z.literal(true, {
    errorMap: () => ({ message: "請同意條款才能繼續" }),
  }),
});

// 定義表單資料型別
type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export default function RecipeUploadForm() {
  // 設定目前步驟狀態
  const [currentStep, setCurrentStep] = useState(1);

  // 設定預覽圖片狀態
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 初始化 react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      recipeName: "",
      agreement: undefined,
    },
  });

  // 處理表單提交
  const atSubmit = (data: RecipeFormValues) => {
    console.log("表單資料:", data);
    setCurrentStep(2);
  };

  // 處理圖片上傳
  const atImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 麵包屑導航 */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <a href="/" className="hover:underline">
          首頁
        </a>
        <span>&gt;</span>
        <a href="/recipes" className="hover:underline">
          建立食譜
        </a>
        <span>&gt;</span>
        <span className="text-gray-500">上傳食譜名稱</span>
      </nav>

      {/* 步驟指示器 */}
      <div className="mb-10">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200" />

          {[1, 2, 3].map((step) => (
            <div key={step} className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center z-10",
                  currentStep >= step
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-500"
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
        {/* 食譜名稱輸入 */}
        <div className="mb-6">
          <label htmlFor="recipeName" className="block text-lg font-medium mb-2">
            輸入食譜名稱
          </label>
          <div className="relative">
            <input
              id="recipeName"
              type="text"
              placeholder="在此輸入食譜名稱"
              className={cn(
                "w-full px-10 py-3 border rounded-md bg-gray-50",
                errors.recipeName ? "border-red-500" : "border-gray-300"
              )}
              {...register("recipeName")}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
            </div>
          </div>
          {errors.recipeName && <p className="mt-1 text-sm text-red-500">{errors.recipeName.message}</p>}
        </div>

        {/* 上傳封面圖片 */}
        <div className="mb-6">
          <label htmlFor="coverImage" className="block text-lg font-medium mb-2">
            上傳封面圖片
          </label>
          <div
            className="border border-gray-300 rounded-md bg-gray-50 p-4 h-64 flex items-center justify-center cursor-pointer"
            onClick={() => document.getElementById("coverImage")?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="預覽圖片"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-gray-500 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
            )}
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("coverImage", {
                onChange: atImageChange,
              })}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">videoexample.png</p>
        </div>

        {/* 同意條款 */}
        <div className="mb-6">
          <label htmlFor="agreement" className="flex items-center">
            <input
              id="agreement"
              type="checkbox"
              className={cn("w-5 h-5 mr-2", errors.agreement ? "border-red-500" : "")}
              {...register("agreement")}
            />
            <span className="text-sm">我已同意XX公司隱私及著作權條款</span>
          </label>
          {errors.agreement && <p className="mt-1 text-sm text-red-500">{errors.agreement.message}</p>}
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

