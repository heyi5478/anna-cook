import { type NextRequest } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ displayId: string }> },
) {
  const { displayId } = await params;
  return proxyAuthRequestApp(
    request,
    `/user/${encodeURIComponent(displayId)}/author-favorite-follow`,
    'GET',
  );
}
