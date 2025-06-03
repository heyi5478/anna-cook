import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Step, RecipeSubmitData } from '@/types/recipe';
import type { RecipeFormValues } from '@/components/pages/RecipeDraft/schema';
import { fetchRecipeDraft, submitRecipeDraft } from '@/services/recipes';

// 狀態型別定義
type State = {
  // 載入狀態
  loading: boolean;
  saving: boolean;
  error: string | null;

  // 食譜資料
  recipeId: number | null;
  recipeImage: string | null;
  recipeSteps: Step[];
  newTag: string;

  // 表單資料 (會由 react-hook-form 管理，但 store 需要知道結構)
  formData: RecipeFormValues;
};

// 動作型別定義
type Actions = {
  // 載入相關動作
  loadRecipeDraft: (recipeId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 食譜資料動作
  setRecipeId: (id: number | null) => void;
  setRecipeImage: (image: string | null) => void;
  setRecipeSteps: (steps: Step[]) => void;
  removeStep: (index: number) => void;

  // 標籤相關動作
  setNewTag: (tag: string) => void;
  addTag: (tag: string, currentTags: string[]) => string[];
  removeTag: (tagToRemove: string, currentTags: string[]) => string[];

  // 表單相關動作
  setFormData: (data: RecipeFormValues) => void;
  updateFormField: <K extends keyof RecipeFormValues>(
    field: K,
    value: RecipeFormValues[K],
  ) => void;

  // 提交相關動作
  submitRecipe: (
    recipeId: number,
    formData: RecipeFormValues,
    steps: Step[],
  ) => Promise<{ success: boolean; redirectPath?: string }>;

  // 工具函式
  formatTimeFromSeconds: (seconds: number) => string;

  // 重置狀態
  reset: () => void;
};

const defaultFormData: RecipeFormValues = {
  name: '',
  description: '',
  ingredients: [],
  seasonings: [],
  tags: [],
  cookingTimeValue: '',
  cookingTimeUnit: '分鐘',
  servingsValue: '',
  servingsUnit: '人份',
};

/**
 * 食譜草稿管理 Store
 * 集中管理食譜草稿的所有商業邏輯和狀態
 */
export const useRecipeDraftStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      // 初始狀態
      loading: false,
      saving: false,
      error: null,
      recipeId: null,
      recipeImage: null,
      recipeSteps: [],
      newTag: '',
      formData: defaultFormData,

      // 載入相關動作
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      /**
       * 載入食譜草稿資料
       */
      loadRecipeDraft: async (recipeId: number) => {
        try {
          set({ loading: true, error: null, recipeId });

          console.log('開始載入食譜草稿，ID:', recipeId);
          const draftData = await fetchRecipeDraft(recipeId);
          console.log('API 回應資料:', draftData);

          if (draftData.StatusCode !== 200) {
            set({ error: draftData.msg, loading: false });
            return;
          }

          const { recipe: recipeData, ingredients, tags, steps } = draftData;
          const { formatTimeFromSeconds } = get();

          // 從 videoId 中提取 Vimeo ID
          let vimeoId = '';
          if (recipeData.videoId) {
            const match = recipeData.videoId.match(/\/videos\/(\d+)/);
            if (match?.[1]) {
              const [, extractedId] = match;
              vimeoId = extractedId;
              console.log('提取的 Vimeo ID:', vimeoId);
            }
          }

          // 轉換並設定表單資料
          const newFormData: RecipeFormValues = {
            name: recipeData.recipeName,
            description: recipeData.description || '',
            cookingTimeValue: recipeData.cookingTime.toString(),
            cookingTimeUnit: '分鐘',
            servingsValue: recipeData.portion.toString(),
            servingsUnit: '人份',
            ingredients: ingredients
              .filter((item) => !item.isFlavoring)
              .map((item) => ({
                name: item.ingredientName,
                amount: `${item.ingredientAmount} ${item.ingredientUnit}`,
                id: item.ingredientId.toString(),
              })),
            seasonings: ingredients
              .filter((item) => item.isFlavoring)
              .map((item) => ({
                name: item.ingredientName,
                amount: `${item.ingredientAmount} ${item.ingredientUnit}`,
                id: item.ingredientId.toString(),
              })),
            tags: tags.map((tag) => tag.tagName),
          };

          // 設定步驟資料
          const newSteps: Step[] = steps.map((step) => ({
            description: step.stepDescription,
            startTime: formatTimeFromSeconds(step.videoStart),
            endTime: formatTimeFromSeconds(step.videoEnd),
            id: step.stepId.toString(),
            vimeoId,
          }));

          set({
            formData: newFormData,
            recipeImage: recipeData.coverPhoto || null,
            recipeSteps: newSteps,
            loading: false,
          });
        } catch (err) {
          console.error('載入食譜草稿失敗:', err);
          set({ error: '載入食譜草稿時發生錯誤', loading: false });
        }
      },

      // 食譜資料動作
      setRecipeId: (id) => set({ recipeId: id }),
      setRecipeImage: (image) => set({ recipeImage: image }),
      setRecipeSteps: (steps) => set({ recipeSteps: steps }),

      /**
       * 移除指定烹飪步驟
       */
      removeStep: (index) => {
        const { recipeSteps } = get();
        set({ recipeSteps: recipeSteps.filter((_, i) => i !== index) });
      },

      // 標籤相關動作
      setNewTag: (tag) => set({ newTag: tag }),

      /**
       * 添加新標籤
       */
      addTag: (tag, currentTags) => {
        if (tag && !currentTags.includes(tag)) {
          return [...currentTags, tag];
        }
        return currentTags;
      },

      /**
       * 移除標籤
       */
      removeTag: (tagToRemove, currentTags) => {
        return currentTags.filter((tag) => tag !== tagToRemove);
      },

      // 表單相關動作
      setFormData: (data) => set({ formData: data }),
      updateFormField: (field, value) => {
        const { formData } = get();
        set({ formData: { ...formData, [field]: value } });
      },

      /**
       * 提交食譜草稿
       */
      submitRecipe: async (recipeId, formData, steps) => {
        try {
          console.log('正在提交食譜草稿:', formData);
          set({ saving: true });

          // 準備提交資料
          const submitData: RecipeSubmitData = {
            recipeName: formData.name,
            recipeIntro: formData.description,
            cookingTime: parseInt(formData.cookingTimeValue, 10) || 0,
            portion: parseInt(formData.servingsValue, 10) || 0,
            ingredients: [
              // 食材列表 (非調味料)
              ...formData.ingredients.map((item) => ({
                name: item.name,
                amount: item.amount,
                isFlavoring: false,
              })),
              // 調味料列表
              ...formData.seasonings.map((item) => ({
                name: item.name,
                amount: item.amount,
                isFlavoring: true,
              })),
            ],
            tags: formData.tags,
            steps: steps.map((step) => ({
              description: step.description,
              startTime:
                typeof step.startTime === 'string'
                  ? step.startTime
                  : String(step.startTime || '0:00'),
              endTime:
                typeof step.endTime === 'string'
                  ? step.endTime
                  : String(step.endTime || '0:00'),
            })),
          };

          const response = await submitRecipeDraft(recipeId, submitData);

          if (response.StatusCode === 200) {
            console.log('草稿提交成功:', response);
            set({ saving: false });
            return { success: true };
          }
          console.error('草稿提交失敗:', response);
          set({ saving: false, error: '提交失敗' });
          return { success: false };
        } catch (err) {
          console.error('提交過程發生錯誤:', err);
          set({ saving: false, error: '提交過程發生錯誤' });
          return { success: false };
        }
      },

      /**
       * 將秒數格式化為 MM:SS 格式
       */
      formatTimeFromSeconds: (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      },

      /**
       * 重置狀態
       */
      reset: () => {
        set({
          loading: false,
          saving: false,
          error: null,
          recipeId: null,
          recipeImage: null,
          recipeSteps: [],
          newTag: '',
          formData: defaultFormData,
        });
      },
    }),
    {
      name: 'recipe-draft-store',
    },
  ),
);
