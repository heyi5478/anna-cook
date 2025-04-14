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

// 定義 header 的基本樣式和變體
const headerVariants = cva(
  'w-full flex items-center bg-[#E84A00] px-4 py-2 h-16',
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

// 定義 header 的 props 類型
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
  isLoggedIn = false,
  userName = '',
  userAvatar = '',
  atMenuClick,
  atSearchSubmit,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * 處理搜尋表單提交事件
   */
  const atSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (atSearchSubmit) {
      atSearchSubmit(searchQuery);
    }
  };

  return (
    <header
      className={cn(headerVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={atMenuClick}
          className="text-white hover:bg-[#c43f00] hover:text-white"
          aria-label="選單"
        >
          <Menu className="h-6 w-6" />
        </Button>

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
