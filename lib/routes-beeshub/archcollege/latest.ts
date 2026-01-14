import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';

import type { Route } from '@/types';
import { solveAntiCC } from '@/utils/anticc';
import cache from '@/utils/cache';
import logger from '@/utils/logger';
import ofetch from '@/utils/ofetch';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

import { renderDescription } from './templates/description';

export const route: Route = {
    path: '/latest',
    categories: ['design'],
    example: '/archcollege/latest',
    parameters: {},
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
            source: ['archcollege.com/'],
            target: '/latest',
        },
    ],
    name: '今日最新',
    maintainers: [],
    handler: async () => {
        const rootUrl = 'https://www.archcollege.com';
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Referer': rootUrl,
        };

        let response = await ofetch(rootUrl, { headers });
        const antiCCUrl = solveAntiCC(response);
        if (antiCCUrl) {
            const redirectUrl = antiCCUrl.startsWith('http') ? antiCCUrl : new URL(antiCCUrl, rootUrl).href;
            response = await ofetch(redirectUrl, { headers });
        }

        const $ = load(response);
        const list = $('.post-loop-image .item')
            .toArray()
            .map((item) => {
                const $item = $(item);
                const linkElem = $item.find('.item-wrap, .item-thumb').first();
                const title = $item.find('.item-title').text().trim() || linkElem.attr('title') || '';
                const link = linkElem.attr('href');

                const itemImg = $item.find('.item-img, .item-thumb');
                const thumb = itemImg.attr('data-original') || itemImg.find('img').attr('data-original') || itemImg.find('img').attr('data-src') || itemImg.find('img').attr('src');

                const author = $item.find('.item-meta-author').text().trim();
                const category = $item.find('.item-category').text().trim();

                return {
                    title: title.startsWith('置顶') ? title.slice(2).trimStart() : title,
                    link,
                    author,
                    category,
                    thumb,
                };
            })
            .filter((item) => item.link);
        // logger.debug(list);

        const items = await Promise.all(
            list.map((item) =>
                cache.tryGet(item.link!, async () => {
                    let detailResponse = await ofetch(item.link!, { headers });
                    const antiCCUrl = solveAntiCC(detailResponse);
                    if (antiCCUrl) {
                        const redirectUrl = antiCCUrl.startsWith('http') ? antiCCUrl : new URL(antiCCUrl, item.link!).href;
                        detailResponse = await ofetch(redirectUrl, { headers });
                    }
                    const $detail = load(detailResponse);

                    // Extract date
                    const dateStr = $detail('time.entry-date').attr('datetime') || $detail('time').attr('datetime');
                    const pubDate = dateStr ? parseDate(dateStr) : undefined;

                    // Extract summary
                    const summary = $detail('.entry-excerpt.entry-summary').html() || '';

                    // Extract innermost entry-content
                    let $content = $detail('.entry-content');
                    while ($content.find('.entry-content').length > 0) {
                        $content = $content.find('.entry-content').first();
                    }

                    // Clean up content
                    $content.find('.elementor-icon-list-icon > svg').remove();

                    const contentHtml = $content.html() || '';
                    // logger.debug(sanitizeHtml.defaults.allowedTags)
                    // const contentHtml = sanitizeHtml($content.html() || '', { allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'] });

                    // Extract author if not found in list
                    const author = item.author || $detail('.nickname').text().trim() || $detail('.entry-meta-author').text().trim();

                    return {
                        title: item.title,
                        link: item.link,
                        author,
                        category: item.category ? [item.category] : [],
                        pubDate: pubDate ? timezone(pubDate, +8) : undefined,
                        description: renderDescription({
                            images: item.thumb ? [{ src: item.thumb }] : [],
                            description: (summary ? `<blockquote>${summary}</blockquote>` : '') + contentHtml,
                        }),
                    };
                })
            )
        );

        return {
            title: 'ArchCollege - 今日最新',
            link: rootUrl,
            item: items,
        };
    },
};
