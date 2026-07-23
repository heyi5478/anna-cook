// Mock formidable，避免真正建立解析器並可驗證傳入選項
import formidable from 'formidable';
import { isFileTooLargeError, createUploadForm } from '@/lib/upload';

jest.mock('formidable', () => jest.fn(() => ({ parse: jest.fn() })));

describe('upload 工具（file-upload-limits）', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUploadForm', () => {
    test('應以指定的 maxFileSize 建立 formidable 表單', () => {
      createUploadForm(12345);
      expect(formidable).toHaveBeenCalledWith({ maxFileSize: 12345 });
    });
  });

  describe('isFileTooLargeError', () => {
    test('httpCode 為 413 時判定為檔案過大', () => {
      expect(isFileTooLargeError({ httpCode: 413 })).toBe(true);
    });

    test('其他 httpCode 不判定為檔案過大', () => {
      expect(isFileTooLargeError({ httpCode: 500 })).toBe(false);
      expect(isFileTooLargeError({ httpCode: 400 })).toBe(false);
    });

    test('非物件、null、一般 Error 皆不判定為檔案過大', () => {
      expect(isFileTooLargeError(null)).toBe(false);
      expect(isFileTooLargeError(undefined)).toBe(false);
      expect(isFileTooLargeError('boom')).toBe(false);
      expect(isFileTooLargeError(new Error('boom'))).toBe(false);
    });
  });
});
