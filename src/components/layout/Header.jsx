import { useMemo } from 'react';
import { Menu, Search } from 'lucide-react';
import PropTypes from 'prop-types';
import ThemeToggle from './ThemeToggle';
import { preloadCommandPalette } from '../../utils/commandPalettePreloader';

/**
 * Header Component
 * 
 * Top navigation bar displaying the application branding, centered command palette search bar,
 * and a dark/light mode toggle.
 * Positioned fixed at the top of the viewport.
 * On mobile, shows a hamburger button to open the navigation drawer.
 * 
 * @param {string} props.themePref - Current theme preference ('system', 'light', 'dark').
 * @param {Function} props.onSetTheme - Callback to set the theme.
 * @param {Function} props.onToggleMenu - Callback to toggle the navigation menu (mobile).
 * @param {Function} [props.onOpenCommandPalette] - Callback to open the command palette.
 * @param {string} props.title - Title to display in the header.
 * @param {boolean} props.isMobile - Whether the viewport is mobile-sized.
 * @param {boolean} [props.systemPrefersDark] - Whether system currently prefers dark mode.
 * @returns {JSX.Element}
 */
export default function Header({ 
    themePref, 
    onSetTheme, 
    onToggleMenu, 
    onOpenCommandPalette,
    title = "Resource Naming Tool", 
    isMobile, 
    systemPrefersDark 
}) {
    const isMac = useMemo(() => {
        return typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent || '');
    }, []);

    return (
        <header className="h-[48px] flex items-center justify-between px-3 md:px-5 border-b z-50 fixed top-0 w-full bg-primary-gradient dark:bg-none dark:bg-fluent-portal-dark border-transparent dark:border-fluent-stroke-subtle text-white dark:text-fluent-fg-primary shadow-soft dark:shadow-sm">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 z-10 sm:max-w-[calc(50%-10.5rem)] md:max-w-[calc(50%-12.5rem)] lg:max-w-[calc(50%-14.5rem)]">
                {/* Hamburger button — mobile only */}
                {isMobile && (
                    <button
                        onClick={onToggleMenu}
                        className="p-1.5 -ml-1 rounded-md text-white dark:text-fluent-fg-primary hover:bg-white/20 active:bg-white/25 dark:hover:bg-fluent-bg-hover transition-colors shrink-0"
                        aria-label="Toggle navigation menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}
                <div className="flex items-baseline gap-2 min-w-0">
                    <a href="https://atozazure.com" className="font-semibold text-[18px] text-white dark:text-fluent-fg-primary tracking-tight shrink-0 hover:opacity-80 transition-opacity">atozazure</a>
                    <span className="text-[14px] text-white/40 dark:text-fluent-stroke-strong mx-1 hidden sm:inline">|</span>
                    <span className="text-[14px] text-white/80 dark:text-fluent-fg-secondary tracking-wide truncate hidden sm:inline">{title}</span>
                </div>
            </div>

            {/* Centered Command Palette Search Bar (Middle) */}
            {onOpenCommandPalette && (
                <div className="flex-1 min-w-0 mx-2 sm:mx-0 sm:flex-none sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full max-w-[20rem] md:max-w-[24rem] lg:max-w-[28rem] pointer-events-none flex justify-center z-20">
                    <button
                        type="button"
                        onClick={onOpenCommandPalette}
                        onMouseEnter={preloadCommandPalette}
                        onFocus={preloadCommandPalette}
                        className="w-full h-[32px] px-3 rounded-[4px] bg-white hover:bg-white/95 text-fluent-fg-primary border border-white/30 hover:border-white/60 dark:bg-fluent-bg-card dark:border-fluent-stroke-subtle dark:hover:bg-fluent-bg-hover dark:hover:border-fluent-stroke-strong dark:text-fluent-fg-primary transition-all duration-150 flex items-center justify-between text-left cursor-pointer shadow-sm select-none pointer-events-auto"
                        aria-label="Search or jump to command palette"
                    >
                        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                            <Search className="w-3.5 h-3.5 text-fluent-fg-secondary shrink-0" />
                            <span className="text-[12px] text-fluent-fg-secondary truncate hidden min-[520px]:inline">
                                Search or jump to...
                            </span>
                            <span className="text-[12px] text-fluent-fg-secondary truncate min-[520px]:hidden">
                                Search...
                            </span>
                        </div>
                        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-fluent-bg-subtle dark:bg-fluent-bg-card border border-fluent-stroke-subtle rounded-[2px] text-fluent-fg-tertiary shrink-0 leading-none">
                            {isMac ? '⌘K' : 'Ctrl K'}
                        </kbd>
                    </button>
                </div>
            )}
            
            {/* Right Actions: ThemeToggle Dropdown */}
            <div className="flex items-center shrink-0 z-10">
                <ThemeToggle 
                    themePref={themePref}
                    onSetTheme={onSetTheme}
                    systemPrefersDark={systemPrefersDark}
                />
            </div>
        </header>
    );
}

Header.propTypes = {
    themePref: PropTypes.oneOf(['system', 'light', 'dark']).isRequired,
    onSetTheme: PropTypes.func.isRequired,
    onToggleMenu: PropTypes.func,
    onOpenCommandPalette: PropTypes.func,
    title: PropTypes.string,
    isMobile: PropTypes.bool,
    systemPrefersDark: PropTypes.bool
};
