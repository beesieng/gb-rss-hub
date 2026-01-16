import { load } from "cheerio";

import type { Route } from "@/types";
import ofetch from "@/utils/ofetch";
import { parseDate } from "@/utils/parse-date";

import { renderDescription } from "./templates/description";

const rootUrl = "https://www.archdaily.com";

export const route: Route = {
    path: "/",
    categories: ["design"],
    example: "/archdaily",
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
            source: ["www.archdaily.com/"],
            target: "/",
        },
    ],
    name: "Latest",
    maintainers: [],
    handler: async () => ({
        title: "ArchDaily - Latest",
        link: rootUrl,
        item: await Promise.all([getItemsByPage(1), getItemsByPage(2), getItemsByPage(3)]).then((pages) => pages.flat()),
    }),
};

async function getItemsByPage(page = 1) {
    const apiUrl = `${rootUrl}/infinite_scroll/us?page=${page}`;

    const response = await ofetch(apiUrl);
    const $ = load(response);

    const items = $('[itemtype="http://schema.org/Article"]').toArray().map((item) => {
        const $item = $(item);
        const title = $item.find('h3 [itemprop="name"]').text().trim();
        const link = $item.find('h3 a').attr('href');
        const descriptionElem = $item.find('.afd-post-content');
        descriptionElem.find("style").remove();
        descriptionElem.find("svg").remove();
        descriptionElem.find(".thumbs").remove();
        descriptionElem.find(".gallery-link__overlay").remove();
        const description = descriptionElem.html();
        const category = $item.find('header .category-type-background').text().trim();
        const author = $item.find('[itemprop="author"]').text().trim();
        const pubDateStr = $item.find('time[datetime]').attr('datetime');
        const pubDate = pubDateStr ? parseDate(pubDateStr) : undefined;
        const image = $item.find('figure.featured-image img').attr('src');

        return {
            title,
            link: link ? String(rootUrl) + link : undefined,
            description,
            author,
            pubDate,
            image,
            category: category ? [category] : [],
        };
    });

    return items;
}