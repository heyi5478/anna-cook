import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 註冊 Service Worker（PWA 可安裝；本階段不做離線快取）
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 註冊失敗不影響網站運作
      });
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // 判斷當前路徑是否為無需 Header 的頁面
  const noLayoutPages = [
    '/login',
    '/login-email',
    '/login-verify',
    '/signin-email',
    '/recipe-video',
  ];
  const shouldUseLayout = !noLayoutPages.includes(router.pathname);

  return (
    <>
      {shouldUseLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
      <Toaster />
    </>
  );
}
