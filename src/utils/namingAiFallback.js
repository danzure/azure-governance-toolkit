import { RESOURCE_DATA_SORTED } from '../data/constants';

/**
 * Client-Side Smart Heuristic Fallback for Resource Naming AI Generation
 * 
 * Provides intelligent natural language parsing and architectural extraction
 * against the canonical CAF resource catalog when offline or when the
 * Azure OpenAI backend is unconfigured / running in local dev without Azure Functions.
 * 
 * @param {string} prompt - User natural language architecture prompt
 * @returns {Object} Normalized naming configuration object
 */
export function generateResourceNameFallback(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt is required for fallback generation');
    }

    const lowerPrompt = prompt.toLowerCase().trim();

    // 1. Extract Environment
    let envValue = 'prod';
    const envMap = [
        { patterns: ['prod', 'production'], value: 'prod' },
        { patterns: ['dev', 'development'], value: 'dev' },
        { patterns: ['staging', 'stg'], value: 'stg' },
        { patterns: ['test', 'testing'], value: 'test' },
        { patterns: ['qa', 'quality assurance'], value: 'qa' },
        { patterns: ['uat', 'user acceptance'], value: 'uat' },
        { patterns: ['shared', 'shrd'], value: 'shrd' },
        { patterns: ['sandbox', 'sbx'], value: 'sbx' },
        { patterns: ['disaster recovery', 'dr'], value: 'dr' },
    ];

    for (const entry of envMap) {
        if (entry.patterns.some(p => {
            const regex = new RegExp(`\\b${p}\\b`, 'i');
            return regex.test(lowerPrompt);
        })) {
            envValue = entry.value;
            break;
        }
    }

    // 2. Extract Region
    let regionValue = 'uksouth';
    const regionMap = [
        { patterns: ['uk south', 'uksouth', 'uk-south'], value: 'uksouth' },
        { patterns: ['uk west', 'ukwest', 'uk-west'], value: 'ukwest' },
        { patterns: ['west europe', 'westeurope', 'weu'], value: 'westeurope' },
        { patterns: ['north europe', 'northeurope', 'neu'], value: 'northeurope' },
        { patterns: ['east us 2', 'eastus2'], value: 'eastus2' },
        { patterns: ['east us', 'eastus'], value: 'eastus' },
        { patterns: ['central us', 'centralus'], value: 'centralus' },
        { patterns: ['west us 2', 'westus2'], value: 'westus2' },
        { patterns: ['west us', 'westus'], value: 'westus' },
        { patterns: ['sweden central', 'swedencentral'], value: 'swedencentral' },
        { patterns: ['germany west central', 'germanywestcentral'], value: 'germanywestcentral' },
        { patterns: ['france central', 'francecentral'], value: 'francecentral' },
        { patterns: ['australia east', 'australiaeast'], value: 'australiaeast' },
        { patterns: ['southeast asia', 'southeastasia'], value: 'southeastasia' },
        { patterns: ['east asia', 'eastasia'], value: 'eastasia' },
        { patterns: ['japan east', 'japaneast'], value: 'japaneast' },
        { patterns: ['canada central', 'canadacentral'], value: 'canadacentral' },
        { patterns: ['brazil south', 'brazilsouth'], value: 'brazilsouth' },
    ];

    for (const entry of regionMap) {
        if (entry.patterns.some(p => lowerPrompt.includes(p))) {
            regionValue = entry.value;
            break;
        }
    }

    // 3. Extract Instance (e.g., "001", "002", "instance 2")
    let instance = '001';
    const instanceMatch = lowerPrompt.match(/\b(?:instance\s*)?0*([1-9][0-9]{0,2})\b/i);
    if (instanceMatch && (lowerPrompt.includes('instance') || /\b00[1-9]\b/.test(lowerPrompt))) {
        instance = instanceMatch[1].padStart(3, '0');
    }

    // 4. Extract Organization / Client Prefix
    let orgPrefix = '';
    const orgMatch = lowerPrompt.match(/\bfor\s+([a-z0-9]{2,10})\b/i);
    if (orgMatch && !['the', 'our', 'all', 'any', 'azure'].includes(orgMatch[1].toLowerCase())) {
        orgPrefix = orgMatch[1].toLowerCase().slice(0, 6);
    }

    // 5. Architecture Archetypes & Intent Resolution
    let workload = 'workload';
    let searchTerm = '';
    let architectureSummary = '';
    let explanation = 'Generated following Microsoft Cloud Adoption Framework (CAF) naming rules.';

    // Pattern 1: RAG / GenAI / OpenAI / AI Search
    if (lowerPrompt.includes('rag') || lowerPrompt.includes('openai') || lowerPrompt.includes('ai search') || lowerPrompt.includes('generative ai')) {
        workload = 'genai';
        searchTerm = 'Azure AI Search, Azure AI services account, Storage account, Key vault, Application Insights';
        architectureSummary = 'Generative AI and RAG architecture with AI Search, Azure OpenAI, and Key Vault.';
        explanation = 'Leverage Managed Identity for authentication between AI Search and storage accounts.';
    }
    // Pattern 2: IoT & Streaming Data Pipeline
    else if (lowerPrompt.includes('iot') || lowerPrompt.includes('stream analytics') || lowerPrompt.includes('event hub') || lowerPrompt.includes('pipeline')) {
        workload = 'iot';
        searchTerm = 'Event Hub namespace, Event Hub, Stream Analytics Job, Cosmos DB account, Storage account';
        architectureSummary = 'Real-time IoT data pipeline using Event Hubs, Stream Analytics, and Cosmos DB.';
        explanation = 'Configure separate Event Hub partitions and stream processing jobs per device stream.';
    }
    // Pattern 3: AKS / Kubernetes Microservices
    else if (lowerPrompt.includes('aks') || lowerPrompt.includes('kubernetes') || lowerPrompt.includes('microservices') || lowerPrompt.includes('container app')) {
        workload = 'microservices';
        searchTerm = 'Kubernetes (AKS), Container registry, Virtual network, Public IP, Managed identity (user), Log Analytics workspace, Key vault';
        architectureSummary = 'Secure AKS container cluster with Container Registry and managed identity integration.';
        explanation = 'Container Registry names must be globally unique alphanumeric strings (5-50 chars) without hyphens.';
    }
    // Pattern 4: Zero Trust Hub & Spoke Networking
    else if (lowerPrompt.includes('hub') || lowerPrompt.includes('spoke') || lowerPrompt.includes('firewall') || lowerPrompt.includes('zero-trust') || lowerPrompt.includes('zero trust')) {
        workload = 'corenet';
        searchTerm = 'Virtual network, Azure Firewall, Firewall policy, VPN Gateway, Public IP, Bastion host';
        architectureSummary = 'Centralized Hub and Spoke network perimeter with Azure Firewall, VPN Gateway, and Bastion.';
        explanation = 'Deploy GatewaySubnet and AzureFirewallSubnet dedicated subnets adhering to CAF naming.';
    }
    // Pattern 5: Spring Boot / Web App with Database
    else if (lowerPrompt.includes('spring') || lowerPrompt.includes('postgres') || lowerPrompt.includes('postgresql')) {
        workload = lowerPrompt.includes('spring') ? 'springboot' : 'webapp';
        searchTerm = 'App Service plan, App Service, PostgreSQL server, Virtual network, Key vault, Application Insights';
        architectureSummary = 'Scalable web application backed by Azure Database for PostgreSQL and Key Vault.';
        explanation = 'Isolate the database inside a private subnet and connect via App Service VNet integration.';
    }
    // Pattern 6: Modern Data Warehouse (Databricks + Data Lake)
    else if (lowerPrompt.includes('databricks') || lowerPrompt.includes('data lake') || lowerPrompt.includes('data warehouse') || lowerPrompt.includes('analytics')) {
        workload = 'datawhouse';
        searchTerm = 'Databricks workspace, Data Lake Storage, Data Factory, Key vault, Log Analytics workspace';
        architectureSummary = 'Modern Data Platform with Data Factory ingestion, Data Lake storage, and Azure Databricks.';
        explanation = 'Data Lake storage accounts require globally unique lowercase names (3-24 chars, no hyphens).';
    }
    // Pattern 7: Serverless Event-Driven (Functions + Cosmos DB)
    else if (lowerPrompt.includes('serverless') || lowerPrompt.includes('function') || (lowerPrompt.includes('event') && lowerPrompt.includes('cosmos'))) {
        workload = 'serverless';
        searchTerm = 'Function app, App Service plan, Storage account, Cosmos DB account, Application Insights, Key vault';
        architectureSummary = 'Serverless event-driven processing with Azure Functions and Cosmos DB.';
        explanation = 'Function App storage accounts must follow standard Storage Account character constraints.';
    }
    // Pattern 8: Machine Learning Operations (MLOps)
    else if (lowerPrompt.includes('mlops') || lowerPrompt.includes('machine learning') || lowerPrompt.includes('ml workspace')) {
        workload = 'mlops';
        searchTerm = 'Machine Learning workspace, Storage account, Key vault, Application Insights, Container registry';
        architectureSummary = 'Machine Learning Operations (MLOps) workspace with compute clusters and dependencies.';
        explanation = 'Azure ML automatically links Key Vault, Storage Account, and ACR upon workspace deployment.';
    }
    // Pattern 9: Disaster Recovery / Traffic Manager
    else if (lowerPrompt.includes('disaster recovery') || lowerPrompt.includes('traffic manager') || lowerPrompt.includes('multi-region')) {
        workload = 'globalapp';
        searchTerm = 'Traffic Manager, App Service, App Service plan, SQL database, Storage account';
        architectureSummary = 'Global disaster recovery architecture with Traffic Manager and geo-replicated services.';
        explanation = 'Ensure secondary regions have identical resource naming conventions with region code suffixes.';
    }
    // Pattern 10: E-Commerce / Retail Web Platform
    else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('e-commerce') || lowerPrompt.includes('retail') || lowerPrompt.includes('shopping')) {
        workload = 'ecommerce';
        searchTerm = 'App Service plan, App Service, SQL server, SQL database, Key vault, Application Insights, Azure Cache for Redis';
        architectureSummary = 'Highly available e-commerce platform with App Service, Azure SQL, and Redis Cache.';
        explanation = 'Ensure Azure SQL and Redis are secured via Private Endpoints and secrets are managed via Key Vault.';
    }
    // Pattern 11: Azure Virtual Desktop (AVD)
    else if (lowerPrompt.includes('virtual desktop') || lowerPrompt.includes('avd') || lowerPrompt.includes('host pool')) {
        workload = 'avd';
        searchTerm = 'Host Pool, Workspace, Application Group, Scaling Plan, Virtual network';
        architectureSummary = 'Azure Virtual Desktop enterprise host pool and workspace environment.';
        explanation = 'AVD workspaces and host pools should align with business unit or application workload names.';
    }
    // Pattern 12: Generic Fallback & Dynamic Catalog Search
    else {
        // Extract a clean workload candidate from words in prompt
        const words = lowerPrompt.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => 
            w.length > 2 && 
            !['the', 'and', 'for', 'with', 'azure', 'app', 'environment', 'setup', 'prod', 'dev', 'test', 'deploy'].includes(w)
        );
        
        if (words.length > 0) {
            workload = words[0];
        }

        // Match any canonical resources mentioned in prompt
        const matchedResources = [];
        RESOURCE_DATA_SORTED.forEach(res => {
            const resNameLower = res.name.toLowerCase();
            const resAbbrevLower = res.abbrev.toLowerCase();
            const matchesName = lowerPrompt.includes(resNameLower);
            const matchesAbbrev = resAbbrevLower.length >= 3 && new RegExp(`\\b${resAbbrevLower}\\b`, 'i').test(lowerPrompt);
            if (matchesName || matchesAbbrev) {
                matchedResources.push(res.name);
            }
        });

        if (matchedResources.length > 0) {
            searchTerm = matchedResources.slice(0, 6).join(', ');
            architectureSummary = `Architecture configuration tailored for ${matchedResources.slice(0, 3).join(', ')}.`;
        } else {
            searchTerm = 'Resource group, Virtual network, Storage account, Key vault, Log Analytics workspace';
            architectureSummary = `Standard enterprise foundational architecture in ${regionValue}.`;
        }
    }

    return {
        workload,
        orgPrefix,
        envValue,
        regionValue,
        instance,
        searchTerm,
        architectureSummary,
        explanation
    };
}
