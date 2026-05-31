export const PREMADE_POLICIES = [
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Remote work'], 
        desc: 'Establishes a foundational zero-trust security posture by mandating Multi-factor Authentication (MFA) for all users across all cloud applications. This policy acts as the critical baseline defense against identity-based attacks like credential theft, phishing, and password spraying. Implementing this policy significantly reduces the risk of account compromise and is considered a mandatory requirement for any modern security architecture.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-mfa-strength',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts.\nExclude: Directory Synchronization Accounts (if using Entra Connect)." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Grant", value: "Grant access -> Require authentication strength: Multifactor authentication strength." }
        ]
    },
    { 
        name: 'CA-Admins-AllApps-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], 
        desc: 'Enforces strict Multi-factor Authentication for all privileged administrative roles (e.g., Global Administrator, Security Administrator) across all applications. Because administrative accounts hold the \'keys to the kingdom\', they are high-value targets for threat actors. This policy ensures that even if an administrator\'s credentials are compromised, unauthorized access to your tenant\'s infrastructure is prevented.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-admin',
        settings: [
            { label: "Users", value: "Include: Directory roles — Global Admin, App Admin, Auth Admin, Billing Admin, Cloud App Admin, CA Admin, Exchange Admin, Helpdesk Admin, Password Admin, Privileged Auth Admin, Privileged Role Admin, Security Admin, SharePoint Admin, User Admin.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-Admins-MsAdminPortals-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], 
        desc: 'Requires Multi-factor Authentication whenever highly privileged users attempt to access Microsoft management portals (such as the Entra admin center, Azure portal, or Microsoft 365 admin center). This creates an isolated and secure control plane, specifically protecting the administrative interfaces where tenant-wide changes can be made.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-admin-portals',
        settings: [
            { label: "Users", value: "Include: Directory roles — Global Admin, App Admin, Auth Admin, Billing Admin, Cloud App Admin, CA Admin, Exchange Admin, Helpdesk Admin, Password Admin, Privileged Auth Admin, Privileged Role Admin, Security Admin, SharePoint Admin, User Admin.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: Select resources — Microsoft Admin Portals." },
            { label: "Grant", value: "Grant access -> Require authentication strength: Multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AzurePortal-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], 
        desc: 'Secures Azure infrastructure by mandating Multi-factor Authentication for any user attempting to access Azure management endpoints, such as the Azure Portal or Azure Resource Manager APIs. This is crucial for preventing unauthorized resource modification, deployment of malicious infrastructure, or access to sensitive data stored in Azure services.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: Select resources — Windows Azure Service Management API." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-BlockLegacyAuth', 
        categories: ['Secure foundation', 'Zero Trust', 'Remote work', 'Emerging threats'], 
        desc: 'Proactively blocks legacy authentication protocols (such as POP3, IMAP, SMTP, and older Office clients) that cannot natively enforce Multi-factor Authentication. Legacy protocols are heavily exploited by automated credential stuffing and password spray attacks. Blocking them significantly reduces your attack surface and forces users onto modern, secure authentication flows.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Client apps: Exchange ActiveSync clients, Other clients." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-AllUsers-SecurityInfo-AnyPlatform-RequireMFA', 
        categories: ['Secure foundation', 'Zero Trust', 'Remote work'], 
        desc: 'Secures the credential enrollment process by requiring users to successfully perform Multi-factor Authentication before registering or modifying their security info (MFA methods or SSPR details). This prevents attackers who have compromised a password from independently registering their own MFA device and locking the legitimate user out of their account.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-security-info-registration',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: All guest and external users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "User actions: Register security information." },
            { label: "Conditions", value: "Locations: Include Any location.\nExclude: All trusted locations." },
            { label: "Grant", value: "Grant access -> Require authentication strength: Multifactor authentication strength." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequireCompliant', 
        categories: ['Secure foundation', 'Zero Trust', 'Remote work'], 
        desc: 'Enforces device-level security trust by requiring endpoints to be marked as compliant by Microsoft Intune before accessing organizational data. This ensures that users can only access company resources from devices that meet your minimum security baselines (e.g., active antivirus, device encryption, latest OS patches). Requires Intune compliance policies to be configured first.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts.\nExclude: Directory Synchronization Accounts (if using Entra Connect)." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Grant", value: "Grant access -> Require device to be marked as compliant." }
        ]
    },
    { 
        name: 'CA-Guests-AllApps-AnyPlatform-RequireMFA', 
        categories: ['Zero Trust', 'Remote work'], 
        desc: 'Secures B2B collaboration by ensuring that all external partners, vendors, and guest users must perform Multi-factor Authentication before accessing your tenant\'s resources. External identities are often outside your direct control, making this policy a critical layer of defense against compromised partner accounts infiltrating your environment.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-guest',
        settings: [
            { label: "Users", value: "Include: All guest and external users." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Grant", value: "Grant access -> Require multifactor authentication." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMfaForRisk', 
        categories: ['Zero Trust', 'Remote work', 'Emerging threats'], 
        desc: 'Leverages the machine-learning capabilities of Microsoft Entra ID Protection to dynamically require Multi-factor Authentication when a medium or high sign-in risk is detected. This adaptive control provides real-time defense against anomalous login attempts, such as sign-ins from unfamiliar locations, anonymous IP addresses, or atypical travel, minimizing friction for normal logins. Requires Microsoft Entra ID P2.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-sign-in',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Sign-in risk: High, Medium." },
            { label: "Grant", value: "Grant access -> Require authentication strength: Multifactor authentication strength." },
            { label: "Session", value: "Sign-in frequency: Every time." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequirePasswordChange', 
        categories: ['Zero Trust', 'Remote work', 'Emerging threats'], 
        desc: 'Mitigates full account takeover by forcing an immediate, secure remediation when Microsoft Entra ID Protection flags a user\'s overall identity risk as high. A high user risk indicates that the user\'s credentials have likely been compromised (e.g., found leaked on the dark web). This policy enables self-remediation, allowing users to unblock themselves while reducing helpdesk burden. Requires Microsoft Entra ID P2.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-user',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "User risk: High." },
            { label: "Grant", value: "Grant access -> Require risk remediation (password change) + Require authentication strength (auto-selected)." },
            { label: "Session", value: "Sign-in frequency: Every time (applied automatically)." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-UnknownPlatform-Block', 
        categories: ['Zero Trust', 'Remote work', 'Emerging threats'], 
        desc: 'Prevents unauthorized data access by explicitly blocking sign-ins from device operating systems that are not officially supported or managed by your organization\'s IT department. This mitigates the risk of access from insecure or rooted devices, unsupported platforms, or obscured environments. Should be used alongside device compliance or app protection policies.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-unknown-unsupported',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Device platforms: Include Any device.\nExclude: Android, iOS, Windows, macOS (select platforms your org uses)." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-SessionControl', 
        categories: ['Zero Trust', 'Remote work'], 
        desc: 'Enhances session security on unmanaged and non-compliant devices by preventing persistent browser sessions and enforcing hourly reauthentication. Users must re-authenticate after 1 hour or when they close their browser. This is essential for protecting data when users access resources from shared, public, or unmanaged devices.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-persistent-browser',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Filter for devices: Include filtered devices in policy.\nRule: device.trustType -ne \"ServerAD\" -or device.isCompliant -ne True" },
            { label: "Grant", value: "Grant access" },
            { label: "Session", value: "Sign-in frequency: Periodic reauthentication — 1 Hour.\nPersistent browser session: Never persistent." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-AppProtection', 
        categories: ['Zero Trust', 'Remote work'], 
        desc: 'Safeguards corporate data on mobile devices by requiring users to access services via officially approved client apps or apps safeguarded by Intune App Protection Policies (MAM). This prevents data leakage by ensuring corporate data cannot be copied, pasted, or saved to unmanaged personal applications on BYOD devices.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-app-protection',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Device platforms: Include Android, iOS." },
            { label: "Grant", value: "Grant access -> Require approved client app OR Require app protection policy." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-BlockInsiderRisk', 
        categories: ['Zero Trust', 'Emerging threats'], 
        desc: 'Integrates natively with Microsoft Purview Insider Risk Management (Adaptive Protection) to automatically block access for users flagged with an elevated insider risk severity. This provides immediate, automated containment to prevent potential data exfiltration, malicious sabotage, or intellectual property theft by internal threat actors. Requires Microsoft Purview Insider Risk Management to be enabled first.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-insider-block',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts.\nExclude: Guest/external users — B2B direct connect, Service provider, Other external users." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Insider risk: Elevated." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-Admins-AzurePortal-AnyPlatform-RequirePhishResist', 
        categories: ['Protect administrator', 'Zero Trust'], 
        desc: 'Mandates the highest level of authentication strength (such as FIDO2 security keys, Passkeys, or Windows Hello for Business) for all privileged administrative roles across all applications. Standard MFA can be bypassed using adversary-in-the-middle (AiTM) proxy attacks. This policy provides robust, hardware-backed protection against advanced phishing campaigns targeting privileged accounts.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-admin-phish-resistant-mfa',
        settings: [
            { label: "Users", value: "Include: Directory roles — Global Admin, App Admin, Auth Admin, Billing Admin, Cloud App Admin, CA Admin, Exchange Admin, Helpdesk Admin, Password Admin, Privileged Auth Admin, Privileged Role Admin, Security Admin, SharePoint Admin, User Admin.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Grant", value: "Grant access -> Require authentication strength: Phishing-resistant MFA strength." }
        ]
    },
    { 
        name: 'CA-Admins-AllApps-AnyPlatform-RequireCompliant', 
        categories: ['Protect administrator', 'Remote work'], 
        desc: 'Enforces strict endpoint requirements for highly privileged users, ensuring administrators can only access corporate applications and management portals from devices that are actively managed, compliant with Intune policies, or Hybrid Entra joined. This prevents admins from managing the environment from insecure personal devices.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-alt-admin-device-compliand-hybrid',
        settings: [
            { label: "Users", value: "Include: Directory roles — Global Admin, App Admin, Auth Admin, Billing Admin, Cloud App Admin, CA Admin, Exchange Admin, Helpdesk Admin, Password Admin, Privileged Auth Admin, Privileged Role Admin, Security Admin, SharePoint Admin, User Admin.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Grant", value: "Grant access -> Require device to be marked as compliant OR Require Microsoft Entra hybrid joined device (Require one of the selected controls)." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-AppEnforced', 
        categories: ['Remote work'], 
        desc: 'Enables limited, web-only access to services like SharePoint or Exchange Online when accessed from unmanaged devices. By passing device state to the application, it uses application-enforced restrictions to prevent users from downloading, printing, or syncing sensitive data locally, allowing secure productivity from anywhere.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-app-enforced-restrictions',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: Select resources — Office 365." },
            { label: "Grant", value: "Grant access" },
            { label: "Session", value: "Use app enforced restrictions." }
        ]
    },
    { 
        name: 'CA-AIAgents-AllApps-AnyPlatform-BlockHighRiskAgentIdentities', 
        categories: ['AI Agents', 'Emerging threats'], 
        desc: 'Secures non-human identities by automatically blocking access for AI agent identities detected as high risk by Microsoft Entra ID Protection. As AI-driven automation increases, agent identities become prime targets. This policy ensures potentially compromised agents are immediately blocked before they can access your organisation\'s resources.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-agent-block-high-risk',
        settings: [
            { label: "Identities", value: "What does this policy apply to: Agents (Preview).\nInclude: All agent identities (Preview)." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Agent risk (Preview): High." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-BlockUntrustedLocations', 
        categories: ['Zero Trust', 'Secure foundation'], 
        desc: 'Reduces the attack surface by explicitly blocking all access attempts originating from countries or regions where your organization does not operate. This mitigates risks from foreign threat actors and botnets located outside your expected geographical footprint. PREREQUISITES: You must define your untrusted countries or IP ranges in Entra ID Named Locations before deploying this policy.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-policy-location',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Locations: Include Untrusted Locations (custom Named Location).\nExclude: MFA Trusted IPs." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-RequireTermsOfUse', 
        categories: ['Zero Trust', 'Secure foundation'], 
        desc: 'Ensures that internal and guest users legally acknowledge your organization\'s IT and security policies before accessing corporate resources. This is essential for compliance, auditing, and setting clear expectations for acceptable use of company data and systems. PREREQUISITES: You must create and publish a Terms of Use document (PDF) in Entra ID before deploying this policy.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/terms-of-use',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Grant", value: "Grant access -> Require accepted terms of use." }
        ]
    },
    { 
        name: 'CA-WorkloadIdentities-AllApps-AnyPlatform-BlockUntrustedLocations', 
        categories: ['Zero Trust', 'Emerging threats'], 
        desc: 'Protects automated processes and service principals by restricting where they can authenticate from. By blocking workload identities from authenticating outside of known trusted IP ranges (such as your Azure VNets or corporate datacenters), you prevent attackers from using compromised client secrets or certificates from external networks. PREREQUISITES: You must define your corporate egress IPs and Azure VNets in Entra ID Named Locations as trusted IPs before deploying.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-workload-identities',
        settings: [
            { label: "Identities", value: "What does this policy apply to: Workload identities.\nInclude: All service principals." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Locations: Include Any location.\nExclude: Trusted locations (e.g., Azure VNet IPs, Datacenter IPs)." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-Guests-SensitiveApps-AnyPlatform-BlockAccess', 
        categories: ['Zero Trust'], 
        desc: 'Explicitly prevents external guests, vendors, and B2B collaborators from accessing highly sensitive applications or administrative portals. This establishes a hard boundary, ensuring that even if a guest account is compromised, the blast radius is contained and critical systems remain isolated.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-policy-block-access',
        settings: [
            { label: "Users", value: "Include: All guest and external users." },
            { label: "Target resources", value: "Include: Select resources — highly sensitive or administrative apps." },
            { label: "Grant", value: "Block access." }
        ]
    },
    { 
        name: 'CA-Admins-AllApps-AnyPlatform-SignInFrequency', 
        categories: ['Protect administrator', 'Zero Trust'], 
        desc: 'Instead of relying on default token lifetimes, this policy enforces a strict sign-in frequency (e.g., every 24 hours) for privileged roles. This ensures that administrative sessions do not stay alive indefinitely, reducing the window of opportunity if a session token is stolen.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-session-lifetime',
        settings: [
            { label: "Users", value: "Include: Directory roles — Global Admin, Security Admin, Privileged Role Admin, etc.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Grant", value: "Grant access" },
            { label: "Session", value: "Sign-in frequency: Periodic reauthentication — 24 Hours." }
        ]
    },
    { 
        name: 'CA-AllUsers-AllApps-AnyPlatform-EnforceCAE', 
        categories: ['Zero Trust', 'Secure foundation'], 
        desc: 'Ensures Continuous Access Evaluation (CAE) is strictly enforced. With CAE, critical events (like a user password change, account disablement, or location change) are evaluated in real-time. PREREQUISITES: To deploy this, IP-based Named Locations MUST be configured first. All authentication and access traffic must originate from known, dedicated egress IPs, otherwise legitimate users will be blocked.', 
        link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-continuous-access-evaluation',
        settings: [
            { label: "Users", value: "Include: All users.\nExclude: Break-glass / emergency access accounts." },
            { label: "Target resources", value: "Include: All resources (formerly 'All cloud apps')." },
            { label: "Conditions", value: "Locations: Include Any location. (Ensures CAE location evaluation triggers globally)" },
            { label: "Grant", value: "Grant access (Policy serves primarily to apply the session control)." },
            { label: "Session", value: "Customize continuous access evaluation: Strictly enforce location policies." }
        ]
    }
];

export const CA_CATEGORIES = [
    'All',
    'AI Agents',
    'Emerging threats',
    'Protect administrator',
    'Remote work',
    'Secure foundation',
    'Zero Trust'
];

export const TITLE_OVERRIDES = {
    'RequireMFA': 'Require Multi-factor Authentication',
    'RequirePhishResist': 'Require Phishing-Resistant Multi-factor Authentication',
    'RequireMfaForRisk': 'Require Multi-factor Authentication for Risk',
    'RequireCompliant': 'Require Compliant Device',
    'RequirePasswordChange': 'Require Password Change',
    'AppProtection': 'Require App Protection',
    'AppEnforced': 'App Enforced Restrictions',
    'Block': 'Block Unknown Platforms',
    'BlockHighRiskAgentIdentities': 'Block high-risk agent identities',
    'BlockInsiderRisk': 'Block Insider Risk',
    'BlockLegacyAuth': 'Block Legacy Authentication',
    'SessionControl': 'Session Control',
    'RequireTermsOfUse': 'Require Terms of Use',
    'BlockAccess': 'Block Guests from Sensitive Apps',
    'SignInFrequency': 'Sign-in Frequency',
    'EnforceCAE': 'Enforce Continuous Access Evaluation'
};

export const getReadableTitle = (requirement) => {
    if (TITLE_OVERRIDES[requirement]) return TITLE_OVERRIDES[requirement];
    return requirement
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .trim();
};
