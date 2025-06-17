import { formatTime } from '@/lib/utils';

describe('formatTime 函式', () => {
  // 測試基本時間格式化功能
  test('應該將整數時間格式化為兩位小數', () => {
    const result = formatTime(10);
    expect(result).toBe('10.00');
  });

  // 測試小數時間格式化
  test('應該將小數時間格式化為兩位小數', () => {
    const result = formatTime(10.5);
    expect(result).toBe('10.50');
  });

  // 測試精確的小數
  test('應該正確處理精確的小數', () => {
    const result = formatTime(10.123);
    expect(result).toBe('10.12');
  });

  // 測試需要四捨五入的小數
  test('應該正確進行四捨五入', () => {
    const result = formatTime(10.125);
    expect(result).toBe('10.13');
  });

  // 測試零值
  test('應該正確處理零值', () => {
    const result = formatTime(0);
    expect(result).toBe('0.00');
  });

  // 測試負數
  test('應該正確處理負數', () => {
    const result = formatTime(-5.25);
    expect(result).toBe('-5.25');
  });

  // 測試非常小的數字
  test('應該正確處理非常小的數字', () => {
    const result = formatTime(0.001);
    expect(result).toBe('0.00');
  });

  // 測試大數字
  test('應該正確處理大數字', () => {
    const result = formatTime(999.999);
    expect(result).toBe('1000.00');
  });

  // 測試邊界值 - 接近整數的小數
  test('應該正確處理接近整數的小數', () => {
    const result = formatTime(9.999);
    expect(result).toBe('10.00');
  });

  // 測試長小數
  test('應該截斷長小數到兩位', () => {
    const result = formatTime(123.456789);
    expect(result).toBe('123.46');
  });

  // 測試 NaN
  test('應該正確處理 NaN', () => {
    const result = formatTime(NaN);
    expect(result).toBe('NaN');
  });

  // 測試 Infinity
  test('應該正確處理 Infinity', () => {
    const result = formatTime(Infinity);
    expect(result).toBe('Infinity');
  });

  // 測試 -Infinity
  test('應該正確處理 -Infinity', () => {
    const result = formatTime(-Infinity);
    expect(result).toBe('-Infinity');
  });

  // 測試返回值類型
  test('應該返回字串類型', () => {
    const result = formatTime(10.5);
    expect(typeof result).toBe('string');
  });

  // 測試精度一致性
  test('應該保持格式化精度的一致性', () => {
    const testValues = [1.1, 2.22, 3.333, 4.4444];
    const results = testValues.map(formatTime);

    results.forEach((result) => {
      // 檢查是否總是有兩位小數（除了特殊值）
      if (!result.includes('NaN') && !result.includes('Infinity')) {
        expect(result).toMatch(/^-?\d+\.\d{2}$/);
      }
    });
  });

  // 測試數學運算結果
  test('應該正確處理數學運算的結果', () => {
    const calculated = 1 / 3; // 0.3333333...
    const result = formatTime(calculated);
    expect(result).toBe('0.33');
  });

  // 測試科學記號的數字
  test('應該正確處理科學記號的數字', () => {
    const result = formatTime(1e-5);
    expect(result).toBe('0.00');
  });
});
