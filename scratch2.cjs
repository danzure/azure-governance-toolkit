const fs = require('fs');

const mappings = {
  'Resource group': '', // No pricing
  'Management group': '', // No pricing
  'Subscription': '', // No pricing
  'Policy definition': '', // No pricing
  'Policy assignment': '', // No pricing
  'Virtual Machine - Windows': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-machines',
  'Virtual Machine - Linux': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-machines',
  'VM scale set': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-machine-scale-sets',
  'Availability set': '', // No direct pricing
  'Managed disk': 'https://azure.microsoft.com/pricing/calculator/?service=managed-disks',
  'Disk encryption set': '', 
  'Image': '', 
  'Compute gallery': '', 
  'Proximity placement group': '', 
  'Function app': 'https://azure.microsoft.com/pricing/calculator/?service=functions',
  'Batch account': 'https://azure.microsoft.com/pricing/calculator/?service=batch',
  'Azure Spring Apps': 'https://azure.microsoft.com/pricing/calculator/?service=spring-apps',
  'Virtual network': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-network',
  'Subnet': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-network',
  'Network security group': '', // Free
  'Application security group': '', // Free
  'Public IP': 'https://azure.microsoft.com/pricing/calculator/?service=ip-addresses',
  'Public IP prefix': 'https://azure.microsoft.com/pricing/calculator/?service=ip-addresses',
  'Load balancer': 'https://azure.microsoft.com/pricing/calculator/?service=load-balancer',
  'Application Gateway': 'https://azure.microsoft.com/pricing/calculator/?service=application-gateway',
  'Azure Firewall': 'https://azure.microsoft.com/pricing/calculator/?service=azure-firewall',
  'Firewall policy': '', // Included in Azure Firewall Manager or Firewall
  'VPN Gateway': 'https://azure.microsoft.com/pricing/calculator/?service=vpn-gateway',
  'ExpressRoute circuit': 'https://azure.microsoft.com/pricing/calculator/?service=expressroute',
  'Virtual WAN': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-wan',
  'Virtual hub': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-wan',
  'NAT Gateway': 'https://azure.microsoft.com/pricing/calculator/?service=nat-gateway',
  'Route table': '', // Free
  'Private endpoint (Storage)': 'https://azure.microsoft.com/pricing/calculator/?service=private-link',
  'Private endpoint (Database)': 'https://azure.microsoft.com/pricing/calculator/?service=private-link',
  'Private endpoint (Services)': 'https://azure.microsoft.com/pricing/calculator/?service=private-link',
  'Private Link service': 'https://azure.microsoft.com/pricing/calculator/?service=private-link',
  'Traffic Manager': 'https://azure.microsoft.com/pricing/calculator/?service=traffic-manager',
  'Front Door': 'https://azure.microsoft.com/pricing/calculator/?service=frontdoor',
  'Bastion host': 'https://azure.microsoft.com/pricing/calculator/?service=azure-bastion',
  'Network watcher': 'https://azure.microsoft.com/pricing/calculator/?service=network-watcher',
  'DDoS protection plan': 'https://azure.microsoft.com/pricing/calculator/?service=ddos-protection',
  'Storage account': 'https://azure.microsoft.com/pricing/calculator/?service=storage',
  'Azure Files share': 'https://azure.microsoft.com/pricing/calculator/?service=storage',
  'Data Lake Storage': 'https://azure.microsoft.com/pricing/calculator/?service=storage',
  'NetApp account': 'https://azure.microsoft.com/pricing/calculator/?service=netapp',
  'NetApp capacity pool': 'https://azure.microsoft.com/pricing/calculator/?service=netapp',
  'NetApp volume': 'https://azure.microsoft.com/pricing/calculator/?service=netapp',
  'App Service plan': 'https://azure.microsoft.com/pricing/calculator/?service=app-service',
  'App Service': 'https://azure.microsoft.com/pricing/calculator/?service=app-service',
  'Static Web App': 'https://azure.microsoft.com/pricing/calculator/?service=static-web-apps',
  'API Management': 'https://azure.microsoft.com/pricing/calculator/?service=api-management',
  'SQL server': 'https://azure.microsoft.com/pricing/calculator/?service=sql-database',
  'SQL database': 'https://azure.microsoft.com/pricing/calculator/?service=sql-database',
  'SQL elastic pool': 'https://azure.microsoft.com/pricing/calculator/?service=sql-database',
  'SQL Managed Instance': 'https://azure.microsoft.com/pricing/calculator/?service=sql-managed-instance',
  'Cosmos DB account': 'https://azure.microsoft.com/pricing/calculator/?service=cosmos-db',
  'MySQL server': 'https://azure.microsoft.com/pricing/calculator/?service=mysql',
  'PostgreSQL server': 'https://azure.microsoft.com/pricing/calculator/?service=postgresql',
  'Azure Cache for Redis': 'https://azure.microsoft.com/pricing/calculator/?service=cache',
  'Kubernetes (AKS)': 'https://azure.microsoft.com/pricing/calculator/?service=kubernetes-service',
  'Container registry': 'https://azure.microsoft.com/pricing/calculator/?service=container-registry',
  'Container instance': 'https://azure.microsoft.com/pricing/calculator/?service=container-instances',
  'Container App': 'https://azure.microsoft.com/pricing/calculator/?service=container-apps',
  'Container Apps Environment': 'https://azure.microsoft.com/pricing/calculator/?service=container-apps',
  'Key vault': 'https://azure.microsoft.com/pricing/calculator/?service=key-vault',
  'Managed identity (user)': '', // Free
  'Key Vault Managed HSMs': 'https://azure.microsoft.com/pricing/calculator/?service=key-vault',
  'Application Gateway WAF policy': 'https://azure.microsoft.com/pricing/calculator/?service=web-application-firewall',
  'Service Bus namespace': 'https://azure.microsoft.com/pricing/calculator/?service=service-bus',
  'Service Bus queue': 'https://azure.microsoft.com/pricing/calculator/?service=service-bus',
  'Service Bus topic': 'https://azure.microsoft.com/pricing/calculator/?service=service-bus',
  'Event Grid topic': 'https://azure.microsoft.com/pricing/calculator/?service=event-grid',
  'Event Grid domain': 'https://azure.microsoft.com/pricing/calculator/?service=event-grid',
  'Event Hub namespace': 'https://azure.microsoft.com/pricing/calculator/?service=event-hubs',
  'Event Hub': 'https://azure.microsoft.com/pricing/calculator/?service=event-hubs',
  'Logic App': 'https://azure.microsoft.com/pricing/calculator/?service=logic-apps',
  'Data Factory': 'https://azure.microsoft.com/pricing/calculator/?service=data-factory',
  'SignalR service': 'https://azure.microsoft.com/pricing/calculator/?service=signalr-service',
  'Notification Hub': 'https://azure.microsoft.com/pricing/calculator/?service=notification-hubs',
  'Relay': 'https://azure.microsoft.com/pricing/calculator/?service=service-bus', // Relay
  'Synapse workspace': 'https://azure.microsoft.com/pricing/calculator/?service=synapse-analytics',
  'Synapse dedicated SQL pool': 'https://azure.microsoft.com/pricing/calculator/?service=synapse-analytics',
  'Data Explorer cluster': 'https://azure.microsoft.com/pricing/calculator/?service=data-explorer',
  'Databricks workspace': 'https://azure.microsoft.com/pricing/calculator/?service=databricks',
  'Stream Analytics Job': 'https://azure.microsoft.com/pricing/calculator/?service=stream-analytics',
  'Fabric Capacity': 'https://azure.microsoft.com/pricing/calculator/?service=microsoft-fabric',
  'Power BI Embedded': 'https://azure.microsoft.com/pricing/calculator/?service=power-bi-embedded',
  'Machine Learning workspace': 'https://azure.microsoft.com/pricing/calculator/?service=machine-learning-service',
  'Azure AI services': 'https://azure.microsoft.com/pricing/calculator/?service=cognitive-services',
  'Azure OpenAI': 'https://azure.microsoft.com/pricing/calculator/?service=cognitive-services',
  'Azure AI Search': 'https://azure.microsoft.com/pricing/calculator/?service=search',
  'Azure Bot Service': 'https://azure.microsoft.com/pricing/calculator/?service=bot-service',
  'Log Analytics workspace': 'https://azure.microsoft.com/pricing/calculator/?service=monitor',
  'Application Insights': 'https://azure.microsoft.com/pricing/calculator/?service=monitor',
  'Action group': 'https://azure.microsoft.com/pricing/calculator/?service=monitor',
  'Automation account': 'https://azure.microsoft.com/pricing/calculator/?service=automation',
  'Recovery Services vault': 'https://azure.microsoft.com/pricing/calculator/?service=backup',
  'Blueprint': '',
  'Cost Management export': '',
  'Template Spec': '',
  'IoT Hub': 'https://azure.microsoft.com/pricing/calculator/?service=iot-hub',
  'Device Provisioning Service': 'https://azure.microsoft.com/pricing/calculator/?service=iot-hub',
  'Digital Twins': 'https://azure.microsoft.com/pricing/calculator/?service=digital-twins',
  'Host Pool': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-desktop',
  'Application Group': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-desktop',
  'Workspace': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-desktop',
  'Scaling Plan': 'https://azure.microsoft.com/pricing/calculator/?service=virtual-desktop',
  'DevOps organization': 'https://azure.microsoft.com/pricing/calculator/?service=azure-devops',
  'DevTest Labs': 'https://azure.microsoft.com/pricing/calculator/?service=devtest-lab',
  'Azure AI Foundry account': 'https://azure.microsoft.com/pricing/calculator/?service=cognitive-services',
  'Azure AI Foundry hub': 'https://azure.microsoft.com/pricing/calculator/?service=machine-learning-service',
  'Azure AI Foundry project': 'https://azure.microsoft.com/pricing/calculator/?service=machine-learning-service',
  'Azure AI services account': 'https://azure.microsoft.com/pricing/calculator/?service=cognitive-services',
  'Azure OpenAI service': 'https://azure.microsoft.com/pricing/calculator/?service=cognitive-services'
};

let content = fs.readFileSync('src/data/constants.js', 'utf8');

for (const [name, url] of Object.entries(mappings)) {
    if (url) {
        const escapedName = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex = new RegExp(`name:\\s*['"]${escapedName}['"],`);
        content = content.replace(regex, `name: '${name}', pricingUrl: '${url}',`);
    }
}

fs.writeFileSync('src/data/constants.js', content, 'utf8');
console.log('constants.js updated with pricing URLs');
