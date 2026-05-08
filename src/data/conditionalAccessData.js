export const PREMADE_POLICIES = [
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMFA', categories: ['Secure foundation', 'Zero Trust', 'Remote work'], desc: 'Establishes a foundational security posture by mandating Multi-factor Authentication for all users across all cloud applications. This is the critical baseline defense against credential theft, phishing, and password spray attacks.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-mfa-strength' },
    { name: 'CA-Admins-AllApps-AnyPlatform-RequireMFA', categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], desc: 'Enforces strict Multi-factor Authentication for all privileged administrative roles (e.g., Global Administrator, Security Administrator) across all applications. This protects highly sensitive accounts that hold the keys to your tenant\'s infrastructure.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-admin' },
    { name: 'CA-Admins-MsAdminPortals-AnyPlatform-RequireMFA', categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], desc: 'Requires Multi-factor Authentication whenever privileged users attempt to access Microsoft management portals (such as the Entra, Azure, or Microsoft 365 admin centers). This secures the control plane against unauthorized administrative access.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-admin-portals' },
    { name: 'CA-AllUsers-AzurePortal-AnyPlatform-RequireMFA', categories: ['Secure foundation', 'Zero Trust', 'Protect administrator'], desc: 'Secures Azure infrastructure by mandating Multi-factor Authentication for any user attempting to access Azure management endpoints, such as the Azure Portal or Azure Resource Manager APIs, preventing unauthorized resource modification.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-BlockLegacyAuth', categories: ['Secure foundation', 'Zero Trust', 'Remote work', 'Emerging threats'], desc: 'Proactively blocks legacy authentication protocols (such as POP3, IMAP, and older Office clients) that cannot enforce Multi-factor Authentication. This significantly reduces the attack surface against automated credential stuffing and password spray attacks.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication' },
    { name: 'CA-AllUsers-SecurityInfo-AnyPlatform-RequireMFA', categories: ['Secure foundation', 'Zero Trust', 'Remote work'], desc: 'Secures the credential enrollment process by requiring users to be on a trusted network or to successfully perform Multi-factor Authentication before registering or modifying their security info, preventing attackers from hijacking MFA methods.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-security-info-registration' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireCompliant', categories: ['Secure foundation', 'Zero Trust', 'Remote work'], desc: 'Enforces device-level security by requiring endpoints to be either marked as compliant by Microsoft Intune or Hybrid Entra joined before accessing organizational data. This ensures devices meet minimum security baselines (e.g., active antivirus, encryption).', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance' },

    { name: 'CA-Guests-AllApps-AnyPlatform-RequireMFA', categories: ['Zero Trust', 'Remote work'], desc: 'Secures B2B collaboration by ensuring that all external and guest users must perform Multi-factor Authentication before accessing your tenant\'s resources, mitigating risks associated with compromised external partner accounts.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-old-require-mfa-guest' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequireMfaForRisk', categories: ['Zero Trust', 'Remote work', 'Emerging threats'], desc: 'Leverages Microsoft Entra ID Protection to dynamically require Multi-factor Authentication when a medium or high sign-in risk is detected. This adaptive control provides real-time defense against anomalous login attempts, such as unfamiliar locations or anonymous IP addresses.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-sign-in' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-RequirePasswordChange', categories: ['Zero Trust', 'Remote work', 'Emerging threats'], desc: 'Mitigates account takeover by forcing an immediate, secure password change when Microsoft Entra ID Protection flags a user\'s overall identity risk as high (e.g., leaked credentials found on the dark web).', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-user' },
    { name: 'CA-AllUsers-AllApps-UnknownPlatform-Block', categories: ['Zero Trust', 'Remote work', 'Emerging threats'], desc: 'Prevents unauthorized data access by blocking sign-ins from device operating systems that are not officially supported, recognized, or managed by your organization\'s IT department.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-unknown-unsupported' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-SessionControl', categories: ['Zero Trust', 'Remote work'], desc: 'Enhances session security by preventing users from remaining persistently signed in. By enforcing non-persistent browser sessions, users must re-authenticate after closing their browser, protecting data on shared or unmanaged devices.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-persistent-browser' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-AppProtection', categories: ['Zero Trust', 'Remote work'], desc: 'Safeguards corporate data on mobile devices by requiring users to access services via approved client apps or apps safeguarded by Intune App Protection Policies, preventing data leakage to unmanaged personal applications.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance' },
    { name: 'CA-AllUsers-AllApps-AnyPlatform-BlockInsiderRisk', categories: ['Zero Trust', 'Emerging threats'], desc: 'Integrates with Microsoft Purview to automatically block access for users flagged with a high insider risk severity. This prevents potential data exfiltration or sabotage by internal threat actors.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-risk-based-insider-block' },

    { name: 'CA-Admins-AzurePortal-AnyPlatform-RequirePhishResist', categories: ['Protect administrator', 'Zero Trust'], desc: 'Mandates the highest level of authentication strength (such as FIDO2 security keys, Passkeys, or Windows Hello for Business) for administrators. This provides robust protection against advanced phishing campaigns targeting privileged accounts.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-admin-phish-resistant-mfa' },
    { name: 'CA-Admins-AllApps-AnyPlatform-RequireCompliant', categories: ['Protect administrator', 'Remote work'], desc: 'Enforces strict endpoint requirements for privileged users, ensuring administrators can only access corporate applications from devices that are actively managed, compliant with Intune policies, or Hybrid Entra joined.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-alt-admin-device-compliand-hybrid' },

    { name: 'CA-AllUsers-AllApps-AnyPlatform-AppEnforced', categories: ['Remote work'], desc: 'Enables limited, web-only access to services like SharePoint or Exchange Online from unmanaged devices. This uses application-enforced restrictions to prevent users from downloading, printing, or syncing sensitive data locally.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-app-enforced-restrictions' },

    { name: 'CA-AIAgents-AllApps-AnyPlatform-BlockHighRisk', categories: ['AI Agents', 'Emerging threats'], desc: 'Secures non-human identities by automatically blocking access for workload identities and AI agents that exhibit anomalous or high-risk behavior, preventing automated service accounts from being exploited.', link: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-agent-block-high-risk' }
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
    'BlockHighRisk': 'Block High Risk',
    'BlockInsiderRisk': 'Block Insider Risk',
    'BlockLegacyAuth': 'Block Legacy Authentication',
    'SessionControl': 'Session Control'
};

export const getReadableTitle = (requirement) => {
    if (TITLE_OVERRIDES[requirement]) return TITLE_OVERRIDES[requirement];
    return requirement.replace(/([A-Z])/g, ' $1').trim();
};
