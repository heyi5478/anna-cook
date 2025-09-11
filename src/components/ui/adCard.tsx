import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/ui';

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  className?: string;
};

/**
 * 顯示產品資訊的卡片元件
 */
export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  className,
}: ProductCardProps) {
  return (
    <Card
      className={cn('overflow-hidden border-0 shadow-sm', className)}
      data-id={id}
    >
      <div className="flex flex-row items-center gap-4 p-4 bg-[#FAFAFA]">
        <div className="relative h-[113px] w-[113px] flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 113px"
          />
        </div>
        <CardContent className="flex h-full flex-1 flex-col justify-between p-0">
          <div className="space-y-2">
            <h3 className="text-xl font-normal leading-tight text-neutral-800">
              {name}
            </h3>
            <p className="text-sm text-neutral-500 line-clamp-1">
              {description}
            </p>
          </div>
          <div className="mt-auto pt-4 text-right">
            <span className="text-2xl leading-relaxed font-bold text-neutral-800">
              $ {price}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
