/**
 * 生成唯一ID，用於標識片段
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
