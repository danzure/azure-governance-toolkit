import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Info,
    ChevronDown,
    Network,
    Code2,
    Layers,
    ShieldCheck,
    ExternalLink,
    BookOpen,
    AlertTriangle,
    Copy,
    Check,
    Download,
    Lock,
    Globe
} from 'lucide-react';
import { TechnologyIcon } from '@shared';
import { ScrollToTopButton } from '@core/layout';
import { useLocalStorage } from '@core/hooks';
import {
    FoundryPromptBar,
    FoundryConfigPanel,
    FoundryVisualTopology,
    FoundryIaCTerminal,
    FoundryBOMTable,
    FoundrySecurityChecklist,
    DEFAULT_CONFIG,
    ARCHETYPE_PRESETS,
    matchArchetype,
    buildTopologyAndBOM,
    validateSecurity,
    generateBicepTemplate,
    generateTerraformTemplate,
    getFoundryResourceNames
} from '@features/ai-foundry';
import { FOUNDRY_DNS_ZONES } from '@features/ai-foundry/data/dnsZones';

export default function AiFoundryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
    const [isConfigMinimized, setIsConfigMinimized] = useState(true);
    const [activeTab, setActiveTab] = useState('topology'); // 'topology' | 'iac' | 'bom' | 'security'
    const [iacFormat, setIacFormat] = useState('bicep'); // 'bicep' | 'terraform'
    const [copiedAction, setCopiedAction] = useState(null); // null | 'iac' | 'bom-md'
    const [rawConfig, setConfig] = useLocalStorage('azres_foundryConfig', DEFAULT_CONFIG);
    const aiInputRef = useRef(null);

    // Handle Escape key to blur AI prompt input cleanly
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && document.activeElement === aiInputRef.current) {
                aiInputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
            const preset = ARCHETYPE_PRESETS.find(
                (p) => p.id === archetypeParam || (archetypeParam === 'air-gapped-banking' && p.id === 'regulated-zero-trust')
            );
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
            failingCount: checks.length - passed,
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
                    return {
                        ...prev,
                        networkMode: 'private',
                        managedVnetMode: 'AllowOnlyApprovedOutbound'
                    };
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

    const handleRemediateAll = useCallback(() => {
        setConfig((prev) => ({
            ...prev,
            networkMode: 'private',
            managedVnetMode: 'AllowOnlyApprovedOutbound',
            disableLocalAuth: true,
            identityType: 'UserAssigned',
            enableCmk: true,
            enableAppInsights: true
        }));
    }, [setConfig]);

    const isPrivate = config.networkMode === 'private';

    const names = useMemo(() => getFoundryResourceNames(config), [config]);

    const iacCode = useMemo(() => {
        return iacFormat === 'bicep'
            ? generateBicepTemplate(config)
            : generateTerraformTemplate(config);
    }, [iacFormat, config]);

    const iacFilename = useMemo(() => {
        const ext = iacFormat === 'bicep' ? 'bicep' : 'tf';
        return `${names.hubName || 'ai-foundry'}.${ext}`;
    }, [names.hubName, iacFormat]);

    const iacDocsUrl = iacFormat === 'bicep'
        ? 'https://learn.microsoft.com/azure/templates/microsoft.machinelearningservices/workspaces?pivots=deployment-language-bicep'
        : 'https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/ai_foundry';

    const bomExportItems = useMemo(() => buildTopologyAndBOM(config).bom, [config]);

    const activeDnsZones = useMemo(() => {
        if (!isPrivate) return [];
        return FOUNDRY_DNS_ZONES.filter((dz) => {
            if (dz.resourceType === 'Microsoft.CognitiveServices/accounts' && !config.enableOpenAi) return false;
            if (dz.resourceType === 'Microsoft.Search/searchServices' && !config.enableAiSearch) return false;
            if (dz.resourceType === 'Microsoft.ContainerRegistry/registries' && !config.enableContainerRegistry) return false;
            return true;
        });
    }, [isPrivate, config.enableOpenAi, config.enableAiSearch, config.enableContainerRegistry]);

    const handleToolbarCopy = useCallback(async (text, actionKey) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedAction(actionKey);
            setTimeout(() => setCopiedAction(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }, []);

    const handleDownloadIac = useCallback(() => {
        const blob = new Blob([iacCode], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = iacFilename;
        link.click();
        URL.revokeObjectURL(url);
    }, [iacCode, iacFilename]);

    const handleCopyBomMarkdown = useCallback(() => {
        const header = '| Role / Component | Scope | Generated Name | ARM Provider | SKU / Tier | Network Security | Cost Model |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |';
        const rows = bomExportItems.map(
            (item) => `| ${item.category} | ${item.scope || '-'} | \`${item.name}\` | \`${item.provider}\` | ${item.tier} | ${item.network} | ${item.costTier} |`
        );
        const sections = [header, ...rows];

        if (isPrivate && activeDnsZones.length > 0) {
            sections.push('');
            sections.push('### Required Private DNS Zones');
            sections.push('| Private DNS Zone | Target Service | Purpose |');
            sections.push('| :--- | :--- | :--- |');
            activeDnsZones.forEach((dz) => {
                sections.push(`| \`${dz.zone}\` | ${dz.service} | ${dz.description} |`);
            });
        }

        handleToolbarCopy(sections.join('\n'), 'bom-md');
    }, [bomExportItems, isPrivate, activeDnsZones, handleToolbarCopy]);

    return (
        <div className="flex flex-col flex-1 w-full min-w-0">
            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 animate-fade-in flex-1 flex flex-col gap-4 sm:gap-5">
                {/* Page Header */}
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
                                    {/* Column 1: Step-by-Step Designer Workflow */}
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <h3 className="font-semibold text-[13px] text-fluent-fg-primary flex items-center gap-1.5">
                                            <Network className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                            Step-by-Step Designer Workflow
                                        </h3>
                                        <p>
                                            This tool helps you design enterprise Azure AI Foundry landing zones aligned with the <a href="https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/architecture" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Microsoft AI Foundry Architecture Guide <ExternalLink className="w-3 h-3 ml-0.5" /></a>.
                                        </p>
                                        <ul className="list-disc pl-4 ml-1 flex flex-col gap-1">
                                            <li><strong>1. Prompt Copilot or Select a CAF Archetype:</strong> Describe your architecture in natural language or choose a baseline archetype in the Copilot console below.</li>
                                            <li><strong>2. Fine-Tune Governance Pillars:</strong> Open <em>Customize Parameters</em> to adjust Hierarchy &amp; Naming, Network Isolation, AI Search/Models, and Identity/CMK.</li>
                                            <li><strong>3. Inspect Full-Width Topology &amp; BOM:</strong> Review the live Hub-and-Projects diagram, resource Bill of Materials, and required <code className="font-mono text-[11px]">privatelink.*</code> DNS zones.</li>
                                            <li><strong>4. Audit MCSB Controls &amp; Export IaC:</strong> Remediate Zero-Trust findings in one click, then copy or download the generated Bicep or Terraform templates.</li>
                                        </ul>
                                    </div>

                                    {/* Column 2: CAF AI Foundry Key */}
                                    <div className="flex-1 flex flex-col gap-1.5 lg:border-l border-fluent-stroke-subtle lg:pl-6">
                                        <h3 className="font-semibold text-[13px] text-fluent-fg-primary flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                            CAF AI Landing Zone Hierarchy
                                        </h3>
                                        <p>
                                            Azure AI Foundry enforces a dual-tier governance separation between platform operations and workload teams using standardized CAF naming:
                                        </p>
                                        <ul className="flex flex-col gap-1">
                                            <li><strong className="text-fluent-fg-primary">AI Foundry Hub (<code className="font-mono text-[11px]">hub-*</code>):</strong> Platform-scope boundary centralizing Managed VNet isolation, Private Endpoints, Storage (<code className="font-mono text-[11px]">st*</code>), and Key Vault (<code className="font-mono text-[11px]">kv-*</code>).</li>
                                            <li><strong className="text-fluent-fg-primary">AI Foundry Projects (<code className="font-mono text-[11px]">proj-*</code>):</strong> Lightweight child application workspaces that inherit Hub network policies and shared connections for isolated team execution.</li>
                                            <li><strong className="text-fluent-fg-primary">Connected AI Providers (<code className="font-mono text-[11px]">oai-*</code>, <code className="font-mono text-[11px]">srch-*</code>):</strong> Shared Azure OpenAI and AI Search services attached via Private Link and governed by Managed Identities.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Unified AI Copilot & Collapsible Parameter Console */}
                <FoundryPromptBar
                    ref={aiInputRef}
                    config={config}
                    onApplyConfig={setConfig}
                    onSelectArchetype={handleSelectArchetype}
                    onResetAll={handleResetDefaults}
                    activeArchetypeId={activeArchetypeId}
                    securitySummary={securitySummary}
                    isConfigMinimized={isConfigMinimized}
                    onToggleMinimize={() => setIsConfigMinimized((prev) => !prev)}
                >
                    <FoundryConfigPanel
                        config={config}
                        onChangeConfig={setConfig}
                        onResetDefaults={handleResetDefaults}
                        activeArchetypeId={activeArchetypeId}
                        onSelectArchetype={handleSelectArchetype}
                        embedded
                        onMinimize={() => setIsConfigMinimized(true)}
                    />
                </FoundryPromptBar>

                {/* Full-Width 12-Column Unified Output Workspace Card */}
                <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle w-full flex flex-col flex-1 overflow-hidden">
                    {/* Single Unified Toolbar (View Tabs on Left + Contextual Actions & MCSB Status on Right) */}
                    <div className="px-4 py-2.5 min-h-[48px] flex flex-wrap items-center justify-between gap-2.5 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle shrink-0">
                        {/* Left: Segmented View Switcher */}
                        <div
                            className="flex shrink-0 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-[4px] p-0.5 w-full lg:w-auto flex-wrap"
                            role="tablist"
                            aria-label="Inspector view"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'topology'}
                                onClick={() => setActiveTab('topology')}
                                className={`flex-1 sm:flex-none px-3 h-[28px] rounded-[3px] text-[12px] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 active:scale-95 ${
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
                                className={`flex-1 sm:flex-none px-3 h-[28px] rounded-[3px] text-[12px] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 active:scale-95 ${
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
                                className={`flex-1 sm:flex-none px-3 h-[28px] rounded-[3px] text-[12px] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                    activeTab === 'bom'
                                        ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                        : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5 shrink-0" />
                                <span>Bill of Materials</span>
                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-[3px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[10px] font-mono font-semibold text-fluent-fg-secondary">
                                    {bomCount}
                                </span>
                            </button>

                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'security'}
                                onClick={() => setActiveTab('security')}
                                className={`flex-1 sm:flex-none px-3 h-[28px] rounded-[3px] text-[12px] transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                    activeTab === 'security'
                                        ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                        : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                                }`}
                            >
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                <span>Zero-Trust Audit</span>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[10px] font-mono font-semibold text-fluent-fg-secondary">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${securitySummary.allPassed ? 'bg-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-fg'}`} />
                                    <span>{securitySummary.passed}/{securitySummary.total}</span>
                                </span>
                            </button>
                        </div>

                        {/* Right: Contextual Active View Controls & Security Quick-Jump */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Topology Context Pills */}
                            {activeTab === 'topology' && (
                                <>
                                    <span className={`inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-[4px] text-[11.5px] font-medium border ${
                                        isPrivate
                                            ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                            : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-cat-yellow-fg'
                                    }`}>
                                        {isPrivate ? <Lock className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                        <span>{isPrivate ? 'Zero-Trust Managed VNet' : 'Public Endpoint Access'}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-[4px] bg-fluent-bg-card text-[11.5px] text-fluent-fg-primary border border-fluent-stroke-subtle font-mono">
                                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-blue-fg shrink-0" />
                                        <span>{config.region}</span>
                                    </span>
                                </>
                            )}

                            {/* IaC Format Toggle + File / Docs / Download / Copy Actions */}
                            {activeTab === 'iac' && (
                                <>
                                    <div className="flex items-center gap-0.5 p-0.5 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle" role="tablist" aria-label="IaC format">
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected={iacFormat === 'bicep'}
                                            onClick={() => setIacFormat('bicep')}
                                            className={`px-2.5 h-[24px] rounded-[3px] text-[11.5px] transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                                                iacFormat === 'bicep'
                                                    ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                                    : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                                            }`}
                                        >
                                            <TechnologyIcon name="bicep" className="w-3.5 h-3.5 shrink-0" />
                                            <span>Bicep</span>
                                        </button>
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected={iacFormat === 'terraform'}
                                            onClick={() => setIacFormat('terraform')}
                                            className={`px-2.5 h-[24px] rounded-[3px] text-[11.5px] transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                                                iacFormat === 'terraform'
                                                    ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                                    : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                                            }`}
                                        >
                                            <TechnologyIcon name="terraform" className="w-3.5 h-3.5 shrink-0" />
                                            <span>Terraform</span>
                                        </button>
                                    </div>

                                    <span
                                        className="hidden xl:inline-flex items-center font-mono text-[11px] text-fluent-fg-secondary h-[26px] px-2.5 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle"
                                        title="Target IaC artifact filename"
                                    >
                                        {iacFilename}
                                    </span>

                                    <a
                                        href={iacDocsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`View ${iacFormat === 'bicep' ? 'Bicep' : 'Terraform'} documentation`}
                                        className="shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary active:scale-95"
                                    >
                                        <TechnologyIcon name={iacFormat} className="w-3.5 h-3.5 shrink-0" />
                                        <span className="hidden sm:inline">{iacFormat === 'bicep' ? 'Bicep Docs' : 'Registry'}</span>
                                        <ExternalLink className="w-3 h-3 shrink-0" />
                                    </a>

                                    <button
                                        type="button"
                                        onClick={handleDownloadIac}
                                        title={`Download ${iacFilename}`}
                                        className="shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary active:scale-95"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Download</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleToolbarCopy(iacCode, 'iac')}
                                        className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border active:scale-95 ${
                                            copiedAction === 'iac'
                                                ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                                : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                                        }`}
                                    >
                                        {copiedAction === 'iac' ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 animate-scale-in" />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Copy Code</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* BOM Summary + Copy Markdown */}
                            {activeTab === 'bom' && (
                                <>
                                    <span className="hidden sm:inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[11.5px] font-mono text-fluent-fg-secondary">
                                        <span>{bomCount} Resources</span>
                                        {isPrivate && <span>• {activeDnsZones.length} DNS Zones</span>}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleCopyBomMarkdown}
                                        className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border active:scale-95 ${
                                            copiedAction === 'bom-md'
                                                ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                                : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                                        }`}
                                    >
                                        {copiedAction === 'bom-md' ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 animate-scale-in" />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Copy Markdown</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* Security Tab Summary + One-Click Fix All */}
                            {activeTab === 'security' && (
                                <>
                                    <span className={`inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-[4px] text-[11.5px] font-semibold border ${
                                        securitySummary.allPassed
                                            ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                            : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-cat-yellow-fg'
                                    }`}>
                                        {securitySummary.allPassed ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                        <span>{securitySummary.passed} of {securitySummary.total} Controls Met</span>
                                    </span>
                                    {!securitySummary.allPassed && (
                                        <button
                                            type="button"
                                            onClick={handleRemediateAll}
                                            className="h-[26px] px-2.5 bg-fluent-brand-bg text-white rounded-[4px] text-[12px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 active:scale-95"
                                        >
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>Fix All ({securitySummary.failingCount})</span>
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Contextual MCSB Status / Quick-Jump Pill on non-security views */}
                            {activeTab !== 'security' && (
                                securitySummary.allPassed ? (
                                    <span className="shrink-0 h-[26px] px-2.5 rounded-[4px] border bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg text-[12px] font-medium inline-flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                        <span className="hidden sm:inline">MCSB Zero-Trust Verified</span>
                                        <span className="sm:hidden">Verified</span>
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('security')}
                                        className="shrink-0 h-[26px] px-2.5 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card hover:border-fluent-stroke-strong text-[12px] font-medium text-fluent-cat-yellow-fg inline-flex items-center gap-1.5 transition-all active:scale-95"
                                    >
                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                        <span>
                                            Review {securitySummary.failingCount} Security {securitySummary.failingCount === 1 ? 'Warning' : 'Warnings'}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Active Tab Body */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {activeTab === 'topology' && <FoundryVisualTopology config={config} hideSubHeader />}
                        {activeTab === 'iac' && (
                            <FoundryIaCTerminal
                                config={config}
                                format={iacFormat}
                                onFormatChange={setIacFormat}
                                precomputedCode={iacCode}
                                hideToolbar
                            />
                        )}
                        {activeTab === 'bom' && <FoundryBOMTable config={config} hideSubHeader />}
                        {activeTab === 'security' && (
                            <FoundrySecurityChecklist
                                config={config}
                                onRemediateRule={handleRemediateRule}
                                onRemediateAll={handleRemediateAll}
                                hideSubHeader
                            />
                        )}
                    </div>
                </div>
            </div>
            <ScrollToTopButton />
        </div>
    );
}

