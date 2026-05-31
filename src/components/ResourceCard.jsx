import { memo, useState, useMemo } from 'react';
import { Copy, Check, ShieldAlert, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import ValidationHighlight from './ValidationHighlight';
import ExpandedPanel from './ExpandedPanel';
import AzureServiceIcon from './AzureServiceIcon';
import { getCategoryColors } from '../data/categoryColors';
import { getBundleResources } from '../utils/bundleGenerator';
import { validateName } from '../utils/nameValidator';
import PropTypes from 'prop-types';



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


    const [topology, setTopology] = useState('single');
    const [spokeCount, setSpokeCount] = useState(1);
    const [spokeStartValue, setSpokeStartValue] = useState(1);

    const bundle = useMemo(() => getBundleResources(resource, topology, { spokeCount, spokeStartValue }), [resource, topology, spokeCount, spokeStartValue]);
    const hasBundle = bundle && bundle.length > 0;

    // Helper to generate name - utilizing the passed generateName function with modified resource context
    const getGeneratedName = (resItem, patternOverride = null) => generateName(resItem, null, resItem.instanceOverride, patternOverride);

    // Validation
    const validationIssues = useMemo(() => validateName(genName, resource), [genName, resource]);
    const hasErrors = validationIssues.some(i => i.type === 'error');
    const hasWarnings = validationIssues.some(i => i.type === 'warning');
    const isTooLong = validationIssues.some(i => i.code === 'TOO_LONG');

    // Calculate validation styles for expanded view
    const expandedValidationBg = validationIssues.length === 0 
        ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620]'
        : hasErrors 
            ? 'bg-[#fdf3f4] dark:bg-[#2c1515] border-[#eeacb2] dark:border-[#442726]'
            : 'bg-[#fff8f0] dark:bg-[#2c2412] border-[#f5d9a8] dark:border-[#4a3c1e]';


    return (
        <div
            id={id}
            onClick={() => onToggle(resource.name, isExpanded)}
            className={`group relative flex flex-col rounded-lg border cursor-pointer transition-all duration-300 h-full ${isExpanded ? 'ring-2 ring-fluent-brand-bg shadow-depth border-transparent dark:border-transparent' : 'hover:shadow-depth hover:border-fluent-stroke-strong shadow-soft'} bg-fluent-bg-card border-fluent-stroke-subtle ${hasErrors ? 'border-l-4 border-l-[#a80000]' : hasWarnings ? 'border-l-4 border-l-[#ffaa44]' : ''}`}
        >
            <div className="p-4 flex flex-col h-full gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <AzureServiceIcon resourceName={resource.name} category={resource.category} className="w-8 h-8 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-[14px] font-semibold truncate text-fluent-fg-primary">{resource.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span
                                    className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${categoryColors.bgClass} ${categoryColors.textClass}`}
                                >{resource.category}</span>
                                <span className="text-[11px] font-mono opacity-60 text-fluent-fg-tertiary">{resource.abbrev}</span>
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
                                <div className="absolute right-0 top-6 z-50 w-56 p-2.5 rounded shadow-lg border text-[11px] leading-relaxed hidden group-hover/validation:block bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary">
                                    {validationIssues.map((issue, i) => (
                                        <div key={i} className={`flex items-start gap-1.5 ${i > 0 ? 'mt-1.5 pt-1.5 border-t' : ''} border-fluent-stroke-subtle`}>
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
                                className="p-1 -mr-1 rounded-sm text-fluent-fg-tertiary hover:bg-fluent-bg-hover transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-[13px] leading-relaxed line-clamp-2 text-fluent-fg-secondary">
                    {resource.desc}
                </p>


                <div className="mt-auto pt-2">
                    <div className={`group/copy relative rounded-md px-3 py-1.5 flex flex-col justify-center min-h-[32px] transition-all border ${isExpanded ? expandedValidationBg : 'bg-fluent-bg-canvas hover:bg-fluent-bg-hover border-transparent'}`}>
                        <div className="relative flex items-center min-h-[24px]">
                            <div className={`text-[13px] font-medium font-mono truncate w-full pr-16 flex items-center gap-2 ${isTooLong ? 'text-[#a80000]' : 'text-fluent-fg-primary'}`}>
                                <ValidationHighlight name={hasBundle ? getGeneratedName(bundle[0]) : genName} allowedCharsPattern={hasBundle ? bundle[0].chars : resource.chars} />
                                {hasBundle && (
                                    <span className="text-[11px] px-1.5 py-0.5 rounded font-bold bg-fluent-bg-card text-fluent-brand-fg shadow-sm">
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
                                className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg z-10 ${isCopied 
                                    ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' 
                                    : 'border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39]'}`}
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>

                        {isExpanded && (
                            <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                                {validationIssues.length === 0 ? (
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#107c10] shrink-0" />
                                        <span className="text-[12px] font-medium text-[#0e700e] dark:text-[#a3d4a3]">Name passes all validation checks</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {validationIssues.map((issue, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                {issue.type === 'error'
                                                    ? <ShieldAlert className="w-3 h-3 shrink-0 text-[#c50f1f]" />
                                                    : <AlertTriangle className="w-3 h-3 shrink-0 text-[#f7941d]" />
                                                }
                                                <span className="text-[12px] text-[#242424] dark:text-[#e1dfdd]">{issue.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className={`flex justify-between items-center text-[11px] mt-2 px-0.5 opacity-70 shrink-0 ${isExpanded ? 'hidden' : ''}`}>
                        <span className="text-fluent-fg-tertiary">Max: {resource.maxLength || 64}</span>
                        <span className={`font-bold ${isTooLong ? 'text-[#a80000]' : 'text-fluent-fg-primary'}`}>{genName.length} chars</span>
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
