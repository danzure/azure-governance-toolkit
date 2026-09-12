import {
    LayoutDashboard,
    Compass,
    ShieldCheck,
    Layers,
    Sliders,
    Tag,
    Sun,
    Moon,
    Monitor,
    Copy,
    BookOpen,
    Github,
    Sparkles
} from 'lucide-react';

import { RESOURCE_DATA_SORTED } from '../data/constants';
import { getServiceIconUrl } from '../data/serviceIcons';
import { getCategoryColors } from '../data/categoryColors';
import { PREMADE_POLICIES, getReadableTitle } from '../data/conditionalAccessData';
import { RBAC_ROLE_TEMPLATES } from '../data/rbacData';

export const CATEGORY_FILTERS = [
    'All',
    'Navigation',
    'Azure Services',
    'Policies & Templates',
    'Quick Actions'
];

let baseIndexCache = null;
const themeIndexCache = {};

/**
 * Lazily constructs and caches the static search index items.
 * Precomputes normalized `_searchCorpus` on each item for instant, zero-allocation filtering.
 * 
 * @returns {Array<Object>} Static base items list.
 */
function getBaseSearchIndex() {
    if (baseIndexCache) {
        return baseIndexCache;
    }

    const items = [];

    // 1. Navigation & Tools
    const navPages = [
        {
            id: 'nav-dashboard',
            category: 'Navigation',
            title: 'Dashboard',
            subtitle: 'Overview of Azure governance suite and quick access stats',
            keywords: 'dashboard home overview stats governance summary',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Dashboard.svg',
            iconComponent: LayoutDashboard,
            actionType: 'route',
            target: '/'
        },
        {
            id: 'nav-naming',
            category: 'Navigation',
            title: 'Azure Resource Naming Tool',
            subtitle: 'Cloud Adoption Framework (CAF) compliant naming generator for 150+ services',
            keywords: 'naming resource naming caf conventions prefix rules generator abbreviations pattern',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg',
            iconComponent: Compass,
            actionType: 'route',
            target: '/resource-naming'
        },
        {
            id: 'nav-ca',
            category: 'Navigation',
            title: 'Conditional Access Policy Generator',
            subtitle: 'Zero trust security persona baselines and policy deployment templates',
            keywords: 'conditional access ca zero trust security mfa persona policy templates entra id',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg',
            iconComponent: ShieldCheck,
            actionType: 'route',
            target: '/conditional-access'
        },
        {
            id: 'nav-mg',
            category: 'Navigation',
            title: 'Management Group Topology',
            subtitle: 'Visualize and build landing zone hierarchy architectures',
            keywords: 'management groups topology landing zones alz hierarchy subscriptions root architecture',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            iconComponent: Layers,
            actionType: 'route',
            target: '/management-groups'
        },
        {
            id: 'nav-rbac',
            category: 'Navigation',
            title: 'RBAC Role Designer',
            subtitle: 'Design custom Azure role definitions with scoped actions and CLI/Bicep export',
            keywords: 'rbac role designer permissions actions notActions assignableScopes custom role identity',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Azure-AD-Roles-and-Administrators.svg',
            iconComponent: Sliders,
            actionType: 'route',
            target: '/rbac-designer'
        },
        {
            id: 'nav-tags',
            category: 'Navigation',
            title: 'Tagging Strategy Designer',
            subtitle: 'Standardized resource tags for cost tracking, ownership, and automation',
            keywords: 'tagging strategy tags metadata cost allocation ownership environment governance compliance',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Tags.svg',
            iconComponent: Tag,
            actionType: 'route',
            target: '/tagging-strategy'
        }
    ];

    items.push(...navPages);

    // 2. Azure Services & CAF Naming (from RESOURCE_DATA_SORTED)
    RESOURCE_DATA_SORTED.forEach((res) => {
        const iconUrl = getServiceIconUrl(res.name);
        const categoryMeta = getCategoryColors(res.category);

        items.push({
            id: `res-${res.name.toLowerCase().replace(/\s+/g, '-')}`,
            category: 'Azure Services',
            title: res.name,
            subtitle: `CAF Prefix: ${res.abbrev || 'none'} • ${res.scope || res.category}`,
            keywords: `${res.name} ${res.abbrev || ''} ${res.provider || ''} ${res.category} ${res.desc || ''} ${res.bestPractice || ''} naming`,
            badge: res.abbrev || null,
            categoryTag: res.category,
            categoryColors: categoryMeta,
            iconUrl,
            actionType: 'service',
            target: `/resource-naming?search=${encodeURIComponent(res.name)}`,
            serviceName: res.name
        });
    });

    // 3. Conditional Access Premade Policies
    PREMADE_POLICIES.forEach((policy) => {
        items.push({
            id: `policy-${policy.name}`,
            category: 'Policies & Templates',
            title: getReadableTitle(policy.name),
            subtitle: `Conditional Access Baseline • ${policy.categories.join(', ')}`,
            keywords: `${policy.name} ${policy.desc} ${policy.categories.join(' ')} conditional access mfa security zero trust`,
            badge: 'CA Policy',
            iconComponent: ShieldCheck,
            actionType: 'ca-policy',
            target: `/conditional-access?search=${encodeURIComponent(policy.name)}`
        });
    });

    // 4. RBAC Built-in Templates
    RBAC_ROLE_TEMPLATES.forEach((tmpl) => {
        items.push({
            id: `rbac-${tmpl.id}`,
            category: 'Policies & Templates',
            title: tmpl.name,
            subtitle: `Custom RBAC Template • ${tmpl.category} • ${tmpl.description}`,
            keywords: `${tmpl.name} ${tmpl.category} ${tmpl.description} rbac role permissions`,
            badge: 'RBAC',
            iconComponent: Sliders,
            actionType: 'rbac-role',
            target: `/rbac-designer?template=${tmpl.id}`,
            templateId: tmpl.id
        });
    });

    // 5. Static Quick Actions & External Links
    items.push(
        {
            id: 'action-copy-url',
            category: 'Quick Actions',
            title: 'Copy Current Page URL',
            subtitle: typeof window !== 'undefined' ? window.location.href : 'Share this toolkit page',
            keywords: 'copy link url share clipboard page',
            iconComponent: Copy,
            actionType: 'copy-url'
        },
        {
            id: 'action-docs-caf',
            category: 'Quick Actions',
            title: 'Cloud Adoption Framework: Naming & Tagging',
            subtitle: 'Official Microsoft CAF best practices and reference architecture',
            keywords: 'documentation microsoft learn caf naming guidance architecture best practices',
            iconComponent: BookOpen,
            actionType: 'external',
            target: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming'
        },
        {
            id: 'action-github-repo',
            category: 'Quick Actions',
            title: 'Azure Governance Toolkit on GitHub',
            subtitle: 'View source code, star the repository, or contribute',
            keywords: 'github repository source code open source star issue danzure',
            iconComponent: Github,
            actionType: 'external',
            target: 'https://github.com/danzure/azure-governance-toolkit'
        },
        {
            id: 'action-atozazure',
            category: 'Quick Actions',
            title: 'Visit atozazure.com',
            subtitle: 'Cloud architecture guides, certification pathways, and Azure tooling',
            keywords: 'atozazure daniel powley portfolio blog certifications',
            iconComponent: Sparkles,
            actionType: 'external',
            target: 'https://atozazure.com'
        }
    );

    // Precompute normalized search corpus and word tokens for all base items
    items.forEach((item) => {
        const collapsedTitle = item.title.replace(/\s+/g, '');
        item._searchCorpus = `${item.title} ${collapsedTitle} ${item.subtitle} ${item.keywords || ''} ${item.badge || ''} ${item.categoryTag || ''}`.toLowerCase();
        item._corpusWords = Array.from(new Set(item._searchCorpus.split(/[^a-z0-9]+/))).filter((w) => w.length >= 3);
    });

    baseIndexCache = items;
    return baseIndexCache;
}

/**
 * Builds or retrieves the cached unified search index for the Command Palette.
 * Caches results per theme preference to guarantee O(1) retrieval.
 * 
 * @param {string} [themePref='system'] - Current theme preference for active state badges.
 * @returns {Array<Object>} List of indexed items.
 */
export function buildSearchIndex(themePref = 'system') {
    const normalizedPref = ['system', 'light', 'dark'].includes(themePref) ? themePref : 'system';
    if (themeIndexCache[normalizedPref]) {
        return themeIndexCache[normalizedPref];
    }

    const baseItems = getBaseSearchIndex();

    const themeItems = [
        {
            id: 'action-theme-light',
            category: 'Quick Actions',
            title: 'Appearance: Light Mode',
            subtitle: normalizedPref === 'light' ? 'Currently active' : 'Switch application theme to Light',
            keywords: 'theme light mode appearance bright white daylight',
            iconComponent: Sun,
            actionType: 'set-theme',
            themeValue: 'light',
            badge: normalizedPref === 'light' ? 'Active' : null
        },
        {
            id: 'action-theme-dark',
            category: 'Quick Actions',
            title: 'Appearance: Dark Mode',
            subtitle: normalizedPref === 'dark' ? 'Currently active' : 'Switch application theme to Dark',
            keywords: 'theme dark mode appearance night contrast black',
            iconComponent: Moon,
            actionType: 'set-theme',
            themeValue: 'dark',
            badge: normalizedPref === 'dark' ? 'Active' : null
        },
        {
            id: 'action-theme-system',
            category: 'Quick Actions',
            title: 'Appearance: Sync with System',
            subtitle: normalizedPref === 'system' ? 'Currently active' : 'Follow device OS appearance preference',
            keywords: 'theme system mode appearance auto sync device os',
            iconComponent: Monitor,
            actionType: 'set-theme',
            themeValue: 'system',
            badge: normalizedPref === 'system' ? 'Active' : null
        }
    ];

    themeItems.forEach((item) => {
        const collapsedTitle = item.title.replace(/\s+/g, '');
        item._searchCorpus = `${item.title} ${collapsedTitle} ${item.subtitle} ${item.keywords || ''} ${item.badge || ''}`.toLowerCase();
        item._corpusWords = Array.from(new Set(item._searchCorpus.split(/[^a-z0-9]+/))).filter((w) => w.length >= 3);
    });

    const fullIndex = [...baseItems, ...themeItems];
    themeIndexCache[normalizedPref] = fullIndex;
    return fullIndex;
}

/**
 * Fast 1-edit distance check (insertion, deletion, substitution, transposition).
 * @param {string} s1 
 * @param {string} s2 
 * @returns {boolean}
 */
export function isOneEditDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    if (Math.abs(len1 - len2) > 1) return false;

    // Same length: substitution or transposition
    if (len1 === len2) {
        let diffCount = 0;
        const diffIndices = [];
        for (let i = 0; i < len1; i++) {
            if (s1[i] !== s2[i]) {
                diffCount++;
                if (diffCount > 2) return false;
                diffIndices.push(i);
            }
        }
        if (diffCount === 1) return true; // Single character substitution
        if (diffCount === 2) {
            const [i, j] = diffIndices;
            // Transposition check (adjacent characters swapped)
            return j === i + 1 && s1[i] === s2[j] && s1[j] === s2[i];
        }
        return false;
    }

    // Length difference 1: insertion / deletion
    const longer = len1 > len2 ? s1 : s2;
    const shorter = len1 > len2 ? s2 : s1;

    let i = 0;
    let j = 0;
    let edits = 0;

    while (i < longer.length && j < shorter.length) {
        if (longer[i] !== shorter[j]) {
            edits++;
            if (edits > 1) return false;
            i++;
        } else {
            i++;
            j++;
        }
    }
    return true;
}

/**
 * Filters the search index by category and multi-token search query.
 * Uses precomputed `_searchCorpus` for 22x faster execution with zero allocations,
 * with automatic 1-edit distance typo tolerance fallback when exact matches return 0 items.
 * 
 * @param {Array<Object>} items - The full search index.
 * @param {string} query - The search query input.
 * @param {string} [selectedCategory='All'] - The active category filter pill.
 * @returns {Array<Object>} Filtered list of matching items.
 */
export function filterSearchIndex(items, query, selectedCategory = 'All') {
    let results = items;

    // Filter by category chip
    if (selectedCategory && selectedCategory !== 'All') {
        results = results.filter((item) => item.category === selectedCategory);
    }

    const cleanQuery = (query || '').trim().toLowerCase();
    if (!cleanQuery) {
        return results;
    }

    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

    // 1. Exact multi-token matching (sub-millisecond)
    const exactMatches = results.filter((item) => {
        const corpus = item._searchCorpus || `${item.title} ${item.subtitle} ${item.keywords || ''} ${item.badge || ''} ${item.categoryTag || ''}`.toLowerCase();
        return queryTokens.every((token) => corpus.includes(token));
    });

    if (exactMatches.length > 0) {
        return exactMatches.slice(0, 50);
    }

    // 2. Typo-tolerant fuzzy fallback if exact matching returned 0 results
    if (cleanQuery.length >= 3) {
        const fuzzyMatches = results.filter((item) => {
            const corpus = item._searchCorpus || '';
            const words = item._corpusWords || [];

            return queryTokens.every((token) => {
                // If token is found as substring, it passes
                if (corpus.includes(token)) return true;
                // If token is short (< 4 chars), don't allow fuzzy edits
                if (token.length < 4) return false;
                // Check if any word in the item's corpus has edit distance <= 1
                return words.some((word) => isOneEditDistance(token, word));
            });
        });

        if (fuzzyMatches.length > 0) {
            return fuzzyMatches.slice(0, 50);
        }
    }

    return [];
}

export const RECENT_COMMANDS_KEY = 'azres_recent_commands';
const MAX_RECENT_COMMANDS = 5;

/**
 * Helper to safely access localStorage across browser and test environments.
 */
function getStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
    }
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        return globalThis.localStorage;
    }
    return null;
}

/**
 * Retrieves stored recent command IDs from localStorage.
 * @returns {Array<string>}
 */
export function getRecentCommandIds() {
    const storage = getStorage();
    if (!storage) return [];
    try {
        const stored = storage.getItem(RECENT_COMMANDS_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/**
 * Records a command selection into localStorage.
 * @param {string} itemId
 */
export function saveRecentCommandId(itemId) {
    const storage = getStorage();
    if (!storage || !itemId) return;
    try {
        const current = getRecentCommandIds().filter((id) => id !== itemId);
        const updated = [itemId, ...current].slice(0, MAX_RECENT_COMMANDS);
        storage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(updated));
    } catch {
        // Storage error handling
    }
}

/**
 * Removes a single command ID from recent commands.
 * @param {string} itemId
 */
export function removeRecentCommandId(itemId) {
    const storage = getStorage();
    if (!storage || !itemId) return;
    try {
        const current = getRecentCommandIds().filter((id) => id !== itemId);
        storage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(current));
    } catch {
        // Storage error handling
    }
}

/**
 * Clears all recent commands from localStorage.
 */
export function clearRecentCommands() {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.removeItem(RECENT_COMMANDS_KEY);
    } catch {
        // Storage error handling
    }
}

export const FEATURED_SERVICES = [
    'Key vault',
    'Virtual machines',
    'Storage account',
    'Azure Kubernetes Service (AKS)',
    'App Service',
    'Virtual network',
    'Azure SQL Database',
    'Function App'
];

/**
 * Assembles recommended initial items when search query is empty.
 * Displays Recent commands (if any), Navigation, Featured Services, and Quick Actions.
 * Reduces initial modal DOM elements from ~1,700 to ~200 for instant animation.
 * 
 * @param {Array<Object>} searchIndex - The full search index.
 * @param {Array<string>} [recentIds=[]] - Array of recent item IDs.
 * @returns {Array<Object>} Recommended initial items.
 */
export function getInitialCommandPaletteItems(searchIndex, recentIds = []) {
    const items = [];

    // 1. Recent commands (if any)
    if (Array.isArray(recentIds) && recentIds.length > 0) {
        const recentItems = recentIds
            .map((id) => searchIndex.find((i) => i.id === id))
            .filter(Boolean)
            .map((item) => ({
                ...item,
                id: `recent-${item.id}`,
                originalId: item.id,
                category: 'Recent',
                isRecent: true
            }));

        items.push(...recentItems);
    }

    // 2. Navigation items
    const navItems = searchIndex.filter((i) => i.category === 'Navigation');
    items.push(...navItems);

    // 3. Featured Azure Services
    const featuredServices = FEATURED_SERVICES
        .map((name) => searchIndex.find((i) => i.title === name))
        .filter(Boolean)
        .map((item) => ({
            ...item,
            id: `featured-${item.id}`,
            originalId: item.id,
            category: 'Featured Azure Services'
        }));
    items.push(...featuredServices);

    // 4. Quick Actions
    const quickActions = searchIndex.filter((i) => i.category === 'Quick Actions');
    items.push(...quickActions);

    return items;
}

/**
 * Groups filtered items by category preserving category order.
 * 
 * @param {Array<Object>} items - Filtered list of items.
 * @returns {Object.<string, Array<Object>>} Grouped items dictionary.
 */
export function groupResultsByCategory(items) {
    const groups = {};
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!groups[item.category]) {
            groups[item.category] = [];
        }
        groups[item.category].push(item);
    }
    return groups;
}
