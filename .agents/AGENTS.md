# Agent Rules

## Git Workflows

Whenever you are asked to commit and sync changes, you **must** automatically bump the version in `package.json` before creating the commit. 

1. Increment the patch version (or minor/major if instructed otherwise) in `package.json`.
2. Stage `package.json` along with the other modified files.
3. Proceed with the commit and push/sync process.

## UI Design Language & Component Standards

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

### 5. Layout, Shadows & Animations
- **Shadows**: Use `shadow-soft` for standard cards, `shadow-depth` for hover/active states, and `shadow-flyout` for panels/modals.
- **Animations**: Use `animate-fade-in` and `animate-slide-up` for smooth component appearances. For lists or grid items, combine these with the stagger utilities (`stagger-1`, `stagger-2`, etc.) defined in `index.css`.
- **Gradients**: Use `bg-primary-gradient` for premium branded areas and `bg-primary-gradient-hover` for interactive premium elements.
- **Sizing**: Button and input heights should be standardized (e.g., `h-[32px]` for standard inputs and buttons, `h-[26px]` for compact icon buttons). Borders should be `rounded-[4px]` for buttons/inputs, and `rounded-lg` or `rounded-xl` for cards.

### 6. Navigation, Tabs & Accessibility
- **Tabs/Active States**: For selectable horizontal tabs, use `bg-fluent-info-bg text-fluent-brand-fg font-semibold shadow-sm` for the active/selected state, and `bg-transparent text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary` for inactive states.
- **Keyboard Navigation**: Ensure keyboard shortcuts are implemented where relevant (e.g., `Escape` to clear/close, `/` for search, `Ctrl+K` for global prompts). 
- **Accessibility**: Always use appropriate semantic HTML or ARIA roles (`role="toolbar"`, `role="tablist"`, `role="tab"`) and indicate state (`aria-selected`, `aria-hidden`, `aria-label`).

### 7. Responsive Design & Structure
- **Mobile Scaling**: Scale down component heights and font sizes on mobile using Tailwind's `sm:` prefix. (e.g., `h-[36px] sm:h-[30px]`, `text-[14px] sm:text-[12px]`).
- **Sticky Elements**: For sticky toolbars or headers, use `sticky top-0 z-30 bg-fluent-bg-canvas border-b border-fluent-stroke-subtle`.
- **Page Containers**: Use maximum width containers with responsive padding for main page content (e.g., `max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6`).

### 8. Icons & Imagery
- **Standardisation**: Consistently use the same standardized icons for buttons, actions, or other UI elements that share the same functionality across the application.
- **Official Microsoft Icons**: Prioritise using official Microsoft icons (e.g., from Fluent UI System Icons or standard Microsoft design assets) where possible to maintain alignment with the Azure portal experience and Fluent UI design language.
