import { memo } from 'react';
import PropTypes from 'prop-types';
import { 
    Layers, 
    Lock,
    Network
} from 'lucide-react';
import { AzureServiceIcon } from '@features/naming';
import { getFoundryResourceNames } from '../utils/foundryNaming';

function FoundryVisualTopology({ config }) {
    const isPrivate = config.networkMode === 'private';
    const names = getFoundryResourceNames(config);

    return (
        <div className="w-full flex-1 h-full flex flex-col gap-4 p-4 bg-fluent-bg-canvas rounded-lg border border-fluent-stroke-subtle animate-fade-in">
            {/* Header / Subtitle */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fluent-stroke-subtle pb-3">
                <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-fluent-brand-fg" />
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">
                        Architecture Topology & Security Perimeter
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium border ${
                        isPrivate 
                            ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg' 
                            : 'bg-fluent-cat-yellow-bg border-fluent-stroke-subtle text-fluent-cat-yellow-fg'
                    }`}>
                        <Lock className="w-3 h-3" />
                        <span>{isPrivate ? 'Zero-Trust Managed VNet' : 'Public Endpoint Access'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle text-[11px] text-fluent-fg-secondary border border-fluent-stroke-subtle font-mono">
                        {config.region}
                    </span>
                </div>
            </div>

            {/* Architecture Canvas */}
            <div className="relative w-full rounded-lg border border-dashed border-fluent-stroke-strong p-4 sm:p-6 bg-fluent-bg-card flex flex-col gap-6">
                {/* Boundary Tag */}
                <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[11px] text-fluent-fg-tertiary uppercase tracking-wider font-semibold">
                    <Layers className="w-3.5 h-3.5 text-fluent-brand-fg" />
                    <span>Azure Virtual Network & Landing Zone Boundary</span>
                </div>

                {/* Level 1: Platform Hub Layer */}
                <div className="mt-4 flex flex-col items-center">
                    <div className="w-full max-w-xl p-4 rounded-lg border-2 border-fluent-brand-bg bg-fluent-bg-subtle flex flex-col gap-2 shadow-depth">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded bg-fluent-bg-card border border-fluent-stroke-subtle flex items-center justify-center shrink-0">
                                    <AzureServiceIcon resourceName="Microsoft Foundry hub" category="AI + ML" className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[14px] font-bold text-fluent-fg-primary truncate">{names.hubName}</span>
                                    <span className="text-[11px] text-fluent-fg-secondary">Azure AI Foundry Hub (Platform Scope)</span>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-fluent-cat-blue-bg text-fluent-cat-blue-fg font-semibold shrink-0">
                                KIND: HUB
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-fluent-stroke-subtle text-[11px]">
                            <div>
                                <span className="text-fluent-fg-tertiary block">Managed VNet:</span>
                                <span className="font-semibold text-fluent-fg-primary">{isPrivate ? config.managedVnetMode : 'Disabled'}</span>
                            </div>
                            <div>
                                <span className="text-fluent-fg-tertiary block">Auth Mode:</span>
                                <span className="font-semibold text-fluent-fg-primary">{config.disableLocalAuth ? 'Entra ID Only' : 'API Keys Allowed'}</span>
                            </div>
                            <div>
                                <span className="text-fluent-fg-tertiary block">Identity:</span>
                                <span className="font-semibold text-fluent-fg-primary">{config.identityType}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Downward connection lines */}
                <div className="flex justify-center -my-3">
                    <div className="w-0.5 h-6 bg-fluent-brand-bg" />
                </div>

                {/* Level 2: Linked Projects Layer */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wider">
                        Child AI Projects (Application & Team Workspaces)
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                        {names.projects.map((proj, idx) => (
                            <div
                                key={idx}
                                className="min-w-[200px] flex-1 max-w-xs p-3 rounded-md border border-fluent-stroke-subtle bg-fluent-bg-canvas hover:border-fluent-brand-bg transition-colors flex flex-col gap-1 shadow-soft"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <AzureServiceIcon resourceName="Microsoft Foundry project" category="AI + ML" className="w-3.5 h-3.5 shrink-0" />
                                        <span className="text-[12px] font-semibold text-fluent-fg-primary truncate">{proj.name}</span>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-fluent-bg-subtle text-fluent-fg-tertiary font-mono shrink-0">Project</span>
                                </div>
                                <span className="text-[11px] font-mono text-fluent-fg-secondary truncate" title={proj.generatedName}>{proj.generatedName}</span>
                                <span className="text-[10px] text-fluent-fg-tertiary truncate">{proj.description}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Level 3: Connected Dependencies & Inference Providers */}
                <div className="pt-4 border-t border-fluent-stroke-subtle flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wider">
                        Backing Dependencies & Linked Providers
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Storage Account */}
                        <div className="p-3 rounded-md border border-fluent-stroke-subtle bg-fluent-bg-subtle flex items-start gap-2.5">
                            <AzureServiceIcon resourceName="Storage account" category="Storage" className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[12px] font-semibold text-fluent-fg-primary truncate" title={names.storageName}>{names.storageName}</span>
                                <span className="text-[10px] text-fluent-fg-secondary">Default Artifact & Data Storage</span>
                                <span className="text-[10px] font-medium text-fluent-cat-green-fg mt-1">
                                    {isPrivate ? '✓ Private Endpoint' : 'Public Access'}
                                </span>
                            </div>
                        </div>

                        {/* Key Vault */}
                        <div className="p-3 rounded-md border border-fluent-stroke-subtle bg-fluent-bg-subtle flex items-start gap-2.5">
                            <AzureServiceIcon resourceName="Key vault" category="Security" className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[12px] font-semibold text-fluent-fg-primary truncate" title={names.keyVaultName}>{names.keyVaultName}</span>
                                <span className="text-[10px] text-fluent-fg-secondary">Workspace Secrets & CMK</span>
                                <span className="text-[10px] font-medium text-fluent-cat-green-fg mt-1">
                                    {isPrivate ? '✓ Private Endpoint' : 'Public Access'}
                                </span>
                            </div>
                        </div>

                        {/* Azure OpenAI / AI Services */}
                        {config.enableOpenAi && (
                            <div className="p-3 rounded-md border border-fluent-stroke-subtle bg-fluent-bg-subtle flex items-start gap-2.5">
                                <AzureServiceIcon resourceName="Azure OpenAI Service" category="AI + ML" className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[12px] font-semibold text-fluent-fg-primary truncate" title={names.openAiName}>{names.openAiName}</span>
                                    <span className="text-[10px] text-fluent-fg-secondary">
                                        Azure AI Services ({(config.modelDeployments || []).length} models)
                                    </span>
                                    <span className="text-[10px] font-medium text-fluent-cat-green-fg mt-1">
                                        {isPrivate ? '✓ Private Endpoint' : 'Public Access'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Azure AI Search */}
                        {config.enableAiSearch && (
                            <div className="p-3 rounded-md border border-fluent-stroke-subtle bg-fluent-bg-subtle flex items-start gap-2.5">
                                <AzureServiceIcon resourceName="Azure AI Search" category="AI + ML" className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[12px] font-semibold text-fluent-fg-primary truncate" title={names.searchName}>{names.searchName}</span>
                                    <span className="text-[10px] text-fluent-fg-secondary">
                                        AI Search ({(config.searchSku || 'standard').toUpperCase()})
                                    </span>
                                    <span className="text-[10px] font-medium text-fluent-cat-green-fg mt-1">
                                        {isPrivate ? '✓ Private Endpoint' : 'Public Access'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Application Insights */}
                        {config.enableAppInsights && (
                            <div className="p-3 rounded-md border border-fluent-stroke-subtle bg-fluent-bg-subtle flex items-start gap-2.5">
                                <AzureServiceIcon resourceName="Application Insights" category="Management + Governance" className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[12px] font-semibold text-fluent-fg-primary truncate" title={names.appInsightsName}>{names.appInsightsName}</span>
                                    <span className="text-[10px] text-fluent-fg-secondary">Telemetry & Model Tracing</span>
                                    <span className="text-[10px] font-medium text-fluent-cat-green-fg mt-1">
                                        ✓ Diagnostic Sink
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Container Registry */}
                        {config.enableContainerRegistry && (
                            <div className="p-3 rounded-md border border-fluent-stroke-subtle bg-fluent-bg-subtle flex items-start gap-2.5">
                                <AzureServiceIcon resourceName="Container registry" category="Containers" className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[12px] font-semibold text-fluent-fg-primary truncate" title={names.acrName}>{names.acrName}</span>
                                    <span className="text-[10px] text-fluent-fg-secondary">Docker Image Registry</span>
                                    <span className="text-[10px] font-medium text-fluent-cat-green-fg mt-1">
                                        {isPrivate ? '✓ Private Endpoint' : 'Public Access'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

FoundryVisualTopology.propTypes = {
    config: PropTypes.object.isRequired
};

export default memo(FoundryVisualTopology);
