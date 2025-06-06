import { NextApiRequest, NextApiResponse } from 'next';
import { apiConfig } from '@/config';
import { HTTP_STATUS, SORT_TYPES } from '@/lib/constants';

/**
 * 轉發食譜搜尋請求到後端 API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res
      .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
      .json({ message: '僅支援 GET 請求' });
  }

  try {
    const {
      searchData = '',
      type = SORT_TYPES.CREATED_AT,
      number = '1',
    } = req.query;

    // 構建查詢參數
    const queryParams = new URLSearchParams();
    if (searchData) {
      queryParams.append('searchData', String(searchData));
    }
    queryParams.append('type', String(type));
    queryParams.append('number', String(number));

    // 發送請求到後端 API
    const apiUrl = `${apiConfig.baseUrl}/recipes/search?${queryParams.toString()}`;
    console.log(`前端 API 代理請求: GET ${apiUrl}`);

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('後端回應:', data);

    // 將後端回應轉發給前端
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('處理食譜搜尋請求失敗:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      msg: '處理食譜搜尋請求失敗',
      number: `page ${req.query.number || 1}`,
      hasMore: false,
      totalCount: 0,
      data: [],
    });
  }
}
