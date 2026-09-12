import { describe, it, expect } from 'vitest';
import {
    buildSearchIndex,
    filterSearchIndex,
    groupResultsByCategory,
    CATEGORY_FILTERS,
    isOneEditDistance,
    getRecentCommandIds,
    saveRecentCommandId,
    removeRecentCommandId,
    clearRecentCommands,
    getInitialCommandPaletteItems
} from './commandPaletteUtils';

describe('Command Palette Utilities', () => {
    it('defines standard category filter options', () => {
        expect(CATEGORY_FILTERS).toContain('All');
        expect(CATEGORY_FILTERS).toContain('Navigation');
        expect(CATEGORY_FILTERS).toContain('Azure Services');
        expect(CATEGORY_FILTERS).toContain('Policies & Templates');
        expect(CATEGORY_FILTERS).toContain('Quick Actions');
    });

    it('builds a comprehensive search index including navigation, resources, policies, and actions', () => {
        const index = buildSearchIndex('dark');
        expect(index.length).toBeGreaterThan(150);

        // Verify navigation items exist
        const navTargets = index.filter(i => i.category === 'Navigation').map(i => i.target);
        expect(navTargets).toContain('/');
        expect(navTargets).toContain('/resource-naming');
        expect(navTargets).toContain('/conditional-access');
        expect(navTargets).toContain('/management-groups');
        expect(navTargets).toContain('/rbac-designer');
        expect(navTargets).toContain('/tagging-strategy');

        // Verify navigation items have matching official SVG icons
        const navItems = index.filter(i => i.category === 'Navigation');
        expect(navItems.length).toBe(6);
        expect(navItems.every(i => typeof i.iconUrl === 'string' && i.iconUrl.includes('benc-uk/icon-collection/master/azure-icons/'))).toBe(true);

        // Verify Azure resources exist
        const kvItem = index.find(i => i.title === 'Key vault');
        expect(kvItem).toBeDefined();
        expect(kvItem.category).toBe('Azure Services');
        expect(kvItem.badge).toBe('kv');
        expect(kvItem.target).toContain('/resource-naming?search=Key%20vault');

        // Verify CA policies exist
        const caItem = index.find(i => i.category === 'Policies & Templates' && i.actionType === 'ca-policy');
        expect(caItem).toBeDefined();
        expect(caItem.target).toContain('/conditional-access?search=');

        // Verify RBAC templates exist
        const rbacItem = index.find(i => i.category === 'Policies & Templates' && i.actionType === 'rbac-role');
        expect(rbacItem).toBeDefined();
        expect(rbacItem.target).toContain('/rbac-designer?template=');

        // Verify theme indicator reflects active preference
        const darkAction = index.find(i => i.id === 'action-theme-dark');
        expect(darkAction.badge).toBe('Active');
        const lightAction = index.find(i => i.id === 'action-theme-light');
        expect(lightAction.badge).toBeNull();
    });

    it('filters items by multi-token search query', () => {
        const index = buildSearchIndex('system');

        // Exact service search (case-insensitive)
        const kvResults = filterSearchIndex(index, 'key vault', 'All');
        expect(kvResults.some(i => i.title === 'Key vault')).toBe(true);

        // Abbreviation search
        const abbrevResults = filterSearchIndex(index, 'kv', 'All');
        expect(abbrevResults.some(i => i.title === 'Key vault')).toBe(true);

        // Multi-token keywords search
        const multiTokenResults = filterSearchIndex(index, 'virtual compute', 'All');
        expect(multiTokenResults.some(i => i.title.toLowerCase().includes('virtual'))).toBe(true);

        // Security / CA search
        const mfaResults = filterSearchIndex(index, 'mfa', 'All');
        expect(mfaResults.length).toBeGreaterThan(0);
        expect(mfaResults.some(i => i.category === 'Policies & Templates')).toBe(true);
    });

    it('filters items by selected category', () => {
        const index = buildSearchIndex('system');

        const navOnly = filterSearchIndex(index, '', 'Navigation');
        expect(navOnly.every(i => i.category === 'Navigation')).toBe(true);
        expect(navOnly.length).toBe(6);

        const actionsOnly = filterSearchIndex(index, '', 'Quick Actions');
        expect(actionsOnly.every(i => i.category === 'Quick Actions')).toBe(true);
    });

    it('returns empty array when query has no matches', () => {
        const index = buildSearchIndex('system');
        const noResults = filterSearchIndex(index, 'xyznonexistentterm12345', 'All');
        expect(noResults).toEqual([]);
    });

    it('groups results by category properly', () => {
        const index = buildSearchIndex('system');
        const results = filterSearchIndex(index, 'virtual', 'All');
        const grouped = groupResultsByCategory(results);

        expect(typeof grouped).toBe('object');
        Object.entries(grouped).forEach(([cat, items]) => {
            expect(items.length).toBeGreaterThan(0);
            expect(items.every(item => item.category === cat)).toBe(true);
        });
    });

    it('precomputes _searchCorpus on all items for zero-allocation searching', () => {
        const index = buildSearchIndex('dark');
        expect(index.every(i => typeof i._searchCorpus === 'string' && i._searchCorpus.length > 0)).toBe(true);
    });

    it('caches the built search index for O(1) retrieval across calls', () => {
        const index1 = buildSearchIndex('light');
        const index2 = buildSearchIndex('light');
        expect(index1).toBe(index2); // exact same object reference from cache
    });

    it('correctly calculates 1-edit distance for typos', () => {
        // Substitution
        expect(isOneEditDistance('virtuel', 'virtual')).toBe(true);
        // Deletion
        expect(isOneEditDistance('virtal', 'virtual')).toBe(true);
        // Insertion
        expect(isOneEditDistance('postgress', 'postgres')).toBe(true);
        // Transposition
        expect(isOneEditDistance('contianer', 'container')).toBe(true);
        // Non-matches (> 1 edit)
        expect(isOneEditDistance('kitten', 'sitting')).toBe(false);
        expect(isOneEditDistance('cat', 'dog')).toBe(false);
        expect(isOneEditDistance('a', 'abc')).toBe(false);
    });

    it('handles typo-tolerant fuzzy matching for common misspellings', () => {
        const index = buildSearchIndex('system');

        // Missing letter in virtual
        const virtalResults = filterSearchIndex(index, 'virtal machine');
        expect(virtalResults.length).toBeGreaterThan(0);
        expect(virtalResults.some(i => i.title.toLowerCase().includes('virtual'))).toBe(true);

        // Missing letter in keyvault
        const kvResults = filterSearchIndex(index, 'keyvaut');
        expect(kvResults.length).toBeGreaterThan(0);
        expect(kvResults.some(i => i.title.toLowerCase().includes('key vault'))).toBe(true);

        // Missing letter in container
        const contanerResults = filterSearchIndex(index, 'contaner');
        expect(contanerResults.length).toBeGreaterThan(0);
        expect(contanerResults.some(i => i.title.toLowerCase().includes('container'))).toBe(true);
    });

    it('manages recent commands in localStorage safely', () => {
        // Mock localStorage if in Node environment
        const store = {};
        const originalLocalStorage = globalThis.localStorage;
        globalThis.localStorage = {
            getItem: (key) => store[key] || null,
            setItem: (key, val) => { store[key] = String(val); },
            removeItem: (key) => { delete store[key]; }
        };

        try {
            clearRecentCommands();
            expect(getRecentCommandIds()).toEqual([]);

            saveRecentCommandId('nav-naming');
            saveRecentCommandId('res-key-vault');
            expect(getRecentCommandIds()).toEqual(['res-key-vault', 'nav-naming']);

            // Test moving existing to front
            saveRecentCommandId('nav-naming');
            expect(getRecentCommandIds()).toEqual(['nav-naming', 'res-key-vault']);

            // Test removing single item
            removeRecentCommandId('res-key-vault');
            expect(getRecentCommandIds()).toEqual(['nav-naming']);

            // Test clear
            clearRecentCommands();
            expect(getRecentCommandIds()).toEqual([]);
        } finally {
            globalThis.localStorage = originalLocalStorage;
        }
    });

    it('assembles a lightweight initial recommendation view on empty query', () => {
        const index = buildSearchIndex('system');

        // Without recent commands
        const initialItems = getInitialCommandPaletteItems(index, []);
        expect(initialItems.length).toBeLessThan(35); // significantly fewer than 210 items
        expect(initialItems.some(i => i.category === 'Navigation')).toBe(true);
        expect(initialItems.some(i => i.category === 'Featured Azure Services')).toBe(true);
        expect(initialItems.some(i => i.category === 'Quick Actions')).toBe(true);

        // With recent commands
        const initialWithRecents = getInitialCommandPaletteItems(index, ['nav-naming', 'res-key-vault']);
        expect(initialWithRecents.some(i => i.category === 'Recent')).toBe(true);
        const recentItems = initialWithRecents.filter(i => i.category === 'Recent');
        expect(recentItems.length).toBe(2);
        expect(recentItems[0].isRecent).toBe(true);
    });
});

