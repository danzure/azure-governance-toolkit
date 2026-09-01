import { COMMON_RBAC_PROVIDERS, RBAC_ROLE_TEMPLATES } from '../data/rbacData';

/**
 * Client-Side Smart Heuristic Fallback for RBAC Custom Role AI Generation
 * 
 * Provides intelligent natural language matching against the RBAC catalog
 * and role templates when offline or when the Azure OpenAI backend is unconfigured.
 */
export function generateRbacRoleFallback(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt is required for fallback generation');
    }

    const lowerPrompt = prompt.toLowerCase().trim();

    // 1. Extract Scope if present
    let assignableScopes = '/subscriptions/00000000-0000-0000-0000-000000000000';
    const scopeMatch = prompt.match(/\/(?:subscriptions|providers\/Microsoft\.Management)\/[a-zA-Z0-9\-_/]+/i);
    if (scopeMatch) {
        assignableScopes = scopeMatch[0];
    } else if (lowerPrompt.includes('root') || lowerPrompt.includes('tenant level')) {
        assignableScopes = '/';
    } else if (lowerPrompt.includes('management group') || lowerPrompt.includes('mg')) {
        assignableScopes = '/providers/Microsoft.Management/managementGroups/my-mg';
    }

    // 2. Check for explicit template name match (e.g. user typed or selected full template name)
    const exactTemplate = RBAC_ROLE_TEMPLATES.find(t => 
        lowerPrompt === t.name.toLowerCase() || 
        (lowerPrompt.startsWith(t.name.toLowerCase()) && lowerPrompt.length <= t.name.length + 4)
    );
    if (exactTemplate) {
        return {
            roleName: exactTemplate.name,
            description: exactTemplate.description,
            assignableScopes,
            actions: [...exactTemplate.actions],
            notActions: [...exactTemplate.notActions],
            roleSummary: `${exactTemplate.name} configured for ${exactTemplate.category.toLowerCase()} workloads.`,
            explanation: 'Configured following Azure least-privilege role guidelines to avoid excessive permissions.'
        };
    }

    // 3. Domain Heuristic Keyword Matching
    let actions = new Set();
    let notActions = new Set();
    let roleTitle = 'Custom Azure Operator';
    let explanation = 'Principle of Least Privilege enforced: destructive operations and elevated management rights have been restricted.';

    const wantsNoDelete = /(?:no|without|cannot|not|prevent|restrict|deny)[^,.]*?\b(?:delete|deletion|destroy)\b/i.test(lowerPrompt) || lowerPrompt.includes('read-only');
    const wantsNoSecrets = /(?:no|without|cannot|not|prevent|restrict|deny)[^,.]*?\b(?:secrets?|keys?)\b/i.test(lowerPrompt);
    const wantsNoIam = /(?:no|without|cannot|not|prevent|restrict|deny)[^,.]*?\b(?:iam|role\s+assignments?|assign\s+roles?)\b/i.test(lowerPrompt);
    const wantsPurge = /purge/i.test(lowerPrompt);

    // App Service & Web Apps / Functions
    if (lowerPrompt.includes('app service') || lowerPrompt.includes('web app') || lowerPrompt.includes('function app') || lowerPrompt.includes('website')) {
        roleTitle = 'App Service Operator';
        actions.add('Microsoft.Web/sites/read');
        if (lowerPrompt.includes('restart') || lowerPrompt.includes('start') || lowerPrompt.includes('stop') || lowerPrompt.includes('operator')) {
            actions.add('Microsoft.Web/sites/restart/action');
            actions.add('Microsoft.Web/sites/start/action');
            actions.add('Microsoft.Web/sites/stop/action');
            actions.add('Microsoft.Web/sites/slots/read');
            actions.add('Microsoft.Web/sites/slots/restart/action');
        }
        if (lowerPrompt.includes('config') || lowerPrompt.includes('deploy')) {
            actions.add('Microsoft.Web/sites/config/read');
            actions.add('Microsoft.Web/sites/publishxml/action');
        }
        if (wantsNoDelete) {
            notActions.add('Microsoft.Web/sites/delete');
        }
        if (wantsNoSecrets) {
            notActions.add('Microsoft.Web/sites/config/list/action');
        }
    }

    // Key Vault (only when focused on Key Vault or granting secret permissions)
    if (lowerPrompt.includes('key vault') || (/\bsecrets?\b|\bcertificates?\b/i.test(lowerPrompt) && !wantsNoSecrets)) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = lowerPrompt.includes('reader') ? 'Key Vault Secrets Reader' : 'Key Vault Secrets Officer';
        }
        actions.add('Microsoft.KeyVault/vaults/read');
        actions.add('Microsoft.KeyVault/vaults/secrets/read');
        if (!lowerPrompt.includes('read-only') && !lowerPrompt.includes('reader')) {
            actions.add('Microsoft.KeyVault/vaults/secrets/write');
            actions.add('Microsoft.KeyVault/vaults/secrets/setSecret/action');
        }
        if (wantsNoDelete || wantsPurge) {
            notActions.add('Microsoft.KeyVault/vaults/delete');
            notActions.add('Microsoft.KeyVault/vaults/purge/action');
        }
    }

    // AKS & Containers
    if (lowerPrompt.includes('aks') || lowerPrompt.includes('kubernetes') || lowerPrompt.includes('container app') || lowerPrompt.includes('container registry') || lowerPrompt.includes('acr')) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = 'Container & Kubernetes Developer';
        }
        actions.add('Microsoft.ContainerService/managedClusters/read');
        actions.add('Microsoft.ContainerService/managedClusters/listClusterUserCredential/action');
        actions.add('Microsoft.App/containerApps/read');
        actions.add('Microsoft.ContainerRegistry/registries/read');
        actions.add('Microsoft.ContainerRegistry/registries/pull/action');
        if (lowerPrompt.includes('deploy') || lowerPrompt.includes('write')) {
            actions.add('Microsoft.App/containerApps/write');
            actions.add('Microsoft.App/containerApps/revisions/restart/action');
        }
        if (wantsNoDelete) {
            notActions.add('Microsoft.ContainerService/managedClusters/delete');
            notActions.add('Microsoft.App/containerApps/delete');
            notActions.add('Microsoft.ContainerRegistry/registries/delete');
        }
    }

    // Networking
    if (lowerPrompt.includes('network') || lowerPrompt.includes('vnet') || lowerPrompt.includes('nsg') || lowerPrompt.includes('subnet') || lowerPrompt.includes('firewall')) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = 'Network Security Administrator';
        }
        actions.add('Microsoft.Network/virtualNetworks/read');
        actions.add('Microsoft.Network/networkSecurityGroups/read');
        actions.add('Microsoft.Network/networkSecurityGroups/write');
        actions.add('Microsoft.Network/routeTables/read');
        actions.add('Microsoft.Network/routeTables/write');
        actions.add('Microsoft.Network/networkSecurityGroups/securityRules/read');
        actions.add('Microsoft.Network/networkSecurityGroups/securityRules/write');
        if (wantsNoDelete) {
            notActions.add('Microsoft.Network/virtualNetworks/delete');
            notActions.add('Microsoft.Network/networkSecurityGroups/delete');
            notActions.add('Microsoft.Network/azureFirewalls/delete');
        }
    }

    // AI & Cognitive Services (use word boundary for \bai\b)
    if (/\bai\b/i.test(lowerPrompt) || lowerPrompt.includes('openai') || lowerPrompt.includes('cognitive') || lowerPrompt.includes('search') || lowerPrompt.includes('machine learning')) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = 'Azure AI & OpenAI Solutions Engineer';
        }
        actions.add('Microsoft.CognitiveServices/accounts/read');
        actions.add('Microsoft.CognitiveServices/accounts/deployments/read');
        actions.add('Microsoft.CognitiveServices/accounts/models/read');
        actions.add('Microsoft.CognitiveServices/accounts/OpenAI/read');
        actions.add('Microsoft.CognitiveServices/accounts/OpenAI/write');
        actions.add('Microsoft.Search/searchServices/read');
        actions.add('Microsoft.Search/searchServices/listQueryKeys/action');
        if (wantsNoDelete) {
            notActions.add('Microsoft.CognitiveServices/accounts/delete');
            notActions.add('Microsoft.Search/searchServices/delete');
        }
    }

    // FinOps & Billing
    if (lowerPrompt.includes('cost') || lowerPrompt.includes('billing') || lowerPrompt.includes('budget') || lowerPrompt.includes('finops') || lowerPrompt.includes('invoice')) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = 'FinOps Cost & Billing Reader';
        }
        actions.add('Microsoft.CostManagement/exports/read');
        actions.add('Microsoft.CostManagement/views/read');
        actions.add('Microsoft.Consumption/budgets/read');
        actions.add('Microsoft.Consumption/usageDetails/read');
        actions.add('Microsoft.Billing/billingAccounts/read');
        actions.add('*/read');
        notActions.add('Microsoft.CostManagement/exports/delete');
        notActions.add('Microsoft.Consumption/budgets/delete');
    }

    // Security & Incident Response
    if (lowerPrompt.includes('sentinel') || lowerPrompt.includes('incident') || lowerPrompt.includes('soc') || lowerPrompt.includes('log analytics') || lowerPrompt.includes('triage')) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = 'Security Incident Responder';
        }
        actions.add('Microsoft.SecurityInsights/incidents/read');
        actions.add('Microsoft.SecurityInsights/incidents/write');
        actions.add('Microsoft.SecurityInsights/incidents/comments/read');
        actions.add('Microsoft.SecurityInsights/incidents/comments/write');
        actions.add('Microsoft.SecurityInsights/alertRules/read');
        actions.add('Microsoft.OperationalInsights/workspaces/read');
        actions.add('Microsoft.OperationalInsights/workspaces/query/read');
        if (wantsNoDelete) {
            notActions.add('Microsoft.SecurityInsights/incidents/delete');
            notActions.add('Microsoft.OperationalInsights/workspaces/delete');
        }
    }

    // Virtual Machines / Compute
    if (/\bvm\b|\bvms\b/i.test(lowerPrompt) || lowerPrompt.includes('virtual machine') || lowerPrompt.includes('compute') || lowerPrompt.includes('restart vm')) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = 'Virtual Machine Operator';
        }
        actions.add('Microsoft.Compute/virtualMachines/read');
        actions.add('Microsoft.Compute/virtualMachines/start/action');
        actions.add('Microsoft.Compute/virtualMachines/restart/action');
        actions.add('Microsoft.Compute/virtualMachines/powerOff/action');
        actions.add('Microsoft.Compute/virtualMachines/instanceView/read');
        if (wantsNoDelete) {
            notActions.add('Microsoft.Compute/virtualMachines/delete');
        }
    }

    // Storage
    if (lowerPrompt.includes('storage') || lowerPrompt.includes('blob') || lowerPrompt.includes('file share') || lowerPrompt.includes('table storage')) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = 'Storage Account Operator';
        }
        actions.add('Microsoft.Storage/storageAccounts/read');
        actions.add('Microsoft.Storage/storageAccounts/blobServices/containers/read');
        if (lowerPrompt.includes('write') || lowerPrompt.includes('upload')) {
            actions.add('Microsoft.Storage/storageAccounts/blobServices/containers/write');
        }
        if (wantsNoDelete) {
            notActions.add('Microsoft.Storage/storageAccounts/delete');
        }
    }

    // SQL & Databases
    if (lowerPrompt.includes('sql') || lowerPrompt.includes('cosmos') || lowerPrompt.includes('database') || lowerPrompt.includes('postgres')) {
        if (roleTitle === 'Custom Azure Operator') {
            roleTitle = 'Database Operations Engineer';
        }
        actions.add('Microsoft.Sql/servers/databases/read');
        actions.add('Microsoft.DocumentDB/databaseAccounts/read');
        if (lowerPrompt.includes('write') || lowerPrompt.includes('manage')) {
            actions.add('Microsoft.Sql/servers/databases/write');
        }
        if (wantsNoDelete) {
            notActions.add('Microsoft.Sql/servers/databases/delete');
            notActions.add('Microsoft.DocumentDB/databaseAccounts/delete');
        }
    }

    // Enforce No IAM restriction if requested
    if (wantsNoIam) {
        notActions.add('Microsoft.Authorization/roleAssignments/*');
        notActions.add('Microsoft.Authorization/roleDefinitions/*');
    }

    // If still empty actions, search COMMON_RBAC_PROVIDERS by keyword
    if (actions.size === 0) {
        const words = lowerPrompt.split(/\s+/).filter(w => w.length > 3);
        COMMON_RBAC_PROVIDERS.forEach(provider => {
            const matchesProvider = words.some(w => provider.provider.toLowerCase().includes(w));
            if (matchesProvider) {
                provider.operations.slice(0, 6).forEach(op => actions.add(op));
            }
        });

        // Default fallback if nothing matched
        if (actions.size === 0) {
            actions.add('*/read');
            actions.add('Microsoft.Resources/subscriptions/resourceGroups/read');
            roleTitle = 'Azure Resource Reader';
            explanation = 'Fallback read-only role generated across Azure resource groups.';
        }
    }

    const actionList = Array.from(actions);
    const notActionList = Array.from(notActions);

    return {
        roleName: roleTitle,
        description: `Custom role generated to support: ${prompt.slice(0, 150)}. Grants ${actionList.length} granular operations.`,
        assignableScopes,
        actions: actionList,
        notActions: notActionList,
        roleSummary: `${roleTitle} with ${actionList.length} allowed and ${notActionList.length} restricted operations.`,
        explanation
    };
}
