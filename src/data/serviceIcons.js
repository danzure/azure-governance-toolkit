/**
 * Azure Service Icon Mapping
 * 
 * Maps each resource name in the app to its corresponding SVG filename
 * from the benc-uk/icon-collection GitHub repository.
 * 
 * Source: https://github.com/benc-uk/icon-collection/tree/master/azure-icons
 */

const ICON_BASE_URL = 'https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons';
const ICON_BASE_URL_ALT = 'https://raw.githubusercontent.com/MarczakIO/azure-portal-icons/master/icons';

/**
 * Maps resource.name → icon filename (without .svg extension)
 */
const SERVICE_ICON_MAP = {
    // General
    'Resource group':                   'Resource-Groups',
    'Management group':                 'Management-Groups',
    'Subscription':                     'Subscriptions',
    'Policy definition':                'Policy',
    'Policy assignment':                'Policy',

    // Compute
    'Virtual Machine - Windows':        'Virtual-Machine',
    'Virtual Machine - Linux':          'Virtual-Machine',
    'VM scale set':                     'VM-Scale-Sets',
    'Availability set':                 'Availability-Sets',
    'Managed disk':                     'Disks',
    'Disk encryption set':              'Disk-Encryption-Sets',
    'Image':                            'Images',
    'Compute gallery':                  'Shared-Image-Galleries',
    'Proximity placement group':        'Proximity-Placement-Groups',
    'Function app':                     'Function-Apps',
    'Batch account':                    'Batch-Accounts',
    'Azure Spring Apps':                null, // uses ALT source

    // Networking
    'Virtual network':                  'Virtual-Networks',
    'Subnet':                           'Virtual-Networks',
    'Network security group':           'Network-Security-Groups',
    'Application security group':       'Application-Security-Groups',
    'Public IP':                        'Public-IP-Addresses',
    'Public IP prefix':                 'Public-IP-Prefixes',
    'Load balancer':                    'Load-Balancers',
    'Application Gateway':              'Application-Gateways',
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
    'Bastion host':                     null, // uses ALT source
    'Private Link service':             'Private-Link-Service',
    'Network watcher':                  'Network-Watcher',
    'DDoS protection plan':             'DDoS-Protection-Plans',
    'Private endpoint (Storage)':       'Private-Link',
    'Private endpoint (Database)':      'Private-Link',
    'Private endpoint (Services)':      'Private-Link',
    'Application Gateway WAF policy':   'Web-Application-Firewall-Policies(WAF)',

    // Storage
    'Storage account':                  'Storage-Accounts',
    'Static Web App':                   'Static-Apps',
    'Data Lake Storage':                'Data-Lake-Storage-Gen1',
    'Azure Files share':                'Azure-NetApp-Files',
    'NetApp account':                   'Azure-NetApp-Files',
    'NetApp capacity pool':             'Azure-NetApp-Files',
    'NetApp volume':                    'Azure-NetApp-Files',

    // Web
    'App Service plan':                 'App-Service-Plans',
    'App Service':                      'App-Services',

    // Databases
    'SQL server':                       'SQL-Server',
    'SQL database':                     'SQL-Database',
    'SQL elastic pool':                 'SQL-Elastic-Pools',
    'SQL Managed Instance':             'SQL-Managed-Instance',
    'Cosmos DB account':                'Azure-Cosmos-DB',
    'MySQL server':                     'Azure-Database-MySQL-Server',
    'PostgreSQL server':                'Azure-Database-PostgreSQL-Server',
    'Azure Cache for Redis':            'Cache-Redis',

    // Containers
    'Kubernetes (AKS)':                 'Kubernetes-Services',
    'Container registry':               'Container-Registries',
    'Container instance':               'Container-Instances',
    'Container App':                    'Container-Instances',
    'Container Apps Environment':       'Container-Instances',

    // Security & Integration
    'Key vault':                        'Key-Vaults',
    'Key Vault Managed HSMs':           'Key-Vaults',
    'Service Bus namespace':            'Service-Bus',
    'Service Bus queue':                'Service-Bus',
    'Service Bus topic':                'Service-Bus',
    'Event Grid topic':                 'Event-Grid-Topics',
    'Event Grid domain':                'Event-Grid-Domains',
    'Log Analytics workspace':          'Log-Analytics-Workspaces',
    'Application Insights':             'Application-Insights',
    'Machine Learning workspace':       null, // uses ALT source

    // Identity
    'Managed identity (user)':          null, // uses ALT source

    // Integration
    'API Management':                   'API-Management-Services',
    'Event Hub namespace':              'Event-Hubs',
    'Event Hub':                        'Event-Hubs',
    'Logic App':                        'Logic-Apps',
    'SignalR service':                  null, // uses ALT source
    'Notification Hub':                 'Notification-Hubs',
    'Relay':                            'Relays',

    // AI & Cognitive
    'Azure OpenAI':                     null, // uses maskati source
    'Azure AI services':                null, // uses maskati source
    'Azure AI Search':                  'Search-Services',
    'Azure Bot Service':                'Bot-Services',

    // Data & Analytics
    'Data Factory':                     'Data-Factory',
    'Synapse workspace':                'Azure-Synapse-Analytics',
    'Synapse dedicated SQL pool':       'Azure-Synapse-Analytics',
    'Databricks workspace':             null, // uses ALT source
    'Data Explorer cluster':            'Azure-Data-Explorer-Clusters',
    'Stream Analytics Job':             'Stream-Analytics-Jobs',
    // 'Fabric Capacity' — no icon available in either repo
    'Power BI Embedded':                null, // uses ALT source

    // Management & Monitoring
    'Automation account':               'Automation-Accounts',
    'Recovery Services vault':          'Recovery-Services-Vaults',
    'Action group':                     'Alerts',

    // IoT
    'IoT Hub':                          'IoT-Hub',
    'Device Provisioning Service':      'Device-Provisioning-Services',
    'Digital Twins':                    'Digital-Twins',

    // Governance & Management
    'Blueprint':                        'Blueprints',
    'Cost Management export':           'Cost-Management',
    'Template Spec':                    null, // uses ALT source

    // Desktop Virtualization
    'Host Pool':                        'Windows-Virtual-Desktop',
    'Workspace':                        'Workspaces',
    'Application Group':                'Windows-Virtual-Desktop',
    'Scaling Plan':                     'Windows-Virtual-Desktop',

    // DevOps & Labs
    'DevOps organization':              'Azure-DevOps',
    'DevTest Labs':                     'DevTest-Labs',
};

/**
 * Secondary icon map for icons sourced from MarczakIO/azure-portal-icons.
 * These filenames use spaces (URL-encoded when fetched).
 */
const SERVICE_ICON_MAP_ALT = {
    'Azure Spring Apps':                'Azure Spring Cloud',
    'Bastion host':                     'Bastions',
    'Machine Learning workspace':       'Machine Learning',
    'Managed identity (user)':          'Managed Identities',
    'SignalR service':                  'SignalR',
    'Databricks workspace':             'Azure Databricks',
    'Power BI Embedded':                'Power BI Embedded',
    'Template Spec':                    'Templates',
};

/**
 * Tertiary icon map for icons sourced from maskati/azure-icons.
 * These use full path fragments (no encoding needed).
 */
const ICON_BASE_URL_MASKATI = 'https://raw.githubusercontent.com/maskati/azure-icons/main/svg/Microsoft_Azure_ProjectOxford';

const SERVICE_ICON_MAP_MASKATI = {
    'Azure AI Foundry account':         'AIFoundry',
    'Azure AI Foundry hub':             'AIFoundry',
    'Azure AI Foundry project':         'AIFoundryProject',
    'Azure AI services account':        'AIServices',
    'Azure AI services':                'AIServices',
    'Azure OpenAI service':             'OpenAI',
    'Azure OpenAI':                     'OpenAI',
};

/**
 * Returns the full URL for a resource's Azure icon, or null if no mapping exists.
 * Checks the primary benc-uk source first, then MarczakIO, then maskati.
 * @param {string} resourceName - The resource.name from RESOURCE_DATA_RAW
 * @returns {string|null}
 */
export function getServiceIconUrl(resourceName) {
    const primaryFilename = SERVICE_ICON_MAP[resourceName];
    if (primaryFilename) {
        return `${ICON_BASE_URL}/${primaryFilename}.svg`;
    }
    // Check MarczakIO alt source
    const altFilename = SERVICE_ICON_MAP_ALT[resourceName];
    if (altFilename) {
        return `${ICON_BASE_URL_ALT}/${encodeURIComponent(altFilename)}.svg`;
    }
    // Check maskati source (Foundry & AI icons)
    const maskatiFilename = SERVICE_ICON_MAP_MASKATI[resourceName];
    if (maskatiFilename) {
        return `${ICON_BASE_URL_MASKATI}/${maskatiFilename}.svg`;
    }
    return null;
}

/**
 * Returns just the icon filename (without extension) for a given resource.
 * Useful if you want to build your own URL or use local files.
 * @param {string} resourceName
 * @returns {string|null}
 */
export function getServiceIconSlug(resourceName) {
    return SERVICE_ICON_MAP[resourceName] || null;
}
