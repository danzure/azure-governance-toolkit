import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    unescapeXml,
    stripHtml,
    cleanTitle,
    classifyStatus,
    formatRelativeDate,
    parseAzureRssXml,
    fetchAzureRss,
    AZURE_RSS_FEED_URL,
    RSS_CACHE_KEY
} from './rssParser';

describe('rssParser utils', () => {
    describe('constants', () => {
        it('exports feed URL and cache key constants', () => {
            expect(AZURE_RSS_FEED_URL).toContain('microsoft.com/releasecommunications/api/v2/azure/rss');
            expect(RSS_CACHE_KEY).toBe('azres_azure_updates_rss');
        });
    });

    describe('unescapeXml', () => {
        it('unescapes standard XML entities', () => {
            expect(unescapeXml('Tom &amp; Jerry &lt;script&gt; &quot;quote&quot; &#39;apostrophe&#39;')).toBe(
                'Tom & Jerry <script> "quote" \'apostrophe\''
            );
        });

        it('returns empty string for null or undefined input', () => {
            expect(unescapeXml(null)).toBe('');
            expect(unescapeXml(undefined)).toBe('');
        });
    });

    describe('stripHtml', () => {
        it('removes tags and collapses whitespace', () => {
            const html = '<p>Hello <strong>World</strong>!</p>   <div>Next line</div>';
            expect(stripHtml(html)).toBe('Hello World ! Next line');
        });

        it('unescapes encoded entities in html', () => {
            const html = '<p>Azure &amp; AI</p>';
            expect(stripHtml(html)).toBe('Azure & AI');
        });

        it('returns empty string for falsy input', () => {
            expect(stripHtml('')).toBe('');
            expect(stripHtml(null)).toBe('');
        });
    });

    describe('cleanTitle', () => {
        it('strips bracketed prefixes', () => {
            expect(cleanTitle('[Launched] Generally Available: Azure Container Apps')).toBe(
                'Azure Container Apps'
            );
            expect(cleanTitle('[In preview] Public Preview: PostgreSQL 18 on Azure')).toBe(
                'PostgreSQL 18 on Azure'
            );
            expect(cleanTitle('[Security] Security Update: TLS 1.3')).toBe('TLS 1.3');
        });

        it('handles unbracketed status prefixes', () => {
            expect(cleanTitle('Retirement: Legacy Python SDK v1')).toBe('Legacy Python SDK v1');
            expect(cleanTitle('Public Preview: Cross-region backup')).toBe('Cross-region backup');
        });

        it('returns unchanged string if no prefix match', () => {
            expect(cleanTitle('Azure Cosmos DB Vector Indexing')).toBe('Azure Cosmos DB Vector Indexing');
        });

        it('handles empty input', () => {
            expect(cleanTitle('')).toBe('');
        });
    });

    describe('classifyStatus', () => {
        it('identifies launched / generally available status', () => {
            const res = classifyStatus('[Launched] Generally Available: Feature X', ['Launched', 'Storage']);
            expect(res.type).toBe('launched');
            expect(res.label).toBe('Generally Available');
        });

        it('identifies preview status', () => {
            const res = classifyStatus('[In preview] Public Preview: Feature Y', ['In preview']);
            expect(res.type).toBe('preview');
            expect(res.label).toBe('Public Preview');
        });

        it('identifies retirement status', () => {
            const res = classifyStatus('Retirement: Old Service', ['Retirements']);
            expect(res.type).toBe('retirement');
            expect(res.label).toBe('Retirement');
        });

        it('identifies security status', () => {
            const res = classifyStatus('Security advisory: CVE-2026-1234', ['Security']);
            expect(res.type).toBe('security');
            expect(res.label).toBe('Security Update');
        });

        it('defaults to general update', () => {
            const res = classifyStatus('General announcement', ['Compute']);
            expect(res.type).toBe('general');
            expect(res.label).toBe('Update');
        });
    });

    describe('formatRelativeDate', () => {
        it('formats relative date correctly for recent times', () => {
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
            expect(formatRelativeDate(oneHourAgo)).toBe('2h ago');
        });

        it('returns empty string for null or empty input', () => {
            expect(formatRelativeDate('')).toBe('');
            expect(formatRelativeDate(null)).toBe('');
        });
    });

    describe('parseAzureRssXml', () => {
        const sampleXml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Azure Service Updates</title>
    <link>https://azure.microsoft.com/updates/</link>
    <description>Updates on Azure products and features</description>
    <item>
      <title>[Launched] Generally Available: Azure HorizonDB</title>
      <link>https://azure.microsoft.com/updates?id=123</link>
      <description>&lt;p&gt;Azure HorizonDB is a database.&lt;/p&gt;</description>
      <pubDate>Fri, 25 Sep 2026 12:00:00 Z</pubDate>
      <category>Launched</category>
      <category>Databases</category>
      <guid isPermaLink="false">123</guid>
    </item>
    <item>
      <title>[In preview] Public Preview: Vector Index</title>
      <link>https://azure.microsoft.com/updates?id=456</link>
      <description>&lt;p&gt;Vector index details.&lt;/p&gt;</description>
      <pubDate>Thu, 24 Sep 2026 10:00:00 Z</pubDate>
      <category>In preview</category>
      <category>AI</category>
      <guid isPermaLink="false">456</guid>
    </item>
  </channel>
</rss>`;

        it('parses XML items into structured data', () => {
            const items = parseAzureRssXml(sampleXml);
            expect(items).toHaveLength(2);

            expect(items[0].id).toBe('123');
            expect(items[0].title).toBe('[Launched] Generally Available: Azure HorizonDB');
            expect(items[0].displayTitle).toBe('Azure HorizonDB');
            expect(items[0].link).toBe('https://azure.microsoft.com/updates?id=123');
            expect(items[0].description).toBe('Azure HorizonDB is a database.');
            expect(items[0].statusType).toBe('launched');
            expect(items[0].primaryCategory).toBe('Databases');

            expect(items[1].id).toBe('456');
            expect(items[1].statusType).toBe('preview');
            expect(items[1].primaryCategory).toBe('AI');
        });

        it('handles empty or malformed XML gracefully', () => {
            expect(parseAzureRssXml('')).toEqual([]);
            expect(parseAzureRssXml(null)).toEqual([]);
            expect(parseAzureRssXml('<rss><channel></channel></rss>')).toEqual([]);
        });
    });

    describe('fetchAzureRss', () => {
        beforeEach(() => {
            vi.restoreAllMocks();
            if (typeof window !== 'undefined' && window.sessionStorage) {
                window.sessionStorage.clear();
            }
        });

        it('falls back to static fallback data when fetch fails', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const result = await fetchAzureRss({ forceRefresh: true });
            expect(result.isFallback).toBe(true);
            expect(result.items.length).toBeGreaterThan(0);
            expect(result.error).toBe('Network error');
        });

        it('parses and returns fresh items on successful fetch', async () => {
            const mockXml = `<rss version="2.0"><channel><item><title>[Launched] Test Service</title><link>https://azure.microsoft.com/test</link><description>Testing</description><guid>999</guid></item></channel></rss>`;
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                text: async () => mockXml
            });

            const result = await fetchAzureRss({ forceRefresh: true });
            expect(result.isFallback).toBe(false);
            expect(result.items).toHaveLength(1);
            expect(result.items[0].id).toBe('999');
            expect(result.items[0].title).toBe('[Launched] Test Service');
        });
    });
});
