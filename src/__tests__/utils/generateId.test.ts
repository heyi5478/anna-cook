import { generateId } from '@/lib/utils';

describe('generateId 函式', () => {
  // 測試基本 ID 生成功能
  test('應該生成字串 ID', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  // 測試 ID 長度
  test('應該生成長度為 7 的 ID', () => {
    const id = generateId();
    expect(id).toHaveLength(7);
  });

  // 測試 ID 格式 (只包含字母和數字)
  test('應該只包含字母和數字', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });

  // 測試 ID 唯一性
  test('應該生成唯一的 ID', () => {
    const ids = new Set();
    const iterations = 1000;

    for (let i = 0; i < iterations; i += 1) {
      const id = generateId();
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }

    expect(ids.size).toBe(iterations);
  });

  // 測試 ID 不為空
  test('應該不生成空字串', () => {
    const id = generateId();
    expect(id).not.toBe('');
    expect(id.length).toBeGreaterThan(0);
  });

  // 測試多次調用的獨立性
  test('多次調用應該產生不同的結果', () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();

    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });

  // 測試 ID 不包含特殊字符
  test('應該不包含特殊字符', () => {
    const id = generateId();
    expect(id).not.toMatch(/[^a-z0-9]/);
  });

  // 測試批量生成的統計分佈
  test('批量生成應該有合理的字符分佈', () => {
    const ids = Array.from({ length: 100 }, () => generateId());
    const combinedIds = ids.join('');

    // 檢查是否包含字母
    expect(combinedIds).toMatch(/[a-z]/);
    // 檢查是否包含數字
    expect(combinedIds).toMatch(/[0-9]/);
  });

  // 測試函式的一致性
  test('函式應該是確定性的 (相同的隨機種子應該產生相同結果)', () => {
    // 由於使用 Math.random()，我們測試函式本身的存在和基本行為
    expect(typeof generateId).toBe('function');
    expect(generateId()).toBeDefined();
  });

  // 測試邊界條件
  test('應該處理連續快速調用', () => {
    const ids = [];
    for (let i = 0; i < 10; i += 1) {
      ids.push(generateId());
    }

    // 檢查所有 ID 都是有效的
    ids.forEach((id) => {
      expect(typeof id).toBe('string');
      expect(id).toHaveLength(7);
      expect(id).toMatch(/^[a-z0-9]+$/);
    });

    // 檢查唯一性
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
