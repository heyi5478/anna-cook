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
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import { fetchCurrentUserProfile, updateUserProfile } from '@/services/users';
import {
  SUCCESS_MESSAGES,
  COMMON_TEXTS,
  ERROR_MESSAGES,
} from '@/lib/constants/messages';
import { VALIDATION_MESSAGES } from '@/lib/constants/validation';
import {
  SUPPORTED_IMAGE_TYPES,
  FILE_VALIDATION_MESSAGES,
} from '@/lib/constants/file';
import {
  profilePageVariants,
  profileFormVariants,
  avatarContainerVariants,
  avatarUploadButtonVariants,
  profileFieldVariants,
  verificationBadgeVariants,
  profileButtonVariants,
  loadingStateVariants,
  errorStateVariants,
  dialogVariants,
  breadcrumbVariants,
} from './styles';

// 定義表單驗證結構
const profileFormSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: '暱稱至少需要 2 個字元' })
    .max(30, { message: '暱稱不能超過 30 個字元' }),
  email: z
    .string()
    .min(1, { message: '電子郵件為必填欄位' })
    .email({ message: VALIDATION_MESSAGES.INVALID_EMAIL }),
  bio: z.string().max(500, { message: '簡介不能超過 500 個字元' }).optional(),
});

// 定義表單值類型
type ProfileFormValues = z.infer<typeof profileFormSchema>;

/**
 * 獲取頁面狀態樣式
 */
const getPageState = (isLoading: boolean, error: string | null) => {
  if (isLoading) return 'loading';
  if (error) return 'error';
  return 'default';
};

/**
 * 獲取表單狀態樣式
 */
const getFormState = (isSubmitting: boolean) => {
  if (isSubmitting) return 'submitting';
  return 'default';
};

/**
 * 獲取按鈕狀態樣式
 */
const getButtonState = (isSubmitting: boolean, disabled: boolean = false) => {
  if (isSubmitting) return 'submitting';
  if (disabled) return 'disabled';
  return 'default';
};

/**
 * 獲取頭像上傳按鈕狀態
 */
const getAvatarUploadState = (isSubmitting: boolean) => {
  if (isSubmitting) return 'uploading';
  return 'default';
};

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
        setError(
          err instanceof Error
            ? err.message
            : ERROR_MESSAGES.LOAD_USER_DATA_FAILED,
        );
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
        title: SUCCESS_MESSAGES.UPDATE_SUCCESS,
        description: SUCCESS_MESSAGES.PROFILE_UPDATE_SUCCESS,
        variant: 'default',
      });

      // 延遲導航以便用戶可以看到成功提示
      setTimeout(() => {
        // 跳轉到用戶個人頁面
        router.push(`/user/${userDisplayId}`);
      }, 1500);
    } catch (err) {
      console.error('更新失敗:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : ERROR_MESSAGES.UPDATE_RECIPE_FAILED;

      // 顯示錯誤提示
      toast({
        title: ERROR_MESSAGES.UPDATE_RECIPE_FAILED,
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
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
        toast({
          title: '不支援的圖片格式',
          description: FILE_VALIDATION_MESSAGES.INVALID_IMAGE_TYPE,
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
      <div className={loadingStateVariants()}>
        <div className={loadingStateVariants({ layout: 'center' })}>
          <div className={loadingStateVariants({ spinner: 'default' })} />
          <p className={loadingStateVariants({ text: 'default' })}>
            載入個人資料中...
          </p>
        </div>
      </div>
    );
  }

  // 顯示錯誤狀態
  if (error) {
    return (
      <div className={loadingStateVariants()}>
        <div className={errorStateVariants({ layout: 'default' })}>
          <div
            className={errorStateVariants({
              severity: 'error',
              title: 'default',
            })}
          >
            {ERROR_MESSAGES.LOAD_FAILED}
          </div>
          <p className={errorStateVariants({ description: 'default' })}>
            {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className={profileButtonVariants({ variant: 'destructive' })}
          >
            重新載入
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={profilePageVariants({ state: getPageState(isLoading, error) })}
    >
      {/* 確認對話框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className={dialogVariants({ background: 'neutral' })}>
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
              className={profileButtonVariants({ variant: 'outline' })}
            >
              返回編輯
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReset}
              className={profileButtonVariants({ variant: 'destructive' })}
            >
              {COMMON_TEXTS.CONFIRM}取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 麵包屑導航 */}
      <Breadcrumb className={breadcrumbVariants()}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={userDisplayId ? `/user/${userDisplayId}` : '/'}
            >
              會員中心
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>編輯個人資料</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 主要內容 */}
      <main
        className={profileFormVariants({
          maxWidth: 'default',
          state: getFormState(isSubmitting),
        })}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className={profileFormVariants({ layout: 'default' })}
          >
            {/* 頭像上傳 */}
            <div className={avatarContainerVariants({ layout: 'default' })}>
              <div className={avatarContainerVariants()}>
                <div
                  className={avatarContainerVariants({
                    size: 'default',
                    shape: 'circle',
                    background: 'default',
                    state: 'default',
                  })}
                >
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
                      className="text-neutral-500"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={avatarUploadButtonVariants({
                    size: 'default',
                    color: 'default',
                    state: getAvatarUploadState(isSubmitting),
                  })}
                >
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept={SUPPORTED_IMAGE_TYPES.join(',')}
                    className="hidden"
                    onChange={handleAvatarChange}
                    ref={avatarFileInputRef}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            </div>

            {/* 暱稱欄位 */}
            <FormField<ProfileFormValues>
              control={form.control}
              name="nickname"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>暱稱</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="請輸入暱稱"
                      className={profileFieldVariants({
                        type: 'default',
                        state: fieldState.error ? 'error' : 'default',
                        width: 'full',
                      })}
                      disabled={isSubmitting}
                      {...field}
                    />
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
                      <Input
                        className={profileFieldVariants({
                          type: 'email',
                          state: 'verified',
                          width: 'full',
                        })}
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <div
                      className={verificationBadgeVariants({
                        status: 'verified',
                      })}
                    >
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
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>簡介</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="介紹一下自己..."
                      className={profileFieldVariants({
                        type: 'textarea',
                        state: fieldState.error ? 'error' : 'default',
                        width: 'full',
                      })}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 按鈕區域 */}
            <div className={profileButtonVariants({ spacing: 'group' })}>
              <Button
                type="submit"
                className={profileButtonVariants({
                  variant: 'primary',
                  size: 'full',
                  state: getButtonState(isSubmitting),
                })}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? COMMON_TEXTS.SAVING
                  : `${COMMON_TEXTS.SAVE}更新`}
              </Button>
              <Button
                type="button"
                variant="outline"
                className={profileButtonVariants({
                  variant: 'outline',
                  size: 'full',
                  state: getButtonState(false, isSubmitting),
                })}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {COMMON_TEXTS.CANCEL}變更
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
