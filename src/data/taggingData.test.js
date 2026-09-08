import { describe, it, expect } from 'vitest';
import { 
    CAF_STARTER_TAGS, 
    generateTagMarkdown, 
    generateTagJson, 
    generateTagBicep, 
    generateTagTerraform 
} from './taggingData';

describe('taggingData', () => {
    describe('CAF_STARTER_TAGS', () => {
        it('contains standard Cloud Adoption Framework baseline tags', () => {
            expect(CAF_STARTER_TAGS.length).toBeGreaterThanOrEqual(4);
            const tagNames = CAF_STARTER_TAGS.map(t => t.name);
            expect(tagNames).toContain('Environment');
            expect(tagNames).toContain('CostCenter');
            expect(tagNames).toContain('Owner');
        });
    });

    describe('generateTagMarkdown', () => {
        it('handles empty tag list gracefully', () => {
            expect(generateTagMarkdown([])).toBe('No tags defined.');
        });

        it('generates a valid markdown table for defined tags', () => {
            const tags = [
                { id: '1', name: 'Environment', requirement: 'Mandatory', effect: 'Deny', allowedValues: 'prod, dev' }
            ];
            const md = generateTagMarkdown(tags);
            expect(md).toContain('| Tag Name | Requirement | Policy Effect | Allowed Values |');
            expect(md).toContain('| **Environment** | Mandatory | Deny | prod, dev |');
        });
    });

    describe('generateTagJson', () => {
        it('handles empty tag list gracefully', () => {
            const json = JSON.parse(generateTagJson([]));
            expect(json.message).toBe('No tags defined.');
        });

        it('generates Azure policy initiative definition with allowed values', () => {
            const tags = [
                { id: '1', name: 'Environment', requirement: 'Mandatory', effect: 'Deny', allowedValues: 'prod, staging, dev' }
            ];
            const json = JSON.parse(generateTagJson(tags));
            expect(json).toHaveLength(1);
            expect(json[0].properties.displayName).toBe('Require tag and its value: Environment');
            expect(json[0].properties.parameters.tagValues.defaultValue).toEqual(['prod', 'staging', 'dev']);
            expect(json[0].properties.policyRule.then.effect).toBe('deny');
        });

        it('generates Azure policy without allowed values check when empty', () => {
            const tags = [
                { id: '2', name: 'CostCenter', requirement: 'Mandatory', effect: 'Audit', allowedValues: '' }
            ];
            const json = JSON.parse(generateTagJson(tags));
            expect(json).toHaveLength(1);
            expect(json[0].properties.policyRule.if.exists).toBe('false');
            expect(json[0].properties.policyRule.then.effect).toBe('audit');
        });
    });

    describe('generateTagBicep', () => {
        it('handles empty tags', () => {
            expect(generateTagBicep([])).toBe('// No tags defined.');
        });

        it('generates Bicep subscription policy definition', () => {
            const tags = [
                { id: '1', name: 'Environment', requirement: 'Mandatory', effect: 'Deny', allowedValues: 'prod, dev' }
            ];
            const bicep = generateTagBicep(tags);
            expect(bicep).toContain("targetScope = 'subscription'");
            expect(bicep).toContain("resource policy_Environment 'Microsoft.Authorization/policyDefinitions@2021-06-01'");
            expect(bicep).toContain("effect: 'deny'");
            expect(bicep).toContain("'prod'");
        });
    });

    describe('generateTagTerraform', () => {
        it('handles empty tags', () => {
            expect(generateTagTerraform([])).toBe('# No tags defined.');
        });

        it('generates Terraform azurerm_policy_definition resource', () => {
            const tags = [
                { id: '1', name: 'Environment', requirement: 'Mandatory', effect: 'Deny', allowedValues: 'prod, dev' }
            ];
            const tf = generateTagTerraform(tags);
            expect(tf).toContain('resource "azurerm_policy_definition" "require_environment"');
            expect(tf).toContain('display_name = "Require tag and its value: Environment"');
            expect(tf).toContain('effect = "deny"');
        });
    });
});
