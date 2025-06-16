import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { COUNTDOWN } from '@/lib/constants';

/**
 * 電子郵件驗證提示頁面
 */
export default function VerifyEmailPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(
    COUNTDOWN.LOGIN_VERIFY_SECONDS,
  );

  /**
   * 設置倒數計時並自動跳轉
   */
  useEffect(() => {
    // 如果計時結束，跳轉到登入頁面
    if (countdown <= 0) {
      router.push('/signin-email');
      return undefined;
    }

    // 每秒減少倒數計時器
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, COUNTDOWN.TIMER_INTERVAL_MS);

    // 清理計時器
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/login-small-logo.svg"
            alt="ANNAX"
            width={80}
            height={80}
            className="mb-6"
          />
        </div>

        {/* 訊息區塊 */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-medium text-neutral-800">
            驗證郵件已發送
          </h1>
          <p className="text-neutral-600">
            我們已向您的電子郵件地址發送了一封驗證郵件。請檢查您的收件箱並點擊郵件中的連結完成註冊。
          </p>
          <p className="text-neutral-500 text-sm">
            {countdown} 秒後將自動跳轉到登入頁面...
          </p>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 p-4 bg-neutral-50 rounded-md">
          <p className="text-sm text-neutral-500">
            如果您沒有收到驗證郵件，請檢查您的垃圾郵件或垃圾桶。
            <br />
            郵件可能需要幾分鐘時間才能到達您的收件箱。
          </p>
        </div>
      </div>
    </div>
  );
}
