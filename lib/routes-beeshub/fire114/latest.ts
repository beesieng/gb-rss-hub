import { load } from 'cheerio';

import type { Route } from '@/types';
import cache from '@/utils/cache';
import ofetch from '@/utils/ofetch';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

export const route: Route = {
    path: '/latest',
    categories: ['other'],
    example: '/fire114/latest',
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
            source: ['fire114.cn/index/article/index'],
            target: '/latest',
        },
    ],
    name: '最新资讯',
    maintainers: [],
    handler: async () => {
        const rootUrl = 'https://www.fire114.cn';
        const apiUrl = `${rootUrl}/index/article/articleList?t=0&p=1`;

        const response = await ofetch(apiUrl);
        const data = JSON.parse(response);

        const list = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            link: `${rootUrl}/index/article/detail?i=${item.id}`,
            summary: item.summary,
            thumb: item._face?.ico?.public_src ? `${rootUrl}${item._face.ico.public_src}` : undefined,
            pubDate: item.create_time ? parseDate(item.create_time) : undefined,
            keywords: item._keywords || [],
        }));

        const items = await Promise.all(
            list.map((item: any) =>
                cache.tryGet(item.link, async () => {
                    const detailResponse = await ofetch(item.link);
                    const $detail = load(detailResponse);

                    const title = $detail('.ls_mid_title').text().trim() || item.title;
                    const dateStr = $detail('.ls_mid_info > span:first-child').text().trim();
                    const pubDate = dateStr ? parseDate(dateStr) : item.pubDate;

                    const $content = $detail('.ls_mid_content');
                    const contentHtml = $content.html() || '';

                    return {
                        title,
                        link: item.link,
                        pubDate: pubDate ? timezone(pubDate, +8) : undefined,
                        description: item.summary ? `<p>${item.summary}</p>${contentHtml}` : contentHtml,
                        category: item.keywords,
                        // image: item.thumb,
                    };
                })
            )
        );

        return {
            title: 'Fire114 - 最新资讯',
            link: `${rootUrl}/index/article/index`,
            item: items,
        };
    },
};