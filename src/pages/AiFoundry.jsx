import { useState, useCallback, useMemo } from 'react';
import { 
    Info, 
    ChevronDown, 
    ChevronUp, 
    Network, 
    Code2, 
    Layers, 
    ShieldCheck, 
    ExternalLink
} from 'lucide-react';
import { useLocalStorage } from '@core/hooks';
import {
    FoundryArchetypeBar,
    FoundryConfigPanel,
    FoundryVisualTopology,
    FoundryIaCTerminal,
    FoundryBOMTable,
    FoundrySecurityChecklist,
    DEFAULT_CONFIG,
    ARCHETYPE_PRESETS
} from '@features/ai-foundry';

export default function AiFoundryPage() {
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('topology'); // 'topology' | 'iac' | 'bom' | 'security'
    const [rawConfig, setConfig] = useLocalStorage('azres_foundryConfig', DEFAULT_CONFIG);
    const [activeArchetypeId, setActiveArchetypeId] = useState('enterprise-rag');

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

    const handleSelectArchetype = useCallback((preset) => {
        setActiveArchetypeId(preset.id);
        setConfig(preset.config);
    }, [setConfig]);

    const handleResetDefaults = useCallback(() => {
        const defaultPreset = ARCHETYPE_PRESETS[0];
        setActiveArchetypeId(defaultPreset.id);
        setConfig(DEFAULT_CONFIG);
    }, [setConfig]);

    return (
        <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 animate-fade-in flex-1 flex flex-col gap-4 sm:gap-5 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div>
                    <h1 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-fluent-fg-primary mb-2">
                        Azure AI Foundry Designer
                    </h1>
                    <p className="text-[14px] sm:text-[15px] text-fluent-fg-secondary max-w-4xl mt-1">
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
                        <p className="text-fluent-fg-primary text-[13px] font-medium">How to use this tool</p>
                        {isGuidanceExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                    </div>

                    {isGuidanceExpanded && (
                        <div className="mt-3 flex flex-col gap-3 text-[13px] text-fluent-fg-secondary cursor-default animate-fade-in" onClick={(e) => e.stopPropagation()}>
                            <p>
                                <strong>Azure AI Foundry</strong> introduces a dual-tier governance model separating platform operations from application teams:
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li><strong>AI Foundry Hub (Platform Scope):</strong> Centralizes billing, encryption (CMK), shared compute, and network perimeters (Managed VNet with private endpoints to Storage and Key Vault).</li>
                                <li><strong>AI Foundry Projects (Application Scope):</strong> Lightweight workspaces for developers and data science teams to deploy models, build RAG pipelines, and run evaluations without seeing raw keys or networking plumbing.</li>
                                <li><strong>Zero-Trust Network Isolation:</strong> Select <em>Private Link & Managed VNet</em> to eliminate public endpoints, enforce automated FQDN egress rules (PyPI, HuggingFace, GitHub), and disable local API key auth.</li>
                            </ul>
                            <div className="flex items-center gap-2 pt-1 border-t border-fluent-stroke-subtle">
                                <span className="text-[12px] text-fluent-fg-tertiary">Official Documentation:</span>
                                <a
                                    href="https://learn.microsoft.com/azure/ai-studio/concepts/architecture"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[12px] text-fluent-brand-fg hover:underline inline-flex items-center gap-1 font-medium"
                                >
                                    <span>Microsoft AI Studio & Foundry Architecture Guide</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Archetype Quick-Start Presets */}
            <FoundryArchetypeBar
                activeArchetypeId={activeArchetypeId}
                onSelectArchetype={handleSelectArchetype}
            />

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:items-stretch">
                {/* Left Column: Configurator (5 cols) */}
                <div className="lg:col-span-5 flex flex-col">
                    <FoundryConfigPanel
                        config={config}
                        onChangeConfig={setConfig}
                        onResetDefaults={handleResetDefaults}
                    />
                </div>

                {/* Right Column: Inspector & Output (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                    {/* Inspector Tab Bar */}
                    <div className="min-h-[34px] flex flex-wrap items-center justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-1 p-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                            <button
                                type="button"
                                onClick={() => setActiveTab('topology')}
                                className={`px-3 h-[28px] rounded-[3px] text-[12px] font-medium transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                                    activeTab === 'topology'
                                        ? 'bg-fluent-bg-card text-fluent-fg-primary shadow-sm'
                                        : 'text-fluent-fg-secondary hover:text-fluent-fg-primary'
                                }`}
                            >
                                <Network className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <span>Visual Topology</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('iac')}
                                className={`px-3 h-[28px] rounded-[3px] text-[12px] font-medium transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                                    activeTab === 'iac'
                                        ? 'bg-fluent-bg-card text-fluent-fg-primary shadow-sm'
                                        : 'text-fluent-fg-secondary hover:text-fluent-fg-primary'
                                }`}
                            >
                                <Code2 className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <span>IaC Templates</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('bom')}
                                className={`px-3 h-[28px] rounded-[3px] text-[12px] font-medium transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                                    activeTab === 'bom'
                                        ? 'bg-fluent-bg-card text-fluent-fg-primary shadow-sm'
                                        : 'text-fluent-fg-secondary hover:text-fluent-fg-primary'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <span>Bill of Materials</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('security')}
                                className={`px-3 h-[28px] rounded-[3px] text-[12px] font-medium transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                                    activeTab === 'security'
                                        ? 'bg-fluent-bg-card text-fluent-fg-primary shadow-sm'
                                        : 'text-fluent-fg-secondary hover:text-fluent-fg-primary'
                                }`}
                            >
                                <ShieldCheck className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <span>Zero-Trust Audit</span>
                            </button>
                        </div>
                    </div>

                    {/* Active Tab View */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {activeTab === 'topology' && <FoundryVisualTopology config={config} />}
                        {activeTab === 'iac' && <FoundryIaCTerminal config={config} />}
                        {activeTab === 'bom' && <FoundryBOMTable config={config} />}
                        {activeTab === 'security' && <FoundrySecurityChecklist config={config} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

