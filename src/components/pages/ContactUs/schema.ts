import * as z from 'zod';
import { VALIDATION_MESSAGES, ISSUE_TYPES, TEXT_LIMITS } from '@/lib/constants';

// 定義表單驗證規則
export const contactFormSchema = z.object({
  name: z.string().min(TEXT_LIMITS.MIN_NAME_LENGTH, {
    message: VALIDATION_MESSAGES.REQUIRED_NAME,
  }),
  email: z.string().email({ message: VALIDATION_MESSAGES.REQUIRED_EMAIL }),
  issueType: z.enum(ISSUE_TYPES, {
    required_error: VALIDATION_MESSAGES.REQUIRED_ISSUE_TYPE,
  }),
  message: z.string().min(TEXT_LIMITS.MIN_MESSAGE_LENGTH, {
    message: VALIDATION_MESSAGES.MIN_MESSAGE_LENGTH,
  }),
});

// 定義表單資料型別
export type ContactFormValues = z.infer<typeof contactFormSchema>;
