import { Star } from 'lucide-react';

type StarRatingProps = {
  /**
   * 當前評分值
   */
  rating: number;
  /**
   * 最大評分值
   */
  maxRating?: number;
  /**
   * 星星尺寸
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 是否為唯讀模式
   */
  readOnly?: boolean;
  /**
   * 評分變更時的回調函式
   */
  onRatingChange?: (rating: number) => void;
  /**
   * 是否顯示評分數值
   */
  showRating?: boolean;
  /**
   * 評分標題
   */
  ratingTitle?: string;
};

/**
 * 星級評分元件，支援互動式評分和唯讀顯示模式
 */
export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  readOnly = false,
  onRatingChange,
  showRating = false,
  ratingTitle,
}: StarRatingProps) {
  // 星星尺寸映射
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  /**
   * 處理點擊星星事件
   */
  const atStarClick = (newRating: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex justify-between w-full">
      <div className="flex items-center space-x-4">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) =>
          readOnly ? (
            <Star
              key={star}
              className={`${sizeMap[size]} ${
                star <= rating
                  ? 'text-orange-600 fill-orange-600'
                  : 'text-orange-600'
              }`}
            />
          ) : (
            <button
              key={star}
              type="button"
              onClick={() => atStarClick(star)}
              className="focus:outline-none"
              aria-label={`評分 ${star} 星`}
            >
              <Star
                className={`${sizeMap[size]} ${
                  star <= rating
                    ? 'text-orange-600 fill-orange-600'
                    : 'text-orange-600'
                }`}
              />
            </button>
          ),
        )}
      </div>
      {showRating && (
        <div className="flex flex-col items-center justify-center">
          {ratingTitle && (
            <h2 className="text-xl font-medium text-center mb-1">
              {ratingTitle}
            </h2>
          )}
          <span className="text-xl font-medium self-end">{rating}</span>
        </div>
      )}
    </div>
  );
}
