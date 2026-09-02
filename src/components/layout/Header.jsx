import { Menu } from 'lucide-react';
import PropTypes from 'prop-types';
import ThemeToggle from './ThemeToggle';

/**
 * Header Component
 * 
 * Top navigation bar displaying the application branding and a dark/light mode toggle.
 * Positioned fixed at the top of the viewport.
 * On mobile, shows a hamburger button to open the navigation drawer.
 * 
 * @param {string} props.themePref - Current theme preference ('system', 'light', 'dark').
 * @param {Function} props.onSetTheme - Callback to set the theme.
 * @param {Function} props.onToggleMenu - Callback to toggle the navigation menu (mobile).
 * @param {string} props.title - Title to display in the header.
 * @param {boolean} props.isMobile - Whether the viewport is mobile-sized.
 * @param {boolean} [props.systemPrefersDark] - Whether system currently prefers dark mode.
 * @returns {JSX.Element}
 */
export default function Header({ themePref, onSetTheme, onToggleMenu, title = "Resource Naming Tool", isMobile, systemPrefersDark }) {
    return (
        <header className="h-[48px] flex items-center justify-between px-3 md:px-5 border-b z-50 fixed top-0 w-full bg-primary-gradient dark:bg-fluent-bg-darker border-transparent dark:border-fluent-stroke-subtle text-white shadow-soft dark:shadow-none">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
                {/* Hamburger button — mobile only */}
                {isMobile && (
                    <button
                        onClick={onToggleMenu}
                        className="p-1.5 -ml-1 rounded-md hover:bg-fluent-bg-hover transition-colors shrink-0"
                        aria-label="Toggle navigation menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}
                <div className="flex items-baseline gap-2 min-w-0">
                    <a href="https://atozazure.com" className="font-semibold text-[18px] text-white tracking-tight shrink-0 hover:opacity-80 transition-opacity">atozazure</a>
                    <span className="text-[14px] text-white/40 mx-1 hidden sm:inline">|</span>
                    <span className="text-[14px] text-white/80 tracking-wide truncate hidden sm:inline">{title}</span>
                </div>
            </div>
            
            {/* Fluent 2 Theme Toggle Flyout */}
            <ThemeToggle 
                themePref={themePref}
                onSetTheme={onSetTheme}
                systemPrefersDark={systemPrefersDark}
            />
        </header>
    );
}

Header.propTypes = {
    themePref: PropTypes.oneOf(['system', 'light', 'dark']).isRequired,
    onSetTheme: PropTypes.func.isRequired,
    onToggleMenu: PropTypes.func,
    title: PropTypes.string,
    isMobile: PropTypes.bool,
    systemPrefersDark: PropTypes.bool
};
