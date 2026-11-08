import { describe, it, expect } from 'vitest';
import { generateBicepTemplate } from './bicepGenerator';
import { generateTerraformTemplate } from './terraformGenerator';
import { validateSecurity } from './securityValidator';
import { buildTopologyAndBOM } from './topologyBuilder';
import { getFoundryResourceNames } from './foundryNaming';
import { DEFAULT_CONFIG } from '../data/defaultServices';

describe('AI Foundry Generators and Validators', () => {
    it('generates fully CAF-compliant names matching Resource Naming standard', () => {
        const names = getFoundryResourceNames(DEFAULT_CONFIG);
        expect(names.hubName).toBe('hub-coreai-prod-uks-001');
        expect(names.rgName).toBe('rg-coreai-prod-uks-001');
        expect(names.storageName).toBe('stcoreaiproduks001');
        expect(names.storageName).toMatch(/^[a-z0-9]{3,24}$/); // Alphanumeric only, <= 24 chars
        expect(names.keyVaultName).toBe('kv-coreai-prod-uks-001');
        expect(names.keyVaultName.length).toBeLessThanOrEqual(24);
        expect(names.openAiName).toBe('oai-coreai-prod-uks-001');
        expect(names.searchName).toBe('srch-coreai-prod-uks-001');
        expect(names.logAnalyticsName).toBe('log-coreai-prod-uks-001');
        expect(names.appInsightsName).toBe('appi-coreai-prod-uks-001');
        expect(names.acrName).toBe('crcoreaiproduks001');
        expect(names.uamiName).toBe('id-coreai-prod-uks-001');
        expect(names.projects[0].generatedName).toBe('proj-custai-prod-uks-001');
        expect(names.projects[1].generatedName).toBe('proj-finrag-prod-uks-001');
    });

    it('generates valid Bicep template with Hub and Projects using CAF names', () => {
        const bicep = generateBicepTemplate(DEFAULT_CONFIG);
        expect(bicep).toContain('resource aiHub \'Microsoft.MachineLearningServices/workspaces@2024-07-01-preview\'');
        expect(bicep).toContain('name: \'hub-coreai-prod-uks-001\'');
        expect(bicep).toContain('kind: \'Hub\'');
        expect(bicep).toContain('name: \'proj-custai-prod-uks-001\'');
        expect(bicep).toContain('name: \'stcoreaiproduks001\'');
        expect(bicep).toContain('name: \'kv-coreai-prod-uks-001\'');
        expect(bicep).toContain('name: \'oai-coreai-prod-uks-001\'');
        expect(bicep).toContain('name: \'srch-coreai-prod-uks-001\'');
        expect(bicep).toContain('managedNetwork:');
    });

    it('generates valid Terraform template with Hub and Projects using CAF names', () => {
        const tf = generateTerraformTemplate(DEFAULT_CONFIG);
        expect(tf).toContain('resource "azapi_resource" "ai_hub"');
        expect(tf).toContain('name      = "hub-coreai-prod-uks-001"');
        expect(tf).toContain('kind = "Hub"');
        expect(tf).toContain('name      = "proj-custai-prod-uks-001"');
        expect(tf).toContain('name                     = "stcoreaiproduks001"');
        expect(tf).toContain('name                     = "kv-coreai-prod-uks-001"');
        expect(tf).toContain('name                          = "oai-coreai-prod-uks-001"');
        expect(tf).toContain('name                          = "srch-coreai-prod-uks-001"');
    });

    it('validates security controls correctly', () => {
        const results = validateSecurity(DEFAULT_CONFIG);
        expect(results.length).toBeGreaterThanOrEqual(6);
        const sec1 = results.find(r => r.id === 'SEC-01');
        expect(sec1.passed).toBe(true);
    });

    it('flags public network access as a security warning', () => {
        const insecureConfig = { ...DEFAULT_CONFIG, networkMode: 'public' };
        const results = validateSecurity(insecureConfig);
        const sec1 = results.find(r => r.id === 'SEC-01');
        expect(sec1.passed).toBe(false);
        expect(sec1.status).toBe('warning');
    });

    it('builds topology bill of materials correctly with CAF names', () => {
        const { bom } = buildTopologyAndBOM(DEFAULT_CONFIG);
        const hubItem = bom.find(item => item.category === 'Foundry Hub');
        expect(hubItem).toBeDefined();
        expect(hubItem.name).toBe('hub-coreai-prod-uks-001');

        const projItem = bom.find(item => item.category === 'Foundry Project');
        expect(projItem).toBeDefined();
        expect(projItem.name).toBe('proj-custai-prod-uks-001');

        const stItem = bom.find(item => item.category === 'Storage');
        expect(stItem).toBeDefined();
        expect(stItem.name).toBe('stcoreaiproduks001');

        expect(bom.some(item => item.category === 'Security')).toBe(true);
        expect(bom.some(item => item.category === 'AI Services')).toBe(true);
        expect(bom.some(item => item.category === 'Search & Retrieval')).toBe(true);
    });
});

