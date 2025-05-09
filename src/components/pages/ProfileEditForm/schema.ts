import * as z from 'zod';

/**
 * 定義個人資料表單驗證結構
 */
export const profileFormSchema = z.object({
  nickname: z
    .string()
    .min(2, { message: '暱稱至少需要 2 個字元' })
    .max(30, { message: '暱稱不能超過 30 個字元' }),
  email: z.string().email({ message: '請輸入有效的電子郵件地址' }),
  bio: z.string().max(500, { message: '簡介不能超過 500 個字元' }).optional(),
});

/**
 * 導出表單值的類型定義
 */
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
