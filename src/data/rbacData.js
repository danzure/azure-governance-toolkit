export const COMMON_RBAC_PROVIDERS = [
    {
        provider: 'Microsoft.ApiManagement',
        operations: [
            'Microsoft.ApiManagement/*',
            'Microsoft.ApiManagement/service/*',
            'Microsoft.ApiManagement/service/read',
            'Microsoft.ApiManagement/service/write',
            'Microsoft.ApiManagement/service/delete',
            'Microsoft.ApiManagement/service/apis/read',
            'Microsoft.ApiManagement/service/apis/write',
            'Microsoft.ApiManagement/service/apis/delete',
            'Microsoft.ApiManagement/service/products/read',
            'Microsoft.ApiManagement/service/products/write',
            'Microsoft.ApiManagement/service/products/delete',
            'Microsoft.ApiManagement/service/subscriptions/read',
            'Microsoft.ApiManagement/service/subscriptions/write',
            'Microsoft.ApiManagement/service/subscriptions/listSecrets/action',
            'Microsoft.ApiManagement/service/users/read',
            'Microsoft.ApiManagement/service/users/write',
            'Microsoft.ApiManagement/service/policies/read',
            'Microsoft.ApiManagement/service/policies/write',
            'Microsoft.ApiManagement/service/gateways/read'
        ]
    },
    {
        provider: 'Microsoft.App',
        operations: [
            'Microsoft.App/*',
            'Microsoft.App/containerApps/read',
            'Microsoft.App/containerApps/write',
            'Microsoft.App/containerApps/delete',
            'Microsoft.App/containerApps/revisions/read',
            'Microsoft.App/containerApps/revisions/restart/action',
            'Microsoft.App/containerApps/revisions/activate/action',
            'Microsoft.App/containerApps/revisions/deactivate/action',
            'Microsoft.App/managedEnvironments/read',
            'Microsoft.App/managedEnvironments/write',
            'Microsoft.App/managedEnvironments/delete',
            'Microsoft.App/managedEnvironments/daprComponents/read',
            'Microsoft.App/managedEnvironments/daprComponents/write'
        ]
    },
    {
        provider: 'Microsoft.AppConfiguration',
        operations: [
            'Microsoft.AppConfiguration/*',
            'Microsoft.AppConfiguration/configurationStores/*',
            'Microsoft.AppConfiguration/configurationStores/read',
            'Microsoft.AppConfiguration/configurationStores/write',
            'Microsoft.AppConfiguration/configurationStores/delete',
            'Microsoft.AppConfiguration/configurationStores/ListKeys/action',
            'Microsoft.AppConfiguration/configurationStores/regenerateKey/action',
            'Microsoft.AppConfiguration/configurationStores/ListKeyValue/action',
            'Microsoft.AppConfiguration/configurationStores/keyValues/read',
            'Microsoft.AppConfiguration/configurationStores/keyValues/write'
        ]
    },
    {
        provider: 'Microsoft.Authorization',
        operations: [
            'Microsoft.Authorization/*',
            'Microsoft.Authorization/roleAssignments/*',
            'Microsoft.Authorization/roleAssignments/read',
            'Microsoft.Authorization/roleAssignments/write',
            'Microsoft.Authorization/roleAssignments/delete',
            'Microsoft.Authorization/roleDefinitions/*',
            'Microsoft.Authorization/roleDefinitions/read',
            'Microsoft.Authorization/roleDefinitions/write',
            'Microsoft.Authorization/roleDefinitions/delete',
            'Microsoft.Authorization/locks/*',
            'Microsoft.Authorization/locks/read',
            'Microsoft.Authorization/locks/write',
            'Microsoft.Authorization/locks/delete',
            'Microsoft.Authorization/policyAssignments/*',
            'Microsoft.Authorization/policyAssignments/read',
            'Microsoft.Authorization/policyAssignments/write',
            'Microsoft.Authorization/policyAssignments/delete',
            'Microsoft.Authorization/policyDefinitions/*',
            'Microsoft.Authorization/policyDefinitions/read',
            'Microsoft.Authorization/policyDefinitions/write',
            'Microsoft.Authorization/policyDefinitions/delete',
            'Microsoft.Authorization/policySetDefinitions/read',
            'Microsoft.Authorization/policySetDefinitions/write'
        ]
    },
    {
        provider: 'Microsoft.Automation',
        operations: [
            'Microsoft.Automation/*',
            'Microsoft.Automation/automationAccounts/read',
            'Microsoft.Automation/automationAccounts/write',
            'Microsoft.Automation/automationAccounts/delete',
            'Microsoft.Automation/automationAccounts/runbooks/read',
            'Microsoft.Automation/automationAccounts/runbooks/write',
            'Microsoft.Automation/automationAccounts/runbooks/draft/action',
            'Microsoft.Automation/automationAccounts/runbooks/publish/action',
            'Microsoft.Automation/automationAccounts/jobs/read',
            'Microsoft.Automation/automationAccounts/jobs/write',
            'Microsoft.Automation/automationAccounts/jobs/stop/action',
            'Microsoft.Automation/automationAccounts/variables/read',
            'Microsoft.Automation/automationAccounts/variables/write',
            'Microsoft.Automation/automationAccounts/schedules/read',
            'Microsoft.Automation/automationAccounts/schedules/write'
        ]
    },
    {
        provider: 'Microsoft.Cache',
        operations: [
            'Microsoft.Cache/*',
            'Microsoft.Cache/redis/*',
            'Microsoft.Cache/redis/read',
            'Microsoft.Cache/redis/write',
            'Microsoft.Cache/redis/delete',
            'Microsoft.Cache/redis/listKeys/action',
            'Microsoft.Cache/redis/regenerateKey/action',
            'Microsoft.Cache/redis/start/action',
            'Microsoft.Cache/redis/stop/action',
            'Microsoft.Cache/redis/reboot/action',
            'Microsoft.Cache/redisEnterprise/read',
            'Microsoft.Cache/redisEnterprise/write'
        ]
    },
    {
        provider: 'Microsoft.CognitiveServices',
        operations: [
            'Microsoft.CognitiveServices/*',
            'Microsoft.CognitiveServices/accounts/read',
            'Microsoft.CognitiveServices/accounts/write',
            'Microsoft.CognitiveServices/accounts/delete',
            'Microsoft.CognitiveServices/accounts/listKeys/action',
            'Microsoft.CognitiveServices/accounts/regenerateKey/action',
            'Microsoft.CognitiveServices/accounts/deployments/read',
            'Microsoft.CognitiveServices/accounts/deployments/write',
            'Microsoft.CognitiveServices/accounts/deployments/delete',
            'Microsoft.CognitiveServices/accounts/models/read',
            'Microsoft.CognitiveServices/accounts/commitments/read'
        ]
    },
    {
        provider: 'Microsoft.Compute',
        operations: [
            'Microsoft.Compute/*',
            'Microsoft.Compute/virtualMachines/*',
            'Microsoft.Compute/virtualMachines/read',
            'Microsoft.Compute/virtualMachines/write',
            'Microsoft.Compute/virtualMachines/delete',
            'Microsoft.Compute/virtualMachines/start/action',
            'Microsoft.Compute/virtualMachines/restart/action',
            'Microsoft.Compute/virtualMachines/powerOff/action',
            'Microsoft.Compute/virtualMachines/deallocate/action',
            'Microsoft.Compute/virtualMachines/redeploy/action',
            'Microsoft.Compute/virtualMachines/reimage/action',
            'Microsoft.Compute/virtualMachines/instanceView/read',
            'Microsoft.Compute/virtualMachines/runCommand/action',
            'Microsoft.Compute/virtualMachineScaleSets/read',
            'Microsoft.Compute/virtualMachineScaleSets/write',
            'Microsoft.Compute/virtualMachineScaleSets/delete',
            'Microsoft.Compute/virtualMachineScaleSets/start/action',
            'Microsoft.Compute/virtualMachineScaleSets/restart/action',
            'Microsoft.Compute/virtualMachineScaleSets/deallocate/action',
            'Microsoft.Compute/disks/*',
            'Microsoft.Compute/disks/read',
            'Microsoft.Compute/disks/write',
            'Microsoft.Compute/disks/delete',
            'Microsoft.Compute/snapshots/read',
            'Microsoft.Compute/snapshots/write',
            'Microsoft.Compute/snapshots/delete',
            'Microsoft.Compute/galleries/read',
            'Microsoft.Compute/galleries/write',
            'Microsoft.Compute/galleries/images/read',
            'Microsoft.Compute/galleries/images/versions/read'
        ]
    },
    {
        provider: 'Microsoft.ContainerRegistry',
        operations: [
            'Microsoft.ContainerRegistry/*',
            'Microsoft.ContainerRegistry/registries/read',
            'Microsoft.ContainerRegistry/registries/write',
            'Microsoft.ContainerRegistry/registries/delete',
            'Microsoft.ContainerRegistry/registries/listCredentials/action',
            'Microsoft.ContainerRegistry/registries/regenerateCredential/action',
            'Microsoft.ContainerRegistry/registries/webhooks/read',
            'Microsoft.ContainerRegistry/registries/webhooks/write',
            'Microsoft.ContainerRegistry/registries/webhooks/delete',
            'Microsoft.ContainerRegistry/registries/tokens/read',
            'Microsoft.ContainerRegistry/registries/tokens/write',
            'Microsoft.ContainerRegistry/registries/tokens/delete',
            'Microsoft.ContainerRegistry/registries/scopeMaps/read'
        ]
    },
    {
        provider: 'Microsoft.ContainerService',
        operations: [
            'Microsoft.ContainerService/*',
            'Microsoft.ContainerService/managedClusters/*',
            'Microsoft.ContainerService/managedClusters/read',
            'Microsoft.ContainerService/managedClusters/write',
            'Microsoft.ContainerService/managedClusters/delete',
            'Microsoft.ContainerService/managedClusters/start/action',
            'Microsoft.ContainerService/managedClusters/stop/action',
            'Microsoft.ContainerService/managedClusters/restart/action',
            'Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action',
            'Microsoft.ContainerService/managedClusters/agentPools/read',
            'Microsoft.ContainerService/managedClusters/agentPools/write',
            'Microsoft.ContainerService/managedClusters/agentPools/delete',
            'Microsoft.ContainerService/managedClusters/agentPools/upgrade/action',
            'Microsoft.ContainerService/managedClusters/upgradeProfiles/read'
        ]
    },
    {
        provider: 'Microsoft.CostManagement',
        operations: [
            'Microsoft.CostManagement/*',
            'Microsoft.CostManagement/budgets/*',
            'Microsoft.CostManagement/budgets/read',
            'Microsoft.CostManagement/budgets/write',
            'Microsoft.CostManagement/budgets/delete',
            'Microsoft.CostManagement/costReports/read',
            'Microsoft.CostManagement/exports/read',
            'Microsoft.CostManagement/exports/write',
            'Microsoft.CostManagement/exports/delete',
            'Microsoft.CostManagement/exports/run/action',
            'Microsoft.CostManagement/scheduledActions/read',
            'Microsoft.CostManagement/scheduledActions/write'
        ]
    },
    {
        provider: 'Microsoft.DataFactory',
        operations: [
            'Microsoft.DataFactory/*',
            'Microsoft.DataFactory/factories/*',
            'Microsoft.DataFactory/factories/read',
            'Microsoft.DataFactory/factories/write',
            'Microsoft.DataFactory/factories/delete',
            'Microsoft.DataFactory/factories/pipelines/read',
            'Microsoft.DataFactory/factories/pipelines/write',
            'Microsoft.DataFactory/factories/pipelines/delete',
            'Microsoft.DataFactory/factories/pipelines/createrun/action',
            'Microsoft.DataFactory/factories/pipelineruns/read',
            'Microsoft.DataFactory/factories/pipelineruns/cancel/action',
            'Microsoft.DataFactory/factories/datasets/read',
            'Microsoft.DataFactory/factories/datasets/write',
            'Microsoft.DataFactory/factories/datasets/delete',
            'Microsoft.DataFactory/factories/linkedservices/read',
            'Microsoft.DataFactory/factories/linkedservices/write',
            'Microsoft.DataFactory/factories/linkedservices/delete',
            'Microsoft.DataFactory/factories/triggers/read',
            'Microsoft.DataFactory/factories/triggers/write',
            'Microsoft.DataFactory/factories/triggers/start/action',
            'Microsoft.DataFactory/factories/triggers/stop/action',
            'Microsoft.DataFactory/factories/integrationRuntimes/read',
            'Microsoft.DataFactory/factories/integrationRuntimes/start/action',
            'Microsoft.DataFactory/factories/integrationRuntimes/stop/action'
        ]
    },
    {
        provider: 'Microsoft.Databricks',
        operations: [
            'Microsoft.Databricks/*',
            'Microsoft.Databricks/workspaces/*',
            'Microsoft.Databricks/workspaces/read',
            'Microsoft.Databricks/workspaces/write',
            'Microsoft.Databricks/workspaces/delete',
            'Microsoft.Databricks/workspaces/vNetPeering/read',
            'Microsoft.Databricks/workspaces/vNetPeering/write',
            'Microsoft.Databricks/workspaces/vNetPeering/delete',
            'Microsoft.Databricks/accessConnectors/read',
            'Microsoft.Databricks/accessConnectors/write'
        ]
    },
    {
        provider: 'Microsoft.DesktopVirtualization',
        operations: [
            'Microsoft.DesktopVirtualization/*',
            'Microsoft.DesktopVirtualization/hostpools/*',
            'Microsoft.DesktopVirtualization/hostpools/read',
            'Microsoft.DesktopVirtualization/hostpools/write',
            'Microsoft.DesktopVirtualization/hostpools/delete',
            'Microsoft.DesktopVirtualization/applicationgroups/read',
            'Microsoft.DesktopVirtualization/applicationgroups/write',
            'Microsoft.DesktopVirtualization/applicationgroups/delete',
            'Microsoft.DesktopVirtualization/workspaces/read',
            'Microsoft.DesktopVirtualization/workspaces/write',
            'Microsoft.DesktopVirtualization/workspaces/delete',
            'Microsoft.DesktopVirtualization/sessionhosts/read',
            'Microsoft.DesktopVirtualization/sessionhosts/delete',
            'Microsoft.DesktopVirtualization/sessionhosts/userSessions/read',
            'Microsoft.DesktopVirtualization/sessionhosts/userSessions/delete',
            'Microsoft.DesktopVirtualization/scalingplans/read',
            'Microsoft.DesktopVirtualization/scalingplans/write'
        ]
    },
    {
        provider: 'Microsoft.DocumentDB',
        operations: [
            'Microsoft.DocumentDB/*',
            'Microsoft.DocumentDB/databaseAccounts/*',
            'Microsoft.DocumentDB/databaseAccounts/read',
            'Microsoft.DocumentDB/databaseAccounts/write',
            'Microsoft.DocumentDB/databaseAccounts/delete',
            'Microsoft.DocumentDB/databaseAccounts/listKeys/action',
            'Microsoft.DocumentDB/databaseAccounts/readonlykeys/action',
            'Microsoft.DocumentDB/databaseAccounts/regenerateKey/action',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/read',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/write',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/delete',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/read',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/write',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/delete',
            'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/read',
            'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/write'
        ]
    },
    {
        provider: 'Microsoft.EventGrid',
        operations: [
            'Microsoft.EventGrid/*',
            'Microsoft.EventGrid/topics/read',
            'Microsoft.EventGrid/topics/write',
            'Microsoft.EventGrid/topics/delete',
            'Microsoft.EventGrid/topics/listKeys/action',
            'Microsoft.EventGrid/eventSubscriptions/read',
            'Microsoft.EventGrid/eventSubscriptions/write',
            'Microsoft.EventGrid/eventSubscriptions/delete',
            'Microsoft.EventGrid/systemTopics/read',
            'Microsoft.EventGrid/systemTopics/write',
            'Microsoft.EventGrid/systemTopics/delete',
            'Microsoft.EventGrid/domains/read',
            'Microsoft.EventGrid/domains/write'
        ]
    },
    {
        provider: 'Microsoft.EventHub',
        operations: [
            'Microsoft.EventHub/*',
            'Microsoft.EventHub/namespaces/*',
            'Microsoft.EventHub/namespaces/read',
            'Microsoft.EventHub/namespaces/write',
            'Microsoft.EventHub/namespaces/delete',
            'Microsoft.EventHub/namespaces/authorizationRules/listKeys/action',
            'Microsoft.EventHub/namespaces/regenerateKeys/action',
            'Microsoft.EventHub/namespaces/eventhubs/read',
            'Microsoft.EventHub/namespaces/eventhubs/write',
            'Microsoft.EventHub/namespaces/eventhubs/delete',
            'Microsoft.EventHub/namespaces/eventhubs/consumergroups/read',
            'Microsoft.EventHub/namespaces/eventhubs/consumergroups/write',
            'Microsoft.EventHub/namespaces/eventhubs/consumergroups/delete'
        ]
    },
    {
        provider: 'Microsoft.Insights',
        operations: [
            'Microsoft.Insights/*',
            'Microsoft.Insights/alertRules/*',
            'Microsoft.Insights/alertRules/read',
            'Microsoft.Insights/alertRules/write',
            'Microsoft.Insights/alertRules/delete',
            'Microsoft.Insights/metricAlerts/read',
            'Microsoft.Insights/metricAlerts/write',
            'Microsoft.Insights/metricAlerts/delete',
            'Microsoft.Insights/activityLogAlerts/read',
            'Microsoft.Insights/activityLogAlerts/write',
            'Microsoft.Insights/actionGroups/read',
            'Microsoft.Insights/actionGroups/write',
            'Microsoft.Insights/actionGroups/delete',
            'Microsoft.Insights/diagnosticSettings/read',
            'Microsoft.Insights/diagnosticSettings/write',
            'Microsoft.Insights/diagnosticSettings/delete',
            'Microsoft.Insights/metrics/read',
            'Microsoft.Insights/components/read',
            'Microsoft.Insights/components/write',
            'Microsoft.Insights/components/delete',
            'Microsoft.Insights/workbooks/read',
            'Microsoft.Insights/workbooks/write'
        ]
    },
    {
        provider: 'Microsoft.KeyVault',
        operations: [
            'Microsoft.KeyVault/*',
            'Microsoft.KeyVault/vaults/*',
            'Microsoft.KeyVault/vaults/read',
            'Microsoft.KeyVault/vaults/write',
            'Microsoft.KeyVault/vaults/delete',
            'Microsoft.KeyVault/vaults/accessPolicies/write',
            'Microsoft.KeyVault/vaults/secrets/*',
            'Microsoft.KeyVault/vaults/secrets/read',
            'Microsoft.KeyVault/vaults/secrets/write',
            'Microsoft.KeyVault/vaults/secrets/delete',
            'Microsoft.KeyVault/vaults/keys/*',
            'Microsoft.KeyVault/vaults/keys/read',
            'Microsoft.KeyVault/vaults/keys/write',
            'Microsoft.KeyVault/vaults/keys/delete',
            'Microsoft.KeyVault/vaults/certificates/*',
            'Microsoft.KeyVault/vaults/certificates/read',
            'Microsoft.KeyVault/vaults/certificates/write',
            'Microsoft.KeyVault/vaults/certificates/delete',
            'Microsoft.KeyVault/deletedVaults/read',
            'Microsoft.KeyVault/deletedVaults/purge/action'
        ]
    },
    {
        provider: 'Microsoft.Logic',
        operations: [
            'Microsoft.Logic/*',
            'Microsoft.Logic/workflows/*',
            'Microsoft.Logic/workflows/read',
            'Microsoft.Logic/workflows/write',
            'Microsoft.Logic/workflows/delete',
            'Microsoft.Logic/workflows/enable/action',
            'Microsoft.Logic/workflows/disable/action',
            'Microsoft.Logic/workflows/runs/read',
            'Microsoft.Logic/workflows/runs/cancel/action',
            'Microsoft.Logic/workflows/triggers/read',
            'Microsoft.Logic/workflows/triggers/run/action',
            'Microsoft.Logic/integrationAccounts/read',
            'Microsoft.Logic/integrationAccounts/write',
            'Microsoft.Logic/integrationAccounts/delete'
        ]
    },
    {
        provider: 'Microsoft.MachineLearningServices',
        operations: [
            'Microsoft.MachineLearningServices/*',
            'Microsoft.MachineLearningServices/workspaces/*',
            'Microsoft.MachineLearningServices/workspaces/read',
            'Microsoft.MachineLearningServices/workspaces/write',
            'Microsoft.MachineLearningServices/workspaces/delete',
            'Microsoft.MachineLearningServices/workspaces/computes/read',
            'Microsoft.MachineLearningServices/workspaces/computes/write',
            'Microsoft.MachineLearningServices/workspaces/computes/delete',
            'Microsoft.MachineLearningServices/workspaces/computes/start/action',
            'Microsoft.MachineLearningServices/workspaces/computes/stop/action',
            'Microsoft.MachineLearningServices/workspaces/computes/restart/action',
            'Microsoft.MachineLearningServices/workspaces/models/read',
            'Microsoft.MachineLearningServices/workspaces/models/write',
            'Microsoft.MachineLearningServices/workspaces/endpoints/read',
            'Microsoft.MachineLearningServices/workspaces/endpoints/write',
            'Microsoft.MachineLearningServices/workspaces/datastores/read',
            'Microsoft.MachineLearningServices/workspaces/datastores/listSecrets/action'
        ]
    },
    {
        provider: 'Microsoft.Network',
        operations: [
            'Microsoft.Network/*',
            'Microsoft.Network/virtualNetworks/*',
            'Microsoft.Network/virtualNetworks/read',
            'Microsoft.Network/virtualNetworks/write',
            'Microsoft.Network/virtualNetworks/delete',
            'Microsoft.Network/virtualNetworks/subnets/read',
            'Microsoft.Network/virtualNetworks/subnets/write',
            'Microsoft.Network/virtualNetworks/subnets/delete',
            'Microsoft.Network/virtualNetworks/peer/action',
            'Microsoft.Network/networkInterfaces/*',
            'Microsoft.Network/networkInterfaces/read',
            'Microsoft.Network/networkInterfaces/write',
            'Microsoft.Network/networkInterfaces/delete',
            'Microsoft.Network/networkSecurityGroups/*',
            'Microsoft.Network/networkSecurityGroups/read',
            'Microsoft.Network/networkSecurityGroups/write',
            'Microsoft.Network/networkSecurityGroups/delete',
            'Microsoft.Network/networkSecurityGroups/securityRules/read',
            'Microsoft.Network/networkSecurityGroups/securityRules/write',
            'Microsoft.Network/networkSecurityGroups/securityRules/delete',
            'Microsoft.Network/publicIPAddresses/read',
            'Microsoft.Network/publicIPAddresses/write',
            'Microsoft.Network/publicIPAddresses/delete',
            'Microsoft.Network/loadBalancers/read',
            'Microsoft.Network/loadBalancers/write',
            'Microsoft.Network/loadBalancers/delete',
            'Microsoft.Network/applicationGateways/read',
            'Microsoft.Network/applicationGateways/write',
            'Microsoft.Network/applicationGateways/delete',
            'Microsoft.Network/privateEndpoints/read',
            'Microsoft.Network/privateEndpoints/write',
            'Microsoft.Network/privateEndpoints/delete',
            'Microsoft.Network/privateDnsZones/read',
            'Microsoft.Network/privateDnsZones/write',
            'Microsoft.Network/privateDnsZones/delete',
            'Microsoft.Network/azureFirewalls/read',
            'Microsoft.Network/azureFirewalls/write',
            'Microsoft.Network/azureFirewalls/delete',
            'Microsoft.Network/bastionHosts/read',
            'Microsoft.Network/bastionHosts/write',
            'Microsoft.Network/bastionHosts/delete',
            'Microsoft.Network/virtualNetworkGateways/read',
            'Microsoft.Network/virtualNetworkGateways/write',
            'Microsoft.Network/virtualNetworkGateways/delete'
        ]
    },
    {
        provider: 'Microsoft.OperationalInsights',
        operations: [
            'Microsoft.OperationalInsights/*',
            'Microsoft.OperationalInsights/workspaces/*',
            'Microsoft.OperationalInsights/workspaces/read',
            'Microsoft.OperationalInsights/workspaces/write',
            'Microsoft.OperationalInsights/workspaces/delete',
            'Microsoft.OperationalInsights/workspaces/sharedKeys/action',
            'Microsoft.OperationalInsights/workspaces/regenerateSharedKey/action',
            'Microsoft.OperationalInsights/workspaces/query/read',
            'Microsoft.OperationalInsights/workspaces/savedSearches/read',
            'Microsoft.OperationalInsights/workspaces/savedSearches/write',
            'Microsoft.OperationalInsights/workspaces/tables/read',
            'Microsoft.OperationalInsights/workspaces/tables/write',
            'Microsoft.OperationalInsights/workspaces/dataSources/read',
            'Microsoft.OperationalInsights/clusters/read',
            'Microsoft.OperationalInsights/clusters/write'
        ]
    },
    {
        provider: 'Microsoft.RecoveryServices',
        operations: [
            'Microsoft.RecoveryServices/*',
            'Microsoft.RecoveryServices/vaults/read',
            'Microsoft.RecoveryServices/vaults/write',
            'Microsoft.RecoveryServices/vaults/delete',
            'Microsoft.RecoveryServices/vaults/backupPolicies/read',
            'Microsoft.RecoveryServices/vaults/backupPolicies/write',
            'Microsoft.RecoveryServices/vaults/backupPolicies/delete',
            'Microsoft.RecoveryServices/vaults/backupProtectedItems/read',
            'Microsoft.RecoveryServices/vaults/backupProtectedItems/write',
            'Microsoft.RecoveryServices/vaults/backupJobs/read',
            'Microsoft.RecoveryServices/vaults/replicationFabrics/read',
            'Microsoft.RecoveryServices/vaults/replicationFabrics/write'
        ]
    },
    {
        provider: 'Microsoft.Resources',
        operations: [
            'Microsoft.Resources/*',
            'Microsoft.Resources/subscriptions/read',
            'Microsoft.Resources/subscriptions/resourceGroups/read',
            'Microsoft.Resources/subscriptions/resourceGroups/write',
            'Microsoft.Resources/subscriptions/resourceGroups/delete',
            'Microsoft.Resources/deployments/*',
            'Microsoft.Resources/deployments/read',
            'Microsoft.Resources/deployments/write',
            'Microsoft.Resources/deployments/delete',
            'Microsoft.Resources/deployments/validate/action',
            'Microsoft.Resources/deployments/cancel/action',
            'Microsoft.Resources/tags/read',
            'Microsoft.Resources/tags/write',
            'Microsoft.Resources/tags/delete',
            'Microsoft.Resources/checkResourceName/action'
        ]
    },
    {
        provider: 'Microsoft.Security',
        operations: [
            'Microsoft.Security/*',
            'Microsoft.Security/assessments/read',
            'Microsoft.Security/assessments/write',
            'Microsoft.Security/alerts/read',
            'Microsoft.Security/alerts/write',
            'Microsoft.Security/securityContacts/read',
            'Microsoft.Security/securityContacts/write',
            'Microsoft.Security/pricings/read',
            'Microsoft.Security/pricings/write',
            'Microsoft.Security/secureScores/read',
            'Microsoft.Security/regulatoryComplianceStandards/read',
            'Microsoft.Security/autoProvisioningSettings/read',
            'Microsoft.Security/autoProvisioningSettings/write'
        ]
    },
    {
        provider: 'Microsoft.ServiceBus',
        operations: [
            'Microsoft.ServiceBus/*',
            'Microsoft.ServiceBus/namespaces/*',
            'Microsoft.ServiceBus/namespaces/read',
            'Microsoft.ServiceBus/namespaces/write',
            'Microsoft.ServiceBus/namespaces/delete',
            'Microsoft.ServiceBus/namespaces/authorizationRules/listKeys/action',
            'Microsoft.ServiceBus/namespaces/regenerateKeys/action',
            'Microsoft.ServiceBus/namespaces/queues/read',
            'Microsoft.ServiceBus/namespaces/queues/write',
            'Microsoft.ServiceBus/namespaces/queues/delete',
            'Microsoft.ServiceBus/namespaces/topics/read',
            'Microsoft.ServiceBus/namespaces/topics/write',
            'Microsoft.ServiceBus/namespaces/topics/delete',
            'Microsoft.ServiceBus/namespaces/topics/subscriptions/read',
            'Microsoft.ServiceBus/namespaces/topics/subscriptions/write',
            'Microsoft.ServiceBus/namespaces/topics/subscriptions/delete'
        ]
    },
    {
        provider: 'Microsoft.Sql',
        operations: [
            'Microsoft.Sql/*',
            'Microsoft.Sql/servers/*',
            'Microsoft.Sql/servers/read',
            'Microsoft.Sql/servers/write',
            'Microsoft.Sql/servers/delete',
            'Microsoft.Sql/servers/databases/*',
            'Microsoft.Sql/servers/databases/read',
            'Microsoft.Sql/servers/databases/write',
            'Microsoft.Sql/servers/databases/delete',
            'Microsoft.Sql/servers/databases/pause/action',
            'Microsoft.Sql/servers/databases/resume/action',
            'Microsoft.Sql/servers/firewallRules/read',
            'Microsoft.Sql/servers/firewallRules/write',
            'Microsoft.Sql/servers/firewallRules/delete',
            'Microsoft.Sql/servers/elasticPools/read',
            'Microsoft.Sql/servers/elasticPools/write',
            'Microsoft.Sql/servers/elasticPools/delete',
            'Microsoft.Sql/servers/administrators/read',
            'Microsoft.Sql/servers/administrators/write'
        ]
    },
    {
        provider: 'Microsoft.Storage',
        operations: [
            'Microsoft.Storage/*',
            'Microsoft.Storage/storageAccounts/*',
            'Microsoft.Storage/storageAccounts/read',
            'Microsoft.Storage/storageAccounts/write',
            'Microsoft.Storage/storageAccounts/delete',
            'Microsoft.Storage/storageAccounts/listKeys/action',
            'Microsoft.Storage/storageAccounts/regenerateKey/action',
            'Microsoft.Storage/storageAccounts/listAccountSas/action',
            'Microsoft.Storage/storageAccounts/listServiceSas/action',
            'Microsoft.Storage/storageAccounts/blobServices/read',
            'Microsoft.Storage/storageAccounts/blobServices/containers/read',
            'Microsoft.Storage/storageAccounts/blobServices/containers/write',
            'Microsoft.Storage/storageAccounts/blobServices/containers/delete',
            'Microsoft.Storage/storageAccounts/fileServices/read',
            'Microsoft.Storage/storageAccounts/fileServices/shares/read',
            'Microsoft.Storage/storageAccounts/fileServices/shares/write',
            'Microsoft.Storage/storageAccounts/fileServices/shares/delete',
            'Microsoft.Storage/storageAccounts/tableServices/read',
            'Microsoft.Storage/storageAccounts/tableServices/tables/read',
            'Microsoft.Storage/storageAccounts/tableServices/tables/write',
            'Microsoft.Storage/storageAccounts/queueServices/read',
            'Microsoft.Storage/storageAccounts/queueServices/queues/read',
            'Microsoft.Storage/storageAccounts/queueServices/queues/write'
        ]
    },
    {
        provider: 'Microsoft.Synapse',
        operations: [
            'Microsoft.Synapse/*',
            'Microsoft.Synapse/workspaces/*',
            'Microsoft.Synapse/workspaces/read',
            'Microsoft.Synapse/workspaces/write',
            'Microsoft.Synapse/workspaces/delete',
            'Microsoft.Synapse/workspaces/sqlPools/read',
            'Microsoft.Synapse/workspaces/sqlPools/write',
            'Microsoft.Synapse/workspaces/sqlPools/delete',
            'Microsoft.Synapse/workspaces/sqlPools/pause/action',
            'Microsoft.Synapse/workspaces/sqlPools/resume/action',
            'Microsoft.Synapse/workspaces/bigDataPools/read',
            'Microsoft.Synapse/workspaces/bigDataPools/write',
            'Microsoft.Synapse/workspaces/bigDataPools/delete',
            'Microsoft.Synapse/workspaces/pipelines/read',
            'Microsoft.Synapse/workspaces/pipelines/write',
            'Microsoft.Synapse/workspaces/integrationruntimes/read'
        ]
    },
    {
        provider: 'Microsoft.Web',
        operations: [
            'Microsoft.Web/*',
            'Microsoft.Web/sites/*',
            'Microsoft.Web/sites/read',
            'Microsoft.Web/sites/write',
            'Microsoft.Web/sites/delete',
            'Microsoft.Web/sites/start/action',
            'Microsoft.Web/sites/stop/action',
            'Microsoft.Web/sites/restart/action',
            'Microsoft.Web/sites/publish/action',
            'Microsoft.Web/sites/config/read',
            'Microsoft.Web/sites/config/write',
            'Microsoft.Web/sites/slots/read',
            'Microsoft.Web/sites/slots/write',
            'Microsoft.Web/sites/slots/delete',
            'Microsoft.Web/sites/slots/swap/action',
            'Microsoft.Web/serverfarms/read',
            'Microsoft.Web/serverfarms/write',
            'Microsoft.Web/serverfarms/delete',
            'Microsoft.Web/certificates/read',
            'Microsoft.Web/certificates/write',
            'Microsoft.Web/certificates/delete'
        ]
    }
];

export const RBAC_ROLE_TEMPLATES = [
    {
        id: 'vmOperator',
        name: 'Virtual Machine Operator',
        category: 'Compute',
        description: 'Can start, stop, restart, and monitor virtual machines, and read related network interfaces.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.Compute/virtualMachines/start/action',
            'Microsoft.Compute/virtualMachines/restart/action',
            'Microsoft.Compute/virtualMachines/powerOff/action',
            'Microsoft.Compute/virtualMachines/deallocate/action',
            'Microsoft.Compute/virtualMachines/read',
            'Microsoft.Compute/virtualMachines/instanceView/read',
            'Microsoft.Network/networkInterfaces/read'
        ],
        notActions: []
    },
    {
        id: 'networkAdmin',
        name: 'Network Administrator',
        category: 'Networking',
        description: 'Can manage all network resources but cannot delete virtual networks.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.Network/*'
        ],
        notActions: [
            'Microsoft.Network/virtualNetworks/delete'
        ]
    },
    {
        id: 'resourceReader',
        name: 'Safe Reader',
        category: 'Governance & Security',
        description: 'Read-only access to all resources except Key Vault secrets and keys.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            '*/read'
        ],
        notActions: [
            'Microsoft.KeyVault/vaults/secrets/read',
            'Microsoft.KeyVault/vaults/keys/read'
        ]
    },
    {
        id: 'kvSecretUser',
        name: 'Key Vault Secrets User',
        category: 'Governance & Security',
        description: 'Read secrets from Key Vaults without ability to manage vault configurations or policies.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.KeyVault/vaults/read',
            'Microsoft.KeyVault/vaults/secrets/read'
        ],
        notActions: []
    },
    {
        id: 'aksAdmin',
        name: 'AKS Cluster Admin',
        category: 'Containers',
        description: 'Full management access to AKS clusters including cluster credentials retrieval.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.ContainerService/managedClusters/*',
            'Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action'
        ],
        notActions: []
    },
    {
        id: 'finopsAuditor',
        name: 'FinOps & Cost Auditor',
        category: 'Governance & Cost',
        description: 'Read-only access across cloud resources with dedicated management for budgets, alerts, and cost export reports.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            '*/read',
            'Microsoft.CostManagement/budgets/read',
            'Microsoft.CostManagement/budgets/write',
            'Microsoft.CostManagement/costReports/read'
        ],
        notActions: [
            'Microsoft.KeyVault/vaults/secrets/read',
            'Microsoft.KeyVault/vaults/keys/read'
        ]
    },
    {
        id: 'appServiceDev',
        name: 'App Service Developer',
        category: 'Web & Compute',
        description: 'Manage web apps, restart instances, and view diagnostic logs without ability to delete app services or plans.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.Web/sites/read',
            'Microsoft.Web/sites/write',
            'Microsoft.Web/sites/start/action',
            'Microsoft.Web/sites/stop/action',
            'Microsoft.Web/sites/restart/action'
        ],
        notActions: [
            'Microsoft.Web/sites/delete'
        ]
    },
    {
        id: 'dataEngineer',
        name: 'Data & Pipeline Operator',
        category: 'Data & Analytics',
        description: 'Execute and monitor Data Factory pipelines, read Cosmos DB accounts, and manage Synapse pools.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.DataFactory/factories/read',
            'Microsoft.DataFactory/factories/pipelines/read',
            'Microsoft.DataFactory/factories/pipelines/write',
            'Microsoft.DataFactory/factories/datasets/read',
            'Microsoft.DocumentDB/databaseAccounts/read',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/read',
            'Microsoft.Synapse/workspaces/read',
            'Microsoft.Synapse/workspaces/bigDataPools/read'
        ],
        notActions: [
            'Microsoft.DataFactory/factories/delete',
            'Microsoft.DocumentDB/databaseAccounts/delete'
        ]
    },
    {
        id: 'avdHelpdesk',
        name: 'AVD Helpdesk Operator',
        category: 'Virtual Desktop',
        description: 'Read and support Azure Virtual Desktop hostpools, session hosts, and restart user VMs.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.DesktopVirtualization/hostpools/read',
            'Microsoft.DesktopVirtualization/workspaces/read',
            'Microsoft.DesktopVirtualization/applicationgroups/read',
            'Microsoft.Compute/virtualMachines/read',
            'Microsoft.Compute/virtualMachines/restart/action',
            'Microsoft.Compute/virtualMachines/instanceView/read'
        ],
        notActions: [
            'Microsoft.DesktopVirtualization/hostpools/delete'
        ]
    },
    {
        id: 'storageOperator',
        name: 'Storage Operator (No Delete)',
        category: 'Storage',
        description: 'Manage blobs and file shares on storage accounts while preventing accidental deletion of accounts or storage containers.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.Storage/storageAccounts/read',
            'Microsoft.Storage/storageAccounts/blobServices/read',
            'Microsoft.Storage/storageAccounts/blobServices/containers/read',
            'Microsoft.Storage/storageAccounts/blobServices/containers/write',
            'Microsoft.Storage/storageAccounts/fileServices/shares/read',
            'Microsoft.Storage/storageAccounts/fileServices/shares/write'
        ],
        notActions: [
            'Microsoft.Storage/storageAccounts/delete',
            'Microsoft.Storage/storageAccounts/blobServices/containers/delete',
            'Microsoft.Storage/storageAccounts/fileServices/shares/delete'
        ]
    },
    {
        id: 'logicAppDev',
        name: 'Logic Apps Developer',
        category: 'Integration',
        description: 'Read, write, enable, disable, and review execution histories for Logic Apps workflows.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.Logic/workflows/read',
            'Microsoft.Logic/workflows/write',
            'Microsoft.Logic/workflows/enable/action',
            'Microsoft.Logic/workflows/disable/action',
            'Microsoft.Logic/workflows/runs/read'
        ],
        notActions: [
            'Microsoft.Logic/workflows/delete'
        ]
    },
    {
        id: 'dbAdmin',
        name: 'Database Operator',
        category: 'Databases',
        description: 'Manage SQL servers, databases, and Cosmos DB accounts with deletion protection.',
        assignableScopes: '/subscriptions/00000000-0000-0000-0000-000000000000',
        actions: [
            'Microsoft.Sql/servers/read',
            'Microsoft.Sql/servers/databases/read',
            'Microsoft.Sql/servers/databases/write',
            'Microsoft.DocumentDB/databaseAccounts/read',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/read',
            'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/write'
        ],
        notActions: [
            'Microsoft.Sql/servers/delete',
            'Microsoft.Sql/servers/databases/delete',
            'Microsoft.DocumentDB/databaseAccounts/delete'
        ]
    }
];
