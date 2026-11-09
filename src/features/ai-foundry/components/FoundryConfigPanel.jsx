import { useState, useCallback, useMemo, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { 
    Layers, 
    ShieldCheck, 
    Cpu, 
    Plus, 
    Trash2, 
    ChevronDown, 
    Network,
    Sliders,
    RefreshCw,
    Copy,
    Check
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

function FluentCheckbox({ checked, onChange, className = '' }) {
    return (
        <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />
            <span
                className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-fluent-brand-bg ${
                    checked
                        ? 'bg-fluent-brand-bg border-fluent-brand-bg text-white'
                        : 'bg-fluent-bg-card border-fluent-stroke-strong hover:border-fluent-fg-primary'
                }`}
            >
                {checked && <Check className="w-3 h-3 stroke-[2.5]" />}
            </span>
        </span>
    );
}

FluentCheckbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string
};

function FoundryConfigPanel({ config, onChangeConfig, onResetDefaults }) {
    const [expandedSection, setExpandedSection] = useState('hierarchy');
    const [copiedId, setCopiedId] = useState(null);
    const projectsListRef = useRef(null);
    const names = useMemo(() => getFoundryResourceNames(config), [config]);

    const toggleSection = (section) => {
        setExpandedSection(prev => prev === section ? null : section);
    };

    const updateField = useCallback((field, value) => {
        onChangeConfig(prev => ({ ...prev, [field]: value }));
    }, [onChangeConfig]);

    const handleCopyText = useCallback(async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }, []);

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
        <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle w-full flex flex-col flex-1 h-full">
            {/* Card Header Toolbar */}
            <div className="px-4 py-2.5 min-h-[48px] flex items-center justify-between gap-2 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                    <h2 className="text-[14px] font-semibold text-fluent-fg-primary">
                        Foundry Configuration
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onResetDefaults}
                    title="Reset configuration to default CAF baseline"
                    className="shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary active:scale-95"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                </button>
            </div>

            {/* Accordion Sections Container */}
            <div className="p-3.5 sm:p-4 flex flex-col gap-3 flex-1">
                {/* ------------------------------------------------------------- */}
                {/* Section 1: Hierarchy & Projects                               */}
                {/* ------------------------------------------------------------- */}
                <div className="rounded-lg border bg-fluent-bg-card border-fluent-stroke-subtle">
                    <button
                        type="button"
                        onClick={() => toggleSection('hierarchy')}
                        aria-expanded={expandedSection === 'hierarchy'}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2 bg-fluent-bg-subtle hover:bg-fluent-bg-hover transition-colors text-left ${
                            expandedSection === 'hierarchy' ? 'rounded-t-lg' : 'rounded-lg'
                        }`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <Layers className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                            <span className="text-[13px] font-semibold text-fluent-fg-primary truncate">
                                1. Workspace Hierarchy & Naming
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-secondary">
                                <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-blue-fg shrink-0" />
                                <span>{config.projects.length} {config.projects.length === 1 ? 'Project' : 'Projects'}</span>
                            </span>
                            <ChevronDown className={`w-4 h-4 text-fluent-fg-secondary transition-transform duration-200 ${expandedSection === 'hierarchy' ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {expandedSection === 'hierarchy' && (
                        <div className="p-3.5 sm:p-4 flex flex-col gap-3.5 animate-fade-in border-t border-fluent-stroke-subtle">
                            {/* Live CAF Hub Name Preview */}
                            <div className="flex flex-col gap-2 p-3 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <AzureServiceIcon resourceName="Microsoft Foundry hub" category="AI + ML" className="w-4 h-4 shrink-0" />
                                        <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wider truncate">
                                            Canonical Hub Name (CAF)
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-fluent-cat-green-bg border border-fluent-cat-green-border text-fluent-cat-green-fg shrink-0">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span>CAF Standard</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0 font-mono text-[13px] font-semibold text-fluent-fg-primary truncate select-all" title={names.hubName}>
                                        {names.hubName}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyText(names.hubName, 'hub-name')}
                                        className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border active:scale-95 ${
                                            copiedId === 'hub-name'
                                                ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                                : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                                        }`}
                                    >
                                        {copiedId === 'hub-name' ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 animate-scale-in" />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Workload, Env, Region, Instance Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                        Workload Code
                                    </label>
                                    <input
                                        type="text"
                                        value={config.workload}
                                        onChange={(e) => updateField('workload', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                        placeholder="coreai"
                                        className="w-full px-3 h-[32px] border rounded-[4px] outline-none text-[13px] transition-all duration-200 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg placeholder:text-fluent-fg-tertiary"
                                    />
                                </div>

                                <div>
                                    <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                        Environment
                                    </label>
                                    <FluentDropdown
                                        value={config.environment}
                                        onChange={(val) => updateField('environment', val)}
                                        options={ENVIRONMENTS.map(e => ({ value: e.value, label: e.label }))}
                                    />
                                </div>

                                <div>
                                    <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
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
                                    <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                        Instance Index
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={3}
                                        value={config.instance}
                                        onChange={(e) => updateField('instance', e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="001"
                                        className="w-full px-3 h-[32px] border rounded-[4px] outline-none text-[13px] transition-all duration-200 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg placeholder:text-fluent-fg-tertiary"
                                    />
                                </div>
                            </div>

                            {/* Child Projects List */}
                            <div className="pt-2.5 border-t border-fluent-stroke-subtle flex flex-col gap-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[13px] font-semibold text-fluent-fg-primary">
                                        AI Projects (Child Workspaces)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddProject}
                                        className="px-2.5 h-[26px] rounded-[4px] border transition-all inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary text-[12px] font-medium active:scale-95"
                                    >
                                        <Plus className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                        <span>Add Project</span>
                                    </button>
                                </div>

                                <div
                                    ref={projectsListRef}
                                    className={`flex flex-col gap-2 ${
                                        config.projects.length > 3 ? 'max-h-[264px] overflow-y-auto pr-1 custom-scrollbar' : ''
                                    }`}
                                >
                                    {config.projects.map((proj, idx) => {
                                        const projCopyId = `proj-name-${idx}`;
                                        const generatedProjName = names.projects[idx]?.generatedName || '';
                                        return (
                                            <div key={idx} className="shrink-0 flex flex-col gap-1.5 p-2.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={proj.name}
                                                        onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                                                        placeholder="Project Display Name"
                                                        className="flex-1 min-w-0 px-3 h-[32px] text-[13px] bg-fluent-bg-card border border-fluent-stroke-strong rounded-[4px] outline-none transition-all duration-200 focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg text-fluent-fg-primary placeholder:text-fluent-fg-tertiary"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={proj.id}
                                                        onChange={(e) => handleProjectChange(idx, 'id', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                                        placeholder="app-id"
                                                        className="w-28 px-3 h-[32px] text-[13px] font-mono bg-fluent-bg-card border border-fluent-stroke-strong rounded-[4px] outline-none transition-all duration-200 focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg text-fluent-fg-primary placeholder:text-fluent-fg-tertiary"
                                                        title="Application slug for CAF naming"
                                                    />
                                                    {config.projects.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveProject(idx)}
                                                            title="Delete project"
                                                            aria-label={`Delete ${proj.name}`}
                                                            className="shrink-0 h-[32px] w-[32px] rounded-[4px] transition-all inline-flex items-center justify-center border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-state-danger active:scale-95"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={proj.description || ''}
                                                    onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                                                    placeholder="Project purpose or workload description..."
                                                    className="w-full px-2.5 h-[26px] text-[12px] bg-fluent-bg-card border border-fluent-stroke-subtle rounded-[4px] outline-none transition-all duration-200 focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg text-fluent-fg-secondary focus:text-fluent-fg-primary placeholder:text-fluent-fg-tertiary"
                                                />
                                                <div className="flex items-center justify-between gap-2 text-[11px] px-1 font-mono text-fluent-fg-secondary">
                                                    <span className="text-fluent-fg-tertiary">CAF Name:</span>
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <span className="font-semibold text-fluent-fg-primary truncate select-all" title={generatedProjName}>
                                                            {generatedProjName}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyText(generatedProjName, projCopyId)}
                                                            title={`Copy ${generatedProjName}`}
                                                            className={`p-0.5 rounded-[3px] transition-colors shrink-0 ${
                                                                copiedId === projCopyId
                                                                    ? 'text-fluent-cat-green-fg'
                                                                    : 'text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-card'
                                                            }`}
                                                        >
                                                            {copiedId === projCopyId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* Section 2: Network Isolation & Managed VNet                   */}
                {/* ------------------------------------------------------------- */}
                <div className="rounded-lg border bg-fluent-bg-card border-fluent-stroke-subtle">
                    <button
                        type="button"
                        onClick={() => toggleSection('network')}
                        aria-expanded={expandedSection === 'network'}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2 bg-fluent-bg-subtle hover:bg-fluent-bg-hover transition-colors text-left ${
                            expandedSection === 'network' ? 'rounded-t-lg' : 'rounded-lg'
                        }`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <Network className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                            <span className="text-[13px] font-semibold text-fluent-fg-primary truncate">
                                2. Security & Network Isolation
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-secondary">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.networkMode === 'private' ? 'bg-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-fg'}`} />
                                <span>{config.networkMode === 'private' ? 'Zero-Trust Private' : 'Public'}</span>
                            </span>
                            <ChevronDown className={`w-4 h-4 text-fluent-fg-secondary transition-transform duration-200 ${expandedSection === 'network' ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {expandedSection === 'network' && (
                        <div className="p-3.5 sm:p-4 flex flex-col gap-3.5 animate-fade-in border-t border-fluent-stroke-subtle">
                            <div>
                                <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
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
                                    <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                        AI Hub Managed Virtual Network Mode
                                    </label>
                                    <FluentDropdown
                                        value={config.managedVnetMode}
                                        onChange={(val) => updateField('managedVnetMode', val)}
                                        options={MANAGED_VNET_OPTIONS}
                                    />
                                    <span className="text-[12px] text-fluent-fg-secondary mt-1 block">
                                        Managed VNets isolate compute instances, prompt flows, and training jobs inside an automated perimeter.
                                    </span>
                                </div>
                            )}

                            {/* Outbound FQDN Rules */}
                            {config.networkMode === 'private' && config.managedVnetMode === 'AllowOnlyApprovedOutbound' && (
                                <div className="pt-2.5 border-t border-fluent-stroke-subtle">
                                    <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                        Approved Outbound FQDN Categories
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        {FQDN_CATEGORIES.map(cat => {
                                            const checked = (config.allowedFqdns || []).includes(cat.id);
                                            return (
                                                <label
                                                    key={cat.id}
                                                    className="flex items-start gap-2.5 p-2.5 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover cursor-pointer transition-colors border border-fluent-stroke-subtle"
                                                >
                                                    <FluentCheckbox
                                                        checked={checked}
                                                        onChange={() => handleToggleFqdn(cat.id)}
                                                        className="mt-0.5"
                                                    />
                                                    <div className="flex flex-col text-[12px]">
                                                        <span className="font-medium text-fluent-fg-primary">{cat.label}</span>
                                                        <span className="text-fluent-fg-secondary">{cat.description}</span>
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
                <div className="rounded-lg border bg-fluent-bg-card border-fluent-stroke-subtle">
                    <button
                        type="button"
                        onClick={() => toggleSection('services')}
                        aria-expanded={expandedSection === 'services'}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2 bg-fluent-bg-subtle hover:bg-fluent-bg-hover transition-colors text-left ${
                            expandedSection === 'services' ? 'rounded-t-lg' : 'rounded-lg'
                        }`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <Cpu className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                            <span className="text-[13px] font-semibold text-fluent-fg-primary truncate">
                                3. Connected AI Services & Search
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-secondary">
                                <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                                <span>{config.enableOpenAi ? `${(config.modelDeployments || []).length} Models` : 'No OpenAI'}</span>
                            </span>
                            <ChevronDown className={`w-4 h-4 text-fluent-fg-secondary transition-transform duration-200 ${expandedSection === 'services' ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {expandedSection === 'services' && (
                        <div className="p-3.5 sm:p-4 flex flex-col gap-3.5 animate-fade-in border-t border-fluent-stroke-subtle">
                            {/* Azure OpenAI Toggle */}
                            <label className="flex items-center justify-between gap-3 p-2.5 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover border border-fluent-stroke-subtle cursor-pointer transition-colors">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <AzureServiceIcon resourceName="Azure OpenAI Service" category="AI + ML" className="w-5 h-5 shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[13px] font-semibold text-fluent-fg-primary">Azure AI Services / OpenAI</span>
                                        <span className="text-[12px] text-fluent-fg-secondary">Connect multi-service inference account with model deployments</span>
                                    </div>
                                </div>
                                <FluentCheckbox
                                    checked={Boolean(config.enableOpenAi)}
                                    onChange={(e) => updateField('enableOpenAi', e.target.checked)}
                                />
                            </label>

                            {/* Model Deployments Multi-select */}
                            {config.enableOpenAi && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] font-semibold text-fluent-fg-primary">
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
                                                    className={`p-2.5 rounded-[4px] border text-left flex flex-col gap-1 transition-all active:scale-95 ${
                                                        isSelected
                                                            ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text shadow-sm'
                                                            : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:bg-fluent-bg-hover'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between w-full gap-1.5">
                                                        <span className="text-[12px] font-semibold text-fluent-fg-primary truncate">{m.name}</span>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0" />}
                                                    </div>
                                                    <span className="text-[11px] text-fluent-fg-tertiary truncate">{m.description}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Azure AI Search Toggle */}
                            <label className="flex items-center justify-between gap-3 p-2.5 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover border border-fluent-stroke-subtle cursor-pointer transition-colors">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <AzureServiceIcon resourceName="Azure AI Search" category="AI + ML" className="w-5 h-5 shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[13px] font-semibold text-fluent-fg-primary">Azure AI Search (RAG Index)</span>
                                        <span className="text-[12px] text-fluent-fg-secondary">Dedicated vector store for semantic reranking and enterprise grounding</span>
                                    </div>
                                </div>
                                <FluentCheckbox
                                    checked={Boolean(config.enableAiSearch)}
                                    onChange={(e) => updateField('enableAiSearch', e.target.checked)}
                                />
                            </label>

                            {config.enableAiSearch && (
                                <div className="flex flex-col gap-3 pl-3 border-l-2 border-fluent-brand-bg">
                                    <div>
                                        <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                            Search Pricing Tier
                                        </label>
                                        <FluentDropdown
                                            value={config.searchSku}
                                            onChange={(val) => updateField('searchSku', val)}
                                            options={SEARCH_SKUS.map(s => ({ value: s.value, label: s.label }))}
                                        />
                                    </div>
                                    <label className="flex items-center gap-2.5 cursor-pointer text-[12px] text-fluent-fg-primary">
                                        <FluentCheckbox
                                            checked={Boolean(config.searchSemanticRanker)}
                                            onChange={(e) => updateField('searchSemanticRanker', e.target.checked)}
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
                <div className="rounded-lg border bg-fluent-bg-card border-fluent-stroke-subtle">
                    <button
                        type="button"
                        onClick={() => toggleSection('identity')}
                        aria-expanded={expandedSection === 'identity'}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2 bg-fluent-bg-subtle hover:bg-fluent-bg-hover transition-colors text-left ${
                            expandedSection === 'identity' ? 'rounded-t-lg' : 'rounded-lg'
                        }`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <ShieldCheck className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                            <span className="text-[13px] font-semibold text-fluent-fg-primary truncate">
                                4. Identity, Encryption & Governance
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-secondary">
                                <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-teal-fg shrink-0" />
                                <span>{config.identityType === 'UserAssigned' ? 'UAMI' : 'SAMI'}{config.enableCmk ? ' + CMK' : ''}</span>
                            </span>
                            <ChevronDown className={`w-4 h-4 text-fluent-fg-secondary transition-transform duration-200 ${expandedSection === 'identity' ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {expandedSection === 'identity' && (
                        <div className="p-3.5 sm:p-4 flex flex-col gap-3.5 animate-fade-in border-t border-fluent-stroke-subtle">
                            <div>
                                <label className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                    Managed Identity Architecture
                                </label>
                                <FluentDropdown
                                    value={config.identityType}
                                    onChange={(val) => updateField('identityType', val)}
                                    options={IDENTITY_OPTIONS}
                                />
                            </div>

                            <label className="flex items-start gap-2.5 p-2.5 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover cursor-pointer transition-colors border border-fluent-stroke-subtle">
                                <FluentCheckbox
                                    checked={Boolean(config.disableLocalAuth)}
                                    onChange={(e) => updateField('disableLocalAuth', e.target.checked)}
                                    className="mt-0.5"
                                />
                                <div className="flex flex-col text-[12px]">
                                    <span className="font-medium text-fluent-fg-primary">Disable Local Authentication (No API Keys)</span>
                                    <span className="text-fluent-fg-secondary">Enforces Microsoft Entra ID token-based access exclusively for OpenAI & Search</span>
                                </div>
                            </label>

                            <label className="flex items-start gap-2.5 p-2.5 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover cursor-pointer transition-colors border border-fluent-stroke-subtle">
                                <FluentCheckbox
                                    checked={Boolean(config.enableCmk)}
                                    onChange={(e) => updateField('enableCmk', e.target.checked)}
                                    className="mt-0.5"
                                />
                                <div className="flex flex-col text-[12px]">
                                    <span className="font-medium text-fluent-fg-primary">Customer-Managed Key (CMK) Encryption</span>
                                    <span className="text-fluent-fg-secondary">Enforces Key Vault HSM purge protection and double encryption for storage and workspace</span>
                                </div>
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-fluent-stroke-subtle">
                                <label className="flex items-center gap-2.5 p-2 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover border border-fluent-stroke-subtle cursor-pointer transition-colors text-[12px] font-medium text-fluent-fg-primary">
                                    <FluentCheckbox
                                        checked={Boolean(config.enableAppInsights)}
                                        onChange={(e) => updateField('enableAppInsights', e.target.checked)}
                                    />
                                    <AzureServiceIcon resourceName="Application Insights" category="Management + Governance" className="w-4 h-4 shrink-0" />
                                    <span className="truncate">Application Insights</span>
                                </label>

                                <label className="flex items-center gap-2.5 p-2 rounded-[4px] bg-fluent-bg-subtle hover:bg-fluent-bg-hover border border-fluent-stroke-subtle cursor-pointer transition-colors text-[12px] font-medium text-fluent-fg-primary">
                                    <FluentCheckbox
                                        checked={Boolean(config.enableContainerRegistry)}
                                        onChange={(e) => updateField('enableContainerRegistry', e.target.checked)}
                                    />
                                    <AzureServiceIcon resourceName="Container registry" category="Containers" className="w-4 h-4 shrink-0" />
                                    <span className="truncate">Container Registry (ACR)</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
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
