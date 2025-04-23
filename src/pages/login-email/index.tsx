import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

// 定義表單驗證規則
const formSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(8, '密碼至少需要8個字元'),
  agreement: z.boolean().refine((val) => val === true, {
    message: '您必須同意條款才能繼續',
  }),
});

// 定義表單資料型別
type FormData = z.infer<typeof formSchema>;

/**
 * 電子郵件註冊頁面元件
 */
export default function RegisterWithEmail() {
  const [submitting, setSubmitting] = useState(false);

  // 初始化表單
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      agreement: false,
    },
  });

  /**
   * 處理表單提交
   */
  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // 這裡實作註冊邏輯
      console.log('註冊資料:', data);
      // 模擬API請求
      await new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });
      // 成功後可以重定向到其他頁面
    } catch (error) {
      console.error('註冊失敗:', error);
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
            使用 電子郵件 註冊
          </h1>
        </div>

        {/* 表單區塊 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 電子郵件輸入區塊 */}
            <div className="space-y-2">
              <div className="text-gray-700">電子郵件設定</div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="請輸入電子郵件地址"
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
              <div className="text-gray-700">密碼設定</div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="請輸入密碼"
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

            {/* 同意條款勾選區塊 */}
            <FormField
              control={form.control}
              name="agreement"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-6 w-6 rounded data-[state=checked]:bg-[#FF4500] data-[state=checked]:text-white border-gray-300"
                    />
                  </FormControl>
                  <div className="text-sm text-gray-700 leading-normal">
                    我已同意本公司隱私及著作權條款
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 已有帳號連結 */}
            <div className="flex items-center justify-start">
              <span className="text-gray-700">已有帳號? </span>
              <Link
                href="/signin-email"
                className="ml-1 text-[#FF4500] hover:underline"
              >
                登入帳號
              </Link>
            </div>

            {/* 註冊按鈕 */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-medium text-lg"
            >
              {submitting ? '處理中...' : '註冊'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
