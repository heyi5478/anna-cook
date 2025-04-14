import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { Menu, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

/**
 * 定義 header 的基本樣式和變體
 */
const headerVariants = cva(
  'w-full flex items-center justify-between bg-[#E64300] px-4 py-2 h-16',
  {
    variants: {
      variant: {
        default: '',
        transparent: 'bg-transparent',
      },
      size: {
        sm: 'h-12',
        md: 'h-14',
        lg: 'h-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  },
);

/**
 * 定義選單項目的樣式
 */
const menuItemVariants = cva(
  'flex items-center w-full px-4 py-4 text-base font-medium transition-colors',
  {
    variants: {
      active: {
        true: 'bg-[#E64300] text-white',
        false: 'hover:bg-gray-100',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

/**
 * 定義 header 的 props 類型
 */
export type HeaderProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof headerVariants> & {
    isLoggedIn?: boolean;
    userName?: string;
    userAvatar?: string;
    atMenuClick?: () => void;
    atSearchSubmit?: (query: string) => void;
  };

/**
 * 網站頂部導航欄元件，根據用戶登入狀態顯示不同內容
 */
export const Header: React.FC<HeaderProps> = ({
  className,
  variant,
  size,
  isLoggedIn = true,
  userName = '',
  userAvatar = '',
  atMenuClick,
  atSearchSubmit,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  /**
   * 處理搜尋表單提交事件
   */
  const atSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (atSearchSubmit) {
      atSearchSubmit(searchQuery);
    }
  };

  /**
   * 處理選單項目點擊事件
   */
  const atMenuItemClick = () => {
    setIsSheetOpen(false);
    // 可以在這裡加入路由跳轉邏輯
  };

  /**
   * 渲染未登入用戶的選單項目
   */
  const renderGuestMenu = () => (
    <>
      <div className="flex flex-col items-center p-6 mb-4">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <User className="h-8 w-8 text-gray-500" />
        </div>
        <h2 className="text-xl font-bold">登入/註冊</h2>
      </div>

      <div className="w-full">
        <p className="px-4 py-2 text-gray-500">未登入</p>

        <Link
          href="/create-recipe"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          建立食譜
        </Link>

        <Link
          href="/faq"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          常見問題
        </Link>

        <Link
          href="/contact"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          聯繫我們
        </Link>
      </div>
    </>
  );

  /**
   * 渲染已登入用戶的選單項目
   */
  const renderUserMenu = () => (
    <>
      <div className="flex flex-col items-center p-6 mb-4">
        <Avatar className="h-16 w-16 mb-2">
          <AvatarImage
            src={userAvatar || '/placeholder.svg'}
            alt={userName || '用戶頭像'}
          />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{userName || '用戶名稱'}</h2>
      </div>

      <div className="w-full">
        <Link
          href="/user/profile"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          會員中心
        </Link>

        <Link
          href="/create-recipe"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          建立食譜
        </Link>

        <Link
          href="/my-recipes"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          我的食譜
        </Link>

        <Link
          href="/faq"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          常見問題
        </Link>

        <Link
          href="/contact"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          聯繫我們
        </Link>

        <button className={cn(menuItemVariants({}))} onClick={atMenuItemClick}>
          登出
        </button>
      </div>
    </>
  );

  return (
    <header
      className={cn(headerVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (atMenuClick) atMenuClick();
              }}
              className="text-white hover:bg-[#E64300] hover:text-white"
              aria-label="選單"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-80 sm:max-w-sm bg-[#FAFAFA]"
          >
            {isLoggedIn ? renderUserMenu() : renderGuestMenu()}
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-16">
            <Image
              src="/login-small-logo.svg"
              alt="ANNA"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      <form onSubmit={atSubmitSearch} className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="search"
            placeholder="關鍵字搜尋"
            className={cn(
              'pl-10 pr-4 py-2 h-10 bg-white rounded-[16px] border-none focus-visible:ring-0 focus-visible:ring-offset-0',
              'text-base placeholder:text-gray-400',
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div>
        {isLoggedIn ? (
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={userAvatar || '/placeholder.svg'}
              alt={userName || '用戶頭像'}
            />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        ) : null}
      </div>
    </header>
  );
};
