# 今日运势 - 项目文档

> 一个基于 React + TypeScript + Vite 构建的现代化星座运势 Web 应用

**创建时间**: 2026-02-04  
**版本**: v1.0.0  
**技术栈**: React 19 + TypeScript + Vite + TailwindCSS

---

## 📋 项目概述

**今日运势**是一个精美的星座运势查询应用，用户可以选择自己的星座，查看每日运势、星座配对、幸运建议等功能。

### 核心特性

- ✨ **12星座完整支持** - 覆盖所有黄道十二宫星座
- 🎯 **多维度运势分析** - 爱情、事业、健康、财富四大维度
- 💫 **星座配对系统** - 探索不同星座间的宇宙契合度
- 🎨 **精美动效设计** - 流畅的 GSAP 动画和粒子背景
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 💾 **本地存储** - 自动记住用户选择的星座
- 🌊 **平滑滚动** - 基于 Lenis 的丝滑滚动体验

---

## 🏗️ 项目结构

```
jiniriyunshi/
├── public/                    # 静态资源
├── src/
│   ├── components/
│   │   └── ui/               # shadcn/ui 组件库 (53个组件)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── progress.tsx
│   │       ├── select.tsx
│   │       ├── tabs.tsx
│   │       └── ... (更多UI组件)
│   ├── sections/             # 页面区块组件
│   │   ├── Hero.tsx          # 首页Hero区域 (粒子动画背景)
│   │   ├── Navbar.tsx        # 导航栏
│   │   ├── ZodiacGrid.tsx    # 星座选择网格
│   │   ├── HoroscopeDisplay.tsx  # 运势详情展示
│   │   ├── Compatibility.tsx     # 星座配对
│   │   ├── DailyQuote.tsx        # 每日金句
│   │   └── Footer.tsx            # 页脚
│   ├── data/
│   │   └── zodiac.ts         # 星座数据、运势生成算法
│   ├── hooks/
│   │   ├── useLenis.ts       # 平滑滚动hook
│   │   └── use-mobile.ts     # 移动端检测hook
│   ├── types/
│   │   └── index.ts          # TypeScript类型定义
│   ├── lib/
│   │   └── utils.ts          # 工具函数
│   ├── App.tsx               # 主应用组件
│   ├── App.css               # 应用样式
│   ├── index.css             # 全局样式、动画定义
│   └── main.tsx              # 应用入口
├── dist/                     # 构建输出目录
├── index.html                # HTML模板
├── package.json              # 项目配置
├── tailwind.config.js        # TailwindCSS配置
├── tsconfig.json             # TypeScript配置
├── vite.config.ts            # Vite构建配置
└── components.json           # shadcn/ui配置
```

---

## 🛠️ 技术栈详解

### 核心框架与工具

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 19.2.0 | UI框架 |
| **TypeScript** | 5.9.3 | 类型系统 |
| **Vite** | 7.2.4 | 构建工具 |
| **TailwindCSS** | 3.4.19 | CSS框架 |

### UI 组件库

- **Radix UI** - 无样式、可访问的组件原语
  - 包含 20+ Radix组件（Dialog、Dropdown、Select、Tabs等）
- **shadcn/ui** - 基于Radix UI的精美组件集合
  - 53个预构建组件
- **Lucide React** - 图标库 (v0.562.0)

### 动画与交互

- **GSAP** (3.14.2) - 高性能动画引擎
  - Hero 标题渐入动画
  - 按钮弹性缩放
- **Lenis** (1.0.42) - 平滑滚动库
  - 提供类似原生的丝滑滚动体验
- **Canvas粒子系统** - 自定义实现
  - 流体背景动画
  - 鼠标交互效果

### 数据管理

- **React Hook Form** (7.70.0) - 表单处理
- **Zod** (4.3.5) - 运行时类型校验
- **LocalStorage** - 星座选择持久化

### 样式系统

- **class-variance-authority** - 组件变体管理
- **clsx** + **tailwind-merge** - 类名合并工具
- **next-themes** - 主题系统（未来支持暗色模式）
- **tailwindcss-animate** - TailwindCSS动画扩展

### 自定义动画

```css
/* index.css 中定义的动画 */
@keyframes float          /* 浮动效果 4s循环 */
@keyframes pulse-soft     /* 柔和脉冲 3s循环 */
@keyframes shimmer        /* 光泽闪烁 2s */
@keyframes rotate-slow    /* 慢速旋转 30s */
@keyframes gradient-shift /* 渐变移动 8s */
```

---

## 📊 数据模型

### ZodiacSign - 星座数据

```typescript
interface ZodiacSign {
  id: string;           // 唯一标识符 (e.g., 'aries')
  name: string;         // 中文名称 (e.g., '白羊座')
  dateRange: string;    // 日期范围 (e.g., '3.21 - 4.19')
  element: 'fire' | 'earth' | 'air' | 'water';  // 四象元素
  icon: string;         // Unicode图标 (e.g., '♈')
}
```

**12星座数据**:
- 白羊座 ♈ (3.21-4.19) - 火象
- 金牛座 ♉ (4.20-5.20) - 土象
- 双子座 ♊ (5.21-6.21) - 风象
- 巨蟹座 ♋ (6.22-7.22) - 水象
- 狮子座 ♌ (7.23-8.22) - 火象
- 处女座 ♍ (8.23-9.22) - 土象
- 天秤座 ♎ (9.23-10.23) - 风象
- 天蝎座 ♏ (10.24-11.22) - 水象
- 射手座 ♐ (11.23-12.21) - 火象
- 摩羯座 ♑ (12.22-1.19) - 土象
- 水瓶座 ♒ (1.20-2.18) - 风象
- 双鱼座 ♓ (2.19-3.20) - 水象

### HoroscopeData - 运势数据

```typescript
interface HoroscopeData {
  overall: number;      // 综合运势 (70-100)
  love: number;         // 爱情运势 (60-100)
  career: number;       // 事业运势 (60-100)
  health: number;       // 健康运势 (60-100)
  wealth: number;       // 财富运势 (60-100)
  luckyColor: string;   // 幸运颜色
  luckyNumber: number;  // 幸运数字 (1-9)
  luckyTime: string;    // 幸运时段
  description: string;  // 运势描述
  advice: string;       // 今日建议
}
```

### CompatibilityResult - 配对结果

```typescript
interface CompatibilityResult {
  score: number;        // 配对分数 (60-100)
  description: string;  // 配对描述
  tags: string[];       // 关系标签
}
```

**可能的标签**: 灵魂伴侣、欢喜冤家、最佳拍档、互相成长、需要磨合、默契十足、激情四射、细水长流

---

## 🎯 核心功能实现

### 1. 运势生成算法

**文件**: `src/data/zodiac.ts` - `generateHoroscope()`

**算法特点**:
- ✅ **确定性随机** - 基于日期和星座ID生成种子
- ✅ **每日更新** - 同一天同一星座获得相同结果
- ✅ **个性化描述** - 每个星座有3条专属描述

```typescript
const seed = date.getDate() + date.getMonth() * 31 + signId.charCodeAt(0);
const pseudoRandom = (n: number) => {
  const x = Math.sin(seed * n) * 10000;
  return x - Math.floor(x);
};
```

**运势分数范围**:
- 综合运势: 70-100
- 分项运势: 60-100

### 2. 星座配对算法

**文件**: `src/data/zodiac.ts` - `calculateCompatibility()`

- 基于两个星座ID计算配对种子
- 配对分数: 60-100
- 随机选择2-3个关系标签
- 提供配对描述（5种可能）

### 3. Hero粒子动画

**文件**: `src/sections/Hero.tsx`

**技术实现**:
- Canvas 2D渲染
- 15个随机粒子
- 鼠标交互吸引效果
- 帧率限制（30fps）减少CPU占用
- 粒子环绕边界处理

```typescript
// 粒子属性
{
  x, y,           // 位置
  vx, vy,         // 速度
  radius,         // 半径 60-180px
  color           // 暖色系（金色/米色/绿色）
}
```

### 4. 平滑滚动

**文件**: `src/hooks/useLenis.ts`

- Lenis库集成
- 全局滚动增强
- 锚点平滑跳转

### 5. 本地存储

**实现位置**: `src/App.tsx`

```typescript
// 保存选择
localStorage.setItem('selectedZodiacSign', sign.id);

// 读取缓存
const savedSignId = localStorage.getItem('selectedZodiacSign');
```

---

## 🎨 设计系统

### 配色方案

```css
/* 主色调 - 温暖大地色系 */
--gold: #d4a373      /* 金色 - 主色 */
--cream: #faedcd     /* 米色 - 背景 */
--sage: #ccd5ae      /* 鼠尾草绿 */
--lime: #e9edc9      /* 淡黄绿 */
--dark: #212121      /* 深灰 - 文字 */
```

**四象元素渐变**:
- 🔥 火象: `from-orange-400 to-red-500`
- 🌍 土象: `from-emerald-400 to-green-600`
- 💨 风象: `from-sky-400 to-blue-500`
- 💧 水象: `from-cyan-400 to-blue-600`

### 字体系统

- **主字体**: Noto Sans SC (思源黑体)
- **权重**: 400 (常规) / 500 (中等) / 600 (半粗) / 700 (粗) / 800 (特粗)
- **来源**: Google Fonts

### 圆角规范

- 卡片: `rounded-2xl` (16px)
- 按钮: `rounded-full` (完全圆角)
- 标签: `rounded-full`

### 阴影层级

```css
shadow-lg    /* 卡片悬停 */
shadow-xl    /* 选中状态 */
```

---

## 📱 响应式设计

### 断点系统 (Tailwind CSS)

```
sm:  640px   /* 手机横屏 */
md:  768px   /* 平板 */
lg:  1024px  /* 小桌面 */
xl:  1280px  /* 大桌面 */
2xl: 1536px  /* 超宽屏 */
```

### 网格布局适配

**星座网格**:
```
默认: 2列  (手机竖屏)
sm:   3列  (手机横屏/小平板)
md:   4列  (平板)
lg:   6列  (桌面)
```

### 字体大小适配

```typescript
// Hero 标题
text-4xl sm:text-5xl md:text-6xl lg:text-7xl
// 36px → 48px → 60px → 72px
```

---

## 🚀 开发指南

### 环境准备

```bash
# Node.js 要求
Node.js >= 18.0.0
npm >= 9.0.0
```

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev

# 输出
# ➜  Local:   http://localhost:5174/
```

### 构建生产版本

```bash
npm run build

# 输出到 dist/ 目录
```

### 预览构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

---

## 📦 依赖清单

### 生产依赖 (核心功能)

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "gsap": "^3.14.2",
  "@studio-freight/lenis": "^1.0.42",
  "lucide-react": "^0.562.0"
}
```

### UI组件库 (20+依赖)

```json
{
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-progress": "^1.1.8"
  // ... 更多 Radix 组件
}
```

### 开发依赖

```json
{
  "vite": "^7.2.4",
  "typescript": "~5.9.3",
  "@vitejs/plugin-react": "^5.1.1",
  "tailwindcss": "^3.4.19",
  "autoprefixer": "^10.4.23"
}
```

---

## 🔧 配置文件

### Vite配置 (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### TailwindCSS配置 (`tailwind.config.js`)

- **内容扫描**: `./index.html`, `./src/**/*.{ts,tsx}`
- **主题扩展**: 自定义动画、颜色
- **插件**: tailwindcss-animate

### TypeScript配置

- **严格模式**: 启用
- **目标**: ES2020
- **JSX**: react-jsx
- **路径别名**: `@/*` → `./src/*`

---

## 🌟 特色亮点

### 1. 动画设计
- ✅ Hero区域GSAP动画（标题3D旋转、按钮弹性）
- ✅ 星座卡片交错渐入（50ms延迟）
- ✅ Canvas粒子流体背景
- ✅ 平滑滚动体验

### 2. 交互细节
- ✅ 卡片悬停上浮效果
- ✅ 选中星座脉冲边框
- ✅ 自动滚动到运势区域
- ✅ 元素标签渐显

### 3. 性能优化
- ✅ 粒子动画帧率限制（30fps）
- ✅ IntersectionObserver懒加载
- ✅ React 19并发特性
- ✅ Vite快速热重载

### 4. 用户体验
- ✅ LocalStorage记忆用户选择
- ✅ 响应式适配所有设备
- ✅ 无障碍设计（Radix UI）
- ✅ 自定义滚动条样式

---

## 🎯 未来迭代方向

### 功能增强
- [ ] 暗色模式支持（已集成next-themes）
- [ ] 用户账号系统
- [ ] 运势历史记录
- [ ] 社交分享优化
- [ ] 多语言支持

### 数据优化
- [ ] 接入真实星座API
- [ ] 更详细的运势解读
- [ ] 周运势/月运势
- [ ] 星座知识库

### 交互升级
- [ ] 星座3D模型展示
- [ ] 更多粒子效果
- [ ] 音效反馈
- [ ] 微信小程序版本

### 性能优化
- [ ] 图片懒加载
- [ ] Service Worker缓存
- [ ] CDN部署
- [ ] 代码分割优化

---

## 📝 开发日志

### v1.0.0 (2026-02-04)

**初始版本发布**

**功能清单**:
- ✅ 12星座完整支持
- ✅ 运势生成算法
- ✅ 星座配对系统
- ✅ 每日金句
- ✅ 响应式布局
- ✅ 粒子动画背景
- ✅ 平滑滚动
- ✅ 本地存储

**技术栈**:
- React 19 + TypeScript
- Vite 7 + TailwindCSS 3
- GSAP + Lenis
- Radix UI + shadcn/ui

---

## 📄 许可证

本项目仅供学习和参考使用。

---

**文档生成时间**: 2026-02-04 23:39  
**文档版本**: v1.0.0  
**最后更新**: 2026-02-04
