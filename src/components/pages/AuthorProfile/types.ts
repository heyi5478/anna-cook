import type { Author, Recipe } from '@/types/recipe';

// 模擬作者資料
export const mockAuthor: Author = {
  id: '123',
  name: '古早味研究社',
  avatar: '/images/author-avatar.jpg',
  bio: '"我們專注把挖掘那些平常被遺忘的家常滋味，從長輩傳下來的過去，到街角小吃攤的香氣，都值得被留下。每一道料理不只講究味道，更是一種記憶的承載。用最簡單的食材，還原最動人的味道，讓每個人都能在餐桌上找到熟悉的感動。"',
  recipeCount: 8,
  followerCount: 2,
  isFollowing: false,
};

// 模擬食譜資料
export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: '家傳滷五花',
    image: '/images/recipe1.jpg',
    category: '主菜',
    time: 30,
    servings: 2,
    rating: 4.5,
    description: '使用五香粉和醬油等調味料，讓豬肉入味...',
    cookingTime: 30,
  },
  {
    id: '2',
    title: '家傳滷五花',
    image: '/images/recipe2.jpg',
    category: '主菜',
    time: 30,
    servings: 2,
    rating: 4.5,
    description: '使用五香粉和醬油等調味料，讓豬肉入味...',
    cookingTime: 30,
  },
  {
    id: '3',
    title: '家傳滷五花',
    image: '/images/recipe3.jpg',
    category: '主菜',
    time: 30,
    servings: 2,
    rating: 4.5,
    description: '使用五香粉和醬油等調味料，讓豬肉入味...',
    cookingTime: 30,
  },
];
