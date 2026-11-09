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
        shortDesc: 'Hub + 2 Agent Projects + Container Registry (ACR) + Multi-Model Deployments + AI Search',
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

/**
 * Determines whether the provided AI Foundry configuration matches one of the
 * built-in CAF archetype presets, or returns 'custom' if modified.
 *
 * @param {Object} config - Current AI Foundry configuration object
 * @param {Array<Object>} [presets=ARCHETYPE_PRESETS] - List of archetype presets
 * @returns {string} Matching preset id or 'custom'
 */
export function matchArchetype(config, presets = ARCHETYPE_PRESETS) {
    if (!config || typeof config !== 'object') return 'custom';

    const scalarKeys = [
        'workload',
        'environment',
        'region',
        'instance',
        'networkMode',
        'managedVnetMode',
        'enableAiSearch',
        'searchSku',
        'searchSemanticRanker',
        'enableOpenAi',
        'openAiSku',
        'identityType',
        'disableLocalAuth',
        'enableCmk',
        'enableAppInsights',
        'enableContainerRegistry'
    ];

    for (const preset of presets) {
        const pc = preset.config;
        const scalarsMatch = scalarKeys.every((key) => config[key] === pc[key]);
        if (!scalarsMatch) continue;

        const cfgProjects = Array.isArray(config.projects) ? config.projects : [];
        const pcProjects = Array.isArray(pc.projects) ? pc.projects : [];
        if (cfgProjects.length !== pcProjects.length) continue;
        const projectsMatch = cfgProjects.every((p, idx) =>
            p.id === pcProjects[idx].id &&
            p.name === pcProjects[idx].name &&
            (p.description || '') === (pcProjects[idx].description || '')
        );
        if (!projectsMatch) continue;

        const cfgModels = Array.isArray(config.modelDeployments) ? config.modelDeployments : [];
        const pcModels = Array.isArray(pc.modelDeployments) ? pc.modelDeployments : [];
        if (cfgModels.length !== pcModels.length) continue;
        const modelsMatch = cfgModels.every((m, idx) => m.name === pcModels[idx].name);
        if (!modelsMatch) continue;

        const cfgFqdns = Array.isArray(config.allowedFqdns) ? config.allowedFqdns : [];
        const pcFqdns = Array.isArray(pc.allowedFqdns) ? pc.allowedFqdns : [];
        if (cfgFqdns.length !== pcFqdns.length) continue;
        const fqdnsMatch = pcFqdns.every((f) => cfgFqdns.includes(f));
        if (!fqdnsMatch) continue;

        return preset.id;
    }

    return 'custom';
}


