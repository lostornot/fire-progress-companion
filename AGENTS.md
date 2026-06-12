# AGENTS.md

## 项目目标

FIRE 进度陪伴 — Web 端 FIRE 进度追踪应用，支持真实用户账号、数据持久化、中英双语界面。

**当前状态**：Supabase 后端已集成，Google OAuth 登录已可用。缺少 Supabase 环境变量时自动降级为演示模式。

## 技术栈

- Next.js App Router (v16)
- TypeScript
- Tailwind CSS
- Recharts
- Zustand
- Zod
- Vitest
- Supabase（Auth + PostgreSQL + 行级安全策略）

## 安装和运行命令

```bash
npm install
npm run dev          # 启动开发服务器，端口 3000
npm run lint         # eslint 检查
npm run test         # vitest 单元测试
npm run build        # next build 生产构建
```

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
- `src/components/` — 共享外壳、语言/币种切换器
- `src/features/fire/` — FIRE 计算逻辑和展示组件
- `src/features/checkins/` — 签到表单、历史记录、Schema、辅助函数
- `src/features/insights/` — 洞察规则引擎和卡片组件
- `src/features/settings/` — 设置表单
- `src/lib/i18n/` — 中英双语字典
- `src/lib/supabase/` — Supabase 客户端和 API 层
- `src/lib/` — 格式化工具、存储辅助函数
- `src/mock/` — 演示数据（遗留，仍用作种子数据）
- `src/store/` — Zustand 应用状态（双模式：supabase + demo）
- `src/types/` — 领域类型和数据库类型
- `supabase/migrations/` — SQL 建表脚本

## 代码规范

- 业务逻辑保持为纯函数
- **所有 UI 文案必须通过 `src/lib/i18n/dictionaries.ts`** — 组件中不得硬编码字符串
- 演示数据备注使用字典键名（如 `"noteSteady"`）— 展示层负责翻译
- 金额显示统一使用 `formatCurrency`，不得使用原生 `toLocaleString()`
- 偏好小而聚焦的文件，避免大杂烩式工具文件
- Store 对 Supabase 模块使用动态 `import()` — 保持演示模式轻量

## 架构：双模式 Store

Zustand Store（`src/store/app-store.ts`）运行在两种模式下：

1. **Supabase 模式** — 当 `NEXT_PUBLIC_SUPABASE_URL` 已设置且不包含 "your-supabase" 时启用。使用真实认证和数据库。
2. **演示模式** — 环境变量缺失时的降级方案。使用 localStorage。

通过 Store 文件顶部的 `isSupabaseConfigured` 常量自动检测。

## 数据库结构

三张表，均启用行级安全策略：
- `profiles` — 用户资料（注册时通过触发器自动创建）
- `fire_plans` — 每个用户的 FIRE 计划
- `checkins` — 关联计划和用户的签到记录

建表脚本：`supabase/migrations/001_initial_schema.sql`

## 已知坑点

- **npm 不允许中文项目名** — `package.json` 用英文名，脚手架创建后再改文件夹名
- **开发服务器会被 bash 超时杀掉** — 使用 `nohup npx next dev -p 3000 > /tmp/fire-dev.log 2>&1 &` 保持运行
- **Next.js 16 废弃了 `middleware.ts`** — 使用 `proxy.ts` 约定或直接删除 middleware；旧约定会导致 404
- **Supabase key 名称不同** — 项目使用 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`（非 `ANON_KEY`）；代码通过 fallback 兼容两者
- **Supabase CLI TLS 超时** — 代理/VPN 环境下 `supabase db push` 可能失败；改用 Management API `POST /v1/projects/{ref}/database/query`
- **演示数据备注必须是字典键名** — 硬编码的英文备注无法翻译
- **`buildInsights()` 需要 `language` 参数** — 洞察文案也必须双语
- **退出按钮必须判断 `session`** — 未登录时不显示

## 交付检查清单

- `npm run lint` — 0 错误
- `npm run test` — 所有单元测试通过
- `npm run build` — 构建成功，所有路由生成
- 验证每个页面的中英文切换（ZH/EN）
- 验证两种币种模式（CNY/USD）
- 验证 Google 登录完整流程
- 验证签到数据保存到 Supabase 并跨会话持久化
- 验证未登录时不显示退出按钮
- 验证无环境变量时演示模式正常工作

## Supabase Management API

CLI 失败时（代理环境 TLS 问题）的替代方案：

```bash
# 执行 SQL
curl -s -X POST "https://api.supabase.com/v1/projects/vkfnzfliloqoachrmoxz/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL\"}"

# 更新认证配置（启用提供商、设置 URL）
curl -s -X PATCH "https://api.supabase.com/v1/projects/vkfnzfliloqoachrmoxz/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## 可复用方法

本项目中发现的可复用模式：

- **Next.js + Zustand 双模式模式**：Store 自动检测环境变量，降级到 localStorage。适用于需要同时支持离线演示和在线真实后端的应用。
- **字典键名驱动的双语演示数据**：数据中存储键名，展示层翻译。避免为每种语言重复维护种子数据。
- **Supabase Management API 替代 CLI**：当 `supabase db push` 因网络问题失败时，可直接用 REST API 执行 SQL。
