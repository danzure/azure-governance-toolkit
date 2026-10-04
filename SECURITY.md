# Security Policy

## Supported Versions

The following versions of the Azure Governance Toolkit are currently supported with security updates:

| Version | Supported |
| :--- | :--- |
| 2.7.x | :white_check_mark: |
| < 2.7.0 | :x: |

---

## Reporting a Vulnerability

We take the security of the **atozazure | Azure Governance Toolkit** seriously. If you believe you have found a security vulnerability in this project, please report it responsibly so we can remediate it before public disclosure.

### Preferred Method: Private Vulnerability Reporting
Please report vulnerabilities privately via GitHub Security Advisories:
- **[Submit a Security Advisory](https://github.com/danzure/azure-governance-toolkit/security/advisories/new)**

### Alternative Method: Direct Security Contact
If you cannot use GitHub Security Advisories, you can contact the project maintainer directly:
- **Email:** [security@atozazure.com](mailto:security@atozazure.com)

---

## What to Include in Your Report

To help us triage and resolve the issue quickly, please provide:
1. **Description**: A clear description of the vulnerability and its potential impact.
2. **Steps to Reproduce**: Detailed, reproducible steps or a proof-of-concept (PoC).
3. **Affected Components**: Specific files, endpoints, or UI workflows affected (e.g., `/api/generateResourceName`, `useLocalStorage`).
4. **Remediation Suggestions**: Any proposed fixes or code patches if available.

---

## Disclosure Process & Response Targets

1. **Initial Acknowledgment**: We aim to acknowledge receipt of all vulnerability reports within **48 hours**.
2. **Triage & Validation**: We will evaluate the report, verify the vulnerability, and assign an appropriate severity.
3. **Fix & Release**: A fix will be developed, tested against our automated test suites, and deployed to production.
4. **Coordinated Disclosure**: Once a fix is deployed, we will coordinate public disclosure and provide attribution/acknowledgment if desired.

---

## Scope

### In Scope
- Web application hosted at [https://app.atozazure.com/](https://app.atozazure.com/)
- Azure Functions serverless API endpoints (`/api/generateResourceName`, `/api/generateRbacRole`, `/api/azureUpdates`)
- Static site security headers, Content Security Policy, and client-side logic
- Generated IaC and security template definitions (preventing insecure defaults)

### Out of Scope
- Denial of Service (DoS) attacks targeting third-party infrastructure (e.g., direct attacks on Microsoft Azure OpenAI or upstream RSS feeds)
- Social engineering, phishing, or physical attacks
- Issues in third-party services outside of our configuration (e.g., upstream outages in Microsoft Azure or GitHub)

---
*This security policy is aligned with [RFC 9116](https://app.atozazure.com/.well-known/security.txt).*
