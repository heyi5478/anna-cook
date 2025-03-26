import VideoUpload from '@/components/VideoUpload';

// 建立食譜第三步頁面
export default function CreateRecipeStep3Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <VideoUpload
          onSave={(trimmedVideo) => {
            console.log('已儲存剪輯的影片:', trimmedVideo);
            // 這裡可以處理儲存邏輯
          }}
          onCancel={() => {
            console.log('已取消影片剪輯');
            // 這裡可以處理取消邏輯
          }}
        />
      </div>
    </div>
  );
}
