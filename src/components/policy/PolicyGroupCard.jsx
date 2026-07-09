import { useState, memo, useEffect } from 'react';
import { Copy, Check, ExternalLink, ChevronDown, ChevronUp, Settings, Users, Lock, BadgeCheck, AlertCircle, Info } from 'lucide-react';
import { getReadableTitle } from '../../data/conditionalAccessData';

const PolicyGroupCard = ({ requirement, policies, copiedId, handleCopy, globalExpandState }) => {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsExpanded(globalExpandState || false);
    }, [globalExpandState]);

    // Clamp the index to ensure it's always valid when the policies array shrinks
    const activeIndex = selectedIdx < policies.length ? selectedIdx : 0;
    const activePolicy = policies[activeIndex];

    if (!activePolicy) return null;

    const readableTitle = getReadableTitle(requirement);

    const isCopied = copiedId === activePolicy.name;

    const formatTarget = (policyName) => {
        const parts = policyName.split('-');
        if (parts.length < 5) return policyName;
        
        const splitCamelCase = (str) => {
            return str
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
                .trim();
        };

        const persona = splitCamelCase(parts[1]);
        const resource = splitCamelCase(parts[2]);
        return `${persona} → ${resource}`;
    };

    return (
        <div className="group flex flex-col bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft dark:shadow-none hover:shadow-md hover:border-fluent-stroke-strong transition-all duration-200">
            <div className="p-4 flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center">

                {/* Left Side: Name, Target Dropdown, Badges */}
                <div className="flex flex-col gap-3 lg:w-[45%] shrink-0 min-w-0">
                    <div className="flex items-start gap-2.5">
                        <div className="flex flex-col min-w-0 w-full">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-[14px] font-semibold text-fluent-fg-primary truncate" title={readableTitle}>
                                    {readableTitle}
                                </h3>
                            </div>

                            {/* Target Dropdown */}
                            {policies.length > 1 ? (
                                <select
                                    className="mt-2 w-full max-w-[300px] px-2 h-[28px] border rounded text-[12px] font-medium bg-fluent-bg-canvas border-fluent-stroke-subtle text-fluent-fg-primary outline-none focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg/20 transition-all cursor-pointer"
                                    value={activeIndex}
                                    onChange={(e) => setSelectedIdx(Number(e.target.value))}
                                >
                                    {policies.map((p, idx) => (
                                        <option key={p.name} value={idx}>{formatTarget(p.name)}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="mt-2 text-[12px] font-medium text-fluent-fg-tertiary">
                                    Target: <span className="text-fluent-fg-primary">{formatTarget(activePolicy.name)}</span>
                                </div>
                            )}

                            <div className="mt-3 flex items-start sm:items-center gap-2 w-full min-w-0">
                                <span className="font-mono text-[12px] text-fluent-brand-fg bg-fluent-info-bg px-1.5 py-0.5 rounded break-all border border-fluent-info-border dark:border-transparent flex-1 min-w-0">
                                    {activePolicy.name}
                                </span>
                                <button
                                    onClick={() => handleCopy(activePolicy.name, activePolicy.name)}
                                    className={`shrink-0 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg ${isCopied 
                                        ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' 
                                        : 'border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39]'}`}
                                    title="Copy Name"
                                >
                                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1.5 flex-wrap">
                        {activePolicy.categories.map((cat, idx) => (
                            <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-fluent-bg-subtle text-fluent-fg-tertiary border border-fluent-stroke-subtle">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Divider for desktop */}
                <div className="hidden lg:block w-px self-stretch bg-fluent-stroke-subtle my-1"></div>

                {/* Right Side: Description */}
                <div className="flex flex-col gap-3 lg:w-[55%] flex-1">
                    <p className="text-[13px] leading-relaxed text-fluent-fg-secondary">
                        {activePolicy.desc}
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                        {activePolicy.settings && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-fit text-fluent-fg-primary hover:text-fluent-brand-fg flex items-center gap-1.5 text-[12px] font-medium transition-colors"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                {isExpanded ? 'Hide Settings' : 'View Settings'}
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                        )}
                        {activePolicy.link && (
                            <a
                                href={activePolicy.link}
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
                    </div>
                </div>
            </div>

            {/* Expanded Settings View */}
            {isExpanded && activePolicy.settings && (() => {
                const assignments = activePolicy.settings.filter(s => ['Users', 'Workload identities', 'Target resources', 'Conditions'].includes(s.label));
                const accessControls = activePolicy.settings.filter(s => ['Grant', 'Session'].includes(s.label));

                const requiresP2 = activePolicy.settings.some(s => s.value.toLowerCase().includes('risk'));
                const licenseRequired = requiresP2 ? 'Microsoft Entra ID P2' : 'Microsoft Entra ID P1';

                return (
                    <div className="border-t border-fluent-stroke-subtle bg-fluent-bg-canvas rounded-b-lg p-4 animate-slide-up">
                        <div className="flex flex-col md:flex-row gap-4">
                            
                            {/* Assignments Column */}
                            {assignments.length > 0 && (
                                <div className="flex-1 bg-fluent-bg-card border border-fluent-stroke-subtle rounded-md p-3.5 shadow-sm dark:shadow-none">
                                    <h4 className="text-[13px] font-bold text-fluent-fg-primary mb-3 flex items-center gap-2 border-b border-fluent-stroke-subtle pb-2">
                                        <Users className="w-4 h-4 text-fluent-brand-fg" />
                                        Assignments
                                    </h4>
                                    <div className="flex flex-col gap-4">
                                        {assignments.map((setting, idx) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wide">
                                                    {setting.label}
                                                </span>
                                                <div className="text-[13px] text-fluent-fg-primary leading-relaxed">
                                                    {setting.value.split('\n').map((line, i) => {
                                                        if (line.startsWith('Include:')) return (
                                                            <div key={i} className="flex items-start gap-2 mt-1"><span className="text-fluent-cat-green-fg font-bold mt-[1px]">+</span><span className="break-words min-w-0 break-all sm:break-normal"><strong className="font-semibold text-fluent-fg-primary">Include:</strong> {line.replace('Include:', '').trim()}</span></div>
                                                        );
                                                        if (line.startsWith('Exclude:')) return (
                                                            <div key={i} className="flex items-start gap-2 mt-1"><span className="text-fluent-cat-red-fg font-bold mt-[1px]">-</span><span className="break-words min-w-0 break-all sm:break-normal"><strong className="font-semibold text-fluent-fg-primary">Exclude:</strong> {line.replace('Exclude:', '').trim()}</span></div>
                                                        );
                                                        const colonIdx = line.indexOf(':');
                                                        if (colonIdx > -1 && colonIdx < 30) {
                                                            return <div key={i} className="flex items-start gap-2 mt-1"><span className="w-1 h-1 rounded-full bg-fluent-brand-fg mt-[9px] shrink-0"></span><span className="break-words min-w-0 break-all sm:break-normal"><strong className="font-semibold text-fluent-fg-primary">{line.substring(0, colonIdx)}:</strong>{line.substring(colonIdx + 1)}</span></div>;
                                                        }
                                                        return <div key={i} className="mt-1">{line}</div>;
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Access Controls Column */}
                            {accessControls.length > 0 && (
                                <div className="flex-1 bg-fluent-bg-card border border-fluent-stroke-subtle rounded-md p-3.5 shadow-sm dark:shadow-none">
                                    <h4 className="text-[13px] font-bold text-fluent-fg-primary mb-3 flex items-center gap-2 border-b border-fluent-stroke-subtle pb-2">
                                        <Lock className="w-4 h-4 text-fluent-brand-fg" />
                                        Access controls
                                    </h4>
                                    <div className="flex flex-col gap-4">
                                        {accessControls.map((setting, idx) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wide">
                                                    {setting.label}
                                                </span>
                                                <div className="text-[13px] text-fluent-fg-primary leading-relaxed">
                                                    {setting.value.split('\n').map((line, i) => {
                                                        if (line.includes('->')) {
                                                            const parts = line.split('->');
                                                            return (
                                                                <div key={i} className="flex items-center flex-wrap gap-2 mt-1">
                                                                    <span className="bg-fluent-bg-canvas border border-fluent-stroke-subtle px-1.5 py-0.5 rounded text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wide">{parts[0].trim()}</span>
                                                                    <span className="text-fluent-brand-fg font-bold">→</span>
                                                                    <span className="font-semibold text-fluent-fg-primary">{parts[1].trim()}</span>
                                                                </div>
                                                            );
                                                        }
                                                        if (line.startsWith('Block access')) return (
                                                            <div key={i} className="flex items-center gap-2 mt-1"><span className="w-2 h-2 rounded-full bg-[#d13438]"></span><span className="font-semibold text-[#d13438] dark:text-[#f8b2b6]">{line}</span></div>
                                                        );
                                                        const colonIdx = line.indexOf(':');
                                                        if (colonIdx > -1 && colonIdx < 30) {
                                                            return <div key={i} className="flex items-start gap-2 mt-1"><span className="w-1 h-1 rounded-full bg-fluent-brand-fg mt-[9px] shrink-0"></span><span><strong className="font-semibold text-fluent-fg-primary">{line.substring(0, colonIdx)}:</strong>{line.substring(colonIdx + 1)}</span></div>;
                                                        }
                                                        return <div key={i} className="mt-1">{line}</div>;
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Policy Metadata Summary */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-fluent-stroke-subtle">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4 text-fluent-brand-fg" />
                                <span className="text-[12px] font-medium text-fluent-fg-primary">
                                    <span className="text-fluent-fg-tertiary mr-1.5 font-normal">License required:</span>
                                    {licenseRequired}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-[#ffaa44]" />
                                <span className="text-[12px] font-medium text-fluent-fg-primary">
                                    <span className="text-fluent-fg-tertiary mr-1.5 font-normal">Recommended state:</span>
                                    Report-only mode
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-fluent-cat-green-fg" />
                                <span className="text-[12px] font-medium text-fluent-fg-primary">
                                    <span className="text-fluent-fg-tertiary mr-1.5 font-normal">Exclusions:</span>
                                    Ensure break-glass access
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default memo(PolicyGroupCard);
