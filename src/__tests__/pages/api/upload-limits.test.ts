import type { NextRequest } from 'next/server';
import { POST as createPOST } from '@/app/api/recipes/create/route';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';

jest.mock('@/lib/auth-middleware', () => ({
  proxyAuthRequestApp: jest.fn(),
}));

// 收窄大小/型別上限，便於測試
jest.mock('@/lib/upload', () => ({
  MAX_IMAGE_BYTES: 100,
  IMAGE_MIME_WHITELIST: ['image/jpeg', 'image/png'],
}));

// NextResponse.json 在 jsdom 直接用有 server-only 依賴，mock 成簡單物件
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      body,
    }),
  },
}));

const mockProxy = proxyAuthRequestApp as jest.Mock;

// create route 只呼叫 request.formData()，用最小 request 提供
const reqWith = (fd: FormData) =>
  ({ formData: async () => fd }) as unknown as NextRequest;

const imageFile = (type: string, bytes: number, name = 'x') =>
  new File([new Uint8Array(bytes)], name, { type });

describe('上傳限制（file-upload-limits）— create 端點', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('檔案過大時回 413，且不代理到後端', async () => {
    const fd = new FormData();
    fd.append('recipeName', '蛋糕');
    fd.append('photo', imageFile('image/jpeg', 200, 'big.jpg'));
    const res = await createPOST(reqWith(fd));
    expect(res.status).toBe(413);
    expect(mockProxy).not.toHaveBeenCalled();
  });

  test('缺少必填封面圖片時回 400', async () => {
    const fd = new FormData();
    fd.append('recipeName', '蛋糕');
    const res = await createPOST(reqWith(fd));
    expect(res.status).toBe(400);
    expect(mockProxy).not.toHaveBeenCalled();
  });

  test('非白名單 MIME 型別時回 415', async () => {
    const fd = new FormData();
    fd.append('recipeName', '蛋糕');
    fd.append('photo', imageFile('application/x-msdownload', 10, 'x.exe'));
    const res = await createPOST(reqWith(fd));
    expect(res.status).toBe(415);
    expect(mockProxy).not.toHaveBeenCalled();
  });

  test('合法圖片會通過並代理到後端 /recipes', async () => {
    const fd = new FormData();
    fd.append('recipeName', '蛋糕');
    fd.append('photo', imageFile('image/jpeg', 10, 'cake.jpg'));
    await createPOST(reqWith(fd));
    expect(mockProxy).toHaveBeenCalledTimes(1);
    expect(mockProxy).toHaveBeenCalledWith(
      expect.anything(),
      '/recipes',
      'POST',
      expect.any(FormData),
    );
  });
});
