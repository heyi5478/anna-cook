import type React from 'react';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';

// 定義評論類型
type Review = {
  rating: number;
  comment: string;
  username?: string;
  userRating?: number;
};

/**
 * 食譜評論元件，提供使用者評分和評論功能
 */
export default function Review() {
  // 狀態管理
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [review, setReview] = useState<Review>({
    rating: 5,
    comment: '',
    username: '使用者名稱',
    userRating: 4.3,
  });

  /**
   * 處理評論提交
   */
  const atSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (review.comment.trim()) {
      setIsSubmitted(true);
    }
  };

  /**
   * 處理評論內容變更
   */
  const atCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview({ ...review, comment: e.target.value });
  };

  /**
   * 處理評分變更
   */
  const atRatingChange = (rating: number) => {
    setReview((prev) => ({ ...prev, rating }));
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-dashed border-purple-200">
      <div className="p-4">
        {!isSubmitted ? (
          // 未提交狀態 - 評論表單
          <div className="space-y-6">
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => atRatingChange(star)}
                    className="focus:outline-none"
                    aria-label={`評分 ${star} 星`}
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= review.rating
                          ? 'text-orange-600 fill-orange-600'
                          : 'text-orange-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-medium text-center mb-1">
                  您的評價
                </h2>
                <span className="text-xl font-medium self-end">
                  {review.rating}
                </span>
              </div>
            </div>

            <form onSubmit={atSubmit} className="space-y-4">
              <Textarea
                placeholder="詳細說明您對這道食譜的想法。料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！"
                value={review.comment}
                onChange={atCommentChange}
                className="min-h-[120px] text-base"
                required
              />
              <Button
                type="submit"
                variant="outline"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                提交留言
              </Button>
            </form>
          </div>
        ) : (
          // 已提交狀態 - 顯示評論
          <div className="space-y-6">
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-10 h-10 ${
                      star <= review.rating
                        ? 'text-orange-600 fill-orange-600'
                        : 'text-orange-600'
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-medium text-center mb-1">
                  您的評價
                </h2>
                <span className="text-xl font-medium self-end">
                  {review.rating}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 bg-gray-300">
                  <span className="sr-only">{review.username}</span>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{review.username}</h3>
                  <p className="mt-2 text-gray-700">
                    {review.comment ||
                      '詳細說明您對這道食譜的想法。料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！食譜料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！'}
                  </p>

                  <div className="flex items-center justify-end mt-3">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span className="ml-1 text-sm">{review.userRating}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              返回編輯
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
