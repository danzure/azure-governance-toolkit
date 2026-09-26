import { AZURE_UPDATES_FALLBACK } from '../data/azureUpdatesFallback';

export const AZURE_RSS_FEED_URL = 'https://www.microsoft.com/releasecommunications/api/v2/azure/rss';
export const RSS_CACHE_KEY = 'azres_azure_updates_rss';
export const RSS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Unescape common XML / HTML entities
 */
export function unescapeXml(text) {
    if (!text) return '';
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#x26;/g, '&');
}

/**
 * Strip HTML tags and normalize whitespace
 */
export function stripHtml(html) {
    if (!html) return '';
    const unescaped = unescapeXml(html);
    return unescapeXml(unescaped.replace(/<[^>]*>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Clean redundant prefix from RSS title
 */
export function cleanTitle(rawTitle) {
    if (!rawTitle) return '';
    let cleaned = unescapeXml(rawTitle).trim();
    cleaned = cleaned.replace(/^\[(Launched|In preview|Security|Retirement|General Availability|Preview)\]\s*/i, '');
    cleaned = cleaned.replace(/^(Generally Available|Public Preview|Private Preview|Retirement|Security Update):\s*/i, '');
    return cleaned.trim();
}

/**
 * Determine status type from title and categories
 */
export function classifyStatus(title = '', categories = []) {
    const combined = `${title} ${categories.join(' ')}`.toLowerCase();

    if (combined.includes('retirement') || combined.includes('retired') || combined.includes('deprecation')) {
        return { type: 'retirement', label: 'Retirement' };
    }
    if (combined.includes('preview') || combined.includes('in preview')) {
        return { type: 'preview', label: 'Public Preview' };
    }
    if (combined.includes('launched') || combined.includes('generally available') || combined.includes('ga:')) {
        return { type: 'launched', label: 'Generally Available' };
    }
    if (combined.includes('security') || combined.includes('vulnerability') || combined.includes('cve')) {
        return { type: 'security', label: 'Security Update' };
    }

    return { type: 'general', label: 'Update' };
}

/**
 * Format pubDate into human-readable relative string
 */
export function formatRelativeDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Parse XML using Regex fallback (Node / Vitest environment safe)
 */
function parseXmlWithRegex(xmlString) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xmlString)) !== null) {
        const itemXml = match[1];

        const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
        const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
        const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
        const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
        const guidMatch = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i);

        const categories = [];
        const catRegex = /<category>([\s\S]*?)<\/category>/gi;
        let catMatch;
        while ((catMatch = catRegex.exec(itemXml)) !== null) {
            categories.push(unescapeXml(catMatch[1]).trim());
        }

        const rawTitle = titleMatch ? unescapeXml(titleMatch[1]).trim() : '';
        const rawDesc = descMatch ? stripHtml(descMatch[1]) : '';
        const link = linkMatch ? unescapeXml(linkMatch[1]).trim() : '';
        const pubDate = pubDateMatch ? unescapeXml(pubDateMatch[1]).trim() : '';
        const guid = guidMatch ? unescapeXml(guidMatch[1]).trim() : '';

        const { type: statusType, label: statusLabel } = classifyStatus(rawTitle, categories);
        const displayTitle = cleanTitle(rawTitle);

        const primaryCat = categories.find((c) => !['Launched', 'In preview', 'Retirements', 'Security'].includes(c)) || categories[0] || 'General';

        items.push({
            id: guid || link || String(items.length),
            title: rawTitle,
            displayTitle: displayTitle || rawTitle,
            link,
            description: rawDesc,
            pubDate,
            formattedDate: pubDate ? new Date(pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            relativeTime: formatRelativeDate(pubDate),
            categories,
            primaryCategory: primaryCat,
            statusType,
            statusLabel
        });
    }

    return items;
}

/**
 * Parse Azure RSS 2.0 XML string into structured objects
 */
export function parseAzureRssXml(xmlString) {
    if (!xmlString || typeof xmlString !== 'string') {
        return [];
    }

    // Check for browser DOMParser
    if (typeof DOMParser !== 'undefined') {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlString, 'text/xml');
            const itemNodes = doc.querySelectorAll('item');

            if (itemNodes && itemNodes.length > 0) {
                const items = [];
                itemNodes.forEach((node, index) => {
                    const getTag = (name) => {
                        const el = node.querySelector(name);
                        return el ? el.textContent : '';
                    };

                    const rawTitle = getTag('title');
                    const link = getTag('link');
                    const desc = stripHtml(getTag('description'));
                    const pubDate = getTag('pubDate');
                    const guid = getTag('guid');

                    const categories = [];
                    node.querySelectorAll('category').forEach((cat) => {
                        const text = cat.textContent?.trim();
                        if (text) categories.push(text);
                    });

                    const { type: statusType, label: statusLabel } = classifyStatus(rawTitle, categories);
                    const displayTitle = cleanTitle(rawTitle);
                    const primaryCat = categories.find((c) => !['Launched', 'In preview', 'Retirements', 'Security'].includes(c)) || categories[0] || 'General';

                    items.push({
                        id: guid || link || String(index),
                        title: unescapeXml(rawTitle),
                        displayTitle: displayTitle || rawTitle,
                        link: link.trim(),
                        description: desc,
                        pubDate,
                        formattedDate: pubDate ? new Date(pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                        relativeTime: formatRelativeDate(pubDate),
                        categories,
                        primaryCategory: primaryCat,
                        statusType,
                        statusLabel
                    });
                });

                return items;
            }
        } catch {
            // Fall back to regex parser on DOMParser error
        }
    }

    return parseXmlWithRegex(xmlString);
}

/**
 * Fetch Azure Updates RSS with sessionStorage caching and fallback
 */
export async function fetchAzureRss({ forceRefresh = false, timeoutMs = 8000 } = {}) {
    // Check sessionStorage cache if not forcing refresh
    if (!forceRefresh && typeof window !== 'undefined' && window.sessionStorage) {
        try {
            const cachedRaw = window.sessionStorage.getItem(RSS_CACHE_KEY);
            if (cachedRaw) {
                const cached = JSON.parse(cachedRaw);
                if (cached.timestamp && (Date.now() - cached.timestamp < RSS_CACHE_TTL_MS)) {
                    return {
                        items: cached.items,
                        title: cached.title || 'Azure Service Updates',
                        lastBuildDate: cached.lastBuildDate || '',
                        isCached: true,
                        isFallback: false
                    };
                }
            }
        } catch {
            // sessionStorage error, proceed to fetch
        }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(AZURE_RSS_FEED_URL, {
            signal: controller.signal,
            headers: {
                Accept: 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const xmlText = await response.text();
        const items = parseAzureRssXml(xmlText);

        if (!items || items.length === 0) {
            throw new Error('Received empty or invalid RSS feed.');
        }

        // Cache successful response in sessionStorage
        if (typeof window !== 'undefined' && window.sessionStorage) {
            try {
                window.sessionStorage.setItem(RSS_CACHE_KEY, JSON.stringify({
                    items,
                    title: 'Azure Service Updates',
                    timestamp: Date.now()
                }));
            } catch {
                // Ignore storage quota errors
            }
        }

        return {
            items,
            title: 'Azure Service Updates',
            isCached: false,
            isFallback: false
        };
    } catch (err) {
        clearTimeout(timeoutId);

        // Enhance fallback data with formatted dates
        const fallbackItems = AZURE_UPDATES_FALLBACK.map((item) => ({
            ...item,
            formattedDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            relativeTime: formatRelativeDate(item.pubDate)
        }));

        return {
            items: fallbackItems,
            title: 'Azure Service Updates',
            isCached: false,
            isFallback: true,
            error: err.name === 'AbortError' ? 'Network timeout' : (err.message || 'Network request failed')
        };
    }
}
