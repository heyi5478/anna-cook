import { NextPage } from 'next';
import ProfileEditForm from '@/components/ProfileEditForm';
import { useAuth } from '@/hooks/useAuth';

/**
 * 用戶中心編輯頁面
 */
const CreateRecipePage: NextPage = () => {
  // 檢查用戶是否已登入，未登入則重定向到登入頁
  const { isLoading } = useAuth();

  // 載入中顯示空白內容
  if (isLoading) {
    return null;
  }

  return <ProfileEditForm />;
};

export default CreateRecipePage;
