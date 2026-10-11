'use client';

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  ChevronRight,
  Clock3,
  Menu,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react';
import { recipes, type Recipe } from './recipes';

type Category = 'latest' | 'popular' | 'classic';

const categories: { id: Category; label: string }[] = [
  { id: 'latest', label: '最新食譜' },
  { id: 'popular', label: '人氣食譜' },
  { id: 'classic', label: '經典食譜' },
];

/** 以既有橫幅的局部裁切提供示意圖，不向外部服務下載圖片。 */
function RecipePicture({
  recipe,
  className = '',
}: {
  recipe: Recipe;
  className?: string;
}) {
  return (
    <span
      className={`recipe-picture picture-${recipe.image} ${className}`}
      role="img"
      aria-label={`${recipe.title}料理示意圖`}
    />
  );
}

/** 顯示料理時間、份量與範例評分，供卡片與詳情共用。 */
function RecipeMeta({ recipe }: { recipe: Recipe }) {
  return (
    <span className="recipe-meta">
      <span>
        <Clock3 size={14} aria-hidden="true" />
        {recipe.minutes} 分鐘
      </span>
      <span>
        <Users size={14} aria-hidden="true" />
        {recipe.servings} 人份
      </span>
      <span className="recipe-rating">
        <Star size={14} aria-hidden="true" />
        {recipe.rating}
      </span>
    </span>
  );
}

/** 保留首頁的料理瀏覽體驗，所有搜尋、分類與詳情皆使用本地範例。 */
export function HomeDemo() {
  const [category, setCategory] = useState<Category>('latest');
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // 彈出詳情時暫停背景捲動，關閉後還原頁面狀態。
  useEffect(
    function syncDialogScroll() {
      if (!selectedRecipe) return;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      /** 在詳情關閉或元件卸載時還原原本的捲動設定。 */
      return function restorePageScroll() {
        document.body.style.overflow = previousOverflow;
      };
    },
    [selectedRecipe],
  );

  const normalizedQuery = query.toLocaleLowerCase('zh-TW');
  // 依分類與關鍵字篩選本地食譜，不觸發任何網路請求。
  const visibleRecipes = recipes.filter(function matchesRecipe(recipe) {
    return (
      (category !== 'classic' || recipe.classic) &&
      `${recipe.title} ${recipe.description} ${recipe.tags.join(' ')}`
        .toLocaleLowerCase('zh-TW')
        .includes(normalizedQuery)
    );
  });
  // 人氣排序僅使用示範資料中的固定數值。
  if (category === 'popular')
    visibleRecipes.sort(function byPopularity(a, b) {
      return b.popularity - a.popularity;
    });

  /** 套用搜尋文字，並將畫面移到搜尋結果。 */
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(searchInput.trim());
    document
      .getElementById('recipes')
      ?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  /** 清除查詢並回到完整的最新食譜清單。 */
  function resetSearch() {
    setSearchInput('');
    setQuery('');
    setCategory('latest');
  }

  /** 在同頁彈出食譜摘要，不前往需要後端的動態路由。 */
  function openRecipe(recipe: Recipe) {
    setSelectedRecipe(recipe);
    dialogRef.current?.showModal();
  }

  /** 關閉原生對話框，讓瀏覽器將焦點還給原本的卡片。 */
  function closeRecipe() {
    dialogRef.current?.close();
  }

  /** 點擊對話框外的遮罩時關閉詳情。 */
  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) closeRecipe();
  }

  /** 從頁尾切換分類，並移到食譜清單。 */
  function browseCategory(nextCategory: Category) {
    setCategory(nextCategory);
    setQuery('');
    setSearchInput('');
    document
      .getElementById('recipes')
      ?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  return (
    <div id="top">
      <a className="skip-link" href="#recipes">
        跳到食譜清單
      </a>
      <header className="site-header">
        <div className="header-inner">
          <button
            type="button"
            className="icon-button menu-toggle"
            aria-label="開啟導覽選單"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <a className="brand" href="#top" aria-label="安那煮首頁">
            <Image
              src="/login-small-logo.svg"
              width={42}
              height={42}
              alt=""
              priority
            />
            <span>
              安那煮<small>ANNA COOK</small>
            </span>
          </a>
          <form className="search-form" role="search" onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="recipe-search">
              搜尋範例食譜
            </label>
            <Search size={19} aria-hidden="true" />
            <input
              id="recipe-search"
              type="search"
              placeholder="搜尋食譜、食材…"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <button type="submit" aria-label="搜尋">
              搜尋
            </button>
          </form>
          <span className="header-demo">首頁展示版</span>
        </div>
        {menuOpen && (
          <nav id="site-menu" className="mobile-menu" aria-label="首頁導覽">
            <a href="#featured" onClick={() => setMenuOpen(false)}>
              本週暖心推薦
              <ChevronRight size={18} />
            </a>
            <a href="#recipes" onClick={() => setMenuOpen(false)}>
              探索所有食譜
              <ChevronRight size={18} />
            </a>
          </nav>
        )}
      </header>

      <main>
        <div className="demo-note">
          <span>首頁展示版</span>用範例食譜，找回每天好好吃飯的靈感。
        </div>
        <section className="hero page-width" aria-label="安那煮沉浸式料理橫幅">
          <Image
            src="/ad_home_03.webp"
            alt="Anna Cook 沉浸式料理教學：跟著步驟，把家常味帶上餐桌"
            width={1200}
            height={660}
            priority
            className="hero-image"
          />
        </section>

        <section
          id="featured"
          className="featured-section page-width"
          aria-labelledby="featured-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">在家煮，也能很幸福</p>
              <h1 id="featured-title">本週暖心推薦</h1>
            </div>
            <a href="#recipes">
              更多食譜
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="featured-grid">
            {[recipes[0], recipes[3], recipes[5]].map((recipe, index) => (
              <button
                type="button"
                className="featured-card"
                key={recipe.id}
                onClick={() => openRecipe(recipe)}
                aria-label={`查看${recipe.title}食譜`}
              >
                <RecipePicture recipe={recipe} />
                <span className="featured-number">0{index + 1}</span>
                <span className="featured-caption">
                  <span>
                    {index === 0
                      ? '一鍋暖心家常'
                      : index === 1
                        ? '下班後的美味提案'
                        : '快速上桌的好滋味'}
                  </span>
                  <strong>{recipe.title}</strong>
                  <span>
                    <Clock3 size={14} aria-hidden="true" />
                    {recipe.minutes} 分鐘
                    <ChevronRight size={17} aria-hidden="true" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          id="recipes"
          className="recipes-section page-width"
          aria-labelledby="recipes-title"
        >
          <div className="section-heading recipe-heading">
            <div>
              <p className="eyebrow">今天，想煮什麼？</p>
              <h2 id="recipes-title">找到你的下一道拿手菜</h2>
            </div>
            <ChefHat size={28} className="heading-icon" aria-hidden="true" />
          </div>
          <div className="category-tabs" aria-label="食譜分類">
            {categories.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="results-summary" role="status" aria-live="polite">
            <span>
              {query
                ? `「${query}」的搜尋結果`
                : category === 'popular'
                  ? '大家喜歡的家常味'
                  : category === 'classic'
                    ? '熟悉的味道，值得一煮再煮'
                    : '從一道簡單的料理開始'}
              <small>共 {visibleRecipes.length} 道範例食譜</small>
            </span>
            {query && (
              <button type="button" onClick={resetSearch}>
                <X size={14} aria-hidden="true" />
                清除搜尋
              </button>
            )}
          </div>
          {visibleRecipes.length ? (
            <div className="recipe-grid">
              {visibleRecipes.map((recipe) => (
                <button
                  type="button"
                  className="recipe-card"
                  key={recipe.id}
                  onClick={() => openRecipe(recipe)}
                  aria-label={`查看${recipe.title}食譜`}
                >
                  <RecipePicture recipe={recipe} />
                  <span className="recipe-card-content">
                    <span className="recipe-author">{recipe.author}</span>
                    <strong>{recipe.title}</strong>
                    <span className="recipe-description">
                      {recipe.description}
                    </span>
                    <span className="recipe-tags">
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                    <RecipeMeta recipe={recipe} />
                  </span>
                  <ChevronRight
                    className="recipe-arrow"
                    size={17}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={34} aria-hidden="true" />
              <h3>還沒找到這道料理</h3>
              <p>試試「雞肉」、「河粉」或「香菇」，看看今天的靈感。</p>
              <button
                type="button"
                className="primary-button"
                onClick={resetSearch}
              >
                查看全部食譜
              </button>
            </div>
          )}
          <p className="sample-note">
            食譜內容與評分皆為展示用範例，料理圖片為既有素材示意。
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <div className="footer-brand">
            <Image
              src="/login-small-logo.svg"
              width={46}
              height={46}
              alt="安那煮標誌"
            />
            <div>
              <strong>安那煮 Anna Cook</strong>
              <p>家傳好菜，從今天的一餐開始。</p>
            </div>
          </div>
          <nav aria-label="頁尾導覽">
            <button type="button" onClick={() => browseCategory('latest')}>
              最新食譜
              <ChevronRight size={16} />
            </button>
            <button type="button" onClick={() => browseCategory('popular')}>
              人氣食譜
              <ChevronRight size={16} />
            </button>
            <a href="#top">
              回到頂端
              <ChevronRight size={16} />
            </a>
          </nav>
          <p className="copyright">© 安那煮 Anna Cook · 首頁展示版</p>
        </div>
      </footer>

      <dialog
        ref={dialogRef}
        className="recipe-dialog"
        aria-labelledby="recipe-dialog-title"
        onClose={() => setSelectedRecipe(null)}
        onClick={closeOnBackdrop}
      >
        {selectedRecipe && (
          <article className="dialog-content">
            <div className="dialog-image">
              <RecipePicture recipe={selectedRecipe} />
              <span className="dialog-label">範例食譜</span>
              <button
                type="button"
                className="dialog-close icon-button"
                aria-label="關閉食譜"
                onClick={closeRecipe}
                autoFocus
              >
                <X size={21} />
              </button>
            </div>
            <div className="dialog-body">
              <p className="eyebrow">{selectedRecipe.author}</p>
              <h2 id="recipe-dialog-title">{selectedRecipe.title}</h2>
              <p className="dialog-description">{selectedRecipe.description}</p>
              <RecipeMeta recipe={selectedRecipe} />
              <h3>
                <ChefHat size={20} aria-hidden="true" />
                準備食材
              </h3>
              <ul className="ingredient-list">
                {selectedRecipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
              <h3>
                <BookOpen size={20} aria-hidden="true" />
                料理步驟
              </h3>
              <ol className="cooking-steps">
                {selectedRecipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="dialog-note">
                此為互動展示內容；圖片沿用原站素材，並非此食譜的實際成品照。
              </p>
              <button
                type="button"
                className="primary-button"
                onClick={closeRecipe}
              >
                繼續找靈感
              </button>
            </div>
          </article>
        )}
      </dialog>
    </div>
  );
}
