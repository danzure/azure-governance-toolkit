import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Copy,
    Check,
    SlidersHorizontal,
    Compass,
    BookOpen,
    Layers,
    Shield,
    LayoutTemplate,
    ExternalLink,
    Code2,
    Search,
    X
} from 'lucide-react';
import { generateName as generateResourceName } from '../../utils/nameGenerator';
import { AZURE_REGIONS, RESOURCE_DATA_SORTED, CATEGORIES } from '../../data/constants';
import { getServiceIconUrl } from '../../data/serviceIcons';
import { getCategoryColors } from '../../data/categoryColors';
import FluentDropdown from '../shared/FluentDropdown';

/**
 * Standards & Architecture Reference Hub
 * Combines an interactive Cloud Adoption Framework (CAF) resource lookup cheatsheet
 * with official Microsoft enterprise architecture frameworks.
 */
export default function QuickActionsDeck() {
    const navigate = useNavigate();
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [copiedPrefix, setCopiedPrefix] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAll, setShowAll] = useState(false);
    const [failedIcons, setFailedIcons] = useState({});

    // Read existing naming configuration from localStorage if available
    const activeConfig = useMemo(() => {
        if (typeof window === 'undefined') return null;
        try {
            const workload = localStorage.getItem('azres_workload');
            const env = localStorage.getItem('azres_env');
            const region = localStorage.getItem('azres_region');
            const instance = localStorage.getItem('azres_instance');
            const org = localStorage.getItem('azres_orgPrefix');
            const showOrg = localStorage.getItem('azres_showOrg') === 'true';

            const cleanWorkload = workload ? JSON.parse(workload) : '';
            const cleanEnv = env ? JSON.parse(env) : 'prod';
            const cleanRegion = region ? JSON.parse(region) : 'uksouth';
            const cleanInstance = instance ? JSON.parse(instance) : '001';
            const cleanOrg = org ? JSON.parse(org) : '';

            if (!cleanWorkload && !cleanOrg) return null;

            const regionObj = AZURE_REGIONS.find(r => r.name === cleanRegion) || { shortName: cleanRegion };

            const sampleRgName = generateResourceName({
                resourceType: 'rg',
                workload: cleanWorkload || 'app',
                env: cleanEnv,
                region: regionObj.shortName,
                instance: cleanInstance,
                orgPrefix: cleanOrg,
                namingOrder: ['Org', 'Resource', 'Workload', 'Environment', 'Region', 'Instance'],
                showOrg
            });

            return {
                workload: cleanWorkload,
                env: cleanEnv,
                region: cleanRegion,
                instance: cleanInstance,
                sampleName: sampleRgName
            };
        } catch {
            return null;
        }
    }, []);

    // Spotlight resources shown on initial load
    const SPOTLIGHT_NAMES = useMemo(() => [
        'Resource group',
        'Storage account',
        'Key Vault',
        'Virtual network',
        'Subnet',
        'Network security group',
        'Kubernetes (AKS)',
        'Virtual Machine - Windows',
        'Virtual Machine - Linux',
        'Application Gateway',
        'Azure Firewall',
        'Cosmos DB account',
        'Container App',
        'App Service',
        'Function app'
    ], []);

    // Options for category dropdown
    const categoryOptions = useMemo(() => [
        { value: 'All', label: 'All Categories' },
        ...CATEGORIES.filter(c => c !== 'All').map(c => ({ value: c, label: c }))
    ], []);

    // Filter resources based on search query, category, and spotlight mode
    const filteredResources = useMemo(() => {
        let list = RESOURCE_DATA_SORTED;

        if (selectedCategory !== 'All') {
            list = list.filter(r => {
                if (Array.isArray(r.category)) {
                    return r.category.includes(selectedCategory);
                }
                return r.category === selectedCategory;
            });
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            return list.filter(r =>
                r.name.toLowerCase().includes(q) ||
                r.abbrev.toLowerCase().includes(q) ||
                (typeof r.category === 'string' && r.category.toLowerCase().includes(q)) ||
                (Array.isArray(r.category) && r.category.some(c => c.toLowerCase().includes(q))) ||
                (r.scope && r.scope.toLowerCase().includes(q)) ||
                (r.provider && r.provider.toLowerCase().includes(q))
            );
        }

        // When no search query and All categories selected, show spotlight unless user clicked "Show all"
        if (!showAll && selectedCategory === 'All') {
            const spotlightSet = new Set(SPOTLIGHT_NAMES);
            const items = list.filter(r => spotlightSet.has(r.name));
            items.sort((a, b) => SPOTLIGHT_NAMES.indexOf(a.name) - SPOTLIGHT_NAMES.indexOf(b.name));
            return items;
        }

        return list;
    }, [searchQuery, selectedCategory, showAll, SPOTLIGHT_NAMES]);

    const frameworks = [
        {
            title: 'Cloud Adoption Framework',
            category: 'Governance',
            badge: 'CAF Standards',
            shortDesc: 'Cloud operating model, subscription topology, tagging strategy, and standard CAF naming rules.',
            pillars: ['Naming Conventions', 'Landing Zones', 'Governance'],
            url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming',
            icon: BookOpen,
            bgClass: 'bg-fluent-cat-blue-bg',
            fgClass: 'text-fluent-cat-blue-fg',
        },
        {
            title: 'Azure Landing Zones',
            category: 'Architecture',
            badge: 'Enterprise Scale',
            shortDesc: 'Multi-subscription scale, hub & spoke networking, platform subscriptions, and management group trees.',
            pillars: ['Management Groups', 'Hub-and-Spoke', 'Sub Design'],
            url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/',
            icon: Layers,
            bgClass: 'bg-fluent-cat-green-bg',
            fgClass: 'text-fluent-cat-green-fg',
        },
        {
            title: 'Well-Architected Framework',
            category: 'Optimization',
            badge: '5 Pillars',
            shortDesc: 'Core engineering pillars for building high-quality, resilient, secure, and cost-effective cloud workloads.',
            pillars: ['Reliability', 'Security', 'Cost', 'Operations'],
            url: 'https://learn.microsoft.com/en-us/azure/well-architected/',
            icon: LayoutTemplate,
            bgClass: 'bg-fluent-cat-orange-bg',
            fgClass: 'text-fluent-cat-orange-fg',
        },
        {
            title: 'Zero Trust Architecture',
            category: 'Security',
            badge: 'Identity & Access',
            shortDesc: 'Comprehensive defense strategy: explicitly verify identities, enforce least privilege, and assume breach.',
            pillars: ['Conditional Access', 'RBAC & PIM', 'Micro-segmentation'],
            url: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview',
            icon: Shield,
            bgClass: 'bg-fluent-cat-purple-bg',
            fgClass: 'text-fluent-cat-purple-fg',
        },
        {
            title: 'Azure Verified Modules',
            category: 'IaC Standards',
            badge: 'Bicep & Terraform',
            shortDesc: 'Official Microsoft-supported infrastructure modules engineered to comply strictly with WAF and CAF best practices.',
            pillars: ['Bicep Modules', 'Terraform Modules', 'Verified IaC'],
            url: 'https://azure.github.io/Azure-Verified-Modules/',
            icon: Code2,
            bgClass: 'bg-fluent-cat-teal-bg',
            fgClass: 'text-fluent-cat-teal-fg',
        },
    ];

    const handleCopySample = (text, idx, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyPrefix = (prefix, id, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(prefix);
        setCopiedPrefix(id);
        setTimeout(() => setCopiedPrefix(null), 2000);
    };

    const handleImageError = (resourceName) => {
        setFailedIcons(prev => ({ ...prev, [resourceName]: true }));
    };

    return (
        <div className="w-full rounded-xl border border-fluent-stroke-subtle bg-fluent-bg-card p-4 sm:p-5 shadow-soft flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-fluent-stroke-subtle">
                <div>
                    <h2 className="text-[15px] font-bold text-fluent-fg-primary leading-tight">
                        Standards & Architecture Reference Hub
                    </h2>
                    <p className="text-[12px] text-fluent-fg-secondary">
                        Interactive Cloud Adoption Framework (CAF) resource cheatsheet and official Microsoft architecture guidance
                    </p>
                </div>

                {activeConfig && (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => navigate('/resource-naming')}
                            className="h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium bg-fluent-bg-subtle border border-fluent-stroke-subtle hover:border-fluent-stroke-strong hover:bg-fluent-bg-hover text-fluent-fg-secondary hover:text-fluent-fg-primary transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                            title="Open Resource Naming configuration"
                        >
                            <SlidersHorizontal className="w-3 h-3" />
                            <span>Workload: <strong className="text-fluent-fg-primary">{activeConfig.workload || 'Default'}</strong></span>
                        </button>
                    </div>
                )}
            </div>

            {/* Active Naming Preview Bar (if active config present) */}
            {activeConfig && activeConfig.sampleName && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-lg bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                    <div className="flex items-center gap-2 min-w-0">
                        <Compass className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0" />
                        <span className="text-[12px] text-fluent-fg-tertiary shrink-0">Active Naming Baseline:</span>
                        <code className="text-[12.5px] font-mono font-semibold text-fluent-fg-primary truncate select-all">
                            {activeConfig.sampleName}
                        </code>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => handleCopySample(activeConfig.sampleName, 'sample', e)}
                        className="shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary active:scale-95 transition-all inline-flex items-center justify-center gap-1.5"
                    >
                        {copiedIndex === 'sample' ? (
                            <>
                                <Check className="w-3 h-3 text-fluent-cat-green-fg" />
                                <span className="text-fluent-cat-green-fg">Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Name</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Balanced Split Layout: CAF Cheatsheet (Left) & Reference Frameworks (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* Left Column: Interactive CAF Resource Cheatsheet (~58% / 7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-3 lg:border-r lg:border-fluent-stroke-subtle lg:pr-5 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[11.5px] font-bold text-fluent-fg-primary uppercase tracking-wider">
                                CAF Resource Cheatsheet
                            </span>
                            <span className="text-[11px] text-fluent-fg-tertiary">
                                {searchQuery || selectedCategory !== 'All' || showAll
                                    ? `${filteredResources.length} standard resources`
                                    : 'Featured core standards'}
                            </span>
                        </div>

                        {/* View All / Featured toggle */}
                        {!searchQuery && selectedCategory === 'All' && (
                            <button
                                type="button"
                                onClick={() => setShowAll(prev => !prev)}
                                className="text-[11px] text-fluent-brand-fg hover:underline self-start sm:self-auto font-medium"
                            >
                                {showAll ? 'Show featured only' : `View all (${RESOURCE_DATA_SORTED.length})`}
                            </button>
                        )}
                    </div>

                    {/* Search & Category Filter Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full">
                            <Search className="w-3.5 h-3.5 text-fluent-fg-tertiary absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search 150+ services or prefixes (e.g. st, kv, vnet)..."
                                aria-label="Search Azure resources by name, prefix, or category"
                                className="w-full pl-8 pr-7 h-[30px] rounded-[4px] border border-fluent-stroke-strong bg-fluent-bg-card text-fluent-fg-primary text-[12px] placeholder:text-fluent-fg-tertiary outline-none focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-fluent-fg-tertiary hover:text-fluent-fg-primary p-0.5"
                                    title="Clear search"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="w-full sm:w-[155px] shrink-0">
                            <FluentDropdown
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={(val) => setSelectedCategory(val)}
                                size="compact"
                                className="w-full"
                                ariaLabel="Filter by Azure resource category"
                            />
                        </div>
                    </div>

                    {/* Resource Items Scrollable Deck */}
                    <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
                        {filteredResources.length === 0 ? (
                            <div className="py-8 px-4 text-center rounded-lg border border-dashed border-fluent-stroke-subtle bg-fluent-bg-subtle flex flex-col items-center justify-center gap-2">
                                <Search className="w-5 h-5 text-fluent-fg-tertiary opacity-60" />
                                <p className="text-[13px] font-medium text-fluent-fg-primary">
                                    No resources found matching &quot;{searchQuery}&quot;
                                </p>
                                <p className="text-[11.5px] text-fluent-fg-secondary">
                                    Try searching by service name, prefix (e.g., &quot;st&quot;, &quot;rg&quot;, &quot;vnet&quot;), or reset category filter.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All');
                                    }}
                                    className="mt-1 h-[26px] px-3 rounded-[4px] text-[12px] font-medium border border-fluent-stroke-strong bg-fluent-bg-card hover:bg-fluent-bg-hover text-fluent-fg-primary transition-all active:scale-95"
                                >
                                    Reset filters
                                </button>
                            </div>
                        ) : (
                            filteredResources.map((resource) => {
                                const iconUrl = getServiceIconUrl(resource.name);
                                const isFailed = failedIcons[resource.name];
                                const categoryName = Array.isArray(resource.category) ? resource.category[0] : resource.category;
                                const colorConfig = getCategoryColors(categoryName);
                                const isPrefixCopied = copiedPrefix === resource.name;

                                return (
                                    <div
                                        key={resource.name}
                                        className="group/row flex items-center justify-between gap-2.5 p-2 px-2.5 sm:px-3 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-subtle hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all duration-150 min-w-0"
                                    >
                                        {/* Left: Icon, Name, Category */}
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            {iconUrl && !isFailed ? (
                                                <img
                                                    src={iconUrl}
                                                    alt=""
                                                    onError={() => handleImageError(resource.name)}
                                                    loading="lazy"
                                                    className="w-5 h-5 object-contain shrink-0 group-hover/row:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <Layers className="w-5 h-5 text-fluent-brand-fg shrink-0" />
                                            )}

                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[12.5px] font-semibold text-fluent-fg-primary group-hover/row:text-fluent-brand-fg transition-colors truncate leading-snug">
                                                    {resource.name}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="inline-flex items-center gap-1 text-[10.5px] text-fluent-fg-secondary">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.textClass.replace('text-', 'bg-')} shrink-0`} />
                                                        <span className="truncate">{categoryName}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Prefix Badge & Metadata */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {/* CAF Prefix button */}
                                            <button
                                                type="button"
                                                onClick={(e) => handleCopyPrefix(resource.abbrev, resource.name, e)}
                                                className={`h-[24px] px-2 rounded-[4px] font-mono text-[11.5px] font-bold inline-flex items-center gap-1 border transition-all active:scale-95 ${
                                                    isPrefixCopied
                                                        ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                                        : 'bg-fluent-bg-canvas border-fluent-stroke-subtle hover:border-fluent-stroke-strong text-fluent-fg-primary'
                                                }`}
                                                title={`Click to copy CAF prefix "${resource.abbrev}"`}
                                            >
                                                {isPrefixCopied ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-fluent-cat-green-fg" />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-2.5 h-2.5 text-fluent-fg-tertiary" />
                                                        <span>{resource.abbrev}</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* Scope badge (Tablet and Desktop) */}
                                            {resource.scope && (
                                                <span
                                                    className="hidden sm:inline-flex px-1.5 py-0.5 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle text-[10.5px] text-fluent-fg-tertiary"
                                                    title={`Resource Scope: ${resource.scope}`}
                                                >
                                                    {resource.scope}
                                                </span>
                                            )}

                                            {/* Max Length badge (Desktop) */}
                                            {resource.maxLength && (
                                                <span
                                                    className="hidden md:inline-flex px-1.5 py-0.5 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle text-[10.5px] text-fluent-fg-tertiary font-mono"
                                                    title={`Max character length: ${resource.maxLength}`}
                                                >
                                                    {resource.maxLength}c
                                                </span>
                                            )}

                                            {/* Action: Open in Naming Tool */}
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/resource-naming?service=${encodeURIComponent(resource.name)}`)}
                                                className="h-[24px] px-2 rounded-[4px] text-[11px] font-medium border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-hover inline-flex items-center gap-1 transition-all active:scale-95 shrink-0"
                                                title={`Open ${resource.name} in Resource Naming Tool`}
                                            >
                                                <span>Generate</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Cheatsheet Footer Guidance */}
                    <div className="pt-1 text-[11px] text-fluent-fg-tertiary flex items-center justify-between">
                        <span>Click any prefix badge to copy, or select <strong>Generate</strong> to configure.</span>
                    </div>
                </div>

                {/* Right Column: Reference Frameworks (~42% / 5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3 min-w-0">
                    <div className="flex items-center justify-between shrink-0">
                        <span className="text-[11.5px] font-bold text-fluent-fg-primary uppercase tracking-wider">
                            Architecture Frameworks
                        </span>
                        <span className="text-[11px] text-fluent-fg-tertiary">
                            Microsoft Guidelines
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {frameworks.map((framework) => {
                            const IconComponent = framework.icon;
                            return (
                                <a
                                    key={framework.title}
                                    href={framework.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group flex flex-col gap-1.5
                                        p-2.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-subtle
                                        hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong
                                        transition-all duration-150 active:scale-[0.99]
                                    "
                                    title={`Open ${framework.title} on Microsoft Learn`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${framework.bgClass} ${framework.fgClass}`}>
                                                <IconComponent className="w-3 h-3" />
                                            </div>
                                            <span className="text-[12.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors truncate">
                                                {framework.title}
                                            </span>
                                            <span className="hidden sm:inline-flex text-[10px] px-1.5 py-0.2 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle text-fluent-fg-tertiary">
                                                {framework.badge}
                                            </span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-fluent-fg-tertiary group-hover:text-fluent-brand-fg transition-colors shrink-0" />
                                    </div>

                                    <p className="text-[11px] text-fluent-fg-secondary leading-snug line-clamp-2">
                                        {framework.shortDesc}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                        {framework.pillars.map((pillar) => (
                                            <span
                                                key={pillar}
                                                className="text-[9.5px] px-1.5 py-0.5 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle text-fluent-fg-tertiary"
                                            >
                                                {pillar}
                                            </span>
                                        ))}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
