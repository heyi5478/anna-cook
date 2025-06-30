# 測試影片檔案

這個目錄包含用於測試的影片檔案。由於檔案大小限制，實際的影片檔案不會提交到版本控制中。

## 檔案需求

### 必要的測試影片檔案

請在此目錄中放置以下測試影片檔案：

1. **test-video-short.mp4**
   - 時長: 30秒
   - 解析度: 720p
   - 檔案大小: 約 5MB
   - 格式: MP4 (H.264)
   - 用途: 基本上傳和播放測試

2. **test-video-medium.mp4**
   - 時長: 2分鐘
   - 解析度: 1080p
   - 檔案大小: 約 20MB
   - 格式: MP4 (H.264)
   - 用途: 片段編輯和縮圖生成測試

3. **test-video-long.mp4**
   - 時長: 5分鐘
   - 解析度: 1080p
   - 檔案大小: 約 50MB
   - 格式: MP4 (H.264)
   - 用途: 效能和長時間處理測試

4. **test-video-invalid.txt**
   - 檔案大小: 1KB
   - 格式: 文字檔案
   - 用途: 無效檔案格式測試

5. **test-video-large.mp4**
   - 時長: 10分鐘
   - 解析度: 1080p
   - 檔案大小: 約 150MB
   - 格式: MP4 (H.264)
   - 用途: 檔案大小限制測試

### 替代格式測試檔案

6. **test-video-webm.webm**
   - 時長: 1分鐘
   - 解析度: 720p
   - 檔案大小: 約 10MB
   - 格式: WebM (VP8/VP9)
   - 用途: WebM 格式支援測試

7. **test-video-mov.mov**
   - 時長: 1分鐘
   - 解析度: 720p
   - 檔案大小: 約 15MB
   - 格式: QuickTime MOV
   - 用途: MOV 格式支援測試

## 建立測試檔案

### 使用 FFmpeg 建立測試檔案

如果您有 FFmpeg，可以使用以下指令建立測試檔案：

```bash
# 建立 30 秒測試影片
ffmpeg -f lavfi -i testsrc2=duration=30:size=1280x720:rate=30 -c:v libx264 -pix_fmt yuv420p test-video-short.mp4

# 建立 2 分鐘測試影片
ffmpeg -f lavfi -i testsrc2=duration=120:size=1920x1080:rate=30 -c:v libx264 -pix_fmt yuv420p test-video-medium.mp4

# 建立 5 分鐘測試影片
ffmpeg -f lavfi -i testsrc2=duration=300:size=1920x1080:rate=30 -c:v libx264 -pix_fmt yuv420p test-video-long.mp4

# 建立大檔案測試影片
ffmpeg -f lavfi -i testsrc2=duration=600:size=1920x1080:rate=30 -c:v libx264 -b:v 10M -pix_fmt yuv420p test-video-large.mp4

# 建立 WebM 格式測試影片
ffmpeg -f lavfi -i testsrc2=duration=60:size=1280x720:rate=30 -c:v libvpx-vp9 -pix_fmt yuv420p test-video-webm.webm

# 建立 MOV 格式測試影片
ffmpeg -f lavfi -i testsrc2=duration=60:size=1280x720:rate=30 -c:v libx264 -pix_fmt yuv420p test-video-mov.mov
```

### 建立無效檔案

```bash
# 建立無效的測試檔案
echo "This is not a video file" > test-video-invalid.txt
```

## 檔案組織

```
tests/fixtures/videos/
├── README.md                 # 此說明檔案
├── test-video-short.mp4      # 短影片測試檔案
├── test-video-medium.mp4     # 中等長度影片測試檔案
├── test-video-long.mp4       # 長影片測試檔案
├── test-video-large.mp4      # 大檔案測試檔案
├── test-video-webm.webm      # WebM 格式測試檔案
├── test-video-mov.mov        # MOV 格式測試檔案
├── test-video-invalid.txt    # 無效檔案測試
└── thumbnails/               # 預期的縮圖檔案（選擇性）
    ├── short-thumb-1.jpg
    ├── short-thumb-2.jpg
    └── ...
```

## 使用注意事項

1. **檔案大小**: 測試檔案應該保持適當的大小，避免影響測試執行速度
2. **檔案格式**: 確保測試檔案涵蓋所有支援的格式
3. **內容**: 測試影片內容不需要特別製作，使用測試圖案即可
4. **時長**: 不同時長的影片用於測試不同的功能
5. **品質**: 測試檔案品質不需要過高，適中即可

## 環境變數

可以在測試設定中使用環境變數指定測試檔案路徑：

```typescript
const TEST_VIDEO_PATH = process.env.TEST_VIDEO_PATH || 'tests/fixtures/videos';
```

## CI/CD 考量

在 CI/CD 環境中，可能需要：

1. 動態下載測試檔案
2. 使用較小的測試檔案
3. 跳過需要大檔案的測試

建議在 CI 設定中使用較小的測試檔案或模擬檔案。 