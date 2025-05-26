/**
 * 生成唯一ID，用於標識片段
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * 格式化時間顯示 (秒)
 */
export const formatTime = (timeInSeconds: number): string => {
  return timeInSeconds.toFixed(2);
};

/**
 * 檢查設備是否為行動裝置
 */
export const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : '',
  );
};
