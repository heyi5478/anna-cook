import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  /**
   * 處理選單按鈕點擊事件
   */
  const atMenuClick = () => {
    console.log("Menu clicked")
  }

  /**
   * 處理搜尋提交事件
   */
  const atSearchSubmit = (query: string) => {
    console.log("Search submitted:", query)
  }

  /**
   * 處理登入按鈕點擊事件
   */
  const atLoginClick = () => {
    console.log("Login clicked")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header logoText="Logo" atMenuClick={atMenuClick} atSearchSubmit={atSearchSubmit} atLoginClick={atLoginClick} />

      {/* 頁面其他內容將在這裡 */}
      <main className="flex-1 p-4">
        <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center mb-4">
          <div className="text-gray-400">圖片區域</div>
        </div>

        <h2 className="font-medium mb-2">人氣食譜</h2>
        {/* 人氣食譜內容 */}
      </main>

      <Footer companyName="商標" studioName="Creative studio" />
    </div>
  )
}

