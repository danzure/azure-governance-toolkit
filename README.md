# atozazure | Azure Governance Tool 🌐

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)

A modern, highly interactive web application designed to generate **Microsoft Cloud Adoption Framework (CAF)** compliant names for Azure resources and standardized Entra ID Conditional Access policies.

This tool simplifies cloud governance by ensuring all resource names and security policies adhere strictly to Microsoft's recommended conventions, character limits, scope uniqueness, and abbreviation standards, while providing contextual guidance and best practices.

## 🔗 Live Demo
[https://app.atozazure.com/](https://app.atozazure.com/)

## 🚀 Core Capabilities

### 🔹 Intelligent Resource Naming Generation
The core feature of the application handles the complexity of Azure's heterogeneous naming rules.
- **Extensive Library (100+ Services)**: Computes naming logic across multiple categories including Compute, Networking, Storage, Databases, AI, and more.
- **Strict CAF Compliance**: Automatically applies Microsoft's recommended abbreviations, hyphenation rules, and structural patterns.
- **Dynamic Configuration & Reordering**: Users can dynamically define and reorder their naming schema (e.g., `Org-Resource-Workload-Environment-Region-Instance`).
- **Scope Awareness**: Visual badges indicate the uniqueness scope required for each resource (Global, Subscription, Resource Group, or Sub-resource).
- **Deep Validation Engine**:
  - Validates overall length against strict Azure limits (e.g., Storage Accounts: 3-24 chars).
  - Enforces alphanumeric & special character allowances (e.g., stripping hyphens for Key Vaults).
  - Identifies mandatory structural names (e.g., `AzureFirewallSubnet`, `GatewaySubnet`).

### 🔹 Conditional Access Policy Builder
A dedicated module aligned with Microsoft's Zero Trust principles to standardize security policy naming.
- **Zero Trust Naming Standard**: Dynamically builds policy names using the robust `[Prefix]-[Persona]-[Resource]-[Requirement]` framework.
- **Curated Template Library**: Features over 15 Microsoft-recommended default policies (e.g., *Require MFA for Admins*, *Block Legacy Auth*).
- **Multi-Category Tagging**: Organizes policies across core security pillars (Secure Foundation, Zero Trust, Remote Work, Protect Administrator, AI Agents).
- **Granular Customization**: Interactive form builders allow precise parameter tweaking for platform types, insider risk levels, and session controls.

### 🔹 Premium User Experience (UX)
Built for speed and developer productivity.
- **Instant Clipboard Access**: One-click copy interactions with localized success feedback.
- **Keyboard Navigation**: Power-user friendly with global shortcuts (`Ctrl+K` or `/` to focus search, `Escape` to clear).
- **Persistent State**: Leverages local storage to remember your custom prefixes, environment selections, and component ordering across sessions.
- **Optimized Performance**: Implements debounced searching and memoized component rendering for fluid interactions even with large data lists.
- **Responsive Dark/Light Mode**: Fully responsive Tailwind layout that respects OS-level theme preferences.

---

## 🛠️ Technical Architecture & Stack

Built as a lightweight, client-side Single Page Application (SPA) focusing on performance and maintainability.

- **Frontend Library**: [React 18](https://react.dev/) utilizing Hooks for state and lifecycle management.
- **Build & Bundling**: [Vite](https://vitejs.dev/) for sub-second HMR and optimized production builds.
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) combined with a custom Fluent-UI inspired color system for a native Microsoft look and feel.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, scalable vector iconography.
- **Testing**: [Vitest](https://vitest.dev/) for fast, reliable unit testing.
- **State Management**: Custom hooks (`useLocalStorage`, `useDebounce`) for clean, reusable state persistence and performance tuning.
- **Deployment**: Configured out-of-the-box for **Azure Static Web Apps** with integrated routing (`staticwebapp.config.json`).

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (included with Node.js)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/azres-naming-tool.git
   cd azres-naming-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`. Changes will hot-reload automatically.

### Running Tests

Execute the Vitest test suite to verify naming logic and component integrity:
```bash
npm run test
```

### Production Build

To create an optimized, minified production build:
```bash
npm run build
```
This generates static assets in the `dist/` directory. You can preview the production build locally using `npm run preview`.

---

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components (ConfigPanel, ResourceGrid, PatternBuilderCard, etc.)
├── data/            # Static constants, Azure resource schemas, and Conditional Access rules
├── hooks/           # Custom React hooks (useLocalStorage, useDebounce)
├── pages/           # High-level route views (ResourceNamingPage, ConditionalAccessPage)
├── utils/           # Pure functions, including the core naming validation logic
├── App.jsx          # Main application routing
├── main.jsx         # React DOM entry point
└── index.css        # Tailwind directives and custom CSS variables
```

---

## 🤝 Contributing

We welcome contributions! Whether it's adding new Azure resource types to the schema, improving the validation logic, or enhancing the UI.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Feel free to check the [Issues page](https://github.com/yourusername/azres-naming-tool/issues) for open tasks.

---

## 📄 License

This project is distributed under the [MIT License](LICENSE). See the `LICENSE` file for more information.

---

## 📖 Official Resources

- [Azure Naming Conventions](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)
- [Azure Resource Abbreviations](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations)
- [Conditional Access Architecture](https://learn.microsoft.com/entra/identity/conditional-access/plan-conditional-access)
