import { convertApiStepsToComponentSteps } from '@/lib/utils';
import type { RecipeDraftStep } from '@/types/api';

describe('convertApiStepsToComponentSteps 函式', () => {
  // 測試基本轉換功能
  test('應該正確轉換單個步驟', () => {
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: '準備食材',
        videoStart: 0,
        videoEnd: 30,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 1,
      startTime: 0,
      endTime: 30,
      description: '準備食材',
    });
  });

  // 測試多個步驟轉換
  test('應該正確轉換多個步驟', () => {
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
        stepDescription: '開始烹飪',
        videoStart: 30,
        videoEnd: 120,
      },
      {
        stepId: 3,
        stepOrder: 3,
        stepDescription: '最後調味',
        videoStart: 120,
        videoEnd: 180,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      id: 1,
      startTime: 0,
      endTime: 30,
      description: '準備食材',
    });
    expect(result[1]).toEqual({
      id: 2,
      startTime: 30,
      endTime: 120,
      description: '開始烹飪',
    });
    expect(result[2]).toEqual({
      id: 3,
      startTime: 120,
      endTime: 180,
      description: '最後調味',
    });
  });

  // 測試空陣列
  test('應該正確處理空陣列', () => {
    const apiSteps: RecipeDraftStep[] = [];
    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  // 測試零值處理
  test('應該正確處理零值時間', () => {
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: '立即開始',
        videoStart: 0,
        videoEnd: 0,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result[0]).toEqual({
      id: 1,
      startTime: 0,
      endTime: 0,
      description: '立即開始',
    });
  });

  // 測試負數 ID
  test('應該正確處理負數 stepId', () => {
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: -1,
        stepOrder: 1,
        stepDescription: '負數 ID 步驟',
        videoStart: 10,
        videoEnd: 20,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result[0]).toEqual({
      id: -1,
      startTime: 10,
      endTime: 20,
      description: '負數 ID 步驟',
    });
  });

  // 測試長描述文字
  test('應該正確處理長描述文字', () => {
    const longDescription =
      '這是一個非常長的步驟描述，包含了詳細的烹飪說明和注意事項，確保每一個細節都能被正確地記錄和傳達給使用者。';
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: longDescription,
        videoStart: 0,
        videoEnd: 60,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result[0].description).toBe(longDescription);
  });

  // 測試空描述
  test('應該正確處理空描述', () => {
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: '',
        videoStart: 0,
        videoEnd: 30,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result[0].description).toBe('');
  });

  // 測試小數時間值
  test('應該正確處理小數時間值', () => {
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: '精確時間步驟',
        videoStart: 15.5,
        videoEnd: 45.75,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result[0]).toEqual({
      id: 1,
      startTime: 15.5,
      endTime: 45.75,
      description: '精確時間步驟',
    });
  });

  // 測試大數值
  test('應該正確處理大數值', () => {
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 999999,
        stepOrder: 100,
        stepDescription: '長時間步驟',
        videoStart: 3600,
        videoEnd: 7200,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result[0]).toEqual({
      id: 999999,
      startTime: 3600,
      endTime: 7200,
      description: '長時間步驟',
    });
  });

  // 測試返回值類型
  test('應該返回正確的類型結構', () => {
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: '測試步驟',
        videoStart: 0,
        videoEnd: 30,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('startTime');
    expect(result[0]).toHaveProperty('endTime');
    expect(result[0]).toHaveProperty('description');

    // 檢查不應該包含 API 的原始欄位
    expect(result[0]).not.toHaveProperty('stepId');
    expect(result[0]).not.toHaveProperty('stepOrder');
    expect(result[0]).not.toHaveProperty('stepDescription');
    expect(result[0]).not.toHaveProperty('videoStart');
    expect(result[0]).not.toHaveProperty('videoEnd');
  });

  // 測試函式不會修改原始資料
  test('不應該修改原始輸入陣列', () => {
    const originalApiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: '原始步驟',
        videoStart: 0,
        videoEnd: 30,
      },
    ];

    const apiStepsCopy = JSON.parse(JSON.stringify(originalApiSteps));
    convertApiStepsToComponentSteps(apiStepsCopy);

    expect(apiStepsCopy).toEqual(originalApiSteps);
  });

  // 測試步驟順序保持一致
  test('應該保持步驟的順序', () => {
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

    expect(result[0].description).toBe('第三步');
    expect(result[1].description).toBe('第一步');
    expect(result[2].description).toBe('第二步');
  });

  // 測試數值類型保持一致
  test('應該保持數值類型不變', () => {
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: '數值測試',
        videoStart: 10,
        videoEnd: 20,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(typeof result[0].id).toBe('number');
    expect(typeof result[0].startTime).toBe('number');
    expect(typeof result[0].endTime).toBe('number');
    expect(typeof result[0].description).toBe('string');
  });

  // 測試包含特殊字符的描述
  test('應該正確處理包含特殊字符的描述', () => {
    const specialDescription =
      '步驟 1: 加入 100ml 水 & 2 大匙鹽 (約 10g)，然後攪拌 30 秒。注意：溫度保持在 80°C！';
    const apiSteps: RecipeDraftStep[] = [
      {
        stepId: 1,
        stepOrder: 1,
        stepDescription: specialDescription,
        videoStart: 0,
        videoEnd: 30,
      },
    ];

    const result = convertApiStepsToComponentSteps(apiSteps);

    expect(result[0].description).toBe(specialDescription);
  });
});
