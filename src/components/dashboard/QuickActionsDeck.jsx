import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Copy,
    Check,
    SlidersHorizontal,
    Compass,
    BookOpen,
    Layers,
    Shield,
    LayoutTemplate,
    ExternalLink
} from 'lucide-react';
import { generateName as generateResourceName } from '../../utils/nameGenerator';
import { AZURE_REGIONS } from '../../data/constants';

/**
 * Quick Starters & Reference Frameworks Deck.
 * Combines 1-click generators and official architecture framework shortcuts in a balanced split layout.
 */
export default function QuickActionsDeck() {
    const navigate = useNavigate();
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Read existing naming configuration from localStorage if available
    const activeConfig = useMemo(() => {
        if (typeof window === 'undefined') return null;
        try {
            const workload = localStorage.getItem('azres_workload');
            const env = localStorage.getItem('azres_env');
            const region = localStorage.getItem('azres_region');
            const instance = localStorage.getItem('azres_instance');
            const org = localStorage.getItem('azres_orgPrefix');
            const showOrg = localStorage.getItem('azres_showOrg') === 'true';

            const cleanWorkload = workload ? JSON.parse(workload) : '';
            const cleanEnv = env ? JSON.parse(env) : 'prod';
            const cleanRegion = region ? JSON.parse(region) : 'uksouth';
            const cleanInstance = instance ? JSON.parse(instance) : '001';
            const cleanOrg = org ? JSON.parse(org) : '';

            if (!cleanWorkload && !cleanOrg) return null;

            const regionObj = AZURE_REGIONS.find(r => r.name === cleanRegion) || { shortName: cleanRegion };

            const sampleRgName = generateResourceName({
                resourceType: 'rg',
                workload: cleanWorkload || 'app',
                env: cleanEnv,
                region: regionObj.shortName,
                instance: cleanInstance,
                orgPrefix: cleanOrg,
                namingOrder: ['Org', 'Resource', 'Workload', 'Environment', 'Region', 'Instance'],
                showOrg
            });

            return {
                workload: cleanWorkload,
                env: cleanEnv,
                region: cleanRegion,
                instance: cleanInstance,
                sampleName: sampleRgName
            };
        } catch {
            return null;
        }
    }, []);

    const starters = [
        {
            id: 'storage-account',
            title: 'Storage Account',
            category: 'Storage',
            subtitle: 'CAF compliant alphanumeric storage name',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Storage-Accounts.svg',
            path: '/resource-naming?service=Storage account',
        },
        {
            id: 'virtual-network',
            title: 'Virtual Network',
            category: 'Networking',
            subtitle: 'Enterprise landing zone hub & spoke network',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Virtual-Networks.svg',
            path: '/resource-naming?service=Virtual network',
        },
        {
            id: 'key-vault',
            title: 'Key Vault',
            category: 'Security',
            subtitle: 'Zero Trust secrets & certificate vault',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Key-Vaults.svg',
            path: '/resource-naming?service=Key Vault',
        },
        {
            id: 'break-glass-ca',
            title: 'Break-Glass Emergency CA',
            category: 'Identity',
            subtitle: 'Zero Trust emergency admin policy preset',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg',
            path: '/conditional-access?search=Emergency',
        },
        {
            id: 'landing-zone-topology',
            title: 'Landing Zone Hierarchy',
            category: 'Architecture',
            subtitle: 'Scaffold enterprise Management Group tree',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            path: '/management-groups',
        },
        {
            id: 'custom-rbac-role',
            title: 'Custom RBAC Role',
            category: 'Governance',
            subtitle: 'Least privilege operator role definition',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Azure-AD-Roles-and-Administrators.svg',
            path: '/rbac-designer',
        },
    ];

    const frameworks = [
        {
            title: 'Cloud Adoption Framework',
            category: 'Governance',
            shortDesc: 'Naming, tagging & cloud operating model',
            url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming',
            icon: BookOpen,
            bgClass: 'bg-fluent-cat-blue-bg',
            fgClass: 'text-fluent-cat-blue-fg',
        },
        {
            title: 'Azure Landing Zones',
            category: 'Architecture',
            shortDesc: 'Multi-subscription scale & network topologies',
            url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/',
            icon: Layers,
            bgClass: 'bg-fluent-cat-green-bg',
            fgClass: 'text-fluent-cat-green-fg',
        },
        {
            title: 'Well-Architected Framework',
            category: 'Optimization',
            shortDesc: 'Security, reliability, cost & performance',
            url: 'https://learn.microsoft.com/en-us/azure/well-architected/',
            icon: LayoutTemplate,
            bgClass: 'bg-fluent-cat-orange-bg',
            fgClass: 'text-fluent-cat-orange-fg',
        },
        {
            title: 'Zero Trust Architecture',
            category: 'Security',
            shortDesc: 'Explicit verification & least privilege defense',
            url: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview',
            icon: Shield,
            bgClass: 'bg-fluent-cat-purple-bg',
            fgClass: 'text-fluent-cat-purple-fg',
        },
    ];

    const handleCopy = (text, idx, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="w-full rounded-xl border border-fluent-stroke-subtle bg-fluent-bg-card p-4 sm:p-5 shadow-soft flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-fluent-stroke-subtle">
                <div>
                    <h2 className="text-[15px] font-bold text-fluent-fg-primary leading-tight">
                        Quick Starters & Architecture Guidance
                    </h2>
                    <p className="text-[12px] text-fluent-fg-secondary">
                        Jump straight into configured generators and official Microsoft frameworks
                    </p>
                </div>

                {activeConfig && (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => navigate('/resource-naming')}
                            className="h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium bg-fluent-bg-subtle border border-fluent-stroke-subtle hover:border-fluent-stroke-strong hover:bg-fluent-bg-hover text-fluent-fg-secondary hover:text-fluent-fg-primary transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                            title="Open Resource Naming configuration"
                        >
                            <SlidersHorizontal className="w-3 h-3" />
                            <span>Workload: <strong className="text-fluent-fg-primary">{activeConfig.workload || 'Default'}</strong></span>
                        </button>
                    </div>
                )}
            </div>

            {/* Active Naming Preview Bar (if active config present) */}
            {activeConfig && activeConfig.sampleName && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-lg bg-fluent-bg-subtle border border-fluent-stroke-subtle">
                    <div className="flex items-center gap-2 min-w-0">
                        <Compass className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0" />
                        <span className="text-[12px] text-fluent-fg-tertiary shrink-0">Active Naming Baseline:</span>
                        <code className="text-[12.5px] font-mono font-semibold text-fluent-fg-primary truncate select-all">
                            {activeConfig.sampleName}
                        </code>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => handleCopy(activeConfig.sampleName, 'sample', e)}
                        className="shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary active:scale-95 transition-all inline-flex items-center justify-center gap-1.5"
                    >
                        {copiedIndex === 'sample' ? (
                            <>
                                <Check className="w-3 h-3 text-fluent-cat-green-fg" />
                                <span className="text-fluent-cat-green-fg">Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Name</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Balanced Split Layout: Quick Starters (Left) & Reference Frameworks (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* Left Column: Quick Starters (~58% / 7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-2.5 lg:border-r lg:border-fluent-stroke-subtle lg:pr-5">
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11.5px] font-bold text-fluent-fg-primary uppercase tracking-wider">
                            Quick Starters
                        </span>
                        <span className="text-[11px] text-fluent-fg-tertiary">
                            1-Click Presets
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {starters.map((starter) => (
                            <button
                                key={starter.id}
                                type="button"
                                onClick={() => navigate(starter.path)}
                                className="
                                    group flex items-start gap-2.5 p-2.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-subtle
                                    hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong
                                    transition-all duration-150 text-left active:scale-[0.98]
                                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg
                                "
                            >
                                <img
                                    src={starter.iconUrl}
                                    alt=""
                                    className="w-6 h-6 object-contain shrink-0 mt-0.5 group-hover:scale-105 transition-transform"
                                />
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                        <span className="text-[12.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors truncate">
                                            {starter.title}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-fluent-fg-tertiary group-hover:text-fluent-brand-fg group-hover:translate-x-0.5 transition-transform shrink-0" />
                                    </div>
                                    <span className="text-[11px] text-fluent-fg-secondary truncate mt-0.5">
                                        {starter.subtitle}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Reference Frameworks (~42% / 5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11.5px] font-bold text-fluent-fg-primary uppercase tracking-wider">
                            Reference Frameworks
                        </span>
                        <a
                            href="https://learn.microsoft.com/azure/cloud-adoption-framework/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11.5px] text-fluent-brand-fg hover:underline inline-flex items-center gap-1 font-medium"
                            title="Browse Microsoft Cloud Adoption Framework documentation"
                        >
                            <span>Browse docs</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    <div className="flex flex-col gap-2">
                        {frameworks.map((framework) => {
                            const IconComponent = framework.icon;
                            return (
                                <a
                                    key={framework.title}
                                    href={framework.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group flex items-center justify-between
                                        p-2 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-subtle
                                        hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong
                                        transition-all duration-150 active:scale-[0.99]
                                    "
                                    title={framework.shortDesc}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${framework.bgClass} ${framework.fgClass}`}>
                                            <IconComponent className="w-3 h-3" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[12px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors truncate">
                                                {framework.title}
                                            </span>
                                            <span className="text-[10.5px] text-fluent-fg-secondary truncate">
                                                {framework.shortDesc}
                                            </span>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-fluent-fg-tertiary group-hover:text-fluent-brand-fg transition-colors shrink-0 ml-1.5" />
                                </a>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
