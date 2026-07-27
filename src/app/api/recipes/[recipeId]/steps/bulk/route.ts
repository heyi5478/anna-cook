import { type NextRequest } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> },
) {
  const { recipeId } = await params;
  return proxyAuthRequestApp(
    request,
    `/recipes/${encodeURIComponent(recipeId)}/steps/bulk`,
    'PUT',
  );
}
