// import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Plus, BookmarkIcon, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { RecipeStatsItem } from './RecipeStatsItem';
import { PublishedRecipeCard } from './PublishedRecipeCard';
import { DraftRecipeCard } from './DraftRecipeCard';
import { FollowedUserCard } from './FollowedUserCard';

/**
 * 顯示單一食譜卡片元件
 */
function RecipeCard() {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <div className="w-20 h-20 bg-gray-200 shrink-0 relative">
        <Image
          src="/placeholder.svg"
          alt="食譜縮圖"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 p-2">
        <div className="flex justify-between">
          <h4 className="font-medium">馬鈴薯烤蛋</h4>
          <BookmarkIcon className="h-4 w-4" />
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">
          食譜故事說明食譜故事說明食譜故事說明...
        </p>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <Users className="h-3 w-3 mr-1" />
          <span className="mr-2">2人份</span>
          <Clock className="h-3 w-3 mr-1" />
          <span className="mr-2">30分鐘</span>
          <Star className="h-3 w-3 mr-1" />
          <span>4.3</span>
        </div>
      </div>
    </div>
  );
}

export default function UserCenter() {
  //   const [activeTab, setActiveTab] = useState('總覽');
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 使用者資料區 */}
      <div className="bg-white p-4">
        <div className="flex flex-col items-center pb-4">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarImage src="/placeholder.svg" alt="使用者頭像" />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-medium">使用者名稱</h2>

          <div className="flex justify-center gap-4 my-2 text-sm text-gray-500">
            <div className="text-center">
              <div>1</div>
              <div>追蹤中</div>
            </div>
            <div className="text-center">
              <div>2</div>
              <div>粉絲</div>
            </div>
            <div className="text-center">
              <div>50</div>
              <div>收藏</div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-2">
            編輯個人資料
          </Button>
        </div>

        {/* 我的食譜區 */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">我的食譜</h3>
            <Button variant="outline" className="rounded-full gap-1 px-4">
              <Plus className="h-4 w-4" />
              <span>新增</span>
            </Button>
          </div>

          <Tabs defaultValue="總覽" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="總覽" className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                總覽
              </TabsTrigger>
              <TabsTrigger value="數據" className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                數據
              </TabsTrigger>
              <TabsTrigger value="已發布" className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                </svg>
                已發布
              </TabsTrigger>
              <TabsTrigger value="草稿" className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                草稿
              </TabsTrigger>
            </TabsList>
            <TabsContent value="總覽" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-1">創作者總覽</h4>
                  <p className="text-sm text-gray-500 mb-4">您的食譜表現情況</p>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">總瀏覽次數</div>
                      <div className="font-bold">330</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">總收讚次數</div>
                      <div className="font-bold">12</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">平均評分</div>
                      <div className="font-bold">4.2</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="數據">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">食譜數據</h3>
                  <p className="text-gray-500">深入了解您的食譜表現</p>
                </div>

                {/* 食譜數據項目 */}
                {[1, 2].map((item) => (
                  <RecipeStatsItem key={item} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="已發布">
              <div className="space-y-4">
                <p className="text-gray-500 mb-2">共3篇食譜</p>

                {[1, 2, 3].map((item) => (
                  <PublishedRecipeCard key={item} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="草稿">
              <div className="space-y-4">
                <p className="text-gray-500 mb-2">共3篇食譜</p>

                {[1, 2, 3].map((item) => (
                  <DraftRecipeCard key={item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 我的最愛 */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">我的最愛</h3>
          </div>

          <Tabs defaultValue="已追蹤" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="已追蹤" className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                已追蹤
              </TabsTrigger>
              <TabsTrigger value="已收藏" className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
                已收藏
              </TabsTrigger>
            </TabsList>
            <TabsContent value="已追蹤" className="mt-0">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-1">共8位追蹤中</p>

                {[1, 2, 3].map((item) => (
                  <FollowedUserCard key={item} />
                ))}

                <Button
                  variant="ghost"
                  className="w-full py-2 flex items-center justify-center gap-1"
                >
                  <span>更多追蹤</span>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="已收藏" className="mt-0">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-1">共12篇收藏食譜</p>

                {[1, 2, 3].map((item) => (
                  <RecipeCard key={item} />
                ))}

                <Button
                  variant="ghost"
                  className="w-full py-2 flex items-center justify-center gap-1"
                >
                  <span>更多收藏</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 底部區域 */}
      <div className="mt-auto bg-gray-200 p-4">
        <div className="text-center text-gray-600 font-medium mb-4">商標</div>
        <div className="space-y-4">
          <Link
            href="/popular-recipes"
            className="flex justify-between items-center py-2"
          >
            <span>人氣食譜</span>
            <span>→</span>
          </Link>
          <div className="h-px bg-gray-300" />
          <Link
            href="/new-recipes"
            className="flex justify-between items-center py-2"
          >
            <span>最新食譜</span>
            <span>→</span>
          </Link>
          <div className="h-px bg-gray-300" />
          <Link
            href="/about-us"
            className="flex justify-between items-center py-2"
          >
            <span>關於我們</span>
            <span>→</span>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>需要協助? 聯絡我們</p>
          <p className="mt-2">版權所有 © 食譜Createx studio</p>
        </div>
      </div>
    </div>
  );
}
