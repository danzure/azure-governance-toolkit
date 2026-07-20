import { useState, useMemo, memo } from 'react';
import { Copy, Check, Edit3, Eye, Info, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

const ALPHANUMERIC_REGEX = /[^a-zA-Z0-9-]/g;
const selectClasses = "px-2.5 h-[32px] min-w-0 w-full sm:w-auto sm:min-w-[120px] sm:flex-1 border rounded outline-none text-[13px] transition-colors duration-200 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong hover:border-fluent-fg-primary focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 cursor-pointer text-ellipsis";

function PatternBuilderCard({ copiedId, handleCopy }) {
    // Policy naming parts
    const [prefix, setPrefix] = useState('CA');
    const [persona, setPersona] = useState('AllUsers');
    const [action, setAction] = useState('RequireMFA');
    const [customAction, setCustomAction] = useState('');
    const [resource, setResource] = useState('AllApps');
    const [customResource, setCustomResource] = useState('');
    const [platform, setPlatform] = useState('AnyPlatform');
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);

    /**
     * Memoized generation of the final policy name string.
     * Incorporates custom action values if 'Custom' is selected.
     */
    const generatedName = useMemo(() => {
        const finalAction = action === 'Custom' ? (customAction || 'Custom') : action;
        const finalResource = resource === 'Custom' ? (customResource || 'Custom') : resource;
        return `${prefix}-${persona}-${finalResource}-${platform}-${finalAction}`;
    }, [prefix, persona, action, customAction, resource, customResource, platform]);

    return (
        <div className="animate-slide-up flex flex-col gap-3">
            {/* About / Introduction */}
            <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden mb-1">
                <div
                    className="px-3 py-2.5 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
                    role="button"
                    aria-expanded={isGuidanceExpanded}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsGuidanceExpanded(!isGuidanceExpanded);
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 flex-shrink-0 text-fluent-brand-fg" />
                        <p className="text-fluent-fg-primary text-[13px]">
                            How to use this tool
                        </p>
                        {isGuidanceExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-0.5" /> : <ChevronRight className="w-3.5 h-3.5 ml-0.5" />}
                    </div>
                    {isGuidanceExpanded && (
                        <div className="mt-3 flex flex-col gap-3 text-[13px] text-fluent-info-text dark:text-fluent-fg-secondary cursor-default" onClick={(e) => e.stopPropagation()}>
                            <p>
                                This tool generates standardized <a href="https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Microsoft Entra Conditional Access policies <ExternalLink className="w-3 h-3 ml-0.5" /></a> naming conventions aligned with the <a href="https://learn.microsoft.com/azure/cloud-adoption-framework/" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Cloud Adoption Framework (CAF) <ExternalLink className="w-3 h-3 ml-0.5" /></a>.
                            </p>
                            <ul className="list-disc pl-5 ml-2 flex flex-col gap-2">
                                <li><strong>Build Pattern:</strong> Select the prefix, persona, platform, and action in the Pattern Builder to generate a standardized policy name.</li>
                                <li><strong>Customize Components:</strong> Toggle optional components like network conditions or MFA requirements as needed.</li>
                                <li><strong>Apply Policy:</strong> Copy the generated name and apply it to your Microsoft Entra Conditional Access policies for consistent naming.</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Pattern Builder */}
            <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 lg:p-5">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-fluent-stroke-subtle">
                        <Edit3 className="w-4 h-4 text-fluent-brand-fg" />
                        <h3 className="text-[14px] font-semibold text-fluent-fg-primary">Pattern Builder</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-3 gap-x-2 text-[14px] text-fluent-fg-secondary leading-relaxed">
                        <span>Create a policy starting with</span>
                        <input
                            type="text"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            className="px-2 h-[32px] border rounded outline-none text-[13px] font-mono transition-colors duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong w-[60px] text-center placeholder:text-fluent-fg-tertiary"
                        />

                        <span>that applies to</span>
                        <select
                            value={persona}
                            onChange={(e) => setPersona(e.target.value)}
                            className={selectClasses}
                        >
                            <option value="AllUsers">All Users</option>
                            <option value="Admins">Administrators</option>
                            <option value="Guests">Guests / Externals</option>
                            <option value="Internal">Internal Users</option>
                            <option value="ServiceAccts">Service Accounts</option>
                            <option value="AIAgents">AI Agents</option>
                            <option value="VIPs">VIPs / Executives</option>
                            <option value="Vendors">Vendors</option>
                            <option value="BreakGlass">Break Glass Accounts</option>
                        </select>

                        <span>when they access</span>
                        {resource === 'Custom' ? (
                            <div className="relative flex items-center flex-1 min-w-[120px]">
                                <input
                                    type="text"
                                    value={customResource}
                                    onChange={(e) => setCustomResource(e.target.value.replace(ALPHANUMERIC_REGEX, ''))}
                                    placeholder="e.g. SalesApp"
                                    className="flex-1 min-w-0 w-full px-3 h-[32px] pr-7 border rounded outline-none text-[13px] font-mono transition-colors duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary text-ellipsis"
                                    maxLength={30}
                                    autoFocus
                                />
                                <button
                                    onClick={() => { setResource('AllApps'); setCustomResource(''); }}
                                    className="absolute right-1 w-5 h-5 flex items-center justify-center rounded-sm hover:bg-fluent-bg-hover text-fluent-brand-fg"
                                    title="Revert to list"
                                >
                                    <span className="text-[16px] leading-none mb-[2px]">&times;</span>
                                </button>
                            </div>
                        ) : (
                            <select
                                value={resource}
                                onChange={(e) => setResource(e.target.value)}
                                className={selectClasses}
                            >
                                <option value="AllApps">All Cloud Apps</option>
                                <option value="O365">Office 365 Suite</option>
                                <option value="AzurePortal">Azure Management</option>
                                <option value="MsAdminPortals">MS Admin Portals</option>
                                <option value="Exo">Exchange Online</option>
                                <option value="Spo">SharePoint Online</option>
                                <option value="Teams">Microsoft Teams</option>
                                <option value="Intune">Microsoft Intune</option>
                                <option value="Avd">Azure Virtual Desktop</option>
                                <option value="Defender">Microsoft Defender</option>
                                <option value="HighRiskApps">High Risk Apps</option>
                                <option value="SecurityInfo">Security Info Registration</option>
                                <option value="Custom">Custom App...</option>
                            </select>
                        )}

                        <span>from</span>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className={selectClasses}
                        >
                            <option value="AnyPlatform">Any Platform</option>
                            <option value="UnknownPlatform">Unknown / Unsupported</option>
                            <option value="Windows">Windows</option>
                            <option value="macOS">macOS</option>
                            <option value="iOS">iOS</option>
                            <option value="Android">Android</option>
                            <option value="Linux">Linux</option>
                        </select>

                        <span>and enforces</span>
                        {action === 'Custom' ? (
                            <div className="relative flex items-center flex-1 min-w-[120px]">
                                <input
                                    type="text"
                                    value={customAction}
                                    onChange={(e) => setCustomAction(e.target.value.replace(ALPHANUMERIC_REGEX, ''))}
                                    placeholder="e.g. BlockNonCompliant"
                                    className="flex-1 min-w-0 w-full px-3 h-[32px] pr-7 border rounded outline-none text-[13px] font-mono transition-colors duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary text-ellipsis"
                                    maxLength={30}
                                    autoFocus
                                />
                                <button
                                    onClick={() => { setAction('RequireMFA'); setCustomAction(''); }}
                                    className="absolute right-1 w-5 h-5 flex items-center justify-center rounded-sm hover:bg-fluent-bg-hover text-fluent-brand-fg"
                                    title="Revert to list"
                                >
                                    <span className="text-[16px] leading-none mb-[2px]">&times;</span>
                                </button>
                            </div>
                        ) : (
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className={selectClasses}
                            >
                                <option value="RequireMFA">Require Multi-factor Authentication</option>
                                <option value="RequirePhishResist">Require Phishing-Resistant Multi-factor Authentication</option>
                                <option value="RequireMfaForRisk">Require Multi-factor Authentication for Risk</option>
                                <option value="RequirePasswordChange">Require Password Change</option>
                                <option value="RequireCompliant">Require Compliant Device</option>
                                <option value="AppProtection">Require App Protection</option>
                                <option value="AppEnforced">App Enforced Restrictions</option>
                                <option value="Block">Block Unknown Platforms</option>
                                <option value="BlockHighRisk">Block High Risk</option>
                                <option value="BlockInsiderRisk">Block Insider Risk</option>
                                <option value="BlockLegacyAuth">Block Legacy Auth</option>
                                <option value="BlockInteractive">Block Interactive Sign-in</option>
                                <option value="SessionControl">Session Control</option>
                                <option value="TermsOfUse">Terms of Use</option>
                                <option value="Custom">Custom Requirement...</option>
                            </select>
                        )}
                    </div>
                </div>

                {/* Live Preview — streamlined card integrated footer */}
                <div className="px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-3 border-t border-fluent-stroke-subtle bg-fluent-bg-canvas dark:bg-fluent-bg-subtle">
                    <div className="flex items-center gap-2 shrink-0">
                        <Eye className="w-3.5 h-3.5 text-fluent-brand-fg" />
                        <span className="text-[12px] font-medium text-fluent-fg-tertiary">Preview</span>
                    </div>
                    <div className="flex-1 px-3 py-1.5 rounded font-mono text-[12px] sm:text-[14px] font-semibold tracking-wide bg-fluent-bg-card text-fluent-brand-fg border border-fluent-stroke-subtle dark:border-transparent truncate overflow-x-auto scrollbar-hide">
                        {generatedName}
                    </div>
                    <button
                        onClick={() => handleCopy(generatedName, 'live-pill')}
                        className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-colors inline-flex items-center justify-center gap-1.5 border ${copiedId === 'live-pill'
                            ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]'
                            : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                            }`}
                    >
                        {copiedId === 'live-pill' ? <><Check className="w-3.5 h-3.5" /> <span>Copied</span></> : <><Copy className="w-3.5 h-3.5" /> <span>Copy</span></>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(PatternBuilderCard);
