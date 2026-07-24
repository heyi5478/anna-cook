import type { Metadata } from 'next';
import { LoginEmailClient } from './login-email-client';

// 電子郵件註冊頁 Metadata
export const metadata: Metadata = {
  title: '電子郵件註冊',
  description: '使用電子郵件註冊安那煮 Anna Cook 帳號',
};

export default function LoginEmailPage() {
  return <LoginEmailClient />;
}
