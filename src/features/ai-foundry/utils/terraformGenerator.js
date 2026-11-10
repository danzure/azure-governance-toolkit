import { FQDN_CATEGORIES } from '../data/fqdnAllowlists';
import { getFoundryResourceNames } from './foundryNaming';

/**
 * Generates enterprise Terraform configuration (azurerm / azapi) for Azure AI Foundry
 * Aligned strictly with the Cloud Adoption Framework (CAF) Resource Naming standard.
 * 
 * @param {Object} config - AI Foundry configuration object
 * @returns {string} Fully formatted Terraform HCL code
 */
export function generateTerraformTemplate(config) {
    const {
        workload = 'coreai',
        environment = 'prod',
        region = 'uksouth',
        networkMode = 'private',
        managedVnetMode = 'AllowOnlyApprovedOutbound',
        enableAiSearch = true,
        searchSku = 'standard',
        searchSemanticRanker = true,
        enableOpenAi = true,
        openAiSku = 'S0',
        modelDeployments = [],
        identityType = 'UserAssigned',
        disableLocalAuth = true,
        enableCmk = false,
        enableAppInsights = true,
        enableContainerRegistry = false,
        allowedFqdns = ['pypi', 'huggingface', 'github']
    } = config;

    const names = getFoundryResourceNames(config);
    const isPrivate = networkMode === 'private';
    const isUami = identityType === 'UserAssigned';

    const selectedFqdnEndpoints = [];
    allowedFqdns.forEach(catId => {
        const cat = FQDN_CATEGORIES.find(c => c.id === catId);
        if (cat) selectedFqdnEndpoints.push(...cat.endpoints);
    });

    return `# =============================================================================
# Terraform Configuration for Azure AI Foundry Landing Zone
# Provider: azurerm (>= 3.100.0) & azapi (>= 1.13.0)
# Cloud Adoption Framework (CAF) Compliant
# =============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.110.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "~> 1.13.0"
    }
  }
}

variable "location" {
  type        = string
  default     = "${region}"
  description = "Azure region for all AI Foundry resources"
}

variable "environment" {
  type        = string
  default     = "${environment}"
  description = "Deployment environment tier"
}

locals {
  tags = {
    Workload                = "${workload}"
    Environment             = var.environment
    ManagedBy               = "Azure AI Foundry Designer"
    CloudAdoptionFramework  = "Enterprise Landing Zone"
  }
}

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "${names.rgName}"
  location = var.location
  tags     = local.tags
}

# -----------------------------------------------------------------------------
# 1. Foundation: Storage Account, Key Vault, Telemetry
# -----------------------------------------------------------------------------

resource "azurerm_storage_account" "st" {
  name                     = "${names.storageName}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  min_tls_version          = "TLS1_2"
  public_network_access_enabled = ${isPrivate ? 'false' : 'true'}
  tags                     = local.tags
}

resource "azurerm_key_vault" "kv" {
  name                     = "${names.keyVaultName}"
  location                 = azurerm_resource_group.rg.location
  resource_group_name      = azurerm_resource_group.rg.name
  tenant_id                = data.azurerm_client_config.current.tenant_id
  sku_name                 = "${enableCmk ? 'premium' : 'standard'}"
  purge_protection_enabled = ${enableCmk ? 'true' : 'false'}
  soft_delete_retention_days = 90
  enable_rbac_authorization = true
  public_network_access_enabled = ${isPrivate ? 'false' : 'true'}
  tags                     = local.tags
}

data "azurerm_client_config" "current" {}
${enableAppInsights ? `
resource "azurerm_log_analytics_workspace" "log" {
  name                = "${names.logAnalyticsName}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

resource "azurerm_application_insights" "appinsights" {
  name                = "${names.appInsightsName}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.log.id
  tags                = local.tags
}
` : ''}${enableContainerRegistry ? `
resource "azurerm_container_registry" "acr" {
  name                = "${names.acrName}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "${isPrivate ? 'Premium' : 'Standard'}"
  admin_enabled       = false
  public_network_access_enabled = ${isPrivate ? 'false' : 'true'}
  tags                = local.tags
}
` : ''}${isUami ? `
resource "azurerm_user_assigned_identity" "ai_uami" {
  name                = "${names.uamiName}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                = local.tags
}
` : ''}${enableOpenAi ? `
# -----------------------------------------------------------------------------
# 2. Azure AI Services / OpenAI Account
# -----------------------------------------------------------------------------

resource "azurerm_cognitive_account" "openai" {
  name                          = "${names.openAiName}"
  location                      = azurerm_resource_group.rg.location
  resource_group_name           = azurerm_resource_group.rg.name
  kind                          = "AIServices"
  sku_name                      = "${openAiSku}"
  custom_subdomain_name         = "${names.openAiName}"
  public_network_access_enabled = ${isPrivate ? 'false' : 'true'}
  local_auth_enabled            = ${!disableLocalAuth}
  tags                          = local.tags
${isUami ? `  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.ai_uami.id]
  }` : `  identity {
    type = "SystemAssigned"
  }`}
}
${modelDeployments.map(m => `
resource "azurerm_cognitive_deployment" "model_${m.name.replace(/[^a-zA-Z0-9]/g, '_')}" {
  name                 = "${m.name}"
  cognitive_account_id = azurerm_cognitive_account.openai.id
  model {
    format  = "OpenAI"
    name    = "${m.model}"
    version = "${m.version}"
  }
  scale {
    type     = "${m.sku}"
    capacity = ${m.capacity}
  }
} `).join('\n')}` : ''}${enableAiSearch ? `
# -----------------------------------------------------------------------------
# 3. Azure AI Search
# -----------------------------------------------------------------------------

resource "azurerm_search_service" "search" {
  name                          = "${names.searchName}"
  resource_group_name           = azurerm_resource_group.rg.name
  location                      = azurerm_resource_group.rg.location
  sku                           = "${searchSku}"
  replica_count                 = 1
  partition_count               = 1
  public_network_access_enabled = ${isPrivate ? 'false' : 'true'}
  semantic_search_sku           = "${searchSemanticRanker ? 'standard' : 'free'}"
  tags                          = local.tags
${isUami ? `  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.ai_uami.id]
  }` : `  identity {
    type = "SystemAssigned"
  }`}
}
` : ''}
# -----------------------------------------------------------------------------
# 4. Azure AI Foundry Hub (azapi_resource for latest Hub specification)
# -----------------------------------------------------------------------------

resource "azapi_resource" "ai_hub" {
  type      = "Microsoft.MachineLearningServices/workspaces@2024-07-01-preview"
  name      = "${names.hubName}"
  location  = azurerm_resource_group.rg.location
  parent_id = azurerm_resource_group.rg.id
  tags      = local.tags
${isUami ? `  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.ai_uami.id]
  }` : `  identity {
    type = "SystemAssigned"
  }`}
  body = jsonencode({
    kind = "Hub"
    properties = {
      friendlyName        = "${names.hubName} Enterprise AI Platform"
      description         = "Central AI governance hub with shared compute, quotas, and security boundaries"
      storageAccount      = azurerm_storage_account.st.id
      keyVault            = azurerm_key_vault.kv.id
      ${enableAppInsights ? 'applicationInsights = azurerm_application_insights.appinsights.id' : ''}
      ${enableContainerRegistry ? 'containerRegistry    = azurerm_container_registry.acr.id' : ''}
      publicNetworkAccess = "${isPrivate ? 'Disabled' : 'Enabled'}"
      managedNetwork = {
        isolationMode = "${isPrivate ? managedVnetMode : 'Disabled'}"
        outboundRules = {
          "storage-blob" = {
            type     = "PrivateEndpoint"
            category = "Required"
            destination = {
              serviceResourceId = azurerm_storage_account.st.id
              subresourceTarget = "blob"
              sparkEnabled      = false
            }
          }
          "key-vault" = {
            type     = "PrivateEndpoint"
            category = "Required"
            destination = {
              serviceResourceId = azurerm_key_vault.kv.id
              subresourceTarget = "vault"
              sparkEnabled      = false
            }
          }
${enableAiSearch ? `          "ai-search" = {
            type     = "PrivateEndpoint"
            category = "Recommended"
            destination = {
              serviceResourceId = azurerm_search_service.search.id
              subresourceTarget = "searchService"
              sparkEnabled      = false
            }
          }` : ''}
${selectedFqdnEndpoints.map((fqdn, idx) => `          "fqdn-rule-${idx + 1}" = {
            type        = "FQDN"
            category    = "UserDefined"
            destination = "${fqdn}"
          }`).join('\n')}
        }
      }
    }
  })
}
${enableOpenAi ? `
# Connection from AI Hub to AI Services (OpenAI)
resource "azapi_resource" "hub_openai_connection" {
  type      = "Microsoft.MachineLearningServices/workspaces/connections@2024-07-01-preview"
  name      = "conn-openai-default"
  parent_id = azapi_resource.ai_hub.id
  body = jsonencode({
    properties = {
      category      = "AzureOpenAI"
      target        = azurerm_cognitive_account.openai.endpoint
      authType      = "AAD"
      isSharedToAll = true
      metadata = {
        ApiType    = "Azure"
        ResourceId = azurerm_cognitive_account.openai.id
      }
    }
  })
}
` : ''}${enableAiSearch ? `
# Connection from AI Hub to Azure AI Search
resource "azapi_resource" "hub_search_connection" {
  type      = "Microsoft.MachineLearningServices/workspaces/connections@2024-07-01-preview"
  name      = "conn-search-default"
  parent_id = azapi_resource.ai_hub.id
  body = jsonencode({
    properties = {
      category      = "CognitiveSearch"
      target        = "https://\${azurerm_search_service.search.name}.search.windows.net"
      authType      = "AAD"
      isSharedToAll = true
      metadata = {
        ResourceId = azurerm_search_service.search.id
      }
    }
  })
}
` : ''}
# -----------------------------------------------------------------------------
# 5. Azure AI Foundry Projects
# -----------------------------------------------------------------------------
${names.projects.map((proj, i) => `
resource "azapi_resource" "ai_project_${i + 1}" {
  type      = "Microsoft.MachineLearningServices/workspaces@2024-07-01-preview"
  name      = "${proj.generatedName}"
  location  = azurerm_resource_group.rg.location
  parent_id = azurerm_resource_group.rg.id
  tags      = merge(local.tags, { Project = "${proj.name}" })
  body = jsonencode({
    kind = "Project"
    properties = {
      friendlyName  = "${proj.name}"
      description   = "${proj.description || 'AI Foundry Project workspace'}"
      hubResourceId = azapi_resource.ai_hub.id
    }
  })
}`).join('\n')}

output "ai_hub_id" {
  value = azapi_resource.ai_hub.id
}

output "ai_hub_name" {
  value = "${names.hubName}"
}
${enableOpenAi ? `
output "openai_endpoint" {
  value = azurerm_cognitive_account.openai.endpoint
}
` : ''}${enableAiSearch ? `
output "search_endpoint" {
  value = "https://\${azurerm_search_service.search.name}.search.windows.net"
}
` : ''}
`;
}

