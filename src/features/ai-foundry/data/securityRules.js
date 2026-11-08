/**
 * Microsoft Cloud Security Benchmark (MCSB) & Zero-Trust Checks for AI Foundry
 */
export const SECURITY_RULES = [
    {
        id: 'SEC-01',
        title: 'Zero Public Network Access',
        category: 'Network Security',
        description: 'AI Hub, Storage, Key Vault, and AI Services should disable public endpoint access.',
        severity: 'high',
        evaluate: (config) => config.networkMode === 'private'
    },
    {
        id: 'SEC-02',
        title: 'Strict Managed VNet Outbound Rules',
        category: 'Network Security',
        description: 'Managed VNet must use AllowOnlyApprovedOutbound with explicit FQDN allowlisting.',
        severity: 'high',
        evaluate: (config) => config.networkMode === 'public' || config.managedVnetMode === 'AllowOnlyApprovedOutbound'
    },
    {
        id: 'SEC-03',
        title: 'Entra ID Authentication Only (No Local Keys)',
        category: 'Identity & Access',
        description: 'Disable local API keys on Azure OpenAI and AI Search to enforce RBAC and token rotation.',
        severity: 'critical',
        evaluate: (config) => config.disableLocalAuth === true
    },
    {
        id: 'SEC-04',
        title: 'User-Assigned Managed Identity',
        category: 'Identity & Access',
        description: 'Use User-Assigned Managed Identity (UAMI) rather than System-Assigned for cross-resource RBAC.',
        severity: 'medium',
        evaluate: (config) => config.identityType === 'UserAssigned'
    },
    {
        id: 'SEC-05',
        title: 'Customer-Managed Keys (CMK) Encryption',
        category: 'Data Protection',
        description: 'Regulatory workloads should enforce Key Vault Customer-Managed Key encryption at rest.',
        severity: 'medium',
        evaluate: (config) => config.enableCmk === true
    },
    {
        id: 'SEC-06',
        title: 'Diagnostic Logging & Audit Trail',
        category: 'Monitoring',
        description: 'Workspace and inference requests must stream diagnostic telemetry to Application Insights / Log Analytics.',
        severity: 'medium',
        evaluate: (config) => config.enableAppInsights === true
    }
];

