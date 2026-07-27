import { type NextRequest } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> },
) {
  const { recipeId } = await params;
  return proxyAuthRequestApp(
    request,
    `/recipes/${encodeURIComponent(recipeId)}/teaching`,
    'GET',
  );
}
