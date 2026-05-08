import { Moon, Sun, Menu } from 'lucide-react';
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
 * @param {Function} props.onToggleMenu - Callback to toggle the navigation menu.
 * @returns {JSX.Element}
 */
export default function Header({ isDarkMode, onToggleTheme, onToggleMenu, title = "Resource Naming Tool" }) {
    return (
        <header className="h-[48px] flex items-center justify-between px-5 border-b z-50 fixed top-0 w-full bg-primary-gradient dark:bg-[#1b1a19] border-transparent dark:border-[#323130] text-white shadow-soft dark:shadow-none">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleMenu}
                    className="p-1 -ml-1 rounded hover:bg-white/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Toggle navigation menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[16px] text-white tracking-tight">app.atozazure</span>
                    <span className="text-[13px] text-white/40 mx-1">|</span>
                    <span className="text-[12px] text-white/80 tracking-wide">{title}</span>
                </div>
            </div>
            <button
                onClick={onToggleTheme}
                className="flex items-center gap-2 px-3 h-[32px] rounded border transition-all text-[13px] font-semibold bg-white/10 dark:bg-[#323130] border-white/20 dark:border-[#484644] text-white hover:bg-white/20 dark:hover:bg-[#484644]"
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
    onToggleMenu: PropTypes.func.isRequired,
    title: PropTypes.string,
};
