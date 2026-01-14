import type { Handler } from 'hono';

import logger from '@/utils/logger';

const handler: Handler = async (ctx) => {
    const url = ctx.req.query('url');
    const refererParam = ctx.req.param('referer');
    const refererQuery = ctx.req.query('referer');

    const referer = refererParam || refererQuery;

    if (!url) {
        return ctx.json({ error: 'Missing url parameter' }, 400);
    }

    // Validate URL
    try {
        new URL(url);
    } catch {
        return ctx.json({ error: 'Invalid URL' }, 400);
    }

    const headers: Record<string, string> = {};
    if (referer) {
        headers.Referer = referer;
    }

    try {
        const response = await fetch(url, {
            headers,
            signal: AbortSignal.timeout(10000), // 10 seconds timeout
        });

        if (!response.ok) {
            return ctx.json({ error: `Failed to fetch: ${response.status}` }, response.status);
        }

        // Set response headers
        const responseHeaders = new Headers();
        for (const [key, value] of response.headers.entries()) {
            // Skip certain headers that should not be forwarded
            if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
                responseHeaders.set(key, value);
            }
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        logger.error('Error fetching URL:', error.message);
        return ctx.json({ error: 'Failed to fetch the URL' }, 500);
    }
};

export default handler;
