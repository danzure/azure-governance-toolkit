export function generateConditionalAccessTerraform(policyName, persona, resource, platform, action) {
    const isBlock = action.startsWith('Block');
    const isSession = action === 'SessionControl';
    
    let grantControl = '["mfa"]';
    if (isBlock) grantControl = '[]';
    else if (action === 'RequireCompliant') grantControl = '["compliantDevice"]';
    else if (action === 'RequirePhishResist') grantControl = '["phishingResistantMfa"]';
    else if (action === 'RequirePasswordChange') grantControl = '["passwordChange"]';
    
    let operator = isBlock ? 'OR' : 'AND';

    let usersInclude = '["All"]';
    if (persona === 'Admins') usersInclude = '["Role: Global Administrator"]';
    else if (persona === 'Guests') usersInclude = '["GuestsOrExternalUsers"]';
    else if (persona === 'AIAgents') usersInclude = '["ServicePrincipals"]';

    let appsInclude = '["All"]';
    if (resource === 'O365') appsInclude = '["Office365"]';
    else if (resource === 'AzurePortal') appsInclude = '["797f4846-ba00-4fd7-ba43-dac1f8f63013"]';
    
    let platformsInclude = '["all"]';
    if (platform !== 'AnyPlatform') platformsInclude = `["${platform.toLowerCase()}"]`;

    return `resource "azurerm_conditional_access_policy" "generated_policy" {
  name  = "${policyName}"
  state = "reportOnly" # Recommended baseline

  conditions {
    client_app_types = ["all"]

    applications {
      included_applications = ${appsInclude}
      excluded_applications = []
    }

    users {
      included_users = ${usersInclude}
      excluded_users = [] # Consider adding break-glass accounts
    }

    platforms {
      included_platforms = ${platformsInclude}
      excluded_platforms = []
    }
  }

  ${isSession ? `session_controls {
    sign_in_frequency = 1
    sign_in_frequency_period = "hours"
  }` : `grant_controls {
    operator          = "${operator}"
    built_in_controls = ${grantControl}
  }`}
}`;
}

export function generateConditionalAccessJSON(policyName, persona, resource, platform, action) {
    const isBlock = action.startsWith('Block');
    
    let grantControl = ["mfa"];
    if (isBlock) grantControl = ["block"];
    else if (action === 'RequireCompliant') grantControl = ["compliantDevice"];
    else if (action === 'RequirePhishResist') grantControl = ["phishingResistantMfa"];
    else if (action === 'RequirePasswordChange') grantControl = ["passwordChange"];

    let usersInclude = ["All"];
    if (persona === 'Admins') usersInclude = ["Role: Global Administrator"];
    else if (persona === 'Guests') usersInclude = ["GuestsOrExternalUsers"];

    let appsInclude = ["All"];
    if (resource === 'O365') appsInclude = ["Office365"];
    else if (resource === 'AzurePortal') appsInclude = ["797f4846-ba00-4fd7-ba43-dac1f8f63013"];

    let platformsInclude = ["all"];
    if (platform !== 'AnyPlatform') platformsInclude = [platform.toLowerCase()];

    const payload = {
        displayName: policyName,
        state: "enabledForReportingButNotEnforced",
        conditions: {
            clientAppTypes: ["all"],
            applications: {
                includeApplications: appsInclude,
                excludeApplications: []
            },
            users: {
                includeUsers: usersInclude,
                excludeUsers: []
            },
            platforms: {
                includePlatforms: platformsInclude,
                excludePlatforms: []
            }
        },
        grantControls: {
            operator: isBlock ? "OR" : "AND",
            builtInControls: grantControl
        }
    };

    return JSON.stringify(payload, null, 2);
}
