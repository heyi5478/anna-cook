/**
 * UserCenter 頁面相關的類型定義
 */

/**
 * 我的最愛標籤類型
 * 用於切換不同的最愛內容顯示
 */
export type FavoriteTabType = '已追蹤' | '已收藏';

/**
 * 用戶中心主元件的 Props 類型
 * 包含用戶資料和預設顯示標籤
 */
export interface UserCenterProps {
  /** 預設顯示的標籤，不提供則顯示"總覽" */
  defaultTab?: string;
  /** 用戶資料，包含用戶基本資訊及作者數據 */
  userProfileData: {
    StatusCode: number;
    isMe: boolean;
    userData: {
      userId: number;
      displayId: string;
      isFollowing: boolean;
      accountName: string;
      profilePhoto: string;
      description: string;
      recipeCount: number;
      followerCount: number;
    } | null;
    authorData: {
      userId: number;
      displayId: string;
      accountName: string;
      followingCount: number;
      followerCount: number;
      favoritedTotal: number;
      myFavoriteCount: number;
      averageRating: number;
      totalViewCount: number;
    } | null;
  };
}

/**
 * 用戶資料卡片元件的 Props 類型
 * 用於顯示用戶基本資訊和統計數據
 */
export interface UserProfileCardProps {
  /** 用戶名稱 */
  userName: string;
  /** 用戶頭像 URL */
  userAvatar: string;
  /** 追蹤中數量 */
  followingCount: number;
  /** 粉絲數量 */
  followerCount: number;
  /** 被收藏總數 */
  favoritedTotal: number;
  /** 總瀏覽次數 */
  totalViewCount: number;
  /** 平均評分 */
  averageRating: number;
  /** 用戶顯示 ID */
  displayId: string;
  /** 編輯資料按鈕點擊事件 */
  onEditProfile: () => void;
}

/**
 * 食譜統計項目元件的 Props 類型
 * 用於顯示單一食譜的數據統計
 */
export interface RecipeStatsItemProps {
  /** 食譜標題 */
  title?: string;
  /** 評分 */
  rating?: number;
  /** 瀏覽次數 */
  views?: number;
  /** 收藏次數 */
  bookmarks?: number;
  /** 留言次數 */
  comments?: number;
  /** 分享次數 */
  shares?: number;
  /** 封面圖片 URL */
  imageSrc?: string;
}

/**
 * 追蹤用戶卡片元件的 Props 類型
 * 用於顯示已追蹤的用戶資訊
 */
export interface FollowedUserCardProps {
  /** 用戶名稱 */
  username?: string;
  /** 個人簡介 */
  bio?: string;
  /** 食譜數量 */
  recipesCount?: number;
  /** 粉絲數量 */
  followersCount?: number;
  /** 頭像 URL */
  avatarSrc?: string;
}

/**
 * 刪除確認對話框元件的 Props 類型
 * 用於確認刪除操作的對話框
 */
export interface DeleteConfirmDialogProps {
  /** 對話框是否開啟 */
  isOpen: boolean;
  /** 是否正在執行刪除操作 */
  isDeleting: boolean;
  /** 已選擇的草稿數量 */
  selectedCount: number;
  /** 錯誤訊息 */
  errorMessage?: string | null;
  /** 確認刪除事件 */
  onConfirm: () => void;
  /** 取消刪除事件 */
  onCancel: () => void;
  /** 對話框開啟狀態變更事件 */
  onOpenChange: (open: boolean) => void;
}

/**
 * 食譜操作列元件的 Props 類型
 * 用於食譜的新增和刪除操作按鈕
 */
export interface RecipeActionBarProps {
  /** 是否為刪除模式 */
  isDeleteMode: boolean;
  /** 已選擇的草稿 ID 列表 */
  selectedDrafts: number[];
  /** 新增食譜按鈕點擊事件 */
  onNewRecipe: () => void;
  /** 切換刪除模式事件 */
  onToggleDeleteMode: () => void;
  /** 顯示刪除確認對話框事件 */
  onShowDeleteConfirm: () => void;
}
