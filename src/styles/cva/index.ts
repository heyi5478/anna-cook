/**
 * CVA 樣式集中管理
 */
/**
 * 食譜草稿頁面樣式變體
 * 用於食譜編輯、草稿保存等功能
 */
export * from './recipe-draft';
export type {
  DraftPageVariants,
  DraftSectionVariants,
  DraftFieldVariants,
  DraftButtonVariants,
  DraftLabelVariants,
  ErrorMessageVariants,
  StepAccordionVariants,
  VideoContainerVariants,
  TagItemVariants,
  IngredientRowVariants,
  LoadingStateVariants,
  SpacingVariants,
} from './recipe-draft';

/**
 * 食譜詳細頁面樣式變體
 * 用於食譜展示、評分、步驟顯示等功能
 */
export * from './recipe-page';
export type {
  RecipePageContainerProps,
  RecipePageHeaderProps,
  RecipePageCardProps,
  RecipePageIngredientProps,
  RecipePageStepProps,
  RecipePageRatingProps,
} from './recipe-page';

/**
 * 食譜草稿影片頁面樣式變體
 * 用於食譜影片編輯、時間標記、步驟同步等功能
 */
export * from './recipe-draft-video';
export type {
  RecipeDraftVideoContainerProps,
  RecipeDraftVideoPlayerProps,
  RecipeDraftVideoStepPanelProps,
  RecipeDraftVideoTimeMarkerProps,
  RecipeDraftVideoTimelineProps,
  RecipeDraftVideoStepItemProps,
  RecipeDraftVideoDescriptionProps,
  RecipeDraftVideoNavigationProps,
  RecipeDraftVideoBreadcrumbProps,
} from './recipe-draft-video';

/**
 * 用戶中心頁面樣式變體
 * 用於用戶個人資料、收藏、草稿等功能
 */
export * from './user-center';
export type {
  UserCenterContainerProps,
  UserCenterSidebarProps,
  UserCenterContentProps,
  UserCenterTabProps,
  UserCenterCardProps,
  UserCenterStatsProps,
  UserCenterActionProps,
} from './user-center';

/**
 * 個人資料編輯表單樣式變體
 * 用於用戶資料編輯、設定修改等功能
 */
export * from './profile-edit-form';
export type {
  ProfileEditContainerProps,
  ProfileEditSectionProps,
  ProfileEditInputProps,
  ProfileEditAvatarProps,
  ProfileEditButtonProps,
} from './profile-edit-form';

/**
 * 作者個人資料頁面樣式變體
 * 用於作者展示、作品列表、關注等功能
 */
export * from './author-profile';
export type {
  AuthorProfileContainerProps,
  AuthorProfileHeaderProps,
  AuthorProfileAvatarProps,
  AuthorProfileStatsProps,
  AuthorProfileFollowButtonProps,
  AuthorProfileGridProps,
  AuthorProfileRecipeCardProps,
  AuthorProfileBioProps,
} from './author-profile';

/**
 * 聯絡我們頁面樣式變體
 * 用於聯絡表單、客服相關功能
 */
export * from './contact-us';
export type {
  ContactUsContainerProps,
  ContactUsFormProps,
  ContactUsFieldProps,
  ContactUsButtonProps,
} from './contact-us';

/**
 * 影片上傳頁面樣式變體
 * 用於影片上傳、編輯、分段等功能
 */
export * from './video-upload';
export type {
  VideoUploadContainerProps,
  VideoUploadAreaProps,
  VideoUploadPlayerProps,
  VideoUploadTimelineProps,
  VideoUploadSegmentProps,
  VideoUploadProgressProps,
  VideoUploadButtonProps,
  VideoUploadStatusProps,
} from './video-upload';

/**
 * 通用變體配置類型
 * 定義常用的變體選項，確保跨組件的一致性
 */
export interface CommonVariants {
  /** 主要變體類型 */
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error';
  /** 尺寸變體 */
  size?: 'sm' | 'md' | 'lg';
  /** 狀態變體 */
  state?: 'default' | 'loading' | 'disabled' | 'error' | 'success';
}

/**
 * 容器佈局變體配置
 * 用於定義容器的佈局方式
 */
export interface LayoutVariants {
  /** 佈局類型 */
  layout?: 'single' | 'split' | 'sidebar' | 'grid';
  /** 間距設定 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** 最大寬度 */
  variant?: 'default' | 'compact' | 'wide' | 'full';
}

/**
 * 互動變體配置
 * 用於定義組件的互動行為
 */
export interface InteractiveVariants {
  /** 是否可互動 */
  interactive?: boolean;
  /** 寬度設定 */
  width?: 'auto' | 'full' | 'fit';
  /** 間距設定 */
  spacing?: 'tight' | 'normal' | 'loose';
}

// =============================================================================
// 樣式工具函數
// =============================================================================

/**
 * 組合多個 CVA 樣式的工具函數
 */
export const combineStyles = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * 根據條件應用樣式的工具函數
 */
export const conditionalStyle = (
  condition: boolean,
  trueStyle: string,
  falseStyle?: string,
): string => {
  return condition ? trueStyle : falseStyle || '';
};

// =============================================================================
// 預設配置
// =============================================================================

/**
 * CVA 預設配置
 * 定義整個應用程式的預設樣式配置
 */
export const cvaDefaults = {
  /** 預設變體 */
  variant: 'default' as const,
  /** 預設尺寸 */
  size: 'md' as const,
  /** 預設狀態 */
  state: 'default' as const,
  /** 預設佈局 */
  layout: 'single' as const,
  /** 預設間距 */
  padding: 'md' as const,
} as const;

/**
 * 主題色彩配置
 * 定義應用程式的主要色彩系統
 */
export const themeColors = {
  primary: 'blue',
  secondary: 'gray',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'blue',
} as const;

// =============================================================================
// 未來擴展預留
// =============================================================================

/**
 * 預留給未來功能模塊的導出區域
 *
 * 計劃新增的模塊：
 * - notification (通知系統)
 * - modal (彈窗模組)
 * - navigation (導航組件)
 * - search (搜尋功能)
 * - filter (篩選功能)
 * - pagination (分頁功能)
 * - breadcrumb (麵包屑導航)
 * - dropdown (下拉選單)
 * - tooltip (提示框)
 * - loading (載入狀態)
 */

// 範例：未來模塊導出格式
// export * from './notification';
// export * from './modal';
// export * from './navigation';

/**
 * CVA 樣式系統版本資訊
 */
export const CVA_VERSION = '1.0.0' as const;

/**
 * 最後更新時間
 */
export const LAST_UPDATED = '2024-01-01T00:00:00.000Z';
