import React, { useState } from 'react';
import { ExternalLink, Network, FileCode2, ChevronDown, ChevronRight, Layers, Info } from 'lucide-react';
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
        <div className="flex flex-col flex-1 w-full min-w-0 overflow-x-hidden">
            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 animate-fade-in flex-1 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-[22px] md:text-[24px] font-normal text-fluent-fg-primary mb-2">
                        Management Group Topology Designer
                    </h1>
                    <p className="text-[13px] md:text-[14px] text-fluent-fg-secondary max-w-3xl">
                        Visually design your Azure Management Group hierarchy and automatically generate the corresponding Bicep or Terraform deployment code.
                    </p>
                </div>

                <div className="flex flex-col gap-8 flex-1 min-h-0 pb-8">
                    {/* Top Section - Designer */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden mb-2">
                            <div
                                className="px-3 py-2.5 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
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
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 flex-shrink-0 text-fluent-brand-fg" />
                                        <p className="text-fluent-fg-primary text-[13px]">
                                            How to use this tool
                                        </p>
                                        {isGuidanceExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-0.5" /> : <ChevronRight className="w-3.5 h-3.5 ml-0.5" />}
                                    </div>
                                    <a
                                        href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] text-[13px] font-medium hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shrink-0"
                                    >
                                        <svg viewBox="0 0 23 23" className="w-[14px] h-[14px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 0h11v11H0z" fill="#f35325" />
                                            <path d="M12 0h11v11H12z" fill="#81bc06" />
                                            <path d="M0 12h11v11H0z" fill="#05a6f0" />
                                            <path d="M12 12h11v11H12z" fill="#ffba08" />
                                        </svg>
                                        <span className="hidden sm:inline">Microsoft Learn</span>
                                        <span className="sm:hidden">Docs</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                {isGuidanceExpanded && (
                                    <ul className="list-disc pl-5 ml-8 flex flex-col gap-2 mt-4 text-[13px] text-fluent-fg-secondary cursor-default" onClick={(e) => e.stopPropagation()}>
                                        <li><strong>Design Topology:</strong> Use the Topology Designer tab to visually build and organize your management group hierarchy. Add, rename, or remove groups as needed.</li>
                                        <li><strong>Generate Code:</strong> Switch to the Infrastructure as Code tab to instantly generate Bicep or Terraform templates based on your visual design.</li>
                                        <li><strong>Export & Deploy:</strong> Copy the generated code to use in your CI/CD pipelines or deploy directly to your Azure environment.</li>
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col min-w-0 w-full flex-1">
                            {/* Tabs Header */}
                            <div className="flex mb-6">
                                <div className="flex bg-fluent-bg-subtle rounded-md p-1 w-full sm:w-auto border border-fluent-stroke-subtle">
                                    <button
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-[14px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg rounded-sm ${activeTab === 'designer' ? 'bg-fluent-bg-card text-fluent-brand-fg shadow-sm font-semibold' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium'}`}
                                        onClick={() => setActiveTab('designer')}
                                    >
                                        <Network className="w-4 h-4" />
                                        Topology Designer
                                    </button>
                                    <button
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-[14px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg rounded-sm ${activeTab === 'code' ? 'bg-fluent-bg-card text-fluent-brand-fg shadow-sm font-semibold' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-black/5 dark:hover:bg-white/5 font-medium'}`}
                                        onClick={() => setActiveTab('code')}
                                    >
                                        <FileCode2 className="w-4 h-4" />
                                        Infrastructure as Code
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'designer' ? (
                                <div className="flex flex-col min-w-0 w-full animate-fade-in flex-1">
                                    <TopologyTreeBuilder topology={topology} setTopology={setTopology} />
                                </div>
                            ) : (
                                <div className="flex flex-col w-full min-w-0 animate-fade-in flex-1">
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
