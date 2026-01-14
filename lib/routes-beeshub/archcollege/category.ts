import { load } from 'cheerio';

import type { Route } from '@/types';
import { solveAntiCC } from '@/utils/anticc';
import cache from '@/utils/cache';
import ofetch from '@/utils/ofetch';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

import { renderDescription } from './templates/description';

export const route: Route = {
    path: '/category/:category{.+}?',
    categories: ['design'],
    example: '/archcollege/category/architectural-design',
    parameters: { category: 'Category ID, can be found in the URL. Leave empty for all latest articles.' },
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
            source: ['archcollege.com/category/:category{.+}?', 'archcollege.com/'],
            target: '/category/:category',
        },
    ],
    name: 'Category',
    maintainers: [],
    handler: async (ctx) => {
        const category = ctx.req.param('category');
        const rootUrl = 'https://www.archcollege.com';
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Referer': rootUrl,
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
        };

        if (!category) {
            // Fetch category list from sitemap
            const sitemapUrl = `${rootUrl}/category-sitemap.xml`;
            const response = await ofetch(sitemapUrl, { headers });
            const $ = load(response, { xmlMode: true });
            const urls = $('url loc')
                .toArray()
                .map((el) => $(el).text())
                .filter((loc) => loc.startsWith(`${rootUrl}/category/`));

            const items = urls.map((loc) => {
                const categoryPath = loc.replace(`${rootUrl}/category/`, '');
                const decodedPath = decodeURIComponent(categoryPath);
                return {
                    title: decodedPath,
                    link: loc,
                    description: `Category: ${decodedPath}<br>RSS Feed: /archcollege/category/${categoryPath}`,
                };
            });

            return {
                title: 'ArchCollege - 分类目录',
                link: sitemapUrl,
                item: items,
                allowEmpty: true,
            };
        }

        // Fetch articles for specific category
        const url = `${rootUrl}/category/${encodeURI(category)}`;
        let response = await ofetch(url, { headers });
        const antiCCUrl = solveAntiCC(response);
        if (antiCCUrl) {
            const redirectUrl = antiCCUrl.startsWith('http') ? antiCCUrl : new URL(antiCCUrl, url).href;
            response = await ofetch(redirectUrl, { headers });
        }
        const $ = load(response);

        const list = $('.post-loop .item, .post-loop .post-item')
            .toArray()
            .map((item) => {
                const $item = $(item);
                const titleElem = $item.find('.item-title');

                // Refined Title and Link extraction
                const title = titleElem.text().trim() || $item.find('a.item-wrap').attr('title') || '';
                let link = $item.find('a.item-wrap').attr('href') || titleElem.find('a').attr('href');
                if (!link) {
                    link = $item.find('a').first().attr('href');
                }

                // Initial fallback date from the list page with robust selectors
                const dateText = (
                    $item.find('.item-meta-date').text() ||
                    $item.find('.item-meta .date').text() ||
                    $item.find('.item-meta-right').text() ||
                    $item.find('.item-meta span').last().text()
                )
                    .trim()
                    .replace('•', '')
                    .trim();

                return {
                    title,
                    link,
                    pubDate: timezone(parseDate(dateText), +8),
                };
            });

        const validList = list
            .filter((item) => item.link)
            .slice(0, 20) as Array<{
                title: string;
                link: string;
                pubDate: Date;
                description?: string;
                author?: string;
                media?: any;
            }>;

        const items = await Promise.all(
            validList.map((item) =>
                cache.tryGet(item.link, async () => {
                    let detailResponse = await ofetch(item.link, { headers });
                    const antiCCUrl = solveAntiCC(detailResponse);
                    if (antiCCUrl) {
                        const redirectUrl = antiCCUrl.startsWith('http') ? antiCCUrl : new URL(antiCCUrl, item.link).href;
                        detailResponse = await ofetch(redirectUrl, { headers });
                    }
                    const $detail = load(detailResponse);
                    const $content = $detail('.entry-content');

                    const images = $content
                        .find('img')
                        .toArray()
                        .map((img) => {
                            const $img = $detail(img);
                            return {
                                src: $img.attr('data-src') || $img.attr('data-original') || $img.attr('data-lazy-src') || $img.attr('src'),
                                alt: $img.attr('alt'),
                            };
                        })
                        .filter((img) => img.src);

                    item.description = renderDescription({
                        images,
                        description: $content.html() || '',
                    });
                    item.author = $detail('.nickname').text();

                    const dateStr = $detail('.entry-date').attr('datetime');
                    if (dateStr) {
                        item.pubDate = parseDate(dateStr);
                    }

                    // Media RSS support
                    if (images.length > 0) {
                        item.media = {
                            content: images.map((img) => ({
                                url: img.src,
                                type: 'image',
                            })),
                        };
                    }

                    return item;
                })
            )
        );

        return {
            title: `ArchCollege - ${category ? $('h1').text() || decodeURIComponent(category) : '今日最新'}`,
            link: url,
            item: items,
            allowEmpty: true,
        };
    },
};
