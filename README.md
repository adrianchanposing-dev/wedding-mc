# MC Adrian Chan — 個人網站

Wedding MC 個人網站，Next.js + Tailwind CSS 起，包括簡介、過往案例、婚禮籌備資訊同 Rundown 生成器。

## 本機開發

```bash
npm install
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000)。

## 換相片（過往案例）

1. 將相片放入 `public/portfolio/` 資料夾（建議檔名例如 `100-assistant.jpg`）。
2. 打開 `src/lib/site.ts`，喺 `portfolioCategories` 入面搵返對應項目，
   將 `image: ""` 改成 `image: "/portfolio/100-assistant.jpg"`。
3. 未填 `image` 嘅項目會繼續顯示現有嘅佔位色塊，可以逐個慢慢補。

## 改文字內容

- 品牌名/簡介/聯絡方式：`src/lib/site.ts`
- 首頁文案：`src/app/page.tsx`
- 籌備資訊頁：`src/app/prep/page.tsx`
- Rundown 範本：`src/lib/rundownTemplates.ts`

## 部署

推薦用 [Vercel](https://vercel.com)：

1. 將呢個 repo push 上 GitHub。
2. 喺 Vercel 度 "Add New Project" → Import 呢個 repo → 一路用預設設定 Deploy 就得
   （Vercel 會自動偵測到 Next.js）。
3. 之後每次 push 去 GitHub 嘅 main branch，Vercel 會自動重新部署。
