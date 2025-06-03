import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { StarRating } from '@/components/pages/RecipePage/StarRating';
import { ReviewDisplay } from '@/components/pages/RecipePage/ReviewDisplay';
import {
  submitRecipeRatingComment,
  fetchRecipeRatingComments,
} from '@/services/recipes';
import { useToast } from '@/hooks/use-toast';
import { HTTP_STATUS, VALIDATION_MESSAGES, TEXT_LIMITS } from '@/lib/constants';

// 定義表單 schema
const reviewSchema = z.object({
  rating: z.number().min(1, { message: '請選擇評分' }),
  comment: z
    .string()
    .min(TEXT_LIMITS.MIN_COMMENT_LENGTH, {
      message: VALIDATION_MESSAGES.MIN_COMMENT_LENGTH,
    })
    .max(TEXT_LIMITS.MAX_COMMENT_LENGTH, {
      message: VALIDATION_MESSAGES.MAX_COMMENT_LENGTH,
    }),
});

// 定義表單類型
type ReviewFormValues = z.infer<typeof reviewSchema>;

// 定義評論類型
type Review = {
  commentId?: number;
  displayId?: string;
  authorName?: string;
  authorPhoto?: string | null;
  comment: string;
  rating: number;
};

/**
 * 食譜評論元件，提供使用者評分和評論功能
 */
export default function Review({ recipeId }: { recipeId: number }) {
  // 狀態管理
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const { toast } = useToast();

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
  const atSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true);
    try {
      const response = await submitRecipeRatingComment(
        recipeId,
        data.rating,
        data.comment,
      );

      if (response.msg === '評分與留言成功') {
        // 獲取自己提交的評論
        const commentsResponse = await fetchRecipeRatingComments(recipeId);
        if (
          commentsResponse.StatusCode === HTTP_STATUS.OK &&
          commentsResponse.data.length > 0
        ) {
          // 假設第一條是最新的評論（即自己剛提交的）
          setReview(commentsResponse.data[0]);
        } else {
          // 如果沒有獲取到評論，使用表單數據
          setReview({
            rating: data.rating,
            comment: data.comment,
          });
        }
        setIsSubmitted(true);
        toast({
          title: '成功',
          description: '評分與留言已成功提交',
        });
      } else {
        toast({
          title: '錯誤',
          description: response.msg || '提交評論失敗',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('提交評論失敗:', error);
      toast({
        title: '錯誤',
        description: error instanceof Error ? error.message : '提交評論失敗',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 處理評分變更
   */
  const atRatingChange = (rating: number) => {
    form.setValue('rating', rating);
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
                        onRatingChange={atRatingChange}
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
                  render={({ field }) => {
                    // 擷取 field 的 onBlur 函式
                    const { onBlur: fieldOnBlur, ...restField } = field;

                    return (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="詳細說明您對這道食譜的想法。料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！"
                            className="min-h-[120px] text-base"
                            onFocus={(e) => {
                              // 實現自動聚焦並清空預設文字的功能
                              if (
                                e.target.value === field.value &&
                                field.value === ''
                              ) {
                                e.target.placeholder = '';
                              }
                            }}
                            onBlur={(e) => {
                              // 呼叫原始的 onBlur 處理器
                              fieldOnBlur();

                              // 失去焦點時，如果文字框為空，則恢復預設提示文字
                              if (field.value === '') {
                                e.target.placeholder =
                                  '詳細說明您對這道食譜的想法。料理中加入花生醬燉煮，醬汁香濃醇厚，滋味甜甜鹹鹹，獨特的風味讓人難忘！';
                              }
                            }}
                            {...restField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin">⋯</span>
                  ) : (
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
                  )}
                  {isLoading ? '提交中...' : '提交留言'}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          // 已提交狀態 - 顯示評論
          <div className="space-y-6">
            {review && (
              <>
                <StarRating
                  rating={review.rating}
                  size="lg"
                  readOnly
                  showRating
                  ratingTitle="您的評價"
                />

                <ReviewDisplay
                  comment={review.comment}
                  username={review.authorName || '您'}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
