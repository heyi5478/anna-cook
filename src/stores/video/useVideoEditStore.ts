import { create } from 'zustand';
import { generateId } from '@/lib/utils';

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
 * 錯誤狀態類型
 */
export type ErrorState = {
  video?: string;
  description?: string;
};

/**
 * 上傳狀態
 */
type UploadState = {
  videoFile: File | null;
  videoUrl: string;
  fileName: string;
  uploadProgress: number;
  isUploading: boolean;
  apiError: string | null;
};

/**
 * 播放狀態
 */
type PlayerState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  thumbnails: string[];
};

/**
 * 片段管理狀態
 */
type SegmentsState = {
  segments: Segment[];
  currentSegmentIndex: number;
  trimValues: [number, number];
};

/**
 * 表單狀態
 */
type FormState = {
  errors: ErrorState;
  isSubmitting: boolean;
};

/**
 * 提供視頻編輯功能的狀態管理
 */
type VideoEditStore = {
  // 狀態
  upload: UploadState;
  player: PlayerState;
  segments: SegmentsState;
  form: FormState;

  // 動作
  setVideoFile: (file: File | null) => void;
  setVideoUrl: (url: string) => void;
  setFileName: (name: string) => void;
  setUploadProgress: (
    progress: number | ((prevProgress: number) => number),
  ) => void;
  setIsUploading: (isUploading: boolean) => void;
  setApiError: (error: string | null) => void;

  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setThumbnails: (thumbnails: string[]) => void;

  setSegments: (segments: Segment[]) => void;
  updateCurrentSegmentDescription: (description: string) => void;
  setCurrentSegmentIndex: (index: number) => void;
  setTrimValues: (values: [number, number]) => void;
  addSegment: () => void;
  deleteCurrentSegment: () => void;
  goToPreviousSegment: () => void;
  goToNextSegment: () => void;
  markStartPoint: (time: number) => void;
  markEndPoint: (time: number) => void;
  resetCurrentSegment: () => void;

  setErrors: (errors: ErrorState) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;

  // 重置所有狀態
  reset: () => void;
};

/**
 * 建立視頻編輯商店
 */
export const useVideoEditStore = create<VideoEditStore>((set, get) => ({
  // 初始狀態
  upload: {
    videoFile: null,
    videoUrl: '',
    fileName: 'videoexample.avi',
    uploadProgress: 0,
    isUploading: false,
    apiError: null,
  },
  player: {
    isPlaying: false,
    currentTime: 0,
    duration: 134.63,
    thumbnails: [],
  },
  segments: {
    segments: [],
    currentSegmentIndex: 0,
    trimValues: [0, 100],
  },
  form: {
    errors: {},
    isSubmitting: false,
  },

  // 上傳狀態動作
  setVideoFile: (file) =>
    set((state) => ({
      upload: { ...state.upload, videoFile: file },
    })),

  setVideoUrl: (url) =>
    set((state) => ({
      upload: { ...state.upload, videoUrl: url },
    })),

  setFileName: (name) =>
    set((state) => ({
      upload: { ...state.upload, fileName: name },
    })),

  setUploadProgress: (progress) =>
    set((state) => ({
      upload: {
        ...state.upload,
        uploadProgress:
          typeof progress === 'function'
            ? progress(state.upload.uploadProgress)
            : progress,
      },
    })),

  setIsUploading: (isUploading) =>
    set((state) => ({
      upload: { ...state.upload, isUploading },
    })),

  setApiError: (error) =>
    set((state) => ({
      upload: { ...state.upload, apiError: error },
    })),

  // 播放狀態動作
  setIsPlaying: (isPlaying) =>
    set((state) => ({
      player: { ...state.player, isPlaying },
    })),

  setCurrentTime: (time) =>
    set((state) => ({
      player: { ...state.player, currentTime: time },
    })),

  setDuration: (duration) =>
    set((state) => ({
      player: { ...state.player, duration },
    })),

  setThumbnails: (thumbnails) =>
    set((state) => ({
      player: { ...state.player, thumbnails },
    })),

  // 片段管理動作
  setSegments: (segments) =>
    set((state) => ({
      segments: { ...state.segments, segments },
    })),

  updateCurrentSegmentDescription: (description) =>
    set((state) => {
      const { segments: segmentList, currentSegmentIndex } = state.segments;
      if (segmentList.length === 0) return state;

      const updatedSegments = [...segmentList];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        description,
      };

      return {
        segments: {
          ...state.segments,
          segments: updatedSegments,
        },
      };
    }),

  setCurrentSegmentIndex: (index) =>
    set((state) => {
      const { segments: segmentList } = state.segments;
      if (index < 0 || index >= segmentList.length) return state;

      const segment = segmentList[index];

      return {
        segments: {
          ...state.segments,
          currentSegmentIndex: index,
          trimValues: [segment.startPercent, segment.endPercent],
        },
      };
    }),

  setTrimValues: (values) =>
    set((state) => {
      const { segments: segmentList, currentSegmentIndex } = state.segments;
      if (segmentList.length === 0) return state;

      const [newStartPercent, newEndPercent] = values;
      const { duration } = get().player;

      const newStartTime = (newStartPercent / 100) * duration;
      const newEndTime = (newEndPercent / 100) * duration;

      const updatedSegments = [...segmentList];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        startTime: newStartTime,
        endTime: newEndTime,
        startPercent: newStartPercent,
        endPercent: newEndPercent,
      };

      return {
        segments: {
          ...state.segments,
          segments: updatedSegments,
          trimValues: values,
        },
      };
    }),

  addSegment: () =>
    set((state) => {
      const { duration } = get().player;
      if (duration <= 0) return state;

      // 默認新片段從影片中間開始，持續5秒（或到影片結束）
      const middleTime = duration / 2;
      const endTime = Math.min(middleTime + 5, duration);

      const startPercent = (middleTime / duration) * 100;
      const endPercent = (endTime / duration) * 100;

      const newSegment: Segment = {
        id: generateId(),
        startTime: middleTime,
        endTime,
        startPercent,
        endPercent,
        description: '',
      };

      const newSegments = [...state.segments.segments, newSegment];
      const newIndex = newSegments.length - 1;

      return {
        segments: {
          segments: newSegments,
          currentSegmentIndex: newIndex,
          trimValues: [startPercent, endPercent],
        },
      };
    }),

  deleteCurrentSegment: () =>
    set((state) => {
      const { segments: segmentList, currentSegmentIndex } = state.segments;
      if (segmentList.length <= 1) return state;

      const newSegments = segmentList.filter(
        (_, index) => index !== currentSegmentIndex,
      );
      const newIndex = Math.min(currentSegmentIndex, newSegments.length - 1);
      const currentSegment = newSegments[newIndex];

      return {
        segments: {
          segments: newSegments,
          currentSegmentIndex: newIndex,
          trimValues: [currentSegment.startPercent, currentSegment.endPercent],
        },
      };
    }),

  goToPreviousSegment: () =>
    set((state) => {
      const { currentSegmentIndex, segments: segmentList } = state.segments;
      if (currentSegmentIndex <= 0) return state;

      const newIndex = currentSegmentIndex - 1;
      const segment = segmentList[newIndex];

      return {
        segments: {
          ...state.segments,
          currentSegmentIndex: newIndex,
          trimValues: [segment.startPercent, segment.endPercent],
        },
      };
    }),

  goToNextSegment: () =>
    set((state) => {
      const { currentSegmentIndex, segments: segmentList } = state.segments;
      if (currentSegmentIndex >= segmentList.length - 1) return state;

      const newIndex = currentSegmentIndex + 1;
      const segment = segmentList[newIndex];

      return {
        segments: {
          ...state.segments,
          currentSegmentIndex: newIndex,
          trimValues: [segment.startPercent, segment.endPercent],
        },
      };
    }),

  markStartPoint: (time) =>
    set((state) => {
      const { segments: segmentList, currentSegmentIndex } = state.segments;
      if (segmentList.length === 0) return state;

      const { duration } = get().player;
      const newStartPercent = (time / duration) * 100;

      const updatedSegments = [...segmentList];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        startTime: time,
        startPercent: newStartPercent,
      };

      return {
        segments: {
          ...state.segments,
          segments: updatedSegments,
          trimValues: [
            newStartPercent,
            updatedSegments[currentSegmentIndex].endPercent,
          ],
        },
      };
    }),

  markEndPoint: (time) =>
    set((state) => {
      const { segments: segmentList, currentSegmentIndex } = state.segments;
      if (segmentList.length === 0) return state;

      const { duration } = get().player;
      const newEndPercent = (time / duration) * 100;

      const updatedSegments = [...segmentList];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        endTime: time,
        endPercent: newEndPercent,
      };

      return {
        segments: {
          ...state.segments,
          segments: updatedSegments,
          trimValues: [
            updatedSegments[currentSegmentIndex].startPercent,
            newEndPercent,
          ],
        },
      };
    }),

  resetCurrentSegment: () =>
    set((state) => {
      const { segments: segmentList, currentSegmentIndex } = state.segments;
      if (segmentList.length === 0) return state;

      const { duration } = get().player;

      const updatedSegments = [...segmentList];
      updatedSegments[currentSegmentIndex] = {
        ...updatedSegments[currentSegmentIndex],
        startTime: 0,
        endTime: duration,
        startPercent: 0,
        endPercent: 100,
      };

      return {
        segments: {
          ...state.segments,
          segments: updatedSegments,
          trimValues: [0, 100],
        },
      };
    }),

  // 表單狀態動作
  setErrors: (errors) =>
    set((state) => ({
      form: { ...state.form, errors },
    })),

  setIsSubmitting: (isSubmitting) =>
    set((state) => ({
      form: { ...state.form, isSubmitting },
    })),

  // 重置所有狀態
  reset: () =>
    set({
      upload: {
        videoFile: null,
        videoUrl: '',
        fileName: 'videoexample.avi',
        uploadProgress: 0,
        isUploading: false,
        apiError: null,
      },
      player: {
        isPlaying: false,
        currentTime: 0,
        duration: 134.63,
        thumbnails: [],
      },
      segments: {
        segments: [],
        currentSegmentIndex: 0,
        trimValues: [0, 100],
      },
      form: {
        errors: {},
        isSubmitting: false,
      },
    }),
}));
