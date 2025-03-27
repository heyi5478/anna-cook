import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

type SliderProps = {
  thumbClassName?: string;
  trackClassName?: string;
  rangeClassName?: string;
} & React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    { className, thumbClassName, trackClassName, rangeClassName, ...props },
    ref,
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
          trackClassName,
        )}
      >
        <SliderPrimitive.Range
          className={cn('absolute h-full bg-primary', rangeClassName)}
        />
      </SliderPrimitive.Track>
      {props.value?.map((value) => (
        <SliderPrimitive.Thumb
          key={value}
          className={cn(
            'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            thumbClassName,
          )}
        />
      ))}
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
