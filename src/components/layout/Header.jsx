import { Menu, Sun, Moon, Monitor } from 'lucide-react';
import PropTypes from 'prop-types';

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
 * @returns {JSX.Element}
 */
export default function Header({ themePref, onSetTheme, onToggleMenu, title = "Resource Naming Tool", isMobile }) {
    return (
        <header className="h-[48px] flex items-center justify-between px-3 md:px-5 border-b z-50 fixed top-0 w-full bg-primary-gradient dark:bg-fluent-bg-darker border-transparent dark:border-fluent-stroke-subtle text-white shadow-soft dark:shadow-none">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
                {/* Hamburger button — mobile only */}
                {isMobile && (
                    <button
                        onClick={onToggleMenu}
                        className="p-1.5 -ml-1 rounded-md hover:bg-white/15 transition-colors shrink-0"
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
            
            {/* Theme Toggle Switch */}
            <div
                className="flex items-center p-0.5 rounded-md bg-black/20 dark:bg-black/30 border border-white/10 dark:border-white/5 shrink-0"
                role="group"
                aria-label="Theme preference"
            >
                <button
                    onClick={() => onSetTheme('light')}
                    className={`flex items-center justify-center w-8 h-7 rounded-sm transition-all ${themePref === 'light' ? 'bg-white text-fluent-brand-bg dark:bg-white/20 dark:text-white shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10'}`}
                    aria-label="Light mode"
                    title="Light mode"
                >
                    <Sun className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onSetTheme('system')}
                    className={`flex items-center justify-center w-8 h-7 rounded-sm transition-all ${themePref === 'system' ? 'bg-white text-fluent-brand-bg dark:bg-white/20 dark:text-white shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10'}`}
                    aria-label="System mode"
                    title="System mode"
                >
                    <Monitor className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onSetTheme('dark')}
                    className={`flex items-center justify-center w-8 h-7 rounded-sm transition-all ${themePref === 'dark' ? 'bg-white text-fluent-brand-bg dark:bg-white/20 dark:text-white shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10'}`}
                    aria-label="Dark mode"
                    title="Dark mode"
                >
                    <Moon className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
}

Header.propTypes = {
    themePref: PropTypes.oneOf(['system', 'light', 'dark']).isRequired,
    onSetTheme: PropTypes.func.isRequired,
    onToggleMenu: PropTypes.func,
    title: PropTypes.string,
    isMobile: PropTypes.bool,
};
