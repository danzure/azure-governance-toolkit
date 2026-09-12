# Agent Rules & Architecture Guide

## 1. Core Engineering Workflows & Quality Standards

### 1.1 Git Workflows & Versioning
Whenever you are asked to commit and sync changes, you **must** automatically bump the version in `package.json` before creating the commit.
- **Exception:** Do not bump the version in `package.json` if you are only updating non-application files (e.g., `README.md`, documentation, `.agents/AGENTS.md`).

**Commit Procedure:**
1. Increment the patch version (or minor/major if instructed otherwise) in `package.json`.
2. Stage `package.json` along with the other modified application files.
3. Commit with a conventional semantic message (e.g., `fix(ui): ...`, `feat(naming): ...`).
4. Push and sync changes to the active working branch.

### 1.2 Mandatory Quality Gates
Before proposing a commit or concluding a multi-file task, you **must** execute and pass the following quality verification commands:
- **Linting**: `npm run lint` — Must exit with 0 errors and 0 warnings.
- **Automated Tests**: `npm test` — All Vitest test suites must pass completely without regressions.
- **Production Bundle**: `npm run build` — Vite production build must succeed without syntax or packaging errors.

---

## 2. Strict Deprecations & Anti-Patterns Matrix

To maintain a unified Microsoft Fluent 2 design language, the following legacy patterns are **strictly forbidden** throughout the codebase.

| Forbidden Legacy Pattern | Why It Is Forbidden | Approved Fluent 2 Standard |
| :--- | :--- | :--- |
| **Native `<select>` Dropdowns** | System OS styling, inconsistent blue focus highlights, and uncustomizable popouts violate Fluent 2. | Use `FluentDropdown.jsx` for standard dropdowns, or `SearchableSelect.jsx` for filtered/categorized lists. |
| **Raw Hex Colors**<br>`bg-[#1E1E1E]`, `text-[#D4D4D4]`, `bg-[#292929]` | Prevents cohesive light/dark theming and breaks accessibility contrast. | Use semantic tokens: `bg-fluent-code-bg`, `text-fluent-code-fg`, `bg-fluent-bg-card`, etc. |
| **Opacity Slashes on Hex Variables**<br>`bg-fluent-brand-bg/10`, `ring-fluent-brand-bg/50` | Tailwind generates `rgb(#hex / alpha)` which is invalid CSS in browsers, rendering backgrounds transparent. | Use defined semantic tokens (`bg-fluent-info-bg`, `bg-fluent-bg-hover`, `ring-fluent-brand-bg`). |
| **Generic Tailwind Palette**<br>`bg-white`, `bg-blue-600`, `text-gray-400`, `text-amber-500` | Creates visual inconsistency with the Azure Fluent 2 brand tokens. | Use corresponding `fluent-*` tokens (`bg-fluent-bg-card`, `bg-fluent-brand-bg`, `text-fluent-fg-secondary`, `text-fluent-cat-yellow-fg`). |
| **Ad-Hoc Copied State Hexes**<br>`bg-[#f1faf1] text-[#107c10] border-[#c6ebc9]` | Fragmented, hardcoded values that fail theme adaptiveness. | Use `bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg`. |
| **Arbitrary Padding & Heights**<br>`px-4 py-2`, `h-[38px]`, `py-2.5` | Breaks vertical grid alignment across adjacent inputs, buttons, and selects. | Standardize on `h-[32px] px-3` (standard) or `h-[26px] px-2.5` (compact). |
| **Arbitrary Shadows**<br>`shadow-md`, `shadow-lg` | Generic Tailwind shadows clash with Fluent 2 depth elevations. | Standardize on `shadow-soft` (cards), `shadow-depth` (hover), or `shadow-flyout` (menus/modals). |
| **Pill Shapes (`rounded-full`) on Controls** | Fully rounded pills violate Fluent 2 geometry for toggles, badges, and controls. | Use standard rounded corners: `rounded-[4px]` (inputs/buttons/badges) or `rounded-lg` (cards). |
| **Nested Desktop Scrollbars**<br>`overflow-y-scroll` on page root | Creates double vertical scrollbars and breaks `ScrollToTopButton`. | Allow `main-scroll-container` to manage the scroll viewport; use `overflow-y-auto` only on bounded code/preview blocks. |
| **Mismatched Conceptual Icons**<br>e.g. Terraform logo on generic IaC button | Violates the "One Concept = One Unified Icon" principle. | Generic controls must use unified generic icons (`<Code2 />`, `<Terminal />`); vendor logos are reserved for concrete selectors. |

---

## 3. Fluent 2 Design System & Design Tokens

### 3.1 Typography & Headings
- **Page Titles (H1)**: `text-[20px] sm:text-[24px] font-semibold text-fluent-fg-primary`
- **Section Headings (H2/H3)**: `text-[14px] sm:text-[16px] font-semibold text-fluent-fg-primary`
- **Body & Form Text**: Default `text-[14px]` for body copy; `text-[13px]` for dense data, table cells, and form controls.
- **Code & Monospace**: `font-mono text-[13px] leading-relaxed` (using Cascadia Code, Consolas).

### 3.2 Semantic Color Tokens Reference
The application defines semantic CSS variables in `src/index.css` mapped in `tailwind.config.js`:

| Token Class | Light Mode Value | Dark Mode Value | Usage Context |
| :--- | :--- | :--- | :--- |
| `bg-fluent-bg-canvas` | `#fafafa` | `#242424` | Main page and application background canvas. |
| `bg-fluent-bg-card` | `#ffffff` | `#292929` | Cards, panels, input resting states, flyouts. |
| `bg-fluent-bg-subtle` | `#f0f0f0` | `#1b1b1b` | Subtle containers, tool guidance blocks, inactive pills. |
| `bg-fluent-bg-hover` | `#f5f5f5` | `#202020` | Hover states across list items, dropdown options, tabs. |
| `text-fluent-fg-primary` | `#242424` | `#ffffff` | Primary text, headings, selected labels. |
| `text-fluent-fg-secondary` | `#424242` | `#d6d6d6` | Secondary supporting text, subtitles, resting labels. |
| `text-fluent-fg-tertiary` | `#616161` | `#adadad` | Placeholders, counter hints, disabled text. |
| `border-fluent-stroke-subtle` | `#e0e0e0` | `#525252` | Dividers, card borders, subtle bounding boxes. |
| `border-fluent-stroke-strong` | `#d1d1d1` | `#666666` | Interactive element borders (inputs, secondary buttons). |
| `bg-fluent-brand-bg` | `#0f6cbd` | `#1f9eff` | Primary action buttons, active indicator pills. |
| `text-fluent-brand-fg` | `#0f6cbd` | `#60cdff` | Brand accents, active links, primary icons. |
| `bg-fluent-info-bg` / `text-fluent-info-text` | `#eff6fc` / `#004578` | `rgba(31,158,255,0.1)` / `#c7e0f4` | Informational callouts, active navigation tabs. |
| `text-fluent-state-danger` | `#d13438` | `#f1707b` | Destructive actions, validation error states. |
| `bg-fluent-code-bg` / `text-fluent-code-fg` | `#1e1e1e` / `#d4d4d4` | `#1e1e1e` / `#d4d4d4` | Code editor canvas & monospace syntax text. |
| `bg-fluent-cat-green-bg` | `#e9f5e9` | `#0f2d0f` | Positive status badges, copy-button active background. |
| `border-fluent-cat-green-border` | `#c6ebc9` | `#1e4620` | Copy-button active border, verified status outline. |
| `text-fluent-cat-green-fg` | `#0e700e` | `#5ec75e` | Success text, Check icon, copy confirmation. |

### 3.3 Layout, Spacing & Alignment
- **Page Container**: `max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 flex-1 flex flex-col`
- **Base-4 Spacing Multiples**:
  - Tight internals: `gap-1.5` (6px) or `gap-2` (8px).
  - Form fields & stacked cards: `gap-4` (16px) or `space-y-4`.
  - Major sections: `gap-6` (24px).
- **Symmetric Padding**: Always use symmetrical vertical padding (`py-1`, `py-2`) on flex containers to ensure vertical centering alignment when using `items-center`.
- **Keyboard Shortcut Visibility**: Any shortcut key badges or hints (`<kbd>`, `Ctrl+K`, `ESC`) **must never be displayed on mobile devices** (`< sm`). Touchscreens lack physical keyboards; always use `hidden sm:inline-flex` or `hidden sm:flex`.

### 3.4 Shadows & Microanimations
- **Elevations**:
  - `shadow-soft`: Resting cards, preview boxes.
  - `shadow-depth`: Hovered cards, active states.
  - `shadow-flyout`: Dropdown menus, tooltips, flyout popovers, modal dialogs.
- **Snappy Micro-interactions**:
  - General transitions: `transition-all duration-200 ease-in-out`.
  - Push effect on buttons/toggles: `active:scale-95`.
  - Entry transitions: `animate-fade-in` (0.2s) and `animate-slide-up` (0.2s).

---

## 4. Component Standards & Pattern Catalog

### 4.1 Buttons & Action States
- **Primary Action Button**:
  ```html
  px-3 h-[32px] bg-fluent-brand-bg text-white rounded-[4px] text-[13px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 active:scale-95
  ```
- **Secondary Button**:
  ```html
  px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary text-[13px] font-medium active:scale-95
  ```
- **Ghost / Tertiary Button**:
  ```html
  px-3 h-[32px] rounded-[4px] text-[13px] font-medium text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors inline-flex items-center justify-center gap-1.5 active:scale-95
  ```
- **Icon Button (Action/Copy - Resting State)**:
  ```html
  shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary active:scale-95
  ```
- **Icon Button (Success / Copied State)**:
  ```html
  shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg
  ```
  *(Swap icon from `<Copy className="w-3.5 h-3.5" />` to `<Check className="w-3.5 h-3.5" />` and label to "Copied" for 2000ms).*
- **Icon Button (Danger / Destructive)**:
  ```html
  shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-state-danger active:scale-95
  ```

### 4.2 Form Controls, Dropdowns & Selects
- **Form Labels**: `text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block`
- **Helper / Hint Text**: `text-[12px] text-fluent-fg-secondary mt-1 block`
- **Standard Text Input**:
  ```html
  flex-1 min-w-0 w-full px-3 h-[32px] border rounded-[4px] outline-none text-[13px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary
  ```
- **Fluent 2 Standard Dropdowns (`FluentDropdown.jsx`)**:
  - Trigger: `h-[32px] px-3 bg-fluent-bg-card border border-fluent-stroke-strong hover:border-fluent-fg-primary rounded-[4px] text-[13px] text-fluent-fg-primary flex items-center justify-between gap-1.5 outline-none focus:border-fluent-brand-bg`.
  - Chevron: Trailing `<ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />` rotating 180° when open.
  - Flyout Popover: `absolute top-[100%] left-0 z-50 min-w-full bg-fluent-bg-card border border-fluent-stroke-subtle shadow-flyout rounded mt-1 overflow-hidden animate-fade-in`.
  - Option Item: `px-3 py-2 text-[13px] hover:bg-fluent-bg-hover text-fluent-fg-secondary hover:text-fluent-fg-primary cursor-pointer transition-colors flex items-center justify-between gap-3`.
  - Selected Option: `bg-fluent-bg-subtle text-fluent-fg-primary font-medium` with a trailing `<Check className="w-3.5 h-3.5 text-fluent-brand-fg" />`.
- **Integrated Action Input Dropdowns**:
  - Container: `flex items-center w-full h-[32px] border rounded-[4px] transition-all duration-200 focus-within:border-fluent-brand-bg focus-within:ring-1 focus-within:ring-fluent-brand-bg bg-fluent-bg-card border-fluent-stroke-strong relative`.
  - Inner `<input>`: `flex-1 min-w-0 px-3 h-full outline-none text-[13px] bg-transparent border-none text-fluent-fg-primary`.
  - Action trigger: `h-full border-l border-fluent-stroke-subtle bg-fluent-bg-subtle px-2 flex items-center shrink-0 text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover`.

### 4.3 Cards, Guidance Accordions & Containers
- **Main Tool Card**: `relative rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle w-full flex flex-col overflow-hidden`
- **Standard Tool Guidance Accordion**:
  Every tool must include this standardized guidance block at the top of the page:
  ```jsx
  <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden mb-4">
      <div
          className="px-3 py-1.5 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-fluent-bg-hover transition-colors"
          onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
          role="button"
          aria-expanded={isGuidanceExpanded}
          tabIndex={0}
          onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsGuidanceExpanded(!isGuidanceExpanded);
              }
          }}
      >
          <div className="flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0 text-fluent-brand-fg" />
              <p className="text-fluent-fg-primary text-[13px] font-medium">How to use this tool</p>
              {isGuidanceExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </div>
          {isGuidanceExpanded && (
              <div className="mt-3 flex flex-col gap-3 text-[13px] text-fluent-fg-secondary cursor-default animate-fade-in" onClick={(e) => e.stopPropagation()}>
                  {/* Tool explanation and bullet points */}
              </div>
          )}
      </div>
  </div>
  ```

### 4.4 Code Snippets & Terminal Display Surfaces
When displaying generated code (Bicep, Terraform, ARM, JSON, PowerShell, Markdown):
- **Terminal Container**: `bg-fluent-code-bg w-full flex flex-col flex-1 h-full min-h-0 relative overflow-hidden rounded-b-lg`
- **Code Area (`<pre>`)**: `flex-1 text-[13px] leading-relaxed font-mono overflow-auto p-5 text-fluent-code-fg m-0 select-all`
- **Terminal Header/Toolbar**: `px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle shrink-0`

---

## 5. Iconography Architecture & Unified Registers

The application enforces a strict **"One Concept = One Unified Icon"** rule across all tools and shared components.

### 5.1 Strict Boundary: Generic Controls vs Concrete Selectors
- **Generic Controls**: When a button, tab, toggle, or card header represents IaC, Scripting, or Documentation as a general feature:
  - **IaC (`IaC Template`, `IAC Template`)**: Always use `<Code2 />` from `lucide-react`. Vendor logos (Terraform, Bicep) are **strictly forbidden** on generic controls.
  - **Scripting (`Script`, `CLI`, `Shell`)**: Always use `<Terminal />` from `lucide-react`.
  - **Documentation (`Docs`, `Markdown`)**: Always use `<FileText />` from `lucide-react`.
- **Concrete Technology Selectors**: When the user is explicitly choosing, filtering, or previewing a specific vendor platform or format:
  - **Always use `<TechnologyIcon />`** with theme-adaptive SVG styling.

### 5.2 Iconography Register

#### 1. System & Interaction Actions
| Icon Name | Usage Context / Action |
| :--- | :--- |
| `Copy` | Copying text, snippets, names, or code blocks to clipboard. |
| `Check` | Success feedback state (temporarily replaces `Copy`, or selected item indicator). |
| `Info` | 'How to use this tool' collapsible blocks and informational tooltips. |
| `ExternalLink` | Links opening in a new tab or linking to external documentation / registries. |
| `ChevronDown` / `ChevronUp` | Single-item collapsible accordions, dropdown triggers, and expand/collapse details. |
| `Plus` / `Minus` | Adding or removing items from list configurations. |
| `Trash2` | Destructive removal or deleting an entire configuration node. |
| `X` | Closing modals, clearing search inputs, or dismissing overlays. |
| `Search` | Search inputs and filtering text boxes. |
| `Edit2` / `Edit3` | Edit states, configuration panels, pattern builder headers. |
| `Eye` / `EyeOff` | Live preview indicators or toggling preview visibility. |
| `AlertTriangle` / `ShieldAlert` | Warnings, validation errors, or critical security alerts. |
| `Settings2` | Bulk action triggers (specifically "Expand All Templates" / "Collapse All Templates" across groups). |
| `Sliders` | Form/pattern configuration tabs, manual parameters, or builder modes. |
| `RefreshCw` | Resetting configurations, parameters, or builders to defaults. |
| `Sparkles` | AI-powered generation features, smart prompt bars, and AI suggestion badges. |
| `Star` | "New" feature or recently added service indicator badge (always with `fill-current`). |

#### 2. Domain & Conceptual Features
| Icon Name | Usage Context / Action |
| :--- | :--- |
| `Code2` | Generic IaC controls, templates, or exports. Vendor logos are forbidden. |
| `Terminal` | Generic CLI, shell execution, or script exports. |
| `FileText` | Generic documentation, readme, or text exports. |
| `Network` | Architecture topology, topology designer tabs, and network hierarchy views. |
| `Layers` | Management group trees, hierarchical scopes, and policy layers. |
| `Shield` | Security baselines, Conditional Access defaults, and protection controls. |
| `ShieldCheck` | Role-Based Access Control (RBAC), custom roles, and permission assignments. |
| `Lock` | Grant controls, access restrictions, and explicit block rules. |
| `Users` | Identity assignments, personas, user groups, and workload identities. |

#### 3. Concrete Technology & Format Selectors (`TechnologyIcon.jsx`)
| Technology Name | Identifier (`name=`) | Usage Context |
| :--- | :--- | :--- |
| **Bicep** | `bicep` | Explicit Bicep template export tab, button, or file preview. |
| **Terraform** | `terraform` | Explicit Terraform HCL export tab, button, or registry link. |
| **Azure Resource Manager (ARM)** | `arm` | Explicit ARM JSON template export tab or button. |
| **JSON Payload** | `json` | Explicit JSON API payload, Graph API body, or role definition export. |
| **PowerShell** | `powershell` | Explicit Azure PowerShell / Microsoft Graph PowerShell script export. |
| **Markdown** | `markdown` | Explicit Markdown documentation export tab or button. |
| **Microsoft Azure** | `azure` | Azure cloud platform indicators and documentation links. |
| **Microsoft Entra ID** | `entra` | Entra identity platform indicators and portal links. |
| **Microsoft Corporation** | `microsoft` | CAF alignment badges, Microsoft overview documentation links. |
| **GitHub** | `github` | GitHub repository links, Actions workflows, or source code buttons. |

---

## 6. Application Architecture & Data Conventions

### 6.1 Standard Page Blueprint
All 5 governance tools (`ResourceNaming`, `ConditionalAccess`, `ManagementGroups`, `TaggingStrategy`, `RbacDesigner`) must follow this standardized layout:
1. **Root Container**:
   ```jsx
   <div className="flex flex-col min-w-0 w-full animate-fade-in">
   ```
   *(Never add `overflow-y-scroll` to the root container; window scrolling is handled by `main-scroll-container`).*
2. **Page Content Wrapper**:
   ```jsx
   <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 flex-1 flex flex-col gap-4">
   ```
3. **Standard Page Header**:
   ```jsx
   <div>
       <h1 className="text-[20px] sm:text-[24px] font-semibold text-fluent-fg-primary mb-2">
           {Tool Title}
       </h1>
       <p className="text-[14px] text-fluent-fg-secondary max-w-3xl mt-1 block">
           {Tool Description}
       </p>
   </div>
   ```
4. **Standard Guidance Accordion**: Insert the "How to use this tool" accordion directly under the header.
5. **Operational Workspace**: Main tool content, prompt bar, and outputs placed below guidance.

### 6.2 Azure Service Catalog Management
When adding or updating services in `src/data/constants.js`:
1. **Prevent Duplicates**: Thoroughly search `src/data/constants.js` to confirm the service does not already exist under another name or abbreviation.
2. **"New" Badge**: Apply `isNew: true` **only** to genuinely newly added services. Remove `isNew: true` from older entries so the badge remains exclusive.
3. **Documentation & Pricing Links**: Always provide a valid `learnUrl` pointing to the official Microsoft Learn documentation overview, and a `pricingUrl` pointing to the specific Azure Pricing Calculator page.
4. **Content Separation**:
   - `desc` and `longDesc`: Strictly explain what the service is and its architectural purpose.
   - `bestPractice` and `namingGuidance`: Contain operational advice, deployment recommendations, and newer recommended alternatives if the service is marked as `legacy` or `retired`.

### 6.3 Service Icon Architecture (`src/data/serviceIcons.js`)
Service icons are **not** stored as local files in `src/assets/icons/`. Instead, `src/data/serviceIcons.js` resolves icon URLs using a strict 4-tier repository hierarchy:
1. **Source 1 (Primary)**: `benc-uk/icon-collection` (community-curated Azure icons).
2. **Source 2 (Alt)**: `MarczakIO/azure-portal-icons` (Azure Portal official icons).
3. **Source 3 (Maskati)**: `maskati/azure-icons` (AI / Foundry specific SVGs).
4. **Source 4 (Player)**: `Azure-Player/icons-and-symbols` (official Microsoft public service icons).

When adding a service:
- Search Source 1 first; if found, map the exact SVG filename in `SERVICE_ICONS_PRIMARY`.
- If missing, check Source 2, 3, or 4, set primary to `null`, and add to the corresponding alt map with a source comment (e.g. `// → ALT`, `// → PLAYER`).
- In catalog cards and command palette lists, icon image containers must use `bg-transparent` so full-colour official Azure icons render cleanly.

### 6.4 AI-Powered Tool Layout Standards
For tools with AI or smart prompt capabilities (`ResourceNaming`, `RbacDesigner`):
1. **Primary Interaction Point**: Place the AI Prompt Bar directly below the "How to use this tool" guidance block.
2. **Collapsible Manual Configuration**: Manual property forms, templates, or sliders must be wrapped in a collapsible container that is **collapsed by default** (`isConfigMinimized = true`), toggled via a centered button with the `<Sliders className="w-3.5 h-3.5" />` icon and `<ChevronDown className="w-3.5 h-3.5" />`.
3. **Interactive AI Feedback Banner**: Always render an AI resolution banner displaying the summary, CAF governance rationale, and quick-filter tags upon successful prompt execution.
4. **Keyboard Shortcuts**: Bind `Ctrl+K` to focus the prompt input and `Escape` to blur/clear it (with key hints hidden on mobile: `hidden sm:inline-flex`).
5. **Dashboard Registration**: Ensure `hasAi: true` is set on the tool entry in `src/pages/Dashboard.jsx`.
