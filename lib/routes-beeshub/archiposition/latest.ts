import { load } from 'cheerio';

import type { Route } from '@/types';
import logger from '@/utils/logger';
import ofetch from '@/utils/ofetch';
import { parseDate } from '@/utils/parse-date';

import { renderDescription } from './templates/description';

export const route: Route = {
    path: '/latest',
    categories: ['other'],
    example: '/archiposition/latest',
    parameters: {},
    features: {
        requireConfig: [
            {
                name: 'ALLOW_USER_HOTLINK_TEMPLATE',
                optional: true,
                description: '设置为`true`并添加`image_hotlink_template`参数来代理图片',
            },
        ],
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['www.archiposition.com'],
            target: '/latest',
        },
    ],
    name: '最新资讯',
    maintainers: [],
    handler: async () => {
        const rootUrl = 'https://www.archiposition.com';
        const apiUrl = `${rootUrl}/wp-admin/admin-ajax.php?action=load_category&ajax=1&categoryId=1675&limit=50`;

        const response = await ofetch(apiUrl);
        const $ = load(response);

        const list = $('.index-feed-item')
            .toArray()
            .map((item) => {
                const $item = $(item);
                const href = $item.attr('href');
                const url = href ? `${rootUrl}${href}` : '';
                const title = $item.find('.index-feed-title').attr('title') || '';
                const pubDateStr = $item.attr('data-date');
                const description = $item.find('.index-feed-detail').text().trim();
                const category = $item.find('.index-feed-label span').text().trim();
                const id = $item.attr('data-id');
                const img = $item.find('img').attr('src');
                // replace thumb size to get a smaller image
                const thumb = img ? img.replace(/w_\d+,h_\d+/, 'w_320,h_240') : undefined;
                // logger.debug(thumb);

                if (!title || !url) {
                    return null;
                }

                return {
                    title,
                    link: url,
                    pubDate: pubDateStr ? parseDate(pubDateStr) : undefined,
                    description: renderDescription({
                                                images: img ? [{ src: img }] : [],
                                                description: (description ? `<blockquote>${description}</blockquote>` : ''),
                                            }),
                    category: category ? [category] : [],
                    id,
                    image: thumb,
                };
            })
            .filter((item) => item !== null);

        return {
            title: 'Archiposition - 最新资讯',
            link: rootUrl,
            item: list,
        };
    },
};