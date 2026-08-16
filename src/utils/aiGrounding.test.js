import { describe, it, expect } from 'vitest';
import catalog from '../../api/src/data/azureCatalog.json';
import { RESOURCE_DATA_SORTED, AZURE_REGIONS, ENVIRONMENTS } from '../data/constants';

describe('AI Grounding Data Integrity', () => {
    it('contains all canonical Azure resources from constants.js', () => {
        expect(catalog.resources).toHaveLength(RESOURCE_DATA_SORTED.length);
        const catalogNames = new Set(catalog.resources.map((r) => r.name));
        RESOURCE_DATA_SORTED.forEach((res) => {
            expect(catalogNames.has(res.name)).toBe(true);
        });
    });

    it('contains all valid Azure regions', () => {
        const validRegions = AZURE_REGIONS.filter((r) => !r.type && r.value);
        expect(catalog.regions).toHaveLength(validRegions.length);
        const catalogRegionValues = new Set(catalog.regions.map((r) => r.value));
        validRegions.forEach((reg) => {
            expect(catalogRegionValues.has(reg.value)).toBe(true);
        });
    });

    it('contains all 9 CAF standard environments', () => {
        expect(catalog.environments).toHaveLength(ENVIRONMENTS.length);
        const catalogEnvValues = new Set(catalog.environments.map((e) => e.value));
        ENVIRONMENTS.forEach((env) => {
            expect(catalogEnvValues.has(env.value)).toBe(true);
        });
    });

    it('validates canonical resource name resolution', () => {
        const validResourceNames = new Set(catalog.resources.map((r) => r.name.toLowerCase()));
        const testServices = ['App Service', 'SQL database', 'Virtual network', 'Key vault', 'Kubernetes (AKS)', 'Azure AI Search'];
        testServices.forEach((svc) => {
            expect(validResourceNames.has(svc.toLowerCase())).toBe(true);
        });
    });
});
