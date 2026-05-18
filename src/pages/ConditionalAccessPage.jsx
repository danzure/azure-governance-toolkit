import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Shield, Settings } from 'lucide-react';
import ServiceFilter from '../components/ServiceFilter';
import PolicyGroupCard from '../components/PolicyGroupCard';
import PatternBuilderCard from '../components/PatternBuilderCard';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { PREMADE_POLICIES, CA_CATEGORIES, getReadableTitle } from '../data/conditionalAccessData';

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
        <div className="pt-12">
            <nav className="mt-[48px] shadow-sm transition-all border-b bg-white dark:bg-[#252423] border-[#edebe9] dark:border-[#484644]">
                <div className="max-w-[1600px] mx-auto px-4 py-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-[16px] font-semibold text-[#242424] dark:text-white">Conditional Access</h2>
                            <p className="text-[13px] text-[#616161] dark:text-[#a19f9d]">Policy naming generator</p>
                        </div>
                    </div>

                    <PatternBuilderCard copiedId={copiedId} handleCopy={handleCopy} />
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto px-4 pt-6 pb-12 space-y-5">
                {/* Pre-made Policies Section - styled like ResourceCards */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#0078d4]" />
                        <h2 className="text-[16px] font-semibold text-[#242424] dark:text-white">Common Microsoft Defaults</h2>
                    </div>
                    <button
                        onClick={() => setGlobalExpandState(!globalExpandState)}
                        className="flex items-center gap-1.5 text-[12px] font-medium text-[#0078d4] dark:text-[#60cdff] hover:text-[#005a9e] dark:hover:text-[#4cc1ff] transition-colors"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        {globalExpandState ? 'Collapse All Settings' : 'Expand All Settings'}
                    </button>
                </div>

                <ServiceFilter
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    categories={CA_CATEGORIES}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onClearSearch={handleClearSearch}
                    searchInputRef={searchInputRef}
                />

                {groupedPolicies.length === 0 ? (
                    <div className="text-center py-16 text-[#605e5c] dark:text-[#a19f9d]">
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

            {/* Footer */}
            <footer className="py-6 text-center text-[12px] text-[#605e5c] dark:text-[#a19f9d]">
                Published by <a href="https://www.linkedin.com/in/danielpowley92/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0078d4] hover:underline">Daniel Powley</a> • <a href="https://blog.atozazure.com" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">Blog</a> • <a href="https://github.com/danzure/azres-naming-tool" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">GitHub</a> • Licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">MIT License</a>
            </footer>

            <ScrollToTopButton />
        </div>
    );
}
