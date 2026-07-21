import { getImageUrl } from '@/lib/utils/media';

const originalNodeEnv = process.env.NODE_ENV;
const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const originalDevApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_DEV;
const originalAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

const restoreEnvironmentVariable = (
  name: string,
  value: string | undefined,
) => {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
};

describe('getImageUrl', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_API_BASE_URL =
      'https://annacook.rocket-coding.com/api';
    delete process.env.NEXT_PUBLIC_API_BASE_URL_DEV;
    delete process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  });

  afterAll(() => {
    restoreEnvironmentVariable('NODE_ENV', originalNodeEnv);
    restoreEnvironmentVariable('NEXT_PUBLIC_API_BASE_URL', originalApiBaseUrl);
    restoreEnvironmentVariable(
      'NEXT_PUBLIC_API_BASE_URL_DEV',
      originalDevApiBaseUrl,
    );
    restoreEnvironmentVariable(
      'NEXT_PUBLIC_ASSET_BASE_URL',
      originalAssetBaseUrl,
    );
  });

  it('returns the fallback for an empty image path', () => {
    expect(getImageUrl(null, '/images/fallback.jpg')).toBe(
      '/images/fallback.jpg',
    );
  });

  it('keeps absolute HTTP and HTTPS URLs unchanged', () => {
    expect(getImageUrl('https://cdn.example.com/image.webp')).toBe(
      'https://cdn.example.com/image.webp',
    );
    expect(getImageUrl('http://localhost:3000/image.webp')).toBe(
      'http://localhost:3000/image.webp',
    );
  });

  it('derives the asset host from an API URL with an /api path', () => {
    expect(getImageUrl('/RecipeCoverPhoto/example.webp')).toBe(
      'https://annacook.rocket-coding.com/RecipeCoverPhoto/example.webp',
    );
    expect(getImageUrl('RecipeCoverPhoto/example.webp')).toBe(
      'https://annacook.rocket-coding.com/RecipeCoverPhoto/example.webp',
    );
  });

  it('uses the development API host during local development', () => {
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_API_BASE_URL_DEV = 'http://localhost:5000/api';

    expect(getImageUrl('/RecipeCoverPhoto/example.webp')).toBe(
      'http://localhost:5000/RecipeCoverPhoto/example.webp',
    );
  });

  it('prefers an explicit asset base URL and normalizes slashes', () => {
    process.env.NEXT_PUBLIC_ASSET_BASE_URL = 'https://cdn.example.com/assets/';

    expect(getImageUrl('/RecipeCoverPhoto/example.webp')).toBe(
      'https://cdn.example.com/assets/RecipeCoverPhoto/example.webp',
    );
  });

  it('never emits undefined when image configuration is missing', () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    delete process.env.NEXT_PUBLIC_API_BASE_URL_DEV;

    const result = getImageUrl('/RecipeCoverPhoto/example.webp');

    expect(result).toBe('/placeholder.svg');
    expect(result).not.toContain('undefined');
  });
});
