import { NextPage } from 'next';
import RecipeUploadForm from '@/components/RecipeUploadLayout';

// 建立食譜頁面
const CreateRecipePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <RecipeUploadForm />
    </div>
  );
};

export default CreateRecipePage;
