# atozazure | Azure Governance Toolkit

[![React](https://img.shields.io/badge/react-18.3-20232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-6.4-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/vitest-4.1-6E9F18.svg?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/license-MIT-0078D4.svg?style=for-the-badge)](LICENSE)

> A modern, comprehensive web application and cloud governance suite designed to accelerate cloud architecture design, enforce compliance standards, and automate infrastructure configuration across Microsoft Azure and Microsoft Entra ID.

Fully aligned with the **Microsoft Cloud Adoption Framework (CAF)**, **Azure Landing Zones (ALZ)**, **Azure Well-Architected Framework (WAF)**, and **Microsoft Entra Zero Trust Architecture**.

---

## 🔗 Live Application
**Production URL**: [https://app.atozazure.com/](https://app.atozazure.com/)

---

## 🚀 Core Governance Tools

### 1. 🔹 Azure Resource Naming Tool (CAF Compliant)
Solves the complexity of heterogeneous naming rules, character constraints, and abbreviation requirements across Azure's cloud ecosystem.
- **150+ Azure Services**: Comprehensive service catalog spanning Compute, Containers, Databases, AI & Foundry, Networking, Storage, Security, Analytics, and Integration.
- **Strict CAF Compliance**: Automatically applies official Microsoft abbreviations, casing rules, hyphenation restrictions, and uniqueness scopes (Global, Subscription, Resource Group, Sub-resource).
- **AI-Powered CAF Assistant**: Natural language prompt input that translates architecture requirements into compliant resource names with CAF governance rationale and quick-filter tags.
- **Dynamic Pattern Builder**: Customize and reorder naming segments (`Org-Resource-Workload-Environment-Region-Instance`) with custom delimiters and instance padding.
- **Deep Constraint Validation**: Real-time validation against Azure Resource Manager (ARM) regex patterns, min/max length boundaries, and reserved names (e.g., `GatewaySubnet`, `AzureFirewallSubnet`).
- **Multi-Format IaC & CLI Generation**: Export one-click naming variables and templates in **Bicep**, **Terraform (HCL)**, **ARM (JSON)**, **Azure CLI**, **Azure PowerShell**, and **Markdown**.

### 2. 🔹 Conditional Access Policy Builder
A structured policy generator for Microsoft Entra ID built upon Zero Trust identity security baselines.
- **Zero Trust Naming Framework**: Standardizes policy taxonomy using the proven `[Prefix]-[Persona]-[Resource]-[Requirement]` structure.
- **17+ Curated Baseline Templates**: Microsoft-recommended policies categorized across 5 core security pillars:
  - *Secure Foundation* (Emergency access break-glass, block legacy authentication)
  - *Zero Trust* (Require phishing-resistant MFA, compliant device checks)
  - *Remote Work* (Location-based triggers, untrusted network controls)
  - *Protect Administrators* (Continuous access evaluation, privileged session controls)
  - *AI Agents & Workload Identities* (Autonomous agent and workload protection)
- **Granular Policy Configuration**: Configure target users/personas, cloud apps, client platform conditions, risk levels, grant controls, and session lifetime controls.
- **Deployment Artifacts**: Instant export to **Microsoft Graph API (JSON)**, **Microsoft Graph PowerShell**, and **Markdown** documentation.

### 3. 🔹 Management Group Topology Designer
Visual architecture designer to model enterprise-scale management group hierarchies for Azure Landing Zones.
- **Visual Hierarchy Builder**: Interactive management group and subscription tree builder supporting deep nesting and organizational hierarchy visualization.
- **Landing Zone Archetypes**: Pre-configured CAF archetypes for Platform management groups (*Identity*, *Connectivity*, *Management*) and Workload landing zones (*Corp*, *Online*, *Sandbox*).
- **Structural Guardrails**: Built-in CAF guidance on subscription placement, policy inheritance boundaries, and maximum nesting depths (up to 6 levels).
- **Automated IaC Exports**: Instantly generate clean, production-ready infrastructure code in **Bicep**, **Terraform (`azurerm_management_group`)**, and **ARM JSON**.

### 4. 🔹 RBAC Custom Role Designer
Tailor-made Azure Role-Based Access Control definition designer implementing the Principle of Least Privilege (PoLP).
- **AI-Powered Role Generation**: Describe roles in natural language (e.g., *"DevOps engineer needing read access to VMs and write access to Web Apps"*) to automatically select optimal Azure Resource Provider operations.
- **Curated Permissions Catalog**: Search and toggle granular actions, notActions, dataActions, and notDataActions across core Azure providers (`Microsoft.Compute`, `Microsoft.Storage`, `Microsoft.Network`, `Microsoft.KeyVault`, `Microsoft.Web`, `Microsoft.ContainerService`, etc.).
- **Scope Scaffolding**: Configure assignable scopes at Management Group, Subscription, or Resource Group level.
- **Multi-Format Role Exports**: Generate ready-to-deploy role definitions in **Azure CLI (`az role definition create`)**, **Azure PowerShell (`New-AzRoleDefinition`)**, **Bicep (`Microsoft.Authorization/roleDefinitions`)**, and **ARM JSON**.

### 5. 🔹 Tagging Strategy Designer
Organizational taxonomy builder to enforce consistency across cloud financial operations (FinOps), ownership, and operations.
- **CAF Tagging Taxonomies**: Standardized presets for Cost Allocation (`CostCenter`, `BillingScope`), Operations (`Environment`, `Criticality`, `SLA`), Ownership (`Owner`, `BusinessUnit`), and Governance (`DataClassification`, `Compliance`).
- **Policy Enforcement Artifacts**: Automatically generates **Azure Policy** definitions (*Require Tag on Resources*, *Inherit Tag from Resource Group*) to enforce compliance at scale.
- **IaC Export Modules**: Export reusable tagging schemas formatted as **Bicep** object modules and **Terraform** local variable maps.

---

## ⚡ Developer & User Experience (UX)

- **Microsoft Fluent 2 Design Language**: Built with Microsoft's official Fluent 2 design language, offering consistent elevation, typography, semantic color tokens, and accessible focus states.
- **Theme-Adaptive (Dark & Light)**: Fully responsive dark and light modes with seamless contrast switching.
- **Global Command Palette (`Ctrl+K`)**: Rapid keyboard search across all 5 tools and 150+ Azure services with official Azure SVG iconography and instant routing.
- **Offline-First & Privacy Preserving**: Zero server-side data collection; all settings, custom patterns, and configurations persist securely in browser `localStorage`.
- **Intelligent Fallback Architecture**: Client-side heuristic grounding ensures robust, deterministic results even when external AI endpoints are unavailable.
- **One-Click Clipboard & Micro-Interactions**: Instant feedback with visual confirmation across all code snippets and naming outputs.

---

## 🛠️ Technology Stack & Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | [React 18](https://react.dev/) | Client-side Single Page Application (SPA) with React Router v7 |
| **Build & Tooling** | [Vite 6](https://vitejs.dev/) | Sub-second HMR and manual chunk-split production bundling |
| **Styling & Tokens** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Custom Fluent 2 semantic token hierarchy (`fluent-*`) |
| **Design Language** | Microsoft Fluent 2 | Cards, flyouts, code canvases, and accessible controls |
| **Iconography** | [Lucide React](https://lucide.dev/) + Azure SVGs | Unified registers, official Azure service iconography |
| **Testing** | [Vitest](https://vitest.dev/) | High-speed unit testing for naming rules, exports, and data models |
| **Linting** | [ESLint 9](https://eslint.org/) | Strict code style and quality enforcement |
| **Hosting & API** | [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/) | Serverless edge hosting with optional Azure Functions API proxy |

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (included with Node.js)

### Installation & Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/danzure/azure-governance-toolkit.git
   cd azure-governance-toolkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

4. **Run both frontend and serverless API (optional)**
   ```bash
   npm start
   ```

### Quality Verification Commands

- **Unit Tests**: Run all Vitest suites:
  ```bash
  npm test
  ```
- **Code Linting**: Check code style and rules:
  ```bash
  npm run lint
  ```
- **Production Build**: Compile and validate production bundle:
  ```bash
  npm run build
  ```
- **Production Preview**: Preview production bundle locally:
  ```bash
  npm run preview
  ```

---

## 📂 Project Structure

```text
azure-governance-toolkit/
├── .agents/             # Agent guidelines, architecture documentation, and rules
├── api/                 # Azure Functions serverless proxy backend (Node.js)
├── public/              # Static public assets, favicon, and manifests
├── src/
│   ├── assets/          # Application logos, graphics, and static media
│   ├── components/      # Modular component architecture
│   │   ├── ai/          # AI Prompt Bar, CAF feedback banners
│   │   ├── ca/          # Conditional Access policy forms, cards, and modal
│   │   ├── layout/      # Navbar, Footer, FlyoutMenu, CommandPaletteModal
│   │   ├── naming/      # PatternBuilder, ConfigPanel, ResourceCard, ServiceFilter
│   │   ├── rbac/        # RBAC Designer panels, permission pickers, role preview
│   │   ├── shared/      # FluentDropdown, TechnologyIcon, ResetButton, CopyButton
│   │   ├── tagging/     # Tagging Strategy tables, rule cards, export panels
│   │   └── topology/    # Management Group tree builder, node editor, IaC exporters
│   ├── data/            # Static schemas, Azure services catalog, RBAC & CA databases
│   ├── hooks/           # Custom React hooks (useLocalStorage, useDebounce, etc.)
│   ├── pages/           # Route views (Dashboard, ResourceNaming, ConditionalAccess, etc.)
│   ├── utils/           # Pure utility logic, validation engines, IaC code generators
│   ├── App.jsx          # Top-level routing and theme providers
│   ├── index.css        # Fluent 2 design tokens and Tailwind directives
│   └── main.jsx         # Application entry point
├── staticwebapp.config.json # Azure Static Web Apps routing and security headers
├── tailwind.config.js   # Tailwind theme configuration and Fluent 2 semantic mappings
└── vite.config.js       # Vite configuration with chunk splitting optimizations
```

---

## 🤝 Contributing

Contributions are welcome! Whether you are adding new Azure services to the naming catalog, updating Conditional Access templates, expanding RBAC resource provider operations, or enhancing the Fluent 2 UI:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/governance-enhancement`)
3. Ensure all tests pass (`npm test && npm run lint && npm run build`)
4. Commit your Changes (`git commit -m 'feat: add new resource provider support'`)
5. Push to the Branch (`git push origin feature/governance-enhancement`)
6. Open a Pull Request

---

## 📄 License

This project is distributed under the [MIT License](LICENSE).

---

## 📖 Official Microsoft Governance Resources

- [Azure Cloud Adoption Framework (CAF)](https://learn.microsoft.com/azure/cloud-adoption-framework/)
- [Define your Naming Convention](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)
- [Recommended Abbreviations for Azure Resources](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations)
- [Azure Landing Zones Architecture (ALZ)](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- [Azure Well-Architected Framework (WAF)](https://learn.microsoft.com/azure/well-architected/)
- [Microsoft Entra Conditional Access Architecture](https://learn.microsoft.com/entra/identity/conditional-access/plan-conditional-access)
- [Azure Custom Roles Documentation](https://learn.microsoft.com/azure/role-based-access-control/custom-roles)
