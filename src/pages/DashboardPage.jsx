import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck, Cloud, ExternalLink, Network, ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [infoExpanded, setInfoExpanded] = useState(false);

    const tools = [
        {
            id: 'azure-resources',
            title: 'Azure Resource Naming Tool',
            description: 'Generate standard compliant names for 100+ Azure services based on the Cloud Adoption Framework.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg',
            path: '/azure-resources',
            colorClass: 'text-fluent-brand-fg',
            bgClass: 'bg-transparent',
        },
        {
            id: 'conditional-access',
            title: 'Conditional Access Policy Builder',
            description: 'Design, document, and build Conditional Access policies with standard naming conventions for custom and pre-made policies.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg',
            path: '/conditional-access',
            colorClass: 'text-fluent-cat-purple-fg',
            bgClass: 'bg-transparent',
        },
        {
            id: 'management-group-topology',
            title: 'Management Group Topology Designer',
            description: 'Visually design your Azure Management Group hierarchy using enterprise best-practice topologies.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            path: '/management-group-topology',
            colorClass: 'text-fluent-brand-fg',
            bgClass: 'bg-transparent',
        },
        {
            id: 'tagging-strategy',
            title: 'Tagging Strategy Builder',
            description: 'Define organizational tags and automatically generate Azure Policy compliance rules.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Tags.svg',
            path: '/tagging-strategy',
            colorClass: 'text-fluent-brand-fg',
            bgClass: 'bg-transparent',
        }
    ];

    const resources = [
        {
            title: 'Cloud Adoption Framework',
            url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming',
            description: 'Microsoft best practices for naming and tagging Azure resources.'
        },
        {
            title: 'Azure Landing Zones',
            url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/',
            description: 'Learn about the architecture and design principles for enterprise-scale landing zones.'
        },
        {
            title: 'Conditional Access Documentation',
            url: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview',
            description: 'Design and deploy Microsoft Entra Conditional Access policies.'
        },
        {
            title: 'Well-Architected Framework',
            url: 'https://learn.microsoft.com/en-us/azure/well-architected/',
            description: 'Guiding tenets that can be used to improve the quality of a workload.'
        },
        {
            title: 'Zero Trust Architecture',
            url: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview',
            description: 'Learn about the guiding principles of Zero Trust security.'
        }
    ];

    return (
        <div className="flex flex-col flex-1 w-full min-w-0">
            <div className="w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in flex-1 flex flex-col justify-start">
                <div className="w-full">
                    <div className="mb-6 text-center sm:text-left">
                        <h1 className="text-2xl font-bold tracking-tight text-fluent-fg-primary mb-1">
                            Azure Governance Tools
                        </h1>
                        <p className="text-fluent-fg-secondary text-base max-w-2xl mx-auto sm:mx-0">
                            Streamline your cloud operations with tools designed to standardize resources, manage access policies, and enforce best practices.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 auto-rows-fr">
                        {tools.map((tool, index) => {
                            return (
                                <div
                                    key={tool.id}
                                    onClick={() => navigate(tool.path)}
                                    className={`
                                relative group cursor-pointer 
                                bg-fluent-bg-card rounded-xl p-5
                                border border-fluent-stroke-subtle
                                shadow-soft hover:shadow-depth hover:-translate-y-1
                                transition-all duration-300 ease-in-out
                                flex flex-col h-full animate-slide-up stagger-${index + 1}
                            `}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-3 rounded-lg ${tool.bgClass}`}>
                                            {tool.iconUrl ? (
                                                <img src={tool.iconUrl} alt={`${tool.title} icon`} className="w-10 h-10 object-contain" />
                                            ) : (
                                                <tool.icon className={`w-10 h-10 ${tool.colorClass}`} />
                                            )}
                                        </div>
                                        <div className="text-fluent-fg-tertiary group-hover:text-fluent-brand-fg transition-colors">
                                            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-semibold text-fluent-fg-primary mb-1">
                                        {tool.title}
                                    </h2>

                                    <p className="text-fluent-fg-secondary flex-grow leading-relaxed">
                                        {tool.description}
                                    </p>

                                    {/* Decorative gradient line on hover */}
                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary-gradient group-hover:w-full transition-all duration-500 rounded-b-xl"></div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Informational Sections */}
                    <div className="border-t border-fluent-stroke-subtle pt-6">
                        <div 
                            className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-fluent-bg-subtle transition-colors"
                            onClick={() => setInfoExpanded(!infoExpanded)}
                        >
                            <h2 className="text-xl font-semibold tracking-tight text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors">
                                Information & Resources
                            </h2>
                            {infoExpanded ? (
                                <ChevronUp className="w-5 h-5 text-fluent-fg-secondary group-hover:text-fluent-brand-fg transition-colors" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-fluent-fg-secondary group-hover:text-fluent-brand-fg transition-colors" />
                            )}
                        </div>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${infoExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-2">

                            {/* About Section */}
                            <div className="bg-fluent-bg-card rounded-xl p-5 border border-fluent-stroke-subtle shadow-soft animate-slide-up stagger-3 h-full flex flex-col">
                                <h3 className="text-lg font-semibold text-fluent-fg-primary mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-fluent-brand-fg" />
                                    About This Tool
                                </h3>
                                <div className="space-y-3 text-fluent-fg-secondary leading-relaxed text-[14px]">
                                    <p>
                                        This toolkit is a comprehensive suite designed to help teams build, manage, and scale their cloud environments with confidence. It serves as a centralized hub for aligning deployments with organizational standards and industry best practices.
                                    </p>
                                    <p>
                                        Whether you are designing resource hierarchies, enforcing consistent naming conventions, or establishing robust access and security policies, these utilities are built to streamline your entire governance lifecycle from end to end.
                                    </p>
                                    <p>
                                        By providing intuitive and actionable interfaces, the toolkit reduces deployment friction, minimizes configuration errors, and accelerates the delivery of a secure, compliant, and well-architected infrastructure.
                                    </p>
                                </div>
                            </div>

                            {/* Resources Section */}
                            <div className="bg-fluent-bg-card rounded-xl p-5 border border-fluent-stroke-subtle shadow-soft animate-slide-up stagger-4 flex flex-col h-full">
                                <h3 className="text-lg font-semibold text-fluent-fg-primary mb-3 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-fluent-brand-fg" />
                                    Reference Documentation
                                </h3>
                                <div className="space-y-2 flex-grow flex flex-col justify-center">
                                    {resources.map((resource, idx) => (
                                        <a
                                            key={idx}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block py-2 px-3 rounded-lg border border-fluent-stroke-subtle hover:border-fluent-brand-bg hover:bg-fluent-bg-subtle transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors">
                                                    {resource.title}
                                                </h4>
                                                <ExternalLink className="w-4 h-4 text-fluent-fg-tertiary group-hover:text-fluent-brand-fg transition-colors shrink-0 ml-4" />
                                            </div>
                                            <p className="text-sm text-fluent-fg-secondary leading-relaxed">
                                                {resource.description}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
