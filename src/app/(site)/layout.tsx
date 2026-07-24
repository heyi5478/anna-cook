import type { ReactNode } from 'react';
import { Layout } from '@/components/layout';

// (site) 路由群組版面：套用含 Header／Footer 的通用佈局
// 對應 Pages Router _app.tsx 中「需要 Header」的頁面；不需 Header 的頁面日後另置於其他 route group
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
