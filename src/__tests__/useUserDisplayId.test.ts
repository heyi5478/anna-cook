import { renderHook, waitFor } from '@testing-library/react';
import { useUserDisplayId } from '../hooks/useUserDisplayId';

// Mock console.error 避免測試時顯示錯誤訊息
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('useUserDisplayId', () => {
  // 在每個測試前清理所有 mock
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleError.mockClear();
  });

  // 清理所有 mock
  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  // 測試初始狀態
  test('應該返回空字串作為初始值', () => {
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(null);

    const { result } = renderHook(() => useUserDisplayId());
    expect(result.current).toBe('');
  });

  // 測試成功從 localStorage 讀取 displayId
  test('應該從 localStorage 中成功讀取 displayId', async () => {
    const mockUserData = {
      displayId: 'user123',
      name: 'Test User',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe('user123');
    });
  });

  // 測試 localStorage 中沒有 userData
  test('當 localStorage 中沒有 userData 時應該返回空字串', () => {
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(null);

    const { result } = renderHook(() => useUserDisplayId());
    expect(result.current).toBe('');
  });

  // 測試 userData 存在但沒有 displayId 屬性
  test('當 userData 中沒有 displayId 時應該返回空字串', async () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@example.com',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result } = renderHook(() => useUserDisplayId());

    // 等待 useEffect 執行完成
    await waitFor(() => {
      expect(result.current).toBe('');
    });
  });

  // 測試 userData 中 displayId 為 null
  test('當 displayId 為 null 時應該返回空字串', async () => {
    const mockUserData = {
      displayId: null,
      name: 'Test User',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe('');
    });
  });

  // 測試 userData 中 displayId 為 undefined
  test('當 displayId 為 undefined 時應該返回空字串', async () => {
    const mockUserData = {
      displayId: undefined,
      name: 'Test User',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe('');
    });
  });

  // 測試 displayId 為空字串
  test('當 displayId 為空字串時應該返回空字串', async () => {
    const mockUserData = {
      displayId: '',
      name: 'Test User',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe('');
    });
  });

  // 測試 JSON 解析錯誤
  test('當 localStorage 中的 userData 不是有效 JSON 時應該處理錯誤', async () => {
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue('invalid json string');

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe('');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '解析 localStorage 中的 userData 失敗:',
        expect.any(SyntaxError),
      );
    });
  });

  // 測試 localStorage.getItem 拋出異常
  test('當 localStorage.getItem 拋出異常時應該處理錯誤', async () => {
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockImplementation(() => {
      throw new Error('localStorage access denied');
    });

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe('');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '解析 localStorage 中的 userData 失敗:',
        expect.any(Error),
      );
    });
  });

  // 測試 SSR 環境（模擬 window 未定義）
  test('在 SSR 環境中應該返回空字串', () => {
    // 暫時移除 window 物件
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const { result } = renderHook(() => useUserDisplayId());
    expect(result.current).toBe('');

    // 恢復 window 物件
    global.window = originalWindow;
  });

  // 測試複雜的 userData 結構
  test('應該正確處理複雜的 userData 結構', async () => {
    const mockUserData = {
      user: {
        profile: {
          displayId: 'complex_user_456',
        },
      },
      displayId: 'simple_user_123',
      settings: {
        theme: 'dark',
      },
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      // 應該取得第一層的 displayId
      expect(result.current).toBe('simple_user_123');
    });
  });

  // 測試數字型 displayId
  test('應該正確處理數字型 displayId', async () => {
    const mockUserData = {
      displayId: 12345,
      name: 'Test User',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe(12345);
    });
  });

  // 測試布林值 displayId
  test('應該正確處理布林值 displayId', async () => {
    const mockUserData = {
      displayId: true,
      name: 'Test User',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  // 測試 localStorage 中存在但為空字串的 userData
  test('當 localStorage 中 userData 為空字串時應該返回空字串', async () => {
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue('');

    const { result } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe('');
    });
  });

  // 測試 hook 的穩定性（多次渲染）
  test('多次渲染應該返回相同的結果', async () => {
    const mockUserData = {
      displayId: 'stable_user_789',
      name: 'Test User',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    const { result, rerender } = renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(result.current).toBe('stable_user_789');
    });

    // 重新渲染
    rerender();
    await waitFor(() => {
      expect(result.current).toBe('stable_user_789');
    });

    // 再次重新渲染
    rerender();
    await waitFor(() => {
      expect(result.current).toBe('stable_user_789');
    });
  });

  // 測試 localStorage 被調用的參數
  test('應該使用正確的 key 調用 localStorage.getItem', async () => {
    const mockUserData = {
      displayId: 'test_user',
      name: 'Test User',
    };
    const mockGetItem = localStorage.getItem as jest.Mock;
    mockGetItem.mockReturnValue(JSON.stringify(mockUserData));

    renderHook(() => useUserDisplayId());

    await waitFor(() => {
      expect(mockGetItem).toHaveBeenCalledWith('userData');
    });
  });
});
