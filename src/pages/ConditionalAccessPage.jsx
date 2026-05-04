import { useState, useMemo } from 'react';
import { Copy, Shield, Check, Edit3, Eye, Info, ExternalLink } from 'lucide-react';

/**
 * Collection of pre-configured Microsoft Entra Conditional Access policies.
 * Each object defines the standard naming convention, aligned categories based on Microsoft documentation,
 * an explanatory description, and a link to the official Microsoft Learn guidance.
 * 
 * @constant {Array<Object>}
 * @property {string} name - The generated policy name following the [Prefix]-[Persona]-[Resource]-[Platform]-[Action] structure.
 * @property {Array<string>} categories - Arrays of tags (e.g., 'Secure Foundation', 'Zero Trust') that the policy fulfills.
 * @property {string} desc - A description of what the policy enforces and its security purpose.
 * @property {string} link - URL to the Microsoft Learn documentation for this specific template.
 */
const PREMADE_POLICIES = [
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMFA', categories: ['Secure Foundation', 'Zero Trust', 'Remote Work'], desc: 'Enforces multi-factor authentication (MFA) for all users accessing any cloud application. This is the baseline defense against compromised credentials.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-mfa-strength' },
    { name: 'CA-Admins-AllApps-AnyPlatform-RequireMFA', categories: ['Secure Foundation', 'Zero Trust', 'Protect Administrator'], desc: 'Enforces multi-factor authentication specifically for privileged administrative roles across all applications to protect highly sensitive accounts.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-admin' },
    { name: 'CA-Admins-MsAdminPortals-AnyPlatform-RequireMFA', categories: ['Secure Foundation', 'Zero Trust'], desc: 'Requires multi-factor authentication whenever administrators attempt to access Microsoft admin portals (like the Entra or Azure portal).', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-admin-portals' },
    { name: 'CA-AllUsers-AzurePortal-AnyPlatform-RequireMFA', categories: ['Secure Foundation', 'Zero Trust', 'Protect Administrator'], desc: 'Enforces multi-factor authentication for any user attempting to access Azure management endpoints (e.g., Azure Resource Manager).', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-BlockLegacyAuth', categories: ['Secure Foundation', 'Zero Trust', 'Remote Work', 'Protect Administrator'], desc: 'Blocks older, non-modern authentication protocols (like POP3/IMAP) that do not support MFA, heavily reducing password spray attack surfaces.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication' },
    { name: 'CA-AllUsers-SecurityInfo-AnyPlatform-RequireMFA', categories: ['Secure Foundation', 'Zero Trust', 'Remote Work'], desc: 'Requires users to be on a trusted network or use MFA when registering or modifying their security info (MFA methods or SSPR).', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-security-info-registration' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireCompliant', categories: ['Secure Foundation', 'Zero Trust', 'Remote Work', 'Protect Administrator'], desc: 'Requires devices to be marked as compliant by Intune or be Hybrid Entra joined to access organizational data.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance' },
    
    { name: 'CA-Guests-AllApps-AnyPlatform-RequireMFA', categories: ['Zero Trust', 'Remote Work'], desc: 'Ensures that external and guest users are required to perform multi-factor authentication before accessing your tenant\'s resources.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-guest' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMfaForRisk', categories: ['Zero Trust', 'Remote Work'], desc: 'Dynamically requires MFA when Microsoft Entra ID Protection detects a medium or high risk during the sign-in process.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-sign-in' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequirePasswordChange', categories: ['Zero Trust', 'Remote Work'], desc: 'Forces a password change when a user\'s overall identity risk is deemed high, mitigating compromised accounts.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-user' },
    { name: 'CA-AllUsers-AllApps-UnknownPlatform-Block', categories: ['Zero Trust', 'Remote Work'], desc: 'Blocks access from device platforms that are not officially supported or recognized by your organization.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-unknown-unsupported' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-SessionControl', categories: ['Zero Trust', 'Remote Work'], desc: 'Prevents users from remaining signed in after closing their browser window, forcing re-authentication on the next launch.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-persistent-browser' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-AppProtection', categories: ['Zero Trust', 'Remote Work'], desc: 'Requires users to access data using approved client applications or applications protected by Intune App Protection Policies.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-BlockInsiderRisk', categories: ['Zero Trust'], desc: 'Blocks access for users who have been flagged with a high insider risk severity by Microsoft Purview.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-insider-block' },

    { name: 'CA-Admins-AzurePortal-AnyPlatform-RequirePhishResist', categories: ['Protect Administrator'], desc: 'Requires the highest strength MFA (like FIDO2 security keys or Windows Hello) for administrators accessing sensitive management portals.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-admin-phish-resistant-mfa' },
    { name: 'CA-Admins-AllApps-AnyPlatform-RequireCompliant', categories: ['Protect Administrator', 'Remote Work'], desc: 'Requires devices to be marked as compliant by Intune or be Hybrid Entra joined specifically for administrators.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-alt-admin-device-compliand-hybrid' },
    
    { name: 'CA-AllUsers-AllApps-AnyPlatform-AppEnforced', categories: ['Remote Work'], desc: 'Uses application enforced restrictions to limit data access from unmanaged or remote work devices.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-app-enforced-restrictions' },

    { name: 'CA-AIAgents-AllApps-AnyPlatform-BlockHighRisk', categories: ['AI Agents'], desc: 'Blocks workload identities and AI agents from accessing resources if they exhibit high-risk behavior.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-agent-block-high-risk' }
];

/**
 * The Conditional Access Policy Builder Page component.
 * Provides an interactive UI to generate standardized Microsoft Entra Conditional Access policy names.
 * Allows users to construct names from various parts (Prefix, Persona, Resource, Platform, Requirement)
 * or to view and copy from a curated list of Microsoft-recommended defaults.
 * 
 * @returns {JSX.Element} The rendered Conditional Access page.
 */
export default function ConditionalAccessPage() {
    // Policy naming parts
    const [prefix, setPrefix] = useState('CA');
    const [persona, setPersona] = useState('AllUsers');
    const [action, setAction] = useState('RequireMFA');
    const [customAction, setCustomAction] = useState('');
    const [resource, setResource] = useState('AllApps');
    const [platform, setPlatform] = useState('AnyPlatform');
    
    // UI state for copy feedback
    const [copiedId, setCopiedId] = useState(null);

    /**
     * Memoized generation of the final policy name string.
     * Incorporates custom action values if 'Custom' is selected.
     * 
     * @returns {string} The fully constructed policy name.
     */
    const generatedName = useMemo(() => {
        const finalAction = action === 'Custom' ? (customAction || 'Custom') : action;
        return `${prefix}-${persona}-${resource}-${platform}-${finalAction}`;
    }, [prefix, persona, action, customAction, resource, platform]);

    /**
     * Asynchronously copies the provided text to the user's clipboard and triggers temporary UI feedback.
     * 
     * @param {string} text - The string value to copy to the clipboard.
     * @param {string} id - A unique identifier to track which element triggered the copy (for setting UI state).
     */
    const handleCopy = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    const inputClasses = "px-2.5 h-[28px] border rounded outline-none text-[13px] transition-all duration-200 focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 bg-white dark:bg-[#252423] text-[#201f1e] dark:text-white border-[#8a8886] dark:border-[#605e5c]";
    const labelClasses = "text-[12px] font-medium text-right text-[#616161] dark:text-[#c8c6c4]";

    return (
        <div className="pt-12">
            <nav className="mt-[48px] shadow-sm transition-all border-b bg-white dark:bg-[#252423] border-[#edebe9] dark:border-[#484644]">
                <div className="max-w-[1600px] mx-auto px-4 py-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-[16px] font-semibold text-[#242424] dark:text-white">Conditional Access</h2>
                            <p className="text-[13px] text-[#616161] dark:text-[#a19f9d]">Policy naming generator</p>
                        </div>
                    </div>

                    <div className="animate-slide-up">
                        {/* Two-column grid: Parameters + About */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {/* About / Introduction */}
                            <div className="order-1 lg:order-2 p-3 rounded-lg border shadow-soft bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <h3 className="text-[14px] font-semibold text-[#201f1e] dark:text-white">About This Tool</h3>
                                </div>
                                <div className="text-[13px] leading-relaxed space-y-2 text-[#616161] dark:text-[#c8c6c4]">
                                    <p>
                                        Generate consistent naming conventions for Microsoft Entra Conditional Access policies based on best practices.
                                    </p>
                                    <p>
                                        Use the builder to configure your policy naming elements. The structure defaults to <strong>Prefix - Persona - Resource - Requirement</strong> to ensure optimal manageability and auditing. Below, you can find a list of common Microsoft default policies to easily copy.
                                    </p>
                                </div>
                            </div>

                            {/* Parameters Builder */}
                            <div className="order-2 lg:order-1 p-3 rounded-lg border shadow-soft bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Edit3 className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <h3 className="text-[14px] font-semibold text-[#201f1e] dark:text-white">Policy Builder</h3>
                                </div>
                                {/* Form grid - label left, input right */}
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
                                    {/* Prefix */}
                                    <label className={labelClasses}>Prefix</label>
                                    <input 
                                        type="text" 
                                        value={prefix}
                                        onChange={(e) => setPrefix(e.target.value)}
                                        className={inputClasses}
                                    />

                                    {/* Persona */}
                                    <label className={labelClasses}>Persona</label>
                                    <select 
                                        value={persona}
                                        onChange={(e) => setPersona(e.target.value)}
                                        className={inputClasses}
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

                                    {/* Resource */}
                                    <label className={labelClasses}>Resource</label>
                                    <select 
                                        value={resource}
                                        onChange={(e) => setResource(e.target.value)}
                                        className={inputClasses}
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
                                    </select>

                                    {/* Platform */}
                                    <label className={labelClasses}>Platform</label>
                                    <select 
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                        className={inputClasses}
                                    >
                                        <option value="AnyPlatform">Any Platform</option>
                                        <option value="UnknownPlatform">Unknown / Unsupported</option>
                                        <option value="Windows">Windows</option>
                                        <option value="macOS">macOS</option>
                                        <option value="iOS">iOS</option>
                                        <option value="Android">Android</option>
                                        <option value="Linux">Linux</option>
                                    </select>

                                    {/* Action / Requirement */}
                                    <label className={labelClasses}>Requirement</label>
                                    <div className="flex flex-col gap-2 w-full">
                                        <select 
                                            value={action}
                                            onChange={(e) => setAction(e.target.value)}
                                            className={inputClasses}
                                        >
                                            <option value="RequireMFA">Require MFA</option>
                                            <option value="RequirePhishResist">Require Phishing-Resistant MFA</option>
                                            <option value="RequireMfaForRisk">Require MFA for Risk</option>
                                            <option value="RequirePasswordChange">Require Password Change</option>
                                            <option value="RequireCompliant">Require Compliant Device</option>
                                            <option value="AppProtection">Require App Protection</option>
                                            <option value="AppEnforced">App Enforced Restrictions</option>
                                            <option value="Block">Block Access</option>
                                            <option value="BlockHighRisk">Block High Risk</option>
                                            <option value="BlockInsiderRisk">Block Insider Risk</option>
                                            <option value="BlockLegacyAuth">Block Legacy Auth</option>
                                            <option value="BlockInteractive">Block Interactive Sign-in</option>
                                            <option value="SessionControl">Session Control</option>
                                            <option value="TermsOfUse">Terms of Use</option>
                                            <option value="Custom">Custom Requirement...</option>
                                        </select>
                                        
                                        {action === 'Custom' && (
                                            <input
                                                type="text"
                                                value={customAction}
                                                onChange={(e) => setCustomAction(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                                                placeholder="e.g. BlockNonCompliant"
                                                className={inputClasses}
                                                maxLength={30}
                                                autoFocus
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Preview — streamlined card integrated footer */}
                        <div className="mt-3 rounded-lg border bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644] shadow-soft dark:shadow-none">
                            <div className="px-3 py-2 flex items-center gap-3 border-[#edebe9] dark:border-[#484644] bg-[#faf9f8] dark:bg-[#1b1a19] rounded-lg">
                                <div className="flex items-center gap-2 shrink-0">
                                    <Eye className="w-3.5 h-3.5 text-[#0078d4]" />
                                    <span className="text-[12px] font-medium text-[#616161] dark:text-[#a19f9d]">Preview</span>
                                </div>
                                <div className="flex-1 px-3 py-1.5 rounded font-mono text-[14px] font-semibold tracking-wide bg-white dark:bg-[#252423] text-[#0078d4] dark:text-[#60cdff] border border-[#edebe9] dark:border-transparent truncate">
                                    {generatedName}
                                </div>
                                <button
                                    onClick={() => handleCopy(generatedName, 'live-pill')}
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
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto px-4 pt-6 pb-12 space-y-5">
                {/* Pre-made Policies Section - styled like ResourceCards */}
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-[#0078d4]" />
                    <h2 className="text-[16px] font-semibold text-[#242424] dark:text-white">Common Microsoft Defaults</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {PREMADE_POLICIES.map((policy) => {
                        const isCopied = copiedId === policy.name;
                        return (
                            <div key={policy.name} className="h-full flex flex-col bg-white dark:bg-[#1b1a19] rounded-lg border border-[#edebe9] dark:border-[#323130] shadow-soft dark:shadow-none hover:shadow-md dark:hover:border-[#605e5c] transition-all duration-200">
                                {/* Card Header */}
                                <div className="p-3 border-b border-[#edebe9] dark:border-[#323130] flex items-center justify-between bg-[#faf9f8] dark:bg-[#252423] rounded-t-lg">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                            <Shield className="w-4 h-4 text-[#0078d4] dark:text-[#60cdff]" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <h3 className="text-[13px] font-semibold text-[#242424] dark:text-white truncate" title={policy.name}>
                                                {policy.name.split('-')[1]} Policy
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Generated Name Pill */}
                                <div className="px-3 pt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 px-2.5 py-1.5 rounded bg-[#f3f2f1] dark:bg-[#292827] border border-transparent dark:border-[#484644] font-mono text-[12px] font-semibold text-[#0078d4] dark:text-[#60cdff] truncate" title={policy.name}>
                                            {policy.name}
                                        </div>
                                        <button
                                            onClick={() => handleCopy(policy.name, policy.name)}
                                            className={`shrink-0 w-8 h-8 flex items-center justify-center rounded transition-colors ${
                                                isCopied
                                                    ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] text-[#107c10] dark:text-[#a3d4a3]'
                                                    : 'bg-[#f3f2f1] dark:bg-[#323130] text-[#605e5c] dark:text-[#a19f9d] hover:bg-[#edebe9] dark:hover:bg-[#484644]'
                                            }`}
                                            title="Copy name"
                                        >
                                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Card Body with Badge */}
                                <div className="p-3 flex flex-col gap-3 flex-1">
                                    <p className="text-[12px] leading-relaxed text-[#605e5c] dark:text-[#a19f9d]">
                                        {policy.desc}
                                    </p>
                                    <div className="flex items-end justify-between mt-auto">
                                        <div className="flex items-center gap-1.5 flex-wrap flex-1 mr-2">
                                            {policy.categories.map((cat, idx) => (
                                                <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-[#e3f2fd] text-[#005a9e] dark:bg-[#004578] dark:text-[#60cdff] border border-[#bbdefb] dark:border-[#005a9e]">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                        {policy.link && (
                                            <a 
                                                href={policy.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[#0078d4] dark:text-[#60cdff] hover:underline flex items-center gap-1 text-[11px] font-medium"
                                                title="View official Microsoft documentation"
                                            >
                                                Learn more
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
