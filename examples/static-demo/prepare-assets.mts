import { copyFile, mkdir } from 'node:fs/promises';

// 只複製展示版使用的品牌與橫幅素材，避免複製正式網站的 Service Worker
const assets = ['ad_home_03.webp', 'ad_home_02.png', 'login-small-logo.svg'];
const sourceDirectory = new URL('../../public/', import.meta.url);
const destinationDirectory = new URL('./public/', import.meta.url);

// 準備 Next.js 匯出時會一起複製的 public 素材
async function prepareAssets(): Promise<void> {
  await mkdir(destinationDirectory, { recursive: true });
  for (const asset of assets) {
    await copyFile(
      new URL(asset, sourceDirectory),
      new URL(asset, destinationDirectory),
    );
  }
}

await prepareAssets();
console.log('展示版素材已準備完成。');
