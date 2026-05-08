import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Copy, Check, Edit3, Eye, Info, Shield } from 'lucide-react';
import ServiceFilter from '../components/ServiceFilter';
import PolicyGroupCard from '../components/PolicyGroupCard';
import { PREMADE_POLICIES, CA_CATEGORIES, getReadableTitle } from '../data/conditionalAccessData';


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

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const searchInputRef = useRef(null);

    const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
    const handleClearSearch = useCallback(() => setSearchTerm(''), []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (searchTerm) {
                    setSearchTerm('');
                    searchInputRef.current?.blur();
                }
            }

            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement !== searchInputRef.current)) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchTerm]);

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

    const groupedPolicies = useMemo(() => {
        // 1. Group all policies by Requirement
        const groups = {};
        PREMADE_POLICIES.forEach(policy => {
            const parts = policy.name.split('-');
            const requirement = parts.length === 5 ? parts[4] : 'Other';
            if (!groups[requirement]) {
                groups[requirement] = [];
            }
            groups[requirement].push(policy);
        });

        // 2. Filter policies within each group
        const lowerSearch = searchTerm.toLowerCase();

        return Object.entries(groups).map(([requirement, policies]) => {
            const matchingPolicies = policies.filter(policy => {
                const matchesCategory = activeCategory === 'All' || policy.categories.includes(activeCategory);
                if (!matchesCategory) return false;

                if (!lowerSearch) return true;

                return policy.name.toLowerCase().includes(lowerSearch) || policy.desc.toLowerCase().includes(lowerSearch);
            });

            if (matchingPolicies.length === 0) return null;

            return {
                requirement,
                policies: matchingPolicies
            };
        }).filter(Boolean).sort((a, b) => {
            const titleA = getReadableTitle(a.requirement);
            const titleB = getReadableTitle(b.requirement);
            return titleA.localeCompare(titleB);
        });
    }, [searchTerm, activeCategory]);

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

                    <div className="animate-slide-up flex flex-col gap-3">
                        {/* About / Introduction */}
                        <div className="p-3.5 rounded-lg border shadow-soft bg-[#F0F6FF] dark:bg-[#0078d4]/10 border-[#C7E0F4] dark:border-[#0078d4]/30 flex gap-3 items-start">
                            <Info className="w-4 h-4 text-[#0078d4] mt-0.5 shrink-0" />
                            <div className="text-[13px] leading-relaxed text-[#004578] dark:text-[#c7e0f4]">
                                Conditional Access policies are logic-driven <strong>If-Then</strong> statements. Use the natural language builder below to construct a standardized name describing who it applies to, under what conditions, and what control is enforced.
                            </div>
                        </div>

                        {/* Natural Language Policy Builder */}
                        <div className="p-4 lg:p-5 rounded-lg border shadow-soft bg-white dark:bg-[#1b1a19] border-[#edebe9] dark:border-[#484644]">
                            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#edebe9] dark:border-[#323130]">
                                <Edit3 className="w-4 h-4 text-[#0078d4]" />
                                <h3 className="text-[14px] font-semibold text-[#201f1e] dark:text-white">Natural Language Builder</h3>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-2 text-[14px] text-[#323130] dark:text-[#e1dfdd] leading-relaxed">
                                <span>Create a policy starting with</span>
                                <input
                                    type="text"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                    className="px-2 h-[32px] border rounded outline-none text-[13px] font-mono transition-all focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 bg-white dark:bg-[#252423] border-[#8a8886] dark:border-[#605e5c] w-[60px] text-center"
                                />
                                
                                <span>that applies to</span>
                                <select
                                    value={persona}
                                    onChange={(e) => setPersona(e.target.value)}
                                    className="px-2.5 h-[32px] rounded outline-none text-[13px] font-semibold transition-all bg-[#EFF6FC] dark:bg-[#0078d4]/15 text-[#0078d4] dark:text-[#60cdff] border border-transparent hover:border-[#c7e0f4] dark:hover:border-[#0078d4]/30 cursor-pointer"
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
                                <select
                                    value={resource}
                                    onChange={(e) => setResource(e.target.value)}
                                    className="px-2.5 h-[32px] rounded outline-none text-[13px] font-semibold transition-all bg-[#EFF6FC] dark:bg-[#0078d4]/15 text-[#0078d4] dark:text-[#60cdff] border border-transparent hover:border-[#c7e0f4] dark:hover:border-[#0078d4]/30 cursor-pointer"
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

                                <span>from</span>
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="px-2.5 h-[32px] rounded outline-none text-[13px] font-semibold transition-all bg-[#EFF6FC] dark:bg-[#0078d4]/15 text-[#0078d4] dark:text-[#60cdff] border border-transparent hover:border-[#c7e0f4] dark:hover:border-[#0078d4]/30 cursor-pointer"
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
                                <div className="flex items-center gap-2">
                                    <select
                                        value={action}
                                        onChange={(e) => setAction(e.target.value)}
                                        className="px-2.5 h-[32px] rounded outline-none text-[13px] font-semibold transition-all bg-[#F3F0F7] dark:bg-[#5C2D91]/20 text-[#5C2D91] dark:text-[#d1a8ff] border border-transparent hover:border-[#E1DFDD] dark:hover:border-[#5C2D91]/40 cursor-pointer"
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
                                    
                                    {action === 'Custom' && (
                                        <input
                                            type="text"
                                            value={customAction}
                                            onChange={(e) => setCustomAction(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                                            placeholder="e.g. BlockNonCompliant"
                                            className="px-2 h-[32px] border rounded outline-none text-[13px] font-mono transition-all focus:border-[#5C2D91] focus:ring-2 focus:ring-[#5C2D91]/20 bg-white dark:bg-[#252423] border-[#5C2D91]/40 dark:border-[#5C2D91]/60 w-[160px]"
                                            maxLength={30}
                                            autoFocus
                                        />
                                    )}
                                </div>
                                <span>.</span>
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

                <ServiceFilter
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    categories={CA_CATEGORIES}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onClearSearch={handleClearSearch}
                    searchInputRef={searchInputRef}
                />

                {groupedPolicies.length === 0 ? (
                    <div className="text-center py-16 text-[#605e5c] dark:text-[#a19f9d]">
                        <p className="text-[14px]">No policies found matching your criteria.</p>
                        <p className="text-[12px] mt-2">Try adjusting your search or category filter.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {groupedPolicies.map((group) => (
                            <PolicyGroupCard
                                key={group.requirement}
                                requirement={group.requirement}
                                policies={group.policies}
                                copiedId={copiedId}
                                handleCopy={handleCopy}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
