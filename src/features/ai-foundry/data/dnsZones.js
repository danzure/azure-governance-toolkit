/**
 * Private DNS Zones Required for Azure AI Foundry & Dependent Services
 * 
 * Microsoft Reference: https://learn.microsoft.com/azure/ai-studio/how-to/configure-managed-network
 */
export const FOUNDRY_DNS_ZONES = [
    {
        zone: 'privatelink.api.azureml.ms',
        service: 'Azure AI Hub & Projects',
        description: 'Enables private connectivity for workspace management and control plane API calls.',
        resourceType: 'Microsoft.MachineLearningServices/workspaces'
    },
    {
        zone: 'privatelink.notebooks.azure.net',
        service: 'Foundry Notebooks & Prompt Flow',
        description: 'Required for interactive compute, authoring notebooks, and streaming execution logs.',
        resourceType: 'Microsoft.MachineLearningServices/workspaces'
    },
    {
        zone: 'privatelink.openai.azure.com',
        service: 'Azure OpenAI Service',
        description: 'Routes inference requests, model completions, and embedding vectors privately.',
        resourceType: 'Microsoft.CognitiveServices/accounts'
    },
    {
        zone: 'privatelink.cognitiveservices.azure.com',
        service: 'Azure AI Services Multi-Service',
        description: 'Endpoints for Speech, Vision, Document Intelligence, and Content Safety.',
        resourceType: 'Microsoft.CognitiveServices/accounts'
    },
    {
        zone: 'privatelink.blob.core.windows.net',
        service: 'Azure Blob Storage',
        description: 'Default backing storage for dataset uploads, artifacts, fine-tuning checkpoints, and logs.',
        resourceType: 'Microsoft.Storage/storageAccounts'
    },
    {
        zone: 'privatelink.vaultcore.azure.net',
        service: 'Azure Key Vault',
        description: 'Stores workspace credentials, customer-managed keys (CMK), and linked service tokens.',
        resourceType: 'Microsoft.KeyVault/vaults'
    },
    {
        zone: 'privatelink.search.windows.net',
        service: 'Azure AI Search',
        description: 'Dedicated vector index store for RAG grounding and enterprise retrieval.',
        resourceType: 'Microsoft.Search/searchServices'
    },
    {
        zone: 'privatelink.azurecr.io',
        service: 'Azure Container Registry',
        description: 'Houses custom Docker images and runtime environments for model endpoints and prompt flows.',
        resourceType: 'Microsoft.ContainerRegistry/registries'
    }
];

