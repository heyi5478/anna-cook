import type { NextRequest } from 'next/server';
import { GET as draftGET } from '@/app/api/recipes/[recipeId]/draft/route';
import { GET as teachingGET } from '@/app/api/recipes/[recipeId]/teaching/route';
import { POST as followPOST } from '@/app/api/users/[userId]/follow/route';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';

// Mock App Router 版後端代理，攔截並斷言最終送往後端的 URL
jest.mock('@/lib/auth-middleware', () => ({
  proxyAuthRequestApp: jest.fn(),
}));

const mockProxy = proxyAuthRequestApp as jest.Mock;

// proxyAuthRequestApp 已被 mock，request 只是被原樣傳遞
const req = {} as NextRequest;

describe('API 路徑參數編碼（api-path-parameter-safety）', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('draft：惡意 recipeId 會被編碼，阻止路徑穿越', async () => {
    await draftGET(req, { params: Promise.resolve({ recipeId: '../../secret' }) });

    expect(mockProxy).toHaveBeenCalledWith(
      req,
      '/recipes/..%2F..%2Fsecret/draft',
      'GET',
    );
  });

  test('draft：正常 recipeId 為無操作（no-op），不影響既有行為', async () => {
    await draftGET(req, { params: Promise.resolve({ recipeId: 'abc123' }) });

    expect(mockProxy).toHaveBeenCalledWith(req, '/recipes/abc123/draft', 'GET');
  });

  test('teaching：含斜線的 recipeId 會被編碼', async () => {
    await teachingGET(req, { params: Promise.resolve({ recipeId: 'a/b' }) });

    expect(mockProxy).toHaveBeenCalledWith(
      req,
      '/recipes/a%2Fb/teaching',
      'GET',
    );
  });

  test('follow：含斜線的 userId 會被編碼', async () => {
    await followPOST(req, { params: Promise.resolve({ userId: 'u/../admin' }) });

    expect(mockProxy).toHaveBeenCalledWith(
      req,
      '/users/u%2F..%2Fadmin/follow',
      'POST',
    );
  });
});
