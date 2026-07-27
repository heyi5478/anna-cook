import { type NextRequest } from 'next/server';
import { proxyAuthRequestApp } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  return proxyAuthRequestApp(request, '/check', 'GET');
}
