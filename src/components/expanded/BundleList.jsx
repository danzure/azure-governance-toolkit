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
                        <div key={idx} className={`flex items-center justify-between py-1 gap-2 ${idx > 0 ? `border-t ${t.divider}` : ''}`}>
                            <span className={`text-[12px] font-medium shrink-0 w-32 truncate ${t.muted}`}>{item.name}</span>
                            <div className={`text-[13px] font-mono truncate flex-1 ${t.strong}`}>
                                <ValidationHighlight name={itemName} allowedCharsPattern={item.chars || resource.chars} />
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onCopy(itemName, item.name, e); }}
                                className={`flex items-center justify-center w-7 h-7 rounded-md border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg transition-colors shrink-0 ${isCopied 
                                    ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' 
                                    : 'border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39]'}`}
                                title="Copy name"
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
