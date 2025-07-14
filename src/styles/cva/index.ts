/**
 * CVA 樣式集中管理
 */
/**
 * 食譜草稿頁面樣式變體
 * 用於食譜編輯、草稿保存等功能
 */
// =============================================================================
// 樣式工具函數
// =============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export * from './recipe-draft';

/**
 * 食譜詳細頁面樣式變體
 * 用於食譜展示、評分、步驟顯示等功能
 */
export * from './recipe-page';

/**
 * 食譜草稿影片頁面樣式變體
 * 用於食譜影片編輯、時間標記、步驟同步等功能
 */
export {
  // 重新命名避免衝突的變體
  loadingStateVariants as videoDraftLoadingStateVariants,
  videoContainerVariants as videoDraftVideoContainerVariants,
  errorStateVariants as videoDraftErrorStateVariants,
  timeDisplayVariants as videoDraftTimeDisplayVariants,
  timeRangeDisplayVariants as videoDraftTimeRangeDisplayVariants,
  // 其他變體保持原樣
  draftVideoEditorVariants,
  videoPlayerSectionVariants,
  stepNavigationVariants,
  stepNavigationButtonVariants,
  stepIndicatorVariants,
  timelineVariants,
  timelineMarkerVariants,
  timelineControlVariants,
  sliderVariants,
  sliderThumbVariants,
  submitControlVariants,
  breadcrumbNavigationVariants,
  transitionVariants,
  interactionStateVariants,
} from './recipe-draft-video';

// Recipe Draft Video 類型導出
export type {
  DraftVideoEditorVariantsProps,
  VideoPlayerSectionVariantsProps,
  VideoContainerVariantsProps as VideoDraftVideoContainerVariantsProps,
  TimeDisplayVariantsProps as VideoDraftTimeDisplayVariantsProps,
  StepNavigationVariantsProps,
  StepNavigationButtonVariantsProps,
  StepIndicatorVariantsProps,
  TimelineVariantsProps,
  TimelineMarkerVariantsProps,
  TimelineControlVariantsProps,
  SliderVariantsProps,
  SliderThumbVariantsProps,
  TimeRangeDisplayVariantsProps as VideoDraftTimeRangeDisplayVariantsProps,
  SubmitControlVariantsProps,
  LoadingStateVariantsProps as VideoDraftLoadingStateVariantsProps,
  ErrorStateVariantsProps as VideoDraftErrorStateVariantsProps,
  BreadcrumbNavigationVariantsProps,
  TransitionVariantsProps,
  InteractionStateVariantsProps,
} from './recipe-draft-video';

/**
 * 用戶中心頁面樣式變體
 * 用於用戶個人資料、收藏、草稿等功能
 */
export {
  // 重新命名避免衝突的變體
  loadingStateVariants as userCenterLoadingStateVariants,
  breadcrumbVariants as userCenterBreadcrumbVariants,
  dialogVariants as userCenterDialogVariants,
  loadMoreButtonVariants as userCenterLoadMoreButtonVariants,
  recipeTitleVariants as userCenterRecipeTitleVariants,
  // 其他變體保持原樣
  tabTriggerVariants,
  tabContentVariants,
  cardContainerVariants,
  statsItemVariants,
  sectionTitleVariants,
  sectionContainerVariants,
  tabsListVariants,
  draftTabContainerVariants,
  statusMessageVariants,
  countTextVariants,
  cardContainerBaseVariants,
  draftCardInteractionVariants,
  checkboxVariants,
  cardImageVariants,
  cardContentVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardStatsVariants,
  cardStatsItemVariants,
  cardActionButtonVariants,
  dialogTitleVariants,
  dialogIconVariants,
  dialogButtonContainerVariants,
  dialogActionButtonVariants,
  itemListContainerVariants,
  itemContentVariants,
  successStateVariants,
  successTitleVariants,
  successDescriptionVariants,
  favoriteTabContainerVariants,
  followTabContainerVariants,
  statsCountTextVariants,
  favoriteItemContainerVariants,
  followItemContainerVariants,
  itemImageContainerVariants,
  itemContentAreaVariants,
  itemTitleRowVariants,
  itemTitleVariants,
  itemIconVariants,
  itemDescriptionVariants,
  itemStatsRowVariants,
  statsIconVariants,
  statsItemSpacingVariants,
  loadMoreStateVariants,
  tabEmptyStateVariants,
  dataTabContainerVariants,
  dataTitleVariants,
  dataDescriptionVariants,
  dataCardContainerVariants,
  recipeStatsContainerVariants,
  recipeInfoContainerVariants,
  recipeImageContainerVariants,
  recipeImageVariants,
  recipeContentContainerVariants,
  recipeRatingInfoVariants,
  statsGridVariants,
  statsItemCardVariants,
  statsLabelVariants,
  statsValueVariants,
  userCardContainerVariants,
  userAvatarContainerVariants,
  userInfoContainerVariants,
  usernameVariants,
  userBioVariants,
  userStatsVariants,
  publishedTabContainerVariants,
  publishedCountTextVariants,
  publishedCardContainerVariants,
} from './user-center';

// User Center 類型導出
export type {
  BreadcrumbVariantsProps as UserCenterBreadcrumbVariantsProps,
  TabTriggerVariantsProps,
  TabContentVariantsProps,
  CardContainerVariantsProps,
  StatsItemVariantsProps,
  LoadingStateVariantsProps as UserCenterLoadingStateVariantsProps,
  SectionTitleVariantsProps,
  SectionContainerVariantsProps,
  TabsListVariantsProps,
  DraftTabContainerVariantsProps,
  StatusMessageVariantsProps,
  CountTextVariantsProps,
  CardContainerBaseVariantsProps,
  DraftCardInteractionVariantsProps,
  CheckboxVariantsProps,
  CardImageVariantsProps,
  CardContentVariantsProps,
  CardTitleVariantsProps,
  CardDescriptionVariantsProps,
  CardStatsVariantsProps,
  CardStatsItemVariantsProps,
  CardActionButtonVariantsProps,
  DialogVariantsProps as UserCenterDialogVariantsProps,
  DialogTitleVariantsProps,
  DialogIconVariantsProps,
  DialogButtonContainerVariantsProps,
  DialogActionButtonVariantsProps,
  ItemListContainerVariantsProps,
  ItemContentVariantsProps,
  SuccessStateVariantsProps,
  SuccessTitleVariantsProps,
  SuccessDescriptionVariantsProps,
  FavoriteTabContainerVariantsProps,
  FollowTabContainerVariantsProps,
  StatsCountTextVariantsProps,
  FavoriteItemContainerVariantsProps,
  FollowItemContainerVariantsProps,
  ItemImageContainerVariantsProps,
  ItemContentAreaVariantsProps,
  ItemTitleRowVariantsProps,
  ItemTitleVariantsProps,
  ItemIconVariantsProps,
  ItemDescriptionVariantsProps,
  ItemStatsRowVariantsProps,
  StatsIconVariantsProps,
  StatsItemSpacingVariantsProps,
  LoadMoreStateVariantsProps,
  LoadMoreButtonVariantsProps as UserCenterLoadMoreButtonVariantsProps,
  TabEmptyStateVariantsProps,
  DataTabContainerVariantsProps,
  DataTitleVariantsProps,
  DataDescriptionVariantsProps,
  DataCardContainerVariantsProps,
  RecipeStatsContainerVariantsProps,
  RecipeInfoContainerVariantsProps,
  RecipeImageContainerVariantsProps,
  RecipeImageVariantsProps,
  RecipeContentContainerVariantsProps,
  RecipeTitleVariantsProps as UserCenterRecipeTitleVariantsProps,
  RecipeRatingInfoVariantsProps,
  StatsGridVariantsProps,
  StatsItemCardVariantsProps,
  StatsLabelVariantsProps,
  StatsValueVariantsProps,
  UserCardContainerVariantsProps,
  UserAvatarContainerVariantsProps,
  UserInfoContainerVariantsProps,
  UsernameVariantsProps,
  UserBioVariantsProps,
  UserStatsVariantsProps,
  PublishedTabContainerVariantsProps,
  PublishedCountTextVariantsProps,
  PublishedCardContainerVariantsProps,
} from './user-center';

/**
 * 個人資料編輯表單樣式變體
 * 用於用戶資料編輯、設定修改等功能
 */
export {
  // 重新命名避免衝突的變體
  loadingStateVariants as profileEditLoadingStateVariants,
  errorStateVariants as profileEditErrorStateVariants,
  breadcrumbVariants as profileEditBreadcrumbVariants,
  dialogVariants as profileEditDialogVariants,
  // 其他變體保持原樣
  profilePageVariants,
  profileFormVariants,
  avatarContainerVariants,
  avatarUploadButtonVariants,
  profileFieldVariants,
  verificationBadgeVariants,
  profileButtonVariants,
} from './profile-edit-form';

// Profile Edit Form 類型導出
export type {
  LoadingStateVariants as ProfileEditLoadingStateVariants,
  ErrorStateVariants as ProfileEditErrorStateVariants,
  BreadcrumbVariants as ProfileEditBreadcrumbVariants,
  DialogVariants as ProfileEditDialogVariants,
  ProfilePageVariants,
  ProfileFormVariants,
  AvatarContainerVariants,
  AvatarUploadButtonVariants,
  ProfileFieldVariants,
  VerificationBadgeVariants,
  ProfileButtonVariants,
} from './profile-edit-form';

/**
 * 作者個人資料頁面樣式變體
 * 用於作者展示、作品列表、關注等功能
 */
export {
  // 重新命名避免衝突的變體
  loadingStateVariants as authorProfileLoadingStateVariants,
  loadMoreButtonVariants as authorProfileLoadMoreButtonVariants,
  recipeTitleVariants as authorProfileRecipeTitleVariants,
  // 其他變體保持原樣
  profileContainerVariants as authorProfileContainerVariants,
  authorCardVariants,
  authorInfoVariants,
  authorStatsVariants,
  recipeListVariants,
  recipesSectionVariants,
  authorBioVariants,
  shareButtonVariants,
} from './author-profile';

// Author Profile 類型導出
export type {
  ProfileContainerVariantsProps as AuthorProfileContainerVariantsProps,
  AuthorCardVariantsProps,
  AuthorInfoVariantsProps,
  AuthorStatsVariantsProps,
  RecipeListVariantsProps,
  RecipesSectionVariantsProps,
  RecipeTitleVariantsProps as AuthorProfileRecipeTitleVariantsProps,
  LoadMoreButtonVariantsProps as AuthorProfileLoadMoreButtonVariantsProps,
  LoadingStateVariantsProps as AuthorProfileLoadingStateVariantsProps,
  AuthorBioVariantsProps,
  ShareButtonVariantsProps,
} from './author-profile';

/**
 * 聯絡我們頁面樣式變體
 * 用於聯絡表單、客服相關功能
 */
export * from './contact-us';

/**
 * 影片上傳頁面樣式變體
 * 用於影片上傳、編輯、分段等功能
 */
export {
  // 重新命名避免衝突的變體
  errorMessageVariants as videoUploadErrorMessageVariants,
  timeDisplayVariants as videoUploadTimeDisplayVariants,
  timeRangeDisplayVariants as videoUploadTimeRangeDisplayVariants,
  // 其他變體保持原樣
  videoEditorContainerVariants,
  videoPlayerVariants as videoUploadVideoPlayerVariants,
  videoPlayerContainerVariants,
  playControlButtonVariants,
  uploadAreaVariants,
  uploadContainerVariants,
  controlButtonVariants,
  progressIndicatorVariants,
  debugButtonVariants,
  stepIndicatorContainerVariants,
  contentAreaVariants,
  segmentNavigationVariants as videoUploadSegmentNavigationVariants,
  segmentNavigationControlsVariants,
  segmentNavigationButtonVariants as videoUploadSegmentNavigationButtonVariants,
  segmentIndicatorVariants,
  segmentDeleteButtonVariants,
  trimControlVariants,
  timelineContainerVariants,
  timeMarkerVariants,
  thumbnailContainerVariants,
  thumbnailVariants,
  segmentMarkerVariants,
  segmentMarkerLabelVariants,
  maskVariants,
  playbackIndicatorVariants,
  playbackIndicatorMarkerVariants,
  sliderHandleVariants,
  sliderHandleMarkerVariants,
  markButtonGroupVariants,
  markButtonVariants,
  statusIndicatorVariants,
  statusIndicatorContentVariants,
  statusLightVariants,
  statusTextVariants,
  resetButtonVariants,
  actionButtonVariants,
  buttonGroupVariants,
  primaryActionButtonVariants,
  forceSubmitButtonVariants,
  descriptionFieldVariants,
  descriptionFieldTitleVariants,
  characterCounterVariants,
  descriptionTextareaVariants,
} from './video-upload';

// Video Upload 類型導出
export type {
  VideoEditorContainerVariantsProps,
  VideoPlayerVariantsProps as VideoUploadVideoPlayerVariantsProps,
  VideoPlayerContainerVariantsProps,
  PlayControlButtonVariantsProps,
  UploadAreaVariantsProps,
  UploadContainerVariantsProps,
  ControlButtonVariantsProps,
  ProgressIndicatorVariantsProps,
  ErrorMessageVariantsProps as VideoUploadErrorMessageVariantsProps,
  TimeDisplayVariantsProps as VideoUploadTimeDisplayVariantsProps,
  DebugButtonVariantsProps,
  StepIndicatorContainerVariantsProps,
  ContentAreaVariantsProps,
  SegmentNavigationVariantsProps as VideoUploadSegmentNavigationVariantsProps,
  SegmentNavigationControlsVariantsProps,
  SegmentNavigationButtonVariantsProps as VideoUploadSegmentNavigationButtonVariantsProps,
  SegmentIndicatorVariantsProps,
  SegmentDeleteButtonVariantsProps,
  TrimControlVariantsProps,
  TimelineContainerVariantsProps,
  TimeMarkerVariantsProps,
  ThumbnailContainerVariantsProps,
  ThumbnailVariantsProps,
  SegmentMarkerVariantsProps,
  SegmentMarkerLabelVariantsProps,
  MaskVariantsProps,
  PlaybackIndicatorVariantsProps,
  PlaybackIndicatorMarkerVariantsProps,
  SliderHandleVariantsProps,
  SliderHandleMarkerVariantsProps,
  TimeRangeDisplayVariantsProps as VideoUploadTimeRangeDisplayVariantsProps,
  MarkButtonGroupVariantsProps,
  MarkButtonVariantsProps,
  StatusIndicatorVariantsProps,
  StatusIndicatorContentVariantsProps,
  StatusLightVariantsProps,
  StatusTextVariantsProps,
  ResetButtonVariantsProps,
  ActionButtonVariantsProps,
  ButtonGroupVariantsProps,
  PrimaryActionButtonVariantsProps,
  ForceSubmitButtonVariantsProps,
  DescriptionFieldVariantsProps,
  DescriptionFieldTitleVariantsProps,
  CharacterCounterVariantsProps,
  DescriptionTextareaVariantsProps,
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

/**
 * 通用樣式組合函數 - 結合 clsx 和 tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 條件樣式應用函數
 */
export function conditionalStyles(
  condition: boolean,
  trueStyles: string,
  falseStyles?: string,
): string {
  return condition ? trueStyles : falseStyles || '';
}

/**
 * 根據狀態映射樣式的函數
 */
export function stateStyles<T extends string>(
  state: T,
  styleMap: Record<T, string>,
  defaultStyles?: string,
): string {
  return styleMap[state] || defaultStyles || '';
}

/**
 * 組合多個 CVA 變體樣式的函數
 */
export function combineVariants(
  baseStyles: string,
  ...variants: (string | undefined | null | false)[]
): string {
  return cn(baseStyles, ...variants.filter(Boolean));
}

/**
 * 響應式樣式應用函數
 */
export function responsiveStyles(breakpointStyles: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  const { base, sm, md, lg, xl, '2xl': xl2 } = breakpointStyles;

  return cn(
    base,
    sm && `sm:${sm.replace('sm:', '')}`,
    md && `md:${md.replace('md:', '')}`,
    lg && `lg:${lg.replace('lg:', '')}`,
    xl && `xl:${xl.replace('xl:', '')}`,
    xl2 && `2xl:${xl2.replace('2xl:', '')}`,
  );
}

/**
 * 動畫過渡樣式函數
 */
export function animationStyles(config: {
  property?: 'all' | 'colors' | 'opacity' | 'shadow' | 'transform';
  duration?: '75' | '100' | '150' | '200' | '300' | '500' | '700' | '1000';
  timing?: 'linear' | 'in' | 'out' | 'in-out';
  delay?: '75' | '100' | '150' | '200' | '300' | '500' | '700' | '1000';
}): string {
  const {
    property = 'all',
    duration = '200',
    timing = 'in-out',
    delay,
  } = config;

  return cn(
    `transition-${property}`,
    `duration-${duration}`,
    `ease-${timing}`,
    delay && `delay-${delay}`,
  );
}

// ================== 常用樣式組合 ==================

/**
 * 常用的卡片樣式組合
 */
export const commonCardStyles = {
  base: 'bg-white rounded-lg border border-gray-200 shadow-sm',
  elevated:
    'bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow',
  interactive:
    'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer',
  minimal: 'bg-white rounded-lg border border-gray-100',
} as const;

/**
 * 常用的按鈕樣式組合
 */
export const commonButtonStyles = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-2 focus:ring-secondary focus:ring-offset-2',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ghost:
    'hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-2 focus:ring-destructive focus:ring-offset-2',
} as const;

/**
 * 常用的文字樣式組合
 */
export const commonTextStyles = {
  heading1: 'text-3xl font-bold tracking-tight',
  heading2: 'text-2xl font-semibold tracking-tight',
  heading3: 'text-xl font-semibold',
  heading4: 'text-lg font-semibold',
  body: 'text-sm',
  small: 'text-xs',
  muted: 'text-muted-foreground',
  error: 'text-destructive',
  success: 'text-green-600',
  warning: 'text-yellow-600',
} as const;

/**
 * 常用的間距樣式組合
 */
export const commonSpacingStyles = {
  none: '',
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8',
} as const;

// ================== 類型導出 ==================

export type CommonCardStyleKey = keyof typeof commonCardStyles;
export type CommonButtonStyleKey = keyof typeof commonButtonStyles;
export type CommonTextStyleKey = keyof typeof commonTextStyles;
export type CommonSpacingStyleKey = keyof typeof commonSpacingStyles;

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
