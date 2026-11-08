import { FQDN_CATEGORIES } from '../data/fqdnAllowlists';
import { getFoundryResourceNames } from './foundryNaming';

/**
 * Generates an enterprise-ready, modular Bicep template for Azure AI Foundry
 * Aligned strictly with the Cloud Adoption Framework (CAF) Resource Naming standard.
 * 
 * @param {Object} config - AI Foundry configuration object
 * @returns {string} Fully formatted Bicep code
 */
export function generateBicepTemplate(config) {
    const {
        environment = 'prod',
        region = 'uksouth',
        networkMode = 'private',
        managedVnetMode = 'AllowOnlyApprovedOutbound',
        enableAiSearch = true,
        searchSku = 'standard',
        searchSemanticRanker = true,
        enableOpenAi = true,
        openAiSku = 'S0',
        modelDeployments = [],
        identityType = 'UserAssigned',
        disableLocalAuth = true,
        enableCmk = false,
        enableAppInsights = true,
        enableContainerRegistry = false,
        allowedFqdns = ['pypi', 'huggingface', 'github']
    } = config;

    const names = getFoundryResourceNames(config);
    const isPrivate = networkMode === 'private';
    const isUami = identityType === 'UserAssigned';

    // Collect FQDN endpoints from selected categories
    const selectedFqdnEndpoints = [];
    allowedFqdns.forEach(catId => {
        const cat = FQDN_CATEGORIES.find(c => c.id === catId);
        if (cat) selectedFqdnEndpoints.push(...cat.endpoints);
    });

    return `@description('Azure region for all AI Foundry resources')
param location string = '${region}'

@description('Deployment environment tier (prod, dev, stg, test)')
param environment string = '${environment}'

@description('Tags applied to all landing zone resources')
param tags object = {
  Workload: '${config.workload || 'coreai'}'
  Environment: environment
  ManagedBy: 'Azure AI Foundry Designer'
  CloudAdoptionFramework: 'Enterprise Landing Zone'
}

// -----------------------------------------------------------------------------
// 1. Foundation: Supporting Dependencies (Storage, Key Vault, Telemetry)
// -----------------------------------------------------------------------------

// Azure Storage Account (CAF: st{workload}{env}{region}{instance} - no hyphens, max 24 chars)
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: '${names.storageName}'
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    publicNetworkAccess: '${isPrivate ? 'Disabled' : 'Enabled'}'
    encryption: {
      services: {
        blob: { enabled: true }
        file: { enabled: true }
      }
      keySource: '${enableCmk ? 'Microsoft.Keyvault' : 'Microsoft.Storage'}'
    }
  }
}

// Azure Key Vault (CAF: kv-{workload}-{env}-{region}-{instance})
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${names.keyVaultName}'
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: '${enableCmk ? 'premium' : 'standard'}'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    purgeProtection: ${enableCmk ? 'true' : 'false'}
    publicNetworkAccess: '${isPrivate ? 'Disabled' : 'Enabled'}'
  }
}
${enableAppInsights ? `
// Azure Log Analytics & Application Insights (CAF: log-*, appi-*)
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${names.logAnalyticsName}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${names.appInsightsName}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    publicNetworkAccessForIngestion: '${isPrivate ? 'Disabled' : 'Enabled'}'
    publicNetworkAccessForQuery: '${isPrivate ? 'Disabled' : 'Enabled'}'
  }
}
` : ''}${enableContainerRegistry ? `
// Azure Container Registry (CAF: cr{workload}{env}{region}{instance} - alphanumeric only)
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' = {
  name: '${names.acrName}'
  location: location
  tags: tags
  sku: { name: '${isPrivate ? 'Premium' : 'Standard'}' }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: '${isPrivate ? 'Disabled' : 'Enabled'}'
  }
}
` : ''}${isUami ? `
// User-Assigned Managed Identity (CAF: id-{workload}-{env}-{region}-{instance})
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${names.uamiName}'
  location: location
  tags: tags
}
` : ''}${enableOpenAi ? `
// -----------------------------------------------------------------------------
// 2. Connected AI Services / Azure OpenAI (CAF: oai-{workload}-{env}-{region}-{instance})
// -----------------------------------------------------------------------------
resource aiServices 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: '${names.openAiName}'
  location: location
  tags: tags
  kind: 'AIServices'
  sku: { name: '${openAiSku}' }
  identity: {
    type: '${isUami ? 'UserAssigned' : 'SystemAssigned'}'${isUami ? `
    userAssignedIdentities: {
      '\${managedIdentity.id}': {}
    }` : ''}
  }
  properties: {
    customSubDomainName: '${names.openAiName}'
    publicNetworkAccess: '${isPrivate ? 'Disabled' : 'Enabled'}'
    disableLocalAuth: ${disableLocalAuth}
  }
}
${modelDeployments.map(m => `
resource modelDeployment_${m.name.replace(/[^a-zA-Z0-9]/g, '_')} 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: aiServices
  name: '${m.name}'
  sku: {
    name: '${m.sku}'
    capacity: ${m.capacity}
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: '${m.model}'
      version: '${m.version}'
    }
  }
}`).join('\n')}` : ''}${enableAiSearch ? `
// -----------------------------------------------------------------------------
// 3. Azure AI Search (CAF: srch-{workload}-{env}-{region}-{instance})
// -----------------------------------------------------------------------------
resource aiSearch 'Microsoft.Search/searchServices@2024-06-01-preview' = {
  name: '${names.searchName}'
  location: location
  tags: tags
  sku: { name: '${searchSku}' }
  identity: {
    type: '${isUami ? 'UserAssigned' : 'SystemAssigned'}'${isUami ? `
    userAssignedIdentities: {
      '\${managedIdentity.id}': {}
    }` : ''}
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    publicNetworkAccess: '${isPrivate ? 'disabled' : 'enabled'}'
    semanticSearch: '${searchSemanticRanker ? 'standard' : 'disabled'}'
    authOptions: {
      aadOrApiKey: {
        aadAuthFailureMode: 'http401WithBearerChallenge'
      }
    }
  }
}
` : ''}
// -----------------------------------------------------------------------------
// 4. Azure AI Foundry Hub (CAF: hub-{workload}-{env}-{region}-{instance})
// -----------------------------------------------------------------------------
resource aiHub 'Microsoft.MachineLearningServices/workspaces@2024-07-01-preview' = {
  name: '${names.hubName}'
  location: location
  tags: tags
  kind: 'Hub'
  identity: {
    type: '${isUami ? 'UserAssigned' : 'SystemAssigned'}'${isUami ? `
    userAssignedIdentities: {
      '\${managedIdentity.id}': {}
    }` : ''}
  }
  properties: {
    friendlyName: '${names.hubName} Enterprise Platform'
    description: 'Central AI governance hub with shared compute, quotas, and security boundaries'
    storageAccount: storageAccount.id
    keyVault: keyVault.id
    ${enableAppInsights ? 'applicationInsights: appInsights.id' : ''}
    ${enableContainerRegistry ? 'containerRegistry: containerRegistry.id' : ''}
    publicNetworkAccess: '${isPrivate ? 'Disabled' : 'Enabled'}'
    managedNetwork: {
      isolationMode: '${isPrivate ? managedVnetMode : 'Disabled'}'
      outboundRules: {
        'storage-blob': {
          type: 'PrivateEndpoint'
          category: 'Required'
          destination: {
            serviceResourceId: storageAccount.id
            subresourceTarget: 'blob'
            sparkEnabled: false
          }
        }
        'key-vault': {
          type: 'PrivateEndpoint'
          category: 'Required'
          destination: {
            serviceResourceId: keyVault.id
            subresourceTarget: 'vault'
            sparkEnabled: false
          }
        }
${enableAiSearch ? `        'ai-search': {
          type: 'PrivateEndpoint'
          category: 'Recommended'
          destination: {
            serviceResourceId: aiSearch.id
            subresourceTarget: 'searchService'
            sparkEnabled: false
          }
        }` : ''}
${selectedFqdnEndpoints.map((fqdn, idx) => `        'fqdn-rule-${idx + 1}': {
          type: 'FQDN'
          category: 'UserDefined'
          destination: '${fqdn}'
        }`).join('\n')}
      }
    }
  }
}
${enableOpenAi ? `
// Connection from AI Hub to AI Services (OpenAI)
resource hubAiServiceConnection 'Microsoft.MachineLearningServices/workspaces/connections@2024-07-01-preview' = {
  parent: aiHub
  name: 'conn-openai-default'
  properties: {
    category: 'AzureOpenAI'
    target: aiServices.properties.endpoint
    authType: 'AAD'
    isSharedToAll: true
    metadata: {
      ApiType: 'Azure'
      ResourceId: aiServices.id
    }
  }
}
` : ''}${enableAiSearch ? `
// Connection from AI Hub to Azure AI Search
resource hubAiSearchConnection 'Microsoft.MachineLearningServices/workspaces/connections@2024-07-01-preview' = {
  parent: aiHub
  name: 'conn-search-default'
  properties: {
    category: 'CognitiveSearch'
    target: 'https://\${aiSearch.name}.search.windows.net'
    authType: 'AAD'
    isSharedToAll: true
    metadata: {
      ResourceId: aiSearch.id
    }
  }
}
` : ''}
// -----------------------------------------------------------------------------
// 5. Azure AI Foundry Projects (CAF: proj-{appname}-{env}-{region}-{instance})
// -----------------------------------------------------------------------------
${names.projects.map((proj, i) => `
resource aiProject_${i + 1} 'Microsoft.MachineLearningServices/workspaces@2024-07-01-preview' = {
  name: '${proj.generatedName}'
  location: location
  tags: union(tags, { Project: '${proj.name}' })
  kind: 'Project'
  properties: {
    friendlyName: '${proj.name}'
    description: '${proj.description || 'AI Foundry Project workspace'}'
    hubResourceId: aiHub.id
  }
}`).join('\n')}

// Outputs
output hubName string = aiHub.name
output hubId string = aiHub.id
${enableOpenAi ? 'output openAiEndpoint string = aiServices.properties.endpoint' : ''}
${enableAiSearch ? 'output searchEndpoint string = \'https://\' + aiSearch.name + \'.search.windows.net\'' : ''}
`;
}
