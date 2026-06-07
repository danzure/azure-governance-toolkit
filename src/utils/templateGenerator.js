/**
 * Generates Infrastructure as Code (IaC) templates for Bicep and Terraform.
 */

const RESOURCE_MAP = {
    // General
    'Resource group': { tf: 'azurerm_resource_group', bicep: 'Microsoft.Resources/resourceGroups@2024-03-01' },
    'Management group': { tf: 'azurerm_management_group', bicep: 'Microsoft.Management/managementGroups@2023-04-01' },
    'Subscription': { tf: 'azurerm_subscription', bicep: 'Microsoft.Subscription/aliases@2021-10-01' },

    // Compute
    'Virtual Machine - Windows': { tf: 'azurerm_windows_virtual_machine', bicep: 'Microsoft.Compute/virtualMachines@2024-03-01' },
    'Virtual Machine - Linux': { tf: 'azurerm_linux_virtual_machine', bicep: 'Microsoft.Compute/virtualMachines@2024-03-01' },
    'VM scale set': { tf: 'azurerm_linux_virtual_machine_scale_set', bicep: 'Microsoft.Compute/virtualMachineScaleSets@2024-03-01' },
    'Managed disk': { tf: 'azurerm_managed_disk', bicep: 'Microsoft.Compute/disks@2023-10-02' },
    'Function app': { tf: 'azurerm_windows_function_app', bicep: 'Microsoft.Web/sites@2023-12-01' },

    // Networking
    'Virtual network': { tf: 'azurerm_virtual_network', bicep: 'Microsoft.Network/virtualNetworks@2023-11-01' },
    'Subnet': { tf: 'azurerm_subnet', bicep: 'Microsoft.Network/virtualNetworks/subnets@2023-11-01' },
    'Network security group': { tf: 'azurerm_network_security_group', bicep: 'Microsoft.Network/networkSecurityGroups@2023-11-01' },
    'Public IP': { tf: 'azurerm_public_ip', bicep: 'Microsoft.Network/publicIPAddresses@2023-11-01' },
    'Application Gateway': { tf: 'azurerm_application_gateway', bicep: 'Microsoft.Network/applicationGateways@2023-11-01' },
    'Azure Firewall': { tf: 'azurerm_firewall', bicep: 'Microsoft.Network/azureFirewalls@2023-11-01' },
    'VPN Gateway': { tf: 'azurerm_virtual_network_gateway', bicep: 'Microsoft.Network/virtualNetworkGateways@2023-11-01' },
    'ExpressRoute circuit': { tf: 'azurerm_express_route_circuit', bicep: 'Microsoft.Network/expressRouteCircuits@2023-11-01' },
    'Virtual WAN': { tf: 'azurerm_virtual_wan', bicep: 'Microsoft.Network/virtualWans@2023-11-01' },
    'Virtual hub': { tf: 'azurerm_virtual_hub', bicep: 'Microsoft.Network/virtualHubs@2023-11-01' },
    'NAT Gateway': { tf: 'azurerm_nat_gateway', bicep: 'Microsoft.Network/natGateways@2023-11-01' },
    'Route table': { tf: 'azurerm_route_table', bicep: 'Microsoft.Network/routeTables@2023-11-01' },
    'Traffic Manager': { tf: 'azurerm_traffic_manager_profile', bicep: 'Microsoft.Network/trafficManagerProfiles@2022-04-01-preview' },
    'Front Door': { tf: 'azurerm_cdn_frontdoor_profile', bicep: 'Microsoft.Cdn/profiles@2024-02-01' },
    'Bastion host': { tf: 'azurerm_bastion_host', bicep: 'Microsoft.Network/bastionHosts@2023-11-01' },

    // Storage
    'Storage account': { tf: 'azurerm_storage_account', bicep: 'Microsoft.Storage/storageAccounts@2023-01-01' },
    
    // Web
    'App Service plan': { tf: 'azurerm_service_plan', bicep: 'Microsoft.Web/serverfarms@2023-12-01' },
    'App Service': { tf: 'azurerm_linux_web_app', bicep: 'Microsoft.Web/sites@2023-12-01' },

    // Databases
    'SQL server': { tf: 'azurerm_mssql_server', bicep: 'Microsoft.Sql/servers@2023-08-01-preview' },
    'SQL database': { tf: 'azurerm_mssql_database', bicep: 'Microsoft.Sql/servers/databases@2023-08-01-preview' },
    'SQL elastic pool': { tf: 'azurerm_mssql_elasticpool', bicep: 'Microsoft.Sql/servers/elasticPools@2023-08-01-preview' },
    'SQL Managed Instance': { tf: 'azurerm_mssql_managed_instance', bicep: 'Microsoft.Sql/managedInstances@2023-08-01-preview' },
    'Cosmos DB account': { tf: 'azurerm_cosmosdb_account', bicep: 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' },
    'MySQL server': { tf: 'azurerm_mysql_flexible_server', bicep: 'Microsoft.DBforMySQL/flexibleServers@2023-12-30' },
    'PostgreSQL server': { tf: 'azurerm_postgresql_flexible_server', bicep: 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' },
    'Azure Cache for Redis': { tf: 'azurerm_redis_cache', bicep: 'Microsoft.Cache/redis@2024-03-01' },

    // Containers
    'Kubernetes (AKS)': { tf: 'azurerm_kubernetes_cluster', bicep: 'Microsoft.ContainerService/managedClusters@2024-02-01' },
    'Container registry': { tf: 'azurerm_container_registry', bicep: 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' },
    'Container instance': { tf: 'azurerm_container_group', bicep: 'Microsoft.ContainerInstance/containerGroups@2023-05-01' },
    'Container App': { tf: 'azurerm_container_app', bicep: 'Microsoft.App/containerApps@2024-03-01' },
    'Container Apps Environment': { tf: 'azurerm_container_app_environment', bicep: 'Microsoft.App/managedEnvironments@2024-03-01' },

    // Security & Integration
    'Key vault': { tf: 'azurerm_key_vault', bicep: 'Microsoft.KeyVault/vaults@2023-07-01' },
    'Key Vault Managed HSMs': { tf: 'azurerm_key_vault_managed_hardware_security_module', bicep: 'Microsoft.KeyVault/managedHSMs@2023-07-01' },
    'Service Bus namespace': { tf: 'azurerm_servicebus_namespace', bicep: 'Microsoft.ServiceBus/namespaces@2022-10-01-preview' },
    'Event Grid topic': { tf: 'azurerm_eventgrid_topic', bicep: 'Microsoft.EventGrid/topics@2024-06-01-preview' },
    'Log Analytics workspace': { tf: 'azurerm_log_analytics_workspace', bicep: 'Microsoft.OperationalInsights/workspaces@2023-09-01' },
    'Application Insights': { tf: 'azurerm_application_insights', bicep: 'Microsoft.Insights/components@2020-02-02' },
    'Machine Learning workspace': { tf: 'azurerm_machine_learning_workspace', bicep: 'Microsoft.MachineLearningServices/workspaces@2024-04-01' },

    // Networking — additional
    'Load balancer': { tf: 'azurerm_lb', bicep: 'Microsoft.Network/loadBalancers@2023-11-01' },
    'Application security group': { tf: 'azurerm_application_security_group', bicep: 'Microsoft.Network/applicationSecurityGroups@2023-11-01' },
    'Public IP prefix': { tf: 'azurerm_public_ip_prefix', bicep: 'Microsoft.Network/publicIPPrefixes@2023-11-01' },
    'Firewall policy': { tf: 'azurerm_firewall_policy', bicep: 'Microsoft.Network/firewallPolicies@2023-11-01' },
    'Private Link service': { tf: 'azurerm_private_link_service', bicep: 'Microsoft.Network/privateLinkServices@2023-11-01' },
    'Network watcher': { tf: 'azurerm_network_watcher', bicep: 'Microsoft.Network/networkWatchers@2023-11-01' },
    'DDoS protection plan': { tf: 'azurerm_network_ddos_protection_plan', bicep: 'Microsoft.Network/ddosProtectionPlans@2023-11-01' },

    // Identity
    'Managed identity (user)': { tf: 'azurerm_user_assigned_identity', bicep: 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' },

    // Integration
    'API Management': { tf: 'azurerm_api_management', bicep: 'Microsoft.ApiManagement/service@2023-09-01-preview' },
    'Event Hub namespace': { tf: 'azurerm_eventhub_namespace', bicep: 'Microsoft.EventHub/namespaces@2024-01-01' },
    'Event Hub': { tf: 'azurerm_eventhub', bicep: 'Microsoft.EventHub/namespaces/eventhubs@2024-01-01' },
    'Logic App': { tf: 'azurerm_logic_app_workflow', bicep: 'Microsoft.Logic/workflows@2019-05-01' },
    'SignalR service': { tf: 'azurerm_signalr_service', bicep: 'Microsoft.SignalRService/signalR@2024-03-01' },

    // AI & Cognitive
    'Azure OpenAI': { tf: 'azurerm_cognitive_account', bicep: 'Microsoft.CognitiveServices/accounts@2024-04-01-preview' },
    'Azure AI Search': { tf: 'azurerm_search_service', bicep: 'Microsoft.Search/searchServices@2024-03-01-preview' },

    // Data & Analytics
    'Data Factory': { tf: 'azurerm_data_factory', bicep: 'Microsoft.DataFactory/factories@2018-06-01' },
    'Synapse workspace': { tf: 'azurerm_synapse_workspace', bicep: 'Microsoft.Synapse/workspaces@2021-06-01' },
    'Databricks workspace': { tf: 'azurerm_databricks_workspace', bicep: 'Microsoft.Databricks/workspaces@2024-05-01' },

    // Desktop Virtualisation
    'Host Pool': { tf: 'azurerm_virtual_desktop_host_pool', bicep: 'Microsoft.DesktopVirtualization/hostPools@2024-04-03' },
    'Workspace': { tf: 'azurerm_virtual_desktop_workspace', bicep: 'Microsoft.DesktopVirtualization/workspaces@2024-04-03' },

    // Compute — additional
    'Availability set': { tf: 'azurerm_availability_set', bicep: 'Microsoft.Compute/availabilitySets@2024-03-01' },
    'Disk encryption set': { tf: 'azurerm_disk_encryption_set', bicep: 'Microsoft.Compute/diskEncryptionSets@2023-10-02' },
    'Batch account': { tf: 'azurerm_batch_account', bicep: 'Microsoft.Batch/batchAccounts@2024-02-01' },
    'Azure Spring Apps': { tf: 'azurerm_spring_cloud_service', bicep: 'Microsoft.AppPlatform/Spring@2024-01-01-preview' },

    // Storage — additional
    'Static Web App': { tf: 'azurerm_static_web_app', bicep: 'Microsoft.Web/staticSites@2023-12-01' },
    'Data Lake Storage': { tf: 'azurerm_storage_data_lake_gen2_filesystem', bicep: 'Microsoft.Storage/storageAccounts@2023-01-01' },
    'Azure Files share': { tf: 'azurerm_storage_share', bicep: 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-01-01' },
    'NetApp account': { tf: 'azurerm_netapp_account', bicep: 'Microsoft.NetApp/netAppAccounts@2023-11-01' },
    'NetApp capacity pool': { tf: 'azurerm_netapp_pool', bicep: 'Microsoft.NetApp/netAppAccounts/capacityPools@2023-11-01' },
    'NetApp volume': { tf: 'azurerm_netapp_volume', bicep: 'Microsoft.NetApp/netAppAccounts/capacityPools/volumes@2023-11-01' },

    // Integration — additional
    'Service Bus queue': { tf: 'azurerm_servicebus_queue', bicep: 'Microsoft.ServiceBus/namespaces/queues@2022-10-01-preview' },
    'Service Bus topic': { tf: 'azurerm_servicebus_topic', bicep: 'Microsoft.ServiceBus/namespaces/topics@2022-10-01-preview' },
    'Event Grid domain': { tf: 'azurerm_eventgrid_domain', bicep: 'Microsoft.EventGrid/domains@2024-06-01-preview' },
    'Notification Hub': { tf: 'azurerm_notification_hub', bicep: 'Microsoft.NotificationHubs/namespaces/notificationHubs@2023-10-01-preview' },
    'Relay': { tf: 'azurerm_relay_namespace', bicep: 'Microsoft.Relay/namespaces@2021-11-01' },

    // Data & Analytics — additional
    'Synapse dedicated SQL pool': { tf: 'azurerm_synapse_sql_pool', bicep: 'Microsoft.Synapse/workspaces/sqlPools@2021-06-01' },
    'Data Explorer cluster': { tf: 'azurerm_kusto_cluster', bicep: 'Microsoft.Kusto/clusters@2023-08-15' },
    'Stream Analytics Job': { tf: 'azurerm_stream_analytics_job', bicep: 'Microsoft.StreamAnalytics/streamingJobs@2021-10-01-preview' },

    // Management & Monitoring
    'Automation account': { tf: 'azurerm_automation_account', bicep: 'Microsoft.Automation/automationAccounts@2023-11-01' },
    'Recovery Services vault': { tf: 'azurerm_recovery_services_vault', bicep: 'Microsoft.RecoveryServices/vaults@2024-04-01' },
    'Action group': { tf: 'azurerm_monitor_action_group', bicep: 'Microsoft.Insights/actionGroups@2023-09-01-preview' },

    // IoT
    'IoT Hub': { tf: 'azurerm_iothub', bicep: 'Microsoft.Devices/IotHubs@2023-06-30' },
    'Device Provisioning Service': { tf: 'azurerm_iothub_dps', bicep: 'Microsoft.Devices/provisioningServices@2022-12-12' },
    'Digital Twins': { tf: 'azurerm_digital_twins_instance', bicep: 'Microsoft.DigitalTwins/digitalTwinsInstances@2023-01-31' },

    // Governance & Management — additional
    'Policy definition': { tf: 'azurerm_policy_definition', bicep: 'Microsoft.Authorization/policyDefinitions@2023-04-01' },
    'Policy assignment': { tf: 'azurerm_resource_group_policy_assignment', bicep: 'Microsoft.Authorization/policyAssignments@2024-04-01' },
    'Blueprint': { tf: 'azurerm_blueprint_assignment', bicep: 'Microsoft.Blueprint/blueprints@2018-11-01-preview' },
    'Cost Management export': { tf: 'azurerm_cost_management_scheduled_action', bicep: 'Microsoft.CostManagement/exports@2023-11-01' },
    'Template Spec': { tf: 'azurerm_resource_group_template_deployment', bicep: 'Microsoft.Resources/templateSpecs@2022-02-01' },

    // Compute — additional
    'Image': { tf: 'azurerm_image', bicep: 'Microsoft.Compute/images@2024-03-01' },
    'Compute gallery': { tf: 'azurerm_shared_image_gallery', bicep: 'Microsoft.Compute/galleries@2023-07-03' },
    'Proximity placement group': { tf: 'azurerm_proximity_placement_group', bicep: 'Microsoft.Compute/proximityPlacementGroups@2024-03-01' },

    // Networking — private endpoints & WAF
    'Private endpoint (Storage)': { tf: 'azurerm_private_endpoint', bicep: 'Microsoft.Network/privateEndpoints@2023-11-01' },
    'Private endpoint (Database)': { tf: 'azurerm_private_endpoint', bicep: 'Microsoft.Network/privateEndpoints@2023-11-01' },
    'Private endpoint (Services)': { tf: 'azurerm_private_endpoint', bicep: 'Microsoft.Network/privateEndpoints@2023-11-01' },
    'Application Gateway WAF policy': { tf: 'azurerm_web_application_firewall_policy', bicep: 'Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies@2023-11-01' },

    // AI & Cognitive — additional
    'Azure AI services': { tf: 'azurerm_cognitive_account', bicep: 'Microsoft.CognitiveServices/accounts@2024-04-01-preview' },
    'Azure Bot Service': { tf: 'azurerm_bot_service_azure_bot', bicep: 'Microsoft.BotService/botServices@2022-09-15' },
    'Azure AI Foundry account': { tf: 'azurerm_cognitive_account', bicep: 'Microsoft.CognitiveServices/accounts@2024-04-01-preview' },
    'Azure AI Foundry hub': { tf: 'azurerm_ai_foundry', bicep: 'Microsoft.MachineLearningServices/workspaces@2024-04-01' },
    'Azure AI Foundry project': { tf: 'azurerm_ai_foundry_project', bicep: 'Microsoft.MachineLearningServices/workspaces@2024-04-01' },
    'Azure AI services account': { tf: 'azurerm_cognitive_account', bicep: 'Microsoft.CognitiveServices/accounts@2024-04-01-preview' },
    'Azure OpenAI service': { tf: 'azurerm_cognitive_account', bicep: 'Microsoft.CognitiveServices/accounts@2024-04-01-preview' },

    // Analytics — additional
    'Fabric Capacity': { tf: 'azurerm_fabric_capacity', bicep: 'Microsoft.Fabric/capacities@2023-11-01' },
    'Power BI Embedded': { tf: 'azurerm_powerbi_embedded', bicep: 'Microsoft.PowerBIDedicated/capacities@2021-01-01' },

    // Desktop Virtualisation — additional
    'Application Group': { tf: 'azurerm_virtual_desktop_application_group', bicep: 'Microsoft.DesktopVirtualization/applicationGroups@2024-04-03' },
    'Scaling Plan': { tf: 'azurerm_virtual_desktop_scaling_plan', bicep: 'Microsoft.DesktopVirtualization/scalingPlans@2024-04-03' },

    // DevOps & Labs
    'DevOps organization': { tf: 'azurerm_dev_center', bicep: 'Microsoft.DevCenter/devcenters@2024-02-01' },
    'DevTest Labs': { tf: 'azurerm_dev_test_lab', bicep: 'Microsoft.DevTestLab/labs@2018-09-15' }
};

/**
 * Normalizes an identifier so it can be used safely in Terraform or Bicep blocks
 */
function normalizeIdentifier(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

function getBicepProperties(resourceName) {
    switch(resourceName) {
        case 'Storage account': return `  sku: {\n    name: 'Standard_LRS'\n  }\n  kind: 'StorageV2'\n  properties: {\n    accessTier: 'Hot'\n    minimumTlsVersion: 'TLS1_2'\n    supportsHttpsTrafficOnly: true\n  }`;
        case 'Virtual network': return `  properties: {\n    addressSpace: {\n      addressPrefixes: [\n        '10.0.0.0/16'\n      ]\n    }\n    subnets: []\n  }`;
        case 'Subnet': return `  properties: {\n    addressPrefix: '10.0.0.0/24'\n    privateEndpointNetworkPolicies: 'Disabled'\n    privateLinkServiceNetworkPolicies: 'Enabled'\n  }`;
        case 'Virtual Machine - Windows':
        case 'Virtual Machine - Linux': return `  properties: {\n    hardwareProfile: {\n      vmSize: 'Standard_D2s_v3'\n    }\n    storageProfile: {\n      osDisk: {\n        createOption: 'FromImage'\n        managedDisk: {\n          storageAccountType: 'Premium_LRS'\n        }\n      }\n    }\n  }`;
        case 'Key vault': return `  properties: {\n    tenantId: subscription().tenantId\n    sku: {\n      family: 'A'\n      name: 'standard'\n    }\n    enableSoftDelete: true\n    softDeleteRetentionInDays: 90\n    accessPolicies: []\n  }`;
        case 'App Service plan': return `  sku: {\n    name: 'P1v3'\n    tier: 'PremiumV3'\n    size: 'P1v3'\n    family: 'Pv3'\n    capacity: 1\n  }\n  properties: {\n    reserved: true // Required for Linux\n  }`;
        case 'App Service': return `  properties: {\n    serverFarmId: 'appServicePlanId' // Replace with your plan ID\n    siteConfig: {\n      alwaysOn: true\n      linuxFxVersion: 'NODE|18-lts'\n    }\n  }`;
        case 'SQL server': return `  properties: {\n    administratorLogin: 'sqladmin'\n    administratorLoginPassword: 'ChangeYourPassword123!' // Use KeyVault!\n    version: '12.0'\n  }`;
        case 'SQL database': return `  sku: {\n    name: 'Standard'\n    tier: 'Standard'\n    capacity: 10\n  }\n  properties: {\n    collation: 'SQL_Latin1_General_CP1_CI_AS'\n    maxSizeBytes: 1073741824\n  }`;
        case 'Kubernetes (AKS)': return `  identity: {\n    type: 'SystemAssigned'\n  }\n  properties: {\n    dnsPrefix: 'aks-dns'\n    agentPoolProfiles: [\n      {\n        name: 'agentpool'\n        count: 3\n        vmSize: 'Standard_DS2_v2'\n        osType: 'Linux'\n        mode: 'System'\n      }\n    ]\n  }`;
        case 'Log Analytics workspace': return `  properties: {\n    sku: {\n      name: 'PerGB2018'\n    }\n    retentionInDays: 30\n    workspaceCapping: {\n      dailyQuotaGb: -1\n    }\n  }`;
        default: return `  properties: {\n    // TODO: Add ${resourceName} specific properties here\n    // Example properties often include sku, networking, or sizing\n  }`;
    }
}

function getTerraformProperties(resourceName) {
    switch(resourceName) {
        case 'Storage account': return `  account_tier             = "Standard"\n  account_replication_type = "LRS"\n  min_tls_version          = "TLS1_2"`;
        case 'Virtual network': return `  address_space       = ["10.0.0.0/16"]`;
        case 'Subnet': return `  address_prefixes     = ["10.0.0.0/24"]\n  virtual_network_name = "example-vnet" # Replace with actual VNet`;
        case 'Virtual Machine - Windows':
        case 'Virtual Machine - Linux': return `  size           = "Standard_D2s_v3"\n  admin_username = "adminuser"\n  network_interface_ids = [\n    "nic-id" # Replace with actual NIC ID\n  ]\n  os_disk {\n    caching              = "ReadWrite"\n    storage_account_type = "Premium_LRS"\n  }`;
        case 'Key vault': return `  tenant_id                  = data.azurerm_client_config.current.tenant_id\n  sku_name                   = "standard"\n  soft_delete_retention_days = 90\n  purge_protection_enabled   = false`;
        case 'App Service plan': return `  os_type  = "Linux"\n  sku_name = "P1v2"`;
        case 'App Service': return `  service_plan_id = "app-service-plan-id"\n  site_config {\n    always_on = true\n    application_stack {\n      node_version = "18-lts"\n    }\n  }`;
        case 'SQL server': return `  version                      = "12.0"\n  administrator_login          = "sqladmin"\n  administrator_login_password = "ChangeYourPassword123!"`;
        case 'SQL database': return `  server_id      = "sql-server-id"\n  collation      = "SQL_Latin1_General_CP1_CI_AS"\n  max_size_gb    = 1\n  sku_name       = "S0"`;
        case 'Kubernetes (AKS)': return `  dns_prefix = "aks-dns"\n  default_node_pool {\n    name       = "default"\n    node_count = 3\n    vm_size    = "Standard_DS2_v2"\n  }\n  identity {\n    type = "SystemAssigned"\n  }`;
        case 'Log Analytics workspace': return `  sku               = "PerGB2018"\n  retention_in_days = 30`;
        default: return `  # TODO: Add ${resourceName} specific properties here\n  # Example properties often include sku, networking, or sizing`;
    }
}

function getArmProperties(resourceName) {
    switch(resourceName) {
        case 'Storage account': return { accessTier: 'Hot', minimumTlsVersion: 'TLS1_2', supportsHttpsTrafficOnly: true };
        case 'Virtual network': return { addressSpace: { addressPrefixes: [ '10.0.0.0/16' ] }, subnets: [] };
        case 'Subnet': return { addressPrefix: '10.0.0.0/24', privateEndpointNetworkPolicies: 'Disabled' };
        case 'Key vault': return { tenantId: '[subscription().tenantId]', sku: { family: 'A', name: 'standard' }, enableSoftDelete: true, softDeleteRetentionInDays: 90, accessPolicies: [] };
        case 'Log Analytics workspace': return { sku: { name: 'PerGB2018' }, retentionInDays: 30 };
        default: return {}; // Use empty object for default properties
    }
}

/**
 * Generates Bicep template snippet for a given resource
 */
export function generateBicepTemplate(resource, genName) {
    const mapping = RESOURCE_MAP[resource.name];
    const identifier = normalizeIdentifier(resource.abbrev + '_' + genName.substring(0, 5));
    const bicepProps = getBicepProperties(resource.name);

    if (mapping && mapping.bicep) {
        return `resource ${identifier} '${mapping.bicep}' = {
  name: '${genName}'
  location: location // Replace with your location variable
  tags: {
    Environment: 'Production'
    Project: 'CloudTransformation'
    ManagedBy: 'InfrastructureAsCode'
  }
${bicepProps}
}`;
    }

    // Fallback
    return `// Note: This is an approximate placeholder.
// The exact resource type for '${resource.name}' must be obtained from Azure Docs.
resource ${identifier} 'Microsoft.Unknown/providerType@latest' = {
  name: '${genName}'
  location: location
  tags: {
    Environment: 'Production'
    Project: 'CloudTransformation'
    ManagedBy: 'InfrastructureAsCode'
  }
  properties: {
    // ...
  }
}`;
}

/**
 * Generates Terraform template snippet for a given resource
 */
export function generateTerraformTemplate(resource, genName) {
    const mapping = RESOURCE_MAP[resource.name];
    const identifier = normalizeIdentifier(resource.abbrev + '_res');
    const tfProps = getTerraformProperties(resource.name);

    if (mapping && mapping.tf) {
        return `resource "${mapping.tf}" "${identifier}" {
  name                = "${genName}"
  location            = var.location            # Replace with appropriate var
  resource_group_name = var.resource_group_name # Replace with appropriate rg
  
  tags = {
    Environment = "Production"
    Project     = "CloudTransformation"
    ManagedBy   = "Terraform"
  }

${tfProps}
}`;
    }

    // Fallback
    const fallbackResType = "azurerm_" + resource.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    return `# Note: This is an approximate placeholder.
# Check the Terraform AzureRM provider docs for the exact resource type.
resource "${fallbackResType}" "${identifier}" {
  name                = "${genName}"
  location            = var.location
  resource_group_name = var.resource_group_name
  
  tags = {
    Environment = "Production"
    Project     = "CloudTransformation"
    ManagedBy   = "Terraform"
  }
}`;
}

/**
 * Generates ARM template snippet for a given resource
 */
export function generateArmTemplate(resource, genName) {
    const mapping = RESOURCE_MAP[resource.name];
    let type = 'Microsoft.Unknown/providerType';
    let apiVersion = 'latest';

    if (mapping && mapping.bicep) {
        const parts = mapping.bicep.split('@');
        type = parts[0];
        if (parts.length > 1) {
            apiVersion = parts[1];
        }
    }

    const armProps = getArmProperties(resource.name);
    
    // For ARM Storage accounts, sku and kind are required at top level
    const extraFields = {};
    if (resource.name === 'Storage account') {
        extraFields.sku = { name: 'Standard_LRS' };
        extraFields.kind = 'StorageV2';
    } else if (resource.name === 'App Service plan') {
        extraFields.sku = { name: 'P1v3', tier: 'PremiumV3', size: 'P1v3', family: 'Pv3', capacity: 1 };
    }

    const template = {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "location": {
          "type": "string",
          "defaultValue": "[resourceGroup().location]"
        }
      },
      "resources": [
        {
          "type": type,
          "apiVersion": apiVersion,
          "name": genName,
          "location": "[parameters('location')]",
          "tags": {
            "Environment": "Production",
            "Project": "CloudTransformation",
            "ManagedBy": "ARM"
          },
          ...extraFields,
          "properties": armProps
        }
      ]
    };

    let result = JSON.stringify(template, null, 2);
    if (!mapping || !mapping.bicep) {
        result = `// Note: This is an approximate placeholder.\n// The exact resource type for '${resource.name}' must be obtained from Azure Docs.\n` + result;
    }
    return result;
}

/**
 * Generates templates for a bundle collection
 */
export function generateBundleTemplates(bundleItems, provider = 'bicep', getBundleName) {
    if (!bundleItems || bundleItems.length === 0) return '';
    
    if (provider === 'arm') {
        const resources = bundleItems.map(item => {
            const genName = getBundleName(item);
            const mapping = RESOURCE_MAP[item.name];
            let type = 'Microsoft.Unknown/providerType';
            let apiVersion = 'latest';

            if (mapping && mapping.bicep) {
                const parts = mapping.bicep.split('@');
                type = parts[0];
                if (parts.length > 1) {
                    apiVersion = parts[1];
                }
            }
            
            const armProps = getArmProperties(item.name);
            const extraFields = {};
            if (item.name === 'Storage account') {
                extraFields.sku = { name: 'Standard_LRS' };
                extraFields.kind = 'StorageV2';
            } else if (item.name === 'App Service plan') {
                extraFields.sku = { name: 'P1v3', tier: 'PremiumV3', size: 'P1v3', family: 'Pv3', capacity: 1 };
            }

            return {
              "type": type,
              "apiVersion": apiVersion,
              "name": genName,
              "location": "[parameters('location')]",
              "tags": {
                "Environment": "Production",
                "Project": "CloudTransformation",
                "ManagedBy": "ARM"
              },
              ...extraFields,
              "properties": armProps
            };
        });

        const template = {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "location": {
              "type": "string",
              "defaultValue": "[resourceGroup().location]"
            }
          },
          "resources": resources
        };
        
        return JSON.stringify(template, null, 2);
    }

    let result = '';
    
    bundleItems.forEach((item, index) => {
        const genName = getBundleName(item);
        
        let template = '';
        if (provider === 'bicep') {
            template = generateBicepTemplate(item, genName);
        } else if (provider === 'terraform') {
            template = generateTerraformTemplate(item, genName);
        } else {
            template = generateArmTemplate(item, genName);
        }
        
        result += template;
        if (index < bundleItems.length - 1) {
            result += '\n\n';
        }
    });
    
    return result;
}

/**
 * Returns the official documentation URL for a given resource and IaC provider
 */
export function getIacDocsUrl(resource, provider) {
    const mapping = RESOURCE_MAP[resource.name];
    if (!mapping) {
        if (provider === 'terraform') return 'https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs';
        return 'https://learn.microsoft.com/en-us/azure/templates/';
    }

    if (provider === 'terraform') {
        const tfName = mapping.tf;
        if (tfName && tfName.startsWith('azurerm_')) {
            const shortName = tfName.substring(8);
            return `https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/${shortName}`;
        }
        return 'https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs';
    } else {
        const bicepType = mapping.bicep;
        if (bicepType) {
            const typeOnly = bicepType.split('@')[0].toLowerCase();
            const pivot = provider === 'bicep' ? 'deployment-language-bicep' : 'deployment-language-arm-template';
            return `https://learn.microsoft.com/en-us/azure/templates/${typeOnly}?pivots=${pivot}`;
        }
        return 'https://learn.microsoft.com/en-us/azure/templates/';
    }
}
