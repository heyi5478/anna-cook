import type { NextApiRequest, NextApiResponse } from 'next';
import createHandler from '@/pages/api/recipes/create';
import { proxyAuthRequest } from '@/lib/auth-middleware';
import { createUploadForm, isFileTooLargeError } from '@/lib/upload';
import { HTTP_STATUS } from '@/lib/constants';

jest.mock('@/lib/auth-middleware', () => ({
  proxyAuthRequest: jest.fn(),
}));

// Mock 上傳工具，讓測試控制 parse 結果並攔截後端代理
jest.mock('@/lib/upload', () => ({
  createUploadForm: jest.fn(),
  isFileTooLargeError: jest.fn(),
  fileToBlob: jest.fn(async () => new Blob(['x'])),
  MAX_IMAGE_BYTES: 100,
  IMAGE_MIME_WHITELIST: ['image/jpeg', 'image/png'],
}));

const mockProxy = proxyAuthRequest as jest.Mock;
const mockCreateForm = createUploadForm as jest.Mock;
const mockIsTooLarge = isFileTooLargeError as jest.Mock;

// 設定 form.parse 的行為：resolve 指定的 [fields, files]，或 reject 指定錯誤
const setParse = (impl: { resolve?: unknown; reject?: unknown }) => {
  const parse = jest.fn();
  if (impl.reject !== undefined) {
    parse.mockRejectedValue(impl.reject);
  } else {
    parse.mockResolvedValue(impl.resolve);
  }
  mockCreateForm.mockReturnValue({ parse });
};

const createRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res as unknown as NextApiResponse & {
    status: jest.Mock;
    json: jest.Mock;
  };
};

const req = { method: 'POST', query: {} } as unknown as NextApiRequest;

describe('上傳限制（file-upload-limits）— create 端點', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsTooLarge.mockReturnValue(false);
  });

  test('檔案過大時回 413，且不代理到後端', async () => {
    setParse({ reject: { httpCode: 413 } });
    mockIsTooLarge.mockReturnValue(true);
    const res = createRes();

    await createHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(413);
    expect(mockProxy).not.toHaveBeenCalled();
  });

  test('缺少必填封面圖片時回 400', async () => {
    setParse({ resolve: [{ recipeName: ['蛋糕'] }, {}] });
    const res = createRes();

    await createHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(mockProxy).not.toHaveBeenCalled();
  });

  test('非白名單 MIME 型別時回 415', async () => {
    setParse({
      resolve: [
        { recipeName: ['蛋糕'] },
        {
          photo: [
            {
              mimetype: 'application/x-msdownload',
              filepath: '/tmp/x',
              originalFilename: 'x.exe',
            },
          ],
        },
      ],
    });
    const res = createRes();

    await createHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(415);
    expect(mockProxy).not.toHaveBeenCalled();
  });

  test('合法圖片會通過並代理到後端 /recipes', async () => {
    setParse({
      resolve: [
        { recipeName: ['蛋糕'] },
        {
          photo: [
            {
              mimetype: 'image/jpeg',
              filepath: '/tmp/cake.jpg',
              originalFilename: 'cake.jpg',
            },
          ],
        },
      ],
    });
    const res = createRes();

    await createHandler(req, res);

    expect(mockProxy).toHaveBeenCalledTimes(1);
    expect(mockProxy).toHaveBeenCalledWith(
      req,
      res,
      '/recipes',
      'POST',
      expect.anything(),
    );
    expect(res.status).not.toHaveBeenCalledWith(413);
    expect(res.status).not.toHaveBeenCalledWith(415);
  });
});
