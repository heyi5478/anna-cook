import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils/ui';

/**
 * Slider 組件的屬性定義
 * 擴展了 Radix UI Slider 原生屬性
 */
type SliderProps = {
  /**
   * 拇指(滑塊按鈕)的自定義樣式
   */
  thumbClassName?: string;
  /**
   * 軌道的自定義樣式
   */
  trackClassName?: string;
  /**
   * 範圍填充的自定義樣式
   */
  rangeClassName?: string;
  /**
   * 滑塊的 ARIA 標籤
   */
  ariaLabel?: string;
  /**
   * 滑塊的 ARIA 標籤由 ID 指定
   */
  ariaLabelledBy?: string;
} & React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

/**
 * 滑塊組件 - 允許用戶從一個範圍內選擇一個或多個值
 *
 * 該組件基於 Radix UI 的 Slider 組件，提供了自定義樣式和增強的可訪問性
 *
 * @example
 * // 基本用法
 * <Slider defaultValue={[50]} max={100} step={1} />
 *
 * // 範圍滑塊
 * <Slider defaultValue={[20, 80]} max={100} step={1} />
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      thumbClassName,
      trackClassName,
      rangeClassName,
      ariaLabel,
      ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    /**
     * 為每個滑塊生成穩定的唯一 ID
     *
     * 這裡使用 useMemo 確保 ID 在重新渲染時保持穩定，除非滑塊數量改變
     * 使用 crypto.randomUUID() 而非索引作為 key 有以下優點：
     * 1. 避免了 React "key should be unique" 的警告
     * 2. 即使滑塊值相同，React 也能正確區分不同的滑塊
     * 3. 確保滑塊在操作時保持正確的位置和狀態
     *
     * 依賴於 props.value?.length 意味著只有當滑塊數量變化時才會重新生成 ID
     */
    const sliderIds = React.useMemo(
      () =>
        Array.from({ length: props.value?.length || 0 }, () =>
          crypto.randomUUID(),
        ),
      [props.value?.length],
    );

    return (
      <SliderPrimitive.Root
        ref={ref}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className,
        )}
        {...props}
      >
        {/* 滑塊軌道 - 顯示滑塊可移動的整個範圍 */}
        <SliderPrimitive.Track
          className={cn(
            'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
            trackClassName,
          )}
        >
          {/* 範圍指示器 - 顯示已選範圍的填充 */}
          <SliderPrimitive.Range
            className={cn('absolute h-full bg-primary', rangeClassName)}
          />
        </SliderPrimitive.Track>

        {/* 
          動態生成滑塊按鈕
          每個滑塊使用生成的唯一 ID 作為 key，而不是索引
          這確保了即使多個滑塊具有相同的值，React 也能正確識別和更新它們
        */}
        {props.value?.map((value, i) => (
          <SliderPrimitive.Thumb
            key={sliderIds[i]}
            className={cn(
              'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              thumbClassName,
            )}
            aria-label={`值：${value}`}
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
