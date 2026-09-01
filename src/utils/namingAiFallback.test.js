import { describe, it, expect } from 'vitest';
import { generateResourceNameFallback } from './namingAiFallback';

describe('Resource Naming AI Fallback', () => {
    it('throws error when prompt is missing', () => {
        expect(() => generateResourceNameFallback('')).toThrow('Prompt is required');
        expect(() => generateResourceNameFallback(null)).toThrow('Prompt is required');
    });

    it('correctly resolves RAG / OpenAI architecture preset', () => {
        const result = generateResourceNameFallback('Secure Enterprise RAG pattern with OpenAI and AI Search in UK South');
        expect(result.workload).toBe('genai');
        expect(result.regionValue).toBe('uksouth');
        expect(result.envValue).toBe('prod');
        expect(result.searchTerm).toContain('Azure AI Search');
        expect(result.searchTerm).toContain('Storage account');
    });

    it('correctly resolves IoT & Stream Analytics architecture preset', () => {
        const result = generateResourceNameFallback('Real-time IoT data pipeline using Event Hubs and Stream Analytics in East US 2');
        expect(result.workload).toBe('iot');
        expect(result.regionValue).toBe('eastus2');
        expect(result.searchTerm).toContain('Event Hub');
        expect(result.searchTerm).toContain('Stream Analytics Job');
    });

    it('correctly resolves AKS microservices preset with West Europe region', () => {
        const result = generateResourceNameFallback('Mission-critical AKS microservices with geo-replication in West Europe');
        expect(result.workload).toBe('microservices');
        expect(result.regionValue).toBe('westeurope');
        expect(result.searchTerm).toContain('Kubernetes (AKS)');
        expect(result.searchTerm).toContain('Container registry');
    });

    it('correctly resolves Zero-trust Hub & Spoke networking preset', () => {
        const result = generateResourceNameFallback('Zero-trust Hub and Spoke networking topology with Azure Firewall');
        expect(result.workload).toBe('corenet');
        expect(result.searchTerm).toContain('Virtual network');
        expect(result.searchTerm).toContain('Azure Firewall');
        expect(result.searchTerm).toContain('Bastion host');
    });

    it('correctly extracts dev environment and custom organization prefix', () => {
        const result = generateResourceNameFallback('Dev environment for Contoso with PostgreSQL and App Service');
        expect(result.envValue).toBe('dev');
        expect(result.orgPrefix).toBe('contos');
        expect(result.searchTerm).toContain('App Service');
        expect(result.searchTerm).toContain('PostgreSQL server');
    });

    it('correctly extracts instance numbers', () => {
        const result = generateResourceNameFallback('Production AKS cluster instance 002 in Sweden Central');
        expect(result.instance).toBe('002');
        expect(result.regionValue).toBe('swedencentral');
    });

    it('handles generic prompt with dynamic catalog matching', () => {
        const result = generateResourceNameFallback('Deploy a Cosmos DB and Key Vault for finance in Australia East');
        expect(result.regionValue).toBe('australiaeast');
        expect(result.searchTerm).toContain('Cosmos DB');
        expect(result.searchTerm).toContain('Key vault');
    });
});
