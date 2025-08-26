import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { Menu, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { checkAuth } from '@/services/auth';

/**
 * 定義 header 的基本樣式和變體
 */
const headerVariants = cva(
  'w-full flex items-center justify-between bg-primary px-4 py-2 h-16',
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
        true: 'bg-primary text-white',
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
    atMenuClick?: () => void;
    atSearchSubmit?: (query: string) => void;
    onLoginStateChange?: (isLoggedIn: boolean) => void;
  };

/**
 * 網站頂部導航欄元件，根據用戶登入狀態顯示不同內容
 */
export const Header: React.FC<HeaderProps> = ({
  className,
  variant,
  size,
  atMenuClick,
  atSearchSubmit,
  onLoginStateChange,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{
    id: number;
    displayId: string;
    accountEmail: string;
    accountName: string;
    profilePhoto: string;
    role: number;
    loginProvider: number;
  } | null>(null);

  /**
   * 驗證用戶登入狀態
   */
  const verifyAuthentication = async () => {
    try {
      const response = await checkAuth();

      // 更新登入狀態
      setIsLoggedIn(true);

      // 設置用戶資料
      setUserData(response.userData);

      // 將用戶資料儲存到 localStorage
      localStorage.setItem('userData', JSON.stringify(response.userData));

      // 通知外部元件登入狀態已變更
      if (onLoginStateChange) {
        onLoginStateChange(true);
      }
    } catch (error) {
      console.error('認證檢查失敗:', error);
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem('userData');

      // 通知外部元件登入狀態已變更
      if (onLoginStateChange) {
        onLoginStateChange(false);
      }
    }
  };

  /**
   * 處理登出功能
   */
  const atLogout = async () => {
    try {
      // 發送請求到 API route 處理登出
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('登出失敗');
      }

      // 清除 localStorage 中的用戶資料
      localStorage.removeItem('userData');

      // 更新狀態
      setIsLoggedIn(false);
      setUserData(null);

      // 關閉選單
      setIsSheetOpen(false);

      // 通知外部元件登入狀態已變更
      if (onLoginStateChange) {
        onLoginStateChange(false);
      }

      // 可選：重新導向到首頁或登入頁
      // window.location.href = '/';
    } catch (error) {
      console.error('登出處理失敗:', error);
    }
  };

  /**
   * 元件載入時檢查用戶認證狀態
   */
  useEffect(() => {
    // 檢查 localStorage 中是否已有用戶資料
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
        setIsLoggedIn(true);
      } catch (e) {
        console.error('解析儲存的用戶資料失敗:', e);
      }
    }

    // 無論 localStorage 中是否有資料，都嘗試驗證 token
    verifyAuthentication();
  }, []);

  /**
   * 處理搜尋表單提交事件
   */
  const atSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 導向到食譜清單頁面並傳遞搜尋參數
      window.location.href = `/recipe-list?q=${encodeURIComponent(searchQuery)}`;
    }

    // 仍然執行外部傳入的處理函數（若有）
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
      <Link href="/login" className="w-full" onClick={atMenuItemClick}>
        <div className="flex flex-col items-center p-6 mb-4">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <User className="h-8 w-8 text-neutral-500" />
          </div>
          <h2 className="text-xl font-bold">登入/註冊</h2>
        </div>
      </Link>

      <div className="w-full">
        {/* <p className="px-4 py-2 text-neutral-500">未登入</p> */}

        <Link
          href="/upload-recipe-step1"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          建立食譜
        </Link>

        <Link
          href="/fqa"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          常見問題
        </Link>

        <Link
          href="/contact-us"
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
            src={userData?.profilePhoto || '/placeholder.svg'}
            alt={userData?.accountName || '用戶頭像'}
          />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">
          {userData?.accountName || '用戶名稱'}
        </h2>
      </div>

      <div className="w-full">
        <Link
          href={userData?.displayId ? `/user/${userData.displayId}` : '/login'}
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          會員中心
        </Link>

        <Link
          href="/upload-recipe-step1"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          建立食譜
        </Link>

        <Link
          href={
            userData?.displayId
              ? `/user/${userData.displayId}?tab=已發布`
              : '/login'
          }
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          我的食譜
        </Link>

        <Link
          href="/fqa"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          常見問題
        </Link>

        <Link
          href="/contact-us"
          className={cn(menuItemVariants({}))}
          onClick={atMenuItemClick}
        >
          聯繫我們
        </Link>

        <button className={cn(menuItemVariants({}))} onClick={atLogout}>
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
              className="text-white hover:bg-primary hover:text-white"
              aria-label="選單"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-80 sm:max-w-sm bg-neutral-50"
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
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <Input
            type="search"
            placeholder="關鍵字搜尋"
            className={cn(
              'pl-10 pr-4 py-2 h-10 bg-white rounded-[16px] border-none focus-visible:ring-0 focus-visible:ring-offset-0',
              'text-base placeholder:text-neutral-400',
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div>
        {isLoggedIn ? (
          <Link
            href={
              userData?.displayId ? `/user/${userData.displayId}` : '/login'
            }
            className="block"
          >
            <Avatar className="h-10 w-10 cursor-pointer transition-opacity hover:opacity-80">
              <AvatarImage
                src={userData?.profilePhoto || '/placeholder.svg'}
                alt={userData?.accountName || '用戶頭像'}
              />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : null}
      </div>
    </header>
  );
};
