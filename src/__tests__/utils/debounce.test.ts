import { debounce } from '@/lib/utils/performance';

describe('debounce 函式', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // 測試基本防抖功能
  test('應該延遲執行函式', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  // 測試多次調用只執行最後一次
  test('多次快速調用應該只執行最後一次', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  // 測試參數傳遞
  test('應該正確傳遞參數', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2', 123);

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  // 測試最後一次調用的參數被使用
  test('應該使用最後一次調用的參數', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('third');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  // 測試 this 上下文
  test('應該保持正確的 this 上下文', () => {
    const obj = {
      value: 'test',
      method: jest.fn(function (this: any) {
        expect(this.value).toBe('test');
      }),
    };

    const debouncedMethod = debounce(obj.method, 100);
    debouncedMethod.call(obj);

    jest.advanceTimersByTime(100);
    expect(obj.method).toHaveBeenCalledTimes(1);
  });

  // 測試不同延遲時間
  test('應該正確處理不同的延遲時間', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 250);

    debouncedFn();

    jest.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(150);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  // 測試連續調用的重置機制
  test('新的調用應該重置計時器', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    jest.advanceTimersByTime(50);

    debouncedFn(); // 重置計時器
    jest.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  // 測試零延遲
  test('應該正確處理零延遲', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  // 測試負延遲
  test('應該正確處理負延遲', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, -10);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  // 測試返回值類型
  test('應該返回一個函式', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    expect(typeof debouncedFn).toBe('function');
  });

  // 測試複雜場景
  test('應該處理複雜的調用模式', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    // 第一批調用
    debouncedFn('batch1');
    debouncedFn('batch1');

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('batch1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 第二批調用
    debouncedFn('batch2');
    debouncedFn('batch2');

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('batch2');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  // 測試多個 debounced 函式的獨立性
  test('多個 debounced 函式應該獨立運作', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const debouncedFn1 = debounce(mockFn1, 100);
    const debouncedFn2 = debounce(mockFn2, 200);

    debouncedFn1();
    debouncedFn2();

    jest.advanceTimersByTime(100);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  // 測試錯誤處理
  test('應該正確處理函式內部錯誤', () => {
    const errorFn = jest.fn(() => {
      throw new Error('Test error');
    });
    const debouncedFn = debounce(errorFn, 100);

    debouncedFn();

    expect(() => {
      jest.advanceTimersByTime(100);
    }).toThrow('Test error');

    expect(errorFn).toHaveBeenCalledTimes(1);
  });

  // 測試函式執行的順序
  test('應該按正確順序執行', () => {
    const results: string[] = [];
    const mockFn = jest.fn((value: string) => {
      results.push(value);
    });
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');

    jest.advanceTimersByTime(100);
    expect(results).toEqual(['second']);
  });
});
