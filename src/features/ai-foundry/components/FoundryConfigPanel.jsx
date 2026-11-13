import { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import {
    Check,
    Copy,
    Plus,
    Trash2,
    ChevronUp,
    Sliders,
    Layers,
    Shield,
    Sparkles,
    KeyRound,
    Lock,
    Globe
} from 'lucide-react';
import { FluentDropdown, SearchableSelect, ResetButton } from '@shared';
import { AZURE_REGIONS, ENVIRONMENTS } from '@features/naming';
import { AVAILABLE_MODELS, SEARCH_SKUS, DEFAULT_CONFIG } from '../data/defaultServices';
import { FQDN_CATEGORIES } from '../data/fqdnAllowlists';
import { ARCHETYPE_PRESETS } from '../data/archetypes';
import { getFoundryResourceNames } from '../utils/foundryNaming';

const MANAGED_VNET_MODES = [
    { value: 'AllowOnlyApprovedOutbound', label: 'Allow Only Approved Outbound (Zero-Trust)' },
    { value: 'AllowInternetOutbound', label: 'Allow Internet Outbound (Permissive)' },
    { value: 'Disabled', label: 'Disabled (No Managed VNet Isolation)' }
];

function FluentCheckbox({ checked, onChange, label, description, badge, disabled = false, id }) {
    return (
        <label
            htmlFor={id}
            className={`flex items-start gap-2.5 p-2.5 rounded-[4px] border transition-colors select-none ${
                disabled
                    ? 'opacity-50 cursor-not-allowed bg-fluent-bg-subtle border-fluent-stroke-subtle'
                    : checked
                        ? 'bg-fluent-bg-subtle border-fluent-stroke-strong cursor-pointer'
                        : 'bg-fluent-bg-canvas border-fluent-stroke-subtle hover:border-fluent-stroke-strong cursor-pointer'
            }`}
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only"
            />
            <span
                aria-hidden="true"
                className={`mt-0.5 w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${
                    checked
                        ? 'bg-fluent-brand-bg border-fluent-brand-bg text-white'
                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-transparent'
                }`}
            >
                <Check className="w-3 h-3 stroke-[2.5]" />
            </span>
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-medium text-fluent-fg-primary leading-snug">
                        {label}
                    </span>
                    {badge && (
                        <span className="shrink-0 font-mono text-[10.5px] px-1.5 py-0.5 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-fg-secondary">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <span className="text-[11.5px] text-fluent-fg-secondary leading-snug mt-0.5">
                        {description}
                    </span>
                )}
            </div>
        </label>
    );
}

FluentCheckbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    badge: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string
};

function FoundryConfigPanel({
    config,
    onChangeConfig,
    onResetDefaults,
    activeArchetypeId = 'custom',
    onSelectArchetype,
    embedded = false,
    onMinimize
}) {
    const [copiedField, setCopiedField] = useState(null);

    const names = useMemo(() => getFoundryResourceNames(config), [config]);

    const searchSkuOptions = useMemo(() => {
        return SEARCH_SKUS.map((sku) => {
            if (typeof sku === 'string') {
                return { value: sku, label: sku };
            }
            const value = sku.value ?? sku.id;
            const label = sku.label ?? sku.name ?? value;
            return { value, label };
        });
    }, []);

    const archetypeDropdownOptions = useMemo(() => {
        return [
            ...ARCHETYPE_PRESETS.map((preset) => ({
                value: preset.id,
                label: preset.label
            })),
            ...(activeArchetypeId === 'custom'
                ? [{ value: 'custom', label: 'Custom Architecture' }]
                : [])
        ];
    }, [activeArchetypeId]);

    const updateField = (field, value) => {
        onChangeConfig((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNetworkModeChange = (mode) => {
        onChangeConfig((prev) => ({
            ...prev,
            networkMode: mode,
            managedVnetMode:
                mode === 'private' && prev.managedVnetMode === 'Disabled'
                    ? 'AllowOnlyApprovedOutbound'
                    : mode === 'public'
                        ? 'Disabled'
                        : prev.managedVnetMode
        }));
    };

    const handleStepInstance = (delta) => {
        const current = parseInt(config.instance || '001', 10);
        const safeNum = Number.isNaN(current) ? 1 : current;
        const nextNum = Math.min(999, Math.max(1, safeNum + delta));
        updateField('instance', String(nextNum).padStart(3, '0'));
    };

    const handleInstanceBlur = () => {
        const cleaned = String(config.instance || '').replace(/\D/g, '');
        const num = Math.min(999, Math.max(1, parseInt(cleaned || '1', 10)));
        updateField('instance', String(num).padStart(3, '0'));
    };

    const handleAddProject = () => {
        const projects = config.projects || [];
        if (projects.length >= 5) return;
        const nextIdx = projects.length + 1;
        updateField('projects', [
            ...projects,
            {
                id: `app${nextIdx}`,
                name: `AI Workload ${nextIdx}`,
                description: 'Isolated AI Foundry application project workspace'
            }
        ]);
    };

    const handleRemoveProject = (index) => {
        const projects = config.projects || [];
        if (projects.length <= 1) return;
        updateField(
            'projects',
            projects.filter((_, idx) => idx !== index)
        );
    };

    const handleProjectChange = (index, field, value) => {
        const projects = [...(config.projects || [])];
        const sanitized = field === 'id'
            ? value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)
            : value;
        projects[index] = {
            ...projects[index],
            [field]: sanitized
        };
        updateField('projects', projects);
    };

    const handleToggleFqdn = (fqdnId) => {
        const current = config.allowedFqdns || [];
        const exists = current.includes(fqdnId);
        updateField(
            'allowedFqdns',
            exists ? current.filter((id) => id !== fqdnId) : [...current, fqdnId]
        );
    };

    const handleToggleModel = (modelDef) => {
        const current = config.modelDeployments || [];
        const exists = current.some((m) => m.model === modelDef.id || m.name === modelDef.id);
        if (exists) {
            updateField(
                'modelDeployments',
                current.filter((m) => m.model !== modelDef.id && m.name !== modelDef.id)
            );
        } else {
            const sku = modelDef.skus?.includes('GlobalStandard')
                ? 'GlobalStandard'
                : (modelDef.skus?.[0] || 'Standard');
            updateField('modelDeployments', [
                ...current,
                {
                    name: modelDef.id,
                    model: modelDef.id,
                    version: modelDef.defaultVersion,
                    sku,
                    capacity: modelDef.defaultCapacity
                }
            ]);
        }
    };

    const handleCopyValue = async (value, fieldId) => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(fieldId);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    const isPrivate = config.networkMode === 'private';
    const activeDeployments = config.modelDeployments || [];
    const currentFqdns = config.allowedFqdns || [];
    const currentProjects = config.projects?.length ? config.projects : DEFAULT_CONFIG.projects;

    return (
        <div
            className={
                embedded
                    ? 'bg-fluent-bg-card flex flex-col w-full rounded-b-lg'
                    : 'bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft flex flex-col w-full'
            }
        >
            {/* Top Parameter Controls Header */}
            <div className="px-3.5 sm:px-4 py-2.5 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                    <div className="flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                        <span className="text-[13px] font-semibold text-fluent-fg-primary">
                            Configure Landing Zone Parameters
                        </span>
                    </div>
                    {onSelectArchetype && (
                        <div className="w-[220px] sm:w-[250px]">
                            <FluentDropdown
                                options={archetypeDropdownOptions}
                                value={activeArchetypeId}
                                onChange={(selectedId) => {
                                    const preset = ARCHETYPE_PRESETS.find((p) => p.id === selectedId);
                                    if (preset) onSelectArchetype(preset);
                                }}
                                size="compact"
                                ariaLabel="Select base CAF architecture archetype"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {onResetDefaults && (
                        <ResetButton
                            onClick={onResetDefaults}
                            variant="secondary"
                            title="Reset AI Foundry parameters to CAF Enterprise RAG defaults"
                        />
                    )}
                    {onMinimize && (
                        <button
                            type="button"
                            onClick={onMinimize}
                            className="px-3 h-[32px] rounded-[4px] border border-fluent-stroke-strong bg-fluent-bg-card text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary text-[13px] font-medium transition-colors inline-flex items-center justify-center gap-1.5 active:scale-95"
                        >
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Hide Parameters</span>
                        </button>
                    )}
                </div>
            </div>

            {/* 2x2 Flat Balanced Governance Pillars Grid */}
            <div className="p-3.5 sm:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-fluent-bg-canvas">
                {/* Card 1: Workspace Hierarchy & CAF Naming */}
                <div className="rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card p-3.5 shadow-soft flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-fluent-stroke-subtle">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                            <h3 className="text-[13.5px] font-semibold text-fluent-fg-primary">
                                1. Workspace Hierarchy &amp; CAF Naming
                            </h3>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-mono text-fluent-fg-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                            <span>{currentProjects.length} {currentProjects.length === 1 ? 'Project' : 'Projects'}</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Workload Slug */}
                        <div>
                            <label htmlFor="foundry-workload" className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                Workload Slug
                            </label>
                            <input
                                id="foundry-workload"
                                type="text"
                                maxLength={10}
                                value={config.workload || ''}
                                onChange={(e) =>
                                    updateField(
                                        'workload',
                                        e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)
                                    )
                                }
                                placeholder="e.g. coreai, bankai"
                                className="w-full px-3 h-[32px] border rounded-[4px] outline-none text-[13px] font-mono transition-all duration-200 focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                            />
                            <span className="text-[11.5px] text-fluent-fg-tertiary mt-1 block">
                                Lowercase alphanumeric, max 10 chars
                            </span>
                        </div>

                        {/* Environment */}
                        <div>
                            <span className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                Environment
                            </span>
                            <SearchableSelect
                                compact
                                label="Environment"
                                items={ENVIRONMENTS}
                                value={config.environment}
                                onChange={(val) => updateField('environment', val)}
                                placeholder="Search environment..."
                            />
                            <span className="text-[11.5px] text-fluent-fg-tertiary mt-1 block">
                                Used in CAF segment ordering
                            </span>
                        </div>

                        {/* Azure Region */}
                        <div>
                            <span className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                Azure Region
                            </span>
                            <SearchableSelect
                                compact
                                label="Azure Region"
                                items={AZURE_REGIONS}
                                value={config.region}
                                onChange={(val) => updateField('region', val)}
                                placeholder="Search Azure region..."
                            />
                        </div>

                        {/* Instance Stepper & Quick Select */}
                        <div>
                            <label htmlFor="foundry-instance" className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                                Instance Index
                            </label>
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center flex-1 min-w-0 h-[32px] border rounded-[4px] border-fluent-stroke-strong bg-fluent-bg-card overflow-hidden focus-within:border-fluent-brand-bg focus-within:ring-1 focus-within:ring-fluent-brand-bg">
                                    <button
                                        type="button"
                                        onClick={() => handleStepInstance(-1)}
                                        aria-label="Decrement instance number"
                                        className="h-full px-2.5 bg-fluent-bg-subtle hover:bg-fluent-bg-hover border-r border-fluent-stroke-subtle text-[13px] font-semibold text-fluent-fg-secondary hover:text-fluent-fg-primary transition-colors"
                                    >
                                        -
                                    </button>
                                    <input
                                        id="foundry-instance"
                                        type="text"
                                        maxLength={3}
                                        value={config.instance || '001'}
                                        onChange={(e) => updateField('instance', e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        onBlur={handleInstanceBlur}
                                        className="flex-1 min-w-0 h-full px-2 text-center font-mono text-[13px] bg-transparent text-fluent-fg-primary outline-none border-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleStepInstance(1)}
                                        aria-label="Increment instance number"
                                        className="h-full px-2.5 bg-fluent-bg-subtle hover:bg-fluent-bg-hover border-l border-fluent-stroke-subtle text-[13px] font-semibold text-fluent-fg-secondary hover:text-fluent-fg-primary transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                {['001', '002'].map((presetInst) => (
                                    <button
                                        key={presetInst}
                                        type="button"
                                        onClick={() => updateField('instance', presetInst)}
                                        className={`h-[26px] px-2 rounded-[4px] border font-mono text-[11.5px] transition-colors shrink-0 ${
                                            config.instance === presetInst
                                                ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text font-semibold'
                                                : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong'
                                        }`}
                                    >
                                        {presetInst}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Child AI Foundry Projects */}
                    <div className="pt-2 border-t border-fluent-stroke-subtle flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[12.5px] font-semibold text-fluent-fg-primary">
                                Child AI Foundry Projects (<code className="font-mono text-[11.5px]">proj-*</code>)
                            </span>
                            <button
                                type="button"
                                onClick={handleAddProject}
                                disabled={currentProjects.length >= 5}
                                className="h-[26px] px-2.5 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card hover:border-fluent-stroke-strong text-[12px] font-medium text-fluent-fg-secondary hover:text-fluent-fg-primary transition-all inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                            >
                                <Plus className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <span>Add Project</span>
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            {currentProjects.map((project, idx) => {
                                const generatedProj = names.projects?.[idx]?.generatedName;
                                return (
                                    <div
                                        key={idx}
                                        className="p-2 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-subtle flex flex-col gap-1.5"
                                    >
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                                            <input
                                                type="text"
                                                value={project.id}
                                                maxLength={10}
                                                onChange={(e) => handleProjectChange(idx, 'id', e.target.value)}
                                                placeholder="slug"
                                                aria-label={`Project ${idx + 1} slug`}
                                                className="w-full sm:w-28 px-2.5 h-[30px] border rounded-[4px] outline-none font-mono text-[12px] bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong focus:border-fluent-brand-bg"
                                            />
                                            <input
                                                type="text"
                                                value={project.name}
                                                onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                                                placeholder="Display Name"
                                                aria-label={`Project ${idx + 1} display name`}
                                                className="flex-1 min-w-0 px-2.5 h-[30px] border rounded-[4px] outline-none text-[12.5px] bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong focus:border-fluent-brand-bg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProject(idx)}
                                                disabled={currentProjects.length <= 1}
                                                title="Remove project"
                                                aria-label={`Remove project ${project.name || idx + 1}`}
                                                className="shrink-0 h-[30px] w-[30px] rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-state-danger transition-colors inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        {generatedProj && (
                                            <span className="text-[11px] font-mono text-fluent-fg-tertiary truncate">
                                                Resource: {generatedProj}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Card 2: Security & Network Isolation */}
                <div className="rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card p-3.5 shadow-soft flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-fluent-stroke-subtle">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                            <h3 className="text-[13.5px] font-semibold text-fluent-fg-primary">
                                2. Security &amp; Network Isolation
                            </h3>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-primary">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPrivate ? 'bg-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-fg'}`} />
                            <span>{isPrivate ? 'Zero-Trust PE' : 'Public Dev'}</span>
                        </span>
                    </div>

                    {/* Network Mode Switcher */}
                    <div>
                        <span className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                            Network Perimeter Mode
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleNetworkModeChange('private')}
                                className={`h-[32px] px-3 rounded-[4px] border text-[12.5px] font-medium transition-all inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                    isPrivate
                                        ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text font-semibold shadow-xs'
                                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                }`}
                            >
                                <Lock className="w-3.5 h-3.5 shrink-0" />
                                <span>Private Link (PE)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNetworkModeChange('public')}
                                className={`h-[32px] px-3 rounded-[4px] border text-[12.5px] font-medium transition-all inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                    !isPrivate
                                        ? 'bg-fluent-cat-yellow-bg border-fluent-stroke-strong text-fluent-cat-yellow-fg font-semibold shadow-xs'
                                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                }`}
                            >
                                <Globe className="w-3.5 h-3.5 shrink-0" />
                                <span>Public (Sandbox)</span>
                            </button>
                        </div>
                    </div>

                    {/* Managed VNet Outbound */}
                    <div>
                        <span className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                            Managed VNet Egress Mode
                        </span>
                        <FluentDropdown
                            options={MANAGED_VNET_MODES}
                            value={config.managedVnetMode || 'AllowOnlyApprovedOutbound'}
                            onChange={(val) => updateField('managedVnetMode', val)}
                            ariaLabel="Managed VNet Egress Mode"
                        />
                    </div>

                    {/* Entra ID Local Auth Toggle */}
                    <FluentCheckbox
                        id="foundry-disable-local-auth"
                        checked={Boolean(config.disableLocalAuth)}
                        onChange={(val) => updateField('disableLocalAuth', val)}
                        label="Disable Local Auth (Entra ID Tokens Only)"
                        description="Enforces Microsoft Entra ID RBAC across OpenAI, Search, and Storage."
                        badge="SEC-03"
                    />

                    {/* Approved Outbound FQDNs */}
                    <div className="pt-2 border-t border-fluent-stroke-subtle flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[12.5px] font-semibold text-fluent-fg-primary">
                                Approved Outbound FQDN Allowlist
                            </span>
                            <span className="text-[11px] font-mono text-fluent-fg-tertiary">
                                {currentFqdns.length}/{FQDN_CATEGORIES.length} enabled
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {FQDN_CATEGORIES.map((cat) => (
                                <FluentCheckbox
                                    key={cat.id}
                                    id={`foundry-fqdn-${cat.id}`}
                                    checked={currentFqdns.includes(cat.id)}
                                    disabled={config.managedVnetMode === 'Disabled'}
                                    onChange={() => handleToggleFqdn(cat.id)}
                                    label={cat.label}
                                    badge={`${cat.endpoints.length} hosts`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card 3: Connected AI Services & RAG Search */}
                <div className="rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card p-3.5 shadow-soft flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-fluent-stroke-subtle">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                            <h3 className="text-[13.5px] font-semibold text-fluent-fg-primary">
                                3. Connected AI Services &amp; RAG Search
                            </h3>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-mono text-fluent-fg-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-blue-fg shrink-0" />
                            <span>{config.enableOpenAi ? `${activeDeployments.length} Models` : 'No OpenAI'}</span>
                        </span>
                    </div>

                    {/* Azure OpenAI Connection & Model Deployments */}
                    <div className="flex flex-col gap-2">
                        <FluentCheckbox
                            id="foundry-enable-openai"
                            checked={Boolean(config.enableOpenAi)}
                            onChange={(val) => updateField('enableOpenAi', val)}
                            label="Provision Connected Azure OpenAI (AIServices)"
                            description="Shared Hub connection with Private Endpoint & RBAC credentialing."
                        />

                        {config.enableOpenAi && (
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[12px] font-semibold text-fluent-fg-secondary">
                                    Model Deployments ({activeDeployments.length} selected)
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {AVAILABLE_MODELS.map((modelDef) => {
                                        const isSelected = activeDeployments.some(
                                            (m) => m.model === modelDef.id || m.name === modelDef.id
                                        );
                                        return (
                                            <button
                                                key={modelDef.id}
                                                type="button"
                                                onClick={() => handleToggleModel(modelDef)}
                                                aria-pressed={isSelected}
                                                className={`px-2.5 py-2 rounded-[4px] border text-left transition-all flex items-center justify-between gap-2 active:scale-[0.98] ${
                                                    isSelected
                                                        ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text font-medium'
                                                        : 'bg-fluent-bg-canvas border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                                                }`}
                                            >
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span
                                                        className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0 ${
                                                            isSelected
                                                                ? 'bg-fluent-brand-bg border-fluent-brand-bg text-white'
                                                                : 'bg-fluent-bg-card border-fluent-stroke-strong text-transparent'
                                                        }`}
                                                    >
                                                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                                    </span>
                                                    <span className="font-mono text-[12px] truncate">
                                                        {modelDef.label || modelDef.name || modelDef.id}
                                                    </span>
                                                </div>
                                                <span className="text-[10.5px] font-mono text-fluent-fg-tertiary shrink-0">
                                                    {modelDef.defaultCapacity}K
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Azure AI Search Connection */}
                    <div className="pt-2 border-t border-fluent-stroke-subtle flex flex-col gap-2">
                        <FluentCheckbox
                            id="foundry-enable-search"
                            checked={Boolean(config.enableAiSearch)}
                            onChange={(val) => updateField('enableAiSearch', val)}
                            label="Provision Azure AI Search (RAG Vector Store)"
                            description="Hybrid keyword + vector indexing attached cleanly to the Hub."
                        />

                        {config.enableAiSearch && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end">
                                <div>
                                    <span className="text-[12px] font-semibold text-fluent-fg-primary mb-1 block">
                                        Search Pricing Tier
                                    </span>
                                    <FluentDropdown
                                        options={searchSkuOptions}
                                        value={config.searchSku || 'standard'}
                                        onChange={(val) => updateField('searchSku', val)}
                                        ariaLabel="Azure AI Search SKU"
                                    />
                                </div>
                                <FluentCheckbox
                                    id="foundry-semantic-ranker"
                                    checked={Boolean(config.searchSemanticRanker)}
                                    onChange={(val) => updateField('searchSemanticRanker', val)}
                                    label="Semantic Ranker"
                                    badge="L2 Rerank"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 4: Identity, Encryption & Observability */}
                <div className="rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card p-3.5 shadow-soft flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-fluent-stroke-subtle">
                        <div className="flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                            <h3 className="text-[13.5px] font-semibold text-fluent-fg-primary">
                                4. Identity, Encryption &amp; Observability
                            </h3>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-mono text-fluent-fg-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-teal-fg shrink-0" />
                            <span>{config.identityType === 'UserAssigned' ? 'UAMI' : 'SAMI'}</span>
                        </span>
                    </div>

                    {/* Identity Architecture Selector */}
                    <div>
                        <span className="text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block">
                            Managed Identity Architecture
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => updateField('identityType', 'UserAssigned')}
                                className={`h-[32px] px-3 rounded-[4px] border text-[12.5px] font-medium transition-all inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                    config.identityType === 'UserAssigned'
                                        ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text font-semibold shadow-xs'
                                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                }`}
                            >
                                <span>User-Assigned (UAMI)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => updateField('identityType', 'SystemAssigned')}
                                className={`h-[32px] px-3 rounded-[4px] border text-[12.5px] font-medium transition-all inline-flex items-center justify-center gap-1.5 active:scale-95 ${
                                    config.identityType === 'SystemAssigned'
                                        ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text font-semibold shadow-xs'
                                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                }`}
                            >
                                <span>System-Assigned (SAMI)</span>
                            </button>
                        </div>
                        <span className="text-[11.5px] text-fluent-fg-tertiary mt-1 block">
                            User-Assigned decouples Key Vault / OpenAI RBAC grants from Hub lifecycle.
                        </span>
                    </div>

                    {/* Compliance & Platform Add-ons */}
                    <div className="flex flex-col gap-2">
                        <FluentCheckbox
                            id="foundry-enable-cmk"
                            checked={Boolean(config.enableCmk)}
                            onChange={(val) => updateField('enableCmk', val)}
                            label="Customer-Managed Keys (CMK / BYOK)"
                            description="Encrypts Hub metadata, Storage, and AI Search using Key Vault RSA keys."
                            badge="SEC-05"
                        />

                        <FluentCheckbox
                            id="foundry-enable-appinsights"
                            checked={Boolean(config.enableAppInsights)}
                            onChange={(val) => updateField('enableAppInsights', val)}
                            label="Application Insights & Log Analytics Workspace"
                            description="Records prompt telemetry, token quotas, and diagnostic audit trails."
                            badge="SEC-06"
                        />

                        <FluentCheckbox
                            id="foundry-enable-acr"
                            checked={Boolean(config.enableContainerRegistry)}
                            onChange={(val) => updateField('enableContainerRegistry', val)}
                            label="Azure Container Registry (ACR)"
                            description="Private registry for Prompt Flow images and autonomous multi-agent runtimes."
                            badge="cr*"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Dual Live CAF Preview Strip */}
            <div className="px-3.5 sm:px-4 py-2.5 border-t border-fluent-stroke-subtle bg-fluent-bg-subtle rounded-b-lg flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                    {/* Hub Name Preview Box */}
                    <div className="flex items-center gap-2 px-3 py-1.5 min-h-[32px] rounded-[4px] border bg-fluent-bg-canvas border-fluent-stroke-subtle max-w-full">
                        <span className="text-[11.5px] text-fluent-fg-tertiary shrink-0">Hub (CAF):</span>
                        <span className="font-mono text-[13px] font-semibold text-fluent-fg-primary truncate select-all" title={names.hubName}>
                            {names.hubName}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleCopyValue(names.hubName, 'hub')}
                            className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1 border active:scale-95 ${
                                copiedField === 'hub'
                                    ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                    : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                            }`}
                        >
                            {copiedField === 'hub' ? <><Check className="w-3.5 h-3.5" /><span>Copied</span></> : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>}
                        </button>
                    </div>

                    {/* Resource Group Preview Box */}
                    <div className="flex items-center gap-2 px-3 py-1.5 min-h-[32px] rounded-[4px] border bg-fluent-bg-canvas border-fluent-stroke-subtle max-w-full">
                        <span className="text-[11.5px] text-fluent-fg-tertiary shrink-0">Resource Group:</span>
                        <span className="font-mono text-[13px] font-semibold text-fluent-fg-primary truncate select-all" title={names.rgName}>
                            {names.rgName}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleCopyValue(names.rgName, 'rg')}
                            className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1 border active:scale-95 ${
                                copiedField === 'rg'
                                    ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                    : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                            }`}
                        >
                            {copiedField === 'rg' ? <><Check className="w-3.5 h-3.5" /><span>Copied</span></> : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>}
                        </button>
                    </div>
                </div>

                <span className="hidden xl:inline-flex items-center font-mono text-[11px] text-fluent-fg-secondary px-2.5 py-1 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle shrink-0">
                    {`hub-{workload}-{env}-{region}-{instance}`}
                </span>
            </div>
        </div>
    );
}

FoundryConfigPanel.propTypes = {
    config: PropTypes.object.isRequired,
    onChangeConfig: PropTypes.func.isRequired,
    onResetDefaults: PropTypes.func,
    activeArchetypeId: PropTypes.string,
    onSelectArchetype: PropTypes.func,
    embedded: PropTypes.bool,
    onMinimize: PropTypes.func
};

export default memo(FoundryConfigPanel);
