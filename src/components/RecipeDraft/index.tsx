import { useState } from 'react';
import type React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EditableSection } from './EditableSection';
import { IngredientList } from './IngredientList';
import { TagsSection } from './TagsSection';
import { CookingInfo } from './CookingInfo';
import { CookingSteps } from './CookingSteps';

const recipeDraftVariants = cva('flex flex-col min-h-screen bg-gray-100', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    variant: {
      default: 'bg-gray-100',
      outline: 'bg-white border',
      ghost: 'bg-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

type RecipeDraftProps = VariantProps<typeof recipeDraftVariants> &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * 食譜草稿編輯元件
 */
export const RecipeDraft: React.FC<RecipeDraftProps> = ({
  size,
  variant,
  className,
  ...props
}) => {
  const [recipeName, setRecipeName] = useState('美味炒牛肉');
  const [recipeIntro, setRecipeIntro] = useState(
    '食譜簡介內容將會加入人工生態圈，會有趣味的，讓大家都學得會，並且還可以讓更多人愛上！',
  );
  const [coverImage, setCoverImage] = useState('');
  const [cookingTime, setCookingTime] = useState('30 分鐘');
  const [servingSize, setServingSize] = useState('2 人份');

  const [ingredients, setIngredients] = useState([
    { id: '1', name: '高麗菜', quantity: '2顆' },
    { id: '2', name: '高麗菜', quantity: '2顆' },
    { id: '3', name: '高麗菜', quantity: '2顆' },
  ]);

  const [seasonings, setSeasonings] = useState([
    { id: '1', name: '胡椒鹽', quantity: '2匙' },
    { id: '2', name: '胡椒鹽', quantity: '2匙' },
    { id: '3', name: '胡椒鹽', quantity: '2匙' },
  ]);

  /**
   * 處理上傳封面圖片
   */
  const atUploadCoverImage = () => {
    // 這裡應該實現圖片上傳功能
    alert('封面圖片上傳功能將在此實現');
    // 模擬上傳後設置圖片 URL
    setCoverImage('/placeholder.svg');
  };

  /**
   * 處理保存所有變更
   */
  const atSaveAll = () => {
    alert('所有變更已保存！');
    // 這裡應該實現保存到後端的邏輯
  };

  /**
   * 處理取消編輯
   */
  const atCancelEdit = () => {
    // 使用自訂確認對話框替代 window.confirm
    // 通過公共狀態管理或模態對話框實現
    // 這裡簡化處理
    alert('取消編輯功能將在此實現，所有未保存的變更將會丟失');
  };

  return (
    <div
      className={cn(recipeDraftVariants({ size, variant }), className)}
      {...props}
    >
      <Head>
        <title>編輯草稿頁</title>
        <meta name="description" content="食譜草稿編輯頁" />
      </Head>

      <Header />

      <main className="flex-1 max-w-md mx-auto bg-white w-full">
        <div className="flex flex-col space-y-4 pb-20">
          {/* 麵包屑導航 */}
          <div
            className={cn('px-4 py-2 text-gray-600 border-b', {
              'text-xs': size === 'sm',
              'text-sm': size === 'md',
              'text-base': size === 'lg',
            })}
          >
            <span>首頁</span> {'>'} <span>編輯食譜</span> {'>'}{' '}
            <span>草稿編輯</span>
          </div>

          {/* 食譜名稱 */}
          <EditableSection
            title="食譜名稱"
            content={recipeName}
            className="px-4 py-2"
            onSave={setRecipeName}
            size={size}
          />

          {/* 封面圖片 */}
          <div className="px-4">
            <p
              className={cn('font-medium mb-2', {
                'text-xs': size === 'sm',
                'text-sm': size === 'md',
                'text-base': size === 'lg',
              })}
            >
              封面圖片
            </p>
            <div
              className="bg-gray-200 h-48 flex items-center justify-center relative cursor-pointer"
              onClick={atUploadCoverImage}
            >
              {coverImage ? (
                <Image
                  src={coverImage || '/placeholder.svg'}
                  alt="封面圖片"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera size={32} className="text-gray-400 mb-2" />
                  <span
                    className={cn('text-gray-500', {
                      'text-xs': size === 'sm',
                      'text-sm': size === 'md',
                      'text-base': size === 'lg',
                    })}
                  >
                    點擊上傳封面圖片
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 食譜簡介 */}
          <EditableSection
            title="食譜簡介"
            content={recipeIntro}
            className="px-4 py-2"
            onSave={setRecipeIntro}
            size={size}
          />

          {/* 食材清單 */}
          <IngredientList
            title="食材清單"
            ingredients={ingredients}
            onUpdate={setIngredients}
            size={size}
          />

          {/* 調味料清單 */}
          <IngredientList
            title="調味料清單"
            ingredients={seasonings}
            onUpdate={setSeasonings}
            size={size}
          />

          {/* 烹調標籤 */}
          <TagsSection size={size} />

          {/* 烹飪時間和人數 */}
          <div className="flex px-4 py-2 justify-between">
            <CookingInfo
              title="烹飪時間"
              value={cookingTime}
              onSave={setCookingTime}
              size={size}
            />

            <CookingInfo
              title="人數"
              value={servingSize}
              onSave={setServingSize}
              size={size}
            />
          </div>

          {/* 料理步驟 */}
          <CookingSteps size={size} />

          {/* 操作按鈕 */}
          <div className="px-4 py-2 space-y-2">
            <Button
              className="w-full bg-gray-500 text-white py-2"
              onClick={atSaveAll}
              type="button"
            >
              儲存變更
            </Button>
            <Button
              variant="outline"
              className="w-full py-2"
              onClick={atCancelEdit}
              type="button"
            >
              取消編輯
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/**
 * RecipeDraftConfirmation 頁面元件
 */
const RecipeDraftConfirmation = () => {
  return <RecipeDraft />;
};

export default RecipeDraftConfirmation;
