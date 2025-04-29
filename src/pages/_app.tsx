import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 判斷當前路徑是否為無需 Header 的頁面
  const noLayoutPages = [
    '/login',
    '/login-email',
    '/login-verify',
    '/signin-email',
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
