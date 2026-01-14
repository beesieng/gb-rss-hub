import type { Data, Route } from '@/types';
import cache from '@/utils/cache';

import { route as archcollegeRoute } from '../archcollege/latest';
import { route as archipositionRoute } from '../archiposition/latest';
import { route as fire114Route } from '../fire114/latest';
import { route as goooodRoute } from '../gooood/latest';

export const route: Route = {
    path: '/',
    example: '/beeshub',
    name: 'BeesHub聚合',
    maintainers: [],
    handler: async (ctx) => await cache.tryGet('beeshub', async () => {
        const routes = [
            { route: archcollegeRoute, name: '建筑学院' },
            { route: archipositionRoute, name: '有方' },
            { route: fire114Route, name: '消防百事通' },
            { route: goooodRoute, name: '谷德设计网' },
        ];
        const promises = routes.map(async ({ route, name }) => {
            try {
                const { item: items } = await route.handler(ctx) as Data;
                return items?.map((item) => ({ ...item, author: name })) || [];
            } catch {
                return [];
            }
        });
        const results = await Promise.all(promises);
        const allItems = results.flat();
        allItems.sort((a, b) => {
            const dateA = new Date(a.pubDate || 0).getTime();
            const dateB = new Date(b.pubDate || 0).getTime();
            return dateB - dateA;
        });
        return {
            title: 'BeesHub聚合',
            link: 'https://rsshub.app/beeshub',
            item: allItems,
        };
    }),
};