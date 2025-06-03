import * as z from 'zod';
import { VALIDATION_MESSAGES, TEXT_LIMITS } from '@/lib/constants';

/**
 * 定義個人資料表單驗證結構
 */
export const profileFormSchema = z.object({
  nickname: z
    .string()
    .min(TEXT_LIMITS.MIN_NICKNAME_LENGTH, {
      message: VALIDATION_MESSAGES.MIN_NICKNAME_LENGTH,
    })
    .max(TEXT_LIMITS.MAX_NICKNAME_LENGTH, {
      message: VALIDATION_MESSAGES.MAX_NICKNAME_LENGTH,
    }),
  email: z.string().email({ message: VALIDATION_MESSAGES.INVALID_EMAIL }),
  bio: z
    .string()
    .max(TEXT_LIMITS.MAX_BIO_LENGTH, {
      message: VALIDATION_MESSAGES.MAX_BIO_LENGTH,
    })
    .optional(),
});

/**
 * 導出表單值的類型定義
 */
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
