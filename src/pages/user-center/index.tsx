import { NextPage } from 'next';
import UserCenter from '@/components/UserCenter';
import { useAuth } from '@/hooks/auth';

const UserCenterPage: NextPage = () => {
  // 使用身份驗證 hook，未授權時自動導向登入頁
  const { isAuthenticated, isLoading } = useAuth('/login');

  // 當驗證中或未授權時不渲染
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <UserCenter />;
};

export default UserCenterPage;
