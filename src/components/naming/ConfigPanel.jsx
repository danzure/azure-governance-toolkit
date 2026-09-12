import { useState, useMemo, memo, useCallback } from 'react';
import { 
    Sliders, 
    Edit3, 
    Eye, 
    ArrowLeft, 
    ArrowRight, 
    Copy, 
    Check, 
    Layers, 
    Sparkles, 
    ExternalLink, 
    Plus, 
    Minus, 
    X,
    ChevronUp,
    Globe
} from 'lucide-react';
import SearchableSelect from '../shared/SearchableSelect';
import ResetButton from '../shared/ResetButton';
import TechnologyIcon from '../shared/TechnologyIcon';
import { AZURE_REGIONS, ENVIRONMENTS, NAMING_PRESETS } from '../../data/constants';
import PropTypes from 'prop-types';

/**
 * Quick environment selector pills for the top enterprise stages
 */
const QUICK_ENVIRONMENTS = [
    { label: 'Prod', value: 'prod' },
    { label: 'Dev', value: 'dev' },
    { label: 'Test', value: 'test' },
    { label: 'UAT', value: 'uat' },
    { label: 'Staging', value: 'stg' }
];

/**
 * Semantic token color schemes for pattern segments & form indicators
 */
const SEGMENT_METADATA = {
    Resource: {
        label: 'Resource',
        bg: 'bg-fluent-cat-blue-bg',
        fg: 'text-fluent-cat-blue-fg',
        dot: 'bg-fluent-cat-blue-fg',
        description: 'Azure resource abbreviation (e.g. rg, vnet, kv)'
    },
    Workload: {
        label: 'Workload',
        bg: 'bg-fluent-cat-purple-bg',
        fg: 'text-fluent-cat-purple-fg',
        dot: 'bg-fluent-cat-purple-fg',
        description: 'Application, solution, or business workload identifier'
    },
    Environment: {
        label: 'Environment',
        bg: 'bg-fluent-cat-green-bg',
        fg: 'text-fluent-cat-green-fg',
        dot: 'bg-fluent-cat-green-fg',
        description: 'Deployment lifecycle stage (prod, dev, test)'
    },
    Region: {
        label: 'Region',
        bg: 'bg-fluent-cat-orange-bg',
        fg: 'text-fluent-cat-orange-fg',
        dot: 'bg-fluent-cat-orange-fg',
        description: 'Azure datacenter region abbreviation (e.g. uks, eus)'
    },
    Instance: {
        label: 'Instance',
        bg: 'bg-fluent-cat-cyan-bg',
        fg: 'text-fluent-cat-cyan-fg',
        dot: 'bg-fluent-cat-cyan-fg',
        description: 'Three-digit numeric deployment index (001-999)'
    },
    Org: {
        label: 'Org Prefix',
        bg: 'bg-fluent-cat-neutral-bg',
        fg: 'text-fluent-cat-neutral-fg',
        dot: 'bg-fluent-cat-neutral-fg',
        description: 'Optional organization or tenant prefix identifier'
    }
};

/**
 * Sample resources to demonstrate real-world CAF names in the live preview
 */
const SAMPLE_RESOURCES = [
    { 
        id: 'rg', 
        name: 'Resource group', 
        abbrev: 'rg', 
        chars: 'a-z, A-Z, 0-9, -, _, (), .',
        notes: 'Hyphenated standard'
    },
    { 
        id: 'st', 
        name: 'Storage account', 
        abbrev: 'st', 
        chars: 'a-z, 0-9',
        notes: 'Alphanumeric only (no hyphens)'
    },
    { 
        id: 'kv', 
        name: 'Key Vault', 
        abbrev: 'kv', 
        chars: 'a-z, A-Z, 0-9, -',
        notes: 'Global DNS unique'
    },
    { 
        id: 'vnet', 
        name: 'Virtual network', 
        abbrev: 'vnet', 
        chars: 'a-z, A-Z, 0-9, -, _, .',
        notes: 'Network boundary'
    }
];

/**
 * Configuration Panel Component
 * 
 * Displays the refined configuration form for defining resource naming parameters:
 * - Fluent 2 structured grid: Workload & Identity vs Deployment & Geography
 * - Quick environment preset pills & instance numeric steppers
 * - Interactive Pattern Builder with semantic token color-coding and 1-click presets
 * - Dual Live Preview: Real-time CAF Token Schema & Sample Resource Output
 */
function ConfigPanel({
    workload,
    setWorkload,
    envValue,
    setEnvValue,
    regionValue,
    setRegionValue,
    instance,
    onInstanceChange,
    setInstance,
    orgPrefix,
    setOrgPrefix,
    showOrg,
    setShowOrg,
    namingOrder,
    setNamingOrder,
    onMoveItem,
    liveSchemaStr,
    copiedId,
    onCopy,
    onResetDefaults,
    generateName,
    onToggleMinimize
}) {
    const [selectedSampleId, setSelectedSampleId] = useState('rg');
    const [sampleCopied, setSampleCopied] = useState(false);

    // Active sample resource
    const selectedSample = useMemo(() => {
        return SAMPLE_RESOURCES.find(s => s.id === selectedSampleId) || SAMPLE_RESOURCES[0];
    }, [selectedSampleId]);

    // Generate real-time sample name for the selected resource
    const sampleResourceName = useMemo(() => {
        if (!generateName) return '';
        return generateName(selectedSample);
    }, [generateName, selectedSample]);

    // Instance stepper handlers
    const handleInstanceStep = useCallback((step) => {
        const currentVal = parseInt(instance || '1', 10);
        const nextVal = Math.min(999, Math.max(1, (isNaN(currentVal) ? 1 : currentVal) + step));
        const formatted = String(nextVal).padStart(3, '0');
        if (setInstance) {
            setInstance(formatted);
        } else if (onInstanceChange) {
            onInstanceChange({ target: { value: formatted } });
        }
    }, [instance, setInstance, onInstanceChange]);

    const handleSetInstanceQuick = useCallback((numStr) => {
        if (setInstance) {
            setInstance(numStr);
        } else if (onInstanceChange) {
            onInstanceChange({ target: { value: numStr } });
        }
    }, [setInstance, onInstanceChange]);

    // Apply preset pattern
    const handleApplyPreset = useCallback((preset) => {
        if (setNamingOrder) {
            setNamingOrder(preset.order);
        }
        if (preset.requiresOrg) {
            setShowOrg(true);
        } else if (preset.disableOrg || preset.id === 'caf-default') {
            setShowOrg(false);
        }
    }, [setNamingOrder, setShowOrg]);

    // Copy sample name
    const handleCopySample = useCallback(async () => {
        if (!sampleResourceName) return;
        try {
            await navigator.clipboard.writeText(sampleResourceName);
            setSampleCopied(true);
            setTimeout(() => setSampleCopied(false), 2000);
        } catch (err) {
            console.error('Copy sample failed', err);
        }
    }, [sampleResourceName]);

    return (
        <div className="relative z-40 animate-slide-up bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft flex flex-col overflow-hidden">
            
            {/* Header: Edge-to-edge Fluent 2 card header */}
            <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-fluent-stroke-subtle bg-fluent-bg-card">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-fluent-info-bg text-fluent-brand-fg shrink-0">
                        <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-[15px] sm:text-[16px] font-semibold text-fluent-fg-primary leading-snug">
                            Naming Parameters & Pattern Builder
                        </h3>
                        <p className="text-[12px] text-fluent-fg-secondary">
                            Configure core naming tokens, segment ordering, and conventions aligned with Microsoft Cloud Adoption Framework (CAF)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
                    <ResetButton
                        onClick={onResetDefaults}
                        title="Reset to default CAF naming configuration"
                    >
                        Reset Defaults
                    </ResetButton>
                    {onToggleMinimize && (
                        <button
                            type="button"
                            onClick={onToggleMinimize}
                            title="Collapse configuration panel"
                            className="px-3 h-[32px] rounded-[4px] border transition-all duration-200 ease-in-out active:scale-95 inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium"
                        >
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Hide Parameters</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Form Body: Balanced Two-Column Functional Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 bg-fluent-bg-card">
                
                {/* Column 1: Workload & Identity */}
                <div className="flex flex-col bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-lg p-4 sm:p-4.5 gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-fluent-stroke-subtle">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-fluent-info-bg text-fluent-brand-fg shrink-0">
                            <Edit3 className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-[13px] font-semibold text-fluent-fg-primary">
                            Workload & Identifiers
                        </h4>
                    </div>

                    {/* Field: Organization Prefix with Integrated Toggle Switch */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="param-org-input" className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-fluent-cat-neutral-fg" title="Org token" />
                            Organization Prefix
                        </label>
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="relative flex-1 min-w-0 flex items-center">
                                <input
                                    id="param-org-input"
                                    type="text"
                                    value={orgPrefix}
                                    onChange={(e) => setOrgPrefix(e.target.value)}
                                    placeholder={showOrg ? 'e.g. contoso, az, msft' : 'Disabled — click toggle to enable'}
                                    disabled={!showOrg}
                                    maxLength={10}
                                    className={`flex-1 min-w-0 w-full px-3 h-[32px] pr-8 border rounded-[4px] outline-none text-[13px] transition-all duration-200 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary ${!showOrg ? 'opacity-40 cursor-not-allowed bg-fluent-bg-subtle' : 'focus:border-fluent-brand-bg'}`}
                                />
                                {showOrg && orgPrefix && (
                                    <button
                                        type="button"
                                        onClick={() => setOrgPrefix('')}
                                        title="Clear organization prefix"
                                        aria-label="Clear organization prefix"
                                        className="absolute right-2 w-5 h-5 flex items-center justify-center rounded-sm text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowOrg(!showOrg)}
                                className={`h-[32px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all duration-200 ease-in-out active:scale-95 flex items-center gap-1.5 border shrink-0 ${showOrg
                                    ? 'bg-fluent-brand-bg text-white border-fluent-brand-bg shadow-xs'
                                    : 'bg-fluent-bg-card text-fluent-fg-secondary border-fluent-stroke-strong hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                }`}
                                title={showOrg ? 'Disable Organization Prefix' : 'Enable Organization Prefix'}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${showOrg ? 'bg-white' : 'bg-fluent-fg-tertiary'}`} />
                                <span>
                                    {showOrg ? 'Enabled' : (
                                        <>
                                            <span className="hidden sm:inline">Optional (Disabled)</span>
                                            <span className="sm:hidden">Disabled</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Leading organization or business unit identifier for multi-tenant or enterprise environments.
                        </span>
                    </div>

                    {/* Field: Workload Name */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="param-workload-input" className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-fluent-cat-purple-fg" title="Workload token" />
                                Workload Name
                            </label>
                            <span className="text-[11px] text-fluent-fg-tertiary">Application / Service</span>
                        </div>
                        <div className="relative flex items-center w-full">
                            <input
                                id="param-workload-input"
                                type="text"
                                value={workload}
                                onChange={(e) => setWorkload(e.target.value)}
                                placeholder="e.g. webapp, corehub, analytics"
                                className="flex-1 min-w-0 w-full px-3 h-[32px] pr-8 border rounded outline-none text-[13px] transition-all duration-200 focus:border-fluent-brand-bg bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                            />
                            {workload && (
                                <button
                                    type="button"
                                    onClick={() => setWorkload('')}
                                    title="Clear workload"
                                    aria-label="Clear workload"
                                    className="absolute right-2 w-5 h-5 flex items-center justify-center rounded-sm text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Name of the workload or service. Alphanumeric characters only.
                        </span>
                    </div>

                    {/* Field: Environment with Quick Preset Pills */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-fluent-cat-green-fg" title="Environment token" />
                                Environment
                            </label>
                            <span className="text-[11px] text-fluent-fg-tertiary">Lifecycle Stage</span>
                        </div>
                        
                        {/* Searchable Select for all environments */}
                        <div className="w-full">
                            <SearchableSelect 
                                items={ENVIRONMENTS} 
                                value={envValue} 
                                onChange={setEnvValue} 
                                placeholder="Select environment..."
                                compact 
                            />
                        </div>

                        {/* Quick-select Environment Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            {QUICK_ENVIRONMENTS.map(item => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setEnvValue(item.value)}
                                    className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium border transition-all duration-200 ease-in-out active:scale-95 ${envValue === item.value
                                        ? 'bg-fluent-brand-bg text-white border-fluent-brand-bg font-semibold'
                                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Specifies the operational lifecycle tier (Production, Development, Test, etc.).
                        </span>
                    </div>
                </div>

                {/* Column 2: Scope & Geography */}
                <div className="flex flex-col bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-lg p-4 sm:p-4.5 gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-fluent-stroke-subtle">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-fluent-info-bg text-fluent-brand-fg shrink-0">
                            <Globe className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-[13px] font-semibold text-fluent-fg-primary">
                            Deployment & Geography
                        </h4>
                    </div>

                    {/* Field: Azure Region & Datacentre Map Link */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-fluent-cat-orange-fg" title="Region token" />
                            Azure Region
                        </label>

                        <div className="flex items-center gap-2 min-w-0">
                            <div className="flex-1 min-w-0">
                                <SearchableSelect 
                                    items={AZURE_REGIONS} 
                                    value={regionValue} 
                                    onChange={setRegionValue} 
                                    placeholder="Select region..." 
                                    compact 
                                />
                            </div>
                            <a
                                href="https://datacenters.microsoft.com/globe/explore/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Explore Microsoft Cloud Datacenters Map"
                                className="h-[32px] px-2.5 rounded-[4px] border transition-all duration-200 ease-in-out active:scale-95 shrink-0 inline-flex items-center gap-1.5 no-underline bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary"
                            >
                                <TechnologyIcon name="microsoft" className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-[12px] font-medium hidden sm:inline">Datacentre Map</span>
                                <ExternalLink className="w-3 h-3 text-fluent-fg-tertiary" />
                            </a>
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Target deployment geography. Injects the standardized CAF regional abbreviation into resource names.
                        </span>
                    </div>

                    {/* Field: Instance Stepper & Quick-Fill */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="param-instance-input" className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-fluent-cat-cyan-fg" title="Instance token" />
                            <span>Instance Number</span>
                            <span className="text-[11px] font-normal text-fluent-fg-tertiary">(001 - 999)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            {/* Stepper Input */}
                            <div className="flex items-center h-[32px] border border-fluent-stroke-strong rounded bg-fluent-bg-card overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => handleInstanceStep(-1)}
                                    title="Decrement instance number"
                                    aria-label="Decrement instance number"
                                    className="w-8 h-full flex items-center justify-center text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border-r border-fluent-stroke-subtle transition-colors active:scale-95"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <input
                                    id="param-instance-input"
                                    type="text"
                                    value={instance}
                                    onChange={onInstanceChange}
                                    maxLength={3}
                                    placeholder="001"
                                    className="w-16 h-full text-center font-mono text-[13px] font-semibold outline-none bg-transparent text-fluent-fg-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleInstanceStep(1)}
                                    title="Increment instance number"
                                    aria-label="Increment instance number"
                                    className="w-8 h-full flex items-center justify-center text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border-l border-fluent-stroke-subtle transition-colors active:scale-95"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Quick Instance Pills */}
                            <div className="flex items-center gap-1">
                                {['001', '002', '003'].map(presetNum => (
                                    <button
                                        key={presetNum}
                                        type="button"
                                        onClick={() => handleSetInstanceQuick(presetNum)}
                                        className={`h-[32px] px-2.5 rounded-[4px] text-[12px] font-mono font-medium border transition-all duration-200 ease-in-out active:scale-95 ${instance === presetNum
                                            ? 'bg-fluent-brand-bg text-white border-fluent-brand-bg font-semibold'
                                            : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                        }`}
                                    >
                                        {presetNum}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Sequential deployment index, automatically zero-padded to 3 digits per CAF guidance.
                        </span>
                    </div>
                </div>
            </div>

            {/* Pattern Builder & Segment Reordering Section */}
            <div className="border-t border-fluent-stroke-subtle p-4 sm:p-5 flex flex-col gap-3.5 bg-fluent-bg-subtle">
                
                {/* Header & Presets Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-fluent-brand-fg" />
                        <div>
                            <h4 className="text-[13px] font-semibold text-fluent-fg-primary leading-snug">
                                Pattern Builder & Segment Ordering
                            </h4>
                            <p className="text-[11px] text-fluent-fg-secondary">
                                Reorder tokens to customize schema structure or select a standard enterprise preset
                            </p>
                        </div>
                    </div>

                    {/* Presets Quick Selector */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-fluent-fg-tertiary mr-1">Presets:</span>
                        {NAMING_PRESETS.map(preset => (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleApplyPreset(preset)}
                                title={preset.shortDesc}
                                className="px-2 py-1 rounded-[4px] text-[11px] font-medium border transition-all duration-200 ease-in-out active:scale-95 bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Segment Chips Bar */}
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
                    {namingOrder.map((item, index) => {
                        const meta = SEGMENT_METADATA[item] || {
                            label: item,
                            bg: 'bg-fluent-bg-card',
                            fg: 'text-fluent-fg-primary',
                            dot: 'bg-fluent-fg-tertiary',
                            description: ''
                        };
                        const isOrgDisabled = item === 'Org' && !showOrg;

                        return (
                            <div
                                key={item}
                                className={`flex items-center gap-2 pl-2 pr-1.5 h-[34px] rounded-[4px] border transition-all shadow-xs ${meta.bg} ${meta.fg} border-fluent-stroke-subtle ${isOrgDisabled ? 'opacity-40 border-dashed' : ''}`}
                                title={meta.description}
                            >
                                {/* Position Index badge */}
                                <span className="w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold shrink-0 bg-fluent-bg-card text-fluent-fg-primary shadow-xs">
                                    {index + 1}
                                </span>

                                {/* Token Label */}
                                <span className="text-[12px] font-semibold select-none flex items-center gap-1.5">
                                    {meta.label}
                                    {isOrgDisabled && (
                                        <span className="text-[10px] font-normal opacity-75">(Off)</span>
                                    )}
                                </span>

                                {/* Tactile Reorder Arrows */}
                                <div className="flex items-center gap-0.5 border-l border-fluent-stroke-subtle pl-1">
                                    <button
                                        type="button"
                                        onClick={() => onMoveItem(index, -1)}
                                        disabled={index === 0}
                                        aria-label={`Move ${meta.label} left`}
                                        title={`Move ${meta.label} left`}
                                        className="w-[22px] h-[22px] flex items-center justify-center rounded-[2px] transition-colors disabled:opacity-20 text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-card active:scale-95"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onMoveItem(index, 1)}
                                        disabled={index === namingOrder.length - 1}
                                        aria-label={`Move ${meta.label} right`}
                                        title={`Move ${meta.label} right`}
                                        className="w-[22px] h-[22px] flex items-center justify-center rounded-[2px] transition-colors disabled:opacity-20 text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-card active:scale-95"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dual Live Preview Strip: Tokenized Schema + Real-world Sample Preview */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pt-1">
                    
                    {/* Preview 1: Live Token Schema */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border border-fluent-stroke-subtle bg-fluent-bg-card rounded-lg shadow-soft">
                        <div className="flex items-center gap-2 shrink-0">
                            <Eye className="w-4 h-4 text-fluent-brand-fg" />
                            <span className="text-[12px] font-semibold text-fluent-fg-secondary">Live CAF Schema:</span>
                        </div>
                        <div className="flex flex-1 items-center gap-2 min-w-0">
                            <div className="flex-1 h-[32px] px-3 flex items-center rounded font-mono text-[13px] font-semibold tracking-wide bg-fluent-bg-canvas text-fluent-brand-fg border border-fluent-stroke-subtle overflow-x-auto whitespace-nowrap scrollbar-hide select-all">
                                {liveSchemaStr}
                            </div>
                            <button
                                type="button"
                                onClick={onCopy}
                                title="Copy schema template string"
                                className={`shrink-0 h-[32px] px-3 rounded-[4px] text-[12px] font-medium transition-all duration-200 ease-in-out active:scale-95 inline-flex items-center justify-center gap-1.5 border ${copiedId === 'live-pill'
                                    ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                    : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                }`}
                            >
                                {copiedId === 'live-pill' ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Schema</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Preview 2: Live Real-World Sample Resource Name */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border border-fluent-stroke-subtle bg-fluent-bg-card rounded-lg shadow-soft">
                        <div className="flex items-center gap-2 shrink-0">
                            <Sparkles className="w-4 h-4 text-fluent-brand-fg" />
                            <span className="text-[12px] font-semibold text-fluent-fg-secondary">Sample Output:</span>
                            {/* Service Sample Selector */}
                            <div className="flex items-center gap-1">
                                {SAMPLE_RESOURCES.map(sample => (
                                    <button
                                        key={sample.id}
                                        type="button"
                                        onClick={() => setSelectedSampleId(sample.id)}
                                        title={`${sample.name} (${sample.notes})`}
                                        className={`px-1.5 py-0.5 rounded-[3px] text-[11px] font-mono font-medium border transition-colors ${selectedSampleId === sample.id
                                            ? 'bg-fluent-brand-bg text-white border-fluent-brand-bg font-semibold'
                                            : 'bg-fluent-bg-canvas border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-fg-primary hover:border-fluent-stroke-strong'
                                        }`}
                                    >
                                        {sample.abbrev}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-1 items-center gap-2 min-w-0">
                            <div 
                                className="flex-1 h-[32px] px-3 flex items-center rounded font-mono text-[13px] font-semibold tracking-wide bg-fluent-bg-canvas text-fluent-fg-primary border border-fluent-stroke-subtle overflow-x-auto whitespace-nowrap scrollbar-hide select-all"
                                title={`Generated ${selectedSample.name} name`}
                            >
                                {sampleResourceName || 'rg-webapp-prod-uks-001'}
                            </div>
                            <button
                                type="button"
                                onClick={handleCopySample}
                                title="Copy sample resource name"
                                className={`shrink-0 h-[32px] px-3 rounded-[4px] text-[12px] font-medium transition-all duration-200 ease-in-out active:scale-95 inline-flex items-center justify-center gap-1.5 border ${sampleCopied
                                    ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                    : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                }`}
                            >
                                {sampleCopied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Name</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ConfigPanel.propTypes = {
    workload: PropTypes.string.isRequired,
    setWorkload: PropTypes.func.isRequired,
    envValue: PropTypes.string.isRequired,
    setEnvValue: PropTypes.func.isRequired,
    regionValue: PropTypes.string.isRequired,
    setRegionValue: PropTypes.func.isRequired,
    instance: PropTypes.string.isRequired,
    onInstanceChange: PropTypes.func.isRequired,
    setInstance: PropTypes.func,
    orgPrefix: PropTypes.string.isRequired,
    setOrgPrefix: PropTypes.func.isRequired,
    showOrg: PropTypes.bool.isRequired,
    setShowOrg: PropTypes.func.isRequired,
    namingOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    setNamingOrder: PropTypes.func,
    onMoveItem: PropTypes.func.isRequired,
    liveSchemaStr: PropTypes.string.isRequired,
    copiedId: PropTypes.string,
    onCopy: PropTypes.func.isRequired,
    onResetDefaults: PropTypes.func.isRequired,
    generateName: PropTypes.func,
    onToggleMinimize: PropTypes.func
};

export default memo(ConfigPanel);
