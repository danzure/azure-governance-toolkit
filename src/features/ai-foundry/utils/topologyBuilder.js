import { getFoundryResourceNames } from './foundryNaming';

/**
 * Generates the bill of materials and topology nodes for an AI Foundry landing zone.
 * Aligned strictly with the Cloud Adoption Framework (CAF) Resource Naming standard.
 * 
 * @param {Object} config - AI Foundry configuration object
 * @returns {Object} { bom: Array<Object>, topology: Object }
 */
export function buildTopologyAndBOM(config) {
    const {
        networkMode = 'private',
        enableAiSearch = true,
        searchSku = 'standard',
        enableOpenAi = true,
        openAiSku = 'S0',
        modelDeployments = [],
        identityType = 'UserAssigned',
        enableCmk = false,
        enableAppInsights = true,
        enableContainerRegistry = false
    } = config;

    const names = getFoundryResourceNames(config);
    const isPrivate = networkMode === 'private';

    const bom = [
        {
            category: 'Foundry Hub',
            resourceType: 'Microsoft Foundry hub',
            categoryGroup: 'AI + ML',
            name: names.hubName,
            provider: 'Microsoft.MachineLearningServices/workspaces',
            tier: 'Hub',
            scope: 'Platform Core',
            network: isPrivate ? 'Managed VNet (Private)' : 'Public Access',
            costTier: 'Free (compute billed)'
        },
        ...names.projects.map(p => ({
            category: 'Foundry Project',
            resourceType: 'Microsoft Foundry project',
            categoryGroup: 'AI + ML',
            name: p.generatedName,
            provider: 'Microsoft.MachineLearningServices/workspaces',
            tier: 'Project',
            scope: `Linked to ${names.hubName}`,
            network: isPrivate ? 'Inherits Hub VNet' : 'Public Access',
            costTier: 'Free (shared pool)'
        })),
        {
            category: 'Storage',
            resourceType: 'Storage account',
            categoryGroup: 'Storage',
            name: names.storageName,
            provider: 'Microsoft.Storage/storageAccounts',
            tier: 'Standard_LRS',
            scope: 'Hub Dependency',
            network: isPrivate ? 'Private Endpoint' : 'Public Access',
            costTier: 'Pay-as-you-go'
        },
        {
            category: 'Security',
            resourceType: 'Key vault',
            categoryGroup: 'Security',
            name: names.keyVaultName,
            provider: 'Microsoft.KeyVault/vaults',
            tier: enableCmk ? 'Premium (HSM)' : 'Standard',
            scope: 'Hub Dependency',
            network: isPrivate ? 'Private Endpoint' : 'Public Access',
            costTier: 'Pay-as-you-go'
        }
    ];

    if (enableOpenAi) {
        bom.push({
            category: 'AI Services',
            resourceType: 'Azure OpenAI Service',
            categoryGroup: 'AI + ML',
            name: names.openAiName,
            provider: 'Microsoft.CognitiveServices/accounts',
            tier: `${openAiSku} (${modelDeployments.length} models)`,
            scope: 'Inference Provider',
            network: isPrivate ? 'Private Endpoint' : 'Public Access',
            costTier: 'Pay-per-token'
        });
    }

    if (enableAiSearch) {
        bom.push({
            category: 'Search & Retrieval',
            resourceType: 'Azure AI Search',
            categoryGroup: 'AI + ML',
            name: names.searchName,
            provider: 'Microsoft.Search/searchServices',
            tier: (searchSku || 'standard').toUpperCase(),
            scope: 'RAG Vector Index',
            network: isPrivate ? 'Private Endpoint' : 'Public Access',
            costTier: 'Hourly Fixed + Query'
        });
    }

    if (enableAppInsights) {
        bom.push({
            category: 'Observability',
            resourceType: 'Application Insights',
            categoryGroup: 'Management + Governance',
            name: names.appInsightsName,
            provider: 'Microsoft.Insights/components',
            tier: 'Workspace-based',
            scope: 'Telemetry & Logs',
            network: isPrivate ? 'Private Link (AMPLS)' : 'Public Ingestion',
            costTier: 'Pay-as-you-go GB'
        });
        bom.push({
            category: 'Log Analytics',
            resourceType: 'Log Analytics workspace',
            categoryGroup: 'Management + Governance',
            name: names.logAnalyticsName,
            provider: 'Microsoft.OperationalInsights/workspaces',
            tier: 'PerGB2018',
            scope: 'Central Log Store',
            network: isPrivate ? 'Private Link' : 'Public Ingestion',
            costTier: 'Pay-as-you-go GB'
        });
    }

    if (enableContainerRegistry) {
        bom.push({
            category: 'Compute & Runtime',
            resourceType: 'Container registry',
            categoryGroup: 'Containers',
            name: names.acrName,
            provider: 'Microsoft.ContainerRegistry/registries',
            tier: isPrivate ? 'Premium' : 'Standard',
            scope: 'Promptflow / Custom Runtimes',
            network: isPrivate ? 'Private Endpoint' : 'Public Access',
            costTier: 'Daily fixed tier'
        });
    }

    if (identityType === 'UserAssigned') {
        bom.push({
            category: 'Identity',
            resourceType: 'Managed identity (user)',
            categoryGroup: 'Security',
            name: names.uamiName,
            provider: 'Microsoft.ManagedIdentity/userAssignedIdentities',
            tier: 'Standard',
            scope: 'RBAC Orchestration',
            network: 'Control Plane',
            costTier: 'Free'
        });
    }

    return { bom };
}

