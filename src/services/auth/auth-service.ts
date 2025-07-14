import { getApiConfig } from '@/config';
import {
  GoogleAuthResponse,
  RegisterResponse,
  LoginResponse,
  CheckAuthResponse,
} from '@/types/api';
import { HTTP_STATUS } from '@/lib/constants';
import { updateAuthToken } from '../utils/http';

/**
 * 獲取 Google 登入 URL
 */
export const fetchGoogleAuthUrl = async (): Promise<string> => {
  try {
    console.log(`發送請求: GET ${getApiConfig().baseUrl}/auth/google/auth`);
    const res = await fetch(`${getApiConfig().baseUrl}/auth/google/auth`);
    console.log('回應狀態:', res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: GoogleAuthResponse = await res.json();
    console.log('Google auth URL fetched successfully');
    return data.redirectUri;
  } catch (error) {
    console.error('獲取 Google 登入 URL 失敗:', error);
    throw error;
  }
};

/**
 * 使用 Google 授權碼換取 token
 */
export const exchangeGoogleCodeForToken = async (
  code: string,
): Promise<any> => {
  try {
    // 直接調用後端 API，而不是 Next.js API 路由
    const res = await fetch(
      `${getApiConfig().baseUrl}/auth/google/callback?code=${encodeURIComponent(code)}`,
      {
        method: 'GET',
      },
    );

    console.log('回應狀態:', res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('Google code exchange completed');
    return data;
  } catch (error) {
    console.error('Google code 換取 token 失敗:', error);
    throw error;
  }
};

/**
 * 檢查使用者認證狀態並取得新的 Token 與使用者資料
 * @returns 包含新 Token 和使用者資料的回應，若未授權則回傳錯誤
 */
export const checkAuth = async (): Promise<CheckAuthResponse> => {
  try {
    console.log('發送請求: GET /api/auth/check');

    // 使用 Next.js API 路由而不是直接呼叫後端 API
    const res = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include', // 包含 Cookie
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseData = await res.json();
    console.log('Authentication check completed');

    // 檢查回應是否成功
    if (responseData.Status === false) {
      throw new Error(responseData.Message || '身份驗證失敗');
    }

    return responseData;
  } catch (error) {
    console.error('檢查使用者認證狀態失敗:', error);
    throw error;
  }
};

/**
 * 使用電子郵件註冊新帳號
 */
export const registerWithEmail = async (
  email: string,
  name: string,
  password: string,
): Promise<RegisterResponse> => {
  try {
    console.log(`發送請求: POST ${getApiConfig().baseUrl}/auth/register`);

    const requestData = {
      AccountEmail: email,
      AccountName: name,
      Password: password,
    };

    console.log('請求資料:', { ...requestData, Password: '***' });

    const res = await fetch(`${getApiConfig().baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Registration request processed successfully');
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    return responseData;
  } catch (error) {
    console.error('註冊失敗:', error);
    return {
      StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      msg: error instanceof Error ? error.message : '註冊過程中發生未知錯誤',
    };
  }
};

/**
 * 使用電子郵件與密碼登入帳號
 */
export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    console.log(`發送請求: POST ${getApiConfig().baseUrl}/auth/login`);

    const requestData = {
      AccountEmail: email,
      Password: password,
    };

    console.log('請求資料:', { ...requestData, Password: '***' });

    const res = await fetch(`${getApiConfig().baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('回應狀態:', res.status, res.statusText);

    // 解析回應資料
    const responseText = await res.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Authentication successful');
    } catch (e) {
      console.error('解析 JSON 失敗:', e);
      throw new Error(`回應不是有效的 JSON: ${responseText}`);
    }

    // 如果登入成功，將 token 存儲到 localStorage
    if (responseData.StatusCode === HTTP_STATUS.OK && responseData.token) {
      // 檢查是否在瀏覽器環境
      if (typeof window !== 'undefined') {
        updateAuthToken(responseData.token);

        // 如果有用戶資料，也存儲到 localStorage
        if (responseData.userData) {
          localStorage.setItem(
            'userData',
            JSON.stringify(responseData.userData),
          );
        }
      }
    }

    return responseData;
  } catch (error) {
    console.error('登入失敗:', error);
    return {
      StatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      msg: error instanceof Error ? error.message : '登入過程中發生未知錯誤',
    };
  }
};
