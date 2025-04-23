import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { X, Lock } from 'lucide-react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginWithEmail } from '@/services/api';

// 定義表單驗證規則
const formSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(1, '請輸入密碼'),
});

// 定義表單資料型別
type FormData = z.infer<typeof formSchema>;

/**
 * 電子郵件登入頁面元件
 */
export default function SignInWithEmail() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 初始化表單
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * 處理表單提交
   */
  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setErrorMessage('');

    try {
      // 調用登入 API
      const response = await loginWithEmail(data.email, data.password);

      // 檢查回應狀態
      if (response.StatusCode === 200) {
        // 登入成功，導向首頁
        router.push('/');
      } else {
        // 顯示錯誤訊息
        setErrorMessage(response.msg || '登入失敗，請確認帳號密碼');
      }
    } catch (error) {
      console.error('登入失敗:', error);
      setErrorMessage('系統錯誤，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo 和標題 */}
        <div className="flex flex-col items-center">
          <Image
            src="/login-small-logo.svg"
            alt="ANNAX"
            width={80}
            height={80}
            className="mb-6"
          />
          <h1 className="text-center text-2xl font-medium text-gray-700">
            歡迎回來!
          </h1>
        </div>

        {/* 顯示錯誤訊息 */}
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        {/* 表單區塊 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 電子郵件輸入區塊 */}
            <div className="space-y-2">
              <div className="text-gray-700">您的電子信箱</div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="請輸入您的電子信箱"
                          className="h-14 pl-4 pr-10 rounded-md bg-gray-50 text-base"
                          {...field}
                        />
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => field.onChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            aria-label="清除電子郵件"
                          >
                            <X className="h-6 w-6 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 密碼輸入區塊 */}
            <div className="space-y-2">
              <div className="text-gray-700">您的密碼</div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="請輸入您的密碼"
                          className="h-14 pl-4 pr-10 rounded-md bg-gray-50 text-base"
                          {...field}
                        />
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => field.onChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            aria-label="清除密碼"
                          >
                            <X className="h-6 w-6 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 忘記密碼連結 */}
            <div className="flex items-center justify-start">
              <Link
                href="/forgot-password"
                className="flex items-center text-[#FF4500] hover:underline"
              >
                <Lock className="mr-1 h-4 w-4" />
                忘記密碼
              </Link>
            </div>

            {/* 登入按鈕 */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-medium text-lg"
            >
              {submitting ? '處理中...' : '登入'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
