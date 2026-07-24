import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerRegister } from './service-worker-register';

// 全站 Metadata（取代 Pages Router _document 的 favicon / manifest / apple 標籤）
export const metadata: Metadata = {
  title: {
    default: '安那煮 | 家傳好菜－Anna Cook',
    template: '%s｜安那煮 Anna Cook',
  },
  description: '安那煮 Anna Cook 家傳好菜食譜教學平台，讓做菜變簡單。',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/login-small-logo.svg',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Anna Cook',
    statusBarStyle: 'default',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

// 全站 Viewport（取代 _document 的 theme-color）
export const viewport: Viewport = {
  themeColor: '#ff500a',
};

const GTM_ID = 'GTM-NNV6TXNP';

// App Router 根版面：提供 html/body 外殼、GTM、全域樣式與共用 client 元件
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>

        {children}

        <Toaster />
        <ServiceWorkerRegister />

        {/* Google Tag Manager */}
        <Script
          id="gtm-base"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        />
        <Script id="gtm-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GTM_ID}');`}
        </Script>
      </body>
    </html>
  );
}
