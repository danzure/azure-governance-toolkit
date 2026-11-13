/**
 * Microsoft Cloud Security Benchmark (MCSB) & Zero-Trust Checks for AI Foundry
 */
export const SECURITY_RULES = [
    {
        id: 'SEC-01',
        title: 'Zero Public Network Access',
        category: 'Network Security',
        description: 'AI Hub, Storage, Key Vault, and AI Services should disable public endpoint access.',
        remediation: 'Switch Ingress Network Security to Private Link & Managed VNet to disable public endpoints across Hub, Storage, Key Vault, and AI Services.',
        severity: 'high',
        evaluate: (config) => config.networkMode === 'private'
    },
    {
        id: 'SEC-02',
        title: 'Strict Managed VNet Outbound Rules',
        category: 'Network Security',
        description: 'Managed VNet must use AllowOnlyApprovedOutbound with explicit FQDN allowlisting.',
        remediation: 'Set Managed Virtual Network mode to AllowOnlyApprovedOutbound to block unauthorized internet egress from compute and prompt flows.',
        severity: 'high',
        evaluate: (config) => config.networkMode === 'private' && config.managedVnetMode === 'AllowOnlyApprovedOutbound'
    },
    {
        id: 'SEC-03',
        title: 'Entra ID Authentication Only (No Local Keys)',
        category: 'Identity & Access',
        description: 'Disable local API keys on Azure OpenAI and AI Search to enforce RBAC and token rotation.',
        remediation: 'Enable Disable Local Authentication to block shared API keys and enforce Microsoft Entra ID RBAC tokens.',
        severity: 'critical',
        evaluate: (config) => config.disableLocalAuth === true
    },
    {
        id: 'SEC-04',
        title: 'User-Assigned Managed Identity',
        category: 'Identity & Access',
        description: 'Use User-Assigned Managed Identity (UAMI) rather than System-Assigned for cross-resource RBAC.',
        remediation: 'Switch Managed Identity Architecture to User-Assigned (UAMI) for deterministic cross-resource RBAC lifecycle management.',
        severity: 'medium',
        evaluate: (config) => config.identityType === 'UserAssigned'
    },
    {
        id: 'SEC-05',
        title: 'Customer-Managed Keys (CMK) Encryption',
        category: 'Data Protection',
        description: 'Regulatory workloads should enforce Key Vault Customer-Managed Key encryption at rest.',
        remediation: 'Enable Customer-Managed Key (CMK) encryption to upgrade Key Vault to Premium (HSM) with purge protection and double encryption.',
        severity: 'medium',
        evaluate: (config) => config.enableCmk === true
    },
    {
        id: 'SEC-06',
        title: 'Diagnostic Logging & Audit Trail',
        category: 'Monitoring',
        description: 'Workspace and inference requests must stream diagnostic telemetry to Application Insights / Log Analytics.',
        remediation: 'Enable Application Insights to provision a workspace-based telemetry sink and Log Analytics audit trail.',
        severity: 'medium',
        evaluate: (config) => config.enableAppInsights === true
    }
];

