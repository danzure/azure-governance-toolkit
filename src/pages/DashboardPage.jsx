import { useNavigate } from 'react-router-dom';
import { Boxes, Shield, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

export default function DashboardPage() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'azure-resources',
            title: 'Azure Resource Naming',
            description: 'Generate standard compliant names for Azure resources based on the Cloud Adoption Framework.',
            icon: Boxes,
            path: '/azure-resources',
            colorClass: 'text-fluent-brand-fg',
            bgClass: 'bg-fluent-brand-bg/10 dark:bg-fluent-brand-bg/20',
        },
        {
            id: 'conditional-access',
            title: 'CA Policy Builder',
            description: 'Design, document, and build Conditional Access policies with standard naming conventions.',
            icon: Shield,
            path: '/conditional-access',
            colorClass: 'text-fluent-cat-purple-fg',
            bgClass: 'bg-fluent-cat-purple-bg',
        }
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-48px)] w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 animate-fade-in flex-1 flex flex-col justify-center">
                <div className="w-full">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-fluent-fg-primary mb-3">
                        Cloud Tools Dashboard
                    </h1>
                    <p className="text-fluent-fg-secondary text-lg max-w-2xl mx-auto sm:mx-0">
                        Select a tool to standardize, manage, and govern your cloud environment effectively.
                    </p>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                        <div
                            key={tool.id}
                            onClick={() => navigate(tool.path)}
                            className={`
                                relative group cursor-pointer 
                                bg-fluent-bg-card rounded-xl p-6
                                border border-fluent-stroke-subtle
                                shadow-soft hover:shadow-depth hover:-translate-y-1
                                transition-all duration-300 ease-in-out
                                flex flex-col h-full animate-slide-up stagger-${index + 1}
                            `}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${tool.bgClass}`}>
                                    <Icon className={`w-8 h-8 ${tool.colorClass}`} />
                                </div>
                                <div className="text-fluent-fg-tertiary group-hover:text-fluent-brand-fg transition-colors">
                                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                            </div>
                            
                            <h2 className="text-xl font-semibold text-fluent-fg-primary mb-2">
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
            </div>
            </div>
            <Footer />
        </div>
    );
}
