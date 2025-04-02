import * as z from 'zod';

// 定義表單驗證規則
export const contactFormSchema = z.object({
  name: z.string().min(1, { message: '請輸入姓名' }),
  email: z.string().email({ message: '請輸入有效的電子信箱' }),
  issueType: z.enum(
    [
      '1. 檢舉會員',
      '2. 檢舉餐廳',
      '3. 檢舉留言',
      '4. 會員操作問題',
      '5. 廣告/行銷合作',
      '6. 其他',
    ],
    {
      required_error: '請選擇問題類型',
    },
  ),
  message: z.string().min(10, { message: '留言內容至少需要10個字元' }),
});

// 定義表單資料型別
export type ContactFormValues = z.infer<typeof contactFormSchema>;
