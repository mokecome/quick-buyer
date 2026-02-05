# Quick Buyer 安全掃描報告

**掃描日期**：2026-02-05
**項目名稱**：quick-buyer
**技術棧**：Next.js 16.0.7 + Supabase + Creem 支付

---

## 執行摘要

| 風險等級 | 數量 | 說明 |
|:---:|:---:|:---|
| 🔴 嚴重 | 0 | 無立即需要處理的嚴重漏洞 |
| 🟠 高 | 2 | 需要優先修復 |
| 🟡 中 | 4 | 建議儘快修復 |
| 🟢 低 | 2 | 可在後續版本處理 |
| ✅ 通過 | 8 | 安全檢查項目通過 |

---

## Part 1：發現的安全問題

---

### 問題 1：Next.js 依賴套件存在已知漏洞

> 風險等級：🟠 高

**問題描述**

目前使用的 Next.js 版本 `16.0.7` 存在 3 個已知安全漏洞：

| CVE/GHSA | 嚴重程度 | 說明 |
|:---|:---:|:---|
| GHSA-h25m-26qc-wcjf | High (7.5) | HTTP request deserialization 可導致 DoS |
| GHSA-9g9p-9gw9-jx7f | Moderate (5.9) | Image Optimizer DoS 漏洞 |
| GHSA-5f7q-jpqc-wp7h | Moderate (5.9) | PPR Resume Endpoint 記憶體耗盡 |

**影響範圍**

- 攻擊者可透過惡意請求導致服務中斷
- 影響所有使用 React Server Components 的端點

**位置**

- `package.json:40` - `"next": "^16.0.7"`

**修復方式**

```bash
# 升級至修補版本
npm install next@16.1.5

# 或更新 package.json
"next": "^16.1.5"
```

**參考資料**

- https://github.com/advisories/GHSA-h25m-26qc-wcjf
- https://github.com/advisories/GHSA-9g9p-9gw9-jx7f
- https://github.com/advisories/GHSA-5f7q-jpqc-wp7h

---

### 問題 2：Webhook 簽名驗證未實現

> 風險等級：🟠 高

**問題描述**

Creem 支付 Webhook 端點的簽名驗證功能標記為 TODO，尚未實現。攻擊者可以偽造 Webhook 請求來：
- 偽造購買記錄
- 免費獲取付費內容
- 操縱訂閱狀態

**位置**

- `app/api/webhooks/creem/route.ts:9-14`

```typescript
// 目前的代碼（問題）
const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
if (webhookSecret && signature) {
  // TODO: Implement signature verification  ← 未實現
  console.log('Received webhook with signature:', signature)
}
```

**修復方式**

```typescript
import crypto from 'crypto'

// 驗證 Webhook 簽名
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-creem-signature')

    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET

    // 強制驗證簽名
    if (!webhookSecret) {
      console.error('CREEM_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (!signature || !verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // ... 繼續處理
  }
}
```

---

### 問題 3：缺少安全回應標頭

> 風險等級：🟡 中

**問題描述**

`next.config.mjs` 未配置安全標頭，可能導致：
- 點擊劫持攻擊（缺少 X-Frame-Options）
- XSS 攻擊風險增加（缺少 CSP）
- MIME 類型混淆攻擊（缺少 X-Content-Type-Options）

**位置**

- `next.config.mjs`

**修復方式**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 現有配置

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // 生產環境建議加入 HSTS
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=31536000; includeSubDomains',
          // },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

### 問題 4：TypeScript 構建錯誤被忽略

> 風險等級：🟡 中

**問題描述**

`next.config.mjs` 中設定 `ignoreBuildErrors: true`，這會隱藏潛在的類型錯誤，可能導致：
- 安全相關的類型錯誤被忽略
- 運行時意外行為
- 難以追蹤的 bug

**位置**

- `next.config.mjs:3-5`

```javascript
typescript: {
  ignoreBuildErrors: true,  // ← 危險設定
},
```

**修復方式**

```javascript
typescript: {
  ignoreBuildErrors: false,  // 或直接移除此配置
},
```

然後修復所有 TypeScript 錯誤後再進行部署。

---

### 問題 5：缺少 .env.example 文件

> 風險等級：🟡 中

**問題描述**

項目沒有 `.env.example` 文件來引導開發者正確配置環境變數，可能導致：
- 新開發者不知道需要哪些環境變數
- 生產環境配置遺漏
- 敏感資訊意外暴露

**修復方式**

創建 `.env.example` 文件：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Creem Payment (https://creem.io)
CREEM_API_KEY=your-creem-api-key
CREEM_WEBHOOK_SECRET=your-webhook-secret

# Optional: Environment
NODE_ENV=development
```

---

### 問題 6：缺少 Next.js Middleware

> 風險等級：🟡 中

**問題描述**

項目有 `proxy.ts` 但沒有 `middleware.ts` 文件，導致認證中間件可能未正確執行。

**位置**

- 缺少 `middleware.ts`

**修復方式**

創建 `middleware.ts`：

```typescript
import { proxy, config as proxyConfig } from './proxy'

export const middleware = proxy
export const config = proxyConfig
```

或將 `proxy.ts` 重命名為 `middleware.ts`。

---

### 問題 7：硬編碼管理員郵箱

> 風險等級：🟢 低

**問題描述**

管理員郵箱直接硬編碼在代碼中，雖然風險較低，但不利於維護和環境隔離。

**位置**

- `lib/admin/check-admin.ts:4`
- `supabase/full_setup.sql:136-137`

```typescript
const ADMIN_EMAILS = ['mokecome@gmail.com']
```

**修復方式**

使用環境變數：

```typescript
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean)

// .env
ADMIN_EMAILS=mokecome@gmail.com,another-admin@example.com
```

---

### 問題 8：日誌中可能洩露敏感資訊

> 風險等級：🟢 低

**問題描述**

某些 API 端點在日誌中輸出了敏感資訊：

**位置**

- `app/api/checkout/route.ts:42-43` - 輸出 checkout 詳情
- `app/api/webhooks/creem/route.ts:17` - 輸出 webhook 事件

**修復方式**

在生產環境中減少日誌輸出或使用結構化日誌：

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Webhook event:', event.type)
}
// 或使用 logger 庫，並設定 log level
```

---

## Part 2：安全檢查通過項目

| # | 檢查項目 | 狀態 | 說明 |
|:---:|:---|:---:|:---|
| 1 | .env 文件排除 | ✅ 通過 | `.gitignore` 正確配置，排除所有 `.env*` 文件 |
| 2 | 硬編碼密碼/密鑰 | ✅ 通過 | 未發現硬編碼的密碼或 API 密鑰 |
| 3 | SQL 注入防護 | ✅ 通過 | 使用 Supabase ORM，無原生 SQL 字串拼接 |
| 4 | XSS 防護 | ✅ 通過 | 未發現 `dangerouslySetInnerHTML` 或 `eval()` 使用 |
| 5 | 文件上傳驗證 | ✅ 通過 | 有檔案類型和大小限制 (`app/api/upload/route.ts:29-44`) |
| 6 | API 認證檢查 | ✅ 通過 | API 路由有 `getUser()` 認證檢查 |
| 7 | 資料庫 RLS | ✅ 通過 | Supabase RLS 政策已配置 |
| 8 | CORS 配置 | ✅ 通過 | 未發現 `Access-Control-Allow-Origin: *` 配置 |

---

## Part 3：Session 安全分析

### Supabase 認證機制

項目使用 Supabase Auth，其 Session 管理由 Supabase SSR 庫處理：

**優點：**
- ✅ Session 由 Supabase 管理，自動處理 token refresh
- ✅ Cookie 設定通過 `@supabase/ssr` 庫標準化
- ✅ 支援 OAuth 認證（GitHub、Google）

**Session Fixation 防護：**

Supabase OAuth 流程中，`exchangeCodeForSession()` 會創建新的 session，因此具有一定的 Session Fixation 防護：

```typescript
// app/auth/callback/route.ts:11
const { error } = await supabase.auth.exchangeCodeForSession(code)
```

**建議改進：**

確認 Supabase Cookie 設定在生產環境中包含安全屬性。可以在 `lib/supabase/server.ts` 中添加：

```typescript
cookiesToSet.forEach(({ name, value, options }) =>
  cookieStore.set(name, value, {
    ...options,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
  })
)
```

---

## Part 4：修復優先順序

### 🔴 立即修復（阻擋部署）

| # | 問題 | 負責人 | 預計完成 |
|:---:|:---|:---:|:---:|
| 1 | 升級 Next.js 至 16.1.5+ | - | - |
| 2 | 實現 Webhook 簽名驗證 | - | - |

### 🟠 本次部署前修復

| # | 問題 | 負責人 | 預計完成 |
|:---:|:---|:---:|:---:|
| 3 | 配置安全回應標頭 | - | - |
| 4 | 創建 middleware.ts | - | - |

### 🟡 下個版本修復

| # | 問題 | 負責人 | 預計完成 |
|:---:|:---|:---:|:---:|
| 5 | 移除 ignoreBuildErrors | - | - |
| 6 | 創建 .env.example | - | - |
| 7 | 管理員郵箱改用環境變數 | - | - |
| 8 | 優化日誌輸出 | - | - |

---

## Part 5：快速修復命令

```bash
# 1. 升級 Next.js
npm install next@16.1.5

# 2. 驗證升級
npm audit

# 3. 重新構建測試
npm run build
npm run lint
```

---

## Part 6：持續安全維護建議

1. **啟用 GitHub Dependabot**
   - 自動檢測依賴漏洞
   - 自動創建 PR 更新

2. **設定 CI/CD 安全掃描**
   - 在 `.github/workflows/` 中添加 npm audit 步驟

3. **定期安全審計**
   - 建議每季度進行一次完整安全掃描
   - 訂閱關鍵依賴的安全公告

4. **監控 Webhook 異常**
   - 記錄失敗的 webhook 請求
   - 設定告警機制

---

**報告生成者**：Claude Code
**掃描範圍**：全項目安全審計
**下次建議掃描日期**：2026-05-05

#security #audit #quick-buyer
