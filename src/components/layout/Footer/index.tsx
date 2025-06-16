// index.tsx
import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

// FooterProps 類型定義
export type FooterProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof footerVariants> & {
    companyName?: string;
    year?: number;
    studioName?: string;
  };

type NavItem = {
  label: string;
  href: string;
};

// 將 footerVariants 的樣式修改為符合設計稿
const footerVariants = cva('w-full py-6 px-4', {
  variants: {
    variant: {
      default: 'bg-neutral-100',
      transparent: 'bg-transparent',
    },
    size: {
      sm: 'py-4',
      md: 'py-6',
      lg: 'py-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// 修改 Footer 元件的實現，使其符合設計稿
export const Footer: React.FC<FooterProps> = ({
  className,
  variant,
  size,
  companyName = '安那煮',
  year = new Date().getFullYear(),
  studioName = 'Anna Cook',
  ...props
}) => {
  // 導航項目數據
  const navItems: NavItem[] = [
    { label: '人氣食譜', href: '/' },
    { label: '最新食譜', href: '/' },
    { label: '關於我們', href: '/about-us' },
  ];

  return (
    <footer
      className={cn(footerVariants({ variant, size, className }))}
      {...props}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Logo 區域 */}
        <div className="flex justify-start mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/login-small-logo.svg"
              alt="ANNA"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* 導航連結區域 */}
        <nav className="space-y-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between py-4 border-t border-neutral-300"
            >
              <span className="text-neutral-500 text-lg">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-neutral-500" />
            </Link>
          ))}
        </nav>

        {/* 最後一條分隔線 */}
        <div className="border-t border-neutral-300 mt-0" />

        {/* 聯絡我們區域 */}
        <div className="flex justify-center items-center gap-2 py-6">
          <span className="text-neutral-600">需要協助？</span>
          <Link href="/contact" className="text-primary-800 font-medium">
            聯絡我們
          </Link>
        </div>

        {/* 版權資訊 */}
        <div className="flex justify-center items-center text-sm text-neutral-400 pb-4">
          <span className="mr-2">©</span>
          <span>
            {year} {companyName} {studioName}
          </span>
        </div>
      </div>
    </footer>
  );
};
