import { memo } from 'react';
import { ChevronDown, ChevronUp, Edit3, Eye, EyeOff, ArrowLeft, ArrowRight, Copy, Check, Layers, Info, Globe } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import Tooltip from './Tooltip';
import { AZURE_REGIONS, ENVIRONMENTS } from '../data/constants';
import PropTypes from 'prop-types';

/**
 * Configuration Panel Component
 * 
 * Displays the main configuration form for defining resource naming parameters:
 * - Organization Prefix, Workload, Environment, Region, Instance
 * - Pattern Builder: Allows reordering of naming segments
 * - Live Preview: Shows the current naming schema
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isDarkMode - Current theme state
 * @param {boolean} props.isMinimized - Panel minimization state
 * @param {Function} props.onToggleMinimize - Handler to toggle minimization
 * @param {string} props.workload - Workload name
 * @param {Function} props.setWorkload - State setter for workload
 * @param {string} props.envValue - Selected environment value
 * @param {Function} props.setEnvValue - State setter for environment
 * @param {string} props.regionValue - Selected region value
 * @param {Function} props.setRegionValue - State setter for region
 * @param {string} props.instance - Instance number
 * @param {Function} props.onInstanceChange - Handler for instance changes
 * @param {string} props.orgPrefix - Organization prefix
 * @param {Function} props.setOrgPrefix - State setter for org prefix
 * @param {boolean} props.showOrg - Toggle state for org prefix visibility
 * @param {Function} props.setShowOrg - State setter for showOrg
 * @param {string[]} props.namingOrder - Array defining the order of naming segments
 * @param {Function} props.onMoveItem - Handler to reorder naming segments
 * @param {string} props.liveSchemaStr - Generated schema string for preview
 * @param {string|null} props.copiedId - ID of the currently copied item for feedback
 * @param {Function} props.onCopy - Copy handler
 */
function ConfigPanel({
    isMinimized, onToggleMinimize,
    workload, setWorkload, envValue, setEnvValue, regionValue, setRegionValue,
    instance, onInstanceChange, orgPrefix, setOrgPrefix, showOrg, setShowOrg,
    namingOrder, onMoveItem, liveSchemaStr, copiedId, onCopy
}) {
    return (
        <nav className="relative z-40 shadow-sm transition-all border-b bg-fluent-bg-card border-fluent-stroke-subtle">
            <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-3">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-[16px] font-semibold text-fluent-fg-primary">Configuration</h2>
                        <p className="text-[13px] text-fluent-fg-tertiary">Define naming parameters</p>
                    </div>
                    <button onClick={onToggleMinimize} className="text-[13px] font-medium text-fluent-brand-fg hover:underline flex items-center gap-1">
                        {isMinimized ? 'Show' : 'Hide'}
                        {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                </div>

                {!isMinimized && (
                    <div className="animate-slide-up">
                        {/* Parameters */}
                        <div className="relative p-3 rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full">
                            <div className="flex items-center gap-2 mb-3 pr-8">
                                <Edit3 className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <h3 className="text-[14px] font-semibold text-fluent-fg-primary">Parameters</h3>
                            </div>
                            
                            {/* Information hover card at the top right */}
                            <div className="absolute top-3 right-3 group z-50">
                                <Info className="w-4 h-4 text-fluent-fg-secondary hover:text-fluent-brand-fg cursor-help transition-colors" />
                                <div className="absolute right-0 top-full pt-2 w-[calc(100vw-48px)] sm:w-[320px] md:w-[450px] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                                    <div className="p-3.5 rounded-lg border shadow-lg bg-fluent-info-bg dark:bg-fluent-bg-subtle border-fluent-info-border dark:border-fluent-stroke-subtle">
                                        <div className="text-[13px] leading-relaxed text-fluent-info-text dark:text-fluent-fg-secondary space-y-2">
                                            <p>
                                                The Resource Naming Tool helps you generate consistent, standards-compliant Azure resource names aligned with Microsoft's{' '}
                                                <a href="https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline font-medium">
                                                    Cloud Adoption Framework (CAF)
                                                </a>
                                                . Each name is automatically validated against Azure's character, length, and scope constraints so you can deploy with confidence.
                                            </p>
                                            <p>
                                                Configure your environment, region, workload, and optional org prefix using the parameters panel, then use the pattern builder to customise segment order. Browse the catalog of 100+ Azure services below — each card shows the generated name, recommended abbreviation, and best-practice guidance. Copy individual names or export bundles for use in your IaC templates and deployments.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                {/* Form grid - 2 columns on large screens to cleanly fill whitespace */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                                    {/* Org Prefix */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                        <Tooltip content="Organisation prefix">
                                            <label className={`block text-[14px] font-bold sm:text-right text-fluent-fg-secondary whitespace-nowrap sm:w-[100px] ${!showOrg ? 'opacity-50' : ''}`}>Org Prefix</label>
                                        </Tooltip>
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <input
                                                type="text"
                                                value={orgPrefix}
                                                onChange={(e) => setOrgPrefix(e.target.value)}
                                                placeholder="Optional"
                                                disabled={!showOrg}
                                                className="flex-1 min-w-0 px-3 h-[32px] border rounded outline-none text-[14px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 disabled:opacity-40 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                                            />
                                            <button
                                                onClick={() => setShowOrg(!showOrg)}
                                                className={`h-[32px] flex items-center justify-center rounded border transition-colors shrink-0 px-2.5 gap-1.5 ${showOrg ? 'bg-fluent-brand-bg border-fluent-brand-bg text-white' : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary'}`}
                                                title={showOrg ? 'Disable Org' : 'Enable Org'}
                                            >
                                                {showOrg ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                <span className="text-[13px] font-semibold">{showOrg ? 'Hide Org' : 'Show Org'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Workload */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                        <Tooltip content="Application or workload name">
                                            <label className="block text-[14px] font-bold sm:text-right text-fluent-fg-secondary whitespace-nowrap sm:w-[100px]">Workload</label>
                                        </Tooltip>
                                        <input
                                            type="text"
                                            value={workload}
                                            onChange={(e) => setWorkload(e.target.value)}
                                            placeholder="web"
                                            className="flex-1 min-w-0 px-3 h-[32px] border rounded outline-none text-[14px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                                        />
                                    </div>

                                    {/* Environment */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                        <Tooltip content="Lifecycle stage">
                                            <label className="block text-[14px] font-bold sm:text-right text-fluent-fg-secondary whitespace-nowrap sm:w-[100px]">Environment</label>
                                        </Tooltip>
                                        <div className="flex-1 min-w-0">
                                            <SearchableSelect items={ENVIRONMENTS} value={envValue} onChange={setEnvValue} compact />
                                        </div>
                                    </div>

                                    {/* Region */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                        <Tooltip content="Azure region">
                                            <label className="block text-[14px] font-bold sm:text-right text-fluent-fg-secondary whitespace-nowrap sm:w-[100px]">Region</label>
                                        </Tooltip>
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="flex-1 min-w-0">
                                                <SearchableSelect items={AZURE_REGIONS} value={regionValue} onChange={setRegionValue} placeholder="Select..." compact />
                                            </div>
                                            <a
                                                href="https://datacenters.microsoft.com/globe/explore/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="View Azure Infrastructure Map"
                                                className="h-[32px] flex items-center justify-center rounded border transition-colors shrink-0 px-2.5 gap-1.5 no-underline bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary"
                                            >
                                                <svg viewBox="0 0 23 23" className="w-4 h-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 0h11v11H0z" fill="#f35325"/>
                                                    <path d="M12 0h11v11H12z" fill="#81bc06"/>
                                                    <path d="M0 12h11v11H0z" fill="#05a6f0"/>
                                                    <path d="M12 12h11v11H12z" fill="#ffba08"/>
                                                </svg>
                                                <span className="text-[13px] font-semibold hidden xl:inline">Azure Datacentre Map</span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Instance */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                        <Tooltip content="Instance number (001-999)">
                                            <label className="block text-[14px] font-bold sm:text-right text-fluent-fg-secondary whitespace-nowrap sm:w-[100px]">Instance</label>
                                        </Tooltip>
                                        <input
                                            type="text"
                                            value={instance}
                                            onChange={onInstanceChange}
                                            maxLength={3}
                                            placeholder="001"
                                            className="flex-1 min-w-0 px-3 h-[32px] border rounded outline-none text-[14px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                                        />
                                    </div>
                                </div>
                            </div>

                        {/* Pattern Builder + Live Preview — streamlined card */}
                        <div className="mt-3 rounded-lg border bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle shadow-soft dark:shadow-none">
                            {/* Segment chips — compact inline strip with hover-reveal arrows */}
                            <div className="px-3 py-2.5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                    <h3 className="text-[13px] font-semibold text-fluent-fg-primary">Pattern Builder</h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                                    {namingOrder.map((item, index) => (
                                        <div
                                            key={item}
                                            className={`group flex items-center gap-1.5 pl-1 pr-1.5 h-[30px] rounded-md border cursor-default transition-colors ${item === 'Org' && !showOrg ? 'opacity-40' : ''} bg-fluent-bg-canvas dark:bg-fluent-bg-card border-fluent-stroke-subtle hover:border-fluent-brand-bg`}
                                        >
                                            <span className="w-[18px] h-[18px] rounded-sm flex items-center justify-center text-[10px] font-bold shrink-0 bg-fluent-info-bg text-fluent-brand-fg">
                                                {index + 1}
                                            </span>
                                            <span className="text-[12px] font-medium text-fluent-fg-primary">{item}</span>
                                            {/* Arrow buttons — always visible */}
                                            <div className="flex items-center gap-px transition-opacity">
                                                <button
                                                    onClick={() => onMoveItem(index, -1)}
                                                    disabled={index === 0}
                                                    className="p-0.5 rounded transition-colors disabled:opacity-20 text-fluent-fg-tertiary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary"
                                                    title="Move left"
                                                >
                                                    <ArrowLeft className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => onMoveItem(index, 1)}
                                                    disabled={index === namingOrder.length - 1}
                                                    className="p-0.5 rounded transition-colors disabled:opacity-20 text-fluent-fg-tertiary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary"
                                                    title="Move right"
                                                >
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Live Preview — integrated footer with inline title */}
                            <div className="px-3 py-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border-t border-fluent-stroke-subtle bg-fluent-bg-canvas dark:bg-fluent-bg-subtle rounded-b-lg">
                                <div className="flex items-center justify-between w-full sm:w-auto">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Eye className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                        <span className="text-[12px] font-medium text-fluent-fg-tertiary">Preview</span>
                                    </div>
                                </div>
                                <div className="flex flex-1 items-center gap-2 sm:gap-3 w-full min-w-0">
                                    <div className="flex-1 px-3 py-1.5 rounded font-mono text-[13px] sm:text-[14px] font-semibold tracking-wide bg-fluent-bg-card text-fluent-brand-fg border border-fluent-stroke-subtle dark:border-transparent overflow-x-auto whitespace-nowrap scrollbar-hide">
                                        {liveSchemaStr}
                                    </div>
                                <button
                                    onClick={onCopy}
                                    className={`shrink-0 h-[26px] px-2.5 rounded-sm text-[12px] font-medium transition-all flex items-center gap-1.5 border ${copiedId === 'live-pill'
                                        ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]'
                                        : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                                        }`}
                                >
                                    {copiedId === 'live-pill' ? <><Check className="w-3.5 h-3.5" /> <span>Copied</span></> : <><Copy className="w-3.5 h-3.5" /> <span>Copy</span></>}
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

ConfigPanel.propTypes = {
    isMinimized: PropTypes.bool.isRequired,
    onToggleMinimize: PropTypes.func.isRequired,
    workload: PropTypes.string.isRequired,
    setWorkload: PropTypes.func.isRequired,
    envValue: PropTypes.string.isRequired,
    setEnvValue: PropTypes.func.isRequired,
    regionValue: PropTypes.string.isRequired,
    setRegionValue: PropTypes.func.isRequired,
    instance: PropTypes.string.isRequired,
    onInstanceChange: PropTypes.func.isRequired,
    orgPrefix: PropTypes.string.isRequired,
    setOrgPrefix: PropTypes.func.isRequired,
    showOrg: PropTypes.bool.isRequired,
    setShowOrg: PropTypes.func.isRequired,
    namingOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    onMoveItem: PropTypes.func.isRequired,
    liveSchemaStr: PropTypes.string.isRequired,
    copiedId: PropTypes.string,
    onCopy: PropTypes.func.isRequired,
};

export default memo(ConfigPanel);
