const { app } = require('@azure/functions');
const catalog = require('../data/azureCatalog.json');

const VALID_MODELS = {
    'gpt-4o': { defaultVersion: '2024-08-06', skus: ['GlobalStandard', 'DataZoneStandard', 'Standard'], defaultCapacity: 30 },
    'gpt-4o-mini': { defaultVersion: '2024-07-18', skus: ['GlobalStandard', 'DataZoneStandard', 'Standard'], defaultCapacity: 50 },
    'o1': { defaultVersion: '2024-12-17', skus: ['GlobalStandard'], defaultCapacity: 20 },
    'o3-mini': { defaultVersion: '2025-01-31', skus: ['GlobalStandard'], defaultCapacity: 30 },
    'text-embedding-3-large': { defaultVersion: '1', skus: ['Standard'], defaultCapacity: 50 },
    'text-embedding-3-small': { defaultVersion: '1', skus: ['Standard'], defaultCapacity: 100 }
};

const VALID_SEARCH_SKUS = new Set(['basic', 'standard', 'standard2', 'storage_optimized_l1']);
const VALID_FQDN_IDS = new Set(['pypi', 'huggingface', 'github', 'conda', 'microsoft']);

const validRegionsList = catalog.regions.map((r) => r.value).join(', ');
const validEnvsList = catalog.environments.map((e) => e.value).join(', ');

const SYSTEM_PROMPT = `You are an expert Azure AI & Cloud Solutions Architect. Your mission is to convert a user's natural language request into a complete, Cloud Adoption Framework (CAF) compliant Azure AI Foundry landing zone configuration.

CANONICAL PARAMETERS:
- Environments: [${validEnvsList}] (default: "prod")
- Azure Regions: [${validRegionsList}] (default: "uksouth")
- Network Modes: "private" (Private Link & Managed VNet - recommended) | "public" (Dev/Sandbox only)
- Managed VNet Modes: "AllowOnlyApprovedOutbound" (Zero-Trust) | "AllowInternetOutbound" | "Disabled"
- Search SKUs: "basic" | "standard" | "standard2" | "storage_optimized_l1"
- Models: "gpt-4o", "gpt-4o-mini", "o1", "o3-mini", "text-embedding-3-large", "text-embedding-3-small"
- Identity Types: "UserAssigned" (recommended) | "SystemAssigned"
- Allowed FQDN Categories: "pypi", "huggingface", "github", "conda", "microsoft"

RULES:
1. Choose "private" + "AllowOnlyApprovedOutbound" + "disableLocalAuth": true + "identityType": "UserAssigned" for production, enterprise, regulated, or zero-trust workloads.
2. Enable "enableCmk": true for regulated banking, healthcare, defense, or explicit CMK/HSM requests.
3. Enable "enableContainerRegistry": true for multi-agent systems, custom Docker runtimes, or LLMOps/fine-tuning pipelines.
4. Keep "workload" short, lowercase alphanumeric (max 10 chars, e.g., "coreai", "bankai", "healthai", "agents").
5. Provide 1-3 realistic child "projects" with short lowercase alphanumeric "id" slugs (max 10 chars), human-readable "name", and concise "description".
6. Provide a crisp 1-sentence "summary" and a 1-2 sentence CAF security/governance "explanation".`;

const JSON_SCHEMA_DEFINITION = {
    type: 'json_schema',
    json_schema: {
        name: 'azure_ai_foundry_landing_zone',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                config: {
                    type: 'object',
                    properties: {
                        workload: { type: 'string' },
                        environment: {
                            type: 'string',
                            enum: ['prod', 'dev', 'stg', 'test', 'uat', 'qa', 'shrd', 'sbx', 'dr']
                        },
                        region: { type: 'string' },
                        instance: { type: 'string' },
                        projects: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    description: { type: 'string' }
                                },
                                required: ['id', 'name', 'description'],
                                additionalProperties: false
                            }
                        },
                        networkMode: { type: 'string', enum: ['private', 'public'] },
                        managedVnetMode: {
                            type: 'string',
                            enum: ['AllowOnlyApprovedOutbound', 'AllowInternetOutbound', 'Disabled']
                        },
                        enableAiSearch: { type: 'boolean' },
                        searchSku: {
                            type: 'string',
                            enum: ['basic', 'standard', 'standard2', 'storage_optimized_l1']
                        },
                        searchSemanticRanker: { type: 'boolean' },
                        enableOpenAi: { type: 'boolean' },
                        modelNames: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        identityType: { type: 'string', enum: ['UserAssigned', 'SystemAssigned'] },
                        disableLocalAuth: { type: 'boolean' },
                        enableCmk: { type: 'boolean' },
                        enableAppInsights: { type: 'boolean' },
                        enableContainerRegistry: { type: 'boolean' },
                        allowedFqdns: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    },
                    required: [
                        'workload',
                        'environment',
                        'region',
                        'instance',
                        'projects',
                        'networkMode',
                        'managedVnetMode',
                        'enableAiSearch',
                        'searchSku',
                        'searchSemanticRanker',
                        'enableOpenAi',
                        'modelNames',
                        'identityType',
                        'disableLocalAuth',
                        'enableCmk',
                        'enableAppInsights',
                        'enableContainerRegistry',
                        'allowedFqdns'
                    ],
                    additionalProperties: false
                },
                summary: { type: 'string' },
                explanation: { type: 'string' }
            },
            required: ['config', 'summary', 'explanation'],
            additionalProperties: false
        }
    }
};

function normalizeAiFoundryResponse(rawPayload) {
    const rawConfig = (rawPayload && rawPayload.config) || rawPayload || {};

    const validRegions = new Map();
    catalog.regions.forEach((r) => {
        validRegions.set(r.value.toLowerCase(), r.value);
        validRegions.set(r.label.toLowerCase(), r.value);
        if (r.abbrev) validRegions.set(r.abbrev.toLowerCase(), r.value);
    });
    const validEnvs = new Set(catalog.environments.map((e) => e.value.toLowerCase()));

    const workload = (rawConfig.workload || 'coreai')
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 12) || 'coreai';

    let environment = (rawConfig.environment || 'prod').toString().toLowerCase().trim();
    if (!validEnvs.has(environment)) environment = 'prod';

    const rawRegion = (rawConfig.region || 'uksouth').toString().toLowerCase().replace(/\s+/g, '');
    const region = validRegions.get(rawRegion) || 'uksouth';

    const rawInst = (rawConfig.instance || '001').toString().replace(/[^0-9]/g, '');
    const instance = rawInst ? rawInst.padStart(3, '0').slice(-3) : '001';

    const projects = Array.isArray(rawConfig.projects) && rawConfig.projects.length > 0
        ? rawConfig.projects.slice(0, 5).map((p, idx) => ({
            id: (p.id || `app${idx + 1}`).toString().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 12) || `app${idx + 1}`,
            name: (p.name || `Application ${idx + 1}`).toString().trim().slice(0, 60),
            description: (p.description || 'AI Foundry application workspace').toString().trim().slice(0, 160)
        }))
        : [{ id: 'custai', name: 'AI Application Workspace', description: 'Enterprise AI Foundry project workspace' }];

    const networkMode = rawConfig.networkMode === 'public' ? 'public' : 'private';
    let managedVnetMode = rawConfig.managedVnetMode;
    if (networkMode === 'public') {
        managedVnetMode = 'Disabled';
    } else if (!['AllowOnlyApprovedOutbound', 'AllowInternetOutbound', 'Disabled'].includes(managedVnetMode)) {
        managedVnetMode = 'AllowOnlyApprovedOutbound';
    }

    const enableAiSearch = Boolean(rawConfig.enableAiSearch);
    const searchSku = VALID_SEARCH_SKUS.has(rawConfig.searchSku) ? rawConfig.searchSku : 'standard';
    const searchSemanticRanker = enableAiSearch && Boolean(rawConfig.searchSemanticRanker);
    const enableOpenAi = rawConfig.enableOpenAi !== false;

    const requestedModelNames = Array.isArray(rawConfig.modelNames)
        ? rawConfig.modelNames
        : Array.isArray(rawConfig.modelDeployments)
            ? rawConfig.modelDeployments.map((m) => m.name || m.model || m)
            : ['gpt-4o'];

    const isEu = region === 'swedencentral' || region === 'westeurope' || region === 'northeurope' || region === 'germanywestcentral' || region === 'francecentral';
    const modelDeployments = [];
    const seenModels = new Set();
    requestedModelNames.forEach((mId) => {
        const cleanId = (mId || '').toString().trim();
        const spec = VALID_MODELS[cleanId];
        if (spec && !seenModels.has(cleanId)) {
            seenModels.add(cleanId);
            const sku = isEu && spec.skus.includes('DataZoneStandard') ? 'DataZoneStandard' : spec.skus[0];
            modelDeployments.push({
                name: cleanId,
                model: cleanId,
                version: spec.defaultVersion,
                sku,
                capacity: spec.defaultCapacity
            });
        }
    });

    if (enableOpenAi && modelDeployments.length === 0) {
        modelDeployments.push({
            name: 'gpt-4o',
            model: 'gpt-4o',
            version: VALID_MODELS['gpt-4o'].defaultVersion,
            sku: 'GlobalStandard',
            capacity: 30
        });
    }

    const identityType = rawConfig.identityType === 'SystemAssigned' ? 'SystemAssigned' : 'UserAssigned';
    const disableLocalAuth = Boolean(rawConfig.disableLocalAuth);
    const enableCmk = Boolean(rawConfig.enableCmk);
    const enableAppInsights = rawConfig.enableAppInsights !== false;
    const enableContainerRegistry = Boolean(rawConfig.enableContainerRegistry);

    const allowedFqdns = Array.isArray(rawConfig.allowedFqdns)
        ? rawConfig.allowedFqdns.filter((id) => VALID_FQDN_IDS.has(id))
        : ['pypi', 'huggingface', 'github'];

    const config = {
        workload,
        environment,
        region,
        instance,
        projects,
        networkMode,
        managedVnetMode,
        enableAiSearch,
        searchSku,
        searchSemanticRanker,
        enableOpenAi,
        openAiSku: 'S0',
        modelDeployments,
        identityType,
        disableLocalAuth,
        enableCmk,
        enableAppInsights,
        enableContainerRegistry,
        allowedFqdns
    };

    return {
        config,
        summary: (rawPayload?.summary || `AI Foundry Landing Zone (${environment.toUpperCase()} • ${region})`).toString().trim().slice(0, 180),
        explanation: (rawPayload?.explanation || 'Configured with Cloud Adoption Framework naming and zero-trust governance controls.').toString().trim().slice(0, 320)
    };
}

app.http('generateAiFoundry', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            let body;
            try {
                body = await request.json();
            } catch {
                return {
                    status: 400,
                    jsonBody: { error: 'Invalid JSON payload in request body' }
                };
            }

            const { prompt } = body || {};

            if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
                return {
                    status: 400,
                    jsonBody: { error: 'Please pass a valid text prompt in the request body' }
                };
            }

            const sanitizedPrompt = prompt.trim();
            if (sanitizedPrompt.length > 2000) {
                return {
                    status: 400,
                    jsonBody: { error: 'Prompt must not exceed 2,000 characters' }
                };
            }

            const projectEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_API_KEY;
            const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

            if (!projectEndpoint || !apiKey || !deploymentName) {
                context.warn('Azure OpenAI environment variables are not fully configured.');
                return {
                    status: 503,
                    jsonBody: {
                        error: 'AI Service Not Configured',
                        details: 'Missing required Azure OpenAI configuration.'
                    }
                };
            }

            const inferenceUrl = `${projectEndpoint}/openai/v1/chat/completions`;

            async function callOpenAi(formatOption) {
                return fetch(inferenceUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: deploymentName,
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT },
                            { role: 'user', content: sanitizedPrompt }
                        ],
                        response_format: formatOption,
                        temperature: 0.1
                    })
                });
            }

            let response = await callOpenAi(JSON_SCHEMA_DEFINITION);

            if (!response.ok && response.status === 400) {
                context.warn('Structured json_schema returned 400. Retrying with type: json_object fallback.');
                response = await callOpenAi({ type: 'json_object' });
            }

            if (!response.ok) {
                const errorBody = await response.text();
                context.error(`Foundry API error (${response.status}): ${errorBody}`);
                return {
                    status: 502,
                    jsonBody: { error: 'AI service temporarily unavailable. Please try again later.' }
                };
            }

            const data = await response.json();
            const responseText = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

            if (!responseText) {
                throw new Error('Empty response received from AI model');
            }

            const parsedPayload = JSON.parse(responseText);
            const normalizedResult = normalizeAiFoundryResponse(parsedPayload);

            return {
                status: 200,
                jsonBody: normalizedResult
            };
        } catch (error) {
            context.error('Error processing request:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal Server Error' }
            };
        }
    }
});

module.exports = {
    normalizeAiFoundryResponse
};
