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
        <nav className="mt-[48px] shadow-sm transition-all border-b bg-white dark:bg-[#252423] border-[#edebe9] dark:border-[#484644]">
            <div className="max-w-[1600px] mx-auto px-4 py-3">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-[16px] font-semibold text-[#242424] dark:text-white">Configuration</h2>
                        <p className="text-[13px] text-[#616161] dark:text-[#a19f9d]">Define naming parameters</p>
                    </div>
                    <button onClick={onToggleMinimize} className="text-[13px] font-medium text-[#0078d4] hover:underline flex items-center gap-1">
                        {isMinimized ? 'Show' : 'Hide'}
                        {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                </div>

                {!isMinimized && (
                    <div className="animate-slide-up">
                        {/* Two-column grid: Parameters + About (reversed order on mobile) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {/* About / CAF Introduction - shows first on mobile via order */}
                            <div className="order-1 lg:order-2 p-3 rounded-lg border shadow-soft bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <h3 className="text-[14px] font-semibold text-[#201f1e] dark:text-white">About This Tool</h3>
                                </div>
                                <div className="text-[13px] leading-relaxed space-y-2 text-[#616161] dark:text-[#c8c6c4]">
                                    <p>
                                        The app.atozazure Resource Naming Tool helps you generate consistent, standards-compliant Azure resource names aligned with Microsoft's{' '}
                                        <a href="https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming" target="_blank" rel="noopener noreferrer" className="text-[#0078d4] hover:underline font-medium">
                                            Cloud Adoption Framework (CAF)
                                        </a>
                                        . Each name is automatically validated against Azure's character, length, and scope constraints so you can deploy with confidence.
                                    </p>
                                    <p>
                                        Configure your environment, region, workload, and optional org prefix using the parameters panel, then use the pattern builder to customise segment order. Browse the catalog of 100+ Azure services below — each card shows the generated name, recommended abbreviation, and best-practice guidance. Copy individual names or export bundles for use in your IaC templates and deployments.
                                    </p>
                                </div>
                            </div>

                            {/* Parameters - shows second on mobile via order */}
                            <div className="order-2 lg:order-1 p-3 rounded-lg border shadow-soft bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Edit3 className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <h3 className="text-[14px] font-semibold text-[#201f1e] dark:text-white">Parameters</h3>
                                </div>
                                {/* Form grid - label left, input right */}
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
                                    {/* Org Prefix */}
                                    <Tooltip content="Organisation prefix">
                                        <label className={`text-[12px] font-medium text-right text-[#616161] dark:text-[#c8c6c4] ${!showOrg ? 'opacity-50' : ''}`}>Org Prefix</label>
                                    </Tooltip>
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="text"
                                            value={orgPrefix}
                                            onChange={(e) => setOrgPrefix(e.target.value)}
                                            placeholder="Optional"
                                            disabled={!showOrg}
                                            className="flex-1 px-2.5 h-[28px] border rounded outline-none text-[13px] transition-all duration-200 focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 disabled:opacity-40 bg-white dark:bg-[#252423] text-[#201f1e] dark:text-white border-[#8a8886] dark:border-[#605e5c] placeholder:text-[#a19f9d] dark:placeholder:text-[#605e5c]"
                                        />
                                        <button
                                            onClick={() => setShowOrg(!showOrg)}
                                            className={`h-[28px] flex items-center justify-center rounded border transition-colors shrink-0 px-2 gap-1.5 ${showOrg ? 'bg-[#0078d4] border-[#0078d4] text-white' : 'bg-white dark:bg-transparent border-[#8a8886] dark:border-[#605e5c] text-[#605e5c] dark:text-[#8a8886] hover:border-[#323130] dark:hover:border-[#8a8886]'}`}
                                            title={showOrg ? 'Disable Org' : 'Enable Org'}
                                        >
                                            {showOrg ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            <span className="text-[12px] font-semibold">{showOrg ? 'Hide Org' : 'Show Org'}</span>
                                        </button>
                                    </div>
                                    {/* Workload */}
                                    <Tooltip content="Application or workload name">
                                        <label className="text-[12px] font-medium text-right text-[#616161] dark:text-[#c8c6c4]">Workload</label>
                                    </Tooltip>
                                    <input
                                        type="text"
                                        value={workload}
                                        onChange={(e) => setWorkload(e.target.value)}
                                        placeholder="web"
                                        className="px-2.5 h-[28px] border rounded outline-none text-[13px] transition-all duration-200 focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 bg-white dark:bg-[#252423] text-[#201f1e] dark:text-white border-[#8a8886] dark:border-[#605e5c] placeholder:text-[#a19f9d] dark:placeholder:text-[#605e5c]"
                                    />
                                    {/* Environment */}
                                    <Tooltip content="Lifecycle stage">
                                        <label className="text-[12px] font-medium text-right text-[#616161] dark:text-[#c8c6c4]">Environment</label>
                                    </Tooltip>
                                    <SearchableSelect items={ENVIRONMENTS} value={envValue} onChange={setEnvValue} compact />
                                    {/* Region */}
                                    <Tooltip content="Azure region">
                                        <label className="text-[12px] font-medium text-right text-[#616161] dark:text-[#c8c6c4]">Region</label>
                                    </Tooltip>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex-1 min-w-0">
                                            <SearchableSelect items={AZURE_REGIONS} value={regionValue} onChange={setRegionValue} placeholder="Select..." compact />
                                        </div>
                                        <a
                                            href="https://datacenters.microsoft.com/globe/explore/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="View Azure Infrastructure Map"
                                            className="h-[32px] flex items-center justify-center rounded border transition-colors shrink-0 px-2 gap-1.5 no-underline bg-white dark:bg-transparent border-[#8a8886] dark:border-[#605e5c] text-[#605e5c] dark:text-[#c8c6c4] hover:border-[#323130] dark:hover:border-[#8a8886]"
                                        >
                                            <Globe className="w-3.5 h-3.5" />
                                            <span className="text-[12px] font-semibold">View Map</span>
                                        </a>
                                    </div>
                                    {/* Instance */}
                                    <Tooltip content="Instance number (001-999)">
                                        <label className="text-[12px] font-medium text-right text-[#616161] dark:text-[#c8c6c4]">Instance</label>
                                    </Tooltip>
                                    <input
                                        type="text"
                                        value={instance}
                                        onChange={onInstanceChange}
                                        maxLength={3}
                                        placeholder="001"
                                        className="px-2.5 h-[28px] border rounded outline-none text-[13px] transition-all duration-200 focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 bg-white dark:bg-[#252423] text-[#201f1e] dark:text-white border-[#8a8886] dark:border-[#605e5c] placeholder:text-[#a19f9d] dark:placeholder:text-[#605e5c]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pattern Builder + Live Preview — streamlined card */}
                        <div className="mt-3 rounded-lg border bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644] shadow-soft dark:shadow-none">
                            {/* Segment chips — compact inline strip with hover-reveal arrows */}
                            <div className="px-3 py-2.5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <h3 className="text-[13px] font-semibold text-[#201f1e] dark:text-white">Pattern Builder</h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {namingOrder.map((item, index) => (
                                        <div
                                            key={item}
                                            className={`group flex items-center gap-1.5 pl-1 pr-1.5 h-[30px] rounded-md border cursor-default transition-colors ${item === 'Org' && !showOrg ? 'opacity-40' : ''} bg-[#faf9f8] dark:bg-[#252423] border-[#edebe9] dark:border-[#484644] hover:border-[#0078d4] dark:hover:border-[#0078d4]`}
                                        >
                                            <span className="w-[18px] h-[18px] rounded-sm flex items-center justify-center text-[10px] font-bold shrink-0 bg-[#deecf9] dark:bg-[#0078d4]/30 text-[#0078d4] dark:text-[#60cdff]">
                                                {index + 1}
                                            </span>
                                            <span className="text-[12px] font-medium text-[#201f1e] dark:text-white">{item}</span>
                                            {/* Arrow buttons — revealed on hover */}
                                            <div className="flex items-center gap-px opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onMoveItem(index, -1)}
                                                    disabled={index === 0}
                                                    className="p-0.5 rounded transition-colors disabled:opacity-20 text-[#605e5c] dark:text-[#a19f9d] hover:bg-[#edebe9] dark:hover:bg-[#484644]"
                                                    title="Move left"
                                                >
                                                    <ArrowLeft className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => onMoveItem(index, 1)}
                                                    disabled={index === namingOrder.length - 1}
                                                    className="p-0.5 rounded transition-colors disabled:opacity-20 text-[#605e5c] dark:text-[#a19f9d] hover:bg-[#edebe9] dark:hover:bg-[#484644]"
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
                            <div className="px-3 py-2 flex items-center gap-3 border-t border-[#edebe9] dark:border-[#484644] bg-[#faf9f8] dark:bg-[#1b1a19] rounded-b-lg">
                                <div className="flex items-center gap-2 shrink-0">
                                    <Eye className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <span className="text-[12px] font-medium text-[#616161] dark:text-[#a19f9d]">Preview</span>
                                </div>
                                <div className="flex-1 px-3 py-1.5 rounded font-mono text-[14px] font-semibold tracking-wide bg-white dark:bg-[#252423] text-[#0078d4] dark:text-[#60cdff] border border-[#edebe9] dark:border-transparent">
                                    {liveSchemaStr}
                                </div>
                                <button
                                    onClick={onCopy}
                                    className={`shrink-0 h-[26px] px-2.5 rounded-sm text-[12px] font-medium transition-all flex items-center gap-1.5 border ${copiedId === 'live-pill'
                                        ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]'
                                        : 'bg-white dark:bg-[#323130] border-[#e1dfdd] dark:border-[#484644] text-[#605e5c] dark:text-[#c8c6c4] hover:border-[#c8c6c4] dark:hover:border-[#605e5c] hover:text-[#323130] dark:hover:text-[#e1dfdd]'
                                        }`}
                                >
                                    {copiedId === 'live-pill' ? <><Check className="w-3.5 h-3.5" /> <span>Copied</span></> : <><Copy className="w-3.5 h-3.5" /> <span>Copy</span></>}
                                </button>
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
