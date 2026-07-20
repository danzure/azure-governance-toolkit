import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, BookOpen, Layers, Shield, LayoutTemplate, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'azure-resources',
            title: 'Azure Resource Naming Tool',
            description: 'Generate standard compliant names for 100+ Azure services based on the Cloud Adoption Framework.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg',
            path: '/azure-resources',
            bgClass: 'bg-transparent',
            hasAi: true,
        },
        {
            id: 'conditional-access',
            title: 'Conditional Access Policy Builder',
            description: 'Design, document, and build Conditional Access policies with standard naming conventions for custom and pre-made policies.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg',
            path: '/conditional-access',
            bgClass: 'bg-transparent',
        },
        {
            id: 'management-group-topology',
            title: 'Management Group Topology Designer',
            description: 'Visually design your Azure Management Group hierarchy using enterprise best-practice topologies.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            path: '/management-group-topology',
            bgClass: 'bg-transparent',
        },
        {
            id: 'tagging-strategy',
            title: 'Tagging Strategy Builder',
            description: 'Define organizational tags and automatically generate Azure Policy compliance rules.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Tags.svg',
            path: '/tagging-strategy',
            bgClass: 'bg-transparent',
        }
    ];

    return (
        <div className="flex flex-col flex-1 w-full min-w-0 bg-fluent-bg-canvas">
            <div className="w-full min-w-0 max-w-[1600px] mx-auto px-4 sm:px-6 py-6 animate-fade-in flex-1 flex flex-col justify-start gap-8">
                
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-primary-gradient dark:bg-none dark:bg-fluent-bg-card rounded-xl border border-fluent-stroke-subtle p-8 sm:p-10 shadow-soft w-full">
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-4 rounded-[4px] bg-white/20 dark:bg-fluent-brand-bg/10 border border-white/20 dark:border-fluent-brand-bg/20 shadow-sm backdrop-blur-md">
                            <ShieldCheck className="w-3.5 h-3.5 text-white dark:text-fluent-brand-fg" />
                            <span className="text-[11px] font-medium text-white dark:text-fluent-brand-fg tracking-wide uppercase">Governance Toolkit</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white dark:text-fluent-fg-primary mb-3 tracking-tight">
                            Streamline Your Azure Cloud Governance
                        </h1>
                        <p className="text-[15px] sm:text-base text-white/90 dark:text-fluent-fg-secondary leading-relaxed">
                            A comprehensive suite designed to help teams build, manage, and scale their cloud environments with confidence. Align your deployments with organizational standards and industry best practices.
                        </p>
                    </div>
                    {/* Abstract decorative elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[400px] h-[400px] bg-white/10 dark:bg-fluent-brand-bg/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[250px] h-[250px] bg-white/10 dark:bg-fluent-brand-bg/10 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-fr">
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
                                rounded-lg p-4
                                border border-fluent-stroke-subtle shadow-soft dark:shadow-none
                                hover:shadow-depth hover:border-fluent-stroke-strong 
                                transition-all duration-200 ease-in-out
                                active:scale-[0.98]
                                flex flex-col h-full animate-slide-up stagger-${index + 1}
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 focus-visible:border-fluent-brand-bg
                            `}
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-5">
                                    <img 
                                        src={tool.iconUrl} 
                                        alt={`${tool.title} icon`} 
                                        className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out" 
                                    />
                                    {tool.hasAi && (
                                        <span className="inline-flex items-center gap-1.5 bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-brand-fg text-[11px] px-2 min-h-[20px] rounded-[4px] font-medium shadow-sm">
                                            <Sparkles className="w-3 h-3" />
                                            AI Powered
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-[16px] font-semibold text-fluent-fg-primary mb-1.5 group-hover:text-fluent-brand-fg transition-colors duration-200">
                                        {tool.title}
                                    </h2>
                                    <p className="text-[13px] text-fluent-fg-secondary leading-relaxed">
                                        {tool.description}
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center gap-1.5 text-[13px] font-medium text-fluent-brand-fg opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                                    <span>Get started</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Informational Sections */}
                <div className="mt-8 pt-8 border-t border-fluent-stroke-subtle">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Left Column: About */}
                        <div className="lg:col-span-1">
                            <h2 className="text-[17px] font-semibold tracking-tight text-fluent-fg-primary mb-3">
                                About the Toolkit
                            </h2>
                            <p className="text-[13.5px] text-fluent-fg-secondary leading-relaxed">
                                Whether you are designing resource hierarchies, enforcing consistent naming conventions, or establishing robust access and security policies, these utilities are built to streamline your entire governance lifecycle from end to end. By providing intuitive and actionable interfaces, the toolkit reduces deployment friction, minimizes configuration errors, and accelerates the delivery of a secure, compliant, and well-architected infrastructure.
                            </p>
                        </div>
                        
                        {/* Right Column: Resources Grid */}
                        <div className="lg:col-span-2 flex flex-col">
                            <h2 className="text-[17px] font-semibold tracking-tight text-fluent-fg-primary mb-4">
                                Microsoft Reference Frameworks
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 p-3 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shadow-sm hover:shadow-soft">
                                    <div className="w-9 h-9 rounded bg-fluent-cat-blue-bg flex items-center justify-center text-fluent-cat-blue-fg shrink-0">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors flex items-center gap-1.5">
                                            Cloud Adoption Framework
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[12px] text-fluent-fg-tertiary truncate mt-0.5">Best practices for naming and tagging</div>
                                    </div>
                                </a>

                                <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 p-3 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shadow-sm hover:shadow-soft">
                                    <div className="w-9 h-9 rounded bg-fluent-cat-green-bg flex items-center justify-center text-fluent-cat-green-fg shrink-0">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors flex items-center gap-1.5">
                                            Azure Landing Zones
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[12px] text-fluent-fg-tertiary truncate mt-0.5">Enterprise-scale architecture principles</div>
                                    </div>
                                </a>

                                <a href="https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 p-3 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shadow-sm hover:shadow-soft">
                                    <div className="w-9 h-9 rounded bg-fluent-cat-purple-bg flex items-center justify-center text-fluent-cat-purple-fg shrink-0">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors flex items-center gap-1.5">
                                            Zero Trust Architecture
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[12px] text-fluent-fg-tertiary truncate mt-0.5">Identity and security principles</div>
                                    </div>
                                </a>

                                <a href="https://learn.microsoft.com/en-us/azure/well-architected/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 p-3 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shadow-sm hover:shadow-soft">
                                    <div className="w-9 h-9 rounded bg-fluent-cat-orange-bg flex items-center justify-center text-fluent-cat-orange-fg shrink-0">
                                        <LayoutTemplate className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors flex items-center gap-1.5">
                                            Well-Architected Framework
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[12px] text-fluent-fg-tertiary truncate mt-0.5">Core tenets for quality workloads</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
