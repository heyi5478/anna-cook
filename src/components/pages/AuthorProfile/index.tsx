'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils/ui';
import type { Author } from '@/types/recipe';
import {
  profileContainerVariants,
  authorCardVariants,
} from '@/styles/cva/author-profile';
import { AuthorInfo } from './AuthorInfo';
import { AuthorRecipes } from './AuthorRecipes';

interface AuthorProfileProps {
  author: Author;
  isMe?: boolean;
  displayId?: string;
}

/**
 * 顯示作者個人頁面，包含作者資訊和食譜列表
 */
export const AuthorProfile = ({
  author,
  isMe = false,
  displayId,
}: AuthorProfileProps) => {
  // 從 URL 獲取 displayId (如果沒有直接傳入)
  const params = useParams();

  // 顯示 author 的值，Debug 用
  console.log('AuthorProfile/index.tsx - author:', author);
  console.log('AuthorProfile/index.tsx - displayId:', displayId);

  // 獲取 URL 中的 displayId
  let urlDisplayId: string | undefined;
  if (params?.displayId) {
    if (Array.isArray(params.displayId)) {
      const [firstDisplayId] = params.displayId;
      urlDisplayId = firstDisplayId;
    } else {
      urlDisplayId = params.displayId;
    }
  }

  // 優先使用傳入的 displayId，其次使用 URL 中的 displayId，最後使用 author.id
  const effectiveDisplayId = displayId || urlDisplayId || author.id;

  /**
   * 處理分享按鈕點擊事件
   */
  const atShareClick = () => {
    console.log('Share clicked');
    // 實際應用中會開啟分享選單
  };

  return (
    <main className={cn(profileContainerVariants())}>
      {/* 麵包屑導航 */}
      <div className={cn(authorCardVariants())}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/user">查看用戶</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 作者資料區塊 */}
      <AuthorInfo author={author} onShareClick={atShareClick} />

      {/* 食譜區塊 */}
      <AuthorRecipes displayId={String(effectiveDisplayId)} isMe={isMe} />
    </main>
  );
};

export default AuthorProfile;
