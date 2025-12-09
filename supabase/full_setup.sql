-- ============================================
-- Quick Buyer - Full Database Setup
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- Step 1: Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  download_url TEXT NOT NULL,
  docs_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Step 3: Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies
DROP POLICY IF EXISTS "Public can view approved projects" ON projects;
CREATE POLICY "Public can view approved projects"
  ON projects FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 5: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Step 6: Insert Seed Data (8 AI Projects)
-- ============================================

INSERT INTO projects (
  id, slug, title, description, long_description, price, category,
  download_url, docs_url, demo_url, author_name, author_avatar,
  status, download_count, rating, review_count, user_id
) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567001',
  'agent-ppt-nano-banana',
  'Agent-PPT (Nano Banana)',
  '智能 PTT 爬蟲與分析 Agent，自動追蹤熱門話題、情緒分析、關鍵字監控。支援即時通知與數據視覺化儀表板。',
  '## 功能特色

- **智能爬蟲**: 自動追蹤 PTT 各版文章，支援關鍵字過濾
- **情緒分析**: 基於 LLM 的情緒判斷，識別正負面評論
- **熱門追蹤**: 即時監控爆文、熱門話題趨勢
- **關鍵字監控**: 自訂關鍵字，新文章即時通知
- **數據儀表板**: 視覺化呈現數據趨勢與統計

## 技術架構

- Python + Playwright 爬蟲引擎
- LangChain + GPT-4 情緒分析
- FastAPI 後端 API
- Next.js 14 前端儀表板
- PostgreSQL + Redis 數據存儲
- LINE / Telegram Bot 通知

## 應用場景

- 品牌輿情監控
- 投資情報收集
- 市場趨勢分析
- 競品監測',
  199,
  'AI Agent',
  'https://github.com/example/agent-ppt',
  'https://docs.example.com/agent-ppt',
  'https://demo.example.com/agent-ppt',
  'NanoBanana',
  NULL,
  'approved',
  520,
  4.9,
  87,
  NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567002',
  'ai-customer-service-sales',
  '智能客服 (銷售版)',
  '專為銷售場景打造的 AI 客服系統，支援多輪對話、意圖識別、商品推薦、訂單查詢。整合 GPT-4 與知識庫 RAG。',
  '## 核心功能

- **多輪對話**: 自然流暢的對話體驗，理解上下文
- **意圖識別**: 精準識別用戶意圖，智能路由
- **商品推薦**: 基於對話內容的個性化推薦
- **訂單查詢**: 整合訂單系統，即時查詢狀態
- **知識庫 RAG**: 自動檢索產品資料回答問題

## 技術架構

- Next.js 14 + TypeScript 前端
- LangChain + GPT-4 對話引擎
- Pinecone / Qdrant 向量數據庫
- Supabase 後端服務
- WebSocket 即時通訊

## 適用場景

- 電商客服
- SaaS 產品支援
- 線上銷售諮詢
- 售前引導',
  299,
  'AI Agent',
  'https://github.com/example/ai-customer-service',
  'https://docs.example.com/ai-customer-service',
  'https://demo.example.com/ai-customer-service',
  'SalesAI',
  NULL,
  'approved',
  890,
  4.8,
  156,
  NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567003',
  'agentic-rag',
  'Agentic RAG',
  '下一代智能檢索增強生成系統，結合多 Agent 協作、自動規劃、工具調用。支援多數據源整合與複雜問答場景。',
  '## 核心特色

- **多 Agent 協作**: 專業分工的 Agent 團隊，協同完成複雜任務
- **自動規劃**: 智能拆解問題，制定執行計劃
- **工具調用**: 支援網頁搜索、代碼執行、API 調用等工具
- **多數據源**: 整合文檔、數據庫、API 等多種數據源
- **引用溯源**: 回答附帶來源引用，可驗證可追溯

## 技術架構

- LangGraph 多 Agent 框架
- GPT-4 / Claude 3 大模型
- Qdrant / Weaviate 向量數據庫
- FastAPI 後端服務
- Next.js 14 前端介面

## 進階功能

- 自適應檢索策略
- 混合搜索 (語義 + 關鍵字)
- 多模態文檔處理
- 對話記憶管理',
  249,
  'RAG',
  'https://github.com/example/agentic-rag',
  'https://docs.example.com/agentic-rag',
  'https://demo.example.com/agentic-rag',
  'AgenticLabs',
  NULL,
  'approved',
  1150,
  4.9,
  203,
  NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567004',
  'sora-veo-video-generator',
  '無浮水印 Sora2/Veo3.1 視頻生成器',
  '整合 Sora 2 與 Veo 3.1 API 的視頻生成平台，無浮水印輸出、批量生成、風格控制。支援 4K 高清與多種比例。',
  '## 核心功能

- **雙引擎支援**: 整合 OpenAI Sora 2 與 Google Veo 3.1
- **無浮水印**: 乾淨輸出，可直接商用
- **批量生成**: 隊列管理，批量處理多個任務
- **風格控制**: 預設風格模板，自訂風格提示
- **多種比例**: 16:9、9:16、1:1 等多種輸出比例

## 技術架構

- Next.js 14 + TypeScript 前端
- Node.js + Bull Queue 任務隊列
- Sora 2 / Veo 3.1 API 整合
- Supabase 數據存儲
- S3 / R2 視頻存儲

## 輸出規格

- 最高 4K (2160p) 解析度
- 最長 60 秒視頻
- MP4 / WebM 格式
- 可選幀率 24/30/60 fps',
  399,
  'Video AI',
  'https://github.com/example/sora-veo-generator',
  'https://docs.example.com/sora-veo-generator',
  'https://demo.example.com/sora-veo-generator',
  'VideoGenPro',
  NULL,
  'approved',
  2100,
  4.7,
  312,
  NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567005',
  'chatgpt-saas-kit',
  'ChatGPT SaaS 完整套件',
  '基於 GPT-4 的完整 SaaS 解決方案，包含用戶認證、對話管理、Token 計費和管理後台。Next.js 14 + OpenAI API。',
  '## 核心功能

- **用戶認證**: 完整的註冊、登入、OAuth 整合
- **對話管理**: 多輪對話、對話歷史、上下文管理
- **Token 計費**: 精確計算使用量，支援訂閱制與按量計費
- **管理後台**: 用戶管理、數據統計、系統配置

## 技術架構

- Next.js 14 + TypeScript
- OpenAI GPT-4 API
- Supabase Auth + Database
- Stripe 支付整合
- Vercel 部署

## 包含內容

- 完整源代碼
- 部署文檔
- API 文檔
- 管理後台
- 終身更新',
  179,
  'LLM',
  'https://github.com/example/chatgpt-saas-kit',
  'https://docs.example.com/chatgpt-saas-kit',
  'https://demo.example.com/chatgpt-saas-kit',
  'ChatSaaS',
  NULL,
  'approved',
  1580,
  4.8,
  245,
  NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567006',
  'ai-image-generation-platform',
  'AI 圖像生成平台',
  '整合 DALL-E 3、Stable Diffusion XL、Midjourney API 的圖像生成平台。支援文生圖、圖生圖、風格轉換、局部重繪。',
  '## 核心功能

- **多模型支援**: DALL-E 3、Stable Diffusion XL、Midjourney
- **文生圖**: 根據文字描述生成圖像
- **圖生圖**: 基於參考圖像生成變體
- **風格轉換**: 將圖像轉換為不同藝術風格
- **局部重繪**: 選擇區域進行修改

## 技術架構

- Next.js 14 + TypeScript 前端
- FastAPI 後端 API 代理
- 多模型 API 整合
- Cloudflare R2 圖像存儲
- Redis 任務隊列

## 輸出規格

- 最高 4K 解析度
- PNG / JPG / WebP 格式
- 批量生成支援
- 歷史記錄管理',
  159,
  'Image AI',
  'https://github.com/example/ai-image-platform',
  'https://docs.example.com/ai-image-platform',
  'https://demo.example.com/ai-image-platform',
  'ImageGenAI',
  NULL,
  'approved',
  920,
  4.6,
  178,
  NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567007',
  'voice-assistant-kit',
  'AI 語音助手套件',
  '結合 Whisper 語音識別、GPT-4 對話、TTS 語音合成的完整語音助手。支援多語言、即時轉錄、情感分析。',
  '## 核心功能

- **語音識別**: OpenAI Whisper 高精度轉錄
- **智能對話**: GPT-4 自然語言理解與回應
- **語音合成**: 多種 TTS 引擎，自然人聲
- **多語言**: 支援中英日韓等多種語言
- **情感分析**: 識別語音中的情緒

## 技術架構

- Next.js 14 + TypeScript 前端
- OpenAI Whisper API
- GPT-4 對話引擎
- Azure / Google TTS
- WebSocket 即時通訊

## 應用場景

- 智能客服語音版
- 語音助手應用
- 會議轉錄
- 語音筆記',
  189,
  'Voice AI',
  'https://github.com/example/voice-assistant-kit',
  'https://docs.example.com/voice-assistant-kit',
  'https://demo.example.com/voice-assistant-kit',
  'VoiceAI',
  NULL,
  'approved',
  680,
  4.8,
  92,
  NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567008',
  'langchain-rag-template',
  'LangChain RAG 模板',
  '企業級 RAG 知識庫解決方案，支援 PDF、Word、網頁等多種格式。向量數據庫整合、智能問答、引用溯源。',
  '## 核心功能

- **多格式支援**: PDF、Word、Excel、網頁、Markdown
- **向量檢索**: Pinecone / Qdrant / Chroma 整合
- **智能問答**: 基於文檔的精準回答
- **引用溯源**: 答案附帶來源引用
- **權限控制**: 文檔級別的訪問控制

## 技術架構

- LangChain Python 框架
- GPT-4 / Claude 3 大模型
- Pinecone 向量數據庫
- FastAPI 後端服務
- Next.js 14 前端介面

## 進階功能

- 混合搜索策略
- 多輪對話支援
- 文檔版本管理
- 使用量統計',
  129,
  'RAG',
  'https://github.com/example/langchain-rag-template',
  'https://docs.example.com/langchain-rag-template',
  'https://demo.example.com/langchain-rag-template',
  'LangChainPro',
  NULL,
  'approved',
  1340,
  4.7,
  167,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  download_url = EXCLUDED.download_url,
  docs_url = EXCLUDED.docs_url,
  demo_url = EXCLUDED.demo_url,
  author_name = EXCLUDED.author_name,
  status = EXCLUDED.status,
  download_count = EXCLUDED.download_count,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = NOW();

-- Done! You should now have 8 AI projects in your database.
SELECT COUNT(*) as total_projects FROM projects;
