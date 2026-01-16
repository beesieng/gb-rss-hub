import type { Route } from '@/types';
import { parseDate } from '@/utils/parse-date';
import parser from '@/utils/rss-parser';

export const route: Route = {
    path: '/',
    categories: ['design'],
    example: '/archdaily',
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
            source: ['feeds.feedburner.com/Archdaily'],
            target: '/archdaily',
        },
    ],
    name: 'Global',
    maintainers: [],
    handler,
    description: 'ArchDaily Global RSS Feed',
};

async function handler() {
    const feed = await parser.parseURL('https://feeds.feedburner.com/Archdaily');

    const items = feed.items.map((item) => ({
        title: item.title,
        description: item['content:encoded'] || item.content || item.description,
        link: item.link,
        pubDate: parseDate(item.pubDate),
        author: item.creator || item.author,
        category: item.categories,
        guid: item.guid,
    }));

    return {
        title: feed.title,
        link: feed.link,
        description: feed.description,
        item: items,
    };
}