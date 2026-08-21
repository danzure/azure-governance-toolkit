export const COMMON_RBAC_PROVIDERS = [
    {
        provider: 'Microsoft.Compute',
        operations: [
            'Microsoft.Compute/virtualMachines/read',
            'Microsoft.Compute/virtualMachines/write',
            'Microsoft.Compute/virtualMachines/delete',
            'Microsoft.Compute/virtualMachines/start/action',
            'Microsoft.Compute/virtualMachines/restart/action',
            'Microsoft.Compute/virtualMachines/powerOff/action',
            'Microsoft.Compute/virtualMachines/deallocate/action',
            'Microsoft.Compute/disks/read',
            'Microsoft.Compute/disks/write',
            'Microsoft.Compute/disks/delete'
        ]
    },
    {
        provider: 'Microsoft.Network',
        operations: [
            'Microsoft.Network/virtualNetworks/read',
            'Microsoft.Network/virtualNetworks/write',
            'Microsoft.Network/virtualNetworks/delete',
            'Microsoft.Network/networkInterfaces/read',
            'Microsoft.Network/networkInterfaces/write',
            'Microsoft.Network/networkInterfaces/delete',
            'Microsoft.Network/networkSecurityGroups/read',
            'Microsoft.Network/networkSecurityGroups/write',
            'Microsoft.Network/networkSecurityGroups/delete',
            'Microsoft.Network/publicIPAddresses/read',
            'Microsoft.Network/publicIPAddresses/write',
            'Microsoft.Network/publicIPAddresses/delete'
        ]
    },
    {
        provider: 'Microsoft.Storage',
        operations: [
            'Microsoft.Storage/storageAccounts/read',
            'Microsoft.Storage/storageAccounts/write',
            'Microsoft.Storage/storageAccounts/delete',
            'Microsoft.Storage/storageAccounts/listKeys/action',
            'Microsoft.Storage/storageAccounts/blobServices/read',
            'Microsoft.Storage/storageAccounts/fileServices/read',
            'Microsoft.Storage/storageAccounts/blobServices/containers/read',
            'Microsoft.Storage/storageAccounts/blobServices/containers/write',
            'Microsoft.Storage/storageAccounts/blobServices/containers/delete',
            'Microsoft.Storage/storageAccounts/fileServices/shares/read',
            'Microsoft.Storage/storageAccounts/fileServices/shares/write',
            'Microsoft.Storage/storageAccounts/fileServices/shares/delete'
        ]
    },
    {
        provider: 'Microsoft.KeyVault',
        operations: [
            'Microsoft.KeyVault/vaults/read',
            'Microsoft.KeyVault/vaults/write',
            'Microsoft.KeyVault/vaults/delete',
            'Microsoft.KeyVault/vaults/accessPolicies/write',
            'Microsoft.KeyVault/vaults/secrets/read',
            'Microsoft.KeyVault/vaults/secrets/write',
            'Microsoft.KeyVault/vaults/secrets/delete',
            'Microsoft.KeyVault/vaults/keys/read',
            'Microsoft.KeyVault/vaults/keys/write',
            'Microsoft.KeyVault/vaults/keys/delete',
            'Microsoft.KeyVault/vaults/certificates/read',
            'Microsoft.KeyVault/vaults/certificates/write',
            'Microsoft.KeyVault/vaults/certificates/delete'
        ]
    },
    {
        provider: 'Microsoft.Web',
        operations: [
            'Microsoft.Web/sites/read',
            'Microsoft.Web/sites/write',
            'Microsoft.Web/sites/delete',
            'Microsoft.Web/sites/start/action',
            'Microsoft.Web/sites/stop/action',
            'Microsoft.Web/sites/restart/action'
        ]
    },
    {
        provider: 'Microsoft.Authorization',
        operations: [
            'Microsoft.Authorization/roleAssignments/read',
            'Microsoft.Authorization/roleAssignments/write',
            'Microsoft.Authorization/roleAssignments/delete',
            'Microsoft.Authorization/roleDefinitions/read'
        ]
    },
    {
        provider: 'Microsoft.ContainerService',
        operations: [
            'Microsoft.ContainerService/managedClusters/read',
            'Microsoft.ContainerService/managedClusters/write',
            'Microsoft.ContainerService/managedClusters/delete',
            'Microsoft.ContainerService/managedClusters/start/action',
            'Microsoft.ContainerService/managedClusters/stop/action',
            'Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action'
        ]
    },
    {
        provider: 'Microsoft.CostManagement',
        operations: [
            'Microsoft.CostManagement/budgets/read',
            'Microsoft.CostManagement/budgets/write',
            'Microsoft.CostManagement/budgets/delete',
            'Microsoft.CostManagement/costReports/read'
        ]
    },
    {
        provider: 'Microsoft.Sql',
        operations: [
            'Microsoft.Sql/servers/read',
            'Microsoft.Sql/servers/write',
            'Microsoft.Sql/servers/delete',
            'Microsoft.Sql/servers/databases/read',
            'Microsoft.Sql/servers/databases/write',
            'Microsoft.Sql/servers/databases/delete'
        ]
    }
];
