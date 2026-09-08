/**
 * Cloud Adoption Framework (CAF) Starter Tags & Tagging Strategy Generation Utilities
 * 
 * Provides recommended baseline tags and generators for:
 * - JSON (Azure Policy Initiative Definition)
 * - Markdown (Documentation table)
 * - Bicep (Azure Policy resource definitions)
 * - Terraform (azurerm_policy_definition resources)
 */

export const CAF_STARTER_TAGS = [
    { 
        id: 'caf-env', 
        name: 'Environment', 
        requirement: 'Mandatory', 
        effect: 'Deny', 
        allowedValues: 'prod, staging, dev, test' 
    },
    { 
        id: 'caf-cost', 
        name: 'CostCenter', 
        requirement: 'Mandatory', 
        effect: 'Deny', 
        allowedValues: '' 
    },
    { 
        id: 'caf-owner', 
        name: 'Owner', 
        requirement: 'Mandatory', 
        effect: 'Audit', 
        allowedValues: '' 
    },
    { 
        id: 'caf-project', 
        name: 'Project', 
        requirement: 'Optional', 
        effect: 'Audit', 
        allowedValues: '' 
    },
    { 
        id: 'caf-criticality', 
        name: 'Criticality', 
        requirement: 'Optional', 
        effect: 'Audit', 
        allowedValues: 'Mission-Critical, High, Medium, Low' 
    }
];

export function generateTagMarkdown(tags) {
    if (!tags || tags.length === 0) return 'No tags defined.';
    
    let md = `| Tag Name | Requirement | Policy Effect | Allowed Values |\n`;
    md += `|---|---|---|---|\n`;
    tags.forEach(t => {
        const safeName = (t.name || 'Unnamed').replace(/\|/g, '&#124;');
        const safeValues = (t.allowedValues || 'Any').replace(/\|/g, '&#124;');
        md += `| **${safeName}** | ${t.requirement} | ${t.effect} | ${safeValues} |\n`;
    });
    return md;
}

export function generateTagJson(tags) {
    if (!tags || tags.length === 0) return '{\n  "message": "No tags defined."\n}';
    
    const policies = tags.map(t => {
        const tagName = t.name || 'Unnamed';
        const effectLower = (t.effect || 'Audit').toLowerCase().split(' ')[0];
        
        const policy = {
            properties: {
                displayName: `Require tag and its value: ${tagName}`,
                policyType: 'Custom',
                mode: 'Indexed',
                parameters: {
                    tagName: {
                        type: 'String',
                        defaultValue: tagName
                    }
                }
            }
        };

        if (t.allowedValues && t.allowedValues.trim().length > 0) {
            const valuesArray = t.allowedValues.split(',').map(v => v.trim()).filter(Boolean);
            policy.properties.parameters.tagValues = {
                type: 'Array',
                defaultValue: valuesArray
            };
            policy.properties.policyRule = {
                if: {
                    not: {
                        field: `[concat('tags[', parameters('tagName'), ']')]`,
                        in: "[parameters('tagValues')]"
                    }
                },
                then: {
                    effect: effectLower
                }
            };
        } else {
            policy.properties.policyRule = {
                if: {
                    field: `[concat('tags[', parameters('tagName'), ']')]`,
                    exists: 'false'
                },
                then: {
                    effect: effectLower
                }
            };
        }

        if (t.effect && t.effect.startsWith('Modify')) {
            policy.properties.policyRule.then.details = {
                roleDefinitionIds: [
                    '/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c'
                ],
                operations: [
                    {
                        operation: 'addOrReplace',
                        field: `[concat('tags[', parameters('tagName'), ']')]`,
                        value: "[parameters('tagName')]"
                    }
                ]
            };
        }

        return policy;
    });

    return JSON.stringify(policies, null, 2);
}

export function generateTagBicep(tags) {
    if (!tags || tags.length === 0) return '// No tags defined.';
    
    let bicep = `targetScope = 'subscription'\n\n// Azure Policy Definitions for Resource Tag Governance\n`;
    tags.forEach(t => {
        const tagName = t.name || 'Unnamed';
        const safeIdentifier = tagName.replace(/[^a-zA-Z0-9]/g, '_');
        const effect = (t.effect || 'Audit').toLowerCase().split(' ')[0];
        const hasAllowed = t.allowedValues && t.allowedValues.trim().length > 0;
        const allowedArr = hasAllowed ? t.allowedValues.split(',').map(v => v.trim()).filter(Boolean) : [];

        bicep += `\nresource policy_${safeIdentifier} 'Microsoft.Authorization/policyDefinitions@2021-06-01' = {\n`;
        bicep += `  name: 'require-tag-${tagName.toLowerCase().replace(/[^a-z0-9]/g, '-')}'\n`;
        bicep += `  properties: {\n`;
        bicep += `    displayName: 'Require tag and its value: ${tagName}'\n`;
        bicep += `    policyType: 'Custom'\n`;
        bicep += `    mode: 'Indexed'\n`;
        bicep += `    policyRule: {\n`;
        if (hasAllowed) {
            bicep += `      if: {\n`;
            bicep += `        not: {\n`;
            bicep += `          field: 'tags[\\'${tagName}\\']'\n`;
            bicep += `          in: [\n`;
            allowedArr.forEach(v => {
                bicep += `            '${v}'\n`;
            });
            bicep += `          ]\n`;
            bicep += `        }\n`;
            bicep += `      }\n`;
        } else {
            bicep += `      if: {\n`;
            bicep += `        field: 'tags[\\'${tagName}\\']'\n`;
            bicep += `        exists: 'false'\n`;
            bicep += `      }\n`;
        }
        bicep += `      then: {\n`;
        bicep += `        effect: '${effect}'\n`;
        bicep += `      }\n`;
        bicep += `    }\n`;
        bicep += `  }\n`;
        bicep += `}\n`;
    });

    return bicep.trim();
}

export function generateTagTerraform(tags) {
    if (!tags || tags.length === 0) return '# No tags defined.';

    let tf = `# Azure Policy Definitions for Resource Tag Governance\n\n`;
    tags.forEach(t => {
        const tagName = t.name || 'Unnamed';
        const safeIdentifier = tagName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const effect = (t.effect || 'Audit').toLowerCase().split(' ')[0];
        const hasAllowed = t.allowedValues && t.allowedValues.trim().length > 0;
        const allowedArr = hasAllowed ? t.allowedValues.split(',').map(v => v.trim()).filter(Boolean) : [];

        tf += `resource "azurerm_policy_definition" "require_${safeIdentifier}" {\n`;
        tf += `  name         = "require-tag-${tagName.toLowerCase().replace(/[^a-z0-9]/g, '-')}"\n`;
        tf += `  policy_type  = "Custom"\n`;
        tf += `  mode         = "Indexed"\n`;
        tf += `  display_name = "Require tag and its value: ${tagName}"\n\n`;
        tf += `  policy_rule = jsonencode({\n`;
        if (hasAllowed) {
            tf += `    if = {\n`;
            tf += `      not = {\n`;
            tf += `        field = "tags['${tagName}']"\n`;
            tf += `        in    = ${JSON.stringify(allowedArr)}\n`;
            tf += `      }\n`;
            tf += `    }\n`;
        } else {
            tf += `    if = {\n`;
            tf += `      field  = "tags['${tagName}']"\n`;
            tf += `      exists = "false"\n`;
            tf += `    }\n`;
        }
        tf += `    then = {\n`;
        tf += `      effect = "${effect}"\n`;
        tf += `    }\n`;
        tf += `  })\n`;
        tf += `}\n\n`;
    });

    return tf.trim();
}
