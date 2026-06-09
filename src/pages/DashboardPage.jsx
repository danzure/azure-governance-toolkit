import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck, Cloud, ExternalLink, Network } from 'lucide-react';

export default function DashboardPage() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'azure-resources',
            title: 'Azure Resource Naming Tool',
            description: 'Generate standard compliant names for Azure resources based on the Cloud Adoption Framework.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg',
            path: '/azure-resources',
            colorClass: 'text-fluent-brand-fg',
            bgClass: 'bg-transparent',
        },
        {
            id: 'conditional-access',
            title: 'Conditional Access Policy Builder',
            description: 'Design, document, and build Conditional Access policies with standard naming conventions.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg',
            path: '/conditional-access',
            colorClass: 'text-fluent-cat-purple-fg',
            bgClass: 'bg-transparent',
        },
        {
            id: 'management-group-topology',
            title: 'Management Group Topology Designer',
            description: 'Visually design your Azure Management Group hierarchy and generate Bicep or Terraform code.',
            iconUrl: 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg',
            path: '/management-group-topology',
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            {/* About Section */}
                            <div className="bg-fluent-bg-card rounded-xl p-5 border border-fluent-stroke-subtle shadow-soft animate-slide-up stagger-3">
                                <h3 className="text-lg font-semibold text-fluent-fg-primary mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-fluent-brand-fg" />
                                    About This Tool
                                </h3>
                                <div className="space-y-3 text-fluent-fg-secondary leading-relaxed text-[14px]">
                                    <p>
                                        This Azure Governance Tool has been developed to assist cloud architects and engineers in seamlessly aligning their environments with enterprise best practices.
                                    </p>
                                    <p>
                                        By enforcing strict naming conventions mapped directly to the <strong className="text-fluent-fg-primary">Microsoft Cloud Adoption Framework (CAF)</strong>, the tool mitigates deployment failures caused by character constraints or naming collisions—directly supporting the Reliability and Operational Excellence pillars of the <strong className="text-fluent-fg-primary">Well-Architected Framework (WAF)</strong>.
                                    </p>
                                    <p>
                                        The integrated Conditional Access builder standardises your identity perimeter using a predictable <strong className="text-fluent-fg-primary">Zero Trust</strong> naming convention. This fortifies Security while significantly streamlining the auditing and troubleshooting of access policies.
                                    </p>
                                    <p>
                                        Additionally, the new Management Group Topology Designer allows you to visually map out your enterprise-scale landing zones and subscription hierarchies, instantly generating deployable Infrastructure-as-Code (Bicep, Terraform, or ARM) to accelerate your environment setup.
                                    </p>

                                    <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                                        <div className="flex items-center gap-2 bg-fluent-bg-subtle px-3 py-1.5 rounded-md text-sm font-medium border border-fluent-stroke-subtle">
                                            <Cloud className="w-4 h-4 text-[#0078D4]" />
                                            <span className="text-fluent-fg-primary">100+ Azure Services</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-fluent-bg-subtle px-3 py-1.5 rounded-md text-sm font-medium border border-fluent-stroke-subtle">
                                            <ShieldCheck className="w-4 h-4 text-[#107C10]" />
                                            <span className="text-fluent-fg-primary">15+ Default Policies</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-fluent-bg-subtle px-3 py-1.5 rounded-md text-sm font-medium border border-fluent-stroke-subtle">
                                            <Network className="w-4 h-4 text-[#5c2d91]" />
                                            <span className="text-fluent-fg-primary">CAF Topologies</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Resources Section */}
                            <div className="bg-fluent-bg-card rounded-xl p-5 border border-fluent-stroke-subtle shadow-soft animate-slide-up stagger-4 flex flex-col">
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
    );
}
