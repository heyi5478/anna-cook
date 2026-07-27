import { type NextRequest } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';

export async function PATCH(request: NextRequest) {
  return proxyAuthRequestApp(request, '/recipes/delete-multiple', 'PATCH');
}
