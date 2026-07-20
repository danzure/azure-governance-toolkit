import { Copy, Check } from 'lucide-react';
import ValidationHighlight from '../ValidationHighlight';
import PropTypes from 'prop-types';

/**
 * BundleList Component
 * 
 * Displays a list of associated resources generated alongside the primary resource.
 * This is used when a topology or bundle is selected (e.g., Hub & Spoke VNet, 
 * or an ML Workspace with its required storage and key vault dependencies).
 * Provides inline validation highlighting and copy actions for each grouped resource.
 * 
 * @param {Object} props
 * @param {Array<Object>} props.bundle - Array of resource definitions in the current topology/bundle.
 * @param {Function} props.getBundleName - Function to generate the name for a specific bundle item.
 * @param {Object} props.resource - The primary resource definition.
 * @param {boolean} props.isCopied - Global flag indicating if a copy action recently occurred.
 * @param {Function} props.onCopy - Click handler for copying a specific resource name.
 * @param {Object} props.t - Shared tailwind class tokens for consistent themeing.
 * @returns {JSX.Element|null} Returns null if no bundle is active.
 */
export default function BundleList({ bundle, getBundleName, resource, isCopied, onCopy, t }) {
    if (!bundle || bundle.length === 0) return null;

    return (
        <div className={`mb-3 px-3 py-2 rounded-md border ${t.card}`}>
            <span className={`text-[12px] font-semibold mb-1.5 block ${t.caption}`}>Generated Resources</span>
            <div className="flex flex-col">
                {bundle.map((item, idx) => {
                    const itemName = getBundleName(item);
                    return (
                        <div key={idx} className={`group/copy relative flex items-center gap-2 px-3 py-1.5 min-h-[32px] w-full min-w-0 rounded-[4px] border bg-fluent-bg-canvas hover:bg-fluent-bg-hover border-transparent transition-all ${idx > 0 ? 'mt-1' : ''}`}>
                            <span className={`text-[12px] font-medium shrink-0 w-28 truncate ${t.muted}`}>{item.name}</span>
                            <div className="flex-1 min-w-0 font-mono text-[13px] font-medium text-fluent-fg-primary truncate flex items-center pr-8">
                                <span className="truncate min-w-0 block">
                                    <ValidationHighlight name={itemName} allowedCharsPattern={item.chars || resource.chars} />
                                </span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onCopy(itemName, item.name, e); }}
                                aria-label={isCopied ? 'Copied' : 'Copy name'}
                                className={`absolute right-1 top-1/2 -translate-y-1/2 shrink-0 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[4px] border text-[11px] font-medium transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg z-10 ${isCopied 
                                    ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' 
                                    : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-primary hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong'}`}
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

BundleList.propTypes = {
    bundle: PropTypes.array,
    getBundleName: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    isCopied: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    t: PropTypes.object.isRequired,
};
