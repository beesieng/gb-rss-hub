# RSSHub 项目开发手册

## 项目概述

RSSHub 是世界上最大的 RSS 网络，由超过 5000 个全球实例组成。它从各种来源聚合内容，并通过开源社区维护新路由、新功能和错误修复。

RSSHub 的核心功能是：

- 从各种网站和服务生成 RSS 订阅源
- 支持超过 1000 个不同的路由
- 提供 RESTful API 接口
- 支持多种部署方式（Docker、Cloudflare Workers 等）

## 技术栈

- **后端框架**: Hono (轻量级 Web 框架)
- **编程语言**: TypeScript
- **HTML 解析**: Cheerio
- **HTTP 客户端**: ofetch
- **测试框架**: Vitest
- **构建工具**: tsdown, tsx
- **代码质量**: ESLint, Prettier

## 安装和设置

### 系统要求

- Node.js 18+
- pnpm 或 npm

### 克隆项目

```bash
git clone https://github.com/DIYgod/RSSHub.git
cd RSSHub
```

### 安装依赖

```bash
pnpm install
```

### 环境配置

创建 `.env` 文件（可选）：

```env
NODE_ENV=development
PORT=1200
```

## 项目结构

```
lib/
├── api/              # API 路由定义
├── middleware/       # 中间件
├── routes/           # RSS 路由实现
├── utils/            # 工具函数
├── config.ts         # 配置文件
├── app.ts            # 主应用
├── index.ts          # 入口文件
└── types.ts          # 类型定义

scripts/
├── workflow/         # 构建脚本
├── docker/           # Docker 相关
└── docs-scraper/     # 文档抓取

assets/               # 静态资源
public/               # 公共文件
```

### 核心模块说明

- **routes/**: 每个子目录对应一个网站的 RSS 路由实现
- **middleware/**: 请求处理中间件，包括缓存、错误处理等
- **utils/**: 通用工具函数，如日期解析、缓存等
- **api/**: REST API 接口定义

## 开发环境

### 启动开发服务器

```bash
pnpm run dev
```

服务器将在 `http://localhost:1200` 启动，支持热重载。

### 生产模式开发

```bash
pnpm run dev:cache
```

### 代码格式化和检查

```bash
# 格式化代码
pnpm run format

# 检查格式
pnpm run format:check

# 代码检查
pnpm run lint
```

## 构建和运行

### 构建项目

```bash
# 完整构建
pnpm run build

# 构建库文件
pnpm run build:lib

# 构建文档
pnpm run build:docs
```

### 运行生产版本

```bash
pnpm run start
```

## 测试

### 运行测试

```bash
# 运行所有测试
pnpm run test

# 运行测试（无覆盖率）
pnpm run vitest

# 运行路由完整测试
pnpm run vitest:fullroutes

# 监听模式测试
pnpm run vitest:watch
```

### 测试配置

测试使用 Vitest，配置在 `vitest.config.ts` 中：

- 测试超时时间：10秒
- 覆盖率排除路由文件
- 设置文件：`lib/setup.test.ts`

## 路由开发

### 创建新路由

1. 在 `lib/routes/` 下创建新的目录
2. 创建 `namespace.ts` 定义路由元信息
3. 创建路由文件实现 RSS 生成逻辑

### 路由结构示例

```typescript
// namespace.ts
export default {
    name: '示例网站',
    url: 'example.com',
    categories: ['other'],
    description: '示例网站 RSS 订阅',
};

// index.ts
export default async (ctx) => {
    const { id } = ctx.req.param();

    // 获取数据
    const data = await fetchData(id);

    // 返回 RSS 格式
    return {
        title: '示例标题',
        link: `https://example.com/${id}`,
        item: data.map((item) => ({
            title: item.title,
            description: item.content,
            link: item.url,
            pubDate: item.date,
        })),
    };
};
```

## 代码规范

### 命名约定

- 使用 `camelCase` 命名变量和函数
- 避免使用 `snake_case`

### 导入排序

- 使用 `import type` 导入类型
- 保持导入语句排序

### 代码风格

- 使用模板字面量时避免不必要的用法
- 简化条件赋值，使用 `||` 或 `??` 操作符

### 数据处理

- 总是缓存循环中的文章详情获取：`cache.tryGet()`
- 描述字段仅包含文章主要内容，不包含标题、作者等
- 使用 `parseDate` 工具函数处理日期

### API 调用

- 优先使用网站 API 而非 HTML 抓取
- 使用 RSSHub 内置 User-Agent：`config.trueUA`

## 贡献指南

### 路由配置规范

1. **示例格式**: 以 `/` 开头的工作路由路径
2. **路由名称**: 不重复命名空间名称
3. **雷达源格式**: 相对路径，无 `https://` 前缀
4. **雷达目标**: 匹配路由路径
5. **命名空间 URL**: 不包含 `https://` 协议前缀
6. **单一类别**: categories 数组仅一个类别
7. **单一文件**: 描述和雷达规则放在 Route 字段中

### 代码审查要点

- 遵循上述代码规范
- 确保路由功能正常
- 添加适当的测试
- 更新相关文档

### 提交规范

- 使用清晰的提交信息
- 遵循项目的拉取请求模板

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t rsshub .

# 运行容器
docker run -p 1200:1200 rsshub
```

### Cloudflare Workers 部署

```bash
# 构建 Worker
pnpm run worker-build

# 部署
pnpm run worker-deploy
```

### Vercel 部署

项目支持 Vercel 一键部署。

## 故障排除

### 常见问题

1. **依赖安装失败**: 确保使用 pnpm 或 npm 最新版本
2. **构建失败**: 检查 TypeScript 错误和 ESLint 警告
3. **路由无法访问**: 检查网络连接和目标网站变更

### 调试

- 使用 `console.log` 输出调试信息
- 检查浏览器开发者工具的网络请求
- 查看服务器日志

## 相关资源

- [官方文档](https://docs.rsshub.app)
- [GitHub 仓库](https://github.com/DIYgod/RSSHub)
- [Telegram 群组](https://t.me/rsshub)
- [贡献指南](https://docs.rsshub.app/joinus/)

## 许可证

本项目采用 AGPL-3.0 许可证。
