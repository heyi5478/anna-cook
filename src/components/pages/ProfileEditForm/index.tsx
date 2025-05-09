import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { fetchCurrentUserProfile, updateUserProfile } from '@/services/api';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDisplayId, setUserDisplayId] = useState<string>('');
  const router = useRouter();
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 設定預設初始值
  const defaultValues: Partial<ProfileFormValues> = {
    nickname: '',
    email: '',
    bio: '',
  };

  // 初始化表單
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  // 從 API 獲取用戶資料
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchCurrentUserProfile();

        // 更新表單資料
        form.reset({
          nickname: response.data.accountName,
          email: response.data.accountEmail,
          bio: response.data.description || '',
        });

        // 設定頭像
        if (response.data.profilePhoto) {
          setAvatarUrl(response.data.profilePhoto);
        }

        // 儲存使用者 displayId
        setUserDisplayId(response.data.displayId);
      } catch (err) {
        console.error('載入用戶資料失敗:', err);
        setError(err instanceof Error ? err.message : '載入用戶資料失敗');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [form]);

  /**
   * 處理表單提交
   */
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);

      const updateData = {
        accountName: data.nickname,
        description: data.bio || '',
      };

      // 發送更新請求
      const response = await updateUserProfile(
        updateData,
        avatarFile || undefined,
      );

      console.log('更新成功:', response);

      // 顯示成功提示
      toast({
        title: '更新成功',
        description: '您的個人資料已成功更新',
        variant: 'default',
      });

      // 延遲導航以便用戶可以看到成功提示
      setTimeout(() => {
        // 跳轉到用戶個人頁面
        router.push(`/user/${userDisplayId}`);
      }, 1500);
    } catch (err) {
      console.error('更新失敗:', err);
      const errorMessage = err instanceof Error ? err.message : '更新資料失敗';

      // 顯示錯誤提示
      toast({
        title: '更新失敗',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  /**
   * 處理表單錯誤
   */
  const onError = (errors: any) => {
    console.error('表單錯誤:', errors);

    // 顯示表單錯誤提示
    toast({
      title: '表單填寫有誤',
      description: '請檢查並修正表單中的錯誤',
      variant: 'destructive',
    });
  };

  /**
   * 處理頭像上傳
   */
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 檢查檔案類型
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast({
          title: '不支援的圖片格式',
          description: '只允許上傳 JPG、JPEG 或 PNG 圖片',
          variant: 'destructive',
        });
        return;
      }

      // 檢查檔案大小 (限制為 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: '檔案太大',
          description: '頭像圖片大小不能超過 5MB',
          variant: 'destructive',
        });
        return;
      }

      // 設定預覽
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);

      // 保存檔案以便上傳
      setAvatarFile(file);
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

    // 重置頭像選擇
    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.value = '';
    }
    setAvatarFile(null);

    setShowConfirmDialog(false);

    // 跳轉到用戶個人頁面
    if (userDisplayId) {
      router.push(`/user/${userDisplayId}`);
    } else {
      router.push('/');
    }
  };

  // 顯示載入中狀態
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">載入個人資料中...</p>
        </div>
      </div>
    );
  }

  // 顯示錯誤狀態
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
          <div className="text-red-500 text-xl mb-4">載入失敗</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            重新載入
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 確認對話框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gray-100">
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
      <Breadcrumb className="px-4 py-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/user">會員中心</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>編輯個人資料</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={handleAvatarChange}
                    ref={avatarFileInputRef}
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
                    <Input placeholder="請輸入暱稱" {...field} />
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
                disabled={isSubmitting}
              >
                {isSubmitting ? '儲存中...' : '儲存更新'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCancel}
                disabled={isSubmitting}
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
