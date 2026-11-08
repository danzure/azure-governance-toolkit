import { useState, useCallback, useMemo, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { 
    Layers, 
    ShieldCheck, 
    Cpu, 
    Plus, 
    Trash2, 
    ChevronDown, 
    ChevronUp, 
    Network,
    Sliders,
    Sparkles
} from 'lucide-react';
import { FluentDropdown, SearchableSelect } from '@shared';
import { AZURE_REGIONS, ENVIRONMENTS, AzureServiceIcon } from '@features/naming';
import { AVAILABLE_MODELS, SEARCH_SKUS } from '../data/defaultServices';
import { FQDN_CATEGORIES } from '../data/fqdnAllowlists';
import { getFoundryResourceNames } from '../utils/foundryNaming';

const NETWORK_MODE_OPTIONS = [
    { value: 'private', label: 'Private Link & Managed VNet (CAF Recommended)' },
    { value: 'public', label: 'Public Ingress (Dev / Sandbox Only)' }
];

const MANAGED_VNET_OPTIONS = [
    { value: 'AllowOnlyApprovedOutbound', label: 'Allow Only Approved Outbound (Zero-Trust FQDNs)' },
    { value: 'AllowInternetOutbound', label: 'Allow Internet Outbound' },
    { value: 'Disabled', label: 'Disabled (No Managed VNet)' }
];

const IDENTITY_OPTIONS = [
    { value: 'UserAssigned', label: 'User-Assigned Managed Identity (UAMI - Recommended)' },
    { value: 'SystemAssigned', label: 'System-Assigned Managed Identity' }
];

function FoundryConfigPanel({ config, onChangeConfig, onResetDefaults }) {
    const [expandedSection, setExpandedSection] = useState('hierarchy');
    const projectsListRef = useRef(null);
    const names = useMemo(() => getFoundryResourceNames(config), [config]);

    const toggleSection = (section) => {
        setExpandedSection(prev => prev === section ? null : section);
    };

    const updateField = useCallback((field, value) => {
        onChangeConfig(prev => ({ ...prev, [field]: value }));
    }, [onChangeConfig]);

    // Project management
    const handleAddProject = () => {
        const nextNum = config.projects.length + 1;
        const newProj = {
            id: `app${nextNum}`,
            name: `Application ${nextNum}`,
            description: 'Custom AI Foundry application workspace'
        };
        updateField('projects', [...config.projects, newProj]);
        requestAnimationFrame(() => {
            if (projectsListRef.current && typeof projectsListRef.current.scrollTo === 'function') {
                projectsListRef.current.scrollTo({
                    top: projectsListRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        });
    };

    const handleRemoveProject = (index) => {
        updateField('projects', config.projects.filter((_, i) => i !== index));
    };

    const handleProjectChange = (index, key, val) => {
        const updated = config.projects.map((p, i) => i === index ? { ...p, [key]: val } : p);
        updateField('projects', updated);
    };

    // FQDN management
    const handleToggleFqdn = (fqdnId) => {
        const current = config.allowedFqdns || [];
        const next = current.includes(fqdnId)
            ? current.filter(id => id !== fqdnId)
            : [...current, fqdnId];
        updateField('allowedFqdns', next);
    };

    // Model management
    const handleToggleModel = (modelId) => {
        const current = config.modelDeployments || [];
        const exists = current.some(m => m.name === modelId);
        if (exists) {
            updateField('modelDeployments', current.filter(m => m.name !== modelId));
        } else {
            const found = AVAILABLE_MODELS.find(m => m.id === modelId);
            if (found) {
                updateField('modelDeployments', [
                    ...current,
                    { name: found.id, model: found.id, version: found.defaultVersion, sku: found.skus[0], capacity: found.defaultCapacity }
                ]);
            }
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Header / Subtitle */}
            <div className="min-h-[34px] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-fluent-brand-fg" />
                    <h2 className="text-[14px] font-semibold text-fluent-fg-primary">
                        Foundry Configuration
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onResetDefaults}
                    className="text-[12px] text-fluent-brand-fg hover:underline font-medium"
                >
                    Reset Defaults
                </button>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Section 1: Hierarchy & Projects                               */}
            {/* ------------------------------------------------------------- */}
            <div className="rounded-lg border bg-fluent-bg-card border-fluent-stroke-subtle overflow-hidden shadow-soft">
                <button
                    type="button"
                    onClick={() => toggleSection('hierarchy')}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between bg-fluent-bg-subtle hover:bg-fluent-bg-hover transition-colors text-left"
                >
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-fluent-brand-fg" />
                        <span className="text-[13px] font-semibold text-fluent-fg-primary">
                            1. Workspace Hierarchy & Naming
                        </span>
                        <span className="text-[11px] text-fluent-fg-tertiary">
                            ({config.projects.length} {config.projects.length === 1 ? 'Project' : 'Projects'})
                        </span>
                    </div>
                    {expandedSection === 'hierarchy' ? <ChevronUp className="w-4 h-4 text-fluent-fg-secondary" /> : <ChevronDown className="w-4 h-4 text-fluent-fg-secondary" />}
                </button>

                {expandedSection === 'hierarchy' && (
                    <div className="p-4 flex flex-col gap-3.5 animate-fade-in border-t border-fluent-stroke-subtle">
                        {/* Live CAF Hub Name Preview */}
                        <div className="flex flex-col gap-1.5 p-3 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <AzureServiceIcon resourceName="Microsoft Foundry hub" category="AI + ML" className="w-4 h-4 shrink-0" />
                                    <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wider">
                                        Canonical Hub Name (CAF Compliant)
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-fluent-cat-green-bg border border-fluent-cat-green-border text-fluent-cat-green-fg">
                                    <ShieldCheck className="w-3 h-3" />
                                    CAF Standard
                                </span>
                            </div>
                            <div className="font-mono text-[13px] font-semibold text-fluent-fg-primary truncate select-all" title={names.hubName}>
                                {names.hubName}
                            </div>
                        </div>

                        {/* Workload, Env, Region, Instance Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                    Workload Code
                                </label>
                                <input
                                    type="text"
                                    value={config.workload}
                                    onChange={(e) => updateField('workload', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                    placeholder="coreai"
                                    className="w-full px-3 h-[32px] border rounded-[4px] outline-none text-[13px] bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg"
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                    Environment
                                </label>
                                <FluentDropdown
                                    value={config.environment}
                                    onChange={(val) => updateField('environment', val)}
                                    options={ENVIRONMENTS.map(e => ({ value: e.value, label: e.label }))}
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                    Azure Region
                                </label>
                                <SearchableSelect
                                    items={AZURE_REGIONS}
                                    value={config.region}
                                    onChange={(val) => updateField('region', val)}
                                    placeholder="Select region..."
                                    compact
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                    Instance Index
                                </label>
                                <input
                                    type="text"
                                    maxLength={3}
                                    value={config.instance}
                                    onChange={(e) => updateField('instance', e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="001"
                                    className="w-full px-3 h-[32px] border rounded-[4px] outline-none text-[13px] bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg"
                                />
                            </div>
                        </div>

                        {/* Child Projects List */}
                        <div className="pt-2 border-t border-fluent-stroke-subtle flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[12px] font-semibold text-fluent-fg-primary">
                                    AI Projects (Child Workspaces)
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddProject}
                                    className="px-2.5 h-[26px] bg-fluent-bg-card border border-fluent-stroke-strong hover:border-fluent-brand-bg text-fluent-brand-fg rounded-[4px] text-[12px] font-medium inline-flex items-center gap-1 active:scale-95"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Project</span>
                                </button>
                            </div>

                            <div
                                ref={projectsListRef}
                                className={`flex flex-col gap-2 ${
                                    config.projects.length > 2 ? 'max-h-[156px] overflow-y-auto pr-1' : ''
                                }`}
                            >
                                {config.projects.map((proj, idx) => (
                                    <div key={idx} className="shrink-0 flex flex-col gap-1.5 p-2.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={proj.name}
                                                onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                                                placeholder="Project Display Name"
                                                className="flex-1 min-w-0 px-2.5 h-[28px] text-[12px] bg-fluent-bg-card border border-fluent-stroke-strong rounded-[4px] text-fluent-fg-primary"
                                            />
                                            <input
                                                type="text"
                                                value={proj.id}
                                                onChange={(e) => handleProjectChange(idx, 'id', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                                placeholder="app-id"
                                                className="w-28 px-2.5 h-[28px] text-[12px] font-mono bg-fluent-bg-card border border-fluent-stroke-strong rounded-[4px] text-fluent-fg-primary"
                                                title="Application slug for CAF naming"
                                            />
                                            {config.projects.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProject(idx)}
                                                    title="Delete project"
                                                    className="p-1 text-fluent-fg-tertiary hover:text-fluent-state-danger rounded"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] px-1 font-mono text-fluent-fg-secondary">
                                            <span className="text-fluent-fg-tertiary">CAF Name:</span>
                                            <span className="font-semibold text-fluent-fg-primary truncate select-all" title={names.projects[idx]?.generatedName}>
                                                {names.projects[idx]?.generatedName}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Section 2: Network Isolation & Managed VNet                   */}
            {/* ------------------------------------------------------------- */}
            <div className="rounded-lg border bg-fluent-bg-card border-fluent-stroke-subtle overflow-hidden shadow-soft">
                <button
                    type="button"
                    onClick={() => toggleSection('network')}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between bg-fluent-bg-subtle hover:bg-fluent-bg-hover transition-colors text-left"
                >
                    <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-fluent-brand-fg" />
                        <span className="text-[13px] font-semibold text-fluent-fg-primary">
                            2. Security & Network Isolation
                        </span>
                        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] ${config.networkMode === 'private' ? 'bg-fluent-cat-green-bg text-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-bg text-fluent-cat-yellow-fg'}`}>
                            {config.networkMode === 'private' ? 'Zero-Trust Private' : 'Public'}
                        </span>
                    </div>
                    {expandedSection === 'network' ? <ChevronUp className="w-4 h-4 text-fluent-fg-secondary" /> : <ChevronDown className="w-4 h-4 text-fluent-fg-secondary" />}
                </button>

                {expandedSection === 'network' && (
                    <div className="p-4 flex flex-col gap-3.5 animate-fade-in border-t border-fluent-stroke-subtle">
                        <div>
                            <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                Ingress Network Security
                            </label>
                            <FluentDropdown
                                value={config.networkMode}
                                onChange={(val) => updateField('networkMode', val)}
                                options={NETWORK_MODE_OPTIONS}
                            />
                        </div>

                        {config.networkMode === 'private' && (
                            <div>
                                <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                    AI Hub Managed Virtual Network Mode
                                </label>
                                <FluentDropdown
                                    value={config.managedVnetMode}
                                    onChange={(val) => updateField('managedVnetMode', val)}
                                    options={MANAGED_VNET_OPTIONS}
                                />
                                <span className="text-[11px] text-fluent-fg-tertiary mt-1 block">
                                    Managed VNets isolate compute instances, prompt flows, and training jobs inside an automated perimeter.
                                </span>
                            </div>
                        )}

                        {/* Outbound FQDN Rules */}
                        {config.networkMode === 'private' && config.managedVnetMode === 'AllowOnlyApprovedOutbound' && (
                            <div className="pt-2 border-t border-fluent-stroke-subtle">
                                <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                    Approved Outbound FQDN Categories
                                </label>
                                <div className="flex flex-col gap-2">
                                    {FQDN_CATEGORIES.map(cat => {
                                        const checked = (config.allowedFqdns || []).includes(cat.id);
                                        return (
                                            <label
                                                key={cat.id}
                                                className="flex items-start gap-2.5 p-2 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover cursor-pointer transition-colors border border-fluent-stroke-subtle"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => handleToggleFqdn(cat.id)}
                                                    className="mt-0.5 rounded border-fluent-stroke-strong text-fluent-brand-bg focus:ring-fluent-brand-bg"
                                                />
                                                <div className="flex flex-col text-[12px]">
                                                    <span className="font-medium text-fluent-fg-primary">{cat.label}</span>
                                                    <span className="text-fluent-fg-tertiary">{cat.description}</span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Section 3: AI Services & Search Dependencies                  */}
            {/* ------------------------------------------------------------- */}
            <div className="rounded-lg border bg-fluent-bg-card border-fluent-stroke-subtle overflow-hidden shadow-soft">
                <button
                    type="button"
                    onClick={() => toggleSection('services')}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between bg-fluent-bg-subtle hover:bg-fluent-bg-hover transition-colors text-left"
                >
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-fluent-brand-fg" />
                        <span className="text-[13px] font-semibold text-fluent-fg-primary">
                            3. Connected AI Services & Search
                        </span>
                    </div>
                    {expandedSection === 'services' ? <ChevronUp className="w-4 h-4 text-fluent-fg-secondary" /> : <ChevronDown className="w-4 h-4 text-fluent-fg-secondary" />}
                </button>

                {expandedSection === 'services' && (
                    <div className="p-4 flex flex-col gap-3.5 animate-fade-in border-t border-fluent-stroke-subtle">
                        {/* Azure OpenAI Toggle */}
                        <div className="flex items-center justify-between p-2.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                            <div className="flex items-center gap-2.5">
                                <AzureServiceIcon resourceName="Azure OpenAI Service" category="AI + ML" className="w-5 h-5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-semibold text-fluent-fg-primary">Azure AI Services / OpenAI</span>
                                    <span className="text-[11px] text-fluent-fg-secondary">Connect multi-service inference account with model deployments</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.enableOpenAi}
                                onChange={(e) => updateField('enableOpenAi', e.target.checked)}
                                className="w-4 h-4 rounded text-fluent-brand-bg"
                            />
                        </div>

                        {/* Model Deployments Multi-select */}
                        {config.enableOpenAi && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-semibold text-fluent-fg-primary">
                                    Active Model Deployments
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {AVAILABLE_MODELS.map(m => {
                                        const isSelected = (config.modelDeployments || []).some(md => md.name === m.id);
                                        return (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => handleToggleModel(m.id)}
                                                className={`p-2 rounded-[4px] border text-left flex flex-col gap-1 transition-all active:scale-95 ${
                                                    isSelected
                                                        ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text'
                                                        : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-[12px] font-semibold text-fluent-fg-primary">{m.name}</span>
                                                    {isSelected && <Sparkles className="w-3 h-3 text-fluent-brand-fg" />}
                                                </div>
                                                <span className="text-[10px] text-fluent-fg-tertiary truncate">{m.description}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Azure AI Search Toggle */}
                        <div className="flex items-center justify-between p-2.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle mt-2">
                            <div className="flex items-center gap-2.5">
                                <AzureServiceIcon resourceName="Azure AI Search" category="AI + ML" className="w-5 h-5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-semibold text-fluent-fg-primary">Azure AI Search (RAG Index)</span>
                                    <span className="text-[11px] text-fluent-fg-secondary">Dedicated vector store for semantic reranking and enterprise grounding</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.enableAiSearch}
                                onChange={(e) => updateField('enableAiSearch', e.target.checked)}
                                className="w-4 h-4 rounded text-fluent-brand-bg"
                            />
                        </div>

                        {config.enableAiSearch && (
                            <div className="flex flex-col gap-3 pl-2 border-l-2 border-fluent-brand-bg">
                                <div>
                                    <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                        Search Pricing Tier
                                    </label>
                                    <FluentDropdown
                                        value={config.searchSku}
                                        onChange={(val) => updateField('searchSku', val)}
                                        options={SEARCH_SKUS.map(s => ({ value: s.value, label: s.label }))}
                                    />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer text-[12px] text-fluent-fg-primary">
                                    <input
                                        type="checkbox"
                                        checked={config.searchSemanticRanker}
                                        onChange={(e) => updateField('searchSemanticRanker', e.target.checked)}
                                        className="rounded text-fluent-brand-bg"
                                    />
                                    <span>Enable Semantic Ranker (L2 deep-neural reranking)</span>
                                </label>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Section 4: Identity & Zero-Trust Governance                   */}
            {/* ------------------------------------------------------------- */}
            <div className="rounded-lg border bg-fluent-bg-card border-fluent-stroke-subtle overflow-hidden shadow-soft">
                <button
                    type="button"
                    onClick={() => toggleSection('identity')}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between bg-fluent-bg-subtle hover:bg-fluent-bg-hover transition-colors text-left"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-fluent-brand-fg" />
                        <span className="text-[13px] font-semibold text-fluent-fg-primary">
                            4. Identity, Encryption & Governance
                        </span>
                    </div>
                    {expandedSection === 'identity' ? <ChevronUp className="w-4 h-4 text-fluent-fg-secondary" /> : <ChevronDown className="w-4 h-4 text-fluent-fg-secondary" />}
                </button>

                {expandedSection === 'identity' && (
                    <div className="p-4 flex flex-col gap-3.5 animate-fade-in border-t border-fluent-stroke-subtle">
                        <div>
                            <label className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                Managed Identity Architecture
                            </label>
                            <FluentDropdown
                                value={config.identityType}
                                onChange={(val) => updateField('identityType', val)}
                                options={IDENTITY_OPTIONS}
                            />
                        </div>

                        <label className="flex items-start gap-2.5 p-2 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover cursor-pointer border border-fluent-stroke-subtle">
                            <input
                                type="checkbox"
                                checked={config.disableLocalAuth}
                                onChange={(e) => updateField('disableLocalAuth', e.target.checked)}
                                className="mt-0.5 rounded text-fluent-brand-bg"
                            />
                            <div className="flex flex-col text-[12px]">
                                <span className="font-medium text-fluent-fg-primary">Disable Local Authentication (No API Keys)</span>
                                <span className="text-fluent-fg-tertiary">Enforces Microsoft Entra ID token-based access exclusively for OpenAI & Search</span>
                            </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-2 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover cursor-pointer border border-fluent-stroke-subtle">
                            <input
                                type="checkbox"
                                checked={config.enableCmk}
                                onChange={(e) => updateField('enableCmk', e.target.checked)}
                                className="mt-0.5 rounded text-fluent-brand-bg"
                            />
                            <div className="flex flex-col text-[12px]">
                                <span className="font-medium text-fluent-fg-primary">Customer-Managed Key (CMK) Encryption</span>
                                <span className="text-fluent-fg-tertiary">Enforces Key Vault HSM purge protection and double encryption for storage and workspace</span>
                            </div>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-fluent-stroke-subtle">
                            <label className="flex items-center gap-2 cursor-pointer text-[12px] text-fluent-fg-primary">
                                <input
                                    type="checkbox"
                                    checked={config.enableAppInsights}
                                    onChange={(e) => updateField('enableAppInsights', e.target.checked)}
                                    className="rounded text-fluent-brand-bg"
                                />
                                <AzureServiceIcon resourceName="Application Insights" category="Management + Governance" className="w-4 h-4 shrink-0" />
                                <span>Application Insights</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-[12px] text-fluent-fg-primary">
                                <input
                                    type="checkbox"
                                    checked={config.enableContainerRegistry}
                                    onChange={(e) => updateField('enableContainerRegistry', e.target.checked)}
                                    className="rounded text-fluent-brand-bg"
                                />
                                <AzureServiceIcon resourceName="Container registry" category="Containers" className="w-4 h-4 shrink-0" />
                                <span>Container Registry (ACR)</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

FoundryConfigPanel.propTypes = {
    config: PropTypes.object.isRequired,
    onChangeConfig: PropTypes.func.isRequired,
    onResetDefaults: PropTypes.func.isRequired
};

export default memo(FoundryConfigPanel);
