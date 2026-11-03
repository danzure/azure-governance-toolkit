import { describe, it, expect } from 'vitest';
import { getBundleResources } from './bundleGenerator';

// Base resource factories matching constants.js definitions
const makeVNet = () => ({
    name: 'Virtual network',
    abbrev: 'vnet',
    maxLength: 64,
    scope: 'Resource group',
    chars: 'a-z, A-Z, 0-9, -, _, .',
    category: 'Networking',
});

const makeHostPool = () => ({
    name: 'Host Pool',
    abbrev: 'vdpool',
    maxLength: 64,
    scope: 'Resource group',
    chars: 'a-z, A-Z, 0-9, -, _',
    category: 'Desktop Virtualization',
});

const makeAKS = () => ({
    name: 'Kubernetes (AKS)',
    abbrev: 'aks',
    maxLength: 63,
    scope: 'Resource group',
    chars: 'a-z, A-Z, 0-9, -, _',
    category: 'Containers',
});

const makeSQL = () => ({
    name: 'SQL server',
    abbrev: 'sql',
    maxLength: 63,
    scope: 'Global',
    chars: 'a-z, 0-9, -',
    category: 'Databases',
});

const makeAppService = () => ({
    name: 'App Service',
    abbrev: 'app',
    maxLength: 60,
    scope: 'Global',
    chars: 'a-z, A-Z, 0-9, -',
    category: 'Web',
});

describe('getBundleResources', () => {
    // ─── Single Topology (No Bundle) ────────────────────────────────

    it('returns null for single topology', () => {
        const result = getBundleResources(makeVNet(), 'single');
        expect(result).toBeNull();
    });

    it('returns null for a resource with no bundle support', () => {
        const resource = { name: 'Storage account', abbrev: 'st', category: 'Storage' };
        const result = getBundleResources(resource, 'bundle');
        expect(result).toBeNull();
    });

    // ─── VNet Hub & Spoke ───────────────────────────────────────────

    describe('VNet Hub & Spoke', () => {
        it('returns hub only when spokeCount is 0', () => {
            const result = getBundleResources(makeVNet(), 'hub-spoke', { spokeCount: 0, spokeStartValue: 1 });
            expect(result).toHaveLength(1);
            expect(result[0].abbrev).toBe('vnet-hub');
            expect(result[0].name).toBe('Hub VNet');
        });

        it('returns hub + numbered spokes with zero-padded instance', () => {
            const result = getBundleResources(makeVNet(), 'hub-spoke', { spokeCount: 2, spokeStartValue: 1 });
            expect(result).toHaveLength(3);
            expect(result[0].abbrev).toBe('vnet-hub');
            expect(result[1].abbrev).toBe('vnet-spoke');
            expect(result[1].name).toBe('Spoke 001');
            expect(result[1].instanceOverride).toBe('001');
            expect(result[2].abbrev).toBe('vnet-spoke');
            expect(result[2].name).toBe('Spoke 002');
            expect(result[2].instanceOverride).toBe('002');
        });

        it('starts numbering from spokeStartValue', () => {
            const result = getBundleResources(makeVNet(), 'hub-spoke', { spokeCount: 3, spokeStartValue: 5 });
            expect(result).toHaveLength(4); // hub + 3 spokes
            expect(result[1].name).toBe('Spoke 005');
            expect(result[1].instanceOverride).toBe('005');
            expect(result[2].instanceOverride).toBe('006');
            expect(result[3].instanceOverride).toBe('007');
        });

        it('preserves base resource properties on derived items', () => {
            const resource = makeVNet();
            const result = getBundleResources(resource, 'hub-spoke', { spokeCount: 1, spokeStartValue: 1 });
            expect(result[0].maxLength).toBe(resource.maxLength);
            expect(result[0].chars).toBe(resource.chars);
            expect(result[1].maxLength).toBe(resource.maxLength);
        });

        it('defaults to 0 spokes when options are empty', () => {
            const result = getBundleResources(makeVNet(), 'hub-spoke', {});
            expect(result).toHaveLength(1);
            expect(result[0].abbrev).toBe('vnet-hub');
        });
    });

    // ─── AVD Bundle ─────────────────────────────────────────────────

    describe('AVD (Host Pool) Bundle', () => {
        it('returns 4 AVD resources', () => {
            const result = getBundleResources(makeHostPool(), 'bundle');
            expect(result).toHaveLength(4);
        });

        it('includes Host Pool, Workspace, App Group, and Scaling Plan', () => {
            const result = getBundleResources(makeHostPool(), 'bundle');
            const names = result.map(r => r.name);
            expect(names).toEqual(['Host Pool', 'Workspace', 'App Group', 'Scaling Plan']);
        });

        it('uses correct abbreviations', () => {
            const result = getBundleResources(makeHostPool(), 'bundle');
            const abbrevs = result.map(r => r.abbrev);
            expect(abbrevs).toEqual(['vdpool', 'vdws', 'vdag', 'vdscaling']);
        });

        it('returns null for single topology', () => {
            const result = getBundleResources(makeHostPool(), 'single');
            expect(result).toBeNull();
        });
    });

    // ─── AKS Bundle ─────────────────────────────────────────────────

    describe('AKS Bundle', () => {
        it('returns 3 resources', () => {
            const result = getBundleResources(makeAKS(), 'bundle');
            expect(result).toHaveLength(3);
        });

        it('includes AKS Cluster, Container Registry, and Managed Identity', () => {
            const result = getBundleResources(makeAKS(), 'bundle');
            const names = result.map(r => r.name);
            expect(names).toEqual(['AKS Cluster', 'Container Registry', 'Managed Identity']);
        });

        it('Container Registry has no-hyphen chars', () => {
            const result = getBundleResources(makeAKS(), 'bundle');
            const registry = result.find(r => r.name === 'Container Registry');
            expect(registry.chars).toBe('a-z, 0-9');
            expect(registry.abbrev).toBe('cr');
            expect(registry.maxLength).toBe(50);
        });

        it('Managed Identity has correct properties', () => {
            const result = getBundleResources(makeAKS(), 'bundle');
            const identity = result.find(r => r.name === 'Managed Identity');
            expect(identity.abbrev).toBe('id');
            expect(identity.maxLength).toBe(128);
        });

        it('returns null for single topology', () => {
            const result = getBundleResources(makeAKS(), 'single');
            expect(result).toBeNull();
        });
    });

    // ─── SQL Bundle ─────────────────────────────────────────────────

    describe('SQL Bundle', () => {
        it('returns 2 resources', () => {
            const result = getBundleResources(makeSQL(), 'bundle');
            expect(result).toHaveLength(2);
        });

        it('includes SQL Server and SQL Database', () => {
            const result = getBundleResources(makeSQL(), 'bundle');
            const names = result.map(r => r.name);
            expect(names).toEqual(['SQL Server', 'SQL Database']);
        });

        it('SQL Database has Server scope', () => {
            const result = getBundleResources(makeSQL(), 'bundle');
            const db = result.find(r => r.name === 'SQL Database');
            expect(db.scope).toBe('Server');
            expect(db.abbrev).toBe('sqldb');
        });

        it('returns null for single topology', () => {
            const result = getBundleResources(makeSQL(), 'single');
            expect(result).toBeNull();
        });
    });

    // ─── Web App Bundle ─────────────────────────────────────────────

    describe('Web App Bundle', () => {
        it('returns 3 resources', () => {
            const result = getBundleResources(makeAppService(), 'bundle');
            expect(result).toHaveLength(3);
        });

        it('includes App Service, App Service Plan, and Application Insights', () => {
            const result = getBundleResources(makeAppService(), 'bundle');
            const names = result.map(r => r.name);
            expect(names).toEqual(['App Service', 'App Service Plan', 'Application Insights']);
        });

        it('App Service Plan has correct properties', () => {
            const result = getBundleResources(makeAppService(), 'bundle');
            const plan = result.find(r => r.name === 'App Service Plan');
            expect(plan.abbrev).toBe('asp');
            expect(plan.maxLength).toBe(40);
            expect(plan.scope).toBe('Resource group');
        });

        it('Application Insights has correct properties', () => {
            const result = getBundleResources(makeAppService(), 'bundle');
            const insights = result.find(r => r.name === 'Application Insights');
            expect(insights.abbrev).toBe('appi');
            expect(insights.maxLength).toBe(260);
        });

        it('returns null for single topology', () => {
            const result = getBundleResources(makeAppService(), 'single');
            expect(result).toBeNull();
        });
    });
});
