import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    Info, 
    ChevronDown, 
    Network, 
    Code2, 
    Layers, 
    ShieldCheck, 
    ExternalLink,
    BookOpen
} from 'lucide-react';
import { useLocalStorage } from '@core/hooks';
import { ScrollToTopButton } from '@core/layout';
import {
    FoundryArchetypeBar,
    FoundryConfigPanel,
    FoundryVisualTopology,
    FoundryIaCTerminal,
    FoundryBOMTable,
    FoundrySecurityChecklist,
    DEFAULT_CONFIG,
    ARCHETYPE_PRESETS,
    matchArchetype,
    buildTopologyAndBOM,
    validateSecurity
} from '@features/ai-foundry';

export default function AiFoundryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('topology'); // 'topology' | 'iac' | 'bom' | 'security'
    const [rawConfig, setConfig] = useLocalStorage('azres_foundryConfig', DEFAULT_CONFIG);

    // Ensure config is safe and deeply merged with DEFAULT_CONFIG in case of outdated/partial localStorage
    const config = useMemo(() => {
        if (!rawConfig || typeof rawConfig !== 'object') return DEFAULT_CONFIG;
        return {
            ...DEFAULT_CONFIG,
            ...rawConfig,
            projects: Array.isArray(rawConfig.projects) && rawConfig.projects.length > 0 ? rawConfig.projects : DEFAULT_CONFIG.projects,
            modelDeployments: Array.isArray(rawConfig.modelDeployments) ? rawConfig.modelDeployments : DEFAULT_CONFIG.modelDeployments,
            allowedFqdns: Array.isArray(rawConfig.allowedFqdns) ? rawConfig.allowedFqdns : DEFAULT_CONFIG.allowedFqdns
        };
    }, [rawConfig]);

    // Dynamically derive active archetype ID (or 'custom' if modified)
    const activeArchetypeId = useMemo(
        () => matchArchetype(config, ARCHETYPE_PRESETS),
        [config]
    );

    // Deep-link integration from Command Palette (?archetype= & ?tab=)
    useEffect(() => {
        const archetypeParam = searchParams.get('archetype');
        const tabParam = searchParams.get('tab');
        let changed = false;

        if (archetypeParam) {
            const preset = ARCHETYPE_PRESETS.find((p) => p.id === archetypeParam);
            if (preset) {
                setConfig(preset.config);
                changed = true;
            }
        }
        if (tabParam && ['topology', 'iac', 'bom', 'security'].includes(tabParam)) {
            setActiveTab(tabParam);
            changed = true;
        }
        if (changed) {
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams, setConfig]);

    // Live metrics for Inspector Tab Badges
    const bomCount = useMemo(() => buildTopologyAndBOM(config).bom.length, [config]);
    const securitySummary = useMemo(() => {
        const checks = validateSecurity(config);
        const passed = checks.filter((c) => c.passed).length;
        return {
            passed,
            total: checks.length,
            allPassed: passed === checks.length
        };
    }, [config]);

    const handleSelectArchetype = useCallback((preset) => {
        setConfig(preset.config);
    }, [setConfig]);

    const handleResetDefaults = useCallback(() => {
        setConfig(DEFAULT_CONFIG);
    }, [setConfig]);

    const handleRemediateRule = useCallback((ruleId) => {
        setConfig((prev) => {
            switch (ruleId) {
                case 'SEC-01':
                    return {
                        ...prev,
                        networkMode: 'private',
                        managedVnetMode: prev.managedVnetMode === 'Disabled' ? 'AllowOnlyApprovedOutbound' : prev.managedVnetMode
                    };
                case 'SEC-02':
                    return { ...prev, managedVnetMode: 'AllowOnlyApprovedOutbound' };
                case 'SEC-03':
                    return { ...prev, disableLocalAuth: true };
                case 'SEC-04':
                    return { ...prev, identityType: 'UserAssigned' };
                case 'SEC-05':
                    return { ...prev, enableCmk: true };
                case 'SEC-06':
                    return { ...prev, enableAppInsights: true };
                default:
                    return prev;
            }
        });
    }, [setConfig]);

    return (
        <div className="flex flex-col flex-1 w-full min-w-0">
            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 animate-fade-in flex-1 flex flex-col gap-4 sm:gap-5">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <div>
                        <h1 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-fluent-fg-primary mb-2">
                            Azure AI Foundry Designer
                        </h1>
                        <p className="text-[14px] sm:text-[15px] text-fluent-fg-secondary max-w-3xl mt-1 block">
                            Architect, configure, and export enterprise-grade Azure AI Foundry Hubs, child Projects, and Zero-Trust landing zones aligned with the Microsoft Cloud Adoption Framework (CAF).
                        </p>
                    </div>
                </div>

                {/* Standard Tool Guidance Accordion */}
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
                            <p className="text-fluent-fg-primary text-[13px] font-medium">
                                How to use this tool
                            </p>
                            <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${isGuidanceExpanded ? 'rotate-180' : ''}`} />
                        </div>

                        <div className={`grid transition-[grid-template-rows] duration-250 ease-out ${isGuidanceExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden min-h-0">
                                <div className={`mt-2 mb-1 flex flex-col lg:flex-row gap-6 text-[12px] text-fluent-fg-secondary cursor-default transition-opacity duration-200 px-1 ${isGuidanceExpanded ? 'opacity-100' : 'opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                                    {/* Column 1: How to use */}
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <h3 className="font-semibold text-[13px] text-fluent-fg-primary flex items-center gap-1.5">
                                            <Network className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                            How to use this tool
                                        </h3>
                                        <p>
                                            This tool helps you design enterprise Azure AI Foundry landing zones aligned with the <a href="https://learn.microsoft.com/azure/ai-studio/concepts/architecture" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Microsoft AI Foundry Architecture Guide <ExternalLink className="w-3 h-3 ml-0.5" /></a>.
                                        </p>
                                        <ul className="list-disc pl-4 ml-1 flex flex-col gap-1">
                                            <li><strong>Select an Archetype:</strong> Start from a Cloud Adoption Framework preset above or customize your Hub and child Projects directly.</li>
                                            <li><strong>Configure Zero-Trust Perimeter:</strong> Enable Managed Virtual Networks, approved FQDN outbound rules, Entra ID authentication, and Customer-Managed Keys (CMK).</li>
                                            <li><strong>Export & Audit:</strong> Inspect the live topology, review the Bill of Materials, verify MCSB compliance, and export production-ready Bicep or Terraform templates.</li>
                                        </ul>
                                    </div>

                                    {/* Column 2: CAF AI Foundry Key */}
                                    <div className="flex-1 flex flex-col gap-1.5 lg:border-l border-fluent-stroke-subtle lg:pl-6">
                                        <h3 className="font-semibold text-[13px] text-fluent-fg-primary flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                            CAF AI Landing Zone Hierarchy
                                        </h3>
                                        <p>
                                            Azure AI Foundry enforces a dual-tier governance separation between platform operations and workload teams:
                                        </p>
                                        <ul className="flex flex-col gap-1">
                                            <li><strong className="text-fluent-fg-primary">AI Foundry Hub (Platform Scope):</strong> Centralizes security governance, Managed VNet isolation, Private Endpoints, Storage, and Key Vault.</li>
                                            <li><strong className="text-fluent-fg-primary">AI Foundry Projects (Application Scope):</strong> Lightweight child workspaces that inherit Hub network policies and shared connections for isolated team execution.</li>
                                            <li><strong className="text-fluent-fg-primary">Connected AI Providers:</strong> Shared Azure OpenAI and AI Search services attached via Private Link and governed by Managed Identities.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Archetype Quick-Start Presets */}
                <FoundryArchetypeBar
                    activeArchetypeId={activeArchetypeId}
                    onSelectArchetype={handleSelectArchetype}
                />

                {/* Main Interactive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:items-stretch flex-1 min-h-0">
                    {/* Left Column: Configurator Card (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col min-w-0">
                        <FoundryConfigPanel
                            config={config}
                            onChangeConfig={setConfig}
                            onResetDefaults={handleResetDefaults}
                        />
                    </div>

                    {/* Right Column: Inspector & Output Card (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col min-w-0">
                        <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle w-full flex flex-col flex-1 h-full overflow-hidden">
                            {/* Inspector Card Header Toolbar */}
                            <div className="px-4 py-2.5 min-h-[48px] flex flex-wrap items-center justify-between gap-2 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle shrink-0">
                                <div
                                    className="flex shrink-0 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-md p-0.5 w-full sm:w-auto flex-wrap"
                                    role="tablist"
                                    aria-label="Inspector view"
                                >
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === 'topology'}
                                        onClick={() => setActiveTab('topology')}
                                        className={`flex-1 sm:flex-none px-3 h-[28px] rounded-sm text-[12px] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                            activeTab === 'topology'
                                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                                        }`}
                                    >
                                        <Network className="w-3.5 h-3.5 shrink-0" />
                                        <span>Visual Topology</span>
                                    </button>

                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === 'iac'}
                                        onClick={() => setActiveTab('iac')}
                                        className={`flex-1 sm:flex-none px-3 h-[28px] rounded-sm text-[12px] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                            activeTab === 'iac'
                                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                                        }`}
                                    >
                                        <Code2 className="w-3.5 h-3.5 shrink-0" />
                                        <span>IaC Templates</span>
                                    </button>

                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === 'bom'}
                                        onClick={() => setActiveTab('bom')}
                                        className={`flex-1 sm:flex-none px-3 h-[28px] rounded-sm text-[12px] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                            activeTab === 'bom'
                                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                                        }`}
                                    >
                                        <Layers className="w-3.5 h-3.5 shrink-0" />
                                        <span>Bill of Materials</span>
                                        <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-[3px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[10px] font-mono font-semibold text-fluent-fg-secondary">
                                            {bomCount}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === 'security'}
                                        onClick={() => setActiveTab('security')}
                                        className={`flex-1 sm:flex-none px-3 h-[28px] rounded-sm text-[12px] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                            activeTab === 'security'
                                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                                        }`}
                                    >
                                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                        <span>Zero-Trust Audit</span>
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-[3px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[10px] font-mono font-semibold text-fluent-fg-secondary">
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${securitySummary.allPassed ? 'bg-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-fg'}`} />
                                            <span>{securitySummary.passed}/{securitySummary.total}</span>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Active Tab View */}
                            <div className="flex-1 flex flex-col min-h-0">
                                {activeTab === 'topology' && <FoundryVisualTopology config={config} />}
                                {activeTab === 'iac' && <FoundryIaCTerminal config={config} />}
                                {activeTab === 'bom' && <FoundryBOMTable config={config} />}
                                {activeTab === 'security' && (
                                    <FoundrySecurityChecklist
                                        config={config}
                                        onRemediateRule={handleRemediateRule}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ScrollToTopButton />
        </div>
    );
}

