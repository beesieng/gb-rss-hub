import type { Route } from '@/types';
import cache from '@/utils/cache';
import ofetch from '@/utils/ofetch';
import { parseDate } from '@/utils/parse-date';

import { renderDescription } from './templates/description';

export const route: Route = {
    path: '/latest',
    categories: ['design'],
    example: '/gooood/latest',
    parameters: {},
    features: {
        requireConfig: [],
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['www.gooood.cn'],
            target: '/latest',
        },
    ],
    name: '最新文章',
    maintainers: [],
    handler: async () => {
        const baseUrl = 'https://dashboard.gooood.cn';
        const apiUrl = `${baseUrl}/wp-json/wp/v2/posts?categories=36119`;

        const posts = await ofetch(apiUrl);

        const list = await Promise.all(
            posts.map(async (post: any) => {
                const title = post.title.rendered;
                const link = post.link;
                const pubDate = parseDate(post.date);
                const excerpt = post.excerpt.rendered;

                let image = '';
                if (post.featured_media) {
                    const media = await cache.tryGet(`gooood-media-${post.featured_media}`, async () => ofetch(`${baseUrl}/wp-json/wp/v2/media/${post.featured_media}`));
                    image = media?.source_url || '';
                }

                let authorName = '';
                if (post.author) {
                    const author = await cache.tryGet(`gooood-author-${post.author}`, async () => ofetch(`${baseUrl}/wp-json/wp/v2/users/${post.author}`));
                    authorName = author?.name || '';
                }

                const description = renderDescription({
                    images: image ? [{ src: image }] : [],
                    description: `${authorName ? `<p>By ${authorName}</p>` : ''}${excerpt}`,
                });

                return {
                    title,
                    link,
                    pubDate,
                    description,
                    author: authorName,
                };
            })
        );

        return {
            title: 'Gooood - 最新文章',
            link: 'https://www.gooood.cn',
            item: list,
        };
    },
};