import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import ResourceCard from './components/ResourceCard';
import ServiceFilter from './components/ServiceFilter';
import useDebounce from './hooks/useDebounce';
import useLocalStorage from './hooks/useLocalStorage';
import { generateName as generateResourceName } from './utils/nameGenerator';

import { AZURE_REGIONS, RESOURCE_DATA_SORTED, CATEGORIES } from './data/constants';

/**
 * Main Application Component
 * 
 * Manages global state for the Azure Resource Naming Tool, including:
 * - Theme preferences (Light/Dark mode)
 * - Naming configuration (Workload, Environment, Region, Instance)
 * - Search filtering and active category selection
 * - Resource data and generation logic
 */
export default function App() {
    // Persistent state using local storage for user preferences
    const [isDarkMode, setIsDarkMode] = useLocalStorage('azres_darkMode', false);
    const [isConfigMinimized, setIsConfigMinimized] = useState(false);

    const [workload, setWorkload] = useLocalStorage('azres_workload', '');
    const [envValue, setEnvValue] = useLocalStorage('azres_env', 'prod');
    const [regionValue, setRegionValue] = useLocalStorage('azres_region', 'uksouth');
    const [instance, setInstance] = useLocalStorage('azres_instance', '001');
    const [orgPrefix, setOrgPrefix] = useLocalStorage('azres_orgPrefix', '');
    const [namingOrder, setNamingOrder] = useLocalStorage('azres_namingOrder', ['Org', 'Resource', 'Workload', 'Environment', 'Region', 'Instance']);
    const [showOrg, setShowOrg] = useLocalStorage('azres_showOrg', false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useLocalStorage('azres_category', 'All');
    const [copiedId, setCopiedId] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);
    const [subResourceSelections, setSubResourceSelections] = useLocalStorage('azres_subResources', {}); // Track selected sub-resource per resource
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [visibleCount, setVisibleCount] = useState(24); // Initial visible count for infinite scroll

    const searchInputRef = useRef(null);

    // Debounce search term to prevent expensive filtering on every keystroke
    // Delays search execution by 300ms until user stops typing
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Toggle document class for Tailwind dark mode
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Keyboard shortcuts handler
    // - Escape: Close expanded cards or clear search
    // - Ctrl+K / Forward Slash: Focus search input
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Escape to close expanded card or clear search
            if (e.key === 'Escape') {
                if (expandedCard) {
                    setExpandedCard(null);
                } else if (searchTerm) {
                    setSearchTerm('');
                    searchInputRef.current?.blur();
                }
            }

            // Ctrl+K or / to focus search
            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement !== searchInputRef.current)) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [expandedCard, searchTerm]);

    // Scroll-to-top visibility and Infinite Scroll (throttled with rAF)
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setShowScrollTop(window.scrollY > 200);
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
                        setVisibleCount(prev => Math.min(prev + 24, 1000));
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reset visible count on filter change
    useEffect(() => {
        setVisibleCount(24);
    }, [debouncedSearchTerm, activeCategory]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);



    const currentRegion = useMemo(() => AZURE_REGIONS.find(r => r.value === regionValue) || AZURE_REGIONS.find(r => !r.type), [regionValue]);
    const formattedInstance = useMemo(() => (instance || '001').padStart(3, '0'), [instance]);

    const moveItem = useCallback((index, direction) => {
        setNamingOrder(prev => {
            const newOrder = [...prev];
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= newOrder.length) return prev;
            [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
            return newOrder;
        });
    }, []);

    const handleInstanceChange = useCallback((e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length <= 3) setInstance(val);
    }, []);

    /**
     * Generates a compliant Azure resource name based on configuration and resource specific rules.
     * Delegates to the pure generateName utility with current state as config.
     */
    const generateName = useCallback((resource, selectedSubResource = null, instanceOverride = null) => {
        return generateResourceName(resource, {
            workload,
            orgPrefix,
            regionAbbrev: currentRegion?.abbrev || 'uks',
            instance: instanceOverride || formattedInstance,
            envValue,
            namingOrder,
            showOrg,
        }, selectedSubResource);
    }, [workload, orgPrefix, currentRegion, formattedInstance, envValue, namingOrder, showOrg]);

    const filteredResources = useMemo(() => {
        const lowerSearch = debouncedSearchTerm.toLowerCase();
        
        return RESOURCE_DATA_SORTED.filter(rt => {
            // Short-circuit category match first 
            const matchesCategory = activeCategory === 'All' || rt.category === activeCategory;
            if (!matchesCategory) return false;
            
            // Short-circuit empty search
            if (!lowerSearch) return true;
            
            // Only perform string allocations if necessary
            return String(rt.name).toLowerCase().includes(lowerSearch) || String(rt.abbrev).toLowerCase().includes(lowerSearch);
        });
    }, [debouncedSearchTerm, activeCategory]);

    const displayedResources = useMemo(() => {
        return filteredResources.slice(0, visibleCount);
    }, [filteredResources, visibleCount]);

    const copyToClipboard = useCallback(async (text, id, e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }, []);

    const handleCardToggle = useCallback((resourceName, isCurrentlyExpanded) => {
        if (isCurrentlyExpanded) {
            setExpandedCard(null);
        } else {
            setExpandedCard(resourceName);
            // Scroll to center the card after a brief delay to allow expansion
            setTimeout(() => {
                const element = document.getElementById(`resource-${resourceName}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 50);
        }
    }, []);

    const handleSubResourceChange = useCallback((resourceName, suffix) => {
        setSubResourceSelections(prev => ({ ...prev, [resourceName]: suffix }));
    }, []);

    // Generate the schema pattern (shows placeholders like {resource}-{workload}-{env}-{region}-{instance})
    const liveSchemaStr = useMemo(() => {
        let parts = [];
        namingOrder.forEach(part => {
            if (part === 'Org' && showOrg) parts.push('{org}');
            if (part === 'Resource') parts.push('{resource}');
            if (part === 'Workload') parts.push('{workload}');
            if (part === 'Environment') parts.push('{environment}');
            if (part === 'Region') parts.push('{region}');
            if (part === 'Instance') parts.push('{instance}');
        });
        return parts.join('-');
    }, [namingOrder, showOrg]);

    return (
        <div className="min-h-screen font-sans transition-colors duration-200 bg-[#faf9f8] dark:bg-[#111009] text-[#242424] dark:text-white">
            <Header
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(prev => !prev)}
            />

            <ConfigPanel
                isMinimized={isConfigMinimized}
                onToggleMinimize={() => setIsConfigMinimized(prev => !prev)}
                workload={workload}
                setWorkload={setWorkload}
                envValue={envValue}
                setEnvValue={setEnvValue}
                regionValue={regionValue}
                setRegionValue={setRegionValue}
                instance={instance}
                onInstanceChange={handleInstanceChange}
                orgPrefix={orgPrefix}
                setOrgPrefix={setOrgPrefix}
                showOrg={showOrg}
                setShowOrg={setShowOrg}
                namingOrder={namingOrder}
                onMoveItem={moveItem}
                liveSchemaStr={liveSchemaStr}
                copiedId={copiedId}
                onCopy={(e) => copyToClipboard(liveSchemaStr, 'live-pill', e)}
            />

            <div className="max-w-[1600px] mx-auto px-6 pt-6 space-y-5">
                {/* Compact service toolbar: search + category tabs */}
                <ServiceFilter
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    categories={CATEGORIES}
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    onClearSearch={() => setSearchTerm('')}
                    searchInputRef={searchInputRef}
                />

                {/* Resource Grid */}
                {displayedResources.length === 0 ? (
                    <div className="text-center py-16 text-[#605e5c] dark:text-[#a19f9d]">
                        <p className="text-[14px]">No resources found matching your criteria.</p>
                        <p className="text-[12px] mt-2">Try adjusting your search or category filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {displayedResources.map((resource, index) => {
                            const selectedSubResource = subResourceSelections[resource.name] || (resource.subResources?.[0]?.suffix);
                            const genName = generateName(resource, selectedSubResource);
                            const isCopied = copiedId === resource.name;
                            const isExpanded = expandedCard === resource.name;
                            // Cap stagger delay at 10 items to prevent long waits
                            const staggerClass = index < 10 ? `stagger-${index + 1}` : '';

                            return (
                                <div key={resource.name} className={`animate-fade-in opacity-0 ${staggerClass} ${isExpanded ? 'col-span-full z-10' : 'h-full'}`}>
                                    <ResourceCard
                                        id={`resource-${resource.name}`}
                                        resource={resource}
                                        genName={genName}
                                        isCopied={isCopied}
                                        isExpanded={isExpanded}
                                        onCopy={copyToClipboard}
                                        onToggle={handleCardToggle}
                                        selectedSubResource={selectedSubResource}
                                        onSubResourceChange={handleSubResourceChange}
                                        generateName={generateName}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                <footer className="py-6 text-center text-[12px] text-[#605e5c] dark:text-[#a19f9d]">
                    Published by <a href="https://www.linkedin.com/in/danielpowley92/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0078d4] hover:underline">Daniel Powley</a> • <a href="https://github.com/danzure/azres-naming-tool" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">GitHub</a> • Licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">MIT License</a>
                </footer>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg hover:shadow-depth transition-all duration-300 z-50 animate-scale-in bg-primary-gradient dark:bg-[#323130] text-white hover:shadow-glow dark:hover:shadow-none dark:hover:bg-[#484644]"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
