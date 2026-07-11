import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

import ConfigPanel from '../components/naming/ConfigPanel';
import ResourceGrid from '../components/naming/ResourceGrid';
import ServiceFilter from '../components/shared/ServiceFilter';
import AiPromptBar from '../components/ai/AiPromptBar';
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
    const [isConfigMinimized, setIsConfigMinimized] = useState(true);

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
    const aiInputRef = useRef(null);

    // Debounce search term to prevent expensive filtering on every keystroke
    // Delays search execution by 300ms until user stops typing
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Keyboard shortcuts handler
    // - Escape: Close expanded cards, clear search, or unfocus AI prompt
    // - Ctrl+K: Focus AI Prompt Bar
    // - Forward Slash (/): Focus Grid Search
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Escape to close expanded card or clear search
            if (e.key === 'Escape') {
                if (document.querySelector('.col-span-full')) return; // A card is expanded, let ResourceGrid handle it
                
                if (document.activeElement === aiInputRef.current) {
                    aiInputRef.current?.blur();
                } else if (searchTerm) {
                    setSearchTerm('');
                    searchInputRef.current?.blur();
                }
            }

            // Ctrl+K to focus AI prompt bar
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                aiInputRef.current?.focus();
            }
            
            // Forward Slash to focus grid search
            if (e.key === '/' && document.activeElement !== searchInputRef.current && document.activeElement !== aiInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchTerm, aiInputRef, searchInputRef]);



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
    }, [setNamingOrder]);

    const handleInstanceChange = useCallback((e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length <= 3) setInstance(val);
    }, [setInstance]);

    /**
     * Generates a compliant Azure resource name based on configuration and resource specific rules.
     * Delegates to the pure generateName utility with current state as config.
     */
    const generateName = useCallback((resource, selectedSubResource = null, instanceOverride = null, patternOverride = null) => {
        return generateResourceName(resource, {
            workload,
            orgPrefix,
            regionAbbrev: currentRegion?.abbrev || 'uks',
            regionValue: currentRegion?.value || 'uksouth',
            instance: instanceOverride || formattedInstance,
            envValue,
            namingOrder,
            showOrg,
            patternOverride
        }, selectedSubResource);
    }, [workload, orgPrefix, currentRegion, formattedInstance, envValue, namingOrder, showOrg]);

    const filteredResources = useMemo(() => {
        const terms = debouncedSearchTerm.split(',')
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);
            
        // Pre-compute which terms perfectly match a known resource
        const exactMatchTerms = new Set();
        terms.forEach(term => {
            const hasExactMatch = RESOURCE_DATA_SORTED.some(rt => 
                String(rt.name).toLowerCase() === term || String(rt.abbrev).toLowerCase() === term
            );
            if (hasExactMatch) {
                exactMatchTerms.add(term);
            }
        });
        
        return RESOURCE_DATA_SORTED.filter(rt => {
            // Short-circuit category match first 
            const matchesCategory = activeCategory === 'All' || rt.category === activeCategory;
            if (!matchesCategory) return false;
            
            // Short-circuit empty search
            if (terms.length === 0) return true;
            
            const nameLower = String(rt.name).toLowerCase();
            const abbrevLower = String(rt.abbrev).toLowerCase();
            
            // Check if any of the search terms match the resource
            return terms.some(term => {
                // 1. If it's a perfect match for THIS specific resource, always show it
                if (nameLower === term || abbrevLower === term) return true;
                
                // 2. If this term was a perfect match for SOME OTHER resource, 
                // do NOT use it to lazily/partially match this one.
                // (e.g. searching exact "Workspace" shouldn't show "Databricks Workspace")
                if (exactMatchTerms.has(term)) return false;
                
                // 3. Otherwise, perform a standard partial match
                return nameLower.includes(term) || abbrevLower.includes(term);
            });
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

    const handleResetDefaults = useCallback(() => {
        setWorkload('');
        setEnvValue('prod');
        setRegionValue('uksouth');
        setInstance('001');
        setOrgPrefix('');
        setNamingOrder(['Org', 'Resource', 'Workload', 'Environment', 'Region', 'Instance']);
        setShowOrg(false);
        setSearchTerm('');
        setActiveCategory('All');
    }, [setWorkload, setEnvValue, setRegionValue, setInstance, setOrgPrefix, setNamingOrder, setShowOrg, setActiveCategory]);

    return (
        <div className="flex flex-col min-w-0 w-full">
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
                onResetDefaults={handleResetDefaults}
            >
                {/* AI Magic Fill is now the primary interaction point */}
                <AiPromptBar 
                    ref={aiInputRef}
                    setWorkload={setWorkload}
                    setEnvValue={setEnvValue}
                    setRegionValue={setRegionValue}
                    setSearchTerm={setSearchTerm}
                    setActiveCategory={setActiveCategory}
                    onResetAll={handleResetDefaults}
                />
            </ConfigPanel>

            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-5">
                {/* Compact service toolbar: search + category tabs */}
                <div className="sticky top-0 z-30 pt-2 pb-3 -mt-2 bg-fluent-bg-canvas border-b border-fluent-stroke-subtle shadow-sm">
                    <ServiceFilter
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        categories={CATEGORIES}
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        onClearSearch={handleClearSearch}
                        searchInputRef={searchInputRef}
                    />
                </div>

                {/* Resource Grid */}
                <ResourceGrid
                    resources={filteredResources}
                    generateName={generateName}
                    copiedId={copiedId}
                    onCopy={copyToClipboard}
                />
            </div>
        </div>
    );
}
