/**
 * 片段類型定義
 */
export type Segment = {
  id: string;
  startTime: number;
  endTime: number;
  startPercent: number;
  endPercent: number;
  description: string;
};

/**
 * 影片剪輯器元件屬性
 */
export type VideoTrimmerProps = {
  onSave: (trimmedVideo: {
    file: File;
    segments: Segment[];
    description?: string;
  }) => void;
  onCancel: () => void;
};

/**
 * 錯誤狀態類型
 */
export type ErrorState = {
  video?: string;
  description?: string;
};
