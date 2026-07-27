import { type NextRequest } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return proxyAuthRequestApp(
    request,
    `/users/${encodeURIComponent(userId)}/follow`,
    'POST',
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return proxyAuthRequestApp(
    request,
    `/users/${encodeURIComponent(userId)}/follow`,
    'DELETE',
  );
}
