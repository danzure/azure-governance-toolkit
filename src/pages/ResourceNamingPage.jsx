import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

import ConfigPanel from '../components/ConfigPanel';
import ResourceGrid from '../components/ResourceGrid';
import ScrollToTopButton from '../components/ScrollToTopButton';
import ServiceFilter from '../components/ServiceFilter';
import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateName as generateResourceName } from '../utils/nameGenerator';

import { AZURE_REGIONS, RESOURCE_DATA_SORTED, CATEGORIES } from '../data/constants';

/**
 * Main Application Component
 * 
 * Manages global state for the Azure Resource Naming Tool, including:
 * - Theme preferences (Light/Dark mode)
 * - Naming configuration (Workload, Environment, Region, Instance)
 * - Search filtering and active category selection
 * - Resource data and generation logic
 */
export default function ResourceNamingPage() {
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
    const searchInputRef = useRef(null);

    // Debounce search term to prevent expensive filtering on every keystroke
    // Delays search execution by 300ms until user stops typing
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Keyboard shortcuts handler
    // - Escape: Close expanded cards or clear search
    // - Ctrl+K / Forward Slash: Focus search input
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Escape to close expanded card or clear search
            if (e.key === 'Escape') {
                if (document.querySelector('.col-span-full')) return; // A card is expanded, let ResourceGrid handle it
                if (searchTerm) {
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
    }, [searchTerm]);



    // Stable callback references for memoised child components
    const handleToggleMinimize = useCallback(() => setIsConfigMinimized(prev => !prev), []);
    const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
    const handleClearSearch = useCallback(() => setSearchTerm(''), []);



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
    const generateName = useCallback((resource, selectedSubResource = null, instanceOverride = null, patternOverride = null) => {
        return generateResourceName(resource, {
            workload,
            orgPrefix,
            regionAbbrev: currentRegion?.abbrev || 'uks',
            instance: instanceOverride || formattedInstance,
            envValue,
            namingOrder,
            showOrg,
            patternOverride
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

    const handleCopySchema = useCallback((e) => {
        copyToClipboard(liveSchemaStr, 'live-pill', e);
    }, [copyToClipboard, liveSchemaStr]);

    return (
        <div className="pt-12">
            <ConfigPanel
                isMinimized={isConfigMinimized}
                onToggleMinimize={handleToggleMinimize}
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
                onCopy={handleCopySchema}
            />

            <div className="max-w-[1600px] mx-auto px-6 pt-6 space-y-5">
                {/* Compact service toolbar: search + category tabs */}
                <ServiceFilter
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    categories={CATEGORIES}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onClearSearch={handleClearSearch}
                    searchInputRef={searchInputRef}
                />

                {/* Resource Grid */}
                <ResourceGrid
                    resources={filteredResources}
                    generateName={generateName}
                    copiedId={copiedId}
                    onCopy={copyToClipboard}
                />

                {/* Footer */}
                <footer className="py-6 text-center text-[12px] text-[#605e5c] dark:text-[#a19f9d]">
                    Published by <a href="https://www.linkedin.com/in/danielpowley92/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0078d4] hover:underline">Daniel Powley</a> • <a href="https://blog.atozazure.com" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">Blog</a> • <a href="https://github.com/danzure/azres-naming-tool" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">GitHub</a> • Licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline">MIT License</a>
                </footer>
            </div>

            <ScrollToTopButton />
        </div>
    );
}
