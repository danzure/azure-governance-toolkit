import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Info, ExternalLink, ChevronDown } from 'lucide-react';

import { ConfigPanel, ResourceGrid, NamingPromptBar, generateName as generateResourceName, AZURE_REGIONS, RESOURCE_DATA_SORTED, CATEGORIES } from '@features/naming';

import { ServiceFilter } from '@shared';

import { ScrollToTopButton } from '@core/layout';
import { useDebounce, useLocalStorage } from '@core/hooks';





/**
 * Main Resource Naming Page Component
 * 
 * Manages global state for the Azure Resource Naming Tool, including:
 * - Theme preferences (Light/Dark mode)
 * - Naming configuration (Workload, Environment, Region, Instance)
 * - Search filtering and active category selection
 * - Resource data and generation logic
 */
export default function ResourceNamingPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isConfigMinimized, setIsConfigMinimized] = useState(true);
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);

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
    const [deepLinkedService, setDeepLinkedService] = useState(null);
    const searchInputRef = useRef(null);
    const aiInputRef = useRef(null);

    // Deep-link integration from Command Palette (?search= or ?service=)
    useEffect(() => {
        const serviceVal = searchParams.get('service');
        const searchVal = searchParams.get('search');
        const queryVal = serviceVal || searchVal;

        if (queryVal) {
            setSearchTerm(queryVal);
            setActiveCategory('All');

            // If the query matches a known resource, auto-expand and scroll to it
            const matched = RESOURCE_DATA_SORTED.find(
                r => r.name.toLowerCase() === queryVal.toLowerCase() || (r.abbrev && r.abbrev.toLowerCase() === queryVal.toLowerCase())
            );
            if (matched) {
                setDeepLinkedService(matched.name);
            }

            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams, setActiveCategory]);

    // Debounce search term to prevent expensive filtering on every keystroke
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Keyboard shortcuts handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Escape to close expanded card or clear search
            if (e.key === 'Escape') {
                if (document.querySelector('.col-span-full')) return;
                
                if (document.activeElement === aiInputRef.current) {
                    aiInputRef.current?.blur();
                } else if (searchTerm) {
                    setSearchTerm('');
                    searchInputRef.current?.blur();
                }
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
            const matchesCategory = activeCategory === 'All' || 
                (Array.isArray(rt.category) ? rt.category.includes(activeCategory) : rt.category === activeCategory);
            if (!matchesCategory) return false;
            
            // Short-circuit empty search
            if (terms.length === 0) return true;
            
            const nameLower = String(rt.name).toLowerCase();
            const abbrevLower = String(rt.abbrev).toLowerCase();
            
            // Check if any of the search terms match the resource
            return terms.some(term => {
                if (nameLower === term || abbrevLower === term) return true;
                if (exactMatchTerms.has(term)) return false;
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
        <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 animate-fade-in flex-1 flex flex-col gap-4 sm:gap-5 pb-12">
            
            {/* Header */}
            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-fluent-fg-primary mb-2">
                        Azure Resource Naming Tool
                    </h1>
                    <p className="text-[14px] sm:text-[15px] text-fluent-fg-secondary max-w-3xl mt-1 block">
                        Generate consistent, standards-compliant Azure resource names aligned with Microsoft's Cloud Adoption Framework (CAF).
                    </p>
                </div>
            </div>

            {/* About / Guidance Accordion */}
            <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden">
                <div 
                    className="px-3 py-1.5 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-fluent-bg-hover transition-colors"
                    onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
                    role="button"
                    aria-expanded={isGuidanceExpanded}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsGuidanceExpanded(!isGuidanceExpanded);
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 flex-shrink-0 text-fluent-brand-fg" />
                        <p className="text-fluent-fg-primary text-[13px]">
                            How to use this tool
                        </p>
                        <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${isGuidanceExpanded ? 'rotate-180' : ''}`} />
                    </div>
                        
                    <div className={`grid transition-[grid-template-rows] duration-250 ease-out ${isGuidanceExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden min-h-0">
                            <div className={`mt-3 flex flex-col gap-3 text-[13px] text-fluent-fg-secondary cursor-default transition-opacity duration-200 ${isGuidanceExpanded ? 'opacity-100' : 'opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                                <p>
                                    This tool generates Azure resource names aligned with Microsoft's <a href="https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Cloud Adoption Framework (CAF) <ExternalLink className="w-3 h-3 ml-0.5" /></a> naming conventions.
                                </p>
                                <ul className="list-disc pl-5 ml-2 flex flex-col gap-2">
                                    <li><strong>Describe Architecture:</strong> Type your target architecture into the AI prompt bar to auto-populate naming parameters and filter resources.</li>
                                    <li><strong>Configure Parameters:</strong> Manually customize your organization prefix, workload name, environment, and region if needed.</li>
                                    <li><strong>Build Pattern:</strong> Toggle and reorder individual naming components to match your specific organizational requirements.</li>
                                    <li><strong>Select Resources:</strong> Search and choose Azure services from the grid below to instantly generate and copy compliant names.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unified Architecture Copilot & Naming Console */}
            <NamingPromptBar 
                ref={aiInputRef}
                workload={workload}
                setWorkload={setWorkload}
                envValue={envValue}
                setEnvValue={setEnvValue}
                regionValue={regionValue}
                setRegionValue={setRegionValue}
                instance={instance}
                formattedInstance={formattedInstance}
                currentRegion={currentRegion}
                setInstance={setInstance}
                showOrg={showOrg}
                setShowOrg={setShowOrg}
                orgPrefix={orgPrefix}
                setOrgPrefix={setOrgPrefix}
                setSearchTerm={setSearchTerm}
                setActiveCategory={setActiveCategory}
                onResetAll={handleResetDefaults}
                liveSchemaStr={liveSchemaStr}
                isConfigMinimized={isConfigMinimized}
                onToggleMinimize={handleToggleMinimize}
                onCopySchema={handleCopySchema}
                copiedId={copiedId}
            >
                <ConfigPanel
                    embedded
                    workload={workload}
                    setWorkload={setWorkload}
                    envValue={envValue}
                    setEnvValue={setEnvValue}
                    regionValue={regionValue}
                    setRegionValue={setRegionValue}
                    instance={instance}
                    onInstanceChange={handleInstanceChange}
                    setInstance={setInstance}
                    orgPrefix={orgPrefix}
                    setOrgPrefix={setOrgPrefix}
                    showOrg={showOrg}
                    setShowOrg={setShowOrg}
                    namingOrder={namingOrder}
                    setNamingOrder={setNamingOrder}
                    onMoveItem={moveItem}
                    liveSchemaStr={liveSchemaStr}
                    copiedId={copiedId}
                    onCopy={handleCopySchema}
                    onResetDefaults={handleResetDefaults}
                    generateName={generateName}
                    onToggleMinimize={handleToggleMinimize}
                />
            </NamingPromptBar>

            {/* Compact service toolbar: search + category tabs */}
            <div className="sticky top-0 z-30 pt-2 pb-2 bg-fluent-bg-canvas relative" style={{ contain: 'layout style', backfaceVisibility: 'hidden' }}>
                <ServiceFilter
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    categories={CATEGORIES}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onClearSearch={handleClearSearch}
                    searchInputRef={searchInputRef}
                />
                {/* Soft gradient dissolve edge allowing content to glide seamlessly underneath */}
                <div className="absolute top-full left-0 right-0 h-3 bg-gradient-to-b from-fluent-bg-canvas to-transparent pointer-events-none" aria-hidden="true" />
            </div>

            {/* Resource Grid */}
            <ResourceGrid
                resources={filteredResources}
                generateName={generateName}
                copiedId={copiedId}
                onCopy={copyToClipboard}
                selectedService={deepLinkedService}
            />

            {/* Back to Top Row */}
            <div className="flex items-center justify-end pt-2">
                <ScrollToTopButton />
            </div>
        </div>
    );
}
