import { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
    Layers, 
    Lock,
    Network,
    Check,
    Globe,
    Copy,
    ShieldCheck
} from 'lucide-react';
import { AzureServiceIcon } from '@features/naming';
import { getFoundryResourceNames } from '../utils/foundryNaming';

function FoundryVisualTopology({ config }) {
    const isPrivate = config.networkMode === 'private';
    const names = getFoundryResourceNames(config);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = useCallback(async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }, []);

    return (
        <div className="w-full flex-1 h-full flex flex-col animate-fade-in">
            {/* Sub-Header Context Bar */}
            <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-fluent-stroke-subtle bg-fluent-bg-canvas shrink-0">
                <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">
                        Architecture Topology & Security Perimeter
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium border ${
                        isPrivate 
                            ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg' 
                            : 'bg-fluent-bg-subtle border-fluent-stroke-subtle text-fluent-cat-yellow-fg'
                    }`}>
                        {isPrivate ? <Lock className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                        <span>{isPrivate ? 'Zero-Trust Managed VNet' : 'Public Endpoint Access'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle text-[11px] text-fluent-fg-primary border border-fluent-stroke-subtle font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-blue-fg shrink-0" />
                        <span>{config.region}</span>
                    </span>
                </div>
            </div>

            {/* Architecture Canvas Wrapper */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col bg-fluent-bg-card">
                <div className="relative w-full flex-1 rounded-lg border border-dashed border-fluent-stroke-strong p-4 sm:p-5 bg-fluent-bg-canvas flex flex-col justify-between gap-5">
                    {/* Boundary Tag */}
                    <div className="flex items-center gap-1.5 text-[11px] text-fluent-fg-tertiary uppercase tracking-wider font-semibold">
                        <Layers className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0" />
                        <span>Azure Virtual Network & Landing Zone Boundary</span>
                    </div>

                    {/* Level 1: Platform Hub Layer */}
                    <div className="flex flex-col items-center">
                        <div className="group/hub w-full max-w-xl p-4 rounded-lg border-2 border-fluent-brand-bg bg-fluent-bg-card flex flex-col gap-2.5 shadow-soft">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="p-1.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex items-center justify-center shrink-0">
                                        <AzureServiceIcon resourceName="Microsoft Foundry hub" category="AI + ML" className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[14px] font-semibold font-mono text-fluent-fg-primary truncate select-all" title={names.hubName}>
                                                {names.hubName}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(names.hubName, 'hub')}
                                                title={`Copy ${names.hubName}`}
                                                className={`p-1 rounded-[3px] transition-opacity shrink-0 ${
                                                    copiedId === 'hub'
                                                        ? 'opacity-100 text-fluent-cat-green-fg'
                                                        : 'opacity-0 group-hover/hub:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                }`}
                                            >
                                                {copiedId === 'hub' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <span className="text-[12px] text-fluent-fg-secondary">Azure AI Foundry Hub (Platform Scope)</span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-mono font-semibold text-fluent-fg-primary shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-blue-fg shrink-0" />
                                    <span>HUB</span>
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2.5 border-t border-fluent-stroke-subtle text-[12px]">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-green-fg shrink-0" />
                                    <span className="text-fluent-fg-tertiary">VNet:</span>
                                    <span className="font-medium text-fluent-fg-primary truncate">{isPrivate ? config.managedVnetMode : 'Disabled'}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                                    <span className="text-fluent-fg-tertiary">Auth:</span>
                                    <span className="font-medium text-fluent-fg-primary truncate">{config.disableLocalAuth ? 'Entra ID Only' : 'API Keys'}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-teal-fg shrink-0" />
                                    <span className="text-fluent-fg-tertiary">Identity:</span>
                                    <span className="font-medium text-fluent-fg-primary truncate">{config.identityType === 'UserAssigned' ? 'UAMI' : 'SAMI'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Downward connection line */}
                    <div className="flex justify-center -my-3">
                        <div className="w-0.5 h-6 bg-fluent-brand-bg" />
                    </div>

                    {/* Level 2: Linked Projects Layer */}
                    <div className="flex flex-col items-center gap-2.5">
                        <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wider">
                            Child AI Projects (Application & Team Workspaces)
                        </span>
                        <div className="flex flex-wrap items-stretch justify-center gap-3 w-full">
                            {names.projects.map((proj, idx) => {
                                const projCopyId = `proj-${idx}`;
                                return (
                                    <div
                                        key={idx}
                                        className="group/proj min-w-[200px] flex-1 max-w-xs p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card hover:border-fluent-brand-bg transition-colors flex flex-col gap-1 shadow-soft"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <AzureServiceIcon resourceName="Microsoft Foundry project" category="AI + ML" className="w-4 h-4 shrink-0" />
                                                <span className="text-[12px] font-semibold text-fluent-fg-primary truncate">{proj.name}</span>
                                            </div>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary font-mono shrink-0">
                                                Project
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[11px] font-mono font-medium text-fluent-fg-primary truncate select-all" title={proj.generatedName}>
                                                {proj.generatedName}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(proj.generatedName, projCopyId)}
                                                title={`Copy ${proj.generatedName}`}
                                                className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                    copiedId === projCopyId
                                                        ? 'opacity-100 text-fluent-cat-green-fg'
                                                        : 'opacity-0 group-hover/proj:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                }`}
                                            >
                                                {copiedId === projCopyId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-fluent-fg-tertiary truncate">{proj.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Connector Pill between Projects and Backing Dependencies */}
                    <div className="relative flex items-center justify-center my-0.5">
                        <div className="absolute inset-x-0 top-1/2 border-t border-fluent-stroke-subtle" />
                        <span className="relative z-10 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-secondary">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPrivate ? 'bg-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-fg'}`} />
                            <span>{isPrivate ? 'Managed Private Endpoints & RBAC Connections' : 'Hub Service Connections & RBAC'}</span>
                        </span>
                    </div>

                    {/* Level 3: Connected Dependencies & Inference Providers */}
                    <div className="flex flex-col gap-2.5">
                        <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wider">
                            Backing Dependencies & Linked Providers
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {/* Storage Account */}
                            <div className="group/card p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card flex items-start gap-2.5 shadow-soft">
                                <AzureServiceIcon resourceName="Storage account" category="Storage" className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[12px] font-mono font-semibold text-fluent-fg-primary truncate select-all" title={names.storageName}>{names.storageName}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(names.storageName, 'st')}
                                            title={`Copy ${names.storageName}`}
                                            className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                copiedId === 'st'
                                                    ? 'opacity-100 text-fluent-cat-green-fg'
                                                    : 'opacity-0 group-hover/card:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                            }`}
                                        >
                                            {copiedId === 'st' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                    <span className="text-[11px] text-fluent-fg-secondary">Artifact & Blob Storage</span>
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${isPrivate ? 'text-fluent-cat-green-fg' : 'text-fluent-cat-yellow-fg'}`}>
                                        {isPrivate ? <Check className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                        <span>{isPrivate ? 'Private Endpoint' : 'Public Access'}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Key Vault */}
                            <div className="group/card p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card flex items-start gap-2.5 shadow-soft">
                                <AzureServiceIcon resourceName="Key vault" category="Security" className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[12px] font-mono font-semibold text-fluent-fg-primary truncate select-all" title={names.keyVaultName}>{names.keyVaultName}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(names.keyVaultName, 'kv')}
                                            title={`Copy ${names.keyVaultName}`}
                                            className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                copiedId === 'kv'
                                                    ? 'opacity-100 text-fluent-cat-green-fg'
                                                    : 'opacity-0 group-hover/card:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                            }`}
                                        >
                                            {copiedId === 'kv' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                    <span className="text-[11px] text-fluent-fg-secondary">Secrets & CMK Vault</span>
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${isPrivate ? 'text-fluent-cat-green-fg' : 'text-fluent-cat-yellow-fg'}`}>
                                        {isPrivate ? <Check className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                        <span>{isPrivate ? 'Private Endpoint' : 'Public Access'}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Azure OpenAI / AI Services */}
                            {config.enableOpenAi && (
                                <div className="group/card p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card flex items-start gap-2.5 shadow-soft">
                                    <AzureServiceIcon resourceName="Azure OpenAI Service" category="AI + ML" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[12px] font-mono font-semibold text-fluent-fg-primary truncate select-all" title={names.openAiName}>{names.openAiName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(names.openAiName, 'oai')}
                                                title={`Copy ${names.openAiName}`}
                                                className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                    copiedId === 'oai'
                                                        ? 'opacity-100 text-fluent-cat-green-fg'
                                                        : 'opacity-0 group-hover/card:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                }`}
                                            >
                                                {copiedId === 'oai' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-fluent-fg-secondary">
                                            AI Services ({(config.modelDeployments || []).length} models)
                                        </span>
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${isPrivate ? 'text-fluent-cat-green-fg' : 'text-fluent-cat-yellow-fg'}`}>
                                            {isPrivate ? <Check className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                            <span>{isPrivate ? 'Private Endpoint' : 'Public Access'}</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Azure AI Search */}
                            {config.enableAiSearch && (
                                <div className="group/card p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card flex items-start gap-2.5 shadow-soft">
                                    <AzureServiceIcon resourceName="Azure AI Search" category="AI + ML" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[12px] font-mono font-semibold text-fluent-fg-primary truncate select-all" title={names.searchName}>{names.searchName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(names.searchName, 'srch')}
                                                title={`Copy ${names.searchName}`}
                                                className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                    copiedId === 'srch'
                                                        ? 'opacity-100 text-fluent-cat-green-fg'
                                                        : 'opacity-0 group-hover/card:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                }`}
                                            >
                                                {copiedId === 'srch' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-fluent-fg-secondary">
                                            AI Search ({(config.searchSku || 'standard').toUpperCase()})
                                        </span>
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${isPrivate ? 'text-fluent-cat-green-fg' : 'text-fluent-cat-yellow-fg'}`}>
                                            {isPrivate ? <Check className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                            <span>{isPrivate ? 'Private Endpoint' : 'Public Access'}</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Application Insights */}
                            {config.enableAppInsights && (
                                <div className="group/card p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card flex items-start gap-2.5 shadow-soft">
                                    <AzureServiceIcon resourceName="Application Insights" category="Management + Governance" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[12px] font-mono font-semibold text-fluent-fg-primary truncate select-all" title={names.appInsightsName}>{names.appInsightsName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(names.appInsightsName, 'appi')}
                                                title={`Copy ${names.appInsightsName}`}
                                                className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                    copiedId === 'appi'
                                                        ? 'opacity-100 text-fluent-cat-green-fg'
                                                        : 'opacity-0 group-hover/card:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                }`}
                                            >
                                                {copiedId === 'appi' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-fluent-fg-secondary">Telemetry & Tracing</span>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-fluent-cat-green-fg mt-0.5">
                                            <Check className="w-3 h-3 shrink-0" />
                                            <span>Diagnostic Sink</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Log Analytics Workspace */}
                            {config.enableAppInsights && (
                                <div className="group/card p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card flex items-start gap-2.5 shadow-soft">
                                    <AzureServiceIcon resourceName="Log Analytics workspace" category="Management + Governance" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[12px] font-mono font-semibold text-fluent-fg-primary truncate select-all" title={names.logAnalyticsName}>{names.logAnalyticsName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(names.logAnalyticsName, 'log')}
                                                title={`Copy ${names.logAnalyticsName}`}
                                                className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                    copiedId === 'log'
                                                        ? 'opacity-100 text-fluent-cat-green-fg'
                                                        : 'opacity-0 group-hover/card:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                }`}
                                            >
                                                {copiedId === 'log' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-fluent-fg-secondary">Central Log Store</span>
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${isPrivate ? 'text-fluent-cat-green-fg' : 'text-fluent-cat-yellow-fg'}`}>
                                            {isPrivate ? <Check className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                            <span>{isPrivate ? 'Private Link' : 'Public Ingestion'}</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Container Registry */}
                            {config.enableContainerRegistry && (
                                <div className="group/card p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card flex items-start gap-2.5 shadow-soft">
                                    <AzureServiceIcon resourceName="Container registry" category="Containers" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[12px] font-mono font-semibold text-fluent-fg-primary truncate select-all" title={names.acrName}>{names.acrName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(names.acrName, 'acr')}
                                                title={`Copy ${names.acrName}`}
                                                className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                    copiedId === 'acr'
                                                        ? 'opacity-100 text-fluent-cat-green-fg'
                                                        : 'opacity-0 group-hover/card:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                }`}
                                            >
                                                {copiedId === 'acr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-fluent-fg-secondary">Container Registry</span>
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${isPrivate ? 'text-fluent-cat-green-fg' : 'text-fluent-cat-yellow-fg'}`}>
                                            {isPrivate ? <Check className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                            <span>{isPrivate ? 'Private Endpoint' : 'Public Access'}</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* User-Assigned Managed Identity */}
                            {config.identityType === 'UserAssigned' && (
                                <div className="group/card p-3 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card flex items-start gap-2.5 shadow-soft">
                                    <AzureServiceIcon resourceName="Managed identity (user)" category="Security" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[12px] font-mono font-semibold text-fluent-fg-primary truncate select-all" title={names.uamiName}>{names.uamiName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(names.uamiName, 'uami')}
                                                title={`Copy ${names.uamiName}`}
                                                className={`p-0.5 rounded-[3px] transition-opacity shrink-0 ${
                                                    copiedId === 'uami'
                                                        ? 'opacity-100 text-fluent-cat-green-fg'
                                                        : 'opacity-0 group-hover/card:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                }`}
                                            >
                                                {copiedId === 'uami' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-fluent-fg-secondary">User-Assigned Identity</span>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-fluent-cat-blue-fg mt-0.5">
                                            <ShieldCheck className="w-3 h-3 shrink-0" />
                                            <span>Control Plane RBAC</span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
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
