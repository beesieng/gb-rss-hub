# RSSHub Copilot Instructions

## Overview

RSSHub aggregates content from websites into RSS feeds using web scraping and APIs. Routes are organized by namespace (domain) in `lib/routes/` and `lib/routes-beeshub/`. The `routes-beeshub` directory is used for custom routes developed by the BeesHub team, and is the default location for new route development.

## Architecture

- **Framework**: Hono web server with middleware stack (cache, access control, anti-hotlink, etc.)
- **Routes**: `lib/routes/{namespace}/` and `lib/routes-beeshub/{namespace}/` folders with `namespace.ts` metadata and route files exporting `Route` objects
- **Data Flow**: Handler fetches/scrapes data → returns `Data` with `title`, `link`, `item[]` (each with `title`, `description`, `link`, `pubDate`)
- **Deployment**: Node.js, Cloudflare Workers, Vercel; built with tsdown

## Development Workflow

- **Dev Server**: `pnpm dev` (tsx watch with hot reload)
- **Build**: `pnpm build` (builds routes index, then tsdown)
- **Test**: `pnpm test` (lint + vitest coverage)
- **Format**: `pnpm format` (ESLint + Prettier)
- Routes auto-discovered via `directoryImport` in `lib/registry.ts`

## Route Development

- **Structure**: Create `lib/routes-beeshub/{domain}/namespace.ts` + route files (e.g., `index.ts`) for new custom routes
- **Handler**: Async function taking Hono `Context`, returning `Data | null`
- **Scraping**: Use `cheerio` for HTML parsing, `ofetch` for HTTP requests
- **Caching**: `cache.tryGet(url, async () => { ... })` for article details
- **Data Types**: Strict `DataItem` interface - only defined properties allowed

## Key Conventions

- **Imports**: `import type { ... }` for types, sorted alphabetically
- **Variables**: `camelCase` (not `snake_case`)
- **Templates**: Avoid unnecessary template literals for static strings
- **HTML Parsing**: Reuse `$` object from `cheerio.load()`, don't call `load()` multiple times
- **Async**: `await page.close()` and `await browser.close()` for Puppeteer
- **Null Checks**: Omit properties instead of setting to `null`
- **Strings**: Use `startsWith()` for prefix checks
- **Conditionals**: Combine with `||` or `??` operators

## Common Patterns

- **API vs Scraping**: Prefer APIs when available (check network tab)
- **Pagination**: Only fetch first page for RSS feeds
- **Parameters**: Use path params `:param` instead of query strings
- **Filtering**: No custom filters - users handle via RSS readers
- **Dates**: Always include `pubDate`, use `parseDate()` utility
- **Unique Links**: Ensure `link` is unique (becomes RSS `guid`)
- **Human Links**: Feed `link` should be webpage URL, not API endpoint

## Configuration

- **Env Vars**: Extensive config in `lib/config.ts` for proxies, caching, auth, etc.
- **Features**: Set `requirePuppeteer: true` only if actually used
- **Radar**: Define `radar[]` with relative source paths, matching target routes

## Testing & Quality

- **Vitest**: Unit tests for routes and utilities
- **Linting**: ESLint with strict rules, auto-fixable
- **Coverage**: Required for CI, run `pnpm vitest:coverage`
- **Review**: Follow all guidelines in `AGENTS.md` before PR

## Resources

- [Route Development Guide](docs/ROUTE_DEVELOPMENT_GUIDE_EN.md)
- [API Docs](https://docs.rsshub.app)
- [Community](https://t.me/rsshub)
