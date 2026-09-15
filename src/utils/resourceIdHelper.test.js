import { describe, it, expect } from 'vitest';
import { toResourceId } from './resourceIdHelper';

describe('toResourceId', () => {
    it('sanitizes standard names with spaces', () => {
        expect(toResourceId('Virtual Machine')).toBe('az-resource-virtual-machine');
    });

    it('sanitizes names with parentheses and slashes', () => {
        expect(toResourceId('Kubernetes Services (AKS)')).toBe('az-resource-kubernetes-services-aks');
        expect(toResourceId('Azure OpenAI / AI Foundry')).toBe('az-resource-azure-openai-ai-foundry');
    });

    it('handles special characters and trim hyphens', () => {
        expect(toResourceId('  Key Vault - Premium!  ')).toBe('az-resource-key-vault-premium');
    });

    it('handles empty or null gracefully', () => {
        expect(toResourceId('')).toBe('az-resource-unknown');
        expect(toResourceId(null)).toBe('az-resource-unknown');
    });
});
