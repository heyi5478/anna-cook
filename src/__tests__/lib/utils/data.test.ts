import { convertApiStepsToComponentSteps } from '@/lib/utils/data';
import type { RecipeDraftStep } from '@/types/api';
import type { Step } from '@/types/recipe';

describe('Data Utils', () => {
  describe('convertApiStepsToComponentSteps', () => {
    test('應該正確轉換單一步驟資料', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: '準備食材',
          videoStart: 0,
          videoEnd: 30,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 1,
          startTime: 0,
          endTime: 30,
          description: '準備食材',
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
      expect(result).toHaveLength(1);
    });

    test('應該正確轉換多個步驟資料', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: '準備食材',
          videoStart: 0,
          videoEnd: 30,
        },
        {
          stepId: 2,
          stepOrder: 2,
          stepDescription: '清洗蔬菜',
          videoStart: 30,
          videoEnd: 60,
        },
        {
          stepId: 3,
          stepOrder: 3,
          stepDescription: '切菜',
          videoStart: 60,
          videoEnd: 120,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 1,
          startTime: 0,
          endTime: 30,
          description: '準備食材',
        },
        {
          id: 2,
          startTime: 30,
          endTime: 60,
          description: '清洗蔬菜',
        },
        {
          id: 3,
          startTime: 60,
          endTime: 120,
          description: '切菜',
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
      expect(result).toHaveLength(3);
    });

    test('應該正確處理空陣列', () => {
      const apiSteps: RecipeDraftStep[] = [];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('應該正確處理數值為 0 的時間', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: '開始烹飪',
          videoStart: 0,
          videoEnd: 0,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 1,
          startTime: 0,
          endTime: 0,
          description: '開始烹飪',
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
    });

    test('應該正確處理負數時間值', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: '測試步驟',
          videoStart: -10,
          videoEnd: -5,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 1,
          startTime: -10,
          endTime: -5,
          description: '測試步驟',
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
    });

    test('應該正確處理大數值的時間和ID', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 999999,
          stepOrder: 1,
          stepDescription: '長時間烹煮',
          videoStart: 3600,
          videoEnd: 7200,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 999999,
          startTime: 3600,
          endTime: 7200,
          description: '長時間烹煮',
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
    });

    test('應該正確處理空字串描述', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: '',
          videoStart: 0,
          videoEnd: 30,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 1,
          startTime: 0,
          endTime: 30,
          description: '',
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
    });

    test('應該正確處理包含特殊字符的描述', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: '加入調料：鹽巴、胡椒粉 (適量)',
          videoStart: 90,
          videoEnd: 150,
        },
        {
          stepId: 2,
          stepOrder: 2,
          stepDescription: '溫度控制 @ 180°C ～ 200°C',
          videoStart: 150,
          videoEnd: 300,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 1,
          startTime: 90,
          endTime: 150,
          description: '加入調料：鹽巴、胡椒粉 (適量)',
        },
        {
          id: 2,
          startTime: 150,
          endTime: 300,
          description: '溫度控制 @ 180°C ～ 200°C',
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
    });

    test('應該正確處理長描述文本', () => {
      const longDescription =
        '這是一個非常詳細的烹飪步驟描述，包含了許多細節和注意事項。首先要確保所有食材都已經準備妥當，然後按照正確的順序進行操作，同時要注意火候的控制和時間的掌握。';

      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: longDescription,
          videoStart: 0,
          videoEnd: 180,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 1,
          startTime: 0,
          endTime: 180,
          description: longDescription,
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
    });

    test('應該忽略 stepOrder 欄位進行轉換', () => {
      // stepOrder 在原始資料中存在，但轉換後的 Step 類型中不需要這個欄位
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 5,
          stepOrder: 99, // 這個值應該被忽略
          stepDescription: '測試忽略順序',
          videoStart: 10,
          videoEnd: 20,
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result[0]).not.toHaveProperty('stepOrder');
      expect(result[0]).toEqual({
        id: 5,
        startTime: 10,
        endTime: 20,
        description: '測試忽略順序',
      });
    });

    test('應該保持原陣列順序', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 3,
          stepOrder: 3,
          stepDescription: '第三步',
          videoStart: 60,
          videoEnd: 90,
        },
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: '第一步',
          videoStart: 0,
          videoEnd: 30,
        },
        {
          stepId: 2,
          stepOrder: 2,
          stepDescription: '第二步',
          videoStart: 30,
          videoEnd: 60,
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      // 檢查順序是否保持與輸入陣列相同
      expect(result[0].id).toBe(3);
      expect(result[1].id).toBe(1);
      expect(result[2].id).toBe(2);

      expect(result[0].description).toBe('第三步');
      expect(result[1].description).toBe('第一步');
      expect(result[2].description).toBe('第二步');
    });

    test('應該正確處理浮點數時間值', () => {
      const apiSteps: RecipeDraftStep[] = [
        {
          stepId: 1,
          stepOrder: 1,
          stepDescription: '精準時間控制',
          videoStart: 10.5,
          videoEnd: 20.75,
        },
      ];

      const expectedSteps: Step[] = [
        {
          id: 1,
          startTime: 10.5,
          endTime: 20.75,
          description: '精準時間控制',
        },
      ];

      const result = convertApiStepsToComponentSteps(apiSteps);

      expect(result).toEqual(expectedSteps);
    });
  });
});
