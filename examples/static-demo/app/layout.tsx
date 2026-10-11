import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '安那煮 Anna Cook｜首頁展示版',
  description: '安那煮首頁的靜態展示，以本地範例食譜體驗搜尋、分類與料理步驟。',
  robots: { index: false, follow: false },
  icons: { icon: '/login-small-logo.svg' },
};

export const viewport: Viewport = { themeColor: '#9d2200' };

/** 提供展示版的頁面外殼，不載入正式站的登入、追蹤或 Service Worker。 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
