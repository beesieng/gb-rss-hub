import type { Context } from "hono";

import type { Data, Route } from "@/types";
import cache from "@/utils/cache";
import logger from "@/utils/logger";

import { route as archcollegeRoute } from "../archcollege/latest";
import { route as archdailyRoute } from "../archdaily";
import { route as archipositionRoute } from "../archiposition/latest";
import { route as fire114Route } from "../fire114/latest";
import { route as goooodRoute } from "../gooood/latest";
import { route as hvacrhomeRoute } from "../hvacrhome";

export const route: Route = {
    path: "/",
    example: "/beeshub",
    name: "BeesHub聚合",
    maintainers: [],
    handler: async (ctx) => {
        const { globalCache } = cache;
        const key = "beeshub";
        const ttl = 7 * 24 * 60 * 60; // 7天

        // 检查二级缓存
        const cached = await globalCache.get(key);
        if (cached) {
            logger.info('BeesHub: 二级缓存命中，异步更新二级缓存');
            try {
                const data = JSON.parse(cached);
                // 返回二级缓存，并异步更新二级缓存
                setImmediate(async () => {
                    logger.info('BeesHub: 开始异步更新二级缓存');
                    try {
                        const freshData = await handler(ctx);
                        globalCache.set(key, JSON.stringify(freshData), ttl);
                        logger.info('BeesHub: 二级缓存更新完成');
                    } catch (error) {
                        logger.error('BeesHub: 二级缓存更新失败', error);
                    }
                });
                return data;
            } catch {
                logger.warn('BeesHub: 二级缓存解析失败');
            }
        }

        // 没有缓存，利用cache.tryGet执行handler并设置二级缓存
        logger.info('BeesHub: 无缓存，执行handler并设置二级缓存');
        return await cache.tryGet(key, async () => {
            const data = await handler(ctx);
            logger.info('BeesHub: 设置二级缓存');
            return data;
        }, ttl);
    },
};

async function handler(ctx: Context) {
    const routes = [
        { route: archcollegeRoute, name: "建筑学院" },
        { route: archipositionRoute, name: "有方" },
        { route: fire114Route, name: "消防百事通" },
        { route: goooodRoute, name: "谷德设计网" },
        { route: hvacrhomeRoute, name: "暖通家" },
        { route: archdailyRoute, name: "ArchDaily" },
    ];
    const promises = routes.map(async ({ route, name }) => {
        try {
            const { item: items } = (await route.handler(ctx)) as Data;
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
        title: "BeesHub聚合",
        link: "https://www.beesfpd.com/beeshub",
        item: allItems,
    };
}
