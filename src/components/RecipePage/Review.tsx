import type React from 'react';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { StarRating } from '@/components/RecipePage/StarRating';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

// 定義表單 schema
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(10, { message: '評論內容至少需要 10 個字' })
    .max(500, { message: '評論內容不可超過 500 個字' }),
});

// 定義表單類型
type ReviewFormValues = z.infer<typeof reviewSchema>;

// 定義評論類型
type Review = ReviewFormValues & {
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
   * 設定表單
   */
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  /**
   * 處理評論提交
   */
  const atSubmit = (data: ReviewFormValues) => {
    setReview((prev) => ({
      ...prev,
      ...data,
    }));
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-dashed border-purple-200">
      <div className="p-4">
        {!isSubmitted ? (
          // 未提交狀態 - 評論表單
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(atSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <StarRating
                        rating={field.value}
                        onRatingChange={(rating) => field.onChange(rating)}
                        size="lg"
                        showRating
                        ratingTitle="您的評價"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="詳細說明您對這道食譜的想法。料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！"
                          className="min-h-[120px] text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
            </Form>
          </div>
        ) : (
          // 已提交狀態 - 顯示評論
          <div className="space-y-6">
            <StarRating
              rating={review.rating}
              size="lg"
              readOnly
              showRating
              ratingTitle="您的評價"
            />

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
              onClick={() => {
                form.reset();
                setIsSubmitted(false);
              }}
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
