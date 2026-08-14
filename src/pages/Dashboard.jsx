import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, BookOpen, Layers, Shield, LayoutTemplate, ExternalLink, ChevronLeft, ChevronRight, Plus, Eye, Award } from 'lucide-react';

export default function DashboardPage() {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -366 : 366;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const tools = [
        {
            id: 'azure-resources',
            title: 'Azure Resource Naming Tool',
            description: 'Generate standard compliant names for 100+ Azure services based on the Cloud Adoption Framework.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg',
            path: '/resource-naming',
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
            title: 'Management Group Topology',
            description: 'Visually design your Azure Management Group hierarchy using enterprise best-practice topologies.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            path: '/management-groups',
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
            <div className="w-full min-w-0 max-w-[1600px] mx-auto px-4 sm:px-6 py-3 sm:py-4 animate-fade-in flex-1 flex flex-col justify-start gap-3 sm:gap-4">

                {/* Hero Section */}
                <div className="relative overflow-hidden bg-fluent-bg-card rounded-xl border border-fluent-stroke-subtle p-5 sm:p-6 shadow-soft w-full shrink-0">
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-fluent-fg-primary mb-2 tracking-tight leading-[1.2]">
                            Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-fluent-brand-bg to-fluent-brand-hover dark:from-fluent-brand-fg dark:to-fluent-brand-bg">Azure Cloud</span> Governance
                        </h1>
                        <p className="text-[15px] sm:text-[16px] text-fluent-fg-secondary leading-relaxed max-w-2xl">
                            Welcome to <strong className="font-semibold text-fluent-fg-primary">atozazure</strong>! An interactive toolkit designed to guide you through building, managing, and scaling Azure environments with confidence. Explore these practical utilities to help aid in aligning your cloud deployments and policies with industry best practices.
                        </p>
                    </div>

                    {/* Soft Ambient Background Glows */}
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-fluent-brand-bg rounded-full blur-[80px] opacity-5 dark:opacity-10 pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[400px] h-[400px] bg-fluent-brand-bg rounded-full blur-[60px] opacity-5 dark:opacity-10 pointer-events-none" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-fluent-brand-bg rounded-full blur-[60px] opacity-5 dark:opacity-10 pointer-events-none" />
                </div>

                {/* Tools Header & Controls */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[17px] font-semibold tracking-tight text-fluent-fg-primary">
                        Available Tools
                    </h2>
                    <div className="hidden sm:flex items-center gap-2">
                        <button 
                            onClick={() => scroll('left')}
                            className="p-1.5 rounded-[4px] border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-fg-primary hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 shadow-sm"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="p-1.5 rounded-[4px] border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-fg-primary hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 shadow-sm"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tools Grid */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                >
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
                                rounded-xl p-4
                                border border-fluent-stroke-subtle shadow-soft dark:shadow-none
                                hover:shadow-depth hover:border-fluent-stroke-strong 
                                transition-all duration-300 ease-out
                                active:scale-[0.98]
                                flex flex-col shrink-0 snap-start
                                w-[80vw] sm:w-[320px] lg:w-[350px]
                                min-h-[260px]
                                animate-slide-up stagger-${index + 1}
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 focus-visible:border-fluent-brand-bg
                            `}
                        >
                            {/* Ambient Hover Glow */}
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[200px] h-[200px] bg-fluent-brand-bg rounded-full blur-[50px] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-3">
                                    <img
                                        src={tool.iconUrl}
                                        alt={`${tool.title} icon`}
                                        className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out"
                                    />
                                    {tool.hasAi && (
                                        <span className="inline-flex items-center gap-1.5 bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-brand-fg text-[11px] px-2.5 py-0.5 rounded-[4px] font-medium shadow-sm group-hover:border-fluent-brand-bg/30 transition-colors duration-300">
                                            <Sparkles className="w-3 h-3" />
                                            AI Powered
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-[17px] font-bold text-fluent-fg-primary mb-1 group-hover:text-fluent-brand-fg transition-colors duration-300">
                                        {tool.title}
                                    </h2>
                                    <p className="text-[13.5px] text-fluent-fg-secondary leading-relaxed">
                                        {tool.description}
                                    </p>
                                </div>

                                <div className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-fluent-brand-fg opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                    <span>Get started</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Coming Soon Placeholder */}
                    <div
                        className="
                            relative overflow-hidden
                            bg-fluent-bg-canvas/50
                            rounded-xl p-4
                            border-2 border-dashed border-fluent-stroke-subtle
                            flex flex-col items-center justify-center text-center
                            shrink-0 snap-start
                            w-[80vw] sm:w-[320px] lg:w-[350px]
                            min-h-[260px]
                            animate-slide-up stagger-5
                        "
                    >
                        <div className="flex flex-col items-center gap-3 text-fluent-fg-tertiary">
                            <div className="w-12 h-12 rounded-full bg-fluent-bg-subtle flex items-center justify-center">
                                <Plus className="w-6 h-6 opacity-50" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-fluent-fg-secondary mb-1">More tools coming soon</h3>
                                <p className="text-[13px]">We're constantly working on new utilities.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informational Sections */}
                <div className="mt-2 pt-6 border-t border-fluent-stroke-subtle shrink-0">
                    <div className="flex flex-col gap-6">
                        {/* About */}
                        <div className="w-full">
                            <h2 className="text-[17px] font-semibold tracking-tight text-fluent-fg-primary mb-1">
                                Key Benefits
                            </h2>
                            <div className="space-y-1.5">
                                <p className="text-[13.5px] text-fluent-fg-secondary leading-relaxed">
                                    A structured approach to Azure governance helps you build better, more reliable cloud environments:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 pt-2">
                                    <li className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                                            <strong className="text-[13.5px] font-semibold text-fluent-fg-primary">Consistency</strong>
                                        </div>
                                        <p className="text-[13px] text-fluent-fg-secondary leading-relaxed">
                                            Generate standardized naming conventions and maintain clear, well-structured resource hierarchies.
                                        </p>
                                    </li>
                                    <li className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                                            <strong className="text-[13.5px] font-semibold text-fluent-fg-primary">Security</strong>
                                        </div>
                                        <p className="text-[13px] text-fluent-fg-secondary leading-relaxed">
                                            Design and implement robust access policies aligned with core security principles from the start.
                                        </p>
                                    </li>
                                    <li className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                                            <strong className="text-[13.5px] font-semibold text-fluent-fg-primary">Visibility</strong>
                                        </div>
                                        <p className="text-[13px] text-fluent-fg-secondary leading-relaxed">
                                            Use effective tagging strategies to easily track, organize, and manage your cloud resources.
                                        </p>
                                    </li>
                                    <li className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                                            <strong className="text-[13.5px] font-semibold text-fluent-fg-primary">Best Practices</strong>
                                        </div>
                                        <p className="text-[13px] text-fluent-fg-secondary leading-relaxed">
                                            Confidently align your projects and deployments with proven Microsoft architectural guidelines.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Resources Grid */}
                        <div className="w-full flex flex-col pt-6 border-t border-fluent-stroke-subtle">
                            <h2 className="text-[17px] font-semibold tracking-tight text-fluent-fg-primary mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" className="w-5 h-5 shrink-0">
                                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                                </svg>
                                Microsoft Reference Frameworks
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
                                <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shadow-sm hover:shadow-soft">
                                    <div className="w-8 h-8 rounded bg-fluent-cat-blue-bg flex items-center justify-center text-fluent-cat-blue-fg shrink-0">
                                        <BookOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors flex items-center gap-1.5">
                                            Cloud Adoption Framework
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[12px] text-fluent-fg-tertiary mt-0.5 leading-snug">Proven guidance and best practices for adopting the cloud.</div>
                                    </div>
                                </a>

                                <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shadow-sm hover:shadow-soft">
                                    <div className="w-8 h-8 rounded bg-fluent-cat-green-bg flex items-center justify-center text-fluent-cat-green-fg shrink-0">
                                        <Layers className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors flex items-center gap-1.5">
                                            Azure Landing Zones
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[12px] text-fluent-fg-tertiary mt-0.5 leading-snug">An architectural approach for scalable Azure environments.</div>
                                    </div>
                                </a>

                                <a href="https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shadow-sm hover:shadow-soft">
                                    <div className="w-8 h-8 rounded bg-fluent-cat-purple-bg flex items-center justify-center text-fluent-cat-purple-fg shrink-0">
                                        <Shield className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors flex items-center gap-1.5">
                                            Zero Trust Architecture
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[12px] text-fluent-fg-tertiary mt-0.5 leading-snug">A proactive, integrated approach to security across your digital estate.</div>
                                    </div>
                                </a>

                                <a href="https://learn.microsoft.com/en-us/azure/well-architected/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shadow-sm hover:shadow-soft">
                                    <div className="w-8 h-8 rounded bg-fluent-cat-orange-bg flex items-center justify-center text-fluent-cat-orange-fg shrink-0">
                                        <LayoutTemplate className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13.5px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors flex items-center gap-1.5">
                                            Well-Architected Framework
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[12px] text-fluent-fg-tertiary mt-0.5 leading-snug">Guiding tenets for improving the quality, reliability, and efficiency of workloads.</div>
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
