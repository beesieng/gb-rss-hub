import * as cheerio from "cheerio";

import type { Route } from "@/types";
import logger from "@/utils/logger";
import ofetch from "@/utils/ofetch";
import { parseDate, parseRelativeDate } from "@/utils/parse-date";

import { renderDescription } from "./templates/description";

const rootUrl = "https://www.hvacrhome.com";
const headers = {
    // 'Cookie': 'acw_sc__v3=69686ae92da340189c8f8efc8008a06a0d276516;', // 替换为实际的cookie值
    // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', // 可选：设置User-Agent
    "User-Agent":
        "Mozilla/5.0 (compatible; Baiduspider/2.0;+http://www.baidu.com/search/spider.html)", // 模拟iPhone浏览器
};

export const route: Route = {
    path: "/",
    name: "暖通家",
    example: "/hvacrhome",
    maintainers: ["beesieng"],
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
            source: ["www.hvacrhome.com/news/list.php"],
            target: "/hvacrhome",
        },
    ],
    handler: async () => ({
        title: "暖通家",
        link: rootUrl,
        item: await Promise.all([getItemsByPage(1), getItemsByPage(2), getItemsByPage(3)]).then((pages) => pages.flat()),
    }),
};

async function getItemsByPage(page = 1) {
    const url = `${rootUrl}/news/list.php?catid=4&page=${page}`;
    const year = new Date().getFullYear();

    const html = await ofetch(url, { headers });
    const $ = cheerio.load(html);

    return $("section.newslist > .news-content").toArray().map((el) => {
        const $el = $(el);
        const title = $el.find("a.title").text().trim();
        const link = $el.find("a.title").attr("href");
        const description = $el.find("p.desc").text().trim();
        const category = $el
            .find("div.tag > .keys > a")
            .toArray()
            .map((a) => $(a).text().trim());
        const pubDateStr = $el.find("div.tag > span:last-child").text().trim();
        let pubDate = parseRelativeDate(pubDateStr);
        if (pubDate === pubDateStr) {
            pubDate = parseDate(
                year + "-" + pubDateStr.replace("月", "-").replace("日", "")
            );
            if (!pubDate || Number.isNaN(pubDate.getTime())) {
                pubDate = new Date();
            }
        }
        const image = $el.find("a.img > img");
        const imageUrl = image.attr("data-original") || image.attr("src") || "";
        // const imageAlt = image.attr('alt') || title;

        return {
            title,
            link,
            description: renderDescription({
                image: { src: imageUrl },
                description,
            }),
            pubDate,
            category,
            image: imageUrl,
        };
    });
}
