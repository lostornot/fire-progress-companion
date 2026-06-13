# AGENTS.md

## 项目目标

FIRE 进度陪伴 — Web 端 FIRE 进度追踪应用，支持真实用户账号、数据持久化、中英双语界面。

**当前状态**：已部署到 Vercel，Google OAuth 登录可用，Supabase 后端集成完成。

## 技术栈

- Next.js App Router (v16)
- TypeScript
- Tailwind CSS
- Recharts
- Zustand
- Zod
- Vitest + Playwright
- Supabase（Auth + PostgreSQL + 行级安全策略）
- Vercel（部署 + CI/CD）

## 安装和运行命令

```bash
npm install
npm run dev          # 启动开发服务器，端口 3000
npm run lint         # eslint 检查
npm run test         # vitest 单元测试（54 个）
npm run build        # next build 生产构建
npx playwright test  # E2E 测试（需要 dev server）
```

## 部署

- **线上地址**：https://fire-progress-companion.vercel.app
- **GitHub**：https://github.com/lostornot/fire-progress-companion
- **自动部署**：push 到 `main` 分支自动触发 Vercel 构建
- **手动部署**：`vercel --yes --prod`

### 部署命令

```bash
vercel login                    # 首次需要登录
vercel --yes --prod             # 手动部署
vercel git connect <repo-url>   # 关联 GitHub 仓库（已配置）
```

### Vercel 环境变量

在 Vercel Dashboard 或 CLI 中设置：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 环境变量

```bash
# .env.local（已 gitignore）
NEXT_PUBLIC_SUPABASE_URL=https://vkfnzfliloqoachrmoxz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Supabase 项目 ref：`vkfnzfliloqoachrmoxz`

## 目录指南

- `src/app/` — Next.js 页面路由
- `src/app/auth/callback/` — OAuth 回调路由
- `src/components/` — 共享外壳、语言/币种切换器、SmartCurrencyInput
- `src/features/fire/` — FIRE 计算逻辑和展示组件
- `src/features/checkins/` — 签到表单、历史记录、Schema、辅助函数
- `src/features/insights/` — 洞察规则引擎和卡片组件
- `src/features/settings/` — 设置表单
- `src/lib/i18n/` — 中英双语字典（55 个键，zh/en 完全对齐）
- `src/lib/supabase/` — Supabase 客户端和 API 层
- `src/lib/` — 格式化工具
- `src/mock/` — 演示种子数据
- `src/store/` — Zustand 应用状态（双模式：supabase + demo）
- `src/types/` — 领域类型和数据库类型
- `supabase/migrations/` — SQL 建表脚本
- `tests/e2e/` — Playwright E2E 测试

## 代码规范

- 业务逻辑保持为纯函数
- **所有 UI 文案必须通过 `src/lib/i18n/dictionaries.ts`** — 组件中不得硬编码字符串
- 演示数据备注使用字典键名（如 `"noteSteady"`）— 展示层负责翻译
- 金额显示统一使用 `formatCurrency`，不得使用原生 `toLocaleString()`
- **大额数字输入使用 SmartCurrencyInput** — 100万+步进10万，10万+步进1万
- 偏好小而聚焦的文件，避免大杂烩式工具文件
- Store 对 Supabase 模块使用动态 `import()` — 保持演示模式轻量

## 架构：双模式 Store

Zustand Store（`src/store/app-store.ts`）运行在两种模式下：

1. **Supabase 模式** — 当 `NEXT_PUBLIC_SUPABASE_URL` 已设置且不包含 `"your-supabase"` 时启用
2. **演示模式** — 环境变量缺失时的降级方案，使用 localStorage

通过 Store 文件顶部的 `isSupabaseConfigured` 常量自动检测。

**注意**：Supabase URL 哨兵字符串必须统一为 `"your-supabase"`（全小写），login 页面和 store 必须一致。

## 数据库结构

三张表，均启用行级安全策略：
- `profiles` — 用户资料（注册时通过触发器自动创建）
- `fire_plans` — 每个用户的 FIRE 计划
- `checkins` — 关联计划和用户的签到记录

建表脚本：`supabase/migrations/001_initial_schema.sql`

## E2E 测试

Playwright 配置要点：
- **必须清除 Supabase 环境变量**确保 demo 模式：`NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=`
- 使用 `reuseExistingServer: false` 确保干净状态
- 选择器用 `exact: true` 避免 Next.js Dev Tools 按钮冲突
- 登录按钮用 `locator("button", { hasText: /Google/ })` 匹配（含 SVG 图标）
- 退出按钮用 `getByRole("main").getByRole("button", { name: "退出登录" })` 避免与 header 按钮冲突
- Vitest 配置必须 `exclude: ["tests/e2e/**"]` 避免加载 Playwright 文件

## 已知坑点

### 通用
- **npm 不允许中文项目名** — `package.json` 用英文名
- **开发服务器会被 bash 超时杀掉** — 使用 `nohup npx next dev -p 3000 > /tmp/fire-dev.log 2>&1 &`
- **vitest 和 @vitest/coverage-v8 版本必须对齐** — 否则 Vercel 构建失败；添加 `.npmrc` 的 `legacy-peer-deps=true`

### Next.js 16
- **废弃 `middleware.ts`** — 直接删除，不用 proxy.ts；旧约定会导致 404
- **`router.push` 不能在渲染期间调用** — 必须放在 `useEffect` 中

### Supabase
- **key 名称不同** — 项目使用 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`（非 `ANON_KEY`）；代码通过 fallback 兼容
- **Supabase CLI TLS 超时** — 代理/VPN 环境下用 Management API 替代
- **URL 哨兵必须统一为 `"your-supabase"`** — store 和 login 页面要一致

### 数据处理
- **`JSON.parse` 必须包裹 try-catch** — localStorage 数据可能损坏
- **`buildInsights()` 必须检查 checkins 数量** — 0/1 条时 `previous` 为 undefined
- **演示数据备注必须是字典键名** — 硬编码的英文备注无法翻译
- **checkin 表单默认日期应为今天** — 使用 `new Date().toISOString().slice(0, 10)`

### UI/UX
- **大额数字输入用 SmartCurrencyInput** — 不要用原生 input[type=number]
- **所有 UI 文案必须走字典** — 包括 Loading、退出按钮、状态提示
- **退出按钮必须判断 `session`** — 未登录时不显示
- **CSS 动画用 staggered delay** — 通过 `--delay` CSS 变量实现交错效果

## 交付检查清单

- `npm run lint` — 0 错误
- `npm run test` — 54 个单元测试通过
- `npx playwright test` — 8 个 E2E 测试通过
- `npm run build` — 构建成功
- 验证中英文切换、币种切换
- 验证 Google 登录和数据持久化
- 验证智能数字步进
- 验证动画效果

## Supabase Management API

CLI 失败时的替代方案：

```bash
# 执行 SQL
curl -s -X POST "https://api.supabase.com/v1/projects/vkfnzfliloqoachrmoxz/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL\"}"

# 更新认证配置
curl -s -X PATCH "https://api.supabase.com/v1/projects/vkfnzfliloqoachrmoxz/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## SwiftUI 原生版

位于 `FireCompanion/` 目录，已知问题：
- 嵌套 NavigationStack（SettingsView 内部不应再包 NavigationStack）
- SupabaseAPI 是死代码（从未被调用）
- 无数据持久化（demo 数据重启丢失）
- Dictionaries 需要与 Web 端同步

## 可复用方法

- **Next.js + Zustand 双模式模式**：Store 自动检测环境变量，降级到 localStorage
- **字典键名驱动的双语演示数据**：数据中存储键名，展示层翻译
- **SmartCurrencyInput 模式**：大额数字智能步进，100万+步进10万
- **Supabase Management API 替代 CLI**：REST API 执行 SQL
- **Playwright demo 模式**：清除环境变量强制 demo 模式，避免真实 OAuth
- **Vercel + GitHub 自动部署**：`vercel git connect` 关联后 push 自动构建
