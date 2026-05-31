import { Moon, Sun } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Header Component
 * 
 * Top navigation bar displaying the application branding and a dark/light mode toggle.
 * Positioned fixed at the top of the viewport.
 * 
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Current theme state.
 * @param {Function} props.onToggleTheme - Callback to toggle the theme.
 * @returns {JSX.Element}
 */
export default function Header({ isDarkMode, onToggleTheme, title = "Resource Naming Tool" }) {
    return (
        <header className="h-[48px] flex items-center justify-between px-5 border-b z-50 fixed top-0 w-full bg-primary-gradient dark:bg-fluent-bg-darker border-transparent dark:border-fluent-stroke-subtle text-white shadow-soft dark:shadow-none">
            <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[16px] text-white tracking-tight">atozazure</span>
                    <span className="text-[13px] text-white/40 mx-1">|</span>
                    <span className="text-[12px] text-white/80 tracking-wide">{title}</span>
                </div>
            </div>
            <button
                onClick={onToggleTheme}
                className="flex items-center gap-2 px-3 h-[32px] rounded border transition-all text-[13px] font-semibold bg-white/10 dark:bg-fluent-bg-hover border-white/20 dark:border-fluent-stroke-subtle text-white hover:bg-white/20 dark:hover:bg-fluent-bg-subtle"
            >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
        </header>
    );
}

Header.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
    onToggleTheme: PropTypes.func.isRequired,
    title: PropTypes.string,
};
