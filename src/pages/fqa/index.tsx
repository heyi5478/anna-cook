import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// FAQ 資料類型定義
type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * 常見問題頁面元件
 */
const FAQPage: React.FC = () => {
  // FAQ 問答資料
  const faqItems: FAQItem[] = [
    {
      id: 'platform',
      question: '安那煮 Anna Cook 是什麼樣的平台？',
      answer:
        '安那煮是一個專門收錄家鄉傳統菜餚的食譜平台，結合創新的沉浸式影音體驗，讓使用者可以逐微鏡頭看，輕鬆學會烹飪料理。',
    },

    {
      id: 'immersive-video',
      question: '你們的沉浸式影音食譜是什麼？',
      answer:
        '我們將料理影片片段切割成短片段，類似 GIF，自動連續播放，每個步驟完成後再進入下一步。讓使用者可以專心烹飪，不需頻繁操作手機或電腦。',
    },

    {
      id: 'registration',
      question: '需要註冊才能使用嗎？',
      answer:
        '無須註冊即可瀏覽料理影片，但註冊會員可以上傳自己的家鄉食譜、收藏喜愛的食譜等等多元化功能。',
    },

    {
      id: 'recipe-source',
      question: '食譜的來源是什麼？',
      answer:
        '我們的食譜來自各地的家庭料理，透過與阿公阿嬤、料理達人合作，收錄最具代表性的家鄉味。',
    },

    {
      id: 'submission',
      question: '可以投稿自己的家傳食譜嗎？',
      answer:
        '當然可以！我們歡迎使用者分享自己的家鄉味，讓更多人能學習並傳遞這些珍貴的食譜。',
    },

    {
      id: 'contact',
      question: '如果遇到問題或有建議，該如何聯絡你們？',
      answer:
        '可以透過「客服信箱」或「官方網站」聯絡我們，我們會盡快回覆問題！',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>常見問題 | 安那煮 Anna Cook</title>
        <meta name="description" content="安那煮 Anna Cook 常見問題解答" />
      </Head>

      <Header />

      <main className="flex-1 bg-white">
        {/* 麵包屑導航 */}
        <div className="px-4 py-3 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">首頁</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>常見問題</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* 頁面標題 */}
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold">常見問題（FAQ）</h1>
        </div>

        {/* FAQ 列表 */}
        <div className="px-4 pb-12">
          {faqItems.map((item) => (
            <div key={item.id} className="mb-6">
              {/* 問題標題 */}
              <h2 className="text-base font-medium border-l-4 border-[#D83A00] pl-3 py-1 mb-2">
                {item.question}
              </h2>
              {/* 回答內容 */}
              <div className="bg-gray-50 p-4 rounded-sm text-base">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
