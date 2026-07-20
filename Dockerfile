# ============================================================
# 建置階段（builder）：安裝完整依賴、編譯 Next.js
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# 跳過 husky 的 git hooks 安裝（容器內沒有 .git，會失敗）
ENV HUSKY=0

# 先只複製依賴清單並安裝：程式碼變動時這一層可以吃 Docker 快取
COPY package.json package-lock.json ./
RUN npm ci

# NEXT_PUBLIC_* 變數是「建置期」寫死進前端 bundle 的，必須在 build 前提供
ARG NEXT_PUBLIC_API_BASE_URL=https://annacook.rocket-coding.com/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY . .
RUN npm run build

# ============================================================
# 執行階段（runner）：只帶走執行必需的產物，image 保持精簡
# ============================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# standalone server 預設綁 localhost，容器內必須綁 0.0.0.0 外面才連得到
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# 不用 root 執行應用程式：建立低權限使用者
RUN addgroup -g 1001 nodejs && adduser -S -u 1001 nextjs

# standalone 產物 = server.js + 精簡後的 node_modules（只含執行期需要的套件）
COPY --from=builder /app/.next/standalone ./
# 靜態資源與 public 不會自動進 standalone，要手動帶
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
