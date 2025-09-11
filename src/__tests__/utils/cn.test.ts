import { cn } from '@/lib/utils/ui';

describe('cn 函式', () => {
  // 測試基本的 class 名稱合併功能
  test('應該正確合併基本的 class 名稱', () => {
    const result = cn('btn', 'primary');
    expect(result).toBe('btn primary');
  });

  // 測試條件式 class 名稱
  test('應該正確處理條件式 class 名稱', () => {
    const result = cn('btn', { 'btn-primary': true, 'btn-secondary': false });
    expect(result).toBe('btn btn-primary');
  });

  // 測試 Tailwind 類名沖突處理
  test('應該正確處理 Tailwind 類名沖突', () => {
    const result = cn('p-2 p-4');
    expect(result).toBe('p-4');
  });

  // 測試複雜的 Tailwind 類名沖突
  test('應該正確處理複雜的 Tailwind 類名沖突', () => {
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  // 測試陣列輸入
  test('應該正確處理陣列輸入', () => {
    const result = cn(['btn', 'primary'], 'large');
    expect(result).toBe('btn primary large');
  });

  // 測試 undefined 和 null 值
  test('應該正確過濾 undefined 和 null 值', () => {
    const result = cn('btn', undefined, null, 'primary');
    expect(result).toBe('btn primary');
  });

  // 測試空字串
  test('應該正確處理空字串', () => {
    const result = cn('btn', '', 'primary');
    expect(result).toBe('btn primary');
  });

  // 測試複雜的條件式類名合併
  test('應該正確處理複雜的條件式類名合併', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn(
      'btn',
      {
        'btn-active': isActive,
        'btn-disabled': isDisabled,
      },
      isActive && 'active-state',
    );
    expect(result).toBe('btn btn-active active-state');
  });

  // 測試嵌套的 Tailwind 類名沖突
  test('應該正確處理嵌套的 Tailwind 類名沖突', () => {
    const result = cn('p-2 px-4', 'px-6 py-2');
    expect(result).toBe('p-2 px-6 py-2');
  });

  // 測試無參數調用
  test('應該正確處理無參數調用', () => {
    const result = cn();
    expect(result).toBe('');
  });

  // 測試只有 falsy 值的情況
  test('應該正確處理只有 falsy 值的情況', () => {
    const result = cn(null, undefined, false, '');
    expect(result).toBe('');
  });
});
