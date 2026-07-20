import { useState, useRef } from 'react';
import { Copy, Check, FileJson, FileText } from 'lucide-react';

/**
 * TagOutputPanel Component
 * 
 * Takes the tag definitions from the TagBuilder and dynamically generates
 * actionable outputs. It supports generating a Markdown table for documentation
 * purposes and an Azure Policy JSON structure for enforcing the tagging strategy.
 * Includes copy-to-clipboard functionality.
 * 
 * @param {Object} props
 * @param {Array} props.tags - Array of tag definition objects to generate output for.
 */
export default function TagOutputPanel({ tags }) {
    const [activeTab, setActiveTab] = useState('json');
    const [copiedId, setCopiedId] = useState(null);
    const copyTimeoutRef = useRef(null);

    const generateMarkdown = () => {
        if (tags.length === 0) return 'No tags defined.';
        
        let md = `| Tag Name | Requirement | Policy Effect | Allowed Values |\n`;
        md += `|---|---|---|---|\n`;
        tags.forEach(t => {
            const safeName = (t.name || 'Unnamed').replace(/\|/g, '&#124;');
            const safeValues = (t.allowedValues || 'Any').replace(/\|/g, '&#124;');
            md += `| **${safeName}** | ${t.requirement} | ${t.effect} | ${safeValues} |\n`;
        });
        return md;
    };

    const generateJSON = () => {
        if (tags.length === 0) return '{\n  "message": "No tags defined."\n}';
        
        // This is a simplified representation of an Azure Policy initiative for tagging.
        const policies = tags.map(t => {
            const tagName = t.name || 'Unnamed';
            
            // Build the basic policy structure
            const policy = {
                "properties": {
                    "displayName": `Require tag and its value: ${tagName}`,
                    "policyType": "Custom",
                    "mode": "Indexed",
                    "parameters": {
                        "tagName": {
                            "type": "String",
                            "defaultValue": tagName
                        }
                    }
                }
            };

            // If there are allowed values, add them to parameters
            if (t.allowedValues && t.allowedValues.trim().length > 0) {
                const valuesArray = t.allowedValues.split(',').map(v => v.trim()).filter(Boolean);
                policy.properties.parameters.tagValues = {
                    "type": "Array",
                    "defaultValue": valuesArray
                };
                
                // Add the policy rule with allowed values check
                policy.properties.policyRule = {
                    "if": {
                        "not": {
                            "field": `[concat('tags[', parameters('tagName'), ']')]`,
                            "in": "[parameters('tagValues')]"
                        }
                    },
                    "then": {
                        "effect": t.effect.toLowerCase()
                    }
                };
            } else {
                // Policy rule without allowed values check
                policy.properties.policyRule = {
                    "if": {
                        "field": `[concat('tags[', parameters('tagName'), ']')]`,
                        "exists": "false"
                    },
                    "then": {
                        "effect": t.effect.toLowerCase()
                    }
                };
            }
            
            // Handle Modify effect details (adding the actual role assignment needed for modify is complex, 
            // but we add the operations details here)
            if (t.effect === 'Modify') {
                policy.properties.policyRule.then.details = {
                    "roleDefinitionIds": [
                        "/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
                    ],
                    "operations": [
                        {
                            "operation": "addOrReplace",
                            "field": `[concat('tags[', parameters('tagName'), ']')]`,
                            "value": "[parameters('tagName')]" // simplified default value
                        }
                    ]
                };
            }

            return policy;
        });
        
        return JSON.stringify(policies, null, 2);
    };

    const outputContent = activeTab === 'json' ? generateJSON() : generateMarkdown();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(outputContent);
            setCopiedId('output');
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    return (
        <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full flex flex-col overflow-hidden h-full">
            <div className="flex items-center justify-between border-b border-fluent-stroke-subtle bg-fluent-bg-subtle px-4 py-3">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setActiveTab('json')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${activeTab === 'json' ? 'bg-white shadow-sm text-fluent-fg-primary dark:bg-fluent-bg-hover' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                        <FileJson className="w-4 h-4" /> JSON
                    </button>
                    <button 
                        onClick={() => setActiveTab('markdown')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${activeTab === 'markdown' ? 'bg-white shadow-sm text-fluent-fg-primary dark:bg-fluent-bg-hover' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                        <FileText className="w-4 h-4" /> Markdown
                    </button>
                </div>
                <button
                    onClick={handleCopy}
                    className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center gap-1.5 border ${copiedId === 'output'
                        ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]'
                        : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                        }`}
                >
                    {copiedId === 'output' ? (
                        <><Check className="w-3.5 h-3.5" /> <span>Copied</span></>
                    ) : (
                        <><Copy className="w-3.5 h-3.5" /> <span>Copy</span></>
                    )}
                </button>
            </div>
            
            <div className="flex-1 bg-[#1e1e1e] p-4 overflow-auto custom-scrollbar relative">
                <pre className="text-gray-300 font-mono text-[13px] whitespace-pre overflow-x-auto custom-scrollbar">
                    {outputContent}
                </pre>
            </div>
        </div>
    );
}
