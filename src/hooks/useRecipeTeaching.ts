import { useState, useEffect } from 'react';
import { RecipeTeachingResponse } from '@/types/api';
import { fetchRecipeTeaching } from '@/services/recipes';
import { HTTP_STATUS } from '@/lib/constants';

type Step = {
  id: number;
  description: string;
  stepOrder: number;
  startTime: number;
  endTime: number;
};

type RecipeTeachingHookResult = {
  teachingData: RecipeTeachingResponse['data'] | null;
  steps: Step[];
  videoId: string;
  loading: boolean;
  error: string | null;
};

/**
 * 取得食譜教學資訊的 Hook
 */
export const useRecipeTeaching = (
  recipeId?: number,
): RecipeTeachingHookResult => {
  const [teachingData, setTeachingData] = useState<
    RecipeTeachingResponse['data'] | null
  >(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [videoId, setVideoId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * 獲取教學資訊
     */
    const fetchData = async () => {
      if (!recipeId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetchRecipeTeaching(recipeId);

        if (response.StatusCode === HTTP_STATUS.OK && response.data) {
          setTeachingData(response.data);
          setSteps(response.data.steps);

          // 從視頻URL提取Vimeo視頻ID
          if (response.data.video) {
            const videoPath = response.data.video;
            // 假設視頻路徑格式為 "/videos/12345" 或包含完整Vimeo URL
            const videoIdMatch =
              videoPath.match(/\/(\d+)(?:\/|$)/) ||
              videoPath.match(/vimeo\.com\/(\d+)/);

            if (videoIdMatch && videoIdMatch[1]) {
              setVideoId(videoIdMatch[1]);
            } else {
              // 如果無法提取，使用完整路徑
              setVideoId(videoPath);
            }
          }
        } else {
          setError(response.msg || '無法加載教學資訊');
        }
      } catch (err) {
        console.error('獲取教學資訊失敗:', err);
        setError('無法加載教學資訊，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recipeId]);

  return { teachingData, steps, videoId, loading, error };
};
