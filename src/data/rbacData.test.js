import { describe, it, expect } from 'vitest';
import { COMMON_RBAC_PROVIDERS, RBAC_ROLE_TEMPLATES } from './rbacData';

describe('RBAC Data Integrity', () => {
    it('contains valid and sorted common RBAC resource providers', () => {
        expect(COMMON_RBAC_PROVIDERS.length).toBeGreaterThanOrEqual(30);
        
        const providerNames = COMMON_RBAC_PROVIDERS.map(p => p.provider);
        const uniqueProviderNames = new Set(providerNames);
        expect(uniqueProviderNames.size).toBe(providerNames.length);

        // Verify sorted alphabetically
        const sortedNames = [...providerNames].sort((a, b) => a.localeCompare(b));
        expect(providerNames).toEqual(sortedNames);
    });

    it('ensures every provider has non-empty valid operations with no duplicates', () => {
        COMMON_RBAC_PROVIDERS.forEach((item) => {
            expect(item.provider).toMatch(/^Microsoft\.[A-Za-z0-9]+/);
            expect(Array.isArray(item.operations)).toBe(true);
            expect(item.operations.length).toBeGreaterThan(0);

            // Check for duplicate operations within a provider
            const uniqueOps = new Set(item.operations);
            expect(uniqueOps.size).toBe(item.operations.length);

            // Check operation naming convention
            item.operations.forEach((op) => {
                expect(typeof op).toBe('string');
                expect(op.trim()).toBe(op);
                expect(op.startsWith(item.provider) || op.startsWith('*')).toBe(true);
            });
        });
    });

    it('ensures all role templates have valid schema and distinct IDs', () => {
        expect(RBAC_ROLE_TEMPLATES.length).toBeGreaterThanOrEqual(10);
        
        const ids = RBAC_ROLE_TEMPLATES.map(t => t.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);

        RBAC_ROLE_TEMPLATES.forEach((tmpl) => {
            expect(tmpl.id).toBeTruthy();
            expect(tmpl.name).toBeTruthy();
            expect(tmpl.category).toBeTruthy();
            expect(tmpl.description).toBeTruthy();
            expect(Array.isArray(tmpl.actions)).toBe(true);
            expect(Array.isArray(tmpl.notActions)).toBe(true);
            expect(tmpl.actions.length).toBeGreaterThan(0);
        });
    });
});
