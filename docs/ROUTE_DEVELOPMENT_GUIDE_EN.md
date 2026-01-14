# RSSHub Route Development Guide

## Quick Start

If you've found a bug or have a suggestion for improving RSSHub, we'd love to hear from you! You can submit your changes by creating a pull request. Don't worry if you're new to pull requests - we welcome contributions from developers of all experience levels. Don't know how to code? You can also help by [reporting bugs](https://github.com/DIYgod/RSSHub/issues).

### Join the discussion

[![Telegram group](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.swo.moe%2Fstats%2Ftelegram%2Frsshub&query=count&color=2CA5E0&label=Telegram%20Group&logo=telegram&cacheSeconds=3600&style=flat-square)](https://t.me/rsshub) [![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/DIYgod/RSSHub?style=flat-square&label=GitHub%20issues&logo=github)](https://github.com/DIYgod/RSSHub/issues)

### Before you begin

To create an RSS feed, you'll need to use a combination of Git, HTML, JavaScript, jQuery, and Node.js.

If you don't know much about them but would like to learn them, here are some good resources:

- [JavaScript Tutorials on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript#tutorials)
- [W3Schools](https://www.w3schools.com/)
- [Git course on Codecademy](https://www.codecademy.com/learn/learn-git)

If you'd like to see examples of how other developers use these technologies to create RSS feeds, you can take a look at some of the code in [our repository](https://github.com/DIYgod/RSSHub/tree/master/lib/routes).

### Start developing RSSHub routes

If you've found a website that doesn't offer an RSS feed, you can create an RSS rule for it using RSSHub. An RSS rule is a short Node.js program code (hereafter referred to as "route") that tells RSSHub how to extract content from a website and generate an RSS feed. By creating a new RSS route, you can help make content from your favourite websites more accessible and easier to follow.

Before you start writing an RSS route, please make sure that the source site does not provide RSS. Some web pages will include a link element with type `application/atom+xml` or `application/rss+xml` in the HTML header to indicate the RSS link.

Here's an example of what an RSS link might look like in the HTML header: `<link rel="alternate" type="application/rss+xml" href="http://example.com/rss.xml" />`. If you see a link like this, it means that the website already has an RSS feed and you don't need to create a new RSS route for it.

## Development Environment

Before you begin, it is important that your development environment set up properly.

### Install Node.js

To be able to write new RSS rules, you must first install Node.js first. RSSHub uses Node.js to run its code and create RSS feeds and requires Node v16 or above. You can download the latest LTS version of Node.js from [here](https://nodejs.org/en/download).

On Windows, you can simply download the installer and follow the steps from the installer. Remember to check the option to install **Tools for Native Modules** as well.

On macOS, you can either download the installer from the Node.js website or use [Homebrew](https://brew.sh) to install Node.js with the command `brew install node`.

On Linux, you can refer to [this page](https://nodejs.org/en/download/package-manager) to decide how to install Node.js.

### Install a code editor

To write code, you need a code editor. If you already have one, you can skip this section. If you don't have one, you can choose one from the following list:

- [Visual Studio Code](https://code.visualstudio.com)
- [WebStorm](https://www.jetbrains.com/webstorm)
- [Neovim](https://neovim.io)
- [Sublime Text](https://www.sublimetext.com)

To speed up the development process and make it easier to keep your code clean, you can install some appropriate extensions to the code editor of your choice. In the latter part of this guide, we will use Visual Studio Code as an example, you can install the following extensions:

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)(maintain consistent coding styles across different editors and IDEs)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)(identify and fix common errors in your code)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)(formats your code to make it more readable and consistent)

### Cloud hosted development environment

If you don't want to install Node.js and a code editor on your computer, you can use a cloud-hosted development environment. You may use [GitHub Codespaces](https://codespace.new/). Just click one of the buttons below to start a new workspace:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/DIYgod/RSSHub?quickstart=1)

For more information about how to use [GitHub Codespaces](https://codespace.new/), see [GitHub's documentation](https://docs.github.com/codespaces).

## Just before you start

In this tutorial, we will walk you through the process of creating an RSS feed for [GitHub Repo Issues](/routes/programming#github-repo-issues) as an example.

### Install dependencies

Before you start, you need to install the dependencies for RSSHub. You can do this using the [pnpm](https://pnpm.io/) package manager.

#### Enable pnpm

Node.js has included [Corepack](https://nodejs.org/api/corepack.html) for managing package managers since v16.13. Enable pnpm by running the following:

```
corepack enable pnpm
```

Please see the [pnpm installation page](https://pnpm.io/installation) for more details on pnpm install options.

#### Run pnpm

the following command in the root directory of RSSHub:

```bash
pnpm i
```

## Start debugging

Once you have successfully installed the dependencies, you can start debugging RSSHub by running the following command:

```bash
pnpm dev
```

Make sure to keep an eye on the console output for any error messages or other useful information that can help you diagnose and resolve issues. Additionally, don't hesitate to consult the RSSHub documentation or seek help from the community if you encounter any difficulties.

To view the result of your changes, open `http://localhost:1200` in your browser. You'll be able to see the changes you made to the code automatically reflected in the browser.

## Follow the Script Standard

It's important to ensure that all new RSS routes adhere to the [Script Standard](#script-standard). Failure to comply with this standard may result in your Pull Request not being merged in a reasonable timeframe.

The [Script Standard](#script-standard) provides guidelines for creating high-quality and reliable source code. By following these guidelines, you can ensure that your RSS feed works as intended and is easy for other community maintainers to read.

Before submitting your Pull Request, make sure to carefully review the [Script Standard](#script-standard) and ensure that your code meets all of the requirements. This will help to expedite the review process.

## Create Route

### Creating Namespace

The first step to making a new RSS route is to create a namespace. In principle, the namespace should be **the same** as the secondary domain of the main website where you are making the RSS feed. For example, if you are making an RSS feed for [https://github.com/DIYgod/RSSHub/issues](https://github.com/DIYgod/RSSHub/issues), the secondary domain is `github`. Therefore, you should create a folder named `github` under `lib/routes` as the namespace for your RSS route.

:::tip

When creating a namespace, avoid creating multiple variations for the same namespace. For example, if you are making RSS feeds for `yahoo.co.jp` and `yahoo.com`, you should use a single namespace `yahoo` rather than creating multiple namespaces like `yahoo-jp`, `yahoojp`, `yahoo.jp`, `jp.yahoo`, `yahoocojp` and so on.

:::

For BeesHub custom routes, create the namespace folder under `lib/routes-beeshub/` instead of `lib/routes/`. This is the default location for new route development.

Once you have created a namespace for the RSS route, the next step is to create the file `namespace.ts` to define the namespace.

The file should return an object that conforms to the Namespace type through a namespace. The definition of Namespace is at [/lib/types.ts](https://github.com/DIYgod/RSSHub/blob/master/lib/types.ts#L51)

- name: The human-readable name of the namespace, which will be used as the title of the document
- url: The website URL without protocol that corresponds
- description: Optional, hints and additional explanations for users using this namespace, it will be inserted into the document
- zh, zh-TW, ja: optional, support for languages other than English, it will be used to generate multilingual documents

Here is a complete example:

```ts
import type { Namespace } from '@/types';

export const namespace: Namespace = {
    name: 'GitHub',
    url: 'github.com',
    description: `
:::tip
GitHub provides some official RSS feeds:

-   Repo releases: \`https://github.com/:owner/:repo/releases.atom\`
-   Repo commits: \`https://github.com/:owner/:repo/commits.atom\`
-   User activities: \`https://github.com/:user.atom\`
-   Private feed: \`https://github.com/:user.private.atom?token=:secret\` (You can find **Subscribe to your news feed** in [dashboard](https://github.com) page after login)
-   Wiki history: \`https://github.com/:owner/:repo/wiki.atom\`
:::`,
};
```

### Creating Route

Once you have created a namespace for the route, the next step is to create a route file to register the route.

For example, if you are making an RSS feed for [GitHub Repo Issues](/routes/programming#repo-issues), and assume that you want users to enter the GitHub username and repo name, if they do not enter the repo name, they will return to RSSHub. You can register your new RSS route in /lib/routes/github/issue.ts, the file needs to return an object that conforms to the Route type through route. The definition of Route is at [/lib/types.ts](https://github.com/DIYgod/RSSHub/blob/master/lib/types.ts)

- path: The route path, using [Hono routing](https://hono.dev/api/routing) syntax
- name: The human-readable name of the route, which will be used as the title of the document and should be **different from the name of the namespace**
- url: The website URL without protocol that corresponds
- maintainers: The GitHub handle of the people responsible for maintaining this route
- example: An example URL of the route
- parameters: The description of the route parameters
- description: Optional, hints and additional explanations for users using this route, it will be inserted into the document
- categories: The classification of the route, which will be written into the corresponding classification document
- features: Some features of the route, such as what configuration items it depends on, whether it is strict anti-crawl, whether it supports a certain function and so on
- radar: Can help users subscribe to your new RSS route when using [RSSHub Radar](https://github.com/DIYgod/RSSHub-Radar) or other software compatible with its format, we will introduce it more in the following sections
- handler: The handler function of the route, we will introduce it more in the following sections

Here is a complete example:

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

In the above example, `issue` is an exact match, `:user` is a required parameter, `:repo?` is an optional parameter. `?` after `:repo` indicates that the parameter is optional

### Writing Radar Rules

In [Creating Route](#creating-Route), we mentioned that route information includes a radar field to record RSSHub Radar rules.

Take the RSS rule of `GitHub repository Issues` as an example. The code is as follows:

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

The source is an _optional_ field and should specify a URL path without the protocol name. If you do not want to match any URL paths, leave it blank. It will only appear in the `RSSHub for current website` option in the RSSHub Radar browser extension.

The source should be a string array. For example, if the source of `GitHub repository Issues` is `github.com/:user/:repo`, it means that when you visit `https://github.com/DIYgod/RSSHub`, it will match with `github.com/:user/:repo`. At this time, the returned result params will be: `{ user: 'DIYgod', repo: 'RSSHub'}`. The browser extension uses these parameters to establish an RSSHub feed address based on the target field.

#### `target`

The target is **optional** and is used to generate an RSSHub feed address, which can accept strings as input. If you do not want to create an RSSHub subscription address, leave this field blank.

For example, in the case of `GitHub repository Issues`, the corresponding route in RSSHub documentation would be `/github/issue/:user/:repo`.

After matching `user` in the source path with `DIYgod`, and matching `repo` with `RSSHub`, `:user` in the RSSHub route will be replaced by `DIYgod`, and `:repo` will be replaced by `RSSHub`, resulting in `/github/issue/DIYgod/RSSHub`.

### Debugging

If you need to debug new rules, it is recommended that you install a browser extension. You can download extension suitable for your browser at [RSSHub Radar README](https://github.com/DIYgod/RSSHub-Radar?tab=readme-ov-file#install).

Then go to settings page of extension set your local instance's address http://localhost:1200 as your "RSSHub instance", then click "Update Now", new rules will take effect.

### Writing Route Handler Function

The handler function will be passed a parameter ctx. By the end of the function, it needs to return an object that contains the information required for RSS. You can see the APIs available for ctx to use in the [Hono context documentation](https://hono.dev/api/context); The type of the return value is defined here: [/lib/types.ts](https://github.com/DIYgod/RSSHub/blob/master/lib/types.ts)

We have three common methods of data acquisition:

1.  [Via API](#via-api)
2.  [Via HTML](#via-html)
3.  [Using puppeteer](#using-puppeteer)

Next, we will continue to use GitHub repository Issues as an example to introduce how to write these three common Route Handler functions.

#### Via API

You should prioritize using APIs to obtain data, as APIs are usually easier to parse and more stable than HTML.

##### Check the API documentation

Different sites have different APIs. You can check the API documentation of the site for which you want to create an RSS feed. In this case, we will use [GitHub Issues API](https://docs.github.com/zh/rest/issues/issues#list-repository-issues).

But more often, websites do not provide open APIs. At these times, we can use browser developer tools or packet capture tools to view requests initiated by the site.

##### Basic Code

Here is some basic code to get you started:

```ts
import { Route } from '@/types';
import ofetch from '@/utils/ofetch'; // Unified request library used

export const route: Route = {
    // Write the routing information introduced in the previous text here.
    handler: (ctx) => {
        // Write the routing handler function here.
    },
};
```

##### Retrieving user input

First, we need to obtain the GitHub username and repository name from the path requested by the user. If no repository name is provided in the request, it should default to `RSSHub`. You can implement this with the following code:

```ts{4}
export const route: Route = {
    // ...
    handler: (ctx) => {
        const { user, repo = 'RSSHub' } = ctx.req.param();
    },
};
```

##### Getting data from the API

After obtaining user input, we can use it to send requests to the API. In most cases, you need to use `ofetch` (a custom [ofetch](https://github.com/unjs/ofetch) wrapper function) in `@/utils/ofetch` to send HTTP requests. For more information, please refer to the [ofetch documentation](https://github.com/unjs/ofetch).

```ts{3-8}
export const route: Route = {
    const { user, repo = 'RSSHub' } = ctx.req.param();
    // Send an HTTP GET request to the API and destructure the returned data object.
    const data = await ofetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
```

## Submit your route

Once you have finished your route, you can submit a pull request (hereafter referred to as PR) to [RSSHub](https://github.com/DIYgod/RSSHub). We use a squash merge strategy, meaning all commits in your branch will be merged into one commit on RSSHub's repository. However, keeping your commit history clean and tidy is still important. We've also provided an intuitive template for you to fill out.

### Pull Request Template

````md
<!--
If you have any difficulties in filling out this form, please refer to https://docs.rsshub.app/joinus/new-rss/submit-route
如果你在填写此表单时遇到任何困难，请参考 https://docs.rsshub.app/zh/joinus/new-rss/submit-route
-->

## Involved Issue / 该 PR 相关 Issue

Close #

## Example for the Proposed Route(s) / 路由地址示例

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

## New RSS Route Checklist / 新 RSS 路由检查表

- [ ] New Route / 新的路由
- [ ] Follows [Script Standard](https://docs.rsshub.app/joinus/advanced/script-standard) / 跟随 [路由规范](https://docs.rsshub.app/zh/joinus/advanced/script-standard)
- [ ] Documentation / 文档说明
- [ ] Full text / 全文获取
- [ ] Use cache / 使用缓存
- [ ] Anti-bot or rate limit / 反爬/频率限制
- [ ] If yes, do your code reflect this sign? / 如果有, 是否有对应的措施?
- [ ] [Date and time](https://docs.rsshub.app/joinus/advanced/pub-date) / [日期和时间](https://docs.rsshub.app/zh/joinus/advanced/pub-date)
- [ ] Parsed / 可以解析
- [ ] Correct time zone / 时区正确
- [ ] New package added / 添加了新的包
- [ ] `Puppeteer`

## Note / 说明
````

### Involved Issue

You can fill in the issue number that this PR is related to here. If there's no related issue, leave it blank. If your pull request gets merged, the related issue will be automatically closed. If you want to close multiple issues, add another `Close #` separated by a space or comma. For example, `Close #123, Close #456, Close #789` or `Close #123 Close #456 Close #789`.

### Example for the Proposed Route(s)

Here you can add the route(s) you're proposing to **add or change**, along with all required and optional parameters. If you want to add multiple routes, add each one in a new line. For example:

````md
```routes
/github/issue/DIYgod
/github/issue/DIYgod/RSSHub
/github/issue/DIYgod/RSSHub-Radar
/github/issue/flutter/flutter
```
````

**Do not** fill in `/github/issue/:user/:repo?` or `/issue/:user/:repo?`.

If your changes are not related to a route, such as documentation, you can fill in `routes` section with `NOROUTE`.

````md
```routes
NOROUTE
```
````

**Do not** delete or leave the `routes` section untouched, or your pull request will be automatically closed.

**Do not** use `NOROUTE` for route-related pull requests, or they will be automatically closed as well.

### New RSS Route Checklist

This checklist will help you ensure that your pull request includes all necessary components. Although you don't have to check off all items to get your PR merged, please make sure that your new route follows the [Script Standard](#script-standard). This is a **mandatory** requirement for all new routes.

```md
- [ ] 新的路由 New Route
```

To check off an item, replace `[ ]` with `[x]`.

## Advanced Topics

### Script Standard

#### Code Style

##### General Guidelines

- **Be consistent!**
- Avoid using deprecated features.
- Avoid modifying `yarn.lock` and `package.json`, unless you add a new dependency.
- Combine repetitive code into functions.
- Prefer higher ECMAScript Standard features over lower ones.
- Sort the entries alphabetically (uppercase first) to make it easier to find an entry.
- Use HTTPS instead of HTTP whenever possible.
- Use WebP format instead of JPG whenever possible since it offers better compression.

##### Formatting

###### Indentation

- Use 4 spaces for indentation for consistent and easy-to-read code.

###### Semicolons

- Add a semicolon at the end of each statement for improved readability and consistency.

###### String

- Use single quotes instead of double quotes whenever possible for consistency and readability.
- Use [template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals) over complex string concatenation.
- Use [template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals) for GraphQL queries as they make the code more concise and easy to read.

###### Whitespace

- Add an empty line at the end of each file.
- Avoid trailing whitespace for a clean and readable codebase.

##### Language Features

###### Casting

- Avoid re-casting the same type.

###### Functions

- Prefer [arrow functions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) over the `function` keyword.

###### Loops

- Use `for-of` instead of `for` for arrays ([javascript:S4138](https://rules.sonarsource.com/javascript/RSPEC-4138)).

###### Variables

- Use `const` and `let` instead of `var`.
- Declare one variable per declaration.

##### Naming

- Use `lowerCamelCase` for variables and functions to adhere to standard naming conventions.
- Use `kebab-case` for files and folders.
- Use `CONSTANT_CASE` for constants.

### Using Cache

RSSHub have a cache module that expires after a short duration. You can change how long the cache lasts by modifying the `CACHE_EXPIRE` value in the `lib/config.ts` file using environment variables. However, for interfaces that have less frequently updated content, it's better to specify a longer cache expiration time using `CACHE_CONTENT_EXPIRE` instead.

For example, to retrieve the full text of the first comment for each issue, you can make a request to `${baseUrl}/${user}/${repo}/issues/${id}`, since this data is unavailable through `${baseUrl}/${user}/${repo}/issues`. It's recommended to store this data in the cache to avoid making repeated requests to the server.

Here's an example of how you can use the cache to retrieve the data:

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

The above code snippet from [Create Your Own RSSHub Route](#create-route) shows how to use the cache to get the full text of the first comment of each issue. `cache.tryGet()` is used to determine if the data is already available within the cache. If it's not, the code retrieves the data and stores it in the cache.

:::warning

Any assignments to variables that are declared outside of the `tryGet()` function will not be processed under a cache-hit scenario. For example, the following code will not work as expected:

```js
    let x = '1';
    const z = await cache.tryGet('cache:key', async () => {
        x = '2';
        const y = '3';
        return y;
    })
    console.log(x); // cache miss: '2', cache hit: '1'
    console.log(z): // '3'
```

:::

#### API

[lib/middleware/cache/index.ts](https://github.com/DIYgod/RSSHub/tree/master/lib/utils/cache)

##### cache.tryGet(key, getValueFunc [, maxAge [, refresh ]])

###### Parameters

| Name         | Type                   | Description                                                                                                      |
| ------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| key          | `string`               | _(Required)_ The key used to store and retrieve the cache. You can use `:` as a separator to create a hierarchy. |
| getValueFunc | `function` \| `string` | _(Required)_ A function that returns data to be cached when a cache miss occurs.                                 |
| maxAge       | `number`               | _(Optional)_ The maximum age of the cache in seconds. If not specified, `CACHE_CONTENT_EXPIRE` will be used.     |
| refresh      | `boolean`              | _(Optional)_ Whether to renew the cache expiration time when the cache is hit. `true` by default.                |

:::tip

Below are advanced methods for using cache. You should use `cache.tryGet()` most of time.

Note that you need to use `JSON.parse()` when retrieving the cache using `cache.get()`.

:::

##### cache.get(key [, refresh ])

###### Parameters

| Name    | Type      | Description                                                                                            |
| ------- | --------- | ------------------------------------------------------------------------------------------------------ |
| key     | `string`  | _(Required)_ The key used to retrieve the cache. You can use `:` as a separator to create a hierarchy. |
| refresh | `boolean` | _(Optional)_ Whether to renew the cache expiration time when the cache is hit. `true` by default.      |

##### cache.set(key, value [, maxAge ])

###### Parameters

| Name   | Type                  | Description                                                                                                  |
| ------ | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| key    | `string`              | _(Required)_ The key used to store the cache. You can use `:` as a separator to create a hierarchy.          |
| value  | `function`\| `string` | _(Required)_ The value to be cached.                                                                         |
| maxAge | `number`              | _(Optional)_ The maximum age of the cache in seconds. If not specified, `CACHE_CONTENT_EXPIRE` will be used. |

### Date Handling

When you visit a website, the website usually provides you with a date or timestamp. This tutorial will show you how to properly handle them in your code.

#### The Standard

##### No Date

- **Do not** add a date when a website does not provide one. Leave the `pubDate` field undefined.
- Parse only the date and **do not add a time** to the `pubDate` field when a website provides a date but not an accurate time.

The `pubDate` field must be a:

1.  [Date Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)
2.  **Not recommended. Only use for compatibility**: Strings that can be parsed correctly because their behavior can be inconsistent across deployment environments. Use `Date.parse()` with caution.

The `pubDate` passed from the route script should correspond to the time zone/time used by the server. For more details, see the following:

#### Use utilities class

We recommend using [day.js](https://github.com/iamkun/dayjs) for date processing and time zone adjustment. There are two related utility classes:

##### Date and Time

The RSSHub utility class includes a wrapper for [day.js](https://github.com/iamkun/dayjs) that allows you to easily parse date strings and obtain a [Date Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) in most cases.

```js
import { parseDate } from '@/utils/parse-date';

const pubDate = parseDate('2020/12/30');
// OR
const pubDate = parseDate('2020/12/30', 'YYYY/MM/DD');
```

:::tip

You can refer to the [day.js documentation](https://day.js.org/docs/en/parse/string-format#list-of-all-available-parsing-tokens) for all available date formats.

:::

If you need to parse a relative date, use `parseRelativeDate`.

```js
import { parseRelativeDate } from '@/utils/parse-date';

const pubDate = parseRelativeDate('2 days ago');
const pubDate = parseRelativeDate('day before yesterday 15:36');
```

##### Timezone

When parsing dates from websites, it's important to consider time zones. Some websites may not convert the time zone according to the visitor's location, resulting in a date that doesn't accurately reflect the user's local time. To avoid this issue, you can manually specify the time zone.

To manually specify the time zone in your code, use the following code:

```js
import timezone from '@/utils/timezone';

const pubDate = timezone(parseDate('2020/12/30 13:00'), +1);
```

The timezone function takes two parameters: the first is the original [Date Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date), and the second is the time zone offset. The offset is specified in hours, so in this example, a time zone of UTC+1 is used.

By doing this, the time will be converted to server time and it will facilitate middleware processing.

### Debugging

When debugging your code, you can use more than just `console.log` or attaching the node process to a debugger. You can also use the following methods for debugging.

Note: The following methods are only effective when the instance is running with `debugInfo=true`.

#### Using `ctx.set('json', obj)`

To pass a custom object to `ctx.set('json', obj)` for debugging, follow these steps:

1.  Create your custom object.
2.  Pass your object to `ctx.set('json', obj)`.
3.  Access the corresponding route with query string `format=debug.json` to view your object. For example, if you want to debug the route `/furstar/characters/:lang?`, you can access the URL: `/furstar/characters/en?format=debug.json`

Here's an example of how to use `ctx.set('json', obj)` taken from [furstar/index.ts](https://github.com/DIYgod/RSSHub/blob/master/lib/routes/furstar/index.ts)

```js
const info = utils.fetchAllCharacters(res.data, base);

ctx.set('json', {
    info,
});
```

In the example above, we're passing the `info` object to `ctx.set('json', obj)`, which we can then access using the corresponding route with query string `format=debug.json`.

#### debug.html

In order to quickly test if the `description` in `ctx.set('data', obj)` is correct, you can use the query string `format={index}.debug.html` to obtain the HTML of the corresponding entry. The link can be directly opened in the browser to preview the rendering result.

Usage: Access the corresponding route with query string `format={index}.debug.html`, where `{index}` is the item number (starting from 0) in your `data.item`. And the data corresponds to the `data.item[index].description` information will be returned as route result.

### RSS Feed Fundamentals

This guide is intended for advanced users who want to know how to create an RSS feed in detail. If you're new to creating RSS feeds, we recommend reading [Create Your Own RSSHub Route](#create-route) first.

Once you have collected the data you want to include in your RSS feed, you can return it. RSSHub's middleware [`template.tsx`](https://github.com/DIYgod/RSSHub/blob/master/lib/middleware/template.tsx) will then process the data and render the RSS output in the required format (which is RSS 2.0 by default). In addition to the fields mentioned in [Create your own RSSHub route](#create-route), you can customize your RSS feed further using the following fields.

It's important to note that not all fields are applicable to all output formats since RSSHub supports multiple output formats. The table below shows which fields are compatible with different output formats. We use the following symbols to denote compatibility: `A` for Atom, `J` for JSON Feed, `R` for RSS 2.0.

#### Channel level

The following table lists the fields you can use to customize your RSS feed at channel level:

| Field                 | Description                                                                                                                                                             | Default                                   | Compatibility |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------- | :------------ |
| **`title`**           | _(Recommended)_ The name of the feed, which should be plain text only                                                                                                   | `RSSHub`                                  | A, J, R       |
| **`link`**            | _(Recommended)_ The URL of the website associated with the feed, which should link to a human-readable website                                                          | `https://rsshub.app`                      | A, J, R       |
| **`description`**     | _(Optional)_ The summary of the feed, which should be plain text only                                                                                                   | If not specified, defaults to **`title`** | J, R          |
| **`language`**        | _(Optional)_ The primary language of the feed, which should be a value from [RSS Language Codes](https://www.rssboard.org/rss-language-codes) or ISO 639 language codes | `zh-cn`                                   | J, R          |
| **`image`**           | _(Recommended)_ The URL of the image that represents the channel, which should be relatively large and square                                                           | `undefinded`                              | J, R          |
| **`icon`**            | _(Optional)_ The icon of an Atom feed                                                                                                                                   | `undefinded`                              | J             |
| **`logo`**            | _(Optional)_ The logo of an RSS feed                                                                                                                                    | `undefinded`                              | J             |
| **`subtitle`**        | _(Optional)_ The subtitle of an Atom feed                                                                                                                               | `undefinded`                              | A             |
| **`author`**          | _(Optional)_ The author of an Atom feed or the authors of a JSON feed                                                                                                   | `RSSHub`                                  | A, J          |
| **`itunes_author`**   | _(Optional)_ The author of a podcast feed                                                                                                                               | `undefinded`                              | R             |
| **`itunes_category`** | _(Optional)_ The category of a podcast feed                                                                                                                             | `undefinded`                              | R             |
| **`itunes_explicit`** | _(Optional)_ Use this to indicate that a feed contains [explicit](https://help.apple.com/itc/podcasts_connect/#/itcfafb6d665) content.                                  | `undefinded`                              | R             |
| **`allowEmpty`**      | _(Optional)_ Whether to allow empty feeds. If set to `true`, the feed will be generated even if there are no items                                                      | `undefinded`                              | A, J, R       |

Each item in an RSS feed is represented by an object with a set of fields that describe it. The table below lists the available fields:

| Field                   | Description                                                                                                                                                                                                 | Default      | Compatibility |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- | :------------ | ---------- | ------- |
| **`title`**             | _(Required)_ The title of the item, which should be plain text only                                                                                                                                         | `undefinded` | A, J, R       |
| **`link`**              | _(Recommended)_ The URL of the item, which should link to a human-readable website                                                                                                                          | `undefinded` | A, J, R       |
| **`description`**       | _(Recommended)_ The content of the item. For an Atom feed, it's the `atom:content` element. For a JSON feed, it's the `content_html` field                                                                  | `undefinded` | A, J, R       |
| **`author`**            | _(Optional)_ The author of the item                                                                                                                                                                         | `undefinded` | A, J, R       |
| **`category`**          | _(Optional)_ The category of the item. You can use a plain string or an array of strings                                                                                                                    | `undefinded` | A, J, R       |
| **`guid`**              | _(Optional)_ The unique identifier of the item                                                                                                                                                              | \*\*`link    |               | title`\*\* | A, J, R |
| **`pubDate`**           | _(Recommended)_ The publication date of the item, which should be a [Date object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) following [the standard](#date-handling) | `undefinded` | A, J, R       |
| **`updated`**           | _(Optional)_ The date of the last modification of the item, which should be a [Date object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)                                | `undefinded` | A, J          |
| **`itunes_item_image`** | _(Optional)_ The URL of an image associated with the item                                                                                                                                                   | `undefinded` | R             |
| **`itunes_duration`**   | _(Optional)_ The length of an audio or video item in seconds (or in the format H:mm:ss), which should be a number or string                                                                                 | `undefinded` | J, R          |
| **`enclosure_url`**     | _(Optional)_ The URL of an enclosure associated with the item                                                                                                                                               | `undefinded` | J, R          |
| **`enclosure_length`**  | _(Optional)_ The size of the enclosure file in **byte**, which should be a number                                                                                                                           | `undefinded` | J, R          |
| **`enclosure_type`**    | _(Optional)_ The MIME type of the enclosure file, which should be a string                                                                                                                                  | `undefinded` | J, R          |
| **`upvotes`**           | _(Optional)_ The number of upvotes the item has received, which should be a number                                                                                                                          | `undefinded` | A             |
| **`downvotes`**         | _(Optional)_ The number of downvotes the item has received, which should be a number                                                                                                                        | `undefinded` | A             |
| **`comments`**          | _(Optional)_ The number of comments for the item, which should be a number                                                                                                                                  | `undefinded` | A             |
| **`media.*`**           | _(Optional)_ The media associated with the item. See [Media RSS](https://www.rssboard.org/media-rss) for more details                                                                                       | `undefinded` | R             |
| **`doi`**               | _(Optional)_ The Digital Object Identifier of the item, which should be a string in the format `10.xxxx/xxxxx.xxxx`                                                                                         | `undefinded` | R             |

:::warning Formatting Considerations

When specifying certain fields in an RSS feed, it's important to keep in mind some formatting considerations. Specifically, you should avoid including any linebreaks, consecutive whitespace, or leading/trailing whitespace in the following fields: **`title`**, **`subtitle`** (only for Atom), **`author`** (only for Atom), **`item.title`**, and **`item.author`**.

While most RSS readers will automatically trim these fields, some may not process them properly. Therefore, to ensure compatibility with all RSS readers, we recommend trimming these fields before outputting them. If your route cannot tolerate trimming these fields, you should consider changing their format.

Additionally, while other fields will not be forced to be trimmed, we suggest avoiding violations of the above formatting rules as much as possible. If you are using Cheerio to extract content from web pages, be aware that Cheerio will retain line breaks and indentation. For the **`item.description`** field, in particular, any intended linebreaks should be converted to `<br>` tags to prevent them from being trimmed by the RSS reader. If you're extracting an RSS feed from JSON data, be aware that the JSON may contain linebreaks that need to be displayed, so you should convert them to `<br>` tags in this case.

It's important to keep these formatting considerations in mind to ensure your RSS feed is compatible with all RSS readers.

:::

#### Create a BitTorrent/Magnet Feed

RSSHub allows you to create BitTorrent/Magnet feeds, which can be useful for triggering automated downloads. To create a BitTorrent/Magnet feed, you'll need to add **additional** fields to your RSS feed that are in accordance with many downloaders' subscription formats.

Here's an example of how to create a BitTorrent/Magnet feed:

```js
return {
    item: [
        {
            enclosure_url: '', // This should be the Magnet URI
            enclosure_length: '', // The file size in bytes (this field is optional)
            enclosure_type: 'application/x-bittorrent', // This field should be fixed to 'application/x-bittorrent'
        },
    ],
};
```

By including these fields in your RSS feed, you'll be able to create BitTorrent/Magnet feeds that can be automatically downloaded by compatible downloaders.

##### Update the documentation

If you're adding support for BitTorrent/Magnet feeds in your RSSHub route, it's important to update the documentation to reflect this change. To do this, you'll need to set the `supportBT` attribute of `features` in the `Route` export object to `true`. Here's an example:

```ts
export const route: Route = {
    // ...
    features: {
        // ...
        supportBT: true,
    },
};
```
