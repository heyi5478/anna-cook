const DEFAULT_IMAGE_FALLBACK = '/placeholder.svg';

const getConfiguredApiBaseUrl = (): string | undefined => {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_API_BASE_URL_DEV
  ) {
    return process.env.NEXT_PUBLIC_API_BASE_URL_DEV;
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL;
};

const getAssetBaseUrl = (): string | undefined => {
  const configuredAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  const baseUrl = configuredAssetBaseUrl || getConfiguredApiBaseUrl();

  if (!baseUrl) return undefined;

  try {
    const parsedUrl = new URL(baseUrl);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return undefined;
    }

    // API URLs include `/api`, while uploaded images are served from the host root.
    return configuredAssetBaseUrl ? parsedUrl.toString() : parsedUrl.origin;
  } catch {
    return undefined;
  }
};

/**
 * Converts an API-provided image path into a safe absolute URL.
 */
export const getImageUrl = (
  path: string | null | undefined,
  fallback: string = DEFAULT_IMAGE_FALLBACK,
): string => {
  if (!path) return fallback;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const assetBaseUrl = getAssetBaseUrl();
  if (!assetBaseUrl) return fallback;

  const normalizedBaseUrl = assetBaseUrl.endsWith('/')
    ? assetBaseUrl
    : `${assetBaseUrl}/`;
  const normalizedPath = path.replace(/^\/+/, '');

  return new URL(normalizedPath, normalizedBaseUrl).toString();
};
