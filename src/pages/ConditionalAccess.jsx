import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Shield, Settings } from 'lucide-react';
import { PREMADE_POLICIES, CA_CATEGORIES, getReadableTitle } from '../data/conditionalAccessData';
import PatternBuilderCard from '../components/policy/PatternBuilderCard';
import ServiceFilter from '../components/shared/ServiceFilter';
import PolicyGroupCard from '../components/policy/PolicyGroupCard';

// Pre-compute groupings outside the render lifecycle for performance
const INITIAL_GROUPS = {};
PREMADE_POLICIES.forEach(policy => {
    const parts = policy.name.split('-');
    const requirement = parts.length === 5 ? parts[4] : 'Other';
    if (!INITIAL_GROUPS[requirement]) INITIAL_GROUPS[requirement] = [];
    INITIAL_GROUPS[requirement].push(policy);
});

const PRE_GROUPED_POLICIES = Object.entries(INITIAL_GROUPS)
    .map(([requirement, policies]) => ({ requirement, policies }))
    .sort((a, b) => getReadableTitle(a.requirement).localeCompare(getReadableTitle(b.requirement)));


/**
 * The Conditional Access Policy Builder Page component.
 * Provides an interactive UI to generate standardized Microsoft Entra Conditional Access policy names.
 * Allows users to construct names from various parts (Prefix, Persona, Resource, Platform, Requirement)
 * or to view and copy from a curated list of Microsoft-recommended defaults.
 * 
 * @returns {JSX.Element} The rendered Conditional Access page.
 */
export default function ConditionalAccessPage() {
    // UI state for copy feedback
    const [copiedId, setCopiedId] = useState(null);
    const [globalExpandState, setGlobalExpandState] = useState(false);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const searchInputRef = useRef(null);

    const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
    const handleClearSearch = useCallback(() => setSearchTerm(''), []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (searchTerm) {
                    setSearchTerm('');
                    searchInputRef.current?.blur();
                }
            }

            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement !== searchInputRef.current)) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchTerm]);

    /**
     * Asynchronously copies the provided text to the user's clipboard and triggers temporary UI feedback.
     * 
     * @param {string} text - The string value to copy to the clipboard.
     * @param {string} id - A unique identifier to track which element triggered the copy (for setting UI state).
     */
    const handleCopy = useCallback(async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }, []);

    const groupedPolicies = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();

        return PRE_GROUPED_POLICIES.map(({ requirement, policies }) => {
            const matchingPolicies = policies.filter(policy => {
                const matchesCategory = activeCategory === 'All' || policy.categories.includes(activeCategory);
                if (!matchesCategory) return false;
                if (!lowerSearch) return true;
                return policy.name.toLowerCase().includes(lowerSearch) || policy.desc.toLowerCase().includes(lowerSearch);
            });

            if (matchingPolicies.length === 0) return null;
            return { requirement, policies: matchingPolicies };
        }).filter(Boolean);
    }, [searchTerm, activeCategory]);



    return (
        <div className="flex flex-col min-w-0 w-full">
            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 animate-fade-in flex-1 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-[22px] md:text-[24px] font-normal text-fluent-fg-primary mb-2">
                        Conditional Access Naming Generator
                    </h1>
                    <p className="text-[13px] md:text-[14px] text-fluent-fg-secondary max-w-3xl">
                        Design and generate standardized Microsoft Entra Conditional Access policy names.
                    </p>
                </div>

                <PatternBuilderCard copiedId={copiedId} handleCopy={handleCopy} />
            </div>

            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-6 pb-12 space-y-5">
                {/* Pre-made Policies Section - styled like ResourceCards */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 transform-gpu">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-fluent-brand-fg" />
                        <h2 className="text-[16px] font-semibold text-fluent-fg-primary">Common Microsoft Defaults</h2>
                    </div>
                    <button
                        onClick={() => setGlobalExpandState(!globalExpandState)}
                        className="px-3 h-[32px] rounded-[4px] text-[13px] font-medium text-fluent-fg-secondary hover:text-fluent-brand-fg hover:bg-fluent-brand-bg/10 border border-transparent hover:border-fluent-brand-bg/20 transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        {globalExpandState ? 'Collapse All Settings' : 'Expand All Settings'}
                    </button>
                </div>

                <div className="sticky top-0 z-30 pt-2 pb-3 -mt-2 bg-fluent-bg-canvas border-b border-fluent-stroke-subtle shadow-sm">
                    <ServiceFilter
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        categories={CA_CATEGORIES}
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        onClearSearch={handleClearSearch}
                        searchInputRef={searchInputRef}
                    />
                </div>

                {groupedPolicies.length === 0 ? (
                    <div className="text-center py-16 text-fluent-fg-tertiary">
                        <p className="text-[14px]">No policies found matching your criteria.</p>
                        <p className="text-[12px] mt-2">Try adjusting your search or category filter.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {groupedPolicies.map((group) => (
                            <PolicyGroupCard
                                key={group.requirement}
                                requirement={group.requirement}
                                policies={group.policies}
                                copiedId={copiedId}
                                handleCopy={handleCopy}
                                globalExpandState={globalExpandState}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
