import type { Metadata } from 'next';
import ContactUs from '@/components/pages/ContactUs';

// 聯絡我們頁面 Metadata
export const metadata: Metadata = {
  title: '聯絡我們',
  description: '與安那煮 Anna Cook 聯絡：意見回饋與客服。',
};

// 聯絡我們頁面（表單為 client component）
export default function ContactUsPage() {
  return <ContactUs />;
}
