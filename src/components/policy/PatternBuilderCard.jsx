import { useState, useMemo, memo, useCallback } from 'react';
import { Copy, Check, Edit3, Eye, Info, ChevronDown, ChevronUp, ExternalLink, Code2, Terminal, FileText } from 'lucide-react';
import { generateConditionalAccessTerraform, generateConditionalAccessJSON } from '../../utils/caExportUtils';
import FluentDropdown from '../shared/FluentDropdown';

const ALPHANUMERIC_REGEX = /[^a-zA-Z0-9-]/g;

const PERSONA_OPTIONS = [
    { value: 'AllUsers', label: 'All Users' },
    { value: 'Admins', label: 'Administrators' },
    { value: 'Guests', label: 'Guests / Externals' },
    { value: 'Internal', label: 'Internal Users' },
    { value: 'ServiceAccts', label: 'Service Accounts' },
    { value: 'AIAgents', label: 'AI Agents' },
    { value: 'VIPs', label: 'VIPs / Executives' },
    { value: 'Vendors', label: 'Vendors' },
    { value: 'BreakGlass', label: 'Break Glass Accounts' }
];

const RESOURCE_OPTIONS = [
    { value: 'AllApps', label: 'All Cloud Apps' },
    { value: 'O365', label: 'Office 365 Suite' },
    { value: 'AzurePortal', label: 'Azure Management' },
    { value: 'MsAdminPortals', label: 'MS Admin Portals' },
    { value: 'Exo', label: 'Exchange Online' },
    { value: 'Spo', label: 'SharePoint Online' },
    { value: 'Teams', label: 'Microsoft Teams' },
    { value: 'Intune', label: 'Microsoft Intune' },
    { value: 'Avd', label: 'Azure Virtual Desktop' },
    { value: 'Defender', label: 'Microsoft Defender' },
    { value: 'HighRiskApps', label: 'High Risk Apps' },
    { value: 'SecurityInfo', label: 'Security Info Registration' },
    { value: 'Custom', label: 'Custom App...' }
];

const PLATFORM_OPTIONS = [
    { value: 'AnyPlatform', label: 'Any Platform' },
    { value: 'UnknownPlatform', label: 'Unknown / Unsupported' },
    { value: 'Windows', label: 'Windows' },
    { value: 'macOS', label: 'macOS' },
    { value: 'iOS', label: 'iOS' },
    { value: 'Android', label: 'Android' },
    { value: 'Linux', label: 'Linux' }
];

const ACTION_OPTIONS = [
    { value: 'RequireMFA', label: 'Require Multi-factor Authentication' },
    { value: 'RequirePhishResist', label: 'Require Phishing-Resistant Multi-factor Authentication' },
    { value: 'RequireMfaForRisk', label: 'Require Multi-factor Authentication for Risk' },
    { value: 'RequirePasswordChange', label: 'Require Password Change' },
    { value: 'RequireCompliant', label: 'Require Compliant Device' },
    { value: 'AppProtection', label: 'Require App Protection' },
    { value: 'AppEnforced', label: 'App Enforced Restrictions' },
    { value: 'Block', label: 'Block Unknown Platforms' },
    { value: 'BlockHighRisk', label: 'Block High Risk' },
    { value: 'BlockInsiderRisk', label: 'Block Insider Risk' },
    { value: 'BlockLegacyAuth', label: 'Block Legacy Auth' },
    { value: 'BlockInteractive', label: 'Block Interactive Sign-in' },
    { value: 'SessionControl', label: 'Session Control' },
    { value: 'TermsOfUse', label: 'Terms of Use' },
    { value: 'Custom', label: 'Custom Requirement...' }
];

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

    // IaC Export State
    const [isExportExpanded, setIsExportExpanded] = useState(false);
    const [exportFormat, setExportFormat] = useState('terraform');
    const [exportCopied, setExportCopied] = useState(false);

    /**
     * Memoized generation of the final policy name string.
     * Incorporates custom action values if 'Custom' is selected.
     */
    const generatedName = useMemo(() => {
        const finalAction = action === 'Custom' ? (customAction || 'Custom') : action;
        const finalResource = resource === 'Custom' ? (customResource || 'Custom') : resource;
        return `${prefix}-${persona}-${finalResource}-${platform}-${finalAction}`;
    }, [prefix, persona, action, customAction, resource, customResource, platform]);

    const iacCode = useMemo(() => {
        const finalAction = action === 'Custom' ? (customAction || 'Custom') : action;
        const finalResource = resource === 'Custom' ? (customResource || 'Custom') : resource;
        if (exportFormat === 'terraform') {
            return generateConditionalAccessTerraform(generatedName, persona, finalResource, platform, finalAction);
        } else {
            return generateConditionalAccessJSON(generatedName, persona, finalResource, platform, finalAction);
        }
    }, [exportFormat, generatedName, persona, resource, customResource, platform, action, customAction]);

    const handleCopyIaC = useCallback(async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(iacCode);
            setExportCopied(true);
            setTimeout(() => setExportCopied(false), 2000);
        } catch (err) {
            console.error('Copy script failed', err);
        }
    }, [iacCode]);

    return (
        <div className="flex flex-col gap-3">
            {/* About / Introduction */}
            <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden mb-1">
                <div
                    className="px-3 py-1.5 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-fluent-bg-hover transition-colors"
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
                        {isGuidanceExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
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
                        <FluentDropdown
                            value={persona}
                            onChange={setPersona}
                            options={PERSONA_OPTIONS}
                            ariaLabel="Target Persona"
                            className="w-full sm:w-auto sm:min-w-[140px]"
                        />

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
                            <FluentDropdown
                                value={resource}
                                onChange={setResource}
                                options={RESOURCE_OPTIONS}
                                ariaLabel="Target Resource"
                                className="w-full sm:w-auto sm:min-w-[150px]"
                            />
                        )}

                        <span>from</span>
                        <FluentDropdown
                            value={platform}
                            onChange={setPlatform}
                            options={PLATFORM_OPTIONS}
                            ariaLabel="Client Platform"
                            className="w-full sm:w-auto sm:min-w-[140px]"
                        />

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
                            <FluentDropdown
                                value={action}
                                onChange={setAction}
                                options={ACTION_OPTIONS}
                                ariaLabel="Enforced Action"
                                className="w-full sm:w-auto sm:min-w-[200px]"
                            />
                        )}
                    </div>
                </div>

                {/* Live Preview — streamlined card integrated footer */}
                <div className="px-3 py-2 sm:px-4 sm:py-3 flex flex-wrap sm:flex-nowrap items-center gap-3 border-t border-fluent-stroke-subtle bg-fluent-bg-canvas dark:bg-fluent-bg-subtle">
                    <div className="flex items-center gap-2 shrink-0">
                        <Eye className="w-3.5 h-3.5 text-fluent-brand-fg" />
                        <span className="text-[12px] font-medium text-fluent-fg-tertiary">Preview</span>
                    </div>
                    
                    <div className="group/copy relative flex flex-1 items-center gap-2 px-3 py-1.5 min-h-[32px] min-w-0 rounded-[4px] border bg-fluent-brand-bg/5 hover:bg-fluent-brand-bg/10 border-fluent-brand-bg/20 transition-all">
                        <div className="flex-1 min-w-0 font-mono text-[13px] font-medium text-fluent-brand-fg truncate pr-20">
                            {generatedName}
                        </div>
                        <button
                            onClick={() => handleCopy(generatedName, 'live-pill')}
                            aria-label={copiedId === 'live-pill' ? 'Copied' : 'Copy name'}
                            className={`absolute right-1 top-1/2 -translate-y-1/2 shrink-0 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[4px] border text-[11px] font-medium transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg z-10 ${copiedId === 'live-pill' 
                                ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' 
                                : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-primary hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong'}`}
                        >
                            {copiedId === 'live-pill' ? <><Check className="w-3.5 h-3.5" /> <span>Copied</span></> : <><Copy className="w-3.5 h-3.5" /> <span>Copy</span></>}
                        </button>
                    </div>

                    <button
                        onClick={() => setIsExportExpanded(!isExportExpanded)}
                        className={`shrink-0 flex items-center justify-center gap-1.5 px-3 h-[32px] rounded-[4px] border text-[12px] font-medium transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg active:scale-95 ${isExportExpanded ? 'bg-fluent-bg-subtle border-fluent-stroke-strong text-fluent-fg-primary' : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'}`}
                    >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{isExportExpanded ? 'Hide IAC Template' : 'Export IAC Template'}</span>
                    </button>
                </div>

                {isExportExpanded && (
                    <div className="border-t border-fluent-stroke-subtle bg-fluent-bg-canvas flex flex-col">
                        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle">
                            <div className="flex shrink-0 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-md p-0.5 w-full sm:w-auto">
                                <button
                                    onClick={() => setExportFormat('terraform')}
                                    className={`flex-1 sm:flex-none text-[12px] px-3 py-1.5 font-medium rounded-sm transition-all duration-200 ease-in-out active:scale-95 inline-flex items-center justify-center gap-1.5 ${exportFormat === 'terraform' 
                                        ? 'bg-fluent-bg-card text-fluent-brand-fg shadow-sm border border-fluent-stroke-subtle' 
                                        : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'}`}
                                >
                                    <Terminal className="w-3.5 h-3.5" />
                                    Terraform
                                </button>
                                <button
                                    onClick={() => setExportFormat('json')}
                                    className={`flex-1 sm:flex-none text-[12px] px-3 py-1.5 font-medium rounded-sm transition-all duration-200 ease-in-out active:scale-95 inline-flex items-center justify-center gap-1.5 ${exportFormat === 'json' 
                                        ? 'bg-fluent-bg-card text-fluent-brand-fg shadow-sm border border-fluent-stroke-subtle' 
                                        : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'}`}
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    JSON Payload
                                </button>
                            </div>
                            <button
                                onClick={handleCopyIaC}
                                className={`flex-1 sm:flex-none px-3 h-[32px] rounded-[4px] text-[13px] font-medium transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 border active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 ${exportCopied 
                                    ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' 
                                    : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary'}`}
                                title="Copy deployment code"
                            >
                                {exportCopied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                                <span>{exportCopied ? 'Copied' : 'Copy Code'}</span>
                            </button>
                        </div>
                        <div className="bg-[#1E1E1E] w-full relative">
                            <pre className="text-[13px] leading-relaxed font-mono overflow-auto p-5 text-[#D4D4D4] m-0 max-h-[300px]">
                                <code>{iacCode}</code>
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(PatternBuilderCard);
