import { describe, it, expect } from 'vitest';
import { generateBicepTemplate } from './bicepGenerator';
import { generateTerraformTemplate } from './terraformGenerator';
import { validateSecurity } from './securityValidator';
import { buildTopologyAndBOM } from './topologyBuilder';
import { getFoundryResourceNames } from './foundryNaming';
import { DEFAULT_CONFIG } from '../data/defaultServices';
import { ARCHETYPE_PRESETS, matchArchetype } from '../data/archetypes';
import { generateAiFoundryFallback } from './foundryAiFallback';

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
        expect(bicep).toContain('resource hubAiServiceConnection');
        expect(bicep).toContain('resource hubAiSearchConnection');
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
        expect(tf).toContain('resource "azapi_resource" "hub_openai_connection"');
        expect(tf).toContain('resource "azapi_resource" "hub_search_connection"');
        expect(tf).toContain('name      = "conn-openai-default"');
        expect(tf).toContain('name      = "conn-search-default"');
    });

    it('validates security controls correctly', () => {
        const results = validateSecurity(DEFAULT_CONFIG);
        expect(results.length).toBeGreaterThanOrEqual(6);
        const sec1 = results.find(r => r.id === 'SEC-01');
        expect(sec1.passed).toBe(true);
    });

    it('flags public network access and non-restricted managed VNet modes in security audit', () => {
        const publicConfig = { ...DEFAULT_CONFIG, networkMode: 'public', managedVnetMode: 'Disabled' };
        const publicResults = validateSecurity(publicConfig);
        const publicSec1 = publicResults.find(r => r.id === 'SEC-01');
        const publicSec2 = publicResults.find(r => r.id === 'SEC-02');
        expect(publicSec1.passed).toBe(false);
        expect(publicSec1.status).toBe('warning');
        expect(publicSec2.passed).toBe(false);
        expect(publicSec2.status).toBe('warning');

        const openOutboundConfig = { ...DEFAULT_CONFIG, networkMode: 'private', managedVnetMode: 'AllowInternetOutbound' };
        const openOutboundResults = validateSecurity(openOutboundConfig);
        const openSec2 = openOutboundResults.find(r => r.id === 'SEC-02');
        expect(openSec2.passed).toBe(false);

        const strictResults = validateSecurity({ ...DEFAULT_CONFIG, networkMode: 'private', managedVnetMode: 'AllowOnlyApprovedOutbound' });
        const strictSec2 = strictResults.find(r => r.id === 'SEC-02');
        expect(strictSec2.passed).toBe(true);

        strictResults.forEach(rule => {
            expect(typeof rule.remediation).toBe('string');
            expect(rule.remediation.trim().length).toBeGreaterThan(0);
        });
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

    it('matches built-in archetypes and detects custom configuration drift', () => {
        expect(matchArchetype(DEFAULT_CONFIG)).toBe('enterprise-rag');

        ARCHETYPE_PRESETS.forEach(preset => {
            expect(matchArchetype(preset.config)).toBe(preset.id);
        });

        const modifiedConfig = { ...DEFAULT_CONFIG, workload: 'customai' };
        expect(matchArchetype(modifiedConfig)).toBe('custom');
    });
});


describe('generateAiFoundryFallback (Heuristic NLP Parser)', () => {
    it('parses regulated banking prompt with West Europe, CMK, and Private Link', () => {
        const result = generateAiFoundryFallback(
            'Regulated banking AML RAG landing zone in West Europe with CMK encryption'
        );
        expect(result.config.workload).toBe('bankai');
        expect(result.config.region).toBe('westeurope');
        expect(result.config.enableCmk).toBe(true);
        expect(result.config.networkMode).toBe('private');
        expect(result.config.managedVnetMode).toBe('AllowOnlyApprovedOutbound');
        expect(result.config.disableLocalAuth).toBe(true);
        expect(result.hubName).toMatch(/^hub-bankai-.*-weu-/);
        expect(result.rgName).toMatch(/^rg-bankai-.*-weu-/);
        expect(result.explanation).toContain(result.hubName);
    });

    it('parses multi-agent architecture with Sweden Central and ACR', () => {
        const result = generateAiFoundryFallback(
            'Multi-agent orchestration hub in Sweden Central with Container Registry'
        );
        expect(result.config.region).toBe('swedencentral');
        expect(result.config.enableContainerRegistry).toBe(true);
        expect(result.config.networkMode).toBe('private');
        expect(result.summary.toLowerCase()).toContain('agent');
    });

    it('parses fast-track dev sandbox with public endpoint mode', () => {
        const result = generateAiFoundryFallback(
            'Fast-track dev sandbox for quick PoC with public endpoint access'
        );
        expect(result.config.environment).toBe('dev');
        expect(result.config.networkMode).toBe('public');
        expect(result.config.managedVnetMode).toBe('Disabled');
        expect(result.summary.toLowerCase()).toContain('sandbox');
    });

    it('extracts explicit model deployment overrides cleanly', () => {
        const result = generateAiFoundryFallback(
            'Enterprise RAG with gpt-4o-mini and o3-mini deployments'
        );
        expect(result.config.enableOpenAi).toBe(true);
        expect(result.config.modelDeployments.map((m) => m.model)).toEqual([
            'gpt-4o-mini',
            'o3-mini'
        ]);
    });

    it('throws when prompt is empty or whitespace', () => {
        expect(() => generateAiFoundryFallback('')).toThrow();
        expect(() => generateAiFoundryFallback('   ')).toThrow();
    });
});
