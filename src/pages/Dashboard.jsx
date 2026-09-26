import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Layers, Shield, LayoutTemplate, ExternalLink, ChevronLeft, ChevronRight, Plus, Star } from 'lucide-react';
import AzureUpdatesFeed from '../components/dashboard/AzureUpdatesFeed';

export default function DashboardPage() {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            setCanScrollLeft(scrollLeft > 2);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
        }
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        checkScroll();

        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);

        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                checkScroll();
            });
            resizeObserver.observe(el);
        }

        const timeoutId = setTimeout(checkScroll, 100);

        return () => {
            clearTimeout(timeoutId);
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [checkScroll]);

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
            description: 'Instantly generate standard-compliant names for 100+ Azure resources using Cloud Adoption Framework guidelines.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg',
            path: '/resource-naming',
            bgClass: 'bg-transparent',
            hasAi: true,
        },
        {
            id: 'conditional-access',
            title: 'Conditional Access Policy Builder',
            description: 'Design, build, and document secure Conditional Access policies using standardized naming conventions.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg',
            path: '/conditional-access',
            bgClass: 'bg-transparent',
        },
        {
            id: 'management-group-topology',
            title: 'Management Group Topology',
            description: 'Visually architect your Azure Management Group hierarchy utilizing enterprise best-practice topologies.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            path: '/management-groups',
            bgClass: 'bg-transparent',
        },
        {
            id: 'rbac-designer',
            title: 'RBAC Custom Role Designer',
            description: 'Design and generate JSON definitions for Azure Custom Roles by selecting specific resource provider operations.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Azure-AD-Roles-and-Administrators.svg',
            path: '/rbac-designer',
            bgClass: 'bg-transparent',
            hasAi: true,
            isNew: true,
        },
        {
            id: 'tagging-strategy',
            title: 'Tagging Strategy Builder',
            description: 'Define organizational tagging strategies and automatically generate Azure Policy compliance rules.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Tags.svg',
            path: '/tagging-strategy',
            bgClass: 'bg-transparent',
        }
    ];

    const frameworks = [
        {
            title: 'Azure Landing Zones',
            category: 'Architecture',
            description: 'Scalable multi-subscription architecture with management group hierarchies, networking topologies, and landing zone guardrails.',
            url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/',
            icon: Layers,
            bgClass: 'bg-fluent-cat-green-bg',
            fgClass: 'text-fluent-cat-green-fg',
        },
        {
            title: 'Cloud Adoption Framework',
            category: 'Governance',
            description: 'Proven guidance for standardized resource naming conventions, metadata tagging strategies, and cloud operating models.',
            url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming',
            icon: BookOpen,
            bgClass: 'bg-fluent-cat-blue-bg',
            fgClass: 'text-fluent-cat-blue-fg',
        },
        {
            title: 'Well-Architected Framework',
            category: 'Optimization',
            description: 'Architectural tenets to optimize workload reliability, security, cost efficiency, performance, and operational excellence.',
            url: 'https://learn.microsoft.com/en-us/azure/well-architected/',
            icon: LayoutTemplate,
            bgClass: 'bg-fluent-cat-orange-bg',
            fgClass: 'text-fluent-cat-orange-fg',
        },
        {
            title: 'Zero Trust Architecture',
            category: 'Security',
            description: 'Proactive security model enforcing continuous explicit verification, least-privileged access, and Conditional Access defense.',
            url: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview',
            icon: Shield,
            bgClass: 'bg-fluent-cat-purple-bg',
            fgClass: 'text-fluent-cat-purple-fg',
        },
    ];

    return (
        <div className="flex flex-col flex-1 w-full min-w-0 bg-fluent-bg-canvas">
            <div className="w-full min-w-0 max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 animate-fade-in flex-1 flex flex-col justify-start gap-2.5 sm:gap-3">

                {/* Hero Section */}
                <div className="relative overflow-hidden bg-fluent-bg-card rounded-xl border border-fluent-stroke-subtle p-4 sm:p-5 shadow-soft w-full shrink-0">
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-fluent-fg-primary mb-1.5 tracking-tight leading-[1.2]">
                            Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-fluent-brand-bg to-fluent-brand-hover dark:from-fluent-brand-fg dark:to-fluent-brand-bg">Azure Cloud</span> Governance
                        </h1>
                        <p className="text-[14px] sm:text-[15px] text-fluent-fg-secondary leading-relaxed max-w-2xl">
                            Welcome to <strong className="font-semibold text-fluent-fg-primary">atozazure</strong>! An interactive toolkit designed to guide you through building, managing, and scaling Azure environments with confidence. Explore these practical utilities to help aid in aligning your cloud deployments and policies with industry best practices.
                        </p>
                    </div>

                    {/* Soft Ambient Background Glows */}
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-fluent-brand-bg rounded-full blur-[80px] opacity-5 dark:opacity-10 pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[400px] h-[400px] bg-fluent-brand-bg rounded-full blur-[60px] opacity-5 dark:opacity-10 pointer-events-none" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-fluent-brand-bg rounded-full blur-[60px] opacity-5 dark:opacity-10 pointer-events-none" />
                </div>

                {/* Tools Header & Controls */}
                <div className="flex items-center justify-between">
                    <h2 className="text-[16px] font-semibold tracking-tight text-fluent-fg-primary">
                        Available Tools
                    </h2>
                    <div className="hidden sm:flex items-center gap-1.5">
                        <button 
                            type="button"
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className="shrink-0 h-[26px] w-[26px] rounded-[4px] border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-fg-primary hover:border-fluent-stroke-strong hover:bg-fluent-bg-hover transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 inline-flex items-center justify-center shadow-sm"
                            aria-label="Scroll tools left"
                            title="Scroll left"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button 
                            type="button"
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className="shrink-0 h-[26px] w-[26px] rounded-[4px] border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-fg-primary hover:border-fluent-stroke-strong hover:bg-fluent-bg-hover transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 inline-flex items-center justify-center shadow-sm"
                            aria-label="Scroll tools right"
                            title="Scroll right"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Tools Grid */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-3.5 -mx-1 px-1 pt-1 pb-3.5 snap-x snap-mandatory scrollbar-hide scroll-smooth"
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
                                hover:shadow-depth hover:border-fluent-stroke-strong hover:-translate-y-0.5
                                dark:hover:shadow-none
                                transition-all duration-200 ease-in-out
                                active:scale-[0.98]
                                flex flex-col shrink-0 snap-start
                                w-[80vw] sm:w-[310px] lg:w-[340px]
                                min-h-[240px]
                                animate-slide-up stagger-${index + 1}
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg focus-visible:border-fluent-brand-bg
                            `}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-2.5">
                                    <img
                                        src={tool.iconUrl}
                                        alt={`${tool.title} icon`}
                                        className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200 ease-in-out"
                                    />
                                    <div className="flex gap-2">
                                        {tool.isNew && (
                                            <span className="inline-flex items-center gap-1.5 bg-fluent-brand-bg text-white text-[11px] px-2.5 py-0.5 rounded-[4px] font-medium shadow-sm transition-colors duration-200">
                                                <Star className="w-3 h-3 fill-current" />
                                                New
                                            </span>
                                        )}
                                        {tool.hasAi && (
                                            <span className="inline-flex items-center gap-1.5 bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-brand-fg text-[11px] px-2.5 py-0.5 rounded-[4px] font-medium shadow-sm group-hover:border-fluent-stroke-strong transition-colors duration-200">
                                                <Sparkles className="w-3 h-3" />
                                                AI Powered
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-[16px] font-bold text-fluent-fg-primary mb-1 group-hover:text-fluent-brand-fg transition-colors duration-200">
                                        {tool.title}
                                    </h3>
                                    <p className="text-[13px] text-fluent-fg-secondary leading-relaxed">
                                        {tool.description}
                                    </p>
                                </div>

                                <div className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-fluent-brand-fg opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                                    <span>Get started</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Coming Soon Placeholder */}
                    <div
                        className="
                            relative overflow-hidden
                            bg-fluent-bg-subtle
                            rounded-xl p-4
                            border-2 border-dashed border-fluent-stroke-subtle
                            flex flex-col items-center justify-center text-center
                            shrink-0 snap-start
                            w-[80vw] sm:w-[310px] lg:w-[340px]
                            min-h-[240px]
                            animate-slide-up stagger-5
                        "
                    >
                        <div className="flex flex-col items-center gap-2.5 text-fluent-fg-tertiary">
                            <div className="w-10 h-10 rounded-lg bg-fluent-bg-card border border-fluent-stroke-subtle flex items-center justify-center">
                                <Plus className="w-5 h-5 opacity-50" />
                            </div>
                            <div>
                                <h3 className="text-[14px] font-semibold text-fluent-fg-secondary mb-0.5">More tools coming soon</h3>
                                <p className="text-[12.5px]">Stay tuned for updates.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Azure Updates RSS Feed Widget (Full Width) */}
                <div className="w-full shrink-0">
                    <AzureUpdatesFeed itemsPerPage={4} />
                </div>

                {/* Reference Documentation Single Strip */}
                <div className="w-full rounded-xl border border-fluent-stroke-subtle bg-fluent-bg-card p-2.5 sm:p-3 shadow-soft flex flex-col lg:flex-row lg:items-center gap-2.5 sm:gap-3 shrink-0">
                    <div className="flex items-center justify-between lg:justify-start gap-2 px-1 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-[4px] bg-fluent-cat-blue-bg flex items-center justify-center shrink-0">
                                <BookOpen className="w-3.5 h-3.5 text-fluent-cat-blue-fg" />
                            </div>
                            <h2 className="text-[13px] font-bold text-fluent-fg-primary whitespace-nowrap">
                                Reference Frameworks
                            </h2>
                        </div>
                        <a
                            href="https://learn.microsoft.com/azure/cloud-adoption-framework/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-[4px] border border-fluent-stroke-subtle hover:border-fluent-stroke-strong text-fluent-fg-secondary hover:text-fluent-brand-fg transition-all lg:hidden"
                            title="Browse Cloud Adoption Framework documentation"
                            aria-label="Browse Cloud Adoption Framework documentation"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    <div className="hidden lg:block w-[1px] h-6 bg-fluent-stroke-subtle shrink-0" />

                    {/* 4 Framework Items in a Single Horizontal Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 flex-1 min-w-0">
                        {frameworks.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={item.title}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group flex items-center justify-between
                                        px-2.5 py-1.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-subtle
                                        hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong
                                        transition-all duration-150 active:scale-[0.99] min-w-0
                                    "
                                    title={item.description}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${item.bgClass} ${item.fgClass}`}>
                                            <IconComponent className="w-3 h-3" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[12px] font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors truncate">
                                                {item.title}
                                            </span>
                                            <span className="text-[10.5px] text-fluent-fg-tertiary truncate">
                                                {item.category}
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
