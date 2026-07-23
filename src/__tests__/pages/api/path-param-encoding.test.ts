import type { NextApiRequest, NextApiResponse } from 'next';
import draftHandler from '@/pages/api/recipes/[recipeId]/draft';
import teachingHandler from '@/pages/api/recipes/[recipeId]/teaching';
import followHandler from '@/pages/api/users/[userId]/follow';
import { proxyAuthRequest } from '@/lib/auth-middleware';

// Mock 後端代理，攔截並斷言最終送往後端的 URL
jest.mock('@/lib/auth-middleware', () => ({
  proxyAuthRequest: jest.fn(),
}));

const mockProxy = proxyAuthRequest as jest.Mock;

// 建立最小 res mock（支援 res.status().json() 串接）
const createRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res as unknown as NextApiResponse & {
    status: jest.Mock;
    json: jest.Mock;
  };
};

const createReq = (
  query: Record<string, unknown>,
  method = 'GET',
): NextApiRequest => ({ method, query }) as unknown as NextApiRequest;

describe('API 路徑參數編碼（api-path-parameter-safety）', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('draft：惡意 recipeId 會被編碼，阻止路徑穿越', async () => {
    const req = createReq({ recipeId: '../../secret' });
    const res = createRes();

    await draftHandler(req, res);

    expect(mockProxy).toHaveBeenCalledWith(
      req,
      res,
      '/recipes/..%2F..%2Fsecret/draft',
      'GET',
    );
  });

  test('draft：正常 recipeId 為無操作（no-op），不影響既有行為', async () => {
    const req = createReq({ recipeId: 'abc123' });
    const res = createRes();

    await draftHandler(req, res);

    expect(mockProxy).toHaveBeenCalledWith(
      req,
      res,
      '/recipes/abc123/draft',
      'GET',
    );
  });

  test('teaching：含斜線的 recipeId 會被編碼', async () => {
    const req = createReq({ recipeId: 'a/b' });
    const res = createRes();

    await teachingHandler(req, res);

    expect(mockProxy).toHaveBeenCalledWith(
      req,
      res,
      '/recipes/a%2Fb/teaching',
      'GET',
    );
  });

  test('follow：含斜線的 userId 會被編碼', async () => {
    const req = createReq({ userId: 'u/../admin' }, 'POST');
    const res = createRes();

    await followHandler(req, res);

    expect(mockProxy).toHaveBeenCalledWith(
      req,
      res,
      '/users/u%2F..%2Fadmin/follow',
      'POST',
    );
  });

  test('draft：非 GET 方法回 405，且不代理到後端', async () => {
    const req = createReq({ recipeId: 'x' }, 'POST');
    const res = createRes();

    await draftHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(mockProxy).not.toHaveBeenCalled();
  });
});
