import { type NextRequest, NextResponse } from 'next/server';

// 接收 CSP（Report-Only）違規回報並記錄於伺服器 log；一律回 204。
// 僅供 report-only 調校階段觀察哪些來源會被擋，不對外回傳內容。
export async function POST(request: NextRequest) {
  try {
    const report = await request.text();
    console.warn('[CSP-Report]', report.slice(0, 2000));
  } catch {
    // 忽略解析錯誤，不影響回報流程
  }
  return new NextResponse(null, { status: 204 });
}
