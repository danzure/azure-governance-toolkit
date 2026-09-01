import { describe, it, expect } from 'vitest';
import rbacCatalog from '../../api/src/data/azureRbacCatalog.json';
import { COMMON_RBAC_PROVIDERS, RBAC_ROLE_TEMPLATES } from '../data/rbacData';
import { generateRbacRoleFallback } from './rbacAiFallback';

describe('RBAC AI Grounding & Fallback Engine', () => {
    describe('Data Integrity & Grounding', () => {
        it('ensures azureRbacCatalog.json matches COMMON_RBAC_PROVIDERS', () => {
            expect(rbacCatalog.providers).toHaveLength(COMMON_RBAC_PROVIDERS.length);
            
            const catalogProviderNames = new Set(rbacCatalog.providers.map(p => p.provider));
            COMMON_RBAC_PROVIDERS.forEach((p) => {
                expect(catalogProviderNames.has(p.provider)).toBe(true);
            });
        });

        it('ensures azureRbacCatalog.json matches RBAC_ROLE_TEMPLATES', () => {
            expect(rbacCatalog.templates).toHaveLength(RBAC_ROLE_TEMPLATES.length);
            
            const catalogTemplateIds = new Set(rbacCatalog.templates.map(t => t.id));
            RBAC_ROLE_TEMPLATES.forEach((t) => {
                expect(catalogTemplateIds.has(t.id)).toBe(true);
            });
        });
    });

    describe('Smart Heuristic Fallback Engine', () => {
        it('handles App Service operator prompt with delete and secret restrictions', () => {
            const prompt = 'Junior App Service Operator who can restart web apps and functions in staging, but cannot delete or read secrets';
            const result = generateRbacRoleFallback(prompt);

            expect(result.roleName).toContain('App Service');
            expect(result.actions).toContain('Microsoft.Web/sites/read');
            expect(result.actions).toContain('Microsoft.Web/sites/restart/action');
            expect(result.notActions).toContain('Microsoft.Web/sites/delete');
            expect(result.notActions).toContain('Microsoft.Web/sites/config/list/action');
            expect(result.explanation).toBeTruthy();
        });

        it('handles Key Vault secret officer prompt with purge restrictions', () => {
            const prompt = 'Key Vault Secrets Officer who can read and write secrets, but cannot delete key vaults or purge';
            const result = generateRbacRoleFallback(prompt);

            expect(result.roleName).toContain('Key Vault');
            expect(result.actions).toContain('Microsoft.KeyVault/vaults/read');
            expect(result.actions).toContain('Microsoft.KeyVault/vaults/secrets/read');
            expect(result.actions).toContain('Microsoft.KeyVault/vaults/secrets/write');
            expect(result.notActions).toContain('Microsoft.KeyVault/vaults/delete');
            expect(result.notActions).toContain('Microsoft.KeyVault/vaults/purge/action');
        });

        it('handles AKS container developer prompt without cluster deletion rights', () => {
            const prompt = 'AKS developer who can deploy container apps and pull from container registry, no delete';
            const result = generateRbacRoleFallback(prompt);

            expect(result.roleName).toContain('Container');
            expect(result.actions).toContain('Microsoft.ContainerService/managedClusters/read');
            expect(result.actions).toContain('Microsoft.App/containerApps/read');
            expect(result.actions).toContain('Microsoft.ContainerRegistry/registries/pull/action');
            expect(result.notActions).toContain('Microsoft.ContainerService/managedClusters/delete');
        });

        it('handles Network Security administrator prompt', () => {
            const prompt = 'Network security engineer managing NSGs and route tables, no delete';
            const result = generateRbacRoleFallback(prompt);

            expect(result.roleName).toContain('Network');
            expect(result.actions).toContain('Microsoft.Network/networkSecurityGroups/read');
            expect(result.actions).toContain('Microsoft.Network/networkSecurityGroups/write');
            expect(result.actions).toContain('Microsoft.Network/routeTables/read');
            expect(result.notActions).toContain('Microsoft.Network/networkSecurityGroups/delete');
        });

        it('handles Azure AI & OpenAI engineer prompt', () => {
            const prompt = 'AI solutions engineer managing OpenAI models and search queries, no delete';
            const result = generateRbacRoleFallback(prompt);

            expect(result.roleName).toContain('AI');
            expect(result.actions).toContain('Microsoft.CognitiveServices/accounts/OpenAI/read');
            expect(result.actions).toContain('Microsoft.CognitiveServices/accounts/OpenAI/write');
            expect(result.actions).toContain('Microsoft.Search/searchServices/read');
            expect(result.notActions).toContain('Microsoft.CognitiveServices/accounts/delete');
        });

        it('handles FinOps billing reader prompt', () => {
            const prompt = 'FinOps team member who needs to view cost analysis and consumption budgets';
            const result = generateRbacRoleFallback(prompt);

            expect(result.roleName).toContain('FinOps');
            expect(result.actions).toContain('Microsoft.CostManagement/exports/read');
            expect(result.actions).toContain('Microsoft.Consumption/budgets/read');
            expect(result.actions).toContain('*/read');
        });

        it('extracts explicit assignable scope from prompt when specified', () => {
            const prompt = 'Storage operator for /providers/Microsoft.Management/managementGroups/corp-mg';
            const result = generateRbacRoleFallback(prompt);

            expect(result.assignableScopes).toBe('/providers/Microsoft.Management/managementGroups/corp-mg');
            expect(result.actions).toContain('Microsoft.Storage/storageAccounts/read');
        });

        it('extracts root scope when root/tenant is mentioned', () => {
            const prompt = 'Auditor role for root tenant level';
            const result = generateRbacRoleFallback(prompt);

            expect(result.assignableScopes).toBe('/');
        });

        it('enforces IAM restriction when no role assignment is mentioned', () => {
            const prompt = 'Virtual machine restart operator, no iam no role assignments';
            const result = generateRbacRoleFallback(prompt);

            expect(result.notActions).toContain('Microsoft.Authorization/roleAssignments/*');
            expect(result.actions).toContain('Microsoft.Compute/virtualMachines/restart/action');
        });

        it('matches template directly when template title is requested', () => {
            const prompt = 'Managed Identity Operator';
            const result = generateRbacRoleFallback(prompt);

            expect(result.roleName).toBe('Managed Identity Operator');
            expect(result.actions).toContain('Microsoft.ManagedIdentity/userAssignedIdentities/read');
            expect(result.actions).toContain('Microsoft.ManagedIdentity/userAssignedIdentities/assign/action');
            expect(result.notActions).toContain('Microsoft.ManagedIdentity/userAssignedIdentities/delete');
        });
    });
});
