import { load } from "cheerio";

import type { Route } from "@/types";
import cache from "@/utils/cache";
import ofetch from "@/utils/ofetch";
import { parseDate } from "@/utils/parse-date";
import timezone from "@/utils/timezone";

import { renderDescription } from "./templates/description";

const rootUrl = "https://www.fire114.cn";
const imgRootUrl = "https://new.fire114.cn";
const ttl = 7 * 24 * 60 * 60;   // cache article details for 7 days
export const route: Route = {
    path: "/latest",
    categories: ["other"],
    example: "/fire114/latest",
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
            source: ["fire114.cn/index/article/index"],
            target: "/latest",
        },
    ],
    name: "最新资讯",
    maintainers: [],
    handler: async () => ({
            title: "Fire114 - 最新资讯",
            link: `${rootUrl}/index/article/index`,
            item: await Promise.all([getItemsByPage(1), getItemsByPage(2), getItemsByPage(3)]).then((pages) => pages.flat()),
        }),
};

async function getItemsByPage(page = 1, loadDetail = true) {

    const apiUrl = `${rootUrl}/index/article/articleList?t=0&p=${page}`;

    const response = await ofetch(apiUrl);
    const data = JSON.parse(response);

    let items = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        link: `${rootUrl}/index/article/detail?i=${item.id}`,
        description: renderDescription({
            image: {
                src: item._face?.ico?.public_src
                    ? `${imgRootUrl}${item._face.ico.public_src}`
                    : undefined,
            },
            description: item.summary,
        }),
        image: item._face?.ico?.public_src
            ? `${imgRootUrl}${item._face.ico.public_src}`
            : undefined,
        pubDate: item.create_time ? parseDate(item.create_time) : new Date(),
        category: item._keywords || [],
    }));

    if (loadDetail) {
        const details = await Promise.all(
            items.map((item: any) =>
                cache.tryGet(item.link, async () => {
                    const detailResponse = await ofetch(item.link);
                    const $ = load(detailResponse);

                    const title = $('.ls_mid_title').text().trim() || item.title;
                    const dateStr = $('.ls_mid_info > span').toArray().map((span) => $(span).text()).find((t) => t.startsWith('20'));
                    const pubDate = dateStr ? parseDate(dateStr) : item.pubDate;

                    // const $content = $('.ls_mid_content');
                    // const contentHtml = $content.html() || '';

                    return {
                        title,
                        link: item.link,
                        pubDate: pubDate ? timezone(pubDate, +8) : undefined,
                        description: item.description,
                        category: item.category,
                        image: item.image,
                    };
                }, ttl)
            )
        );
        items = details.flat();
    }
    return items;
}
