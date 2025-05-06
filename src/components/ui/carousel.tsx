import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cva } from 'class-variance-authority';
import useEmblaCarousel from 'embla-carousel-react';

// 定義輪播容器樣式
const carouselContainerVariants = cva('relative group', {
  variants: {
    size: {
      default: 'w-full',
      compact: 'max-w-screen-lg mx-auto',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

// 定義輪播軌道樣式
const carouselTrackVariants = cva('flex', {
  variants: {
    spacing: {
      default: '-ml-4',
      tight: '-ml-2',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

// 定義輪播導航按鈕樣式
const carouselButtonVariants = cva(
  'absolute top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity',
  {
    variants: {
      position: {
        left: 'left-0',
        right: 'right-0',
      },
    },
    defaultVariants: {
      position: 'left',
    },
  },
);

/**
 * Netflix風格輪播元件，提供水平滾動功能顯示一系列內容
 */
export function Carousel({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });

  // 處理向前滾動
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  // 處理向後滾動
  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className={carouselContainerVariants()}>
      <h2 className="text-xl font-bold mb-3 px-4">{title}</h2>

      {/* 前滾按鈕 */}
      <button
        className={carouselButtonVariants({ position: 'left' })}
        onClick={scrollPrev}
        aria-label="查看上一頁"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 輪播區域 */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={carouselTrackVariants()}>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </div>

      {/* 後滾按鈕 */}
      <button
        className={carouselButtonVariants({ position: 'right' })}
        onClick={scrollNext}
        aria-label="查看下一頁"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
