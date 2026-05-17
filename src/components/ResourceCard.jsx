import { memo, useState, useMemo } from 'react';
import { Box, Copy, Check, ShieldAlert, AlertTriangle, LayoutGrid, Cpu, Network, Database, Globe, DatabaseZap, ShieldCheck, Workflow, BarChart3, Sparkles, Settings2, Wifi, GitBranch, X } from 'lucide-react';
import ValidationHighlight from './ValidationHighlight';
import ExpandedPanel from './ExpandedPanel';
import { getCategoryColors } from '../data/categoryColors';
import { getBundleResources } from '../utils/bundleGenerator';
import { validateName } from '../utils/nameValidator';
import PropTypes from 'prop-types';

const CATEGORY_ICONS = {
    'General': LayoutGrid,
    'Compute': Cpu,
    'Networking': Network,
    'Storage': Database,
    'Web': Globe,
    'Databases': DatabaseZap,
    'Containers': Box,
    'Security': ShieldCheck,
    'Integration': Workflow,
    'Analytics': BarChart3,
    'AI + ML': Sparkles,
    'Management + Governance': Settings2,
    'IoT': Wifi,
    'DevOps': GitBranch,
};

/**
 * ResourceCard Component
 * 
 * Highly interactive card component representing a single Azure resource type.
 * Displays resource metadata (name, abbreviation, category icon).
 * Handles the generation of the compliant name based on the current global configuration.
 * Includes inline validation status warnings/errors, a quick copy button, and manages
 * local state for sub-resource selection and topology expansion.
 * Renders the ExpandedPanel conditionally when the card is toggled open.
 * 
 * @param {Object} props
 * @param {string} props.id - HTML ID attribute for the card container.
 * @param {Object} props.resource - The dictionary definition of the target Azure resource.
 * @param {string} props.genName - The primary generated name for this resource.
 * @param {boolean} props.isCopied - Global flag tracking whether a copy interaction recently occurred.
 * @param {boolean} props.isExpanded - Whether this specific card is currently expanded into detailed view.
 * @param {Function} props.onCopy - Click handler to manually execute a copy action.
 * @param {Function} props.onToggle - Click handler specifically for expanding/collapsing this card.
 * @param {string} [props.selectedSubResource] - The currently selected target subresource suffix (if applicable).
 * @param {Function} [props.onSubResourceChange] - State setter for the active subresource selection.
 * @param {Function} props.generateName - Parent context utility to regenerate names dynamically for bundled assets.
 * @returns {JSX.Element}
 */
function ResourceCard({ id, resource, genName, isCopied, isExpanded, onCopy, onToggle, selectedSubResource, onSubResourceChange, generateName }) {
    const categoryColors = getCategoryColors(resource.category);
    const CategoryIcon = CATEGORY_ICONS[resource.category] || Box;

    const [topology, setTopology] = useState('single');
    const [spokeCount, setSpokeCount] = useState(1);
    const [spokeStartValue, setSpokeStartValue] = useState(1);

    const bundle = useMemo(() => getBundleResources(resource, topology, { spokeCount, spokeStartValue }), [resource, topology, spokeCount, spokeStartValue]);
    const hasBundle = bundle && bundle.length > 0;

    // Helper to generate name - utilizing the passed generateName function with modified resource context
    const getGeneratedName = (resItem) => generateName(resItem, null, resItem.instanceOverride);

    // Validation
    const validationIssues = useMemo(() => validateName(genName, resource), [genName, resource]);
    const hasErrors = validationIssues.some(i => i.type === 'error');
    const hasWarnings = validationIssues.some(i => i.type === 'warning');
    const isTooLong = validationIssues.some(i => i.code === 'TOO_LONG');


    return (
        <div
            id={id}
            onClick={() => onToggle(resource.name, isExpanded)}
            className={`group relative flex flex-col rounded-lg border cursor-pointer transition-all duration-300 h-full ${isExpanded ? 'ring-2 ring-[#0078d4] shadow-depth border-transparent dark:border-transparent' : 'hover:shadow-depth hover:border-[#c8c6c4] dark:hover:border-[#8a8886] shadow-soft'} bg-white dark:bg-[#252423] border-[#edebe9] dark:border-[#484644] ${hasErrors ? 'border-l-4 border-l-[#a80000]' : hasWarnings ? 'border-l-4 border-l-[#ffaa44]' : ''}`}
        >
            <div className="p-4 flex flex-col h-full gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div
                            className={`p-2 rounded-md shrink-0 ${categoryColors.bgClass} ${categoryColors.textClass}`}
                        >
                            <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-[14px] font-semibold truncate text-[#242424] dark:text-white">{resource.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span
                                    className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${categoryColors.bgClass} ${categoryColors.textClass}`}
                                >{resource.category}</span>
                                <span className="text-[11px] font-mono opacity-60 text-[#616161] dark:text-[#d2d2d2]">{resource.abbrev}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {validationIssues.length > 0 && (
                            <div className="relative group/validation">
                                {hasErrors
                                    ? <ShieldAlert className="w-4 h-4 text-[#a80000]" aria-label={`${validationIssues.length} validation issue(s)`} />
                                    : <AlertTriangle className="w-4 h-4 text-[#ffaa44]" aria-label={`${validationIssues.length} validation warning(s)`} />
                                }
                                <div className="absolute right-0 top-6 z-50 w-56 p-2.5 rounded shadow-lg border text-[11px] leading-relaxed hidden group-hover/validation:block bg-white dark:bg-[#323130] border-[#edebe9] dark:border-[#605e5c] text-[#323130] dark:text-[#e1dfdd]">
                                    {validationIssues.map((issue, i) => (
                                        <div key={i} className={`flex items-start gap-1.5 ${i > 0 ? 'mt-1.5 pt-1.5 border-t' : ''} border-[#edebe9] dark:border-[#484644]`}>
                                            <span className={`shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full ${issue.type === 'error' ? 'bg-[#a80000]' : 'bg-[#ffaa44]'}`} />
                                            <span>{issue.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {isExpanded && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggle(resource.name, isExpanded); }}
                                className="p-1 -mr-1 rounded-sm text-[#605e5c] dark:text-[#c8c6c4] hover:bg-[#edebe9] dark:hover:bg-[#323130] transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-[13px] leading-relaxed line-clamp-2 text-[#605e5c] dark:text-[#d2d0ce]">
                    {resource.desc}
                </p>

                <div className="mt-auto pt-2">
                    <div className="group/copy relative rounded-md px-3 flex flex-col justify-center h-[32px] bg-[#f3f2f1] dark:bg-[#292827] hover:bg-[#edebe9] dark:hover:bg-[#323130] transition-colors border border-transparent">
                        <div className={`text-[13px] font-medium font-mono truncate w-full pr-16 flex items-center gap-2 ${isTooLong ? 'text-[#a80000]' : 'text-[#242424] dark:text-[#ffffff]'}`}>
                            <ValidationHighlight name={hasBundle ? getGeneratedName(bundle[0]) : genName} allowedCharsPattern={hasBundle ? bundle[0].chars : resource.chars} />
                            {hasBundle && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded font-bold bg-white dark:bg-[#3b3a39] text-[#0078d4] dark:text-[#60cdff] shadow-sm">
                                    +{bundle.length - 1}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (hasBundle) {
                                    const allNames = bundle.map(item => `${item.name}: ${getGeneratedName(item)}`).join('\n');
                                    onCopy(allNames, resource.name, e);
                                } else {
                                    onCopy(genName, resource.name, e);
                                }
                            }}
                            aria-label={isCopied ? 'Copied' : 'Copy name'}
                            className={`absolute right-1 top-1 h-[24px] px-2 flex items-center justify-center gap-1.5 rounded-sm text-[11px] font-medium transition-all z-10 border ${isCopied 
                                ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' 
                                : 'bg-white dark:bg-[#323130] border-[#e1dfdd] dark:border-[#484644] text-[#605e5c] dark:text-[#c8c6c4] hover:border-[#c8c6c4] dark:hover:border-[#605e5c] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                        >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                    <div className="flex justify-between items-center text-[11px] mt-2 px-0.5 opacity-70 shrink-0">
                        <span className="text-[#605e5c] dark:text-[#c8c6c4]">Max: {resource.maxLength || 64}</span>
                        <span className={`font-bold ${isTooLong ? 'text-[#a80000]' : 'text-[#201f1e] dark:text-white'}`}>{genName.length} chars</span>
                    </div>
                </div>
            </div>




            {isExpanded && (
                <div className="animate-fade-in">
                    <ExpandedPanel
                        resource={resource}
                        genName={genName}
                        isCopied={isCopied}
                        onCopy={onCopy}
                        selectedSubResource={selectedSubResource}
                        onSubResourceChange={(suffix) => onSubResourceChange(resource.name, suffix)}
                        topology={topology}
                        setTopology={setTopology}
                        spokeCount={spokeCount}
                        setSpokeCount={setSpokeCount}
                        spokeStartValue={spokeStartValue}
                        setSpokeStartValue={setSpokeStartValue}
                        bundle={bundle}
                        getBundleName={getGeneratedName}
                        onClose={() => onToggle(resource.name, isExpanded)}
                    />
                </div>
            )}
        </div>
    );
}

ResourceCard.propTypes = {
    id: PropTypes.string.isRequired,
    resource: PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        abbrev: PropTypes.string.isRequired,
        maxLength: PropTypes.number,
        chars: PropTypes.string,
        subResources: PropTypes.array,
    }).isRequired,
    genName: PropTypes.string.isRequired,
    isCopied: PropTypes.bool.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    selectedSubResource: PropTypes.string,
    onSubResourceChange: PropTypes.func,
    generateName: PropTypes.func,
};

export default memo(ResourceCard);
