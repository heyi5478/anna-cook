import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { COMMON_TEXTS, ERROR_MESSAGES } from '@/lib/constants/messages';

/**
 * 登入頁面組件
 */
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 處理Google登入
   */
  const atGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log('請求 Google 登入');

      // 向我們的 API route發送請求
      const response = await fetch('/api/auth/google/google');

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.API_REQUEST_FAILED);
      }

      const data = await response.json();

      // 重定向到 Google 登入頁面
      window.location.href = data.redirectUri;
    } catch (error) {
      console.error('Google 登入錯誤:', error);
      // 這裡可以添加錯誤處理，例如顯示錯誤訊息給使用者
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 處理電子郵件登入
   */
  const atEmailLogin = () => {
    router.push('/login-email');
  };

  return (
    <>
      <Head>
        <title>登入 | 安那煮 | 家傳好菜</title>
        <meta name="description" content="安那煮 - 分享你的拿手美味" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col">
          {/* 橘色背景頂部區域 */}
          <div className="bg-[#E84A00] py-16 flex justify-center items-center">
            <div className="container flex justify-center items-center">
              <div className="relative w-full max-w-md flex justify-center">
                <Link href="/" className="cursor-pointer">
                  <Image
                    src="/login-logo.svg"
                    alt="安那煮 Logo"
                    width={400}
                    height={120}
                    className="h-auto"
                    priority
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* 登入選項區域 */}
          <div className="flex-1 flex flex-col items-center px-4 py-12">
            <h1 className="text-base font-normal text-center mb-12">
              立即加入分享你的拿手美味
            </h1>

            <div className="w-full max-w-md space-y-6">
              {/* Google登入按鈕 */}
              <Button
                variant="outline"
                className="w-full py-6 text-lg font-normal relative px-6 border-neutral-300"
                onClick={atGoogleLogin}
                disabled={isLoading}
              >
                <span className="absolute left-6">
                  <Image
                    src="/google-icon.svg"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                </span>
                <span className="mx-auto">
                  {isLoading ? COMMON_TEXTS.SUBMITTING : '使用 Google 繼續'}
                </span>
              </Button>

              {/* 分隔線 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500">或</span>
                </div>
              </div>

              {/* 電子郵件登入按鈕 */}
              <Button
                variant="outline"
                className="w-full py-6 text-lg font-normal relative px-6 border-neutral-300"
                onClick={atEmailLogin}
              >
                <span className="absolute left-6">
                  <Mail className="w-6 h-6" />
                </span>
                <span className="mx-auto">使用電子郵件繼續</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
