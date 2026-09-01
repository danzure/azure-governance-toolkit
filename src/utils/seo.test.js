import { describe, it, expect, beforeEach } from 'vitest';
import { ROUTE_SEO, DEFAULT_SEO, getRouteSEO, applySEO } from './seo';

describe('SEO Utilities', () => {
    let mockHeadElements = [];
    let mockTitle = '';

    beforeEach(() => {
        mockHeadElements = [];
        mockTitle = '';

        // Mock document for Node test environment
        globalThis.document = {
            get title() {
                return mockTitle;
            },
            set title(val) {
                mockTitle = val;
            },
            querySelector: (selector) => {
                return mockHeadElements.find((el) => el.matches(selector)) || null;
            },
            createElement: (tag) => {
                const attributes = {};
                let textContent = '';
                return {
                    tagName: tag.toUpperCase(),
                    setAttribute: (key, val) => {
                        attributes[key] = val;
                    },
                    getAttribute: (key) => attributes[key] || null,
                    get textContent() {
                        return textContent;
                    },
                    set textContent(val) {
                        textContent = val;
                    },
                    matches: (sel) => {
                        if (sel.startsWith('meta[')) {
                            const match = sel.match(/meta\[([a-zA-Z0-9_-]+)="([^"]+)"\]/);
                            if (match) {
                                return tag.toLowerCase() === 'meta' && attributes[match[1]] === match[2];
                            }
                        }
                        if (sel.startsWith('link[')) {
                            const match = sel.match(/link\[([a-zA-Z0-9_-]+)="([^"]+)"\]/);
                            if (match) {
                                return tag.toLowerCase() === 'link' && attributes[match[1]] === match[2];
                            }
                        }
                        if (sel.startsWith('script#')) {
                            const id = sel.replace('script#', '');
                            return tag.toLowerCase() === 'script' && attributes['id'] === id;
                        }
                        return false;
                    },
                };
            },
            head: {
                appendChild: (el) => {
                    mockHeadElements.push(el);
                    return el;
                },
            },
        };
    });

    it('returns valid metadata for defined routes', () => {
        const expectedRoutes = [
            '/',
            '/resource-naming',
            '/conditional-access',
            '/management-groups',
            '/tagging-strategy',
            '/rbac-designer',
        ];

        expectedRoutes.forEach((route) => {
            const seo = getRouteSEO(route);
            expect(seo).toBeDefined();
            expect(seo.title).toContain('atozazure');
            expect(seo.headerTitle).toBeTruthy();
            expect(seo.description.length).toBeGreaterThan(30);
            expect(seo.keywords.length).toBeGreaterThan(20);
            expect(seo.canonical).toMatch(/^https:\/\/app\.atozazure\.com/);
            expect(seo.breadcrumbs.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('returns default metadata for unknown routes', () => {
        const seo = getRouteSEO('/unknown-path');
        expect(seo).toEqual(DEFAULT_SEO);
        expect(seo.headerTitle).toBe('Page Not Found');
    });

    it('applies title, meta description, keywords, canonical link, Open Graph, and JSON-LD to DOM', () => {
        applySEO('/resource-naming');

        expect(document.title).toBe(ROUTE_SEO['/resource-naming'].title);

        const descMeta = document.querySelector('meta[name="description"]');
        expect(descMeta).not.toBeNull();
        expect(descMeta.getAttribute('content')).toBe(ROUTE_SEO['/resource-naming'].description);

        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        expect(keywordsMeta).not.toBeNull();
        expect(keywordsMeta.getAttribute('content')).toBe(ROUTE_SEO['/resource-naming'].keywords);

        const robotsMeta = document.querySelector('meta[name="robots"]');
        expect(robotsMeta).not.toBeNull();
        expect(robotsMeta.getAttribute('content')).toContain('index, follow');

        const canonicalLink = document.querySelector('link[rel="canonical"]');
        expect(canonicalLink).not.toBeNull();
        expect(canonicalLink.getAttribute('href')).toBe('https://app.atozazure.com/resource-naming');

        const ogTitle = document.querySelector('meta[property="og:title"]');
        expect(ogTitle).not.toBeNull();
        expect(ogTitle.getAttribute('content')).toBe(ROUTE_SEO['/resource-naming'].title);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        expect(ogUrl).not.toBeNull();
        expect(ogUrl.getAttribute('content')).toBe('https://app.atozazure.com/resource-naming');

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        expect(twitterTitle).not.toBeNull();
        expect(twitterTitle.getAttribute('content')).toBe(ROUTE_SEO['/resource-naming'].title);

        const breadcrumbScript = document.querySelector('script#seo-breadcrumb-jsonld');
        expect(breadcrumbScript).not.toBeNull();
        const parsedBreadcrumbs = JSON.parse(breadcrumbScript.textContent);
        expect(parsedBreadcrumbs['@type']).toBe('BreadcrumbList');
        expect(parsedBreadcrumbs.itemListElement).toHaveLength(2);
        expect(parsedBreadcrumbs.itemListElement[1].name).toBe('Azure Resource Naming Tool');
    });
});

