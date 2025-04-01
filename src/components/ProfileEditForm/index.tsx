import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, ShieldCheck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// 定義表單驗證結構
const profileFormSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: '暱稱至少需要 2 個字元' })
    .max(30, { message: '暱稱不能超過 30 個字元' }),
  email: z
    .string()
    .min(1, { message: '電子郵件為必填欄位' })
    .email({ message: '請輸入有效的電子郵件地址格式' }),
  bio: z.string().max(500, { message: '簡介不能超過 500 個字元' }).optional(),
});

// 定義表單值類型
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileEditForm() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 設定初始值
  const defaultValues: Partial<ProfileFormValues> = {
    nickname: '',
    email: 'example@gmail.com', // 假設這是已驗證的郵件
    bio: '食譜簡介料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！食譜料理中加入花生醬燉煮',
  };

  // 初始化表單
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  /**
   * 處理表單提交
   */
  const onSubmit = (data: ProfileFormValues) => {
    console.log('表單提交:', data);
    // 這裡可以加入實際的提交邏輯
    alert('個人資料已更新');
  };

  /**
   * 處理表單錯誤
   */
  const onError = (errors: any) => {
    console.error('表單錯誤:', errors);
  };

  /**
   * 處理頭像上傳
   */
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  /**
   * 處理取消變更
   */
  const handleCancel = () => {
    setShowConfirmDialog(true);
  };

  /**
   * 確認重置表單
   */
  const confirmReset = () => {
    form.reset();
    setShowConfirmDialog(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 確認對話框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認取消變更</DialogTitle>
            <DialogDescription>
              確定要取消所有變更嗎？此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              返回編輯
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              確認取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 麵包屑導航 */}
      <nav className="px-4 py-3 text-sm flex items-center gap-2">
        <Link href="/" className="hover:underline">
          首頁
        </Link>
        <span className="text-gray-500">&gt;</span>
        <Link href="/member" className="hover:underline">
          會員中心
        </Link>
        <span className="text-gray-500">&gt;</span>
        <span className="text-gray-700">編輯個人資料</span>
      </nav>

      {/* 主要內容 */}
      <main className="flex-1 px-4 py-6 md:max-w-2xl md:mx-auto w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            {/* 頭像上傳 */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="h-28 w-28 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl || '/placeholder.svg'}
                      alt="用戶頭像"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center cursor-pointer"
                >
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>

            {/* 暱稱欄位 */}
            <FormField<ProfileFormValues>
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>暱稱</FormLabel>
                  <FormControl>
                    <Input placeholder="Placeholder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 電子郵件欄位 */}
            <FormField<ProfileFormValues>
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電子郵件</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} className="pr-24" disabled />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 flex items-center">
                      <ShieldCheck className="mr-1" size={16} />
                      已驗證
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 簡介欄位 */}
            <FormField<ProfileFormValues>
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>簡介</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="介紹一下自己..."
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 按鈕區域 */}
            <div className="pt-6 space-y-3">
              <Button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-700"
              >
                儲存更新
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCancel}
              >
                取消變更
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
