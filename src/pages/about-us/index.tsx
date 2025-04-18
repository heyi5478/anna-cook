import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { NextPage } from 'next';
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

const AboutUsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>關於我們 | 安那煮 Anna Cook</title>
        <meta name="description" content="安那煮 Anna Cook 品牌故事與理念" />
      </Head>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 flex flex-col">
          {/* 麵包屑導航 */}
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">首頁</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>關於我們</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* 主要標題 */}
          <div className="container mx-auto px-4 pt-4 pb-6">
            <h1 className="text-3xl font-bold">關於我們 | 安那煮 Anna Cook</h1>
          </div>

          {/* 品牌橫幅 */}
          <div className="bg-[#EE4D00] py-8 mb-8">
            <div className="container mx-auto px-4 flex items-center justify-center">
              <div className="flex items-center">
                <Image
                  src="/login-small-logo.svg"
                  alt="安那煮 Logo"
                  width={60}
                  height={60}
                />
                <div className="ml-4 text-white">
                  <h2 className="text-2xl font-bold">安那煮 | 家傳好菜</h2>
                  <h2 className="text-2xl font-bold">Anna Cook</h2>
                </div>
              </div>
            </div>
          </div>

          {/* 內容區域 */}
          <div className="container mx-auto px-4 mb-12">
            <div className="max-w-3xl mx-auto">
              <p className="mb-6">
                在這個快節奏的時代，傳統料理的溫度與記憶逐漸被遺忘。
              </p>

              <p className="mb-6">
                安那煮 Anna Cook
                誕生，正是為了將阿公阿嬤的家鄉味代代相傳，讓每一道菜餚都能重新回到餐桌上，喚起心中最深的溫暖。
              </p>

              <p className="mb-6">
                我們的名字「安那煮」源自台語發音，意味著「怎底煮？」（Anna
                Cook），我們希望讓每個人都能輕鬆學會料理，找到家的味道。
              </p>

              <p className="mb-6">
                然而，我們不只是食譜的收藏者，更是料理體驗的創新者。我們首創沉浸式影音食譜，頭戴傳統教學方式，讓料理變得更加直覺、順暢。
              </p>

              <h3 className="text-xl font-bold mb-4">我們的特色</h3>

              <ul className="list-disc pl-6 space-y-4 mb-8">
                <li>
                  <strong>傳承家鄉味：</strong>{' '}
                  精選各地阿公阿嬤的經典食譜，保存最真實的風味。
                </li>
                <li>
                  <strong>沉浸式教學：</strong>{' '}
                  將料理影片切割成短片段，類似GIF的方式自動連續播放，無需手動操作，確保你能專心料理。
                </li>
                <li>
                  <strong>步驟分段體驗：</strong>{' '}
                  每個料理步驟清晰呈現，完成當前步驟後自動進入下一步，讓你能輕鬆邊看邊做。
                </li>
              </ul>

              <p className="mb-6">
                我們相信，料理不只是滿足口腹之欲，更是一種情感的傳遞。讓我們一起透過科技，守護那些珍貴的家鄉味，讓傳統與創新在廚房裡交織出新的可能！
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutUsPage;
