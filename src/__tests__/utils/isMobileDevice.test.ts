import { isMobileDevice } from '@/lib/utils/device';

describe('isMobileDevice 函式', () => {
  // 測試 iPhone 裝置
  test('應該正確識別 iPhone 裝置', () => {
    const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    );

    expect(isMobileDevice()).toBe(true);

    userAgentGetter.mockRestore();
  });

  // 測試 iPad 裝置
  test('應該正確識別 iPad 裝置', () => {
    const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
    );

    expect(isMobileDevice()).toBe(true);

    userAgentGetter.mockRestore();
  });

  // 測試 iPod 裝置
  test('應該正確識別 iPod 裝置', () => {
    const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)',
    );

    expect(isMobileDevice()).toBe(true);

    userAgentGetter.mockRestore();
  });

  // 測試 Android 裝置
  test('應該正確識別 Android 裝置', () => {
    const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
    );

    expect(isMobileDevice()).toBe(true);

    userAgentGetter.mockRestore();
  });

  // 測試桌面 Chrome 瀏覽器
  test('應該正確識別桌面瀏覽器', () => {
    const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    );

    expect(isMobileDevice()).toBe(false);

    userAgentGetter.mockRestore();
  });

  // 測試空的 userAgent
  test('應該正確處理空的 userAgent', () => {
    const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue('');

    expect(isMobileDevice()).toBe(false);

    userAgentGetter.mockRestore();
  });

  // 測試大小寫不敏感
  test('應該正確處理大小寫變化', () => {
    const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue('iphone test');

    expect(isMobileDevice()).toBe(true);

    userAgentGetter.mockRestore();
  });

  // 測試 navigator 不存在的情況
  test('應該正確處理 navigator 不存在的情況', () => {
    // 暫時替換 navigator
    const originalNavigator = global.navigator;
    delete (global as any).navigator;

    expect(isMobileDevice()).toBe(false);

    // 恢復 navigator
    global.navigator = originalNavigator;
  });

  // 測試返回值類型
  test('應該返回布林值', () => {
    const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue('iPhone');

    const result = isMobileDevice();
    expect(typeof result).toBe('boolean');

    userAgentGetter.mockRestore();
  });

  // 測試各種行動裝置
  test('應該正確識別所有支援的行動裝置類型', () => {
    const mobileDevices = ['iPhone', 'iPad', 'iPod', 'Android'];

    mobileDevices.forEach((device) => {
      const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');
      userAgentGetter.mockReturnValue(`Some user agent with ${device} in it`);

      expect(isMobileDevice()).toBe(true);

      userAgentGetter.mockRestore();
    });
  });
});
