# 复盘大师 (ReviewMaster)

> 专业A股交易复盘工具 - 记录、复盘、提升

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue)

## 功能特性

- 📊 **仪表盘** - 总资产、胜率、盈亏比、最大回撤一目了然
- 📝 **交易日志** - 记录每笔交易，按日期分组浏览
- 🔄 **7步复盘** - 引导式复盘流程，深度反思交易决策
- 📈 **统计分析** - 胜率图、错误库TOP榜、持仓热力图
- 📏 **规则管理** - 建立交易纪律，自动检测违规
- 🔐 **用户认证** - 安全的登录注册，数据隔离

## 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript
- **样式**: TailwindCSS 4
- **后端**: Supabase (PostgreSQL + Auth + Storage)
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/review-master.git
cd review-master
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入您的 Supabase 配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 4. 初始化数据库

在 Supabase Dashboard 的 SQL Editor 中执行 `supabase/init.sql`

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 方式一：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/review-master)

### 方式二：CLI 部署

```bash
npm i -g vercel
vercel
```

### 环境变量配置

在 Vercel 项目设置中添加：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 项目结构

```
src/
├── app/
│   ├── (auth)/           # 登录/注册
│   ├── (main)/           # 主应用页面
│   └── layout.tsx
├── components/
│   ├── ui/               # 基础组件
│   └── layout/           # 布局组件
├── lib/
│   ├── supabase/         # Supabase 配置
│   └── hooks/            # 数据 Hooks
└── types/                # TypeScript 类型
```

## 开发计划

- [x] 用户认证
- [x] 交易记录 CRUD
- [x] 7步复盘流程
- [x] 统计分析
- [x] 规则管理
- [ ] 数据导入（CSV）
- [ ] AI 复盘建议
- [ ] 深色/浅色主题

## 许可证

MIT
