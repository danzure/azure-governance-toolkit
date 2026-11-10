/**
 * Default Services, Tiers, and Model Definitions for AI Foundry Designer
 */
export const AVAILABLE_MODELS = [
    { id: 'gpt-4o', name: 'GPT-4o (Omni)', defaultVersion: '2024-08-06', skus: ['GlobalStandard', 'DataZoneStandard', 'Standard'], defaultCapacity: 30, description: 'High-intelligence flagship multimodal model' },
    { id: 'gpt-4o-mini', name: 'GPT-4o mini', defaultVersion: '2024-07-18', skus: ['GlobalStandard', 'DataZoneStandard', 'Standard'], defaultCapacity: 50, description: 'Fast, lightweight cost-effective model' },
    { id: 'o1', name: 'OpenAI o1', defaultVersion: '2024-12-17', skus: ['GlobalStandard'], defaultCapacity: 20, description: 'Deep reasoning and complex math/coding model' },
    { id: 'o3-mini', name: 'OpenAI o3-mini', defaultVersion: '2025-01-31', skus: ['GlobalStandard'], defaultCapacity: 30, description: 'High-speed reasoning model for STEM and logic' },
    { id: 'text-embedding-3-large', name: 'Text Embedding 3 Large', defaultVersion: '1', skus: ['Standard'], defaultCapacity: 50, description: 'Most capable embedding model for high-dimensional semantic search' },
    { id: 'text-embedding-3-small', name: 'Text Embedding 3 Small', defaultVersion: '1', skus: ['Standard'], defaultCapacity: 100, description: 'Efficient embedding model for vector search' }
];

export const SEARCH_SKUS = [
    { value: 'basic', label: 'Basic (Dev / PoC)', desc: '15 GB storage (up to 45 GB), 3 partitions, supports semantic ranker' },
    { value: 'standard', label: 'Standard S1 (Production RAG)', desc: '25 GB storage, up to 12 partitions, semantic ranker support' },
    { value: 'standard2', label: 'Standard S2 (High Volume)', desc: '100 GB storage, high QPS vector indexing and high throughput' },
    { value: 'storage_optimized_l1', label: 'Storage Optimized L1 (Large Docs)', desc: 'Large document corpora and multi-million vector archives' }
];

export const DEFAULT_CONFIG = {
    workload: 'coreai',
    environment: 'prod',
    region: 'uksouth',
    instance: '001',
    projects: [
        { id: 'custai', name: 'Customer Support Copilot', description: 'Internal customer service knowledge agent' },
        { id: 'finrag', name: 'Finance Analytics RAG', description: 'Financial reporting and document query engine' }
    ],
    networkMode: 'private',
    managedVnetMode: 'AllowOnlyApprovedOutbound',
    enableAiSearch: true,
    searchSku: 'standard',
    searchSemanticRanker: true,
    enableOpenAi: true,
    openAiSku: 'S0',
    modelDeployments: [
        { name: 'gpt-4o', model: 'gpt-4o', version: '2024-08-06', sku: 'GlobalStandard', capacity: 30 },
        { name: 'text-embedding-3-large', model: 'text-embedding-3-large', version: '1', sku: 'Standard', capacity: 50 }
    ],
    identityType: 'UserAssigned',
    disableLocalAuth: true,
    enableCmk: false,
    enableAppInsights: true,
    enableContainerRegistry: false,
    allowedFqdns: ['pypi', 'huggingface', 'github']
};

