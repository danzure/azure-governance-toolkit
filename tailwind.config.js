/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Segoe UI"', '"Segoe UI Web (West European)"', '-apple-system', 'BlinkMacSystemFont', 'Roboto', '"Helvetica Neue"', 'sans-serif'],
                mono: ['Cascadia Code', 'Consolas', 'ui-monospace', 'monospace'],
            },
            colors: {
                fluent: {
                    'bg-card': 'var(--colorNeutralBackground1)',
                    'bg-canvas': 'var(--colorNeutralBackground2)',
                    'bg-hover': 'var(--colorNeutralBackground3)',
                    'bg-subtle': 'var(--colorNeutralBackground4)',
                    'bg-darker': 'var(--colorNeutralBackground5)',
                    'fg-primary': 'var(--colorNeutralForeground1)',
                    'fg-secondary': 'var(--colorNeutralForeground2)',
                    'fg-tertiary': 'var(--colorNeutralForeground3)',
                    'stroke-strong': 'var(--colorNeutralStroke1)',
                    'stroke-subtle': 'var(--colorNeutralStroke2)',
                    'brand-bg': 'var(--colorBrandBackground)',
                    'brand-hover': 'var(--colorBrandBackgroundHover)',
                    'brand-pressed': 'var(--colorBrandBackgroundPressed)',
                    'brand-fg': 'var(--colorBrandForeground)',
                    'info-bg': 'var(--colorInfoBackground)',
                    'info-border': 'var(--colorInfoBorder)',
                    'info-text': 'var(--colorInfoText)',
                    'state-danger': 'var(--colorStateDanger)',
                    
                    // Category specific colors
                    'cat-blue-bg': 'var(--colorCategoryBlueBg)',
                    'cat-blue-fg': 'var(--colorCategoryBlueFg)',
                    'cat-orange-bg': 'var(--colorCategoryOrangeBg)',
                    'cat-orange-fg': 'var(--colorCategoryOrangeFg)',
                    'cat-green-bg': 'var(--colorCategoryGreenBg)',
                    'cat-green-fg': 'var(--colorCategoryGreenFg)',
                    'cat-green-border': 'var(--colorCategoryGreenBorder)',
                    'cat-purple-bg': 'var(--colorCategoryPurpleBg)',
                    'cat-purple-fg': 'var(--colorCategoryPurpleFg)',
                    'cat-cyan-bg': 'var(--colorCategoryCyanBg)',
                    'cat-cyan-fg': 'var(--colorCategoryCyanFg)',
                    'cat-teal-bg': 'var(--colorCategoryTealBg)',
                    'cat-teal-fg': 'var(--colorCategoryTealFg)',
                    'cat-red-bg': 'var(--colorCategoryRedBg)',
                    'cat-red-fg': 'var(--colorCategoryRedFg)',
                    'cat-magenta-bg': 'var(--colorCategoryMagentaBg)',
                    'cat-magenta-fg': 'var(--colorCategoryMagentaFg)',
                    'cat-yellow-bg': 'var(--colorCategoryYellowBg)',
                    'cat-yellow-fg': 'var(--colorCategoryYellowFg)',
                    'cat-neutral-bg': 'var(--colorCategoryNeutralBg)',
                    'cat-neutral-fg': 'var(--colorCategoryNeutralFg)',

                    // Code editor surfaces
                    'code-bg': 'var(--colorCodeBackground)',
                    'code-fg': 'var(--colorCodeForeground)',
                }
            },
            boxShadow: {
                'soft': '0 2px 4px rgba(0, 0, 0, 0.04), 0 0 2px rgba(0, 0, 0, 0.06)', // Standard card
                'depth': '0 8px 16px rgba(0, 0, 0, 0.08), 0 0 2px rgba(0, 0, 0, 0.04)', // Hover / active
                'flyout': '0 16px 32px rgba(0, 0, 0, 0.12), 0 0 4px rgba(0, 0, 0, 0.08)', // Panels / Modals
                'glow': '0 0 15px rgba(0, 120, 212, 0.3)',
            },
            backgroundImage: {
                'primary-gradient': 'linear-gradient(135deg, #0f6cbd 0%, #115ea3 100%)',
                'primary-gradient-hover': 'linear-gradient(135deg, #115ea3 0%, #0f548c 100%)',
                'copilot-aura-gradient': 'linear-gradient(90deg, var(--colorCopilotBlue) 0%, var(--colorCopilotIris) 40%, var(--colorCopilotCyan) 70%, var(--colorCopilotBlue) 100%)',
                'copilot-stream-gradient': 'linear-gradient(90deg, transparent 0%, var(--colorCopilotBlue) 25%, var(--colorCopilotIris) 50%, var(--colorCopilotCyan) 75%, transparent 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) both',
                'slide-up': 'slideUp 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) both',
                'scale-in': 'scaleIn 0.15s cubic-bezier(0.1, 0.9, 0.2, 1) both',
                'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'ping-slow': 'ping 2.8s cubic-bezier(0, 0, 0.2, 1) infinite',
                'copilot-stream': 'copilotStream 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                'copilot-gradient': 'copilotGradient 4.5s ease infinite',
                'copilot-aura': 'copilotAura 3.5s ease-in-out infinite',
                'sparkle-glow': 'sparkleGlow 2.8s ease-in-out infinite',
                'sparkle-twinkle': 'sparkleTwinkle 2.8s ease-in-out infinite',
                'thinking-dot': 'thinkingDot 1.4s ease-in-out infinite',
                'shimmer-text': 'shimmerText 3.2s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(6px)', opacity: '0' },
                    '100%': { transform: 'none', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.96)', opacity: '0' },
                    '100%': { transform: 'none', opacity: '1' },
                },
                copilotStream: {
                    '0%': { transform: 'translateX(-100%) scaleX(0.5)', opacity: '0.7' },
                    '50%': { transform: 'translateX(35%) scaleX(0.9)', opacity: '1' },
                    '100%': { transform: 'translateX(200%) scaleX(0.5)', opacity: '0.7' },
                },
                copilotGradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                copilotAura: {
                    '0%, 100%': { opacity: '0.45', transform: 'scale(1)', backgroundPosition: '0% 50%' },
                    '50%': { opacity: '0.8', transform: 'scale(1.008)', backgroundPosition: '100% 50%' },
                },
                sparkleGlow: {
                    '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
                    '50%': { transform: 'scale(1.12)', filter: 'brightness(1.2)' },
                },
                sparkleTwinkle: {
                    '0%, 100%': { transform: 'scale(1) rotate(0deg)', filter: 'drop-shadow(0 0 3px rgba(15, 108, 189, 0.4))' },
                    '25%': { transform: 'scale(1.14) rotate(-6deg)', filter: 'drop-shadow(0 0 9px rgba(119, 60, 189, 0.65))' },
                    '50%': { transform: 'scale(1.06) rotate(0deg)', filter: 'drop-shadow(0 0 5px rgba(15, 108, 189, 0.5))' },
                    '75%': { transform: 'scale(1.16) rotate(6deg)', filter: 'drop-shadow(0 0 9px rgba(0, 183, 195, 0.65))' },
                },
                thinkingDot: {
                    '0%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
                    '50%': { transform: 'translateY(-2.5px)', opacity: '1' },
                },
                shimmerText: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
            },
        },
    },
    plugins: [],
}
