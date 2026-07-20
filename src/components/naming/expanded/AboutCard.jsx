import { useState } from 'react';
import { Info, Lightbulb, Copy, Check, ExternalLink, Calculator } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AboutBanner Component
 * 
 * Compact, full-width banner displaying the resource description and 
 * Microsoft Learn link. Designed to sit above the two-column detail grid
 * as a single-line intro section.
 * 
 * @param {Object} props
 * @param {Object} props.resource - Resource definition containing learnUrl and longDesc.
 * @param {string} props.displayDesc - Primary description text.
 * @param {Object} props.t - Shared tailwind class tokens.
 * @returns {JSX.Element}
 */
export function AboutBanner({ resource, displayDesc, t }) {
    const [isProviderCopied, setIsProviderCopied] = useState(false);

    const handleCopyProvider = (e) => {
        e.stopPropagation();
        if (resource.provider) {
            navigator.clipboard.writeText(resource.provider);
            setIsProviderCopied(true);
            setTimeout(() => setIsProviderCopied(false), 2000);
        }
    };

    return (
        <div className={`rounded-md border overflow-hidden ${t.card}`}>
            <div className="px-4 py-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                            <Info className={`w-3 h-3 shrink-0 ${t.muted}`} />
                            <span className={`text-[12px] font-semibold ${t.caption}`}>About this service</span>
                        </div>
                    </div>
                    <p className={`text-[13px] leading-[1.6] ${t.text}`}>
                        {resource.longDesc || displayDesc}
                    </p>
                    {(resource.learnUrl || resource.provider) && (
                        <div className="pt-1.5 flex flex-wrap items-center gap-3">
                            {resource.learnUrl && (
                                <a
                                    href={resource.learnUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] text-[12px] font-medium hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg viewBox="0 0 23 23" className="w-[14px] h-[14px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h11v11H0z" fill="#f35325"/>
                                        <path d="M12 0h11v11H12z" fill="#81bc06"/>
                                        <path d="M0 12h11v11H0z" fill="#05a6f0"/>
                                        <path d="M12 12h11v11H12z" fill="#ffba08"/>
                                    </svg>
                                    Microsoft Learn
                                    <ExternalLink className="w-3 h-3 ml-0.5 text-fluent-fg-tertiary" />
                                </a>
                            )}
                            <a
                                href={resource.pricingUrl || "https://azure.microsoft.com/pricing/calculator/"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] text-[12px] font-medium hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Calculator className="w-[14px] h-[14px] shrink-0 text-[#0078d4] dark:text-[#5eb3f9]" />
                                Pricing Calculator
                                <ExternalLink className="w-3 h-3 ml-0.5 text-fluent-fg-tertiary" />
                            </a>
                            {resource.provider && (
                                <div className="inline-flex items-center gap-0 overflow-hidden rounded-md border border-[#d1d1d1] dark:border-[#525252] shadow-sm">
                                    <div className="px-3 py-1.5 bg-fluent-bg-canvas text-fluent-fg-secondary text-[12px] font-mono border-r border-[#d1d1d1] dark:border-[#525252]">
                                        <span className="opacity-70 text-[11px] font-sans font-semibold uppercase tracking-wider mr-2 select-none">Provider</span>
                                        {resource.provider}
                                    </div>
                                    <button
                                        onClick={handleCopyProvider}
                                        className={`px-2.5 py-1.5 flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg ${isProviderCopied ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] text-[#107c10] dark:text-[#a3d4a3]' : 'bg-white dark:bg-[#292929] text-fluent-fg-secondary hover:bg-fluent-bg-hover'}`}
                                        title="Copy provider namespace"
                                    >
                                        {isProviderCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

AboutBanner.propTypes = {
    resource: PropTypes.object.isRequired,
    displayDesc: PropTypes.string,
    t: PropTypes.object.isRequired,
};

/**
 * GuidanceCard Component
 * 
 * Standalone card for deployment guidance and naming patterns.
 * Rendered as its own card within the detail grid, paired alongside NamingRules.
 * 
 * @param {Object} props
 * @param {string} props.namingPattern - Optional naming pattern to display in code block.
 * @param {string} props.namingGuidanceText - Verbose naming guidance text.
 * @param {Object} props.t - Shared tailwind class tokens.
 * @returns {JSX.Element|null}
 */
export function GuidanceCard({ namingPattern, namingGuidanceText, t }) {
    const [isCopied, setIsCopied] = useState(false);

    if (!namingPattern && !namingGuidanceText) return null;

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(namingPattern);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={`rounded-md border overflow-hidden flex flex-col flex-1 ${t.card}`}>
            <div className="px-4 py-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className={`w-3 h-3 ${t.muted}`} />
                    <span className={`text-[12px] font-semibold ${t.caption}`}>Deployment guidance</span>
                </div>
                {namingPattern && (
                    <div className={`mb-1.5 px-2.5 py-1.5 rounded-sm font-mono text-[12px] flex items-center justify-between gap-2 ${t.codeBlock}`}>
                        <span className="break-all">{namingPattern}</span>
                        <button
                            onClick={handleCopy}
                            className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-md border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg transition-colors ${isCopied ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-primary hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong'}`}
                            title="Copy deployment guidance"
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
        </div>
    );
}

GuidanceCard.propTypes = {
    namingPattern: PropTypes.string,
    namingGuidanceText: PropTypes.string,
    t: PropTypes.object.isRequired,
};

