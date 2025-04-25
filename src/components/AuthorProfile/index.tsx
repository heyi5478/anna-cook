import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Author, Recipe } from './types';
import { AuthorInfo } from './AuthorInfo';
import { AuthorRecipes } from './AuthorRecipes';

interface AuthorProfileProps {
  author: Author;
  recipes: Recipe[];
}

/**
 * 顯示作者個人頁面，包含作者資訊和食譜列表
 */
export const AuthorProfile = ({ author, recipes }: AuthorProfileProps) => {
  /**
   * 處理追蹤按鈕點擊事件
   */
  const atFollowClick = () => {
    console.log('Follow clicked');
    // 實際應用中會呼叫API進行追蹤/取消追蹤
  };

  /**
   * 處理分享按鈕點擊事件
   */
  const atShareClick = () => {
    console.log('Share clicked');
    // 實際應用中會開啟分享選單
  };

  /**
   * 處理載入更多食譜事件
   */
  const atLoadMoreRecipes = () => {
    console.log('Load more recipes');
    // 實際應用中會呼叫API獲取更多食譜
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      {/* 麵包屑導航 */}
      <div className="bg-white p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/authors">查看用戶</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 作者資料區塊 */}
      <AuthorInfo
        author={author}
        onFollowClick={atFollowClick}
        onShareClick={atShareClick}
      />

      {/* 食譜區塊 */}
      <AuthorRecipes
        recipes={recipes}
        recipeCount={author.recipeCount}
        onLoadMore={atLoadMoreRecipes}
      />
    </main>
  );
};

export default AuthorProfile;
