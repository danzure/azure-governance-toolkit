import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FeaturedToolCard from './FeaturedToolCard';

describe('FeaturedToolCard Component', () => {
    const mockTool = {
        id: 'azure-resources',
        title: 'Azure Resource Naming Tool',
        description: 'Instantly generate standard-compliant names for 100+ Azure resources.',
        iconUrl: 'https://example.com/icon.svg',
        path: '/resource-naming',
        hasAi: true,
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('exports a valid React functional component', () => {
        expect(typeof FeaturedToolCard).toBe('function');
    });

    it('renders with expected structure, title, description and badges', () => {
        const onNavigate = vi.fn();
        const html = renderToStaticMarkup(React.createElement(FeaturedToolCard, { tool: mockTool, onNavigate }));
        
        expect(html).toContain('Azure Resource Naming Tool');
        expect(html).toContain('Instantly generate standard-compliant names');
        expect(html).toContain('Featured Flagship');
        expect(html).toContain('AI Powered');
        expect(html).toContain('Launch Naming Tool');
        expect(html).not.toContain('Default CAF Baseline:');
    });
});
