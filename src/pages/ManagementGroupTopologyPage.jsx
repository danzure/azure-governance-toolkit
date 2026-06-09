import React from 'react';
import { ExternalLink } from 'lucide-react';
import TopologyTreeBuilder from '../components/TopologyTreeBuilder';
import TopologyCodeGenerator from '../components/TopologyCodeGenerator';
import useLocalStorage from '../hooks/useLocalStorage';

export default function ManagementGroupTopologyPage() {
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
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-fluent-fg-primary mb-1">
                        Management Group Topology Designer
                    </h1>
                    <p className="text-fluent-fg-secondary text-base max-w-3xl">
                        Visually design your Azure Management Group hierarchy and automatically generate the corresponding Bicep or Terraform deployment code.
                    </p>
                </div>

                <div className="flex flex-col gap-8 flex-1 min-h-0 pb-8">
                    {/* Top Section - Designer */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-fluent-bg-subtle border border-fluent-stroke-subtle rounded-xl p-4 flex gap-3 text-sm text-fluent-fg-secondary">
                            <img 
                                src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg" 
                                alt="" 
                                className="w-5 h-5 flex-shrink-0 opacity-70 mt-0.5"
                            />
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <p className="text-fluent-fg-primary font-medium pt-0.5">
                                        Management Group Deployment Guidance
                                    </p>
                                    <a
                                        href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-management-groups"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] text-[13px] font-medium hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shrink-0"
                                    >
                                        <svg viewBox="0 0 23 23" className="w-[14px] h-[14px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 0h11v11H0z" fill="#f35325"/>
                                            <path d="M12 0h11v11H12z" fill="#81bc06"/>
                                            <path d="M0 12h11v11H0z" fill="#05a6f0"/>
                                            <path d="M12 12h11v11H12z" fill="#ffba08"/>
                                        </svg>
                                        Microsoft Learn
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <ul className="list-disc pl-5 flex flex-col gap-2 mt-1 text-[13px] text-fluent-fg-secondary">
                                    <li><strong>Platform vs Workloads:</strong> Separate core infrastructure from applications. <em>Platform</em> groups house centralized shared services (e.g., Hub networks, Log Analytics, Domain Controllers). <em>Landing Zone</em> groups house the actual application workloads.</li>
                                    <li><strong>Landing Zone Archetypes:</strong> Group workloads by their governance needs. Use <em>Corp</em> for internal apps requiring corporate network connectivity, <em>Online</em> for public internet-facing apps, and <em>Sandbox</em> for isolated dev/test environments.</li>
                                    <li><strong>Keep it Flat:</strong> Avoid deep hierarchies to ensure policy inheritance remains simple, predictable, and easy to troubleshoot. Aim for a maximum of 3-4 levels. While a management group tree can technically support up to six levels of depth (excluding the tenant root and subscription levels), flatter structures are highly recommended.</li>
                                    <li><strong>Default Subscription Location:</strong> All new subscriptions are placed under the tenant root management group by default.</li>
                                    <li><strong>Avoid Tenant Root:</strong> Never apply Azure Policies or Role Assignments directly to the Tenant Root Group to prevent accidental tenant-wide lockouts.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col min-w-0 w-full">
                            <TopologyTreeBuilder topology={topology} setTopology={setTopology} />
                        </div>
                    </div>
                    
                    {/* Code Output */}
                    <div className="flex flex-col w-full min-w-0">
                        <TopologyCodeGenerator topology={topology} />
                    </div>
                </div>
            </div>
        </div>
    );
}
