import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 導航欄容器樣式變體
const navigationBarVariants = cva('w-full p-4 flex items-center z-20', {
  variants: {
    background: {
      gradient: 'bg-gradient-to-b from-black/70 to-transparent',
      solid: 'bg-black/80',
      transparent: 'bg-transparent',
    },
    position: {
      fixed: 'fixed top-0 left-0',
      absolute: 'absolute top-0 left-0',
      sticky: 'sticky top-0',
    },
    theme: {
      dark: 'text-white',
      light: 'text-black',
    },
  },
  defaultVariants: {
    background: 'gradient',
    position: 'absolute',
    theme: 'dark',
  },
});

// 返回連結樣式變體
const navLinkVariants = cva('flex items-center transition-colors', {
  variants: {
    theme: {
      dark: 'text-white hover:text-neutral-300',
      light: 'text-black hover:text-neutral-600',
    },
  },
  defaultVariants: {
    theme: 'dark',
  },
});

// 時間顯示樣式變體
const timeDisplayVariants = cva('ml-auto font-mono tabular-nums', {
  variants: {
    theme: {
      dark: 'text-white',
      light: 'text-black',
    },
    size: {
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    theme: 'dark',
    size: 'default',
  },
});

type NavigationBarProps = {
  recipeId: number;
  currentTime: number;
  className?: string;
} & VariantProps<typeof navigationBarVariants> &
  Pick<VariantProps<typeof timeDisplayVariants>, 'size'>;

// 格式化時間為 mm:ss 格式
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 上方導航欄元件
 */
export const NavigationBar = ({
  recipeId,
  currentTime,
  className,
  background = 'gradient',
  position = 'absolute',
  theme = 'dark',
  size = 'default',
}: NavigationBarProps) => {
  return (
    <div
      className={cn(
        navigationBarVariants({ background, position, theme }),
        className,
      )}
    >
      <Link
        href={`/recipe-page/${recipeId}`}
        className={navLinkVariants({ theme })}
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        <span className="underline">回到食譜</span>
      </Link>
      <div className={timeDisplayVariants({ theme, size })}>
        {formatTime(currentTime)}
      </div>
    </div>
  );
};
