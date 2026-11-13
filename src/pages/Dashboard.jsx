import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Sparkles,
    Star
} from 'lucide-react';
import {
    AzureUpdatesFeed,
    QuickActionsDeck,
    FeaturedToolCard
} from '@features/dashboard';

export default function DashboardPage() {
    const navigate = useNavigate();

    const featuredTool = {
        id: 'azure-resources',
        title: 'Azure Resource Naming Tool',
        description: 'Instantly generate standard-compliant names for 100+ Azure resources using Cloud Adoption Framework guidelines. Includes custom schema ordering, AI generation, and IaC exports.',
        iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg',
        path: '/resource-naming',
        hasAi: true,
    };

    const aiCompanionTool = {
        id: 'rbac-designer',
        title: 'RBAC Custom Role Designer',
        description: 'Design and generate JSON definitions for Azure Custom Roles by selecting specific resource provider operations with AI-assisted prompt refinement.',
        iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Azure-AD-Roles-and-Administrators.svg',
        path: '/rbac-designer',
        hasAi: true,
        tags: [
            { label: 'AI Prompt Assistant', color: 'bg-fluent-cat-purple-fg' },
            { label: 'Least Privilege', color: 'bg-fluent-cat-green-fg' },
            { label: 'JSON Export', color: 'bg-fluent-cat-orange-fg' }
        ]
    };

    const companionTools = [
        {
            id: 'ai-foundry',
            title: 'AI Foundry Designer',
            description: 'Architect and export enterprise Azure AI Foundry Hubs, child Projects, and Zero-Trust landing zones.',
            iconUrl: 'https://raw.githubusercontent.com/Azure-Player/icons-and-symbols/master/Microsoft/Azure_Public_Service_Icons/Icons/ai%20%2B%20machine%20learning/03513-icon-service-AI-Studio.svg',
            path: '/ai-foundry',
            isNew: true,
            hasAi: true,
            tags: [
                { label: 'AI Landing Zones', color: 'bg-fluent-cat-purple-fg' },
                { label: 'Zero-Trust Managed VNet', color: 'bg-fluent-cat-green-fg' },
                { label: 'Bicep & Terraform', color: 'bg-fluent-cat-blue-fg' }
            ]
        },
        {
            id: 'conditional-access',
            title: 'Conditional Access Policy Builder',
            description: 'Design, build, and document secure Conditional Access policies using standardized naming conventions.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg',
            path: '/conditional-access',
            tags: [
                { label: 'Zero Trust Baseline', color: 'bg-fluent-cat-purple-fg' },
                { label: 'Security Posture', color: 'bg-fluent-cat-blue-fg' },
                { label: 'Entra ID Templates', color: 'bg-fluent-cat-green-fg' }
            ]
        },
        {
            id: 'management-group-topology',
            title: 'Management Group Topology',
            description: 'Visually architect your Azure Management Group hierarchy utilizing enterprise best-practice topologies.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            path: '/management-groups',
            tags: [
                { label: 'Landing Zones', color: 'bg-fluent-cat-teal-fg' },
                { label: 'Visual Hierarchy', color: 'bg-fluent-cat-cyan-fg' },
                { label: 'Enterprise Scale', color: 'bg-fluent-cat-purple-fg' }
            ]
        },
        {
            id: 'tagging-strategy',
            title: 'Tagging Strategy Builder',
            description: 'Define organizational tagging strategies and automatically generate Azure Policy compliance rules.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Tags.svg',
            path: '/tagging-strategy',
            tags: [
                { label: 'Cost Allocation', color: 'bg-fluent-cat-orange-fg' },
                { label: 'Azure Policy Rules', color: 'bg-fluent-cat-blue-fg' },
                { label: 'Audit & Deny', color: 'bg-fluent-cat-red-fg' }
            ]
        }
    ];

    return (
        <div className="flex flex-col flex-1 w-full min-w-0 bg-fluent-bg-canvas">
            <div className="w-full min-w-0 max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-5 animate-fade-in flex-1 flex flex-col justify-start min-h-0 gap-6 sm:gap-7">

                {/* Section 1: Governance & Architecture Tools (Hero Bento Grid) */}
                <section className="flex flex-col gap-2.5 sm:gap-3 w-full min-w-0" aria-label="Governance & Architecture Tools">
                    {/* Section Header */}
                    <div className="pb-1">
                        <h1 className="text-[20px] sm:text-[23px] tall:text-[25px] font-semibold tracking-tight text-fluent-fg-primary leading-tight">
                            Governance &amp; Architecture Tools
                        </h1>
                        <p className="text-[13px] sm:text-[14px] text-fluent-fg-secondary mt-0.5">
                            Interactive utilities for cloud architects, security engineers, and DevOps teams
                        </p>
                    </div>

                    {/* Bento Grid: Row 1 = Two AI Tools (2 cols + 1 col); Row 2 = 3 Companion Tools */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-3.5 tall:gap-4 items-stretch w-full min-w-0">
                        {/* Row 1, Col 1-2: Featured Flagship Tool (AI-Powered) */}
                        <FeaturedToolCard tool={featuredTool} onNavigate={navigate} />

                        {/* Row 1, Col 3: RBAC Custom Role Designer (AI-Powered Peer Hero) */}
                        <div
                            onClick={() => navigate(aiCompanionTool.path)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    navigate(aiCompanionTool.path);
                                }
                            }}
                            aria-label={`${aiCompanionTool.title} - AI Powered Tool`}
                            className="
                                relative group cursor-pointer overflow-hidden
                                rounded-xl border border-fluent-stroke-subtle
                                bg-fluent-bg-card hover:bg-fluent-bg-hover
                                p-4 sm:p-5 tall:p-5.5
                                shadow-soft dark:shadow-none hover:shadow-depth hover:border-fluent-stroke-strong hover:-translate-y-0.5
                                transition-all duration-200 ease-in-out
                                active:scale-[0.99]
                                flex flex-col justify-between h-full
                                min-h-[220px] sm:min-h-[230px]
                                animate-slide-up stagger-2
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg focus-visible:border-fluent-brand-bg
                            "
                        >
                            {/* Top Brand Gradient Accent Bar */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary-gradient" />

                            {/* Subtle Ambient Brand Aura */}
                            <div className="pointer-events-none absolute -right-8 -top-8 w-36 h-36 rounded-full bg-fluent-info-bg opacity-30 blur-xl group-hover:opacity-60 transition-opacity" />

                            <div className="relative z-10 flex flex-col gap-2.5">
                                {/* Badges */}
                                <div className="flex items-start justify-between">
                                    <img
                                        src={aiCompanionTool.iconUrl}
                                        alt={`${aiCompanionTool.title} icon`}
                                        className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200 ease-in-out"
                                    />
                                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                                        {aiCompanionTool.isNew && (
                                            <span className="inline-flex items-center gap-1 bg-fluent-brand-bg text-white text-[10.5px] tall:text-[11px] px-2 py-0.5 rounded-[4px] font-semibold shadow-sm">
                                                <Star className="w-3 h-3 fill-current" />
                                                New
                                            </span>
                                        )}
                                        {aiCompanionTool.hasAi && (
                                            <span className="inline-flex items-center gap-1 bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-brand-fg text-[10.5px] tall:text-[11px] px-2 py-0.5 rounded-[4px] font-medium shadow-sm group-hover:border-fluent-stroke-strong transition-colors">
                                                <Sparkles className="w-3 h-3" />
                                                AI Powered
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <div>
                                    <h2 className="text-[15.5px] sm:text-[16.5px] font-semibold text-fluent-fg-primary mb-1 group-hover:text-fluent-brand-fg transition-colors duration-200 leading-snug">
                                        {aiCompanionTool.title}
                                    </h2>
                                    <p className="text-[12.5px] sm:text-[13px] text-fluent-fg-secondary leading-relaxed line-clamp-3">
                                        {aiCompanionTool.description}
                                    </p>
                                </div>

                                {/* Feature Tags */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    {aiCompanionTool.tags.map((tag) => (
                                        <span
                                            key={tag.label}
                                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] text-fluent-fg-primary"
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${tag.color} shrink-0`} />
                                            <span>{tag.label}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Footer Bar */}
                            <div className="relative z-10 mt-3 pt-2.5 border-t border-fluent-stroke-subtle flex items-center justify-start">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(aiCompanionTool.path);
                                    }}
                                    className="px-3 h-[32px] bg-fluent-brand-bg text-white rounded-[4px] text-[12.5px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                    <span>Launch Role Designer</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                            </div>
                        </div>

                        {/* Row 2: 3 Balanced Companion Tools */}
                        {companionTools.map((tool, index) => (
                            <div
                                key={tool.id}
                                onClick={() => navigate(tool.path)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate(tool.path);
                                    }
                                }}
                                aria-label={tool.title}
                                className={`
                                    relative group cursor-pointer overflow-hidden
                                    bg-fluent-bg-card hover:bg-fluent-bg-hover
                                    rounded-xl p-3.5 sm:p-4 tall:p-4.5
                                    border border-fluent-stroke-subtle shadow-soft dark:shadow-none
                                    hover:shadow-depth hover:border-fluent-stroke-strong hover:-translate-y-0.5
                                    transition-all duration-200 ease-in-out
                                    active:scale-[0.98]
                                    flex flex-col justify-between h-full
                                    min-h-[200px] sm:min-h-[210px] tall:min-h-[225px]
                                    animate-slide-up stagger-${index + 3}
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg focus-visible:border-fluent-brand-bg
                                `}
                            >
                                <div className="relative z-10 flex flex-col">
                                    {/* Icon & Badges */}
                                    <div className="flex items-start justify-between mb-2">
                                        <img
                                            src={tool.iconUrl}
                                            alt={`${tool.title} icon`}
                                            className="w-10 h-10 sm:w-11 sm:h-11 tall:w-12 tall:h-12 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200 ease-in-out"
                                        />
                                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                                            {tool.isNew && (
                                                <span className="inline-flex items-center gap-1 bg-fluent-brand-bg text-white text-[10.5px] tall:text-[11px] px-2 py-0.5 rounded-[4px] font-semibold shadow-sm">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    New
                                                </span>
                                            )}
                                            {tool.hasAi && (
                                                <span className="inline-flex items-center gap-1 bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-brand-fg text-[10.5px] tall:text-[11px] px-2 py-0.5 rounded-[4px] font-medium shadow-sm group-hover:border-fluent-stroke-strong transition-colors">
                                                    <Sparkles className="w-3 h-3" />
                                                    AI Powered
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <div>
                                        <h2 className="text-[14.5px] sm:text-[15.5px] tall:text-[16px] font-semibold text-fluent-fg-primary mb-1.5 group-hover:text-fluent-brand-fg transition-colors duration-200 leading-snug">
                                            {tool.title}
                                        </h2>
                                        <p className="text-[12.5px] sm:text-[13px] tall:text-[13.5px] text-fluent-fg-secondary leading-relaxed line-clamp-3">
                                            {tool.description}
                                        </p>
                                    </div>

                                    {/* Feature Tags */}
                                    {tool.tags && (
                                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                            {tool.tags.map((tag) => (
                                                <span
                                                    key={tag.label}
                                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] text-fluent-fg-primary"
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${tag.color} shrink-0`} />
                                                    <span>{tag.label}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Action Footer */}
                                <div className="mt-3 pt-2 border-t border-fluent-stroke-subtle/70 flex items-center justify-between text-[12px] sm:text-[12.5px] font-semibold text-fluent-brand-fg group-hover:text-fluent-brand-hover transition-colors">
                                    <span className="group-hover:underline">Open tool</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Standards & Architecture Reference Hub (Expansive Full Width) */}
                <section className="w-full min-w-0" aria-label="Standards and Architecture Reference Hub">
                    <QuickActionsDeck />
                </section>

                {/* Section 3: Azure Service Updates (Horizontal Stream Carousel) */}
                <section className="w-full min-w-0" aria-label="Azure Service Updates Feed">
                    <AzureUpdatesFeed layout="horizontal" />
                </section>

            </div>
        </div>
    );
}
