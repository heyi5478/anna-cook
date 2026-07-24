import type { Metadata } from 'next';
import { LoginClient } from './login-client';

// 登入頁 Metadata（取代 Pages Router 的 next/head）
export const metadata: Metadata = {
  title: '登入',
  description: '安那煮 - 分享你的拿手美味',
};

export default function LoginPage() {
  return <LoginClient />;
}
