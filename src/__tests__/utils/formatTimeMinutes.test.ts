import { formatTimeMinutes } from '@/lib/utils/time';

describe('formatTimeMinutes 函式', () => {
  // 測試基本時間格式化功能
  test('應該將秒數格式化為 mm:ss 格式', () => {
    const result = formatTimeMinutes(65);
    expect(result).toBe('1:05');
  });

  // 測試零秒
  test('應該正確處理零秒', () => {
    const result = formatTimeMinutes(0);
    expect(result).toBe('0:00');
  });

  // 測試不到一分鐘
  test('應該正確處理不到一分鐘的時間', () => {
    const result = formatTimeMinutes(30);
    expect(result).toBe('0:30');
  });

  // 測試個位數秒
  test('應該正確格式化個位數秒數', () => {
    const result = formatTimeMinutes(5);
    expect(result).toBe('0:05');
  });

  // 測試十位數秒
  test('應該正確格式化十位數秒數', () => {
    const result = formatTimeMinutes(15);
    expect(result).toBe('0:15');
  });

  // 測試整分鐘
  test('應該正確處理整分鐘', () => {
    const result = formatTimeMinutes(120);
    expect(result).toBe('2:00');
  });

  // 測試多分鐘
  test('應該正確處理多分鐘的時間', () => {
    const result = formatTimeMinutes(185);
    expect(result).toBe('3:05');
  });

  // 測試長時間 (超過一小時)
  test('應該正確處理超過一小時的時間', () => {
    const result = formatTimeMinutes(3661);
    expect(result).toBe('61:01');
  });

  // 測試小數秒數 (應該向下取整)
  test('應該將小數秒數向下取整', () => {
    const result = formatTimeMinutes(65.9);
    expect(result).toBe('1:05');
  });

  // 測試分鐘邊界值
  test('應該正確處理 59 秒', () => {
    const result = formatTimeMinutes(59);
    expect(result).toBe('0:59');
  });

  // 測試 60 秒正好是一分鐘
  test('應該正確處理 60 秒', () => {
    const result = formatTimeMinutes(60);
    expect(result).toBe('1:00');
  });

  // 測試大數值
  test('應該正確處理大數值', () => {
    const result = formatTimeMinutes(599);
    expect(result).toBe('9:59');
  });

  // 測試超過 10 分鐘
  test('應該正確處理超過 10 分鐘的時間', () => {
    const result = formatTimeMinutes(725);
    expect(result).toBe('12:05');
  });

  // 測試負數 (雖然在實際使用中可能不會出現)
  test('應該正確處理負數', () => {
    const result = formatTimeMinutes(-65);
    expect(result).toBe('-2:-5');
  });

  // 測試返回值格式
  test('應該返回正確的格式 mm:ss', () => {
    const result = formatTimeMinutes(125);
    expect(result).toMatch(/^\d+:\d{2}$/);
  });

  // 測試返回值類型
  test('應該返回字串類型', () => {
    const result = formatTimeMinutes(65);
    expect(typeof result).toBe('string');
  });

  // 測試秒數補零功能
  test('應該正確補零秒數', () => {
    const testCases = [
      { input: 61, expected: '1:01' },
      { input: 62, expected: '1:02' },
      { input: 69, expected: '1:09' },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(formatTimeMinutes(input)).toBe(expected);
    });
  });

  // 測試多個測試案例的一致性
  test('應該保持格式一致性', () => {
    const testValues = [0, 30, 60, 90, 3600, 3661];
    const results = testValues.map(formatTimeMinutes);

    results.forEach((result) => {
      // 檢查格式：數字:兩位數字
      expect(result).toMatch(/^-?\d+:\d{2}$/);
    });
  });

  // 測試邊界值的準確性
  test('應該正確計算邊界值', () => {
    expect(formatTimeMinutes(0)).toBe('0:00');
    expect(formatTimeMinutes(1)).toBe('0:01');
    expect(formatTimeMinutes(59)).toBe('0:59');
    expect(formatTimeMinutes(60)).toBe('1:00');
    expect(formatTimeMinutes(61)).toBe('1:01');
    expect(formatTimeMinutes(119)).toBe('1:59');
    expect(formatTimeMinutes(120)).toBe('2:00');
  });

  // 測試 NaN 處理
  test('應該正確處理 NaN', () => {
    const result = formatTimeMinutes(NaN);
    expect(result).toBe('NaN:NaN');
  });
});
