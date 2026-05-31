import { describe, it, expect } from 'vitest';
import { generateName } from './nameGenerator';

// Default config used across most tests
const defaultConfig = {
    workload: 'web',
    orgPrefix: '',
    regionAbbrev: 'uks',
    instance: '001',
    envValue: 'prod',
    namingOrder: ['Org', 'Resource', 'Workload', 'Environment', 'Region', 'Instance'],
    showOrg: false,
};

// Helper to create a resource object
const makeResource = (overrides = {}) => ({
    name: 'Resource group',
    abbrev: 'rg',
    maxLength: 90,
    scope: 'Subscription',
    chars: 'a-z, A-Z, 0-9, -, _, (), .',
    ...overrides,
});

describe('generateName', () => {
    // ─── Standard Name Generation ───────────────────────────────────

    it('generates a standard hyphenated name', () => {
        const resource = makeResource();
        const result = generateName(resource, defaultConfig);
        expect(result).toBe('rg-web-prod-uks-001');
    });

    it('generates a name without hyphens for resources that disallow them', () => {
        const resource = makeResource({
            name: 'Storage account',
            abbrev: 'st',
            chars: 'a-z, 0-9',  // no hyphens
        });
        const result = generateName(resource, defaultConfig);
        expect(result).toBe('stwebproduks001');
    });

    it('outputs fully lowercase', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, workload: 'MyApp' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-myapp-prod-uks-001');
    });

    // ─── Workload Handling ──────────────────────────────────────────

    it('strips non-alphanumeric characters from workload', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, workload: 'my-app_v2!' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-myappv2-prod-uks-001');
    });

    it('handles empty workload with placeholder', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, workload: '' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-workload-prod-uks-001');
    });

    // ─── Instance Padding ───────────────────────────────────────────

    it('pads instance to 3 digits', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, instance: '1' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-web-prod-uks-001');
    });

    it('pads empty instance to 001', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, instance: '' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-web-prod-uks-001');
    });

    it('keeps 3-digit instance as-is', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, instance: '042' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-web-prod-uks-042');
    });

    // ─── Region Handling ────────────────────────────────────────────

    it('uses provided region abbreviation', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, regionAbbrev: 'eus2' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-web-prod-eus2-001');
    });

    it('defaults region to uks when empty', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, regionAbbrev: '' };
        const result = generateName(resource, config);
        // Falls back to 'uks'
        expect(result).toBe('rg-web-prod-uks-001');
    });

    it('excludes region for Subscription', () => {
        const resource = makeResource({ name: 'Subscription', abbrev: 'sub', chars: 'a-z, A-Z, 0-9, -, .' });
        const result = generateName(resource, defaultConfig);
        expect(result).toBe('sub-web-prod-001');
    });

    it('excludes region for Management group', () => {
        const resource = makeResource({ name: 'Management group', abbrev: 'mg', chars: 'a-z, A-Z, 0-9, -, _, (), .' });
        const result = generateName(resource, defaultConfig);
        expect(result).toBe('mg-web-prod-001');
    });

    // ─── Environment ────────────────────────────────────────────────

    it('uses the provided environment value', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, envValue: 'dev' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-web-dev-uks-001');
    });

    // ─── Org Prefix ─────────────────────────────────────────────────

    it('includes org prefix when showOrg is true and prefix is set', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, showOrg: true, orgPrefix: 'contoso' };
        const result = generateName(resource, config);
        expect(result).toBe('contoso-rg-web-prod-uks-001');
    });

    it('excludes org prefix when showOrg is false', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, showOrg: false, orgPrefix: 'contoso' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-web-prod-uks-001');
    });

    it('excludes org prefix when showOrg is true but prefix is empty', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, showOrg: true, orgPrefix: '' };
        const result = generateName(resource, config);
        expect(result).toBe('rg-web-prod-uks-001');
    });

    it('strips non-alphanumeric from org prefix', () => {
        const resource = makeResource();
        const config = { ...defaultConfig, showOrg: true, orgPrefix: 'My-Org!' };
        const result = generateName(resource, config);
        expect(result).toBe('myorg-rg-web-prod-uks-001');
    });

    // ─── Custom Naming Order ────────────────────────────────────────

    it('respects custom naming order', () => {
        const resource = makeResource();
        const config = {
            ...defaultConfig,
            namingOrder: ['Workload', 'Resource', 'Environment', 'Region', 'Instance', 'Org'],
        };
        const result = generateName(resource, config);
        expect(result).toBe('web-rg-prod-uks-001');
    });

    it('puts instance first when ordered that way', () => {
        const resource = makeResource();
        const config = {
            ...defaultConfig,
            namingOrder: ['Instance', 'Resource', 'Workload', 'Environment', 'Region', 'Org'],
        };
        const result = generateName(resource, config);
        expect(result).toBe('001-rg-web-prod-uks');
    });

    // ─── Sub-resource Suffix ────────────────────────────────────────

    it('appends sub-resource suffix to abbreviation', () => {
        const resource = makeResource({
            name: 'Public IP',
            abbrev: 'pip',
            chars: 'a-z, A-Z, 0-9, -, _, .',
            subResources: [{ suffix: 'vm', label: 'Virtual Machine' }],
        });
        const result = generateName(resource, defaultConfig, 'vm');
        expect(result).toBe('pip-vm-web-prod-uks-001');
    });

    it('does not append suffix when selectedSubResource is null', () => {
        const resource = makeResource({
            name: 'Public IP',
            abbrev: 'pip',
            chars: 'a-z, A-Z, 0-9, -, _, .',
            subResources: [{ suffix: 'vm', label: 'Virtual Machine' }],
        });
        const result = generateName(resource, defaultConfig, null);
        expect(result).toBe('pip-web-prod-uks-001');
    });

    // ─── Windows VM Truncation ──────────────────────────────────────

    it('truncates Windows VM name to fit 15 char limit', () => {
        const resource = makeResource({
            name: 'Virtual Machine - Windows',
            abbrev: 'vmw',
            maxLength: 15,
            chars: 'a-z, A-Z, 0-9, -',
        });
        const result = generateName(resource, defaultConfig);
        // vmw (3) + workload (max 5) + env first char (1) + region (3) + instance (3) = 15
        expect(result).toBe('vmwwebpuks001');
        expect(result.length).toBeLessThanOrEqual(15);
    });

    it('truncates long Windows VM workload', () => {
        const resource = makeResource({
            name: 'Virtual Machine - Windows',
            abbrev: 'vmw',
            maxLength: 15,
            chars: 'a-z, A-Z, 0-9, -',
        });
        const config = { ...defaultConfig, workload: 'longworkloadname' };
        const result = generateName(resource, config);
        expect(result.length).toBeLessThanOrEqual(15);
        expect(result).toMatch(/^vmw/);
    });

    // ─── Subnet & Network Watcher Fixed Names ───────────────────────

    it('returns fixed name for Network watcher', () => {
        const resource = makeResource({
            name: 'Network watcher',
            abbrev: 'nw',
            chars: 'a-z, A-Z, 0-9, -, _, .',
        });
        // With default config (no regionValue), falls back to uksouth
        expect(generateName(resource, defaultConfig)).toBe('NetworkWatcher_uksouth');
        
        // With regionValue provided
        const configWithRegion = { ...defaultConfig, regionValue: 'eastus' };
        expect(generateName(resource, configWithRegion)).toBe('NetworkWatcher_eastus');
    });

    it('returns AzureFirewallSubnet for subnet with afw sub-resource', () => {
        const resource = makeResource({
            name: 'Subnet',
            abbrev: 'snet',
            chars: 'a-z, A-Z, 0-9, -, _, .',
            subResources: [{ suffix: 'afw', label: 'Azure Firewall' }],
        });
        expect(generateName(resource, defaultConfig, 'afw')).toBe('AzureFirewallSubnet');
    });

    it('returns AzureBastionSubnet for subnet with bas sub-resource', () => {
        const resource = makeResource({
            name: 'Subnet',
            abbrev: 'snet',
            chars: 'a-z, A-Z, 0-9, -, _, .',
            subResources: [{ suffix: 'bas', label: 'Bastion Host' }],
        });
        expect(generateName(resource, defaultConfig, 'bas')).toBe('AzureBastionSubnet');
    });

    it('returns GatewaySubnet for subnet with gw sub-resource', () => {
        const resource = makeResource({
            name: 'Subnet',
            abbrev: 'snet',
            chars: 'a-z, A-Z, 0-9, -, _, .',
            subResources: [{ suffix: 'gw', label: 'VPN Gateway' }],
        });
        expect(generateName(resource, defaultConfig, 'gw')).toBe('GatewaySubnet');
    });

    it('returns AzureFirewallManagementSubnet for subnet with afwm sub-resource', () => {
        const resource = makeResource({
            name: 'Subnet',
            abbrev: 'snet',
            chars: 'a-z, A-Z, 0-9, -, _, .',
            subResources: [{ suffix: 'afwm', label: 'Azure Firewall Management' }],
        });
        expect(generateName(resource, defaultConfig, 'afwm')).toBe('AzureFirewallManagementSubnet');
    });

    it('returns RouteServerSubnet for subnet with rs sub-resource', () => {
        const resource = makeResource({
            name: 'Subnet',
            abbrev: 'snet',
            chars: 'a-z, A-Z, 0-9, -, _, .',
            subResources: [{ suffix: 'rs', label: 'Route Server' }],
        });
        expect(generateName(resource, defaultConfig, 'rs')).toBe('RouteServerSubnet');
    });

    it('generates normal name for non-fixed subnet sub-resources', () => {
        const resource = makeResource({
            name: 'Subnet',
            abbrev: 'snet',
            chars: 'a-z, A-Z, 0-9, -, _, .',
            subResources: [{ suffix: 'web', label: 'Web Tier' }],
        });
        const result = generateName(resource, defaultConfig, 'web');
        expect(result).toBe('snet-web-web-prod-uks-001');
    });

    // ─── Edge Cases ─────────────────────────────────────────────────

    it('uses "res" when resource has no abbreviation', () => {
        const resource = makeResource({ abbrev: undefined });
        const result = generateName(resource, defaultConfig);
        expect(result).toBe('res-web-prod-uks-001');
    });

    it('handles resource with no chars field', () => {
        const resource = makeResource({ chars: undefined });
        const result = generateName(resource, defaultConfig);
        // No hyphens since chars is undefined → allowsHyphens is false
        expect(result).toBe('rgwebproduks001');
    });
});
