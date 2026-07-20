# Agent Rules

## Git Workflows

Whenever you are asked to commit and sync changes, you **must** automatically bump the version in `package.json` before creating the commit. **Exception:** Do not bump the version in `package.json` if you are only updating non-application files (e.g., `README.md`, documentation, `.agents/AGENTS.md`).

1. Increment the patch version (or minor/major if instructed otherwise) in `package.json`.
2. Stage `package.json` along with the other modified files.
3. Proceed with the commit and push/sync process.

## UI Design Language & Component Standards

### 🚨 Strict Deprecation of Legacy Classes
To maintain a unified Fluent 2 design language, the following legacy UI patterns are **STRICTLY FORBIDDEN**:
- **Hardcoded & Generic Colors**: Do not use raw hex colors (e.g., `bg-[#292929]`, `text-[#D4D4D4]`) or generic Tailwind colors (e.g., `bg-white`, `bg-blue-600`, `text-gray-300`). Always use the corresponding `fluent-*` semantic tokens defined below.
- **Arbitrary Hover States**: Avoid ad-hoc hover background definitions like `hover:bg-black/5` or `dark:hover:bg-white/5`. Use the standardized `hover:bg-fluent-bg-hover` or `hover:bg-fluent-bg-subtle`.
- **Legacy Shadows**: Do not use generic Tailwind shadows like `shadow-md` or `shadow-lg`. Use `shadow-soft`, `shadow-depth`, or `shadow-flyout`.
- **Inconsistent Button/Input Padding**: Do not use ad-hoc padding/sizing like `px-4 py-2` or `px-3 py-2.5`. Use the standardized `px-3 h-[32px]` format.

When creating or modifying UI components, you **must** adhere to the following Tailwind CSS class conventions established in `ResourceNamingPage.jsx` and its related components. This ensures a consistent "Fluent UI" design language across the application.

### 1. Form Inputs & Selects
- **Text Inputs (`<input type="text">`)**: `flex-1 min-w-0 w-full px-3 h-[32px] border rounded outline-none text-[14px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary`
- **Dropdowns (`<select>`)**: `px-2.5 h-[32px] min-w-0 w-full border rounded outline-none text-[13px] transition-all duration-200 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong hover:border-fluent-fg-primary focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 cursor-pointer text-ellipsis`

### 2. Buttons
- **Primary/Action Button**: `px-3 h-[32px] bg-fluent-brand-bg text-white rounded-[4px] text-[13px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm inline-flex items-center justify-center gap-1.5`
- **Secondary Button**: `px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium`
- **Ghost/Tertiary Button**: `px-3 h-[32px] rounded-[4px] text-[13px] font-medium text-fluent-fg-secondary hover:text-fluent-brand-fg hover:bg-fluent-brand-bg/10 border border-transparent hover:border-fluent-brand-bg/20 transition-all inline-flex items-center justify-center gap-1.5`
- **Icon Button (Action/Copy)**: `shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary`
- **Icon Button (Danger/Remove)**: `shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-state-danger`

### 3. Cards & Containers
- **Main Component Card**: `relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full flex flex-col overflow-hidden`
- **Inner List Item Card**: `bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft dark:shadow-none hover:shadow-md hover:border-fluent-stroke-strong transition-all duration-200 p-4`

### 4. Colours & Theming
- **Backgrounds**: Use `bg-fluent-bg-canvas` for the main application background, and `bg-fluent-bg-card` for components and panels. Use `bg-fluent-bg-subtle` or `bg-fluent-bg-hover` for active/hover states.
- **Text/Foreground**: Use `text-fluent-fg-primary` for main text, `text-fluent-fg-secondary` for supporting text, and `text-fluent-fg-tertiary` for placeholders.
- **Borders**: Use `border-fluent-stroke-subtle` for dividers and card borders, and `border-fluent-stroke-strong` for interactive elements like inputs.
- **Brand Accents**: Use `bg-fluent-brand-bg` and `text-fluent-brand-fg` for primary actions or highlights.
- **Category Colors**: When displaying categorized items (like Azure services), utilise the specific category colours from Tailwind config (e.g., `bg-fluent-cat-blue-bg text-fluent-cat-blue-fg`).

### 5. Layout, Shadows & Microanimations
- **Shadows**: Use `shadow-soft` for standard cards, `shadow-depth` for hover/active states, and `shadow-flyout` for panels/modals.
- **Microanimations (Fluent 2)**: Add subtle feedback for interactions to make the UI feel alive. Use `transition-all duration-200 ease-in-out` for general state changes (hover, focus). For buttons and interactive cards, apply a "push" effect on click using `active:scale-[0.98]` or `active:scale-95`. Ensure enter animations are snappy and exit animations are graceful.
- **Animations**: Use `animate-fade-in` and `animate-slide-up` for smooth component appearances. For lists or grid items, combine these with the stagger utilities (`stagger-1`, `stagger-2`, etc.) defined in `index.css`.
- **Gradients**: Use `bg-primary-gradient` for premium branded areas and `bg-primary-gradient-hover` for interactive premium elements.
- **Sizing**: Button and input heights should be standardized (e.g., `h-[32px]` for standard inputs and buttons, `h-[26px]` for compact icon buttons). Borders should be `rounded-[4px]` for buttons/inputs, and `rounded-lg` or `rounded-xl` for cards.

### 6. Navigation, Tabs & Accessibility
- **Tabs/Active States**: For selectable horizontal tabs, use `bg-fluent-info-bg text-fluent-brand-fg font-semibold shadow-sm` for the active/selected state, and `bg-transparent text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary` for inactive states.
- **Keyboard Navigation**: Ensure keyboard shortcuts are implemented where relevant (e.g., `Escape` to clear/close, `/` for search, `Ctrl+K` for global prompts). 
- **Accessibility & Focus**: Always use appropriate semantic HTML or ARIA roles (`role="toolbar"`, `role="tablist"`, `role="tab"`) and indicate state (`aria-selected`, `aria-hidden`, `aria-label`). For interactive elements, ensure keyboard focus is visible using `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 focus-visible:border-fluent-brand-bg`.

### 7. Responsive Design & Structure
- **Mobile Scaling**: Scale down component heights and font sizes on mobile using Tailwind's `sm:` prefix. (e.g., `h-[36px] sm:h-[30px]`, `text-[14px] sm:text-[12px]`).
- **Sticky Elements**: For sticky toolbars or headers, use `sticky top-0 z-30 bg-fluent-bg-canvas border-b border-fluent-stroke-subtle`.
- **Page Containers**: Use maximum width containers with responsive padding for main page content (e.g., `max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6`).

### 8. Icons & Imagery
- **Standardisation**: Consistently use the same standardized icons for buttons, actions, or other UI elements that share the same functionality across the application.
- **Official Microsoft Icons**: Prioritise using official Microsoft icons (e.g., from Fluent UI System Icons or standard Microsoft design assets) where possible to maintain alignment with the Azure portal experience and Fluent UI design language.

### 9. Code Snippets & Terminal Blocks
- **Terminal/Code Container**: Use `bg-[#1E1E1E] w-full flex flex-col flex-1 h-full min-h-0` for the dark container background housing the code block.
- **Terminal/Code Content (`<pre>`)**: Use `flex-1 text-[13px] leading-relaxed font-mono overflow-auto p-5 text-[#D4D4D4] m-0` for the actual code text and scrollable area.
- **Terminal Header/Toolbar**: Use `px-5 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle shrink-0` for the action bar situated above the terminal window.

### 10. Common States (Disabled, Error, Success)
- **Disabled State**: Apply `disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-fluent-bg-subtle disabled:border-fluent-stroke-subtle disabled:text-fluent-fg-tertiary` to inputs and buttons when inactive to clearly indicate they cannot be interacted with.
- **Error/Invalid State**: Use `border-fluent-state-danger` for borders and `text-fluent-state-danger` for error text or icons to provide clear validation feedback.
- **Success/Valid State**: Use `text-fluent-state-success` and `border-fluent-state-success` for positive feedback, such as successful form submissions or active integrations.
- **Loading State**: Use a subtle pulse animation (`animate-pulse`) on containers or a spinner with `text-fluent-brand-bg` for loading states to maintain user context without aggressive visual changes.

### 11. Segmented Controls, Toggles & Sliders
- **Shape & Geometry**: Always use standard Fluent 2 geometry (e.g., `rounded-md` for outer containers, `rounded-sm` for inner selected items). **Do not use Apple-style or Material-style fully rounded pill shapes (`rounded-full`)** for toggles or segmented controls.
- **Animation Timings**: Use the standard snappy Fluent timing (`transition-all duration-200 ease-in-out`). Do not use slower animations (`duration-300`, `duration-500`) or bouncy spring curves.
- **Micro-interactions**: Interactive toggle buttons must use the standard `active:scale-95` push effect.
- **Focus Rings**: Ensure strong keyboard accessibility using standard focus rings tailored to the background (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50` on light backgrounds, or `focus-visible:ring-white/50` on dark backgrounds).

### 12. Badges, Tags & Chips
- **Shape & Geometry**: Consistent with other Fluent 2 elements, badges, status tags, and chips must use standard rounded corners (e.g., `rounded-[4px]`). **Do not use fully rounded pill shapes (`rounded-full`)**.
- **Sizing & Padding**: Use compact padding and standardized text sizes. For example: `px-2 py-0.5 text-[11px] font-medium` or `px-2 min-h-[20px] inline-flex items-center text-[12px] font-medium`.
- **Colors**: Use appropriate semantic colours from the Fluent palette (e.g., `bg-fluent-bg-subtle text-fluent-fg-secondary` for neutral tags, or `bg-fluent-brand-bg/10 text-fluent-brand-fg` for branded tags).
- **Indicator Dots**: Small circular indicator dots (e.g., `w-1.5 h-1.5 rounded-full`) used for status or list bullets are an exception and may remain fully rounded.

### 13. Copyable Text Fields & Snippets
To present read-only text (like generated resource names, IDs, or short policies) intended for the user to copy, maintain a unified Fluent 2 appearance:
- **Snippet Container**: Use a clean, subtle read-only field appearance: `group/copy relative flex items-center gap-2 px-3 py-1.5 min-h-[32px] w-full min-w-0 rounded-[4px] border bg-fluent-bg-canvas hover:bg-fluent-bg-hover border-transparent transition-all`. For emphasis on primary generated assets, you may use a subtle brand tint (e.g. `bg-fluent-brand-bg/5`).
- **Snippet Text**: Ensure the text stands out as copyable data by using a monospace font: `flex-1 min-w-0 font-mono text-[13px] font-medium text-fluent-fg-primary truncate`. If it represents a primary generated asset, you may use `text-fluent-brand-fg` for emphasis.
- **Copy Button (Default State)**: Embed a copy button adjacent to or within the container. Use the standard "Icon Button (Action/Copy)" from Section 2, or a compact variation designed to sit inside the snippet container: `shrink-0 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[4px] border text-[11px] font-medium transition-colors shadow-sm outline-none bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-primary hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong`.
- **Copy Button (Success/Copied State)**: When an item is copied, visually indicate success on the button using standard Fluent 2 positive colours: `bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]`. Ensure the icon swaps from `<Copy />` to `<Check />`.
