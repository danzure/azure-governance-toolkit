
/**
 * Generates a bundle of related resources based on the selected topology.
 * 
 * This function takes a primary resource and a topology type, and returns an array
 * of related resources that should be deployed together. This simplifies the process
 * of naming multiple dependent resources (e.g., VNet + Subnets, SQL Server + Database).
 * 
 * @param {Object} resource - The main resource object from constants.js
 * @param {string} topology - The selected topology ('single', 'hub-spoke', 'bundle')
 * @param {Object} spokeOptions - Optional spoke configuration for VNet topology
 * @param {number} spokeOptions.spokeCount - Number of spokes to generate
 * @param {number} spokeOptions.spokeStartValue - Starting number for spoke numbering
 * @returns {Array|null} - An array of resource objects representing the bundle, or null if no bundle applies.
 */
export function getBundleResources(resource, topology, spokeOptions = {}) {
    if (resource.name === 'Virtual network' && topology === 'hub-spoke') {
        const hub = { ...resource, abbrev: 'vnet-hub', name: 'Hub VNet' };
        const { spokeCount = 0, spokeStartValue = 1 } = spokeOptions;

        const spokes = [];
        for (let i = 0; i < spokeCount; i++) {
            const num = spokeStartValue + i;
            const padded = String(num).padStart(3, '0');
            spokes.push({
                ...resource,
                abbrev: 'vnet-spoke',
                name: `Spoke ${padded}`,
                instanceOverride: padded
            });
        }

        return [hub, ...spokes];
    }

    if (resource.name === 'Host Pool' && topology === 'bundle') {
        // AVD Bundle: Pool, Workspace, App Group, Scaling Plan
        return [
            { ...resource, name: 'Host Pool' }, // vdpool (original)
            { ...resource, abbrev: 'vdws', name: 'Workspace', category: 'Desktop Virtualization' },
            { ...resource, abbrev: 'vdag', name: 'App Group', category: 'Desktop Virtualization' },
            { ...resource, abbrev: 'vdscaling', name: 'Scaling Plan', category: 'Desktop Virtualization' }
        ];
    }

    if (resource.name === 'Kubernetes (AKS)' && topology === 'bundle') {
        // AKS Bundle logic:
        // 1. AKS Cluster (primary)
        // 2. Container Registry (acr) - Required for storing container images
        // 3. Managed Identity (id) - Required for secure cluster identity

        // Note: Container Registry has strict naming rules (no hyphens).
        // We override the 'abbrev' to 'cr' to match the resource definition.

        return [
            { ...resource, name: 'AKS Cluster' }, // aks (original)
            {
                ...resource,
                abbrev: 'cr',
                name: 'Container Registry',
                chars: 'a-z, 0-9',
                maxLength: 50,
                // Registry needs to be global scope usually, or at least unique.
                // We'll mimic the "Container registry" resource definition.
            },
            {
                ...resource,
                abbrev: 'id',
                name: 'Managed Identity',
                chars: 'a-z, A-Z, 0-9, -, _',
                maxLength: 128
            }
        ];
    }

    if (resource.name === 'SQL server' && topology === 'bundle') {
        // SQL Bundle logic:
        // 1. SQL Server (primary) - The logical server container
        // 2. SQL Database (sqldb) - The actual database instance
        //    Scope is set to 'Server' to imply it lives within the SQL Server.
        return [
            { ...resource, name: 'SQL Server' }, // sql (original)
            {
                ...resource,
                abbrev: 'sqldb',
                name: 'SQL Database',
                chars: 'a-z, A-Z, 0-9, -, _, .',
                maxLength: 128,
                scope: 'Server'
            }
        ];
    }

    if (resource.name === 'App Service' && topology === 'bundle') {
        // Web App Bundle logic:
        // 1. App Service (primary) - The web application itself
        // 2. App Service Plan (asp) - The compute backing the app
        // 3. Application Insights (appi) - Monitoring and telemetry
        return [
            { ...resource, name: 'App Service' }, // app (original)
            {
                ...resource,
                abbrev: 'asp',
                name: 'App Service Plan',
                chars: 'a-z, A-Z, 0-9, -',
                maxLength: 40,
                scope: 'Resource group'
            },
            {
                ...resource,
                abbrev: 'appi',
                name: 'Application Insights',
                chars: 'a-z, A-Z, 0-9, -, _, .',
                maxLength: 260,
                scope: 'Resource group'
            }
        ];
    }

    if (resource.name === 'Machine Learning workspace' && topology === 'bundle') {
        // ML Workspace Bundle: The four resources Azure ML auto-provisions on deployment.
        // Storage Account — binary/model artifact storage (no hyphens, 24-char max, lowercase only)
        // Key Vault       — secrets and CMK management (24-char max, global scope)
        // Application Insights — telemetry and training run monitoring
        // Container Registry   — Docker image cache for training environments (no hyphens, alphanumeric only)
        return [
            { ...resource, name: 'ML Workspace' }, // mlw (original)
            {
                ...resource,
                abbrev: 'st',
                name: 'Storage Account',
                chars: 'a-z, 0-9',
                maxLength: 24,
                scope: 'Global',
            },
            {
                ...resource,
                abbrev: 'kv',
                name: 'Key Vault',
                chars: 'a-z, A-Z, 0-9, -',
                maxLength: 24,
                scope: 'Global',
            },
            {
                ...resource,
                abbrev: 'appi',
                name: 'Application Insights',
                chars: 'a-z, A-Z, 0-9, -, _, .',
                maxLength: 260,
                scope: 'Resource group',
            },
            {
                ...resource,
                abbrev: 'cr',
                name: 'Container Registry',
                chars: 'a-z, 0-9',
                maxLength: 50,
                scope: 'Global',
            },
        ];
    }

    if (resource.name === 'Function app' && topology === 'bundle') {
        return [
            { ...resource, name: 'Function App' },
            {
                ...resource,
                abbrev: 'asp',
                name: 'App Service Plan',
                chars: 'a-z, A-Z, 0-9, -',
                maxLength: 40,
                scope: 'Resource group'
            },
            {
                ...resource,
                abbrev: 'st',
                name: 'Storage Account',
                chars: 'a-z, 0-9',
                maxLength: 24,
                scope: 'Global'
            },
            {
                ...resource,
                abbrev: 'appi',
                name: 'Application Insights',
                chars: 'a-z, A-Z, 0-9, -, _, .',
                maxLength: 260,
                scope: 'Resource group'
            }
        ];
    }

    if (resource.name === 'Logic App' && topology === 'bundle') {
        return [
            { ...resource, name: 'Logic App' },
            {
                ...resource,
                abbrev: 'asp',
                name: 'App Service Plan',
                chars: 'a-z, A-Z, 0-9, -',
                maxLength: 40,
                scope: 'Resource group'
            },
            {
                ...resource,
                abbrev: 'st',
                name: 'Storage Account',
                chars: 'a-z, 0-9',
                maxLength: 24,
                scope: 'Global'
            }
        ];
    }

    if (resource.name === 'API Management' && topology === 'bundle') {
        return [
            { ...resource, name: 'API Management' },
            {
                ...resource,
                abbrev: 'appi',
                name: 'Application Insights',
                chars: 'a-z, A-Z, 0-9, -, _, .',
                maxLength: 260,
                scope: 'Resource group'
            },
            {
                ...resource,
                abbrev: 'log',
                name: 'Log Analytics Workspace',
                chars: 'a-z, A-Z, 0-9, -',
                maxLength: 63,
                scope: 'Global'
            }
        ];
    }

    if (resource.name === 'Application Gateway' && topology === 'bundle') {
        return [
            { ...resource, name: 'Application Gateway' },
            {
                ...resource,
                abbrev: 'pip',
                name: 'Public IP',
                chars: 'a-z, A-Z, 0-9, -, _, .',
                maxLength: 80,
                scope: 'Resource group'
            },
            {
                ...resource,
                abbrev: 'agwwaf',
                name: 'WAF Policy',
                chars: 'a-z, A-Z, 0-9, -, _',
                maxLength: 128,
                scope: 'Resource group'
            }
        ];
    }

    if (resource.name === 'Container App' && topology === 'bundle') {
        return [
            { ...resource, name: 'Container App' },
            {
                ...resource,
                abbrev: 'cae',
                name: 'Container Apps Environment',
                chars: 'a-z, A-Z, 0-9, -',
                maxLength: 60,
                scope: 'Resource group'
            },
            {
                ...resource,
                abbrev: 'log',
                name: 'Log Analytics Workspace',
                chars: 'a-z, A-Z, 0-9, -',
                maxLength: 63,
                scope: 'Global'
            }
        ];
    }

    // Default: Single resource (no bundle)
    return null;
}
