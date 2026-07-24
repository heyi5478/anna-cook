import type { Metadata } from 'next';
import { SigninEmailClient } from './signin-email-client';

// 電子郵件登入頁 Metadata
export const metadata: Metadata = {
  title: '電子郵件登入',
  description: '登入安那煮 Anna Cook',
};

export default function SigninEmailPage() {
  return <SigninEmailClient />;
}
