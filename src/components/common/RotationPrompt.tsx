import { useState, useEffect } from 'react';
import { Smartphone, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  rotationPromptOverlayVariants,
  rotationPromptContentVariants,
  rotationIconVariants,
  rotationTextVariants,
  type RotationPromptOverlayVariantsProps,
  type RotationPromptContentVariantsProps,
} from '@/styles/cva/recipe-video';

/**
 * 旋轉提示組件屬性介面
 */
export type RotationPromptProps = {
  show: boolean;
  title?: string;
  description?: string;
  theme?: 'dark' | 'light' | 'accent';
  className?: string;
} & Pick<RotationPromptOverlayVariantsProps, 'backdrop'> &
  Pick<RotationPromptContentVariantsProps, 'size' | 'animation'>;

/**
 * 旋轉提示組件 - 用於指導用戶將裝置轉為橫向模式以獲得最佳觀看體驗
 */
export function RotationPrompt({
  show,
  title = '請旋轉您的裝置',
  description = '為了獲得最佳觀看體驗，請將您的手機轉為橫向模式',
  theme = 'dark',
  backdrop = 'darkBlur',
  size = 'normal',
  animation = 'scale',
  className,
}: RotationPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // 管理組件的顯示狀態和過渡效果
  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // 100ms 延遲以確保自然的過渡效果
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    setIsVisible(false);
    // 等待退場動畫完成後再卸載組件
    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [show]);

  // 如果不需要渲染，返回 null
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        rotationPromptOverlayVariants({
          state: isVisible ? 'visible' : 'hidden',
          backdrop,
        }),
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rotation-prompt-title"
      aria-describedby="rotation-prompt-description"
    >
      <div
        className={cn(
          rotationPromptContentVariants({
            size,
            animation: isVisible ? animation : 'none',
            theme,
          }),
        )}
      >
        {/* 圖示區域 */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          {/* 手機圖示 */}
          <div
            className={cn(
              rotationIconVariants({
                size: 'medium',
                animation: 'none',
                color: theme === 'dark' ? 'default' : 'muted',
              }),
            )}
          >
            <Smartphone className="w-full h-full" />
          </div>

          {/* 旋轉箭頭圖示 */}
          <div
            className={cn(
              rotationIconVariants({
                size: 'medium',
                animation: 'spinSlow',
                color: theme === 'dark' ? 'accent' : 'warning',
              }),
            )}
          >
            <RotateCcw className="w-full h-full" />
          </div>

          {/* 橫向手機圖示 */}
          <div
            className={cn(
              rotationIconVariants({
                size: 'medium',
                animation: 'none',
                color: theme === 'dark' ? 'accent' : 'default',
              }),
              'rotate-90',
            )}
          >
            <Smartphone className="w-full h-full" />
          </div>
        </div>

        {/* 文字內容區域 */}
        <div className="space-y-2">
          <h2
            id="rotation-prompt-title"
            className={cn(
              rotationTextVariants({
                type: 'title',
                emphasis: 'highlighted',
                spacing: 'tight',
              }),
            )}
          >
            {title}
          </h2>

          <p
            id="rotation-prompt-description"
            className={cn(
              rotationTextVariants({
                type: 'description',
                emphasis: 'normal',
                spacing: 'normal',
              }),
            )}
          >
            {description}
          </p>

          <p
            className={cn(
              rotationTextVariants({
                type: 'instruction',
                emphasis: 'muted',
                spacing: 'relaxed',
              }),
            )}
          >
            此提示將在您旋轉裝置後自動消失
          </p>
        </div>
      </div>
    </div>
  );
}

export default RotationPrompt;
