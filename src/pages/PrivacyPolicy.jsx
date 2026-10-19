import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Server,
    HardDrive,
    Lock,
    EyeOff,
    ExternalLink,
    ChevronDown,
    Trash2,
    Check,
    Globe,
    Info,
    Activity,
    Cpu,
    CheckCircle2,
    ArrowLeft,
    Search,
    Clock,
    AlertTriangle
} from 'lucide-react';
import ScrollToTopButton from '../components/layout/ScrollToTopButton';

/**
 * Registry of all localStorage keys explicitly managed by the Azure Governance Toolkit.
 */
const MANAGED_STORAGE_KEYS = [
    { key: 'azres_themePref', category: 'Interface Preference', purpose: 'UI Theme mode selection (light, dark, or system)' },
    { key: 'azres_navExpanded', category: 'Interface Preference', purpose: 'Desktop sidebar navigation expanded or collapsed state' },
    { key: 'azres_recent_commands', category: 'Interface Preference', purpose: 'Cached recently selected action IDs in Command Palette (Ctrl+K)' },
    { key: 'azres_workload', category: 'Tool Workspace', purpose: 'Active workload prefix text in CAF naming generator' },
    { key: 'azres_env', category: 'Tool Workspace', purpose: 'Target environment code (e.g. prod, dev, uat, stg)' },
    { key: 'azres_region', category: 'Tool Workspace', purpose: 'Target Azure region code (e.g. uksouth, westeurope)' },
    { key: 'azres_instance', category: 'Tool Workspace', purpose: '3-digit instance number string (e.g. 001)' },
    { key: 'azres_orgPrefix', category: 'Tool Workspace', purpose: 'Optional organization or company prefix' },
    { key: 'azres_namingOrder', category: 'Tool Workspace', purpose: 'Sequence order of resource naming tokens' },
    { key: 'azres_showOrg', category: 'Tool Workspace', purpose: 'Display toggle for organization prefix token' },
    { key: 'azres_category', category: 'Tool Workspace', purpose: 'Active category filter in CAF resource library' },
    { key: 'azres_subResources', category: 'Tool Workspace', purpose: 'Selected sub-resource token abbreviations' },
    { key: 'azres_tags', category: 'Tool Workspace', purpose: 'Custom organizational tag definitions and policy enforcement effects' },
    { key: 'azres_topology', category: 'Tool Workspace', purpose: 'Custom management group hierarchy architecture tree' },
];

const SECTIONS_NAV = [
    { id: 'section-client-processing', label: '1. Client-Side Architecture' },
    { id: 'section-hosting', label: '2. West Europe Hosting & APIs' },
    { id: 'section-storage', label: '3. Local Storage Inspector' },
    { id: 'section-telemetry', label: '4. Telemetry & Diagnostics' },
    { id: 'section-security', label: '5. Security Headers & CSP' },
    { id: 'section-gdpr', label: '6. GDPR & Zero Cookies' },
    { id: 'section-contact', label: '7. Contacts & Audit' },
];

/**
 * PrivacyPolicy Page Component
 * 
 * Provides an authoritative, transparent, and user-friendly privacy and architectural disclosure.
 * Features:
 * - Quick-jump Table of Contents bar for rapid navigation
 * - TL;DR / Plain English key takeaways at the top of every section
 * - Searchable and filterable Local Storage Inspector with safe 2-step wipe confirmation
 * - Deep-linkable section targets with smooth scrolling
 */
export default function PrivacyPolicy() {
    const navigate = useNavigate();
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
    const [storedItems, setStoredItems] = useState({});
    const [isCleared, setIsCleared] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);

    // Filter and search state for the localStorage inspector
    const [storageCategoryFilter, setStorageCategoryFilter] = useState('All');
    const [storageSearchTerm, setStorageSearchTerm] = useState('');

    // Read active localStorage keys relevant to this application
    const inspectStorage = useCallback(() => {
        if (typeof window === 'undefined') return;
        const values = {};
        MANAGED_STORAGE_KEYS.forEach(({ key }) => {
            const raw = window.localStorage.getItem(key);
            if (raw !== null) {
                try {
                    values[key] = JSON.parse(raw);
                } catch {
                    values[key] = raw;
                }
            } else {
                values[key] = null;
            }
        });
        setStoredItems(values);
    }, []);

    useEffect(() => {
        inspectStorage();
    }, [inspectStorage]);

    // Wipe all azres_* keys configured by this application with 2-step confirmation
    const handleClearStorage = () => {
        if (typeof window === 'undefined') return;

        if (!confirmClear) {
            setConfirmClear(true);
            setTimeout(() => {
                setConfirmClear(false);
            }, 4500);
            return;
        }

        const keysToRemove = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key && key.startsWith('azres_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((key) => window.localStorage.removeItem(key));
        setConfirmClear(false);
        setIsCleared(true);
        inspectStorage();
        setTimeout(() => setIsCleared(false), 2500);
    };

    const scrollToSection = (sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Filtered storage keys based on user selection
    const filteredStorageKeys = useMemo(() => {
        return MANAGED_STORAGE_KEYS.filter(({ key, category, purpose }) => {
            const matchesCat = storageCategoryFilter === 'All' || category === storageCategoryFilter;
            const term = storageSearchTerm.toLowerCase().trim();
            const matchesSearch = !term ||
                key.toLowerCase().includes(term) ||
                purpose.toLowerCase().includes(term) ||
                category.toLowerCase().includes(term);
            return matchesCat && matchesSearch;
        });
    }, [storageCategoryFilter, storageSearchTerm]);

    return (
        <div className="max-w-5xl w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 animate-fade-in flex-1 flex flex-col">

            {/* Page Header */}
            <div className="mb-5 shrink-0">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-fluent-fg-primary">
                        Privacy Policy
                    </h1>
                    <p className="text-[14px] sm:text-[15px] text-fluent-fg-secondary max-w-4xl leading-relaxed">
                        Learn how the Azure Governance Toolkit protects your privacy with 100% client-side processing, local browser storage, and Azure West Europe hosting.
                    </p>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[12px]" title="Azure Hosting Location">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-blue-fg shrink-0" />
                        <span className="text-fluent-fg-tertiary">Hosting:</span>
                        <span className="font-medium text-fluent-fg-primary">Azure Static Web Apps (West Europe)</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[12px]" title="Data Persistence Model">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-green-fg shrink-0" />
                        <span className="text-fluent-fg-tertiary">Persistence:</span>
                        <span className="font-medium text-fluent-fg-primary">Zero Remote Database Storage</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[12px]" title="Regulatory Framework">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                        <span className="text-fluent-fg-tertiary">Compliance:</span>
                        <span className="font-medium text-fluent-fg-primary">GDPR &amp; UK DPA 2018</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[12px]" title="Reading Estimate">
                        <Clock className="w-3.5 h-3.5 text-fluent-fg-tertiary" />
                        <span className="text-fluent-fg-secondary">~3 min read</span>
                    </div>
                </div>
            </div>

            {/* Quick-Jump Section Navigation Chips */}
            <div className="mb-5 p-2.5 rounded-lg bg-fluent-bg-card border border-fluent-stroke-subtle shadow-soft">
                <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-[12px] font-semibold text-fluent-fg-primary">Quick Jump to Section:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    {SECTIONS_NAV.map((sec) => (
                        <button
                            key={sec.id}
                            type="button"
                            onClick={() => scrollToSection(sec.id)}
                            className="h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium bg-fluent-bg-subtle hover:bg-fluent-bg-hover text-fluent-fg-secondary hover:text-fluent-brand-fg border border-fluent-stroke-subtle hover:border-fluent-stroke-strong transition-all active:scale-95"
                        >
                            {sec.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Standard Tool Guidance Accordion */}
            <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden mb-6 shrink-0 border border-fluent-stroke-subtle">
                <div
                    className="px-3 py-2 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-fluent-bg-hover transition-colors"
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 flex-shrink-0 text-fluent-brand-fg" />
                            <p className="text-fluent-fg-primary text-[13px] font-medium">
                                Privacy and Data Architecture at a Glance
                            </p>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-fluent-fg-secondary transition-transform duration-200 ${isGuidanceExpanded ? 'rotate-180' : ''}`} />
                    </div>

                    <div className={`grid transition-[grid-template-rows] duration-250 ease-out ${isGuidanceExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden min-h-0">
                            <div className={`mt-3 flex flex-col gap-2.5 text-[13px] text-fluent-fg-secondary cursor-default transition-opacity duration-200 ${isGuidanceExpanded ? 'opacity-100' : 'opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                                <p>
                                    The <strong>Azure Governance Toolkit</strong> is intentionally engineered as an offline-capable, privacy-first single page application (SPA). We believe enterprise architecture specifications, naming conventions, and security policies should remain strictly confidential:
                                </p>
                                <ul className="list-disc pl-5 ml-2 flex flex-col gap-1.5">
                                    <li><strong>Zero Server Database:</strong> No user configurations, subscription IDs, tenant IDs, or generated templates are ever sent to, stored in, or processed by a remote backend database.</li>
                                    <li><strong>Azure West Europe Infrastructure:</strong> Static application assets are distributed and hosted via Microsoft Azure Static Web Apps originating from the Netherlands (West Europe), conforming to EU Data Boundary safeguards.</li>
                                    <li><strong>Local Storage Isolation:</strong> User configurations (e.g. naming prefixes, custom tags, and topologies) remain strictly on your device inside your browser&apos;s HTML5 <code>localStorage</code>.</li>
                                    <li><strong>Anonymized Telemetry:</strong> Minimal diagnostic metrics (page view counts and client errors) are aggregated via Azure Application Insights in West Europe without recording credentials or architecture payloads.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Single Column Stack */}
            <div className="flex flex-col gap-6 w-full">

                {/* Card 1: Client-Side Data Architecture & Zero Database Storage */}
                <div id="section-client-processing" className="scroll-mt-14 relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle flex flex-col p-5 gap-4">
                    <div className="flex items-center gap-2.5 border-b border-fluent-stroke-subtle pb-3">
                        <div className="w-8 h-8 rounded-[4px] bg-fluent-bg-subtle text-fluent-brand-fg flex items-center justify-center shrink-0">
                            <HardDrive className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-fluent-fg-primary">
                                1. 100% Client-Side Architecture &amp; Zero Remote Database
                            </h2>
                            <p className="text-[12px] text-fluent-fg-tertiary">
                                All governance computations run strictly in transient browser memory
                            </p>
                        </div>
                    </div>

                    {/* Plain-English Takeaway Callout */}
                    <div className="p-3 rounded-[4px] bg-fluent-info-bg border border-fluent-info-border text-fluent-info-text text-[12.5px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                        <span><strong>Plain English:</strong> None of your resource names, subscription IDs, or governance policies are stored on our servers. Everything happens in your browser.</span>
                    </div>

                    <div className="text-[13px] text-fluent-fg-secondary space-y-3 leading-relaxed">
                        <p>
                            Unlike traditional cloud portals that require authentication or ingest customer infrastructure details into remote databases, the Azure Governance Toolkit is built as an entirely client-side Single Page Application (SPA).
                        </p>
                        <p>
                            All core generation logic, regex validations, and template compilers run locally within your browser&apos;s JavaScript engine:
                        </p>
                        <div className="bg-fluent-bg-subtle rounded-[4px] p-3 border border-fluent-stroke-subtle grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-[12px]">
                            <div className="flex items-start gap-2">
                                <span className="text-fluent-cat-green-fg font-bold">&#10003;</span>
                                <span><strong>Resource Naming:</strong> CAF string assembly &amp; regex rule validation in local RAM.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-fluent-cat-green-fg font-bold">&#10003;</span>
                                <span><strong>Conditional Access:</strong> Persona baselines &amp; JSON policy models in local state.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-fluent-cat-green-fg font-bold">&#10003;</span>
                                <span><strong>Management Groups:</strong> Tree hierarchy visualization &amp; IaC export rendered in memory.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-fluent-cat-green-fg font-bold">&#10003;</span>
                                <span><strong>Custom RBAC:</strong> Permission filtering &amp; least-privilege role definitions on-device.</span>
                            </div>
                        </div>
                        <p className="text-[12.5px] text-fluent-fg-tertiary">
                            The application does not operate a user database, account registry, or persistent server-side storage for governance configurations. Your cloud architecture inputs never leave your device unless you explicitly copy or export them.
                        </p>
                    </div>
                </div>

                {/* Card 2: Azure West Europe Hosting & Serverless Functions */}
                <div id="section-hosting" className="scroll-mt-14 relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle flex flex-col p-5 gap-4">
                    <div className="flex items-center gap-2.5 border-b border-fluent-stroke-subtle pb-3">
                        <div className="w-8 h-8 rounded-[4px] bg-fluent-bg-subtle text-fluent-brand-fg flex items-center justify-center shrink-0">
                            <Server className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-fluent-fg-primary">
                                2. Azure Static Web Apps (West Europe Region) &amp; Serverless APIs
                            </h2>
                            <p className="text-[12px] text-fluent-fg-tertiary">
                                European Union datacenter origin and stateless serverless functions
                            </p>
                        </div>
                    </div>

                    {/* Plain-English Takeaway Callout */}
                    <div className="p-3 rounded-[4px] bg-fluent-info-bg border border-fluent-info-border text-fluent-info-text text-[12.5px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                        <span><strong>Plain English:</strong> All static files and API proxies are delivered from Microsoft Azure in the Netherlands under EU data sovereignty.</span>
                    </div>

                    <div className="text-[13px] text-fluent-fg-secondary space-y-3 leading-relaxed">
                        <p>
                            The production application is deployed on <strong>Microsoft Azure Static Web Apps</strong> originating from the <strong>Azure West Europe region (Amsterdam, Netherlands)</strong>.
                        </p>
                        <p>
                            By hosting within the European Union, the service benefits from Microsoft Azure&apos;s physical security controls, ISO/IEC 27001 certifications, SOC 1/2/3 attestations, and compliance with the <strong>Microsoft EU Data Boundary</strong>.
                        </p>
                        
                        {/* Hosting Specifications Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-fluent-bg-subtle rounded-[4px] p-3 border border-fluent-stroke-subtle">
                            <div className="flex items-center justify-between text-[12px] p-1">
                                <span className="text-fluent-fg-secondary">Cloud Service Provider:</span>
                                <span className="font-mono text-fluent-fg-primary font-medium">Microsoft Azure</span>
                            </div>
                            <div className="flex items-center justify-between text-[12px] p-1">
                                <span className="text-fluent-fg-secondary">Hosting Tier:</span>
                                <span className="font-mono text-fluent-fg-primary font-medium">Azure Static Web Apps</span>
                            </div>
                            <div className="flex items-center justify-between text-[12px] p-1">
                                <span className="text-fluent-fg-secondary">Primary Datacenter:</span>
                                <span className="font-mono text-fluent-fg-primary font-medium">West Europe (Amsterdam, NL)</span>
                            </div>
                            <div className="flex items-center justify-between text-[12px] p-1">
                                <span className="text-fluent-fg-secondary">Transit Encryption:</span>
                                <span className="font-mono text-fluent-cat-green-fg font-medium">TLS 1.3 / HTTPS Enforced</span>
                            </div>
                        </div>

                        {/* Exact Serverless APIs Configured */}
                        <div className="pt-2">
                            <h3 className="text-[13px] font-semibold text-fluent-fg-primary mb-2 flex items-center gap-1.5">
                                <Cpu className="w-4 h-4 text-fluent-brand-fg" />
                                Configured Stateless Serverless Endpoints:
                            </h3>
                            <div className="space-y-2 text-[12.5px]">
                                <div className="p-3 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-col gap-1">
                                    <span className="font-mono font-semibold text-fluent-brand-fg">GET /api/azureUpdates</span>
                                    <span className="text-fluent-fg-secondary">
                                        Serverless HTTP proxy caching Microsoft&apos;s public Azure release RSS feed (<code>www.microsoft.com/releasecommunications/api/v2/azure/rss</code>) for 15 minutes to avoid CORS in browser clients. No user parameters or personal data are collected or sent.
                                    </span>
                                </div>
                                <div className="p-3 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-col gap-1">
                                    <span className="font-mono font-semibold text-fluent-brand-fg">POST /api/generateResourceName &amp; POST /api/generateRbacRole</span>
                                    <span className="text-fluent-fg-secondary">
                                        Optional natural language AI Copilot endpoints. If you type a request into the AI Prompt Bar, your prompt text is forwarded via TLS 1.3 to Azure OpenAI / Microsoft Foundry in Azure West Europe for CAF parameter extraction. Requests are processed in-flight and are completely stateless (no prompts, inputs, or generated definitions are logged or retained in a database). If unconfigured or offline, the app falls back entirely to local in-browser heuristics.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Browser Local Storage Transparency & Inspector */}
                <div id="section-storage" className="scroll-mt-14 relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle flex flex-col p-5 gap-4">
                    <div className="flex items-center gap-2.5 border-b border-fluent-stroke-subtle pb-3">
                        <div className="w-8 h-8 rounded-[4px] bg-fluent-bg-subtle text-fluent-brand-fg flex items-center justify-center shrink-0">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-fluent-fg-primary">
                                3. Browser Local Storage Transparency &amp; Data Inspector
                            </h2>
                            <p className="text-[12px] text-fluent-fg-tertiary">
                                Inspect, filter, and safely manage all keys stored in window.localStorage
                            </p>
                        </div>
                    </div>

                    {/* Plain-English Takeaway Callout */}
                    <div className="p-3 rounded-[4px] bg-fluent-info-bg border border-fluent-info-border text-fluent-info-text text-[12.5px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                        <span><strong>Plain English:</strong> We use your browser&apos;s local storage so you don&apos;t have to re-type your naming prefixes or tags every time you visit. You can inspect or clear it below.</span>
                    </div>

                    <div className="text-[13px] text-fluent-fg-secondary space-y-3 leading-relaxed">
                        <p>
                            Below is an interactive inspector displaying every localStorage key utilized across the toolkit, showing live values currently stored on your computer:
                        </p>

                        {/* Interactive Filter & Search Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                            {/* Category Filter Tabs */}
                            <div className="flex items-center gap-1 p-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle w-full sm:w-auto">
                                {['All', 'Tool Workspace', 'Interface Preference'].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setStorageCategoryFilter(cat)}
                                        className={`flex-1 sm:flex-initial h-[26px] px-2.5 rounded-[3px] text-[12px] font-medium transition-all ${
                                            storageCategoryFilter === cat
                                                ? 'bg-fluent-bg-card text-fluent-fg-primary shadow-sm font-semibold'
                                                : 'text-fluent-fg-secondary hover:text-fluent-fg-primary'
                                        }`}
                                    >
                                        {cat === 'All' ? 'All (14)' : cat === 'Tool Workspace' ? 'Workspace (11)' : 'UI State (3)'}
                                    </button>
                                ))}
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full sm:w-[220px]">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-fluent-fg-tertiary" />
                                <input
                                    type="text"
                                    value={storageSearchTerm}
                                    onChange={(e) => setStorageSearchTerm(e.target.value)}
                                    placeholder="Filter storage keys..."
                                    className="w-full h-[28px] pl-8 pr-2 text-[12px] rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-fg-primary placeholder:text-fluent-fg-tertiary focus:outline-none focus:border-fluent-brand-bg"
                                />
                            </div>
                        </div>

                        {/* Storage Keys Table */}
                        <div className="overflow-x-auto rounded-[4px] border border-fluent-stroke-subtle">
                            <table className="w-full text-left text-[12px]">
                                <thead className="bg-fluent-bg-subtle text-fluent-fg-primary border-b border-fluent-stroke-subtle">
                                    <tr>
                                        <th className="py-2 px-3 font-semibold">Key Name</th>
                                        <th className="py-2 px-3 font-semibold">Category</th>
                                        <th className="py-2 px-3 font-semibold">Purpose</th>
                                        <th className="py-2 px-3 font-semibold">Current Value in Your Browser</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fluent-stroke-subtle font-mono text-[11.5px]">
                                    {filteredStorageKeys.length > 0 ? (
                                        filteredStorageKeys.map(({ key, category, purpose }) => {
                                            const val = storedItems[key];
                                            let displayVal = 'null (default)';
                                            if (val !== null && val !== undefined) {
                                                if (typeof val === 'object') {
                                                    displayVal = Array.isArray(val) ? `[Array: ${val.length} items]` : '{Object}';
                                                } else {
                                                    displayVal = String(val);
                                                }
                                            }

                                            return (
                                                <tr key={key} className="hover:bg-fluent-bg-hover transition-colors">
                                                    <td className="py-2 px-3 text-fluent-brand-fg font-medium">{key}</td>
                                                    <td className="py-2 px-3 font-sans text-fluent-fg-tertiary whitespace-nowrap">{category}</td>
                                                    <td className="py-2 px-3 font-sans text-fluent-fg-secondary">{purpose}</td>
                                                    <td className="py-2 px-3 text-fluent-fg-primary truncate max-w-[150px]" title={JSON.stringify(val)}>
                                                        {displayVal}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-4 text-center font-sans text-fluent-fg-tertiary text-[12px]">
                                                No storage keys match your filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Clear Storage Action with Safe 2-Step Confirmation */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-fluent-stroke-subtle">
                            <span className="text-[12px] text-fluent-fg-tertiary">
                                Want to reset your workspace? Wipe all application keys (<code>azres_*</code>) with safe confirmation:
                            </span>

                            <div className="flex items-center gap-2">
                                {confirmClear && (
                                    <button
                                        type="button"
                                        onClick={() => setConfirmClear(false)}
                                        className="h-[32px] px-3 rounded-[4px] text-[12px] font-medium bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-fg-primary active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleClearStorage}
                                    className={`shrink-0 h-[32px] px-3 rounded-[4px] text-[13px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border active:scale-95 ${
                                        isCleared
                                            ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                            : confirmClear
                                            ? 'bg-fluent-state-danger text-white border-transparent shadow-sm animate-pulse'
                                            : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-state-danger hover:text-fluent-state-danger'
                                    }`}
                                >
                                    {isCleared ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>All Local Data Cleared</span>
                                        </>
                                    ) : confirmClear ? (
                                        <>
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            <span>Click Again to Confirm Reset</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Clear All Local Workspace Data</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: Telemetry & Application Insights */}
                <div id="section-telemetry" className="scroll-mt-14 relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle flex flex-col p-5 gap-4">
                    <div className="flex items-center gap-2.5 border-b border-fluent-stroke-subtle pb-3">
                        <div className="w-8 h-8 rounded-[4px] bg-fluent-bg-subtle text-fluent-brand-fg flex items-center justify-center shrink-0">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-fluent-fg-primary">
                                4. Application Insights &amp; Operational Telemetry
                            </h2>
                            <p className="text-[12px] text-fluent-fg-tertiary">
                                Azure Monitor telemetry hosted in Azure West Europe
                            </p>
                        </div>
                    </div>

                    {/* Plain-English Takeaway Callout */}
                    <div className="p-3 rounded-[4px] bg-fluent-info-bg border border-fluent-info-border text-fluent-info-text text-[12.5px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                        <span><strong>Plain English:</strong> We measure generic website performance and script errors so we can fix bugs. We never log your passwords, tokens, or resource configurations.</span>
                    </div>

                    <div className="text-[13px] text-fluent-fg-secondary space-y-3 leading-relaxed">
                        <p>
                            To detect frontend crashes, measure cross-browser performance, and maintain service health, the application uses the official Microsoft Azure Application Insights SDK (<code>@microsoft/applicationinsights-web</code>).
                        </p>
                        <p>
                            Telemetry ingestion endpoints are hosted directly in <strong>Azure West Europe</strong> (<code>westeurope-5.in.applicationinsights.azure.com</code> and <code>westeurope.livediagnostics.monitor.azure.com</code>). Events are buffered in local memory and dispatched in 15-second batches under cloud role <code>atozazure-governance-toolkit</code>.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div className="bg-fluent-bg-subtle rounded-[4px] p-3.5 border border-fluent-stroke-subtle space-y-2">
                                <h3 className="text-[12.5px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-fluent-cat-green-fg" />
                                    What Is Collected:
                                </h3>
                                <ul className="list-disc pl-4 space-y-1.5 text-[12px]">
                                    <li>Aggregated route navigations (e.g. tracking page views to <code>/resource-naming</code> or <code>/conditional-access</code>).</li>
                                    <li>Page dwell duration to evaluate which governance tools are most actively used.</li>
                                    <li>Unhandled JavaScript exceptions, browser error messages, and HTTP status codes.</li>
                                    <li>Technical platform attributes (browser user agent, OS type, and viewport dimensions for responsive design).</li>
                                </ul>
                            </div>
                            <div className="bg-fluent-bg-subtle rounded-[4px] p-3.5 border border-fluent-stroke-subtle space-y-2">
                                <h3 className="text-[12.5px] font-semibold text-fluent-state-danger flex items-center gap-1.5">
                                    <EyeOff className="w-3.5 h-3.5" />
                                    What Is NEVER Collected:
                                </h3>
                                <ul className="list-disc pl-4 space-y-1.5 text-[12px]">
                                    <li>No Personally Identifiable Information (PII), names, email addresses, or phone numbers.</li>
                                    <li>No Azure subscription IDs, tenant IDs, credentials, client secrets, or auth tokens.</li>
                                    <li>No generated resource names, policy payloads, or exported Bicep/Terraform code.</li>
                                    <li>No keyboard input strokes, form field values, or proprietary architecture details.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 5: Security Architecture & HTTP Headers */}
                <div id="section-security" className="scroll-mt-14 relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle flex flex-col p-5 gap-4">
                    <div className="flex items-center gap-2.5 border-b border-fluent-stroke-subtle pb-3">
                        <div className="w-8 h-8 rounded-[4px] bg-fluent-bg-subtle text-fluent-brand-fg flex items-center justify-center shrink-0">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-fluent-fg-primary">
                                5. Security Headers &amp; Content Security Policy (CSP)
                            </h2>
                            <p className="text-[12px] text-fluent-fg-tertiary">
                                Verifiable edge security controls in staticwebapp.config.json
                            </p>
                        </div>
                    </div>

                    {/* Plain-English Takeaway Callout */}
                    <div className="p-3 rounded-[4px] bg-fluent-info-bg border border-fluent-info-border text-fluent-info-text text-[12.5px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                        <span><strong>Plain English:</strong> The web app uses strict browser security headers to block clickjacking, disable camera/microphone access, and prevent unauthorized external scripts.</span>
                    </div>

                    <div className="text-[13px] text-fluent-fg-secondary space-y-3 leading-relaxed">
                        <p>
                            The Azure Static Web Apps edge enforces strict security response headers configured in our repository:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11.5px]">
                            <div className="p-2.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-col gap-1">
                                <span className="font-semibold text-fluent-fg-primary">Strict-Transport-Security (HSTS):</span>
                                <span className="text-fluent-fg-secondary">max-age=31536000; includeSubDomains; preload</span>
                            </div>
                            <div className="p-2.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-col gap-1">
                                <span className="font-semibold text-fluent-fg-primary">Content-Language:</span>
                                <span className="text-fluent-fg-secondary">en-GB</span>
                            </div>
                            <div className="p-2.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-col gap-1">
                                <span className="font-semibold text-fluent-fg-primary">Permissions-Policy:</span>
                                <span className="text-fluent-fg-secondary">accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()</span>
                            </div>
                            <div className="p-2.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-col gap-1">
                                <span className="font-semibold text-fluent-fg-primary">Frame Protection &amp; MIME Guard:</span>
                                <span className="text-fluent-fg-secondary">X-Frame-Options: SAMEORIGIN &bull; X-Content-Type-Options: nosniff</span>
                            </div>
                        </div>

                        <div className="p-3 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-col gap-1.5 font-mono text-[11.5px]">
                            <span className="font-semibold text-fluent-fg-primary">Content-Security-Policy (CSP) Origins:</span>
                            <span className="text-fluent-fg-secondary leading-relaxed">
                                <strong>script-src:</strong> &apos;self&apos;, &apos;unsafe-inline&apos;, js.monitor.azure.com<br />
                                <strong>connect-src:</strong> &apos;self&apos;, dc.services.visualstudio.com, *.in.applicationinsights.azure.com, *.livediagnostics.monitor.azure.com, raw.githubusercontent.com, www.microsoft.com<br />
                                <strong>font-src &amp; style-src:</strong> &apos;self&apos;, fonts.cdnfonts.com (Cascadia Code font)<br />
                                <strong>img-src:</strong> &apos;self&apos;, data:, app.atozazure.com, raw.githubusercontent.com (official Azure service SVGs)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card 6: GDPR Compliance & Zero Cookie Policy */}
                <div id="section-gdpr" className="scroll-mt-14 relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle flex flex-col p-5 gap-4">
                    <div className="flex items-center gap-2.5 border-b border-fluent-stroke-subtle pb-3">
                        <div className="w-8 h-8 rounded-[4px] bg-fluent-bg-subtle text-fluent-brand-fg flex items-center justify-center shrink-0">
                            <Globe className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-fluent-fg-primary">
                                6. GDPR Compliance, User Rights &amp; Zero Cookie Policy
                            </h2>
                            <p className="text-[12px] text-fluent-fg-tertiary">
                                Regulation (EU) 2016/679, UK Data Protection Act 2018, and ePrivacy compliance
                            </p>
                        </div>
                    </div>

                    {/* Plain-English Takeaway Callout */}
                    <div className="p-3 rounded-[4px] bg-fluent-info-bg border border-fluent-info-border text-fluent-info-text text-[12.5px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                        <span><strong>Plain English:</strong> We do not use cookies or tracking pixels. You retain full GDPR rights, and all software code is open source for independent security audits.</span>
                    </div>

                    <div className="text-[13px] text-fluent-fg-secondary space-y-3 leading-relaxed">
                        <p>
                            Because our static and serverless infrastructure is hosted in Azure West Europe within the European Union, all operations adhere to European Union and UK data protection frameworks:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-[12.5px]">
                            <li><strong>Zero First-Party or Third-Party Cookies:</strong> The application does not write or read any HTTP cookies (<code>document.cookie</code> is unused). No cookie consent banner is needed under the ePrivacy Directive because no tracking or advertising cookies exist.</li>
                            <li><strong>Legal Basis (Article 6(1)(f) GDPR):</strong> Processing of anonymous technical telemetry is based on legitimate interest in preventing runtime exceptions and securing the static application.</li>
                            <li><strong>Data Subject Rights (Articles 15&ndash;21 GDPR):</strong> Because no personal identity database or customer accounts exist, we hold zero personal records to access or rectify. Users retain total autonomy to view and erase local browser state at any moment.</li>
                            <li><strong>No Commercial Profiling:</strong> We do not sell data, partner with data brokers, or use marketing cookies.</li>
                        </ul>
                        <div className="p-3 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex items-start gap-2.5 text-[12px]">
                            <ShieldCheck className="w-4 h-4 text-fluent-cat-green-fg shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-fluent-fg-primary block">Open Source Transparency</span>
                                <span className="text-fluent-fg-secondary">
                                    Every component, algorithm, and serverless proxy in this toolkit is open source. You can independently audit the full code on{' '}
                                    <a
                                        href="https://github.com/danzure/azure-governance-toolkit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-fluent-brand-fg hover:underline font-medium inline-flex items-center gap-0.5"
                                    >
                                        GitHub <ExternalLink className="w-3 h-3 ml-0.5" />
                                    </a>.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 7: Data Controller & Contact */}
                <div id="section-contact" className="scroll-mt-14 rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-fluent-fg-secondary">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-fluent-fg-primary">Data Controller:</span>
                        <span>Daniel Powley &bull; atozazure</span>
                    </div>

                    <div className="flex items-center gap-3.5 flex-wrap">
                        <a
                            href="mailto:security@atozazure.com"
                            className="text-fluent-brand-fg hover:underline inline-flex items-center gap-1 font-medium"
                        >
                            <span>security@atozazure.com</span>
                        </a>
                        <span className="text-fluent-stroke-strong select-none" aria-hidden="true">&bull;</span>
                        <a
                            href="https://atozazure.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fluent-brand-fg hover:underline inline-flex items-center gap-1 font-medium"
                        >
                            <span>atozazure.com</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-fluent-stroke-strong select-none" aria-hidden="true">&bull;</span>
                        <a
                            href="https://github.com/danzure/azure-governance-toolkit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fluent-brand-fg hover:underline inline-flex items-center gap-1 font-medium"
                        >
                            <span>GitHub Repository</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary text-[13px] font-medium active:scale-95"
                        title="Return to Toolkit Dashboard"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Dashboard</span>
                    </button>

                    <ScrollToTopButton />
                </div>

            </div>
        </div>
    );
}
