import type { Route } from '@/types';
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

        // Fetch latest 100 posts
        const posts = await ofetch(`${rootUrl}/wp-json/wp/v2/posts`, {
            query: {
                order_by: 'date',
                order: 'desc',
                per_page: 100,
                _fields: 'id,date,title,link,categories,tags,excerpt,featured_media',
            },
        });

        // Collect unique IDs
        const categoryIds = [...new Set(posts.flatMap((post) => post.categories))];
        const tagIds = [...new Set(posts.flatMap((post) => post.tags))];
        const mediaIds = [...new Set(posts.map((post) => post.featured_media).filter(Boolean))];

        // Batch fetch categories, tags, and media with pagination
        const fetchWithPagination = async (endpoint: string, ids: number[]) => {
            const promises = [];
            for (let i = 0; i < ids.length; i += 100) {
                const batchIds = ids.slice(i, i + 100);
                promises.push(
                    ofetch(`${rootUrl}${endpoint}`, {
                        query: {
                            _fields: endpoint.includes('media') ? 'id,media_details' : 'id,name',
                            per_page: 100,
                            include: batchIds.join(','),
                        },
                    })
                );
            }
            const results = await Promise.all(promises);
            return results.flat();
        };

        const [categories, tags, medias] = await Promise.all([
            categoryIds.length ? fetchWithPagination('/wp-json/wp/v2/categories', categoryIds) : [],
            tagIds.length ? fetchWithPagination('/wp-json/wp/v2/tags', tagIds) : [],
            mediaIds.length ? fetchWithPagination('/wp-json/wp/v2/media', mediaIds) : [],
        ]);

        // Create maps for quick lookup
        const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));
        const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));
        const mediaMap = new Map(medias.map((media) => [media.id, media.media_details]));

        // Build items
        const items = posts.map((post) => {
            const pubDate = parseDate(post.date);
            const categoryNames = post.categories.map((id) => categoryMap.get(id)).filter(Boolean);
            const tagNames = post.tags.map((id) => tagMap.get(id)).filter(Boolean);
            const media = mediaMap.get(post.featured_media);
            const thumbnailUrl = media?.sizes?.['post-thumbnail']?.source_url || (media?.file ? `https://www.archcollege.com/wp-content/uploads/${media.file}` : undefined);
            const images = thumbnailUrl ? [{ src: thumbnailUrl }] : [];

            return {
                guid: 'archcollege-post-' + post.id,
                title: post.title.rendered,
                link: post.link,
                pubDate: pubDate ? timezone(pubDate, +8) : undefined,
                category: [...categoryNames, ...tagNames],
                description: renderDescription({
                    images,
                    description: post.excerpt.rendered,
                }),
                image: thumbnailUrl
            };
        });

        return {
            title: 'ArchCollege建筑学院',
            link: rootUrl,
            item: items,
        };
    },
};
