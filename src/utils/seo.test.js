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
                return {
                    tagName: tag.toUpperCase(),
                    setAttribute: (key, val) => {
                        attributes[key] = val;
                    },
                    getAttribute: (key) => attributes[key] || null,
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
            expect(seo.canonical).toMatch(/^https:\/\/app\.atozazure\.com/);
        });
    });

    it('returns default metadata for unknown routes', () => {
        const seo = getRouteSEO('/unknown-path');
        expect(seo).toEqual(DEFAULT_SEO);
        expect(seo.headerTitle).toBe('Page Not Found');
    });

    it('applies title, meta description, canonical link, and Open Graph tags to DOM', () => {
        applySEO('/resource-naming');

        expect(document.title).toBe(ROUTE_SEO['/resource-naming'].title);

        const descMeta = document.querySelector('meta[name="description"]');
        expect(descMeta).not.toBeNull();
        expect(descMeta.getAttribute('content')).toBe(ROUTE_SEO['/resource-naming'].description);

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
    });
});
