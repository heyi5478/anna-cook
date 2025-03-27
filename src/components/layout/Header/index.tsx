import type React from 'react';

import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 定義 header 的基本樣式和變體
const headerVariants = cva('w-full flex items-center gap-2 p-2 bg-gray-200', {
  variants: {
    variant: {
      default: 'border-b border-gray-300',
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
    size: 'md',
  },
});

// 定義 header 的 props 類型
export type HeaderProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof headerVariants> & {
    logoText?: string;
    atMenuClick?: () => void;
    atSearchSubmit?: (query: string) => void;
    atLoginClick?: () => void;
  };

/**
 * 應用程式頂部導航欄元件，包含選單按鈕、Logo、搜尋欄和登入按鈕
 */
export const Header: React.FC<HeaderProps> = ({
  className,
  variant,
  size,
  logoText = 'Logo',
  atMenuClick,
  atSearchSubmit,
  atLoginClick,
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
      <Button
        variant="ghost"
        size="icon"
        onClick={atMenuClick}
        aria-label="選單"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="font-medium">{logoText}</div>

      <form onSubmit={atSubmitSearch} className="flex-1 mx-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="馬鈴薯"
            className="w-full pl-8 h-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <Button variant="ghost" size="sm" onClick={atLoginClick}>
        登入
      </Button>
    </header>
  );
};
