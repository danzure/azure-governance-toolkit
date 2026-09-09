# Agent Rules

## Git Workflows

Whenever you are asked to commit and sync changes, you **must** automatically bump the version in `package.json` before creating the commit. **Exception:** Do not bump the version in `package.json` if you are only updating non-application files (e.g., `README.md`, documentation, `.agents/AGENTS.md`).

1. Increment the patch version (or minor/major if instructed otherwise) in `package.json`.
2. Stage `package.json` along with the other modified files.
3. Proceed with the commit and push/sync process.

## UI Design Language & Component Standards

### 🚨 Strict Deprecation of Legacy Classes & Elements
To maintain a unified Fluent 2 design language, the following legacy UI patterns are **STRICTLY FORBIDDEN**:
- **Native HTML `<select>` Elements**: Do not use native browser `<select>` dropdowns anywhere in the application. Their system styling, blue operating-system focus highlights, and uncustomizable popouts violate Fluent 2. Always use standardized Fluent 2 dropdown components:
  - Use `FluentDropdown.jsx` for standard single-select dropdowns.
  - Use `SearchableSelect.jsx` for searchable or categorized option pickers.
  - Use custom absolute flyout panels with proper `shadow-flyout`, `bg-fluent-bg-card`, and keyboard accessibility.
- **Hardcoded & Generic Colors**: Do not use raw hex colors (e.g., `bg-[#292929]`, `text-[#D4D4D4]`) or generic Tailwind colors (e.g., `bg-white`, `bg-blue-600`, `text-gray-300`). Always use the corresponding `fluent-*` semantic tokens defined below.
- **Arbitrary Hover States**: Avoid ad-hoc hover background definitions like `hover:bg-black/5` or `dark:hover:bg-white/5`. Use the standardized `hover:bg-fluent-bg-hover` or `hover:bg-fluent-bg-subtle`.
- **Legacy Shadows**: Do not use generic Tailwind shadows like `shadow-md` or `shadow-lg`. Use `shadow-soft`, `shadow-depth`, or `shadow-flyout`.
- **Inconsistent Button/Input Padding**: Do not use ad-hoc padding/sizing like `px-4 py-2` or `px-3 py-2.5`. Use the standardized `px-3 h-[32px]` format.
- **Mismatched or Unofficial Icons**: Do not use disparate icons for the same concept or action across different views (e.g., never use a vendor logo like Terraform on a generic 'IaC' button, and never mix icons for editing, collapsing, or configuration). Always use official SVG icons via `TechnologyIcon.jsx` for concrete technologies and formats, and use the unified icon from Section 2.6 for generic concepts.

When creating or modifying UI components, you **must** adhere to the following Tailwind CSS class conventions. This ensures a consistent "Fluent UI" design language across the application.

### 1. Global Design Fundamentals

#### 1.1 Typography & Headings
- **Page Titles (H1)**: `text-[20px] sm:text-[24px] font-semibold text-fluent-fg-primary`
- **Section Headings (H2/H3)**: `text-[14px] sm:text-[16px] font-semibold text-fluent-fg-primary`
- **Body Text**: Use `text-[14px]` as the default for general text, with `text-[13px]` for denser component data.

#### 1.2 Colours & Theming
- **Backgrounds**: Use `bg-fluent-bg-canvas` for the main application background, and `bg-fluent-bg-card` for components and panels. Use `bg-fluent-bg-subtle` or `bg-fluent-bg-hover` for active/hover states.
- **Text/Foreground**: Use `text-fluent-fg-primary` for main text, `text-fluent-fg-secondary` for supporting text, and `text-fluent-fg-tertiary` for placeholders.
- **Borders**: Use `border-fluent-stroke-subtle` for dividers and card borders, and `border-fluent-stroke-strong` for interactive elements like inputs.
- **Brand Accents**: Use `bg-fluent-brand-bg` and `text-fluent-brand-fg` for primary actions or highlights.
- **Category Colors**: When displaying categorized items (like Azure services), utilise the specific category colours from Tailwind config (e.g., `bg-fluent-cat-blue-bg text-fluent-cat-blue-fg`).

#### 1.3 Theme & Dark Mode Validation
Before completing any UI task or component redesign, you **must** actively look for and validate the following to prevent common theming errors:
- **Opacity Modifiers on Hex Variables**: Do not apply Tailwind opacity modifiers (e.g., `bg-fluent-brand-bg/10`) to custom `fluent-*` colors that are backed by raw hex CSS variables in `index.css`. Tailwind cannot process opacity on hex values, which results in broken, transparent rendering. Always rely on the defined semantic palette (like `bg-fluent-cat-blue-bg`) which handles contrast automatically.
- **Dark Mode Graceful Degradation**: Always verify that elements using bright, highly saturated backgrounds (such as `bg-primary-gradient` or large white blocks) have appropriate `dark:` fallbacks. Use classes like `dark:bg-none`, `dark:bg-fluent-bg-card`, and adjust text colors (`dark:text-fluent-fg-primary`) to ensure the UI remains sleek, accessible, and doesn't present jarring, bright blocks in dark mode.
- **Adaptive Official Icons in Light & Dark Mode**: Ensure any official technology, language, or platform icons (e.g., Bicep, Terraform, Markdown) use adaptive light/dark variants or `currentColor` SVGs so they adapt cleanly in dark mode rather than rendering dark marks against dark backgrounds or retaining rigid full-color fills.

#### 1.4 Responsive Design, Layout & Spacing
- **Mobile Scaling**: Scale down component heights and font sizes on mobile using Tailwind's `sm:` prefix. (e.g., `h-[36px] sm:h-[30px]`, `text-[14px] sm:text-[12px]`).
- **Sticky Elements**: For sticky toolbars or headers, use `sticky top-0 z-30 bg-fluent-bg-canvas border-b border-fluent-stroke-subtle`.
- **Page Containers**: Use maximum width containers with responsive padding for main page content (e.g., `max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6`).
- **Standardized Spacing**: Stick to standard Fluent 2 base-4 spacing multiples to ensure consistency:
  - **Component Internals (tight)**: `gap-1.5` (6px) or `gap-2` (8px).
  - **Form Fields & Related Elements**: `gap-4` (16px) or `space-y-4`.
  - **Page Sections**: `gap-6` (24px) or `gap-8` (32px).
- **Symmetrical Padding for Alignment**: Always use symmetrical vertical padding (e.g., `py-1`, `py-2`) instead of asymmetrical padding (e.g., `pt-1 pb-2`) on container elements (especially flex containers). This guarantees perfect vertical centering alignment when using `items-center`.
- **Hide Shortcut Keys on Mobile**: Any keyboard shortcut keys, key badges, or shortcut hints (e.g. `<kbd>` elements, `Ctrl+K`, `⌘K`, `ESC`, navigation arrows `↑ ↓ ↵`) **must never be displayed in mobile view** (`< sm`). Touchscreen mobile devices do not have physical keyboards, and shortcut badges waste critical viewport space. Always hide them on mobile using responsive Tailwind classes (e.g., `hidden sm:inline-flex`, `hidden sm:flex`, or `hidden sm:inline-block`).

#### 1.5 Shadows & Microanimations
- **Shadows**: Use `shadow-soft` for standard cards, `shadow-depth` for hover/active states, and `shadow-flyout` for panels/modals/dropdowns.
- **Microanimations (Fluent 2)**: Add subtle feedback for interactions to make the UI feel alive. Use `transition-all duration-200 ease-in-out` for general state changes (hover, focus). For buttons and interactive cards, apply a "push" effect on click using `active:scale-[0.98]` or `active:scale-95`. Ensure enter animations are snappy and exit animations are graceful.
- **Animations**: Use `animate-fade-in` and `animate-slide-up` for smooth component appearances. For lists or grid items, combine these with the stagger utilities (`stagger-1`, `stagger-2`, etc.) defined in `index.css`.
- **Gradients**: Use `bg-primary-gradient` for premium branded areas and `bg-primary-gradient-hover` for interactive premium elements.
- **Sizing**: Button and input heights should be standardized (e.g., `h-[32px]` for standard inputs, dropdowns, and buttons; `h-[26px]` for compact dropdowns and icon buttons). Borders should be `rounded-[4px]` for buttons/inputs/dropdowns, and `rounded-lg` or `rounded-xl` for cards.

### 2. Core UI Elements

#### 2.1 Buttons
- **Primary/Action Button**: `px-3 h-[32px] bg-fluent-brand-bg text-white rounded-[4px] text-[13px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm inline-flex items-center justify-center gap-1.5`
- **Secondary Button**: `px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium`
- **Ghost/Tertiary Button**: `px-3 h-[32px] rounded-[4px] text-[13px] font-medium text-fluent-fg-secondary hover:text-fluent-brand-fg hover:bg-fluent-brand-bg/10 border border-transparent hover:border-fluent-brand-bg/20 transition-all inline-flex items-center justify-center gap-1.5`
- **Icon Button (Action/Copy)**: `shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary`
- **Icon Button (Danger/Remove)**: `shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-state-danger`

#### 2.2 Form Inputs, Dropdowns & Selects
- **Form Labels**: `text-[13px] font-semibold text-fluent-fg-primary mb-1.5 block`
- **Helper/Description Text**: `text-[12px] text-fluent-fg-secondary mt-1 block`
- **Text Inputs (`<input type="text">`)**: `flex-1 min-w-0 w-full px-3 h-[32px] border rounded outline-none text-[14px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary`
- **Fluent 2 Standard Dropdowns (`FluentDropdown.jsx`)**:
  - **Height & Geometry**: `h-[32px]` (standard) or `h-[26px]` (compact), `rounded-[4px]`.
  - **Trigger Resting State**: `bg-fluent-bg-card border-fluent-stroke-strong hover:border-fluent-fg-primary text-fluent-fg-primary text-[13px] px-3 flex items-center justify-between gap-1.5`.
  - **Trigger Open State**: `border-b-2 border-b-fluent-brand-bg border-x-transparent border-t-transparent shadow-sm`.
  - **Chevron Icon**: Trailing `ChevronDown` (`w-3.5 h-3.5`) that rotates 180° when open (`rotate-180 text-fluent-brand-fg`).
  - **Flyout Popover**: `absolute top-[100%] left-0 z-50 min-w-full bg-fluent-bg-card border border-fluent-stroke-subtle shadow-flyout rounded mt-1 overflow-hidden animate-fade-in`.
  - **Option Items**: `px-3 py-2 text-[13px] hover:bg-fluent-bg-hover text-fluent-fg-secondary hover:text-fluent-fg-primary cursor-pointer transition-colors flex items-center justify-between gap-3`.
  - **Selected Option**: `bg-fluent-bg-subtle text-fluent-fg-primary font-medium` accompanied by a trailing `Check` icon (`text-fluent-brand-fg`).
  - **Accessibility**: Standard ARIA attributes (`role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `role="option"`, `aria-selected`) with full keyboard navigation (Arrow Up/Down, Enter, Space, Escape, Home, End).
- **Searchable Dropdowns (`SearchableSelect.jsx`)**:
  - Use when selecting from large collections (e.g., Azure regions, environments).
  - Features an embedded search filter inside the popover flyout, sticky group headers, and full keyboard navigation.
- **Integrated Input Dropdowns (Action Selects)**:
  - When appending a custom dropdown menu directly to a text input field (e.g., an "Examples" button), wrap both the input and the dropdown trigger in a shared container: `flex items-center w-full h-[32px] border rounded transition-all duration-200 focus-within:border-fluent-brand-bg focus-within:ring-2 focus-within:ring-fluent-brand-bg/20 bg-fluent-bg-canvas border-fluent-stroke-strong overflow-visible relative`.
  - The inner `<input>` must use `flex-1 min-w-0 px-3 h-full outline-none text-[13px] bg-transparent border-none`.
  - The inner dropdown trigger wrapper should use `h-full border-l border-fluent-stroke-subtle bg-fluent-bg-subtle flex items-center shrink-0 relative`.

#### 2.3 Segmented Controls, Toggles & Sliders
- **Shape & Geometry**: Always use standard Fluent 2 geometry (e.g., `rounded-md` for outer containers, `rounded-sm` for inner selected items). **Do not use Apple-style or Material-style fully rounded pill shapes (`rounded-full`)** for toggles or segmented controls.
- **Animation Timings**: Use the standard snappy Fluent timing (`transition-all duration-200 ease-in-out`). Do not use slower animations (`duration-300`, `duration-500`) or bouncy spring curves.
- **Micro-interactions**: Interactive toggle buttons must use the standard `active:scale-95` push effect.
- **Focus Rings**: Ensure strong keyboard accessibility using standard focus rings tailored to the background (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50` on light backgrounds, or `focus-visible:ring-white/50` on dark backgrounds).

#### 2.4 Badges, Tags & Chips
- **Shape & Geometry**: Consistent with other Fluent 2 elements, badges, status tags, and chips must use standard rounded corners (e.g., `rounded-[4px]`). **Do not use fully rounded pill shapes (`rounded-full`)**.
- **Sizing & Padding**: Use compact padding and standardized text sizes. For example: `px-2 py-0.5 text-[11px] font-medium` or `px-2 min-h-[20px] inline-flex items-center text-[12px] font-medium`.
- **Colors**: Use appropriate semantic colours from the Fluent palette (e.g., `bg-fluent-bg-subtle text-fluent-fg-secondary` for neutral tags, or `bg-fluent-info-bg text-fluent-info-text border border-fluent-info-border` for branded/highlighted tags). **Never use Tailwind opacity modifiers on hex-based semantic colors.**
- **Indicator Dots**: Small circular indicator dots (e.g., `w-1.5 h-1.5 rounded-full`) used for status or list bullets are an exception and may remain fully rounded.

#### 2.5 Icons & Imagery: Unification & Standards

The application enforces a strict **"One Concept = One Unified Icon"** rule across all 5 tools and all shared components.

- **Rule of Icon Unification**: Any user action, state, or conceptual entity that performs or represents the same function across the application **MUST** use the exact same standardized icon. Never mix icons for the same meaning across different pages or components (e.g. do not use `<Sliders />` in one pattern builder and `<Filter />` in another; do not use `<Settings2 />` on one page and `<ChevronDown />` on another for bulk collapse/expand).
- **Strict Boundary: Generic Controls vs Concrete Technology Selectors**:
  - **Generic / Categorical Controls**: When a button, tab, toggle, or card header represents Infrastructure as Code, Scripting, or Documentation as a general feature (e.g. "IaC Template", "IAC Template", "Script Export", "Documentation"), you **MUST ALWAYS** use the designated unified generic icon:
    - **Generic IaC (`IaC Template`, `IAC Template`)**: Always use `<Code2 />` from `lucide-react`. Specific vendor logos (Terraform, Bicep, ARM, etc.) are **STRICTLY FORBIDDEN** on generic buttons, tabs, or headers.
    - **Generic Scripting (`Script`, `CLI`)**: Always use `<Terminal />` from `lucide-react`.
    - **Generic Documentation (`Docs`, `Markdown`)**: Always use `<FileText />` from `lucide-react`.
  - **Concrete Technology & Format Selectors**: When a button, tab, or selector represents an explicit choice or preview of a specific format, language, or vendor platform (e.g., Bicep, Terraform, ARM template, JSON payload, PowerShell, Markdown, GitHub, Azure), you **MUST ALWAYS** use the **official technology icon** (`TechnologyIcon.jsx`). Never use generic code brackets or terminal icons when a concrete technology is being selected or previewed.
- **Official Icons Where Possible**:
  - For all technologies, languages, cloud platforms, formats, and providers (e.g., Azure, Microsoft Entra ID, Bicep, Terraform, ARM, JSON, PowerShell, Markdown, GitHub), **always prioritize official, authentic branding** via `TechnologyIcon.jsx` rather than generic placeholder icons or approximations.
  - When introducing a new format or vendor integration, add the official SVG asset to `TechnologyIcon.jsx` rather than substituting a generic icon.
- **Light & Dark Mode Variants Over Fully Coloured Versions**:
  - When official technology icons are embedded in UI chrome (tabs, buttons, toolbars, format selectors, badges):
    - **Always use theme-adaptive monochrome SVGs (`currentColor`) or dedicated light/dark variants**.
    - Icons must seamlessly match the active/inactive state of their container (e.g., `text-fluent-fg-secondary`, `hover:text-fluent-fg-primary`, and `text-fluent-brand-fg` when active).
    - Rigid, fully coloured product logos (e.g., saturated purple Terraform, multi-colour gradient Bicep) disrupt the cohesive Fluent 2 chrome, create visual clutter, and often fail contrast/aesthetic standards across light and dark themes.
- **Icon Backgrounds & Full-Colour Exceptions**:
  - Full-colour official icons are reserved strictly for Azure service/product architectural representations in resource lists or catalog cards. Even then, their container background must always be set to transparent (`bg-transparent`) so the icon stands on its own. Solid category backgrounds should only be used for monochrome, generic, or structural icons.

#### 2.6 Iconography Register

To ensure complete visual unification, always consult this register. If an icon is needed for an action or concept listed below, you **must** use the designated icon:

##### 1. System & User Interaction Actions
| Icon Name | Usage Context / Action |
| :--- | :--- |
| `Copy` | Copying text, snippets, names, or code blocks to clipboard. |
| `Check` | Success feedback state (e.g. temporarily replacing `Copy` after clipboard write, or selected item indicator). |
| `Info` | 'How to use this tool' collapsible blocks, informational callouts, and tooltips. |
| `ExternalLink` | Links opening in a new tab or linking to external documentation / registries. |
| `ChevronDown` / `ChevronUp` | Single-item collapsible accordions, dropdown triggers, and expand/collapse details. |
| `Plus` / `Minus` | Adding or removing items from list configurations. |
| `Trash2` | Destructive removal or deleting an entire configuration node/item. |
| `X` | Closing modals, clearing search inputs, or dismissing overlays. |
| `Search` | Search inputs and filtering text boxes. |
| `Edit2` / `Edit3` | Edit states, configuration panels, pattern builder headers. |
| `Eye` / `EyeOff` | Live preview indicators or toggling preview visibility. |
| `AlertTriangle` / `ShieldAlert` | Warnings, validation errors, or critical alerts. |
| `Settings2` | Bulk action triggers (specifically "Expand All Templates" / "Collapse All Templates" across groups). |
| `RefreshCw` | Resetting configurations, parameters, or builders to factory defaults. |
| `Sparkles` | AI-powered generation features, smart prompt bars, and AI suggestion badges. |
| `Star` | "New" feature or recently added service indicator badge (always with `fill-current`). |

##### 2. Domain & Conceptual Features (Generic Controls)
| Icon Name | Usage Context / Action |
| :--- | :--- |
| `Code2` | **Unified generic logo** for any generic 'IaC', 'IAC Template', or IaC export button, tab, toggle, or card header. Vendor logos (Terraform, Bicep, etc.) must NEVER be used on generic controls. |
| `Terminal` | Generic CLI, shell execution, or script export button/tab. |
| `FileText` | Generic documentation, readme, or text export button/tab. |
| `Sliders` | Form/pattern configuration tabs and parameter builder modes (e.g., "Policy Builder"). |
| `Network` | Architecture topology, topology designer tabs, and network hierarchy views. |
| `Layers` | Management group trees, hierarchical scopes, and policy layers. |
| `Shield` | Security baselines, Conditional Access defaults, and protection controls. |
| `ShieldCheck` | Role-Based Access Control (RBAC), custom roles, and permission assignments. |
| `Lock` | Grant controls, access restrictions, and explicit block rules. |
| `Users` | Identity assignments, personas, user groups, and workload identities. |

##### 3. Concrete Technology & Format Selectors (`TechnologyIcon.jsx`)
When the user is explicitly choosing, filtering, or viewing a concrete format or platform, **always use `<TechnologyIcon />`** with theme-adaptive SVG styling:
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
| **GitHub** | `github` | GitHub repository links, Actions workflows, or source code buttons. |

#### 2.7 Badges & Semantic Colours Register
To ensure visual consistency, always use the following specific color combinations and standard classes for badges, chips, and tags across the application:

| Badge Type | Color Palette & Classes | Usage Context |
| :--- | :--- | :--- |
| **Primary / Brand** | `bg-fluent-brand-bg text-white` | Highlighting entirely new features or premium primary actions (e.g., the "New" badge). |
| **AI / Smart Feature** | `bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-brand-fg` | Identifying AI-powered features, smart generations, or advanced capabilities. |
| **Neutral / Read-only** | `bg-fluent-bg-subtle text-fluent-fg-secondary border border-fluent-stroke-subtle` | Standard tags for metadata, categorization, or inactive items. |
| **Success / Require** | `bg-fluent-cat-green-bg text-fluent-cat-green-fg` | Positive enforcements (e.g., "Require MFA" policies) or successful states. |
| **Danger / Block** | `bg-fluent-cat-red-bg text-fluent-cat-red-fg` | Explicit blocks, destructive actions, or critical risks (e.g., "Block Legacy Auth"). |
| **Warning / Notice** | `bg-fluent-cat-yellow-bg text-fluent-cat-yellow-fg` | Warnings, pending states, or items requiring attention. |
| **Info / Highlight** | `bg-fluent-info-bg text-fluent-info-text border border-fluent-info-border` | Standard informational highlights, active states (e.g., active tabs), or informative tags. |

#### 2.8 Buttons & Actions Register
For interactive elements like buttons, rely on these unified classes and states to ensure consistent user interactions:

| Button Type | Standard Classes | Usage Context |
| :--- | :--- | :--- |
| **Primary Action** | `bg-fluent-brand-bg text-white hover:bg-fluent-brand-hover` | Main calls to action, generating resources, or submitting primary forms. |
| **Secondary Action** | `bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary` | Standard buttons, cancel actions, or secondary operations. |
| **Ghost / Tertiary** | `bg-transparent text-fluent-fg-secondary hover:text-fluent-brand-fg hover:bg-fluent-brand-bg/10` | Less prominent actions, inline text buttons, or subtle toggles. |
| **Danger / Remove** | `bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-state-danger` | Removing items, deleting configurations, or destructive actions. |
| **Success / Copied** | `bg-[#f1faf1] border-[#c6ebc9] text-[#107c10] dark:bg-[#1b2b1b] dark:border-[#1e4620] dark:text-[#a3d4a3]` | Specifically used for temporarily overriding a button's style immediately after a successful copy-to-clipboard action. |

### 3. Layout & Structural Components

#### 3.1 Cards & Containers
- **Main Component Card**: `relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full flex flex-col overflow-hidden`
- **Inner List Item Card**: `bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft dark:shadow-none hover:shadow-md hover:border-fluent-stroke-strong transition-all duration-200 p-4`

#### 3.2 Modals, Dialogs & Overlays
- **Backdrop**: `fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in dark:bg-black/60`
- **Modal Container**: `relative w-full max-w-lg bg-fluent-bg-canvas rounded-xl shadow-flyout border border-fluent-stroke-subtle p-6 animate-slide-up`

#### 3.3 Navigation, Tabs & Accessibility
- **Tabs/Active States**: For selectable horizontal tabs, use `bg-fluent-info-bg text-fluent-brand-fg font-semibold shadow-sm` for the active/selected state, and `bg-transparent text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary` for inactive states.
- **Keyboard Navigation & Mobile Visibility**: Ensure keyboard shortcuts are implemented where relevant (e.g., `Escape` to clear/close, `/` for search, `Ctrl+K` for global prompts). However, **any visual shortcut keys or badges (`<kbd>`, key hints) must NOT be visible in mobile view** (use `hidden sm:inline-flex` or `hidden sm:flex`). 
- **Accessibility & Focus**: Always use appropriate semantic HTML or ARIA roles (`role="toolbar"`, `role="tablist"`, `role="tab"`) and indicate state (`aria-selected`, `aria-hidden`, `aria-label`). For interactive elements, ensure keyboard focus is visible using `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 focus-visible:border-fluent-brand-bg`.

#### 3.4 Tooltips, Popovers & Context Menus
Ensure floating elements are consistent with Fluent 2 standards:
- **Tooltips**: `z-50 px-2.5 py-1.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle shadow-flyout text-[12px] text-fluent-fg-primary font-medium`
- **Context Menus/Popovers**: Use a clean container with `bg-fluent-bg-canvas border border-fluent-stroke-subtle shadow-flyout rounded-lg z-40 overflow-hidden` and standard item padding (e.g., `px-3 py-2 text-[13px] hover:bg-fluent-bg-hover text-fluent-fg-primary cursor-pointer transition-colors`).

### 4. Data Display & Specialized Views

#### 4.1 Copyable Text Fields & Snippets
To present read-only text (like generated resource names, IDs, or short policies) intended for the user to copy, maintain a unified Fluent 2 appearance:
- **Snippet Container**: Use a clean, subtle read-only field appearance: `group/copy relative flex items-center gap-2 px-3 py-1.5 min-h-[32px] w-full min-w-0 rounded-[4px] border bg-fluent-bg-canvas hover:bg-fluent-bg-hover border-transparent transition-all`. For emphasis on primary generated assets, you may use a subtle brand tint (e.g. `bg-fluent-brand-bg/5`).
- **Snippet Text**: Ensure the text stands out as copyable data by using a monospace font: `flex-1 min-w-0 font-mono text-[13px] font-medium text-fluent-fg-primary truncate`. If it represents a primary generated asset, you may use `text-fluent-brand-fg` for emphasis.
- **Copy Button (Default State)**: Embed a copy button adjacent to or within the container. Use the standard "Icon Button (Action/Copy)" from Section 2, or a compact variation designed to sit inside the snippet container: `shrink-0 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[4px] border text-[11px] font-medium transition-colors shadow-sm outline-none bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-primary hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong`.
- **Copy Button (Success/Copied State)**: When an item is copied, visually indicate success on the button using standard Fluent 2 positive colours: `bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]`. Ensure the icon swaps from `<Copy />` to `<Check />`.

#### 4.2 Code Snippets & Terminal Blocks
- **Terminal/Code Container**: Use `bg-[#1E1E1E] w-full flex flex-col flex-1 h-full min-h-0` for the dark container background housing the code block.
- **Terminal/Code Content (`<pre>`)**: Use `flex-1 text-[13px] leading-relaxed font-mono overflow-auto p-5 text-[#D4D4D4] m-0` for the actual code text and scrollable area.
- **Terminal Header/Toolbar**: Use `px-5 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle shrink-0` for the action bar situated above the terminal window.
- **Export Format Tabs & Technology Icons**: In terminal headers, code generator toolbars, or format pickers, export tabs (JSON, Bicep, Terraform, Markdown, ARM) must use official technology icons with light and dark mode variants (or `currentColor` monochrome SVGs) rather than fully coloured versions, matching the tab's active and hover color states.

### 5. Interaction States

#### 5.1 Common States (Disabled, Error, Success, Loading)
- **Disabled State**: Apply `disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-fluent-bg-subtle disabled:border-fluent-stroke-subtle disabled:text-fluent-fg-tertiary` to inputs, dropdowns, and buttons when inactive to clearly indicate they cannot be interacted with.
- **Error/Invalid State**: Use `border-fluent-state-danger` for borders and `text-fluent-state-danger` for error text or icons to provide clear validation feedback.
- **Success/Valid State**: Use `text-fluent-state-success` and `border-fluent-state-success` for positive feedback, such as successful form submissions or active integrations.
- **Loading State (Skeletons & Spinners)**: Use a subtle pulse animation (`animate-pulse`) on containers for skeleton loading states. For centralized page or component loading (e.g., React Suspense fallbacks), use a Fluent 2 standard spinner constructed with `w-8 h-8 rounded-full border-[3px] border-fluent-brand-bg/20 border-t-fluent-brand-bg animate-spin` alongside descriptive text, rather than plain text strings. Ensure loaders maintain user context without aggressive visual changes.

### 6. Application-Specific Logic

#### 6.1 Adding & Updating Services
When adding new services or updating existing services in the `constants.js` database, you **must**:
1. **Prevent Duplicates**: Before adding a new service, **always** thoroughly search the entirety of `constants.js` to ensure the service does not already exist. Do not add duplicate entries. If a basic text search fails, verify by checking the specific category manually or searching for alternative names/abbreviations. It is critical to confirm the service is genuinely missing before appending.
2. **"New" Badge Application**: Add the `isNew: true` property **only** to genuinely newly added services that did not exist previously. Do **not** apply this badge to existing services that are merely being updated or refactored.
3. Remove the `isNew: true` property from any previously added services that are no longer the most recent additions, ensuring the badge remains exclusive to the latest entries.
4. Add/Update relevant icons in `src/assets/icons/` for any new services. Ensure the filename matches the service name and use the existing heroicons for vector images or the provided templates for SVG assets. If no exact icon exists then apply the closest match. Never use generic or AI-generated icons.
5. **Documentation & Pricing Links**: Always include a valid `learnUrl` pointing to the official Microsoft Learn documentation overview for the service, and a `pricingUrl` pointing to the specific Azure Pricing Calculator page for the service. Validate that these links do not return a 404 before committing.
6. **Service Lifecycle States**: Use the `legacy: true` property to label services that are still available but have a newer recommended alternative. Services should only be marked as `retired: true` if they are no longer supported or have been deprecated.
7. **Content Separation**: Ensure a strict separation of concerns between descriptive and operational text. The 'About this service' fields (`desc` and `longDesc`) must strictly explain what the service is and what it does. The 'Deployment guidance' fields (`bestPractice` and `namingGuidance`) should contain all operational advice, including recommendations on how best to deploy the service, and must clearly identify newer recommended alternatives if the current service is marked as `legacy` or `retired`.

#### 6.2 Adding New Tools
When adding a new tool to the application, you **must**:
1. Add a card for the new tool to the Dashboard.
2. Ensure the new tool card includes a badge to highlight that the tool is new (`isNew: true`).
3. If the tool includes AI or smart generation capabilities, set `hasAi: true` on its tool entry in `src/pages/Dashboard.jsx` to render the `'AI Powered'` badge.
4. Organise all cards for each tool on the dashboard alphabetically.
5. Organise the navigation links in the sidebar alphabetically (keeping Dashboard at the top).
6. Implement a collapsible 'How to use this tool' informational block at the top of the tool's page (similar to existing tools) to explain its purpose and usage.

#### 6.3 AI-Powered Tool Layout & Interaction Standards
When building or refactoring tools with AI or smart natural language prompt capabilities (e.g., Resource Naming, RBAC Custom Role Designer), you **must** adhere to the following unified layout structure:
1. **AI Prompt Bar as Primary Interaction Point**: Place the AI Prompt Bar component prominently at the top of the tool's workspace, directly beneath the collapsible "How to use this tool" guidance block. It must serve as the primary and fastest route for user interaction.
2. **Collapsible Manual Configuration**:
   - Wrap manual property inputs, parameter builders, and pre-configured templates inside a collapsible panel that is **collapsed by default** (`isConfigMinimized = true`).
   - Provide a centered toggle button displaying `Show manual configuration` / `Hide manual configuration` (or tool-specific naming) with the `Settings2` icon and `ChevronDown` / `ChevronUp`.
   - When opened, animate the manual configuration card using `animate-slide-up`.
3. **Primary Workspace & Results Below**: Position the main operational view (e.g., resource grids, permissions selectors, live JSON exports) directly beneath the AI prompt bar and manual configuration toggle.
4. **Interactive AI Feedback Banner**: Always include an AI resolution banner displaying the summary, least-privilege / CAF governance rationale, and quick-filter badges upon successful AI generation.
5. **Keyboard Accessibility**: Ensure `Ctrl+K` focuses the AI Prompt Bar and `Escape` blurs/clears it.
6. **Dashboard 'AI Powered' Badge**: Always set `hasAi: true` on the tool's metadata entry in `src/pages/Dashboard.jsx` so the `'AI Powered'` chip is visible on the dashboard card.

