/**
 * Pre-configured Architecture Archetypes for Azure AI Foundry
 * 
 * Aligned with Microsoft Cloud Adoption Framework (CAF) Landing Zone patterns.
 */
export const ARCHETYPE_PRESETS = [
    {
        id: 'enterprise-rag',
        label: 'Enterprise RAG (CAF Baseline)',
        shortDesc: 'AI Hub + 2 Projects + Azure AI Search (Private Link) + User-Assigned Managed Identity',
        dotColor: 'bg-fluent-cat-blue-fg',
        config: {
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
        }
    },
    {
        id: 'autonomous-agents',
        label: 'Autonomous Multi-Agent Service',
        shortDesc: 'Hub + Foundry Agent Service + Azure Functions Tool Calling + Cosmos DB Session State',
        dotColor: 'bg-fluent-cat-purple-fg',
        config: {
            workload: 'agents',
            environment: 'prod',
            region: 'swedencentral',
            instance: '001',
            projects: [
                { id: 'orch', name: 'Agent Orchestration Service', description: 'Central coordinator for multi-agent tool execution' },
                { id: 'codeai', name: 'DevOps & Code Review Agent', description: 'Automated GitHub and pipeline remediation agent' }
            ],
            networkMode: 'private',
            managedVnetMode: 'AllowOnlyApprovedOutbound',
            enableAiSearch: true,
            searchSku: 'standard',
            searchSemanticRanker: true,
            enableOpenAi: true,
            openAiSku: 'S0',
            modelDeployments: [
                { name: 'gpt-4o', model: 'gpt-4o', version: '2024-08-06', sku: 'GlobalStandard', capacity: 50 },
                { name: 'gpt-4o-mini', model: 'gpt-4o-mini', version: '2024-07-18', sku: 'GlobalStandard', capacity: 100 }
            ],
            identityType: 'UserAssigned',
            disableLocalAuth: true,
            enableCmk: false,
            enableAppInsights: true,
            enableContainerRegistry: true,
            allowedFqdns: ['pypi', 'github', 'huggingface', 'microsoft']
        }
    },
    {
        id: 'air-gapped-banking',
        label: 'Regulated Zero-Trust (CMK + Air-Gapped)',
        shortDesc: 'Customer-Managed Keys (CMK) + Strict FQDN Egress + Zero Public Endpoints',
        dotColor: 'bg-fluent-cat-red-fg',
        config: {
            workload: 'secureai',
            environment: 'prod',
            region: 'westeurope',
            instance: '001',
            projects: [
                { id: 'amlfraud', name: 'AML & Fraud Surveillance', description: 'High-security transaction auditing and compliance RAG' }
            ],
            networkMode: 'private',
            managedVnetMode: 'AllowOnlyApprovedOutbound',
            enableAiSearch: true,
            searchSku: 'standard2',
            searchSemanticRanker: true,
            enableOpenAi: true,
            openAiSku: 'S0',
            modelDeployments: [
                { name: 'gpt-4o', model: 'gpt-4o', version: '2024-08-06', sku: 'DataZoneStandard', capacity: 40 }
            ],
            identityType: 'UserAssigned',
            disableLocalAuth: true,
            enableCmk: true,
            enableAppInsights: true,
            enableContainerRegistry: true,
            allowedFqdns: ['pypi']
        }
    },
    {
        id: 'fast-track-sandbox',
        label: 'Fast-Track Dev / Sandbox',
        shortDesc: 'Shared Compute + Public Access with IP Restrictions + Pay-As-You-Go OpenAI',
        dotColor: 'bg-fluent-cat-green-fg',
        config: {
            workload: 'pocai',
            environment: 'dev',
            region: 'uksouth',
            instance: '001',
            projects: [
                { id: 'sandbox', name: 'GenAI Innovation Lab', description: 'Rapid prototyping and prompt experimentation' }
            ],
            networkMode: 'public',
            managedVnetMode: 'Disabled',
            enableAiSearch: false,
            searchSku: 'basic',
            searchSemanticRanker: false,
            enableOpenAi: true,
            openAiSku: 'S0',
            modelDeployments: [
                { name: 'gpt-4o-mini', model: 'gpt-4o-mini', version: '2024-07-18', sku: 'GlobalStandard', capacity: 20 }
            ],
            identityType: 'SystemAssigned',
            disableLocalAuth: false,
            enableCmk: false,
            enableAppInsights: true,
            enableContainerRegistry: false,
            allowedFqdns: ['pypi', 'huggingface', 'github', 'microsoft']
        }
    }
];

