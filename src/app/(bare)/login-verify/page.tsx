import type { Metadata } from 'next';
import { LoginVerifyClient } from './login-verify-client';

// 電子郵件驗證頁 Metadata
export const metadata: Metadata = {
  title: '電子郵件驗證',
  description: '驗證郵件已發送',
};

export default function LoginVerifyPage() {
  return <LoginVerifyClient />;
}
