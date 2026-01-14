# RSSHub 路由开发手册

## 快速开始

如果您在使用 RSSHub 过程中遇到了问题或者有建议改进，我们很乐意听取您的意见！您可以通过 Pull Request 来提交您的修改。无论您对 Pull Request 的使用是否熟悉，我们都欢迎不同经验水平的开发者参与贡献。如果您不懂编程，也可以通过 [报告错误](https://github.com/DIYgod/RSSHub/issues) 的方式来帮助我们。

### 参与讨论

[![Telegram group](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.swo.moe%2Fstats%2Ftelegram%2Frsshub&query=count&color=2CA5E0&label=Telegram%20Group&logo=telegram&cacheSeconds=3600&style=flat-square)](https://t.me/rsshub) [![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/DIYgod/RSSHub?style=flat-square&label=GitHub%20issues&logo=github)](https://github.com/DIYgod/RSSHub/issues)

### 开始之前

要制作一个 RSS 订阅，您需要结合使用 Git、HTML、JavaScript、jQuery 和 Node.js。

如果您对它们不是很了解，但想要学习它们，以下是一些好的资源：

- [MDN Web Docs 上的 JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript#教程)
- [W3Schools](https://www.w3schools.com)
- [Codecademy 上的 Git 课程](https://www.codecademy.com/learn/learn-git)

如果您想查看其他开发人员如何使用这些技术来制作 RSS 订阅的示例，您可以查看 [我们的代码库](https://github.com/DIYgod/RSSHub/tree/master/lib/routes) 中的一些代码。

### 开始开发 RSSHub 路由

如果您发现一个网站没有提供 RSS 订阅，您可以使用 RSSHub 制作一个 RSS 规则。RSS 规则是一个短小的 Node.js 程序代码（以下简称 "路由"），它告诉 RSSHub 如何从网站中提取内容并生成 RSS 订阅。通过制作新的 RSS 路由，您可以帮助让您喜爱的网站的内容被更容易访问和关注。

在您开始编写 RSS 路由之前，请确保源站点没有提供 RSS。一些网页会在 HTML 头部中包含一个 type 为 `application/atom+xml` 或 `application/rss+xml` 的 link 元素来指示 RSS 链接。

这是在 HTML 头部中看到 RSS 链接可能会长成这样：`<link rel="alternate" type="application/rss+xml" href="http://example.com/rss.xml" />`。如果您看到这样的链接，这意味着这个网站已经有了一个 RSS 订阅，您不需要为它制作一个新的 RSS 路由。

## 开发环境

在开始编写新的 RSS 规则之前，确保您的开发环境已正确配置很重要。

### 安装 Node.js

为了能够编写新的 RSS 规则，您必须首先安装 Node.js。RSSHub 使用 Node.js 运行其代码以及制作 RSS 订阅源，需要 Node v16 或更高版本。您可以从 [这里](https://nodejs.org/en/download) 下载最新的 Node.js LTS 版本。

在 Windows 系统下，您可以下载安装程序并按照安装程序的步骤进行操作。记得勾选安装 **原生模块的工具（Tools for Native Modules）** 选项。

在 macOS 系统下，您可以从 Node.js 网站下载安装程序，或者使用 [Homebrew](https://brew.sh) 命令 `brew install node` 安装 Node.js。

在 Linux 系统下，您可以参考 [这个页面](https://nodejs.org/en/download/package-manager) 决定如何安装 Node.js。

### 安装代码编辑器

编写代码需要一个代码编辑器。如果您已经有一个，您可以跳过这一部分。如果您还没有一个编辑器，可以从以下列表中选择一个：

- [Visual Studio Code](https://code.visualstudio.com)
- [WebStorm](https://www.jetbrains.com/webstorm)
- [Neovim](https://neovim.io)
- [Sublime Text](https://www.sublimetext.com)

为了加速开发过程并更容易维护代码风格的一致性，可以为您选择的代码编辑器安装一些适当的扩展。在本指南的后半部分，我们将使用 Visual Studio Code 作为示例，您可以安装以下扩展：

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)（保持在不同的 IDE 中的一致的代码风格）
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)（识别并修复代码中的常见错误）
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)（使您的代码更易读和更一致地格式化）

### 云托管的开发环境

如果您不想在计算机上安装 Node.js 和代码编辑器，您可以使用云托管的开发环境。您可以使用 [GitHub Codespaces](https://codespace.new)。只需点击以下按钮即可启动新的工作区：

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/DIYgod/RSSHub?quickstart=1)

有关如何使用 [GitHub Codespaces](https://codespace.new) 的更多信息，请参见 [GitHub 文档](https://docs.github.com/codespaces)。

## 刚开始之前

在本教程中，我们将以创建 [GitHub Repo Issues](/routes/programming#github-repo-issues) 的 RSS 订阅为例，向您逐步介绍整个过程。

### 安装依赖

在开始之前，您需要安装 RSSHub 的依赖。您可以使用 [pnpm](https://pnpm.io/) 包管理器来完成此操作。

#### 启用 pnpm

Node.js 从 v16.13 开始包含了 [Corepack](https://nodejs.org/api/corepack.html) 用于管理包管理器。通过运行以下命令启用 pnpm：

```
corepack enable pnpm
```

有关 pnpm 安装选项的更多详细信息，请参见 [pnpm 安装页面](https://pnpm.io/installation)。

#### 运行 pnpm

在 RSSHub 的根目录中运行以下命令：

```bash
pnpm i
```

## 开始调试

成功安装依赖后，您可以通过运行以下命令开始调试 RSSHub：

```bash
pnpm dev
```

请注意控制台输出中的任何错误消息或其他有用信息，这些信息可以帮助您诊断和解决问题。此外，不要犹豫地查阅 RSSHub 文档或向社区寻求帮助，如果您遇到任何困难。

要查看您的更改结果，请在浏览器中打开 `http://localhost:1200`。您将能够看到代码更改自动反映在浏览器中。

## 遵循脚本标准

确保所有新的 RSS 路由都遵循 [脚本标准](#脚本标准)。如果不遵守此标准，您的 Pull Request 可能不会在合理的时间内被合并。

[脚本标准](#脚本标准) 为创建高质量和可靠的源代码提供了指导。通过遵循这些指导，您可以确保您的 RSS 订阅按预期工作，并且易于其他社区维护者阅读。

在提交您的 Pull Request 之前，请仔细审查 [脚本标准](#脚本标准) 并确保您的代码符合所有要求。这将有助于加快审查过程。

## 创建路由

### 创建命名空间

制作新 RSS 路由的第一步是创建命名空间。原则上，命名空间应该与您制作 RSS 订阅的主网站的二级域名相同。例如，如果您正在为 [https://github.com/DIYgod/RSSHub/issues](https://github.com/DIYgod/RSSHub/issues) 制作 RSS 订阅，二级域名是 `github`。因此，您应该在 `lib/routes` 下创建一个名为 `github` 的文件夹作为您的 RSS 路由的命名空间。

:::tip

创建命名空间时，避免为同一命名空间创建多个变体。例如，如果您正在为 `yahoo.co.jp` 和 `yahoo.com` 制作 RSS 订阅，您应该使用单个命名空间 `yahoo` 而不是创建多个命名空间，如 `yahoo-jp`、`yahoojp`、`yahoo.jp`、`jp.yahoo`、`yahoocojp` 等。

:::

对于 BeesHub 自定义路由，请在 `lib/routes-beeshub/` 下创建命名空间文件夹，而不是 `lib/routes/`。这是新路由开发的默认位置。

一旦您为 RSS 路由创建了命名空间，下一步是在文件中创建 `namespace.ts` 来定义命名空间。

该文件应通过命名空间返回符合 Namespace 类型的对象。Namespace 的定义位于 [/lib/types.ts](https://github.com/DIYgod/RSSHub/blob/master/lib/types.ts#L51)

- name: 命名空间的人类可读名称，将用作文档的标题
- url: 对应的网站 URL，不带协议
- description: 可选，用于向使用此命名空间的用户提供提示和附加说明，将插入到文档中
- zh, zh-TW, ja: 可选，支持英语以外的语言，将用于生成多语言文档

这是一个完整的示例：

```ts
import type { Namespace } from '@/types';

export const namespace: Namespace = {
    name: 'GitHub',
    url: 'github.com',
    description: `
:::tip
GitHub 提供了一些官方的 RSS 订阅：

-   Repo releases: \`https://github.com/:owner/:repo/releases.atom\`
-   Repo commits: \`https://github.com/:owner/:repo/commits.atom\`
-   User activities: \`https://github.com/:user.atom\`
-   Private feed: \`https://github.com/:user.private.atom?token=:secret\` (您可以在登录后在 [dashboard](https://github.com) 页面找到 **Subscribe to your news feed**)
-   Wiki history: \`https://github.com/:owner/:repo/wiki.atom\`
:::`,
};
```

### 创建路由

一旦您为路由创建了命名空间，下一步是创建路由文件来注册路由。

例如，如果您正在为 [GitHub Repo Issues](/routes/programming#repo-issues) 制作 RSS 订阅，并假设您希望用户输入 GitHub 用户名和仓库名，如果请求中没有提供仓库名，则返回到 RSSHub。您可以在 /lib/routes/github/issue.ts 中注册您的新 RSS 路由，该文件需要通过路由返回符合 Route 类型的对象。Route 的定义位于 [/lib/types.ts](https://github.com/DIYgod/RSSHub/blob/master/lib/types.ts)

- path: 路由路径，使用 [Hono 路由](https://hono.dev/api/routing) 语法
- name: 路由的人类可读名称，将用作文档的标题和应该与命名空间的名称不同
- url: 对应的网站 URL，不带协议
- maintainers: 负责维护此路由的人员的 GitHub 句柄
- example: 路由的示例 URL
- parameters: 路由参数的描述
- description: 可选，用于向使用此路由的用户提供提示和附加说明，将插入到文档中
- categories: 路由的分类，将写入相应的分类文档
- features: 路由的一些功能，如它依赖于什么配置项、是否严格反爬、是否支持某些功能等
- radar: 可以帮助用户在使用 [RSSHub Radar](https://github.com/DIYgod/RSSHub-Radar) 或其他兼容其格式的软件时订阅您的新 RSS 路由，我们将在下面的部分中更详细地介绍它
- handler: 路由的处理函数，我们将在下面的部分中更详细地介绍它

这是一个完整的示例：

```ts
import { Route } from '@/types';

export const route: Route = {
    path: '/issue/:user/:repo/:state?/:labels?',
    categories: ['programming'],
    example: '/github/issue/vuejs/core/all/wontfix',
    parameters: { user: 'GitHub username', repo: 'GitHub repo name', state: 'the state of the issues. Can be either `open`, `closed`, or `all`. Default: `open`.', labels: 'a list of comma separated label names' },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['github.com/:user/:repo/issues', 'github.com/:user/:repo/issues/:id', 'github.com/:user/:repo'],
            target: '/issue/:user/:repo',
        },
    ],
    name: 'Repo Issues',
    maintainers: ['HenryQW', 'AndreyMZ'],
    handler,
};
```

在上面的示例中，`issue` 是精确匹配，`:user` 是必需参数，`:repo?` 是可选参数。`?` 在 `:repo` 之后表示该参数是可选的

### 编写雷达规则

在 [创建路由](#创建路由) 中，我们提到了路由信息包括一个雷达字段，用于记录 RSSHub Radar 规则。

以 `GitHub 仓库 Issues` 的 RSS 规则为例。代码如下：

```ts{5-8}
import { Route } from '@/types';

export const route: Route = {
    // ...
    radar: [
        {
            source: ['github.com/:user/:repo/issues', 'github.com/:user/:repo/issues/:id', 'github.com/:user/:repo'],
            target: '/issue/:user/:repo',
        },
    ],
};
```

#### `source`

source 是一个可选字段，应该指定不带协议名称的 URL 路径。如果您不想匹配任何 URL 路径，请将其留空。它只会在 RSSHub Radar 浏览器扩展的 `RSSHub for current website` 选项中出现。

source 应该是一个字符串数组。例如，如果 `GitHub 仓库 Issues` 的 source 是 `github.com/:user/:repo`，这意味着当您访问 `https://github.com/DIYgod/RSSHub` 时，它将与 `github.com/:user/:repo` 匹配。此时，返回的结果 params 将是：`{ user: 'DIYgod', repo: 'RSSHub'}`。浏览器扩展使用这些参数基于 target 字段建立 RSSHub 订阅地址。

#### `target`

target 是可选的，用于生成 RSSHub 订阅地址，可以接受字符串作为输入。如果您不想创建 RSSHub 订阅地址，请将其留空。

例如，在 `GitHub 仓库 Issues` 的情况下，RSSHub 文档中的相应路由将是 `/github/issue/:user/:repo`。

在 source 路径中匹配 `user` 为 `DIYgod`，匹配 `repo` 为 `RSSHub` 后，RSSHub 路由中的 `:user` 将被 `DIYgod` 替换，`:repo` 将被 `RSSHub` 替换，从而得到 `/github/issue/DIYgod/RSSHub`。

### 调试

如果您需要调试新规则，建议您安装浏览器扩展。您可以在 [RSSHub Radar README](https://github.com/DIYgod/RSSHub-Radar?tab=readme-ov-file#install) 下载适合您浏览器的扩展。

然后转到扩展的设置页面，将您的本地实例地址 http://localhost:1200 设置为您的 "RSSHub instance"，然后点击 "Update Now"，新规则将生效。

### 编写路由处理函数

处理函数将传递一个参数 ctx。在函数结束时，它需要返回一个包含 RSS 所需信息的对象。您可以在 [Hono 上下文文档](https://hono.dev/api/context) 中查看 ctx 可用的 API；返回值的类型在此处定义：[/lib/types.ts](https://github.com/DIYgod/RSSHub/blob/master/lib/types.ts)

我们有三种常见的数据获取方法：

1.  [通过 API](#通过-api)
2.  [通过 HTML](#通过-html)
3.  [使用 puppeteer](#使用-puppeteer)

接下来，我们将继续以 GitHub 仓库 Issues 为例，介绍如何编写这些三种常见的路由处理函数。

#### 通过 API

您应该优先使用 API 来获取数据，因为 API 通常更容易解析且更稳定。

##### 检查 API 文档

不同的站点有不同的 API。您可以检查您想要为其创建 RSS 订阅的站点的 API 文档。在这种情况下，我们将使用 [GitHub Issues API](https://docs.github.com/zh/rest/issues/issues#list-repository-issues)。

但更常见的情况是，网站不提供开放的 API。此时，我们可以使用浏览器开发者工具或数据包捕获工具来查看站点发起的请求。

##### 基本代码

以下是一些入门的基本代码：

```ts
import { Route } from '@/types';
import ofetch from '@/utils/ofetch'; // 使用的统一请求库

export const route: Route = {
    // 在这里写路由信息，前文介绍的路由信息。
    handler: (ctx) => {
        // 在这里写路由处理函数。
    },
};
```

##### 检索用户输入

首先，我们需要从用户请求的路径中获取 GitHub 用户名和仓库名。如果请求中没有提供仓库名，则默认为 `RSSHub`。您可以使用以下代码实现：

```ts{4}
export const route: Route = {
    // ...
    handler: (ctx) => {
        const { user, repo = 'RSSHub' } = ctx.req.param();
    },
};
```

##### 从 API 获取数据

获取用户输入后，我们可以使用它向 API 发送请求。在大多数情况下，您需要在 `@/utils/ofetch` 中使用 `ofetch`（一个自定义的 [ofetch](https://github.com/unjs/ofetch) 包装函数）来发送 HTTP 请求。有关更多信息，请参考 [ofetch 文档](https://github.com/unjs/ofetch)。

```ts{3-8}
export const route: Route = {
    const { user, repo = 'RSSHub' } = ctx.req.param();
    // 向 API 发送 HTTP GET 请求并解构返回的数据对象。
    const data = await ofetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
```

## 提交您的路由

一旦您完成了路由，您可以向 [RSSHub](https://github.com/DIYgod/RSSHub) 提交拉取请求（以下简称 PR）。我们使用 squash merge 策略，这意味着您分支中的所有提交将被合并到 RSSHub 仓库中的一个提交。但是，保持您的提交历史干净和整洁仍然很重要。我们还为您提供了一个直观的模板来填写。

### 拉取请求模板

````md
<!--
如果您在填写此表单时遇到任何困难，请参考 https://docs.rsshub.app/joinus/new-rss/submit-route
如果你在填写此表单时遇到任何困难，请参考 https://docs.rsshub.app/zh/joinus/new-rss/submit-route
-->

## 相关 Issue / 该 PR 相关 Issue

Close #

## 路由地址示例 / Example for the Proposed Route(s)

<!--
请在 `routes` 区域填写以 / 开头的完整路由地址，否则你的 PR 将会被无条件关闭。
如果路由包含在文档中列出可以完全穷举的参数（例如分类），请依次全部列出。

Please include route starts with /, with all required and optional parameters in the `routes` section. Fail to comply will result in your pull request being closed automatically.
```route
/some/route
/some/other/route
/dont/use/this/or/modify/it
/use/the/fenced/code/block/below
```
如果你的 PR 与路由无关, 请在 `routes` 区域 填写 `NOROUTE`，而不是直接删除 `routes` 区域。否则你的 PR 将会被无条件关闭。
If your changes are not related to route, please fill in `routes` section with `NOROUTE`. Fail to comply will result in your PR being closed.
-->

```routes

```

## 新 RSS 路由检查表 / New RSS Route Checklist

- [ ] 新路由 / New Route
- [ ] 跟随 [路由规范](https://docs.rsshub.app/joinus/advanced/script-standard) / Follows [Script Standard](https://docs.rsshub.app/zh/joinus/advanced/script-standard)
- [ ] 文档说明 / Documentation
- [ ] 全文获取 / Full text
- [ ] 使用缓存 / Use cache
- [ ] 反爬/频率限制 / Anti-bot or rate limit
- [ ] 如果有, 是否有对应的措施? / If yes, do your code reflect this sign?
- [ ] [日期和时间](https://docs.rsshub.app/joinus/advanced/pub-date) / [Date and time](https://docs.rsshub.app/zh/joinus/advanced/pub-date)
- [ ] 可以解析 / Parsed
- [ ] 时区正确 / Correct time zone
- [ ] 添加了新的包 / New package added
- [ ] `Puppeteer`

## 说明 / Note
````

### 相关 Issue

您可以在此处填写此 PR 相关的 issue 编号。如果没有相关 issue，请留空。如果您的拉取请求被合并，相关 issue 将被自动关闭。如果您想关闭多个 issue，请在空格或逗号分隔的另一个 `Close #` 之后添加。例如，`Close #123, Close #456, Close #789` 或 `Close #123 Close #456 Close #789`。

### 路由地址示例

您可以在此处添加您正在提议添加或更改的路由，以及所有必需和可选参数。如果您想添加多个路由，请在新行中添加每个路由。例如：

````md
```routes
/github/issue/DIYgod
/github/issue/DIYgod/RSSHub
/github/issue/DIYgod/RSSHub-Radar
/github/issue/flutter/flutter
```
````

**不要** 填写 `/github/issue/:user/:repo?` 或 `/issue/:user/:repo?`。

如果您的更改与路由无关，例如文档，您可以在 `routes` 部分填写 `NOROUTE`。

````md
```routes
NOROUTE
```
````

**不要** 删除或保持 `routes` 部分未修改，或您的拉取请求将被自动关闭。

**不要** 为路由相关的拉取请求使用 `NOROUTE`，否则它们也将被自动关闭。

### 新 RSS 路由检查表

此检查表将帮助您确保您的拉取请求包含所有必要的组件。虽然您不必检查所有项目即可合并您的 PR，但请确保您的新路由遵循 [脚本标准](#脚本标准)。这是所有新路由的强制性要求。

```md
- [ ] 新的路由 New Route
```

要检查项目，请将 `[ ]` 替换为 `[x]`。

## 高级主题

### 脚本标准

#### 代码风格

##### 通用指南

- **保持一致！**
- 避免使用已弃用的功能。
- 避免修改 `yarn.lock` 和 `package.json`，除非您添加新依赖。
- 将重复代码合并到函数中。
- 优先使用更高的 ECMAScript 标准功能而不是较低的。
- 按字母顺序（大写字母优先）排序条目，以便更容易找到条目。
- 尽可能使用 HTTPS 而不是 HTTP。
- 尽可能使用 WebP 格式而不是 JPG，因为它提供更好的压缩。

##### 格式化

###### 缩进

- 使用 4 个空格进行缩进，以实现一致且易读的代码。

###### 分号

- 在每个语句末尾添加分号，以提高可读性和一致性。

###### 字符串

- 尽可能使用单引号而不是双引号，以保持一致性和可读性。
- 使用 [模板字面量](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals) 而不是复杂的字符串连接。
- 对于 GraphQL 查询，使用 [模板字面量](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)，因为它们使代码更简洁且易读。

###### 空白

- 在每个文件的末尾添加一个空行，以实现干净且可读的代码库。
- 避免尾随空格，以实现干净且可读的代码库。

##### 语言功能

###### 转换

- 避免重新转换相同的类型。

###### 函数

- 优先使用 [箭头函数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 而不是 `function` 关键字。

###### 循环

- 对于数组，使用 `for-of` 而不是 `for` ([javascript:S4138](https://rules.sonarsource.com/javascript/RSPEC-4138))。

###### 变量

- 使用 `const` 和 `let` 而不是 `var`。
- 每个声明一个变量。

##### 命名

- 对于变量和函数，使用 `lowerCamelCase` 以遵守标准命名约定。
- 对于文件和文件夹，使用 `kebab-case`。
- 对于常量，使用 `CONSTANT_CASE`。

### 使用缓存

RSSHub 有一个缓存模块，在短时间后过期。您可以通过使用环境变量修改 `lib/config.ts` 文件中的 `CACHE_EXPIRE` 值来更改缓存的持续时间。但是，对于内容更新频率较低的接口，最好使用 `CACHE_CONTENT_EXPIRE` 指定更长的缓存过期时间。

例如，要检索每个 issue 的第一个评论的全文，您可以向 `${baseUrl}/${user}/${repo}/issues/${id}` 发送请求，因为此数据在 `${baseUrl}/${user}/${repo}/issues` 中不可用。建议将此数据存储在缓存中，以避免向服务器重复请求。

以下是如何使用缓存检索数据的示例：

```js
import cache from '@/utils/cache';

const items = await Promise.all(
    list.map((item) =>
        cache.tryGet(item.link, async () => {
            const { data: response } = await got(item.link);
            const $ = load(response);

            item.description = $('.comment-body').first().html();

            return item;
        })
    )
);
```

上面的代码片段来自 [创建您自己的 RSSHub 路由](#创建路由)，展示了如何使用缓存获取每个 issue 的第一个评论的全文。`cache.tryGet()` 用于确定数据是否已在缓存中可用。如果没有，它会检索数据并将其存储在缓存中。

:::warning

在 `tryGet()` 函数外部声明的变量的任何赋值在缓存命中场景下不会被处理。例如，以下代码不会按预期工作：

```js
    let x = '1';
    const z = await cache.tryGet('cache:key', async () => {
        x = '2';
        const y = '3';
        return y;
    })
    console.log(x); // 缓存未命中: '2', 缓存命中: '1'
    console.log(z): // '3'
```

:::

#### API

[lib/middleware/cache/index.ts](https://github.com/DIYgod/RSSHub/tree/master/lib/utils/cache)

##### cache.tryGet(key, getValueFunc [, maxAge [, refresh ]])

###### 参数

| 名称         | 类型                   | 描述                                                                               |
| ------------ | ---------------------- | ---------------------------------------------------------------------------------- |
| key          | `string`               | _(必需)_ 用于存储和检索缓存的键。您可以使用 `:` 作为分隔符来创建层次结构。         |
| getValueFunc | `function` \| `string` | _(必需)_ 当缓存未命中时返回要缓存的数据的函数。                                    |
| maxAge       | `number`               | _(可选)_ 缓存的最大年龄（以秒为单位）。如果未指定，将使用 `CACHE_CONTENT_EXPIRE`。 |
| refresh      | `boolean`              | _(可选)_ 是否在缓存命中时续订缓存过期时间。默认为 `true`。                         |

:::tip

以下是使用缓存的高级方法。您应该大多数时候使用 `cache.tryGet()`。

注意，在使用 `cache.get()` 检索缓存时，您需要使用 `JSON.parse()`。

:::

##### cache.get(key [, refresh ])

###### 参数

| 名称    | 类型      | 描述                                                                 |
| ------- | --------- | -------------------------------------------------------------------- |
| key     | `string`  | _(必需)_ 用于检索缓存的键。您可以使用 `:` 作为分隔符来创建层次结构。 |
| refresh | `boolean` | _(可选)_ 是否在缓存命中时续订缓存过期时间。默认为 `true`。           |

##### cache.set(key, value [, maxAge ])

###### 参数

| 名称   | 类型                  | 描述                                                                               |
| ------ | --------------------- | ---------------------------------------------------------------------------------- |
| key    | `string`              | _(必需)_ 用于存储缓存的键。您可以使用 `:` 作为分隔符来创建层次结构。               |
| value  | `function`\| `string` | _(必需)_ 要缓存的值。                                                              |
| maxAge | `number`              | _(可选)_ 缓存的最大年龄（以秒为单位）。如果未指定，将使用 `CACHE_CONTENT_EXPIRE`。 |

### 日期处理

当您访问网站时，网站通常会为您提供日期或时间戳。本教程将向您展示如何在代码中正确处理它们。

#### 标准

##### 无日期

- **不要** 在网站不提供日期时添加日期。将 `pubDate` 字段留空。
- 当网站提供日期但不提供准确时间时，仅解析日期，**不要** 将时间添加到 `pubDate` 字段。

`pubDate` 字段必须是：

1.  [Date 对象](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)
2.  **不推荐，仅用于兼容性**：可以正确解析的字符串，因为它们的行为在部署环境中可能不一致。请谨慎使用 `Date.parse()`。

从路由脚本传递的 `pubDate` 应对应服务器使用的时区/时间。有关更多详细信息，请参见以下内容：

#### 使用工具类

我们推荐使用 [day.js](https://github.com/iamkun/dayjs) 进行日期处理和时区调整。有两个相关的工具类：

##### 日期和时间

RSSHub 工具类包括一个 [day.js](https://github.com/iamkun/dayjs) 的包装器，允许您轻松解析日期字符串并在大多数情况下获得 [Date 对象](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)。

```js
import { parseDate } from '@/utils/parse-date';

const pubDate = parseDate('2020/12/30');
// 或
const pubDate = parseDate('2020/12/30', 'YYYY/MM/DD');
```

:::tip

您可以参考 [day.js 文档](https://day.js.org/docs/en/parse/string-format#list-of-all-available-parsing-tokens) 以获取所有可用的日期格式。

:::

如果您需要解析相对日期，请使用 `parseRelativeDate`。

```js
import { parseRelativeDate } from '@/utils/parse-date';

const pubDate = parseRelativeDate('2 days ago');
const pubDate = parseRelativeDate('day before yesterday 15:36');
```

##### 时区

在解析网站中的日期时，考虑时区很重要。有些网站可能不会根据访问者的位置转换时区，从而导致日期不能准确反映用户的本地时间。为了避免这个问题，您可以手动指定时区。

要在代码中手动指定时区，请使用以下代码：

```js
import timezone from '@/utils/timezone';

const pubDate = timezone(parseDate('2020/12/30 13:00'), +1);
```

timezone 函数接受两个参数：第一个是原始 [Date 对象](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)，第二个是时区偏移。偏移以小时为单位指定，所以在这个示例中，使用的是 UTC+1 时区。

通过这样做，时间将被转换为服务器时间，并便于中间件处理。

### 调试

在调试代码时，您可以使用的不只是 `console.log` 或将 node 进程附加到调试器。您还可以使用以下方法进行调试。

注意：以下方法仅在实例以 `debugInfo=true` 运行时有效。

#### 使用 `ctx.set('json', obj)`

要将自定义对象传递给 `ctx.set('json', obj)` 进行调试，请按照以下步骤操作：

1.  创建您的自定义对象。
2.  将您的对象传递给 `ctx.set('json', obj)`。
3.  使用查询字符串 `format=debug.json` 访问相应的路由来查看您的对象。例如，如果您想调试路由 `/furstar/characters/:lang?`，您可以访问 URL：`/furstar/characters/en?format=debug.json`

以下是从 [furstar/index.ts](https://github.com/DIYgod/RSSHub/blob/master/lib/routes/furstar/index.ts) 取来的使用 `ctx.set('json', obj)` 的示例

```js
const info = utils.fetchAllCharacters(res.data, base);

ctx.set('json', {
    info,
});
```

在上面的示例中，我们将 `info` 对象传递给 `ctx.set('json', obj)`，我们可以使用相应的路由与查询字符串 `format=debug.json` 来访问它。

#### debug.html

为了快速测试 `ctx.set('data', obj)` 中的 `description` 是否正确，您可以使用查询字符串 `format={index}.debug.html` 来获取相应条目的 HTML。链接可以直接在浏览器中打开以预览渲染结果。

用法：使用查询字符串 `format={index}.debug.html` 访问相应的路由，其中 `{index}` 是您的 `data.item` 中的项目编号（从 0 开始）。数据对应于 `data.item[index].description` 信息将作为路由结果返回。

### RSS 订阅基础

本指南适用于想要详细了解如何创建 RSS 订阅的高级用户。如果您是创建 RSS 订阅的新手，我们建议您首先阅读 [创建您自己的 RSSHub 路由](#创建路由)。

一旦您收集了要在 RSS 订阅中包含的数据，您就可以返回它。RSSHub 的中间件 [`template.tsx`](https://github.com/DIYgod/RSSHub/blob/master/lib/middleware/template.tsx) 将随后处理数据并以所需的格式（默认为 RSS 2.0）渲染 RSS 输出。除了 [创建您自己的 RSSHub 路由](#创建路由) 中提到的字段，您可以使用以下字段进一步自定义您的 RSS 订阅。

重要的是要注意，并非所有字段都适用于所有输出格式，因为 RSSHub 支持多种输出格式。下表显示了哪些字段与不同输出格式兼容。我们使用以下符号来表示兼容性：`A` 表示 Atom，`J` 表示 JSON Feed，`R` 表示 RSS 2.0。

#### 频道级别

下表列出了您可以在频道级别使用的字段来自定义您的 RSS 订阅：

| 字段                  | 描述                                                                                                              | 默认                             | 兼容性  |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------- | :------------------------------- | :------ |
| **`title`**           | _(推荐)_ 订阅的名称，应仅为纯文本                                                                                 | `RSSHub`                         | A, J, R |
| **`link`**            | _(推荐)_ 与订阅关联的网站 URL，应链接到人类可读的网站                                                             | `https://rsshub.app`             | A, J, R |
| **`description`**     | _(可选)_ 订阅的摘要，应仅为纯文本                                                                                 | 如果未指定，则默认为 **`title`** | J, R    |
| **`language`**        | _(可选)_ 订阅的主要语言，应为 [RSS 语言代码](https://www.rssboard.org/rss-language-codes) 或 ISO 639 语言代码的值 | `zh-cn`                          | J, R    |
| **`image`**           | _(推荐)_ 表示频道的图像的 URL，应相对较大且方形                                                                   | `undefinded`                     | J, R    |
| **`icon`**            | _(可选)_ Atom 订阅的图标                                                                                          | `undefinded`                     | J       |
| **`logo`**            | _(可选)_ RSS 订阅的徽标                                                                                           | `undefinded`                     | J       |
| **`subtitle`**        | _(可选)_ Atom 订阅的副标题                                                                                        | `undefinded`                     | A       |
| **`author`**          | _(可选)_ Atom 订阅的作者或 JSON 订阅的作者                                                                        | `RSSHub`                         | A, J    |
| **`itunes_author`**   | _(可选)_ 播客订阅的作者                                                                                           | `undefinded`                     | R       |
| **`itunes_category`** | _(可选)_ 播客订阅的类别                                                                                           | `undefinded`                     | R       |
| **`itunes_explicit`** | _(可选)_ 用于指示订阅是否包含 [explicit](https://help.apple.com/itc/podcasts_connect/#/itcfafb6d665) 内容。       | `undefinded`                     | R       |
| **`allowEmpty`**      | _(可选)_ 是否允许空订阅。如果设置为 `true`，即使没有项目，也会生成订阅                                            | `undefinded`                     | A, J, R |

RSS 订阅中的每个项目由一组描述它的字段组成。下表列出了可用的字段：

| 字段                    | 描述                                                                                                                                              | 默认         | 兼容性  |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :----------- | :------ | ---------- | ------- |
| **`title`**             | _(必需)_ 项目的标题，应仅为纯文本                                                                                                                 | `undefinded` | A, J, R |
| **`link`**              | _(推荐)_ 项目的 URL，应链接到人类可读的网站                                                                                                       | `undefinded` | A, J, R |
| **`description`**       | _(推荐)_ 项目的内容。对于 Atom 订阅，它是 `atom:content` 元素。对于 JSON 订阅，它是 `content_html` 字段                                           | `undefinded` | A, J, R |
| **`author`**            | _(可选)_ 项目的作者                                                                                                                               | `undefinded` | A, J, R |
| **`category`**          | _(可选)_ 项目的类别。您可以使用纯字符串或字符串数组                                                                                               | `undefinded` | A, J, R |
| **`guid`**              | _(可选)_ 项目的唯一标识符                                                                                                                         | \*\*`link    |         | title`\*\* | A, J, R |
| **`pubDate`**           | _(推荐)_ 项目的发布日期，应为 [Date 对象](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) 遵循 [标准](#日期处理) | `undefinded` | A, J, R |
| **`updated`**           | _(可选)_ 项目最后修改的日期，应为 [Date 对象](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)                    | `undefinded` | A, J    |
| **`itunes_item_image`** | _(可选)_ 与项目关联的图像的 URL                                                                                                                   | `undefinded` | R       |
| **`itunes_duration`**   | _(可选)_ 音频或视频项目的长度（以秒为单位，或格式为 H:mm:ss），应为数字或字符串                                                                   | `undefinded` | J, R    |
| **`enclosure_url`**     | _(可选)_ 与项目关联的附件 URL                                                                                                                     | `undefinded` | J, R    |
| **`enclosure_length`**  | _(可选)_ 附件文件的 **字节** 大小，应为数字                                                                                                       | `undefinded` | J, R    |
| **`enclosure_type`**    | _(可选)_ 附件文件的 MIME 类型，应为字符串                                                                                                         | `undefinded` | J, R    |
| **`upvotes`**           | _(可选)_ 项目收到的 upvotes 数量，应为数字                                                                                                        | `undefinded` | A       |
| **`downvotes`**         | _(可选)_ 项目收到的 downvotes 数量，应为数字                                                                                                      | `undefinded` | A       |
| **`comments`**          | _(可选)_ 项目的评论数量，应为数字                                                                                                                 | `undefinded` | A       |
| **`media.*`**           | _(可选)_ 与项目关联的媒体。请参阅 [Media RSS](https://www.rssboard.org/media-rss) 以获取更多详细信息                                              | `undefinded` | R       |
| **`doi`**               | _(可选)_ 项目的数字对象标识符，应为格式为 `10.xxxx/xxxxx.xxxx` 的字符串                                                                           | `undefinded` | R       |

:::warning 格式化注意事项

在 RSS 订阅中指定某些字段时，需要注意一些格式化注意事项。具体来说，您应该避免在以下字段中包含换行符、连续空格或前导/尾随空格：**`title`**、**`subtitle`**（仅 Atom）、**`author`**（仅 Atom）、**`item.title`** 和 **`item.author`**。

虽然大多数 RSS 阅读器会自动修剪这些字段，但有些可能不会正确处理它们。因此，为了确保与所有 RSS 阅读器的兼容性，我们建议在输出前修剪这些字段。如果您的路由无法容忍修剪这些字段，请考虑更改其格式。

此外，虽然其他字段不会被强制修剪，但我们建议尽可能避免违反上述格式化规则。如果您使用 Cheerio 从网页中提取内容，请注意 Cheerio 会保留换行符和缩进。对于 **`item.description`** 字段，特别是，任何预期的换行符应转换为 `<br>` 标签，以防止它们被 RSS 阅读器修剪。如果您从 JSON 数据中提取 RSS 订阅，请注意 JSON 可能包含需要显示的换行符，因此您应该在这种情况下将它们转换为 `<br>` 标签。

重要的是要记住这些格式化注意事项，以确保您的 RSS 订阅与所有 RSS 阅读器兼容。

:::

#### 创建 BitTorrent/Magnet 订阅

RSSHub 允许您创建 BitTorrent/Magnet 订阅，这对于触发自动下载很有用。要创建 BitTorrent/Magnet 订阅，您需要向 RSS 订阅添加 **额外** 的字段，这些字段符合许多下载器订阅格式。

以下是如何创建 BitTorrent/Magnet 订阅的示例：

```js
return {
    item: [
        {
            enclosure_url: '', // 这应该是 Magnet URI
            enclosure_length: '', // 文件大小（字节）（此字段是可选的）
            enclosure_type: 'application/x-bittorrent', // 此字段应固定为 'application/x-bittorrent'
        },
    ],
};
```

通过在 RSS 订阅中包含这些字段，您将能够创建可由兼容下载器自动下载的 BitTorrent/Magnet 订阅。

##### 更新文档

如果您在 RSSHub 路由中添加对 BitTorrent/Magnet 订阅的支持，更新文档以反映此更改很重要。为此，您需要将 `Route` 导出对象的 `features` 中的 `supportBT` 属性设置为 `true`。以下是一个示例：

```ts
export const route: Route = {
    // ...
    features: {
        // ...
        supportBT: true,
    },
};
```
