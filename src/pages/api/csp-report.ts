import type { NextApiRequest, NextApiResponse } from 'next';

// CSP 違規回報可能為 application/csp-report 或 application/reports+json，
// 放寬 bodyParser 以能收下各種型別。
export const config = {
  api: {
    bodyParser: { type: '*/*', sizeLimit: '256kb' },
  },
};

/**
 * 接收 CSP（Report-Only）違規回報並記錄於伺服器 log；一律回 204。
 * 僅供 report-only 調校階段觀察哪些來源會被擋，不對外回傳內容。
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const report =
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    console.warn('[CSP-Report]', report.slice(0, 2000));
  } catch {
    // 忽略解析錯誤，不影響回報流程
  }

  return res.status(204).end();
}
