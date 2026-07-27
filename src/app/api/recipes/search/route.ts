import { type NextRequest, NextResponse } from 'next/server';
import { getApiConfig } from '@/config';
import { HTTP_STATUS, SORT_TYPES } from '@/lib/constants';

// 轉發食譜搜尋請求到後端 API（無需認證）
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const searchData = searchParams.get('searchData') ?? '';
  const type = searchParams.get('type') ?? SORT_TYPES.CREATED_AT;
  const number = searchParams.get('number') ?? '1';

  try {
    const queryParams = new URLSearchParams();
    if (searchData) {
      queryParams.append('searchData', searchData);
    }
    queryParams.append('type', type);
    queryParams.append('number', number);

    const apiUrl = `${getApiConfig().baseUrl}/recipes/search?${queryParams.toString()}`;
    console.log(`前端 API 代理請求: GET ${apiUrl}`);

    const response = await fetch(apiUrl);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('處理食譜搜尋請求失敗:', error);
    return NextResponse.json(
      {
        StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        msg: '處理食譜搜尋請求失敗',
        number: `page ${number}`,
        hasMore: false,
        totalCount: 0,
        data: [],
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
