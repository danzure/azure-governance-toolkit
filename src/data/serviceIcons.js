/**
 * serviceIcons.js — Azure Service Icon Mapping
 *
 * This file maps every resource name (from RESOURCE_DATA_RAW in constants.js)
 * to an SVG icon URL sourced from one of four community/official repositories.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ICON SOURCE PRIORITY (checked in order by getServiceIconUrl):
 *
 *  1. PRIMARY  — benc-uk/icon-collection          (community-curated Azure icons)
 *  2. ALT      — MarczakIO/azure-portal-icons      (Azure Portal screenshot icons)
 *  3. MASKATI  — maskati/azure-icons               (AI / Foundry specific icons)
 *  4. PLAYER   — Azure-Player/icons-and-symbols    (official Microsoft public icons)
 *
 * When adding a new service:
 *  - Prefer SOURCE 1 (benc-uk) first. Search: https://github.com/benc-uk/icon-collection/tree/master/azure-icons
 *  - If not available, try SOURCE 2 (MarczakIO): https://github.com/MarczakIO/azure-portal-icons/tree/master/icons
 *  - If not available, try SOURCE 4 (Azure-Player): https://github.com/Azure-Player/icons-and-symbols/tree/master/Microsoft/Azure_Public_Service_Icons/Icons
 *  - Set the primary map value to `null` and add the filename to the corresponding alt map.
 *  - Add a comment indicating which source is used, e.g. // → ALT, // → PLAYER
 * ─────────────────────────────────────────────────────────────────────────────
 */


// ─── Base URLs ───────────────────────────────────────────────────────────────

/** Source 1: benc-uk community-curated Azure icon collection */
const ICON_BASE_URL         = 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons';

/** Source 2: MarczakIO Azure Portal icons (filenames with spaces, URL-encoded on use) */
const ICON_BASE_URL_ALT     = 'https://raw.githubusercontent.com/MarczakIO/azure-portal-icons/master/icons';

/** Source 3: maskati Azure icons (AI / Foundry specific SVGs) */
const ICON_BASE_URL_MASKATI = 'https://raw.githubusercontent.com/maskati/azure-icons/main/svg/Microsoft_Azure_ProjectOxford';

/** Source 4: Azure-Player/icons-and-symbols — official Microsoft public service icons */
const ICON_BASE_URL_PLAYER  = 'https://raw.githubusercontent.com/Azure-Player/icons-and-symbols/master/Microsoft/Azure_Public_Service_Icons/Icons';


// ─── Source 1: Primary Map (benc-uk) ─────────────────────────────────────────
//
// Values are filenames WITHOUT the .svg extension.
// A value of `null` means the icon is sourced from an alternate map below.

const SERVICE_ICON_MAP = {

    // ── General / Governance ─────────────────────────────────────────────────
    'Resource group':                   'Resource-Groups',
    'Management group':                 'Management-Groups',
    'Subscription':                     'Subscriptions',
    'Policy definition':                'Policy',
    'Policy assignment':                'Policy',
    'Blueprint':                        'Blueprints',
    'Cost Management export':           'Cost-Management',
    'Template Spec':                    null,               // → ALT

    // ── Compute ──────────────────────────────────────────────────────────────
    'Virtual Machine - Windows':        null,               // → PLAYER (official icon)
    'Virtual Machine - Linux':          null,               // → PLAYER (official icon)
    'VM scale set':                     'VM-Scale-Sets',
    'Availability set':                 'Availability-Sets',
    'Managed disk':                     'Disks',
    'Disk encryption set':              'Disk-Encryption-Sets',
    'Image':                            'Images',
    'Compute gallery':                  'Shared-Image-Galleries',
    'Proximity placement group':        'Proximity-Placement-Groups',
    'Function app':                     'Function-Apps',
    'Batch account':                    null,               // → PLAYER (official icon)
    'Azure Spring Apps':                null,               // → ALT
    'Service Fabric cluster':           'Service-Fabric-Clusters',

    // ── Networking ───────────────────────────────────────────────────────────
    'Virtual network':                  null,               // → PLAYER (official icon)
    'Subnet':                           null,               // → PLAYER (official icon)
    'Network security group':           'Network-Security-Groups',
    'Application security group':       'Application-Security-Groups',
    'Network interface':                'Network-Interfaces',
    'Public IP':                        'Public-IP-Addresses',
    'Public IP prefix':                 'Public-IP-Prefixes',
    'Load balancer':                    'Load-Balancers',
    'Application Gateway':              'Application-Gateways',
    'Application Gateway WAF policy':   'Web-Application-Firewall-Policies(WAF)',
    'Azure Firewall':                   'Firewalls',
    'Firewall policy':                  'Azure-Firewall-Manager',
    'VPN Gateway':                      'Virtual-Network-Gateways',
    'ExpressRoute circuit':             'ExpressRoute-Circuits',
    'Virtual WAN':                      'Virtual-WANs',
    'Virtual hub':                      'Virtual-WANs',
    'NAT Gateway':                      'NAT',
    'Route table':                      'Route-Tables',
    'Traffic Manager':                  'Traffic-Manager-Profiles',
    'Front Door':                       'Front-Doors',
    'Bastion host':                     null,               // → ALT
    'Private Link service':             'Private-Link-Service',
    'Private endpoint (Storage)':       'Private-Link',
    'Private endpoint (Database)':      'Private-Link',
    'Private endpoint (Services)':      'Private-Link',
    'Network watcher':                  'Network-Watcher',
    'DDoS protection plan':             'DDoS-Protection-Plans',
    'DNS private resolver':             null,               // → ALT

    // ── Storage ──────────────────────────────────────────────────────────────
    'Storage account':                  'Storage-Accounts',
    'Static Web App':                   'Static-Apps',
    'Data Lake Storage':                'Data-Lake-Storage-Gen1',
    'Azure Files share':                'Azure-NetApp-Files',
    'NetApp account':                   'Azure-NetApp-Files',
    'NetApp capacity pool':             'Azure-NetApp-Files',
    'NetApp volume':                    'Azure-NetApp-Files',

    // ── Web ──────────────────────────────────────────────────────────────────
    'App Service plan':                 'App-Service-Plans',
    'App Service':                      'App-Services',
    'Static Web App':                   null,               // → PLAYER (official icon)
    'Web PubSub':                       'Web-Environment',
    'App Configuration store':          null,               // → ALT

    // ── Databases ────────────────────────────────────────────────────────────
    'SQL server':                       'SQL-Server',
    'SQL database':                     'SQL-Database',
    'SQL elastic pool':                 'SQL-Elastic-Pools',
    'SQL Managed Instance':             'SQL-Managed-Instance',
    'Cosmos DB account':                'Azure-Cosmos-DB',
    'MySQL server':                     'Azure-Database-MySQL-Server',
    'PostgreSQL server':                'Azure-Database-PostgreSQL-Server',
    'Azure Cache for Redis':            'Cache-Redis',
    'Azure Managed Redis':              'Cache-Redis',

    // ── Containers ───────────────────────────────────────────────────────────
    'Kubernetes (AKS)':                 'Kubernetes-Services',
    'Container registry':               'Container-Registries',
    'Container instance':               'Container-Instances',
    'Container App':                    'Container-Instances',
    'Container Apps Environment':       'Container-Instances',

    // ── Security & Identity ──────────────────────────────────────────────────
    'Key vault':                        'Key-Vaults',
    'Key Vault Managed HSMs':           'Key-Vaults',
    'Managed identity (user)':          null,               // → ALT

    // ── Integration & Messaging ──────────────────────────────────────────────
    'API Management':                   'API-Management-Services',
    'API Center service':               'API-Management-Services',
    'Service Bus namespace':            'Service-Bus',
    'Service Bus queue':                'Service-Bus',
    'Service Bus topic':                'Service-Bus',
    'Event Hub namespace':              'Event-Hubs',
    'Event Hub':                        'Event-Hubs',
    'Event Grid topic':                 'Event-Grid-Topics',
    'Event Grid domain':                'Event-Grid-Domains',
    'Logic App':                        'Logic-Apps',
    'SignalR service':                  null,               // → ALT
    'Notification Hub':                 'Notification-Hubs',
    'Relay':                            'Relays',

    // ── Monitoring & Management ──────────────────────────────────────────────
    'Log Analytics workspace':          'Log-Analytics-Workspaces',
    'Application Insights':             'Application-Insights',
    'Automation account':               'Automation-Accounts',
    'Recovery Services vault':          'Recovery-Services-Vaults',
    'Action group':                     'Alerts',
    'Azure Managed Grafana':            null,               // → PLAYER

    // ── AI & Machine Learning ────────────────────────────────────────────────
    'Azure AI Search':                  'Search-Services',
    'Azure Bot Service':                'Bot-Services',
    'Machine Learning workspace':       null,               // → ALT
    'Azure OpenAI':                     null,               // → MASKATI
    'Azure AI services':                null,               // → MASKATI
    'Azure OpenAI service':             null,               // → MASKATI
    'Azure AI services account':        null,               // → MASKATI
    'Microsoft Foundry resource':       null,               // → MASKATI
    'Microsoft Foundry hub':            null,               // → MASKATI
    'Microsoft Foundry project':        null,               // → MASKATI
    'Foundry IQ':                       null,               // → MASKATI

    // ── Data & Analytics ─────────────────────────────────────────────────────
    'Data Factory':                     'Data-Factory',
    'Synapse workspace':                'Azure-Synapse-Analytics',
    'Synapse dedicated SQL pool':       'Azure-Synapse-Analytics',
    'Databricks workspace':             null,               // → ALT
    'Data Explorer cluster':            'Azure-Data-Explorer-Clusters',
    'Stream Analytics Job':             'Stream-Analytics-Jobs',
    'Power BI Embedded':                null,               // → ALT
    'Microsoft Purview instance':       'Azure-Data-Catalog',

    // ── IoT ──────────────────────────────────────────────────────────────────
    'IoT Hub':                          'IoT-Hub',
    'Device Provisioning Service':      'Device-Provisioning-Services',
    'Digital Twins':                    'Digital-Twins',

    // ── Desktop Virtualization (AVD) ─────────────────────────────────────────
    'Host Pool':                        null,               // → PLAYER (official AVD icon)
    'Workspace':                        null,               // → PLAYER (official AVD icon)
    'Application Group':                null,               // → PLAYER (official AVD icon)
    'Scaling Plan':                     null,               // → PLAYER (official AVD icon)

    // ── DevOps & Developer Tools ─────────────────────────────────────────────
    'DevOps organization':              'Azure-DevOps',
    'DevTest Labs':                     'DevTest-Labs',
    'Managed DevOps Pools':             'Azure-DevOps',
};


// ─── Source 2: ALT Map (MarczakIO/azure-portal-icons) ────────────────────────
//
// Filenames include spaces and are URL-encoded automatically by getServiceIconUrl.
// Used for services not available in the primary benc-uk collection.

const SERVICE_ICON_MAP_ALT = {
    'Azure Spring Apps':                'Azure Spring Cloud',
    'Bastion host':                     'Bastions',
    'Machine Learning workspace':       'Machine Learning',
    'Managed identity (user)':          'Managed Identities',
    'SignalR service':                  'SignalR',
    'Databricks workspace':             'Azure Databricks',
    'Power BI Embedded':                'Power BI Embedded',
    'Template Spec':                    'Templates',
    'App Configuration store':          'App Configuration',
    'DNS private resolver':             'Private DNS zones',
};


// ─── Source 3: MASKATI Map (maskati/azure-icons) ─────────────────────────────
//
// Used for AI Foundry and OpenAI icons not available in other sources.
// Values are partial SVG path fragments appended to ICON_BASE_URL_MASKATI.

const SERVICE_ICON_MAP_MASKATI = {
    'Microsoft Foundry resource':       'AIFoundry',
    'Microsoft Foundry hub':            'AIFoundry',
    'Microsoft Foundry project':        'AIFoundryProject',
    'Foundry IQ':                       'AIFoundry',
    'Azure AI services account':        'AIServices',
    'Azure AI services':                'AIServices',
    'Azure OpenAI service':             'OpenAI',
    'Azure OpenAI':                     'OpenAI',
};


// ─── Source 4: PLAYER Map (Azure-Player/icons-and-symbols) ───────────────────
//
// Official Microsoft public service icons. Used where the above sources lack
// a dedicated icon (e.g. Subnet, Virtual Network, AVD resources).
// Values are category-prefixed paths relative to the PLAYER base URL.

const SERVICE_ICON_MAP_PLAYER = {
    'Virtual Machine - Windows':        'compute/10021-icon-service-Virtual-Machine',
    'Virtual Machine - Linux':          'compute/10021-icon-service-Virtual-Machine',
    'Batch account':                    'compute/10031-icon-service-Batch-Accounts',
    'Static Web App':                   'web/01007-icon-service-Static-Apps',
    'Subnet':                           'networking/02742-icon-service-Subnet',
    'Virtual network':                  'networking/10061-icon-service-Virtual-Networks',
    'Host Pool':                        'other/00327-icon-service-Azure-Virtual-Desktop',
    'Workspace':                        'other/00327-icon-service-Azure-Virtual-Desktop',
    'Application Group':                'other/00327-icon-service-Azure-Virtual-Desktop',
    'Scaling Plan':                     'other/00327-icon-service-Azure-Virtual-Desktop',
    'Azure Managed Grafana':            'other/02905-icon-service-Azure-Managed-Grafana',
};


// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns the full CDN URL for a resource's Azure icon SVG.
 *
 * Resolution order:
 *  1. benc-uk (primary)
 *  2. MarczakIO (ALT)
 *  3. maskati (AI/Foundry)
 *  4. Azure-Player (official Microsoft)
 *
 * @param {string} resourceName - The `name` field from RESOURCE_DATA_RAW
 * @returns {string|null} Full URL to the SVG, or null if no mapping exists
 */
export function getServiceIconUrl(resourceName) {
    // 1. Primary — benc-uk
    const primaryFilename = SERVICE_ICON_MAP[resourceName];
    if (primaryFilename) {
        return `${ICON_BASE_URL}/${primaryFilename}.svg`;
    }

    // 2. ALT — MarczakIO (filenames contain spaces; encode for URL safety)
    const altFilename = SERVICE_ICON_MAP_ALT[resourceName];
    if (altFilename) {
        return `${ICON_BASE_URL_ALT}/${encodeURIComponent(altFilename)}.svg`;
    }

    // 3. MASKATI — maskati/azure-icons (AI / Foundry icons)
    const maskatiFilename = SERVICE_ICON_MAP_MASKATI[resourceName];
    if (maskatiFilename) {
        return `${ICON_BASE_URL_MASKATI}/${maskatiFilename}.svg`;
    }

    // 4. PLAYER — Azure-Player (official Microsoft public service icons)
    const playerFilename = SERVICE_ICON_MAP_PLAYER[resourceName];
    if (playerFilename) {
        return `${ICON_BASE_URL_PLAYER}/${playerFilename}.svg`;
    }

    return null;
}

/**
 * Returns just the icon filename slug (without .svg extension) from the
 * primary benc-uk source. Returns null for resources using alternate sources.
 *
 * @param {string} resourceName - The `name` field from RESOURCE_DATA_RAW
 * @returns {string|null}
 */
export function getServiceIconSlug(resourceName) {
    return SERVICE_ICON_MAP[resourceName] || null;
}
