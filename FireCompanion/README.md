# FireCompanion — SwiftUI 原生版

FIRE 进度陪伴的 iOS/iPadOS/macOS 原生客户端。

## 系统要求

- iOS 17.0+ / macOS 14.0+
- Xcode 16.0+

## 打开项目

### 方法一：XcodeGen（推荐）

```bash
brew install xcodegen
cd FireCompanion
xcodegen generate
open FireCompanion.xcodeproj
```

### 方法二：手动创建

1. Xcode → File → New → Project → App
2. Product Name: `FireCompanion`
3. Interface: SwiftUI
4. Deployment Target: iOS 17.0
5. 把 `FireCompanion/` 目录下的所有 `.swift` 文件拖入项目

## 项目结构

```
FireCompanion/
├── FireCompanionApp.swift    # App 入口
├── Models/                   # 数据模型和计算逻辑
│   ├── Domain.swift          # Profile, FirePlan, Checkin 类型
│   ├── FireCalculator.swift  # FIRE 计算纯函数
│   └── InsightEngine.swift   # 洞察规则引擎
├── Services/
│   └── SupabaseService.swift # Supabase API 调用
├── ViewModels/
│   └── AppStore.swift        # @Observable 状态管理
├── Views/
│   ├── Login/                # 登录和快速计算器
│   ├── Dashboard/            # 总览、图表、里程碑
│   ├── Checkins/             # 签到表单和历史
│   ├── Insights/             # 洞察卡片
│   └── Settings/             # 设置页面
└── Utilities/
    ├── Dictionaries.swift    # 中英双语字典
    └── Formatters.swift      # 金额、百分比、日期格式化
```

## 功能

- 中英双语切换
- CNY/USD 币种切换
- FIRE 快速计算器
- Dashboard（资产趋势图、进度环、里程碑）
- Check-in 记录和历史
- 规则驱动的趋势洞察
- 设置和演示数据重置
- Supabase 后端支持（配置环境变量后启用）

## 配置 Supabase

在 Xcode 中设置环境变量：
- `SUPABASE_URL`：你的 Supabase 项目 URL
- `SUPABASE_KEY`：你的 Supabase anon key
