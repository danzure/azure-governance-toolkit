import { AZURE_REGIONS } from '@features/naming';
import { ARCHETYPE_PRESETS, matchArchetype } from '../data/archetypes';
import { AVAILABLE_MODELS } from '../data/defaultServices';
import { getFoundryResourceNames } from './foundryNaming';

/**
 * Client-Side Smart Heuristic Fallback for AI Foundry Landing Zone Generation
 *
 * Parses natural-language architecture prompts into a normalized AI Foundry
 * configuration aligned with Microsoft Cloud Adoption Framework (CAF) archetypes,
 * zero-trust network controls, and model deployment specs.
 *
 * @param {string} prompt - User natural language AI landing zone request
 * @returns {Object} Normalized AI Foundry synthesis payload
 */
export function generateAiFoundryFallback(prompt) {
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        throw new Error('Prompt is required for fallback generation');
    }

    const lowerPrompt = prompt.toLowerCase().trim();

    // 1. Select base CAF Archetype Preset
    let presetId = 'enterprise-rag';
    if (
        lowerPrompt.includes('multi-agent') ||
        lowerPrompt.includes('multi agent') ||
        lowerPrompt.includes('autonomous agent') ||
        lowerPrompt.includes('agent service') ||
        lowerPrompt.includes('agentic') ||
        lowerPrompt.includes('orchestrat')
    ) {
        presetId = 'autonomous-agents';
    } else if (
        lowerPrompt.includes('regulated') ||
        lowerPrompt.includes('banking') ||
        lowerPrompt.includes('aml') ||
        lowerPrompt.includes('fraud') ||
        lowerPrompt.includes('hipaa') ||
        lowerPrompt.includes('healthcare') ||
        lowerPrompt.includes('air-gapped') ||
        lowerPrompt.includes('air gapped') ||
        lowerPrompt.includes('pci') ||
        lowerPrompt.includes('iso 27001') ||
        lowerPrompt.includes('defense') ||
        lowerPrompt.includes('government')
    ) {
        presetId = 'regulated-zero-trust';
    } else if (
        lowerPrompt.includes('eu ') ||
        /\beu\b/i.test(lowerPrompt) ||
        lowerPrompt.includes('sovereign') ||
        lowerPrompt.includes('gdpr') ||
        lowerPrompt.includes('european') ||
        lowerPrompt.includes('data boundary') ||
        lowerPrompt.includes('data residency')
    ) {
        presetId = 'eu-data-boundary';
    } else if (
        lowerPrompt.includes('fine-tun') ||
        lowerPrompt.includes('finetun') ||
        lowerPrompt.includes('fine tun') ||
        lowerPrompt.includes('llmops') ||
        lowerPrompt.includes('lora') ||
        lowerPrompt.includes('distill') ||
        lowerPrompt.includes('eval') ||
        lowerPrompt.includes('pytorch')
    ) {
        presetId = 'fine-tuning-llmops';
    } else if (
        lowerPrompt.includes('sandbox') ||
        lowerPrompt.includes('poc') ||
        lowerPrompt.includes('fast-track') ||
        lowerPrompt.includes('fast track') ||
        lowerPrompt.includes('hackathon') ||
        lowerPrompt.includes('prototype') ||
        lowerPrompt.includes('innovation lab')
    ) {
        presetId = 'fast-track-sandbox';
    }

    const basePreset = ARCHETYPE_PRESETS.find((p) => p.id === presetId) || ARCHETYPE_PRESETS[0];

    const config = {
        ...basePreset.config,
        projects: (basePreset.config.projects || []).map((p) => ({ ...p })),
        modelDeployments: (basePreset.config.modelDeployments || []).map((m) => ({ ...m })),
        allowedFqdns: [...(basePreset.config.allowedFqdns || [])]
    };

    // 2. Extract Environment override
    const envMap = [
        { patterns: ['prod', 'production'], value: 'prod' },
        { patterns: ['dev', 'development'], value: 'dev' },
        { patterns: ['staging', 'stg'], value: 'stg' },
        { patterns: ['test', 'testing'], value: 'test' },
        { patterns: ['qa', 'quality assurance'], value: 'qa' },
        { patterns: ['uat', 'user acceptance'], value: 'uat' },
        { patterns: ['shared', 'shrd'], value: 'shrd' },
        { patterns: ['sbx'], value: 'sbx' },
        { patterns: ['disaster recovery', 'dr'], value: 'dr' }
    ];
    for (const entry of envMap) {
        if (entry.patterns.some((p) => new RegExp(`\\b${p}\\b`, 'i').test(lowerPrompt))) {
            config.environment = entry.value;
            break;
        }
    }

    // 3. Extract Azure Region override
    const regionAliases = [
        { patterns: ['uk south', 'uksouth', 'uk-south'], value: 'uksouth' },
        { patterns: ['uk west', 'ukwest', 'uk-west'], value: 'ukwest' },
        { patterns: ['sweden central', 'swedencentral', 'sweden'], value: 'swedencentral' },
        { patterns: ['germany west central', 'germanywestcentral', 'germany'], value: 'germanywestcentral' },
        { patterns: ['france central', 'francecentral', 'france'], value: 'francecentral' },
        { patterns: ['switzerland north', 'switzerlandnorth', 'switzerland'], value: 'switzerlandnorth' },
        { patterns: ['west europe', 'westeurope', 'weu'], value: 'westeurope' },
        { patterns: ['north europe', 'northeurope', 'neu'], value: 'northeurope' },
        { patterns: ['east us 2', 'eastus2', 'eus2'], value: 'eastus2' },
        { patterns: ['east us', 'eastus', 'eus'], value: 'eastus' },
        { patterns: ['west us 3', 'westus3'], value: 'westus3' },
        { patterns: ['west us 2', 'westus2'], value: 'westus2' },
        { patterns: ['west us', 'westus'], value: 'westus' },
        { patterns: ['central us', 'centralus'], value: 'centralus' },
        { patterns: ['canada central', 'canadacentral'], value: 'canadacentral' },
        { patterns: ['australia east', 'australiaeast'], value: 'australiaeast' },
        { patterns: ['japan east', 'japaneast'], value: 'japaneast' },
        { patterns: ['southeast asia', 'southeastasia'], value: 'southeastasia' }
    ];
    let regionMatched = false;
    for (const entry of regionAliases) {
        if (entry.patterns.some((p) => lowerPrompt.includes(p))) {
            config.region = entry.value;
            regionMatched = true;
            break;
        }
    }
    if (!regionMatched) {
        const dynamicRegion = AZURE_REGIONS.filter((r) => !r.type)
            .sort((a, b) => b.label.length - a.label.length)
            .find((r) => lowerPrompt.includes(r.label.toLowerCase()) || lowerPrompt.includes(r.value.toLowerCase()));
        if (dynamicRegion) {
            config.region = dynamicRegion.value;
        }
    }

    // 4. Extract Instance override
    const instanceMatch = lowerPrompt.match(/\b(?:instance\s*)?0*([1-9][0-9]{0,2})\b/i);
    if (instanceMatch && (lowerPrompt.includes('instance') || /\b00[1-9]\b/.test(lowerPrompt))) {
        config.instance = instanceMatch[1].padStart(3, '0');
    }

    // 5. Domain-specific workload & project tailoring
    if (lowerPrompt.includes('healthcare') || lowerPrompt.includes('clinical') || lowerPrompt.includes('hipaa') || lowerPrompt.includes('medical')) {
        config.workload = 'healthai';
        config.projects = [
            { id: 'clinai', name: 'Clinical Notes Copilot', description: 'HIPAA-compliant patient summary and triage RAG' },
            { id: 'medsrch', name: 'Medical Literature Search', description: 'Evidence-based clinical knowledge retrieval' }
        ];
    } else if (lowerPrompt.includes('banking') || lowerPrompt.includes('aml') || lowerPrompt.includes('fraud') || lowerPrompt.includes('financial')) {
        config.workload = 'bankai';
        config.projects = [
            { id: 'amlfraud', name: 'AML & Fraud Surveillance', description: 'High-security transaction auditing and compliance RAG' },
            { id: 'riskrag', name: 'Credit Risk Intelligence', description: 'Regulated financial analysis and policy retrieval' }
        ];
    } else if (lowerPrompt.includes('retail') || lowerPrompt.includes('e-commerce') || lowerPrompt.includes('ecommerce')) {
        config.workload = 'retailai';
        config.projects = [
            { id: 'shopai', name: 'Shopping Concierge Agent', description: 'Personalized catalog assistant and product Q&A' },
            { id: 'supai', name: 'Order Support Copilot', description: 'Automated customer order resolution agent' }
        ];
    } else if (lowerPrompt.includes('legal') || lowerPrompt.includes('hr') || lowerPrompt.includes('human resources')) {
        config.workload = 'corpai';
        config.projects = [
            { id: 'hrassist', name: 'HR & People Assistant', description: 'Internal policy and employee onboarding copilot' },
            { id: 'legalrag', name: 'Contract & Legal Review', description: 'Confidential legal document search and clause synthesis' }
        ];
    } else {
        const forOrgMatch = lowerPrompt.match(/\bfor\s+([a-z0-9]{2,12})\b/i);
        if (forOrgMatch && !['the', 'our', 'all', 'any', 'azure', 'prod', 'dev', 'test', 'rag', 'ai'].includes(forOrgMatch[1].toLowerCase())) {
            config.workload = `${forOrgMatch[1].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}ai`;
        }
    }

    // 6. Network & Security Controls overrides
    const wantsPublic = /\bpublic\b/i.test(lowerPrompt) || /(?:no|without|disable)\s+(?:managed\s+)?vnet/i.test(lowerPrompt);
    const wantsPrivate =
        lowerPrompt.includes('private') ||
        lowerPrompt.includes('zero-trust') ||
        lowerPrompt.includes('zero trust') ||
        lowerPrompt.includes('managed vnet') ||
        lowerPrompt.includes('isolated');

    if (wantsPublic && !wantsPrivate) {
        config.networkMode = 'public';
        config.managedVnetMode = 'Disabled';
    } else if (wantsPrivate) {
        config.networkMode = 'private';
        config.managedVnetMode = lowerPrompt.includes('allow internet outbound')
            ? 'AllowInternetOutbound'
            : 'AllowOnlyApprovedOutbound';
    }

    if (
        lowerPrompt.includes('cmk') ||
        lowerPrompt.includes('customer-managed') ||
        lowerPrompt.includes('customer managed') ||
        lowerPrompt.includes('hsm') ||
        lowerPrompt.includes('double encryption') ||
        lowerPrompt.includes('byok')
    ) {
        config.enableCmk = true;
    } else if (lowerPrompt.includes('no cmk') || lowerPrompt.includes('without cmk')) {
        config.enableCmk = false;
    }

    if (lowerPrompt.includes('system-assigned') || lowerPrompt.includes('system assigned') || /\bsami\b/i.test(lowerPrompt)) {
        config.identityType = 'SystemAssigned';
    } else if (lowerPrompt.includes('user-assigned') || lowerPrompt.includes('user assigned') || /\buami\b/i.test(lowerPrompt)) {
        config.identityType = 'UserAssigned';
    }

    if (
        lowerPrompt.includes('no api key') ||
        lowerPrompt.includes('disable local auth') ||
        lowerPrompt.includes('entra only') ||
        lowerPrompt.includes('entra id only')
    ) {
        config.disableLocalAuth = true;
    }

    if (/(?:no|without|disable)\s+(?:app\s*insights|monitoring|telemetry)/i.test(lowerPrompt)) {
        config.enableAppInsights = false;
    }

    // 7. Connected AI Services, Search & Models
    if (/(?:no|without|disable)\s+(?:ai\s+)?search/i.test(lowerPrompt)) {
        config.enableAiSearch = false;
        config.searchSemanticRanker = false;
    } else if (lowerPrompt.includes('ai search') || lowerPrompt.includes('vector') || lowerPrompt.includes('rag') || lowerPrompt.includes('semantic')) {
        config.enableAiSearch = true;
    }

    if (config.enableAiSearch) {
        if (lowerPrompt.includes('storage optimized') || /\bl1\b/i.test(lowerPrompt)) {
            config.searchSku = 'storage_optimized_l1';
        } else if (lowerPrompt.includes('standard2') || /\bs2\b/i.test(lowerPrompt) || lowerPrompt.includes('high volume')) {
            config.searchSku = 'standard2';
        } else if (lowerPrompt.includes('basic')) {
            config.searchSku = 'basic';
        }
        if (lowerPrompt.includes('semantic')) {
            config.searchSemanticRanker = true;
        }
    }

    if (
        lowerPrompt.includes('acr') ||
        lowerPrompt.includes('container registry') ||
        lowerPrompt.includes('docker') ||
        lowerPrompt.includes('custom runtime')
    ) {
        config.enableContainerRegistry = true;
    }

    // Check explicit model mentions (check gpt-4o-mini before gpt-4o)
    const modelMatchers = [
        { id: 'gpt-4o-mini', regex: /\bgpt-?4o-?mini\b/i },
        { id: 'gpt-4o', regex: /\bgpt-?4o\b(?!-?mini)/i },
        { id: 'o3-mini', regex: /\bo3-?mini\b/i },
        { id: 'o1', regex: /\bo1\b/i },
        { id: 'text-embedding-3-large', regex: /\b(?:text-)?embedding-?3-?large\b/i },
        { id: 'text-embedding-3-small', regex: /\b(?:text-)?embedding-?3-?small\b/i }
    ];
    const matchedModelIds = modelMatchers.filter((m) => m.regex.test(lowerPrompt)).map((m) => m.id);
    if (matchedModelIds.length > 0) {
        const isDataZone = presetId === 'eu-data-boundary' || lowerPrompt.includes('datazone') || lowerPrompt.includes('sovereign');
        config.enableOpenAi = true;
        config.modelDeployments = matchedModelIds
            .map((id) => AVAILABLE_MODELS.find((m) => m.id === id))
            .filter(Boolean)
            .map((m) => ({
                name: m.id,
                model: m.id,
                version: m.defaultVersion,
                sku: isDataZone && m.skus.includes('DataZoneStandard') ? 'DataZoneStandard' : m.skus[0],
                capacity: m.defaultCapacity
            }));
    }

    // Ensure FQDN allowlist additions when requested
    const fqdnSet = new Set(config.allowedFqdns || []);
    if (lowerPrompt.includes('conda') || lowerPrompt.includes('anaconda')) fqdnSet.add('conda');
    if (lowerPrompt.includes('hugging face') || lowerPrompt.includes('huggingface')) fqdnSet.add('huggingface');
    if (lowerPrompt.includes('github')) fqdnSet.add('github');
    if (lowerPrompt.includes('pypi') || lowerPrompt.includes('python')) fqdnSet.add('pypi');
    config.allowedFqdns = Array.from(fqdnSet);

    const archetypeId = matchArchetype(config, ARCHETYPE_PRESETS);
    const names = getFoundryResourceNames(config);

    const summary = `${basePreset.label.split(' (')[0]} Landing Zone (${config.environment.toUpperCase()} • ${config.region})`;

    const securityNotes = [];
    if (config.networkMode === 'private') {
        securityNotes.push(`Private Link ingress with ${config.managedVnetMode}`);
    } else {
        securityNotes.push('Public endpoint ingress for rapid PoC iteration');
    }
    if (config.disableLocalAuth) securityNotes.push('Entra ID token-only auth');
    if (config.enableCmk) securityNotes.push('Customer-Managed Key (CMK) HSM encryption');

    const explanation = `Configured ${names.projects.length} child ${names.projects.length === 1 ? 'project' : 'projects'} under hub ${names.hubName} with ${securityNotes.join(', ')}.`;

    return {
        config,
        archetypeId,
        summary,
        explanation,
        hubName: names.hubName,
        rgName: names.rgName
    };
}
