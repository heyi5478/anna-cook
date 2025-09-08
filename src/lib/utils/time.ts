/**
 * 格式化時間顯示 (秒)
 */
export const formatTime = (timeInSeconds: number): string => {
  return timeInSeconds.toFixed(2);
};

/**
 * 格式化時間為 mm:ss 格式
 */
export const formatTimeMinutes = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
