FROM node:22-slim

LABEL "language"="nodejs"
LABEL "framework"="next.js"

WORKDIR /src

# 複製 package 檔案並先安裝依賴，利用 Docker 層快取
COPY package*.json ./
RUN npm ci --only=production

# 複製專案檔案
COPY . .

# 建置專案
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]