/* eslint-disable jsx-a11y/label-has-associated-control */
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta: Meta<typeof Card> = {
  title: 'UI Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: '自訂 CSS 類名',
    },
    children: {
      control: false,
      description: '卡片內容',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// 基本卡片
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>卡片標題</CardTitle>
        <CardDescription>這是卡片的描述文字。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>這裡是卡片的主要內容。</p>
      </CardContent>
    </Card>
  ),
};

// 完整卡片結構
export const Complete: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>完整卡片範例</CardTitle>
        <CardDescription>這是一個包含所有元件的完整卡片範例。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          這裡是卡片的主要內容區域。可以放置任何你需要的內容，如文字、圖片、表單等。
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">操作按鈕</Button>
      </CardFooter>
    </Card>
  ),
};

// 產品卡片
export const ProductCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="aspect-square w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center">
          📷 圖片
        </div>
        <CardTitle>產品名稱</CardTitle>
        <CardDescription>NT$ 1,299</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          這是產品的詳細描述，包含產品的特色和優點。
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          加入收藏
        </Button>
        <Button className="flex-1">立即購買</Button>
      </CardFooter>
    </Card>
  ),
};

// 用戶資料卡片
export const UserProfileCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            👤
          </div>
          <div>
            <CardTitle>王小明</CardTitle>
            <CardDescription>軟體工程師</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">📧 wang@example.com</p>
          <p className="text-sm">📍 台北市信義區</p>
          <p className="text-sm">
            💼 專精於前端開發，擁有 5 年以上的 React 開發經驗。
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">查看詳細資料</Button>
      </CardFooter>
    </Card>
  ),
};

// 統計卡片
export const StatsCard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">總用戶數</CardTitle>
          <div className="text-2xl">👥</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">相比上月 +20.1%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">營收</CardTitle>
          <div className="text-2xl">💰</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231</div>
          <p className="text-xs text-muted-foreground">相比上月 +15.3%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">活躍用戶</CardTitle>
          <div className="text-2xl">📈</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">573</div>
          <p className="text-xs text-muted-foreground">相比上月 +8.1%</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// 通知卡片
export const NotificationCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">新通知</CardTitle>
          <span className="text-xs text-muted-foreground">2 分鐘前</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <CardDescription>
          您的訂單已確認並開始處理。預計 3-5 個工作天內送達。
        </CardDescription>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm">
          忽略
        </Button>
        <Button size="sm">查看訂單</Button>
      </CardFooter>
    </Card>
  ),
};

// 表單卡片
export const FormCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>登入</CardTitle>
        <CardDescription>請輸入您的帳號和密碼來登入系統。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="form-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="form-email"
            type="email"
            placeholder="輸入您的 email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="form-password" className="text-sm font-medium">
            密碼
          </label>
          <input
            id="form-password"
            type="password"
            placeholder="輸入您的密碼"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">登入</Button>
      </CardFooter>
    </Card>
  ),
};

// 圖片卡片
export const ImageCard: Story = {
  render: () => (
    <Card className="w-[300px] overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
        美麗風景
      </div>
      <CardHeader>
        <CardTitle>標題</CardTitle>
        <CardDescription>
          這是一張美麗的風景照片，展現了大自然的壯麗景色。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>📸 攝影師</span>
          <span>⭐ 4.8</span>
        </div>
      </CardContent>
    </Card>
  ),
};

// 空狀態卡片
export const EmptyState: Story = {
  render: () => (
    <Card className="w-[350px] text-center">
      <CardHeader>
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-4">
          📭
        </div>
        <CardTitle>沒有項目</CardTitle>
        <CardDescription>
          目前沒有任何項目可顯示。點擊下方按鈕來新增第一個項目。
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">新增項目</Button>
      </CardFooter>
    </Card>
  ),
};

// 載入狀態卡片
export const LoadingState: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-9 bg-gray-200 rounded animate-pulse w-full" />
      </CardFooter>
    </Card>
  ),
};
