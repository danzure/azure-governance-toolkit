/**
 * Category Color Definitions
 * 
 * Defines the standard color palette mapping for each Azure resource category.
 * Each category provides specific Tailwind background and text color classes 
 * that automatically handle both light and dark mode themes.
 * Designed to align with the official Microsoft Fluent UI semantic color palette.
 */
const CATEGORY_COLORS = {
    'General': { bgClass: 'bg-fluent-cat-blue-bg', textClass: 'text-fluent-cat-blue-fg' },
    'Compute': { bgClass: 'bg-fluent-cat-blue-bg', textClass: 'text-fluent-cat-blue-fg' },
    'Networking': { bgClass: 'bg-fluent-cat-orange-bg', textClass: 'text-fluent-cat-orange-fg' },
    'Storage': { bgClass: 'bg-fluent-cat-green-bg', textClass: 'text-fluent-cat-green-fg' },
    'Web': { bgClass: 'bg-fluent-cat-purple-bg', textClass: 'text-fluent-cat-purple-fg' },
    'Databases': { bgClass: 'bg-fluent-cat-cyan-bg', textClass: 'text-fluent-cat-cyan-fg' },
    'Containers': { bgClass: 'bg-fluent-cat-teal-bg', textClass: 'text-fluent-cat-teal-fg' },
    'Security': { bgClass: 'bg-fluent-cat-red-bg', textClass: 'text-fluent-cat-red-fg' },
    'Integration': { bgClass: 'bg-fluent-cat-magenta-bg', textClass: 'text-fluent-cat-magenta-fg' },
    'Analytics': { bgClass: 'bg-fluent-cat-yellow-bg', textClass: 'text-fluent-cat-yellow-fg' },
    'AI + ML': { bgClass: 'bg-fluent-cat-cyan-bg', textClass: 'text-fluent-cat-cyan-fg' },
    'Management + Governance': { bgClass: 'bg-fluent-cat-neutral-bg', textClass: 'text-fluent-cat-neutral-fg' },
    'IoT': { bgClass: 'bg-fluent-cat-teal-bg', textClass: 'text-fluent-cat-teal-fg' },
    'Desktop Virtualization': { bgClass: 'bg-fluent-cat-blue-bg', textClass: 'text-fluent-cat-blue-fg' },
    'DevOps': { bgClass: 'bg-fluent-cat-purple-bg', textClass: 'text-fluent-cat-purple-fg' }
};

// Helper function to get classes for a category
export function getCategoryColors(category) {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS['General'];
}
