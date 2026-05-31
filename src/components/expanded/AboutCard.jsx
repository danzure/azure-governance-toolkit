import { useState } from 'react';
import { Info, Lightbulb, Copy, Check, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AboutCard Component
 * 
 * Renders the descriptive information panel for a specific Azure resource.
 * Displays the resource's purpose, a direct link to the Microsoft documentation,
 * and standard CAF (Cloud Adoption Framework) naming guidance/patterns if available.
 * 
 * @param {Object} props
 * @param {Object} props.resource - Resource definition containing learnUrl and longDesc.
 * @param {string} props.displayDesc - Primary description text (can optionally be overridden).
 * @param {string} props.namingPattern - Optional explicit naming pattern (e.g., '[rg]-[name]-[env]').
 * @param {string} props.namingGuidanceText - Optional verbose naming guidance text.
 * @param {Object} props.t - Shared tailwind class tokens for consistent themeing.
 * @returns {JSX.Element}
 */
export default function AboutCard({ resource, displayDesc, namingPattern, namingGuidanceText, t }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(namingPattern);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={`rounded-md border overflow-hidden ${t.card}`}>
            {/* About this Service */}
            <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                        <Info className={`w-3 h-3 ${t.muted}`} />
                        <span className={`text-[12px] font-semibold ${t.caption}`}>About this service</span>
                    </div>
                </div>
                <p className={`text-[13px] leading-[1.6] ${t.text}`}>
                    {resource.longDesc || displayDesc}
                </p>
                {resource.learnUrl && (
                    <div className="mt-3 mb-1">
                        <a
                            href={resource.learnUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] text-[13px] font-medium hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                        >
                            <svg viewBox="0 0 23 23" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h11v11H0z" fill="#f35325"/>
                                <path d="M12 0h11v11H12z" fill="#81bc06"/>
                                <path d="M0 12h11v11H0z" fill="#05a6f0"/>
                                <path d="M12 12h11v11H12z" fill="#ffba08"/>
                            </svg>
                            Microsoft Learn
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}
            </div>

            {/* Naming Guidance — divider-separated */}
            {(namingPattern || namingGuidanceText) && (
                <div className={`border-t px-4 pt-2 pb-3 ${t.divider}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Lightbulb className={`w-3 h-3 ${t.muted}`} />
                        <span className={`text-[12px] font-semibold ${t.caption}`}>Naming guidance</span>
                    </div>
                    {namingPattern && (
                        <div className={`mb-1.5 px-2.5 py-1.5 rounded-sm font-mono text-[12px] flex items-center justify-between gap-2 ${t.codeBlock}`}>
                            <span className="break-all">{namingPattern}</span>
                            <button
                                onClick={handleCopy}
                                className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-md border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg transition-colors ${isCopied ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' : 'border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39]'}`}
                                title="Copy naming guidance"
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    )}
                    {namingGuidanceText && (
                        <p className={`text-[13px] leading-[1.6] ${t.text}`}>
                            {namingGuidanceText}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

AboutCard.propTypes = {
    resource: PropTypes.object.isRequired,
    displayDesc: PropTypes.string,
    namingPattern: PropTypes.string,
    namingGuidanceText: PropTypes.string,
    t: PropTypes.object.isRequired,
};
