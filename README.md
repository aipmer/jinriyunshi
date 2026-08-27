# 今日运势 · Daily Horoscope

> ## ⚠️ 原站点已下线
>
> `jinriyunshi.info` 域名不再续费，站点已停止运营。
>
> **星座运势能力已迁入「黄历查查」，继续访问 → <https://laohuangli.info/xingzuo/>**
>
> 原作者不再投入新功能开发，但**本仓库保持开放**：
> 欢迎 fork、提 issue 和 PR，也欢迎有兴趣的开发者接手继续维护。

一个十二星座运势站：每日 / 每周 / 每月运势、星座性格档案、星座配对。
全站静态生成，构建产出 11,130 个页面。

## 技术栈

- **Astro 6** — 静态站点生成，文件式路由
- **React 19** — 交互区域（星座选择、配对、分享图、签到连击）
- **Tailwind CSS 4** — 样式
- **TypeScript**

无后端、无数据库、无第三方运势 API。所有内容由本地引擎生成。

## 核心设计：确定性运势引擎

这是本项目唯一值得一读的部分，全部在 [`src/data/zodiac.ts`](src/data/zodiac.ts)。

运势内容不调用任何 API，也不随机抽取——而是把「星座 + 完整日期 + 内容周期」
折叠成一个确定性种子，再用该种子驱动一条可复现的伪随机序列：

```
hashString(`${signId}|${period}|${periodKey(date, period)}|v3`)
        ↓
seededRandom(seed)          // mulberry32 变体，纯函数
        ↓
从「按四象分库」的词库中选取主题 / 四维解读 / 建议 / 幸运元素
```

由此得到几个刻意的性质：

- **同输入同输出**：同一星座在同一天刷新多少次，结果都一样。不会出现「刷到满意为止」。
- **无需存储**：不落库、不缓存，任何时刻都能重新算出任意日期的结果。
- **跨端一致**：服务端渲染和客户端计算走同一函数，结果必然相同。
- **横向有差异**：种子含星座 id 与四象属性，同一天不同星座读起来确实不同——
  词库按火/土/风/水分库，四维解读按「元素 × 维度 × 档位」铺到 144 条，
  就是为了压掉「所有星座今天都差不多」的塑料感。

配对结果 (`calculateCompatibility`) 同理，且对星座对做了规范化排序，
保证 A×B 与 B×A 落在同一个 canonical URL 上。

## 本地运行

```bash
pnpm install
pnpm dev
```

构建与内容引擎自检：

```bash
pnpm build        # 输出 11,130 个静态页面
pnpm test:engine  # 校验确定性、星座间无碰撞、跨年/跨周期差异、配对对称性
```

`astro.config.mjs` 顶部的 `SITE` 常量是站点域名占位符（默认 `https://example.com`）。
全站 canonical 与 og:image 都由它派生，fork 后改这一处即可。

## 目录结构

```
src/
├── data/zodiac.ts     # 运势引擎 + 全部文案词库
├── pages/             # 路由：首页 / 星座页 / 日周月运势 / 配对
├── components/        # React 交互组件
├── sections/          # 页面区块
├── layouts/           # Astro 布局
└── lib/               # 本地档案、签到连击、埋点封装
scripts/
├── gen-icons.mjs      # 品牌图标与 og-image 生成（需 Chromium）
└── verify-engine.ts   # 内容引擎自检
```

## 关于本仓库

相对原生产版本，开源前做了以下清理（也让 fork 后可以直接跑起来）：

- 移除全部分析埋点（GA4 / Cloudflare / 百度统计）与站长验证文件
- 移除跨站导航组件与 301 迁移配置
- 站点域名改为占位常量

其余代码与文案保持原样。
（`public/og-image.png` 是历史产物，图中仍有旧域名字样；如需替换可跑
`node scripts/gen-icons.mjs` 重新生成，需本机有 Chromium。）

## License

**双许可，边界明确：**

- **代码** — [MIT](LICENSE)。包括运势引擎本身、组件、布局、构建脚本与配置。
- **文案内容** — [CC BY-NC-SA 4.0](CONTENT-LICENSE)。仅指 `src/data/zodiac.ts`
  中的中文词库（`themesByElement`、`summaries`、`actionsByElement`、
  `cautionsByElement`、`dimensionCopy`、`personalityProfiles`）。

简单说：引擎随便用；**手写的中文文案不要拿去做商业站**。
详见 [CONTENT-LICENSE](CONTENT-LICENSE)。
