import { describe, it, expect } from 'vitest';
import { RESOURCE_DATA_SORTED } from './constants';
import { getServiceIconUrl } from './serviceIcons';

describe('Service Icons & Resource Data Integrity', () => {
    it('ensures every resource in RESOURCE_DATA_SORTED resolves to a valid SVG icon URL', () => {
        expect(RESOURCE_DATA_SORTED.length).toBeGreaterThan(150);

        RESOURCE_DATA_SORTED.forEach((resource) => {
            const url = getServiceIconUrl(resource.name);
            expect(url, `Missing icon for resource "${resource.name}"`).toBeTruthy();
            expect(typeof url).toBe('string');
            expect(url).toMatch(/^https:\/\/.+\.svg$/);
        });
    });

    it('returns null for unmapped / nonexistent service names', () => {
        expect(getServiceIconUrl('Nonexistent Service')).toBeNull();
        expect(getServiceIconUrl('')).toBeNull();
        expect(getServiceIconUrl(undefined)).toBeNull();
    });

    it('enforces exclusive isNew badge rule (strictly 39 newly added services)', () => {
        const newServices = RESOURCE_DATA_SORTED.filter((r) => r.isNew === true);
        expect(newServices).toHaveLength(39);

        const expectedNewNames = [
                  "AI Gateway",
                  "Alert processing rule",
                  "Application Gateway for Containers",
                  "Azure Analysis Services server",
                  "Azure Arc gateway",
                  "Azure Backup Resource Guard",
                  "Azure Cosmos DB for PostgreSQL cluster",
                  "Azure Data Explorer cluster database",
                  "Azure Monitor Private Link Scope",
                  "Azure SQL Elastic Job agent",
                  "Azure Synapse Analytics Spark Pool",
                  "Azure Synapse Analytics private link hub",
                  "Backup Vault policy",
                  "Compute Fleet",
                  "Computer Vision",
                  "Content Safety",
                  "DNS Forwarding Ruleset",
                  "Deployment script",
                  "Document Intelligence",
                  "Event Grid subscription",
                  "Event Hub consumer group",
                  "ExpressRoute direct",
                  "ExpressRoute gateway",
                  "Front Door firewall policy",
                  "Image template",
                  "Log Analytics query pack",
                  "Notification Hubs namespace",
                  "Restore point collection",
                  "Route filter",
                  "Route server",
                  "SSH key",
                  "Service Fabric managed cluster",
                  "Service endpoint policy",
                  "Snapshot",
                  "Translator",
                  "VPN connection",
                  "VPN site",
                  "Virtual machine maintenance configuration",
                  "Virtual network peering"
        ];

        const actualNames = newServices.map((r) => r.name).sort();
        expect(actualNames).toEqual(expectedNewNames.sort());
    });

    it('ensures all resource names in RESOURCE_DATA_SORTED are distinct', () => {
        const names = RESOURCE_DATA_SORTED.map((r) => r.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
    });

    it('validates documentation and pricing URL schema for all services', () => {
        RESOURCE_DATA_SORTED.forEach((resource) => {
            expect(resource.name).toBeTruthy();
            expect(resource.category).toBeTruthy();
            expect(resource.abbrev).toBeTruthy();
            expect(resource.desc).toBeTruthy();
            expect(resource.longDesc).toBeTruthy();
            expect(resource.learnUrl).toMatch(/^https:\/\/learn\.microsoft\.com/);
            if (resource.pricingUrl) {
                expect(resource.pricingUrl).toMatch(/^https:\/\/azure\.microsoft\.com/);
            }
        });
    });
});
