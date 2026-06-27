import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Copy, Check, ExternalLink, Code } from 'lucide-react';

export default function TopologyCodeGenerator({ topology }) {
    const [format, setFormat] = useState('bicep');
    const [copied, setCopied] = useState(false);

    // Flatten tree into an array of { id, name, parentId, subscriptions }
    const flattenTopology = (nodes, parentId = null) => {
        let result = [];
        nodes.forEach(node => {
            // Generate a safe identifier for code (alphanumeric and underscores)
            const safeId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
            result.push({
                id: node.id,
                safeId: safeId,
                name: node.name,
                parentId: parentId,
                subscriptions: node.subscriptions || []
            });
            if (node.children && node.children.length > 0) {
                result = result.concat(flattenTopology(node.children, safeId));
            }
        });
        return result;
    };

    const generateBicep = (flatNodes) => {
        let code = `targetScope = 'tenant'\n\n`;
        
        flatNodes.forEach(node => {
            code += `resource mg_${node.safeId} 'Microsoft.Management/managementGroups@2021-04-01' = {\n`;
            code += `  name: '${node.safeId}'\n`;
            code += `  properties: {\n`;
            code += `    displayName: '${node.name}'\n`;
            if (node.parentId) {
                code += `    details: {\n`;
                code += `      parent: {\n`;
                code += `        id: tenantResourceId('Microsoft.Management/managementGroups', '${node.parentId}')\n`;
                code += `      }\n`;
                code += `    }\n`;
            }
            code += `  }\n`;
            code += `}\n\n`;

            if (node.subscriptions && node.subscriptions.length > 0) {
                node.subscriptions.forEach((sub, index) => {
                    const subSafeId = sub.id.replace(/[^a-zA-Z0-9]/g, '_');
                    code += `resource sub_${subSafeId} 'Microsoft.Management/managementGroups/subscriptions@2021-04-01' = {\n`;
                    code += `  parent: mg_${node.safeId}\n`;
                    code += `  name: '${sub.name}'\n`;
                    code += `}\n\n`;
                });
            }
        });
        
        return code.trim();
    };

    const generateTerraform = (flatNodes) => {
        let code = `provider "azurerm" {\n  features {}\n}\n\n`;
        
        flatNodes.forEach(node => {
            code += `resource "azurerm_management_group" "${node.safeId}" {\n`;
            code += `  name         = "${node.safeId}"\n`;
            code += `  display_name = "${node.name}"\n`;
            if (node.parentId) {
                code += `  parent_management_group_id = azurerm_management_group.${node.parentId}.id\n`;
            }
            code += `}\n\n`;

            if (node.subscriptions && node.subscriptions.length > 0) {
                node.subscriptions.forEach((sub, index) => {
                    const subSafeId = sub.id.replace(/[^a-zA-Z0-9]/g, '_');
                    code += `data "azurerm_subscription" "sub_${subSafeId}" {\n`;
                    code += `  subscription_id = "${sub.name}"\n`;
                    code += `}\n\n`;
                    code += `resource "azurerm_management_group_subscription_association" "assoc_${subSafeId}" {\n`;
                    code += `  management_group_id = azurerm_management_group.${node.safeId}.id\n`;
                    code += `  subscription_id     = data.azurerm_subscription.sub_${subSafeId}.id\n`;
                    code += `}\n\n`;
                });
            }
        });
        
        return code.trim();
    };

    const generateArm = (flatNodes) => {
        let code = {
            "$schema": "https://schema.management.azure.com/schemas/2019-08-01/tenantDeploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "resources": []
        };
        
        flatNodes.forEach(node => {
            let resource = {
                "type": "Microsoft.Management/managementGroups",
                "apiVersion": "2021-04-01",
                "name": node.safeId,
                "properties": {
                    "displayName": node.name
                }
            };
            if (node.parentId) {
                resource.properties.details = {
                    "parent": {
                        "id": `[tenantResourceId('Microsoft.Management/managementGroups', '${node.parentId}')]`
                    }
                };
                resource.dependsOn = [
                    `[tenantResourceId('Microsoft.Management/managementGroups', '${node.parentId}')]`
                ];
            }
            code.resources.push(resource);

            if (node.subscriptions && node.subscriptions.length > 0) {
                node.subscriptions.forEach((sub, index) => {
                    const subSafeId = sub.id.replace(/[^a-zA-Z0-9]/g, '_');
                    code.resources.push({
                        "type": "Microsoft.Management/managementGroups/subscriptions",
                        "apiVersion": "2021-04-01",
                        "name": `[concat('${node.safeId}', '/', '${sub.name}')]`,
                        "dependsOn": [
                            `[tenantResourceId('Microsoft.Management/managementGroups', '${node.safeId}')]`
                        ]
                    });
                });
            }
        });
        
        return JSON.stringify(code, null, 2);
    };

    const generatedCode = useMemo(() => {
        const flatNodes = flattenTopology(topology);
        if (format === 'bicep') return generateBicep(flatNodes);
        if (format === 'terraform') return generateTerraform(flatNodes);
        if (format === 'arm') return generateArm(flatNodes);
        return '';
    }, [topology, format]);

    const docsUrl = useMemo(() => {
        if (format === 'terraform') return 'https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/management_group';
        if (format === 'bicep') return 'https://learn.microsoft.com/en-us/azure/templates/microsoft.management/managementgroups?pivots=deployment-language-bicep';
        return 'https://learn.microsoft.com/en-us/azure/templates/microsoft.management/managementgroups?pivots=deployment-language-arm-template';
    }, [format]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-xl shadow-soft flex flex-col flex-1 h-full overflow-hidden">
            <div className="px-5 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle">
                <div className="flex items-center gap-3 text-fluent-fg-primary font-semibold select-none">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-fluent-brand-bg/10 text-fluent-brand-fg shrink-0">
                        <Code className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px]">Auto-generated Template</span>
                        <span className="text-[12px] font-normal text-fluent-fg-secondary">Review and export your {format === 'terraform' ? 'Terraform' : format === 'bicep' ? 'Bicep' : 'ARM'} code</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 lg:gap-2 w-full sm:w-auto">
                        <div className="flex shrink-0 bg-[#edebe9] dark:bg-[#323130] rounded-sm p-0.5 w-full sm:w-auto">
                            <button
                                onClick={() => setFormat('bicep')}
                                className={`flex-1 sm:flex-none text-[12px] px-3 py-1.5 font-medium rounded-sm transition-all ${format === 'bicep' ? 'bg-white dark:bg-[#484644] text-[#0078d4] dark:text-[#60cdff] shadow-sm' : 'text-[#605e5c] dark:text-[#c8c6c4] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                            >
                                Bicep
                            </button>
                            <button
                                onClick={() => setFormat('arm')}
                                className={`flex-1 sm:flex-none text-[12px] px-3 py-1.5 font-medium rounded-sm transition-all ${format === 'arm' ? 'bg-white dark:bg-[#484644] text-[#0078d4] dark:text-[#60cdff] shadow-sm' : 'text-[#605e5c] dark:text-[#c8c6c4] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                            >
                                ARM
                            </button>
                            <button
                                onClick={() => setFormat('terraform')}
                                className={`flex-1 sm:flex-none text-[12px] px-3 py-1.5 font-medium rounded-sm transition-all ${format === 'terraform' ? 'bg-white dark:bg-[#484644] text-[#0078d4] dark:text-[#60cdff] shadow-sm' : 'text-[#605e5c] dark:text-[#c8c6c4] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                            >
                                Terraform
                            </button>
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
                            <a
                                href={docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] text-[13px] font-medium hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                                title="View documentation"
                            >
                                {format === 'terraform' ? (
                                    <img src="/terraform.svg" className="w-[14px] h-[14px] shrink-0" alt="Terraform" />
                                ) : (
                                    <svg viewBox="0 0 23 23" className="w-[14px] h-[14px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h11v11H0z" fill="#f35325"/>
                                        <path d="M12 0h11v11H12z" fill="#81bc06"/>
                                        <path d="M0 12h11v11H0z" fill="#05a6f0"/>
                                        <path d="M12 12h11v11H12z" fill="#ffba08"/>
                                    </svg>
                                )}
                                <span className="hidden sm:inline">{format === 'terraform' ? 'Terraform Registry' : format === 'bicep' ? 'Bicep Template' : 'ARM Template'}</span>
                                <span className="sm:hidden">Docs</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                            
                            <div className="w-px h-5 bg-fluent-stroke-subtle hidden sm:block"></div>
                            
                            <button
                                onClick={handleCopy}
                                className={`flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 py-1.5 rounded-md border text-[13px] font-medium transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg ${copied ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' : 'border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39]'}`}
                                title="Copy code"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-[#1E1E1E] w-full flex flex-col flex-1 h-full min-h-[500px]">
                <pre className="flex-1 text-[13px] leading-relaxed font-mono overflow-auto p-5 text-[#D4D4D4] m-0">
                    <code>{generatedCode}</code>
                </pre>
            </div>
        </div>
    );
}

TopologyCodeGenerator.propTypes = {
    topology: PropTypes.array.isRequired
};
