import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Sparkles,
    Plus,
    Star
} from 'lucide-react';
import AzureUpdatesFeed from '../components/dashboard/AzureUpdatesFeed';
import QuickActionsDeck from '../components/dashboard/QuickActionsDeck';

export default function DashboardPage() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'azure-resources',
            title: 'Azure Resource Naming Tool',
            description: 'Instantly generate standard-compliant names for 100+ Azure resources using Cloud Adoption Framework guidelines.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg',
            path: '/resource-naming',
            hasAi: true,
        },
        {
            id: 'conditional-access',
            title: 'Conditional Access Policy Builder',
            description: 'Design, build, and document secure Conditional Access policies using standardized naming conventions.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg',
            path: '/conditional-access',
        },
        {
            id: 'management-group-topology',
            title: 'Management Group Topology',
            description: 'Visually architect your Azure Management Group hierarchy utilizing enterprise best-practice topologies.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            path: '/management-groups',
        },
        {
            id: 'rbac-designer',
            title: 'RBAC Custom Role Designer',
            description: 'Design and generate JSON definitions for Azure Custom Roles by selecting specific resource provider operations.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Azure-AD-Roles-and-Administrators.svg',
            path: '/rbac-designer',
            hasAi: true,
            isNew: true,
        },
        {
            id: 'tagging-strategy',
            title: 'Tagging Strategy Builder',
            description: 'Define organizational tagging strategies and automatically generate Azure Policy compliance rules.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Tags.svg',
            path: '/tagging-strategy',
        }
    ];

    return (
        <div className="flex flex-col flex-1 w-full min-w-0 bg-fluent-bg-canvas">
            <div className="w-full min-w-0 max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6 animate-fade-in flex-1 flex flex-col justify-start">

                {/* Two-Column Responsive Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full min-w-0">

                    {/* Left Column: Primary Governance Workspace (~68% / 8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-5 sm:gap-6 min-w-0 w-full">

                        {/* Section: Available Tools */}
                        <div className="flex flex-col gap-3">
                            {/* Section Header */}
                            <div>
                                <h1 className="text-[17px] sm:text-[18px] font-bold tracking-tight text-fluent-fg-primary">
                                    Governance & Architecture Tools
                                </h1>
                                <p className="text-[12.5px] text-fluent-fg-secondary">
                                    Interactive utilities for cloud architects, security engineers, and DevOps teams
                                </p>
                            </div>

                            {/* Tools Grid (All tools visible, responsive grid) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                                {tools.map((tool, index) => (
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
                                        className={`
                                            relative group cursor-pointer overflow-hidden
                                            bg-fluent-bg-card hover:bg-fluent-bg-hover
                                            rounded-xl p-4 sm:p-4.5
                                            border border-fluent-stroke-subtle shadow-soft dark:shadow-none
                                            hover:shadow-depth hover:border-fluent-stroke-strong hover:-translate-y-0.5
                                            dark:hover:shadow-none
                                            transition-all duration-200 ease-in-out
                                            active:scale-[0.98]
                                            flex flex-col justify-between
                                            min-h-[220px]
                                            animate-slide-up stagger-${index + 1}
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg focus-visible:border-fluent-brand-bg
                                        `}
                                    >
                                        <div className="relative z-10 flex flex-col">
                                            {/* Icon & Badges */}
                                            <div className="flex items-start justify-between mb-3">
                                                <img
                                                    src={tool.iconUrl}
                                                    alt={`${tool.title} icon`}
                                                    className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200 ease-in-out"
                                                />
                                                <div className="flex flex-wrap items-center justify-end gap-1.5">
                                                    {tool.isNew && (
                                                        <span className="inline-flex items-center gap-1 bg-fluent-brand-bg text-white text-[10.5px] px-2 py-0.5 rounded-[4px] font-medium shadow-sm transition-colors duration-200">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            New
                                                        </span>
                                                    )}
                                                    {tool.hasAi && (
                                                        <span className="inline-flex items-center gap-1 bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-brand-fg text-[10.5px] px-2 py-0.5 rounded-[4px] font-medium shadow-sm group-hover:border-fluent-stroke-strong transition-colors duration-200">
                                                            <Sparkles className="w-3 h-3" />
                                                            AI Powered
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Title & Description */}
                                            <div>
                                                <h3 className="text-[15.5px] font-bold text-fluent-fg-primary mb-1.5 group-hover:text-fluent-brand-fg transition-colors duration-200 leading-snug">
                                                    {tool.title}
                                                </h3>
                                                <p className="text-[12.5px] text-fluent-fg-secondary leading-relaxed line-clamp-3">
                                                    {tool.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="mt-3.5 pt-2.5 border-t border-fluent-stroke-subtle/70 flex items-center justify-between text-[12.5px] font-semibold text-fluent-brand-fg group-hover:text-fluent-brand-hover transition-colors">
                                            <span className="group-hover:underline">Open tool</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                ))}

                                {/* Coming Soon Placeholder */}
                                <div
                                    className="
                                        relative overflow-hidden
                                        bg-fluent-bg-subtle
                                        rounded-xl p-4 sm:p-4.5
                                        border-2 border-dashed border-fluent-stroke-subtle
                                        flex flex-col items-center justify-center text-center
                                        min-h-[220px]
                                        animate-slide-up stagger-6
                                    "
                                >
                                    <div className="flex flex-col items-center gap-2 text-fluent-fg-tertiary">
                                        <div className="w-10 h-10 rounded-lg bg-fluent-bg-card border border-fluent-stroke-subtle flex items-center justify-center shadow-sm">
                                            <Plus className="w-5 h-5 opacity-50" />
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-semibold text-fluent-fg-secondary mb-0.5">More tools coming soon</h3>
                                            <p className="text-[12px]">Stay tuned for new governance modules.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Standards & Architecture Reference Hub */}
                        <QuickActionsDeck />
                    </div>

                    {/* Right Column: Dedicated Azure Updates Feed (~32% / 4 cols) */}
                    <div className="lg:col-span-4 flex flex-col min-w-0 w-full h-[540px] lg:h-0 lg:min-h-full min-h-0">
                        <AzureUpdatesFeed layout="vertical" />
                    </div>

                </div>
            </div>
        </div>
    );
}
