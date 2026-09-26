/**
 * Static fallback dataset for Azure Service Updates.
 * Sourced from official Microsoft Azure updates feed (https://www.microsoft.com/releasecommunications/api/v2/azure/rss).
 * Used when the client is offline or network fetch fails.
 */
export const AZURE_UPDATES_FALLBACK = [
    {
        id: '573048',
        title: '[In preview] Public Preview: Azure HorizonDB supports PostgreSQL 18',
        displayTitle: 'Azure HorizonDB supports PostgreSQL 18',
        link: 'https://azure.microsoft.com/updates?id=573048',
        description: 'Azure HorizonDB is a fully managed, PostgreSQL-compatible, cloud-native database service designed for scalable, high-performance workloads. Azure HorizonDB, now in public preview, includes PostgreSQL 18 support.',
        pubDate: 'Fri, 25 Sep 2026 18:07:26 Z',
        categories: ['In preview', 'Databases', 'Azure HorizonDB', 'Feature'],
        statusType: 'preview',
        statusLabel: 'Public Preview',
        primaryCategory: 'Databases'
    },
    {
        id: '557117',
        title: 'Retirement: Azure Communication Services (ACS) standalone services will be retired on September 30, 2028',
        displayTitle: 'Azure Communication Services standalone services will be retired on September 30, 2028',
        link: 'https://azure.microsoft.com/updates?id=557117',
        description: 'Microsoft will retire several standalone Azure Communication Services (ACS) offerings on September 30, 2028. After this date, the affected services will no longer be available.',
        pubDate: 'Thu, 24 Sep 2026 17:51:23 Z',
        categories: ['Retirements', 'Mobile', 'Web', 'Azure Communication Services'],
        statusType: 'retirement',
        statusLabel: 'Retirement',
        primaryCategory: 'Web'
    },
    {
        id: '572573',
        title: '[Launched] Generally Available: Instant Access for VM restore points',
        displayTitle: 'Instant Access for VM restore points',
        link: 'https://azure.microsoft.com/updates?id=572573',
        description: 'Instant Access for application-consistent restore points on virtual machines (that have Premium v2 or Ultra disks as data disks) is now generally available. Restorations begin as soon as the snapshot is captured.',
        pubDate: 'Thu, 24 Sep 2026 16:04:16 Z',
        categories: ['Launched', 'Storage', 'Compute', 'Azure Disk Storage', 'Virtual Machines'],
        statusType: 'launched',
        statusLabel: 'Generally Available',
        primaryCategory: 'Storage'
    },
    {
        id: '561262',
        title: '[Launched] Generally Available: Azure Container Apps Sandboxes',
        displayTitle: 'Azure Container Apps Sandboxes',
        link: 'https://azure.microsoft.com/updates?id=561262',
        description: 'Teams building agentic applications, multi-tenant platforms, development environments, and CI/CD systems can now run untrusted code at scale in lightweight Hyper-V isolated sandboxes within seconds.',
        pubDate: 'Wed, 23 Sep 2026 15:42:00 Z',
        categories: ['Launched', 'Containers', 'Azure Container Apps', 'Feature'],
        statusType: 'launched',
        statusLabel: 'Generally Available',
        primaryCategory: 'Containers'
    },
    {
        id: '571904',
        title: '[In preview] Public Preview: Azure Key Vault Managed HSM cross-region backup and restore',
        displayTitle: 'Azure Key Vault Managed HSM cross-region backup and restore',
        link: 'https://azure.microsoft.com/updates?id=571904',
        description: 'Enable automated and on-demand cross-region backups for Azure Key Vault Managed HSM to meet enterprise disaster recovery and regulatory compliance mandates.',
        pubDate: 'Tue, 22 Sep 2026 14:10:00 Z',
        categories: ['In preview', 'Security', 'Azure Key Vault', 'Compliance'],
        statusType: 'preview',
        statusLabel: 'Public Preview',
        primaryCategory: 'Security'
    },
    {
        id: '570881',
        title: '[Launched] Generally Available: Azure Cosmos DB vCore-based vector indexing with DiskANN',
        displayTitle: 'Azure Cosmos DB vCore-based vector indexing with DiskANN',
        link: 'https://azure.microsoft.com/updates?id=570881',
        description: 'DiskANN vector indexing on Azure Cosmos DB allows billions of high-dimensional embeddings to be indexed with fast recall and low memory overhead for generative AI workloads.',
        pubDate: 'Mon, 21 Sep 2026 11:30:00 Z',
        categories: ['Launched', 'Databases', 'AI + Machine Learning', 'Azure Cosmos DB'],
        statusType: 'launched',
        statusLabel: 'Generally Available',
        primaryCategory: 'Databases'
    },
    {
        id: '569302',
        title: 'Retirement: Azure Machine Learning legacy SDK v1 support retirement',
        displayTitle: 'Azure Machine Learning legacy SDK v1 support retirement',
        link: 'https://azure.microsoft.com/updates?id=569302',
        description: 'Azure Machine Learning Python SDK v1 is transitioning to retirement. Users are urged to migrate existing training pipelines and endpoints to Python SDK v2.',
        pubDate: 'Sun, 20 Sep 2026 09:00:00 Z',
        categories: ['Retirements', 'AI + Machine Learning', 'Azure Machine Learning'],
        statusType: 'retirement',
        statusLabel: 'Retirement',
        primaryCategory: 'AI + Machine Learning'
    },
    {
        id: '568119',
        title: '[Security] Important security update: Enhanced TLS 1.3 enforcement on Azure Front Door',
        displayTitle: 'Enhanced TLS 1.3 enforcement on Azure Front Door',
        link: 'https://azure.microsoft.com/updates?id=568119',
        description: 'Azure Front Door now supports mandatory minimum TLS 1.3 enforcement across all custom domains to adhere to Zero Trust and FedRAMP High security baselines.',
        pubDate: 'Fri, 18 Sep 2026 16:20:00 Z',
        categories: ['Security', 'Networking', 'Azure Front Door'],
        statusType: 'security',
        statusLabel: 'Security Update',
        primaryCategory: 'Security'
    }
];
