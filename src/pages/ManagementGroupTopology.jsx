import { useState } from 'react';
import { ExternalLink, Network, FileCode2, ChevronDown, ChevronRight, Info } from 'lucide-react';
import TopologyTreeBuilder from '../components/topology/TopologyTreeBuilder';
import TopologyCodeGenerator from '../components/topology/TopologyCodeGenerator';
import useLocalStorage from '../hooks/useLocalStorage';

export default function ManagementGroupTopologyPage() {
    const [activeTab, setActiveTab] = useState('designer');
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
    const [topology, setTopology] = useLocalStorage('azres_topology', [
        {
            id: 'root',
            name: 'Tenant Root Group',
            children: [
                {
                    id: 'mg-contoso',
                    name: 'Contoso Root',
                    children: [
                        {
                            id: 'mg-platform',
                            name: 'Platform',
                            children: []
                        },
                        {
                            id: 'mg-landingzones',
                            name: 'Landing Zones',
                            children: [
                                {
                                    id: 'mg-corp',
                                    name: 'Corp',
                                    children: []
                                },
                                {
                                    id: 'mg-online',
                                    name: 'Online',
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]);

    return (
        <div className="flex flex-col flex-1 w-full min-w-0 min-h-0 overflow-x-hidden">
            <div className="max-w-[1600px] w-full min-w-0 min-h-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 animate-fade-in flex-1 flex flex-col">
                <div className="mb-8 shrink-0">
                    <h1 className="text-[22px] md:text-[24px] font-normal text-fluent-fg-primary mb-2">
                        Management Group Topology Designer
                    </h1>
                    <p className="text-[13px] md:text-[14px] text-fluent-fg-secondary max-w-3xl">
                        Visually design your Azure Management Group hierarchy and automatically generate the corresponding Bicep or Terraform deployment code.
                    </p>
                </div>

                <div className="flex flex-col gap-8 flex-1 min-h-0 pb-8">
                    {/* Top Section - Designer */}
                    <div className="flex flex-col gap-4 flex-1 min-h-0">
                        <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden mb-2 shrink-0">
                            <div
                                className="px-3 py-1.5 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-fluent-bg-hover transition-colors"
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
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 flex-shrink-0 text-fluent-brand-fg" />
                                        <p className="text-fluent-fg-primary text-[13px]">
                                            How to use this tool
                                        </p>
                                        {isGuidanceExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-0.5" /> : <ChevronRight className="w-3.5 h-3.5 ml-0.5" />}
                                    </div>

                                {isGuidanceExpanded && (
                                    <div className="mt-3 flex flex-col gap-3 text-[13px] text-fluent-info-text dark:text-fluent-fg-secondary cursor-default" onClick={(e) => e.stopPropagation()}>
                                        <p>
                                            This tool helps you design Azure management group hierarchies aligned with the <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Cloud Adoption Framework (CAF) <ExternalLink className="w-3 h-3 ml-0.5" /></a> best practices.
                                        </p>
                                        <ul className="list-disc pl-5 ml-2 flex flex-col gap-2">
                                            <li><strong>Design Topology:</strong> Use the Topology Designer tab to visually build and organize your management group hierarchy. Add, rename, or remove groups as needed.</li>
                                            <li><strong>Generate Code:</strong> Switch to the Code Templates (IaC) tab to instantly generate Bicep or Terraform templates based on your visual design.</li>
                                            <li><strong>Export & Deploy:</strong> Copy the generated code to use in your CI/CD pipelines or deploy directly to your Azure environment.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col min-w-0 w-full flex-1 min-h-0">
                            {/* Tabs Header */}
                            <div className="flex mb-6 shrink-0">
                                <div className="flex bg-fluent-bg-subtle rounded-md p-1 w-full sm:w-auto border border-fluent-stroke-subtle">
                                    <button
                                        onClick={() => setActiveTab('designer')}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-[14px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg rounded-sm ${activeTab === 'designer' ? 'bg-fluent-info-bg text-fluent-brand-fg shadow-sm font-semibold' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover font-medium'}`}
                                    >
                                        <Network className="w-4 h-4" />
                                        Topology Designer
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('code')}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-[14px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg rounded-sm ${activeTab === 'code' ? 'bg-fluent-info-bg text-fluent-brand-fg shadow-sm font-semibold' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover font-medium'}`}
                                    >
                                        <FileCode2 className="w-4 h-4" />
                                        Code Templates (IaC)
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'designer' ? (
                                <div className="flex flex-col min-w-0 w-full animate-fade-in flex-1 min-h-0">
                                    <TopologyTreeBuilder topology={topology} setTopology={setTopology} />
                                </div>
                            ) : (
                                <div className="flex flex-col w-full min-w-0 animate-fade-in flex-1 min-h-0">
                                    <TopologyCodeGenerator topology={topology} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
