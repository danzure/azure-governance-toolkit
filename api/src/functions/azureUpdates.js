const { app } = require('@azure/functions');

const AZURE_RSS_FEED_URL = 'https://www.microsoft.com/releasecommunications/api/v2/azure/rss';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

let cache = {
    xml: null,
    expiry: 0
};

app.http('azureUpdates', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Processing azureUpdates RSS request: ${request.url}`);

        let forceRefresh = false;
        try {
            if (request.query && typeof request.query.get === 'function') {
                forceRefresh = request.query.get('forceRefresh') === 'true';
            } else if (request.url) {
                const url = new URL(request.url);
                forceRefresh = url.searchParams.get('forceRefresh') === 'true';
            }
        } catch {
            // Default to false on parse error
        }

        if (!forceRefresh && cache.xml && Date.now() < cache.expiry) {
            context.log('Returning cached Azure updates RSS payload.');
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/rss+xml; charset=utf-8',
                    'Cache-Control': 'public, max-age=900, s-maxage=1800',
                    'Access-Control-Allow-Origin': '*'
                },
                body: cache.xml
            };
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const upstreamResponse = await fetch(AZURE_RSS_FEED_URL, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8',
                    'User-Agent': 'AtozAzure-Governance-Toolkit/2.0'
                }
            });

            clearTimeout(timeoutId);

            if (!upstreamResponse.ok) {
                throw new Error(`Upstream returned HTTP ${upstreamResponse.status}: ${upstreamResponse.statusText}`);
            }

            const xmlText = await upstreamResponse.text();

            if (!xmlText || !xmlText.includes('<rss')) {
                throw new Error('Invalid RSS XML payload received from upstream');
            }

            cache = {
                xml: xmlText,
                expiry: Date.now() + CACHE_TTL_MS
            };

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/rss+xml; charset=utf-8',
                    'Cache-Control': 'public, max-age=900, s-maxage=1800',
                    'Access-Control-Allow-Origin': '*'
                },
                body: xmlText
            };
        } catch (error) {
            context.error('Failed to fetch upstream Azure updates RSS:', error);

            if (cache.xml) {
                context.warn('Returning stale cached RSS payload due to upstream failure.');
                return {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/rss+xml; charset=utf-8',
                        'Cache-Control': 'no-cache',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: cache.xml
                };
            }

            return {
                status: 502,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    error: 'Failed to fetch upstream Azure updates feed',
                    details: error.message
                }
            };
        }
    }
});

module.exports = {
    AZURE_RSS_FEED_URL
};
