import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';

/**
 * ThemeToggle Component
 * 
 * A Fluent 2 flyout dropdown allowing users to select Light, Dark,
 * or Sync with System appearance preferences.
 * 
 * @param {Object} props
 * @param {('system'|'light'|'dark')} props.themePref - Current user theme preference.
 * @param {Function} props.onSetTheme - Callback to set the active theme preference.
 * @param {boolean} [props.systemPrefersDark] - Whether the OS currently prefers dark mode.
 * @returns {JSX.Element}
 */
export default function ThemeToggle({ themePref, onSetTheme, systemPrefersDark }) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    // Auto-detect system preference if not provided
    const isSystemDark = systemPrefersDark !== undefined
        ? systemPrefersDark
        : (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    const options = [
        {
            id: 'light',
            label: 'Light',
            description: 'Always light appearance',
            icon: Sun,
            iconColor: 'text-amber-500 dark:text-amber-400'
        },
        {
            id: 'dark',
            label: 'Dark',
            description: 'Always dark appearance',
            icon: Moon,
            iconColor: 'text-indigo-500 dark:text-indigo-400'
        },
        {
            id: 'system',
            label: 'Sync with system',
            description: isSystemDark ? 'Matches device (Dark)' : 'Matches device (Light)',
            icon: Monitor,
            iconColor: 'text-fluent-fg-secondary'
        }
    ];

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(options.findIndex(opt => opt.id === themePref));
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                triggerRef.current?.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => (prev + 1) % options.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => (prev - 1 + options.length) % options.length);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < options.length) {
                    onSetTheme(options[focusedIndex].id);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                }
                break;
            case 'Tab':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const currentOption = options.find(opt => opt.id === themePref) || options[2];
    const CurrentIcon = currentOption.icon;

    return (
        <div ref={containerRef} className="relative inline-block text-left" onKeyDown={handleKeyDown}>
            {/* Toggle Trigger Button */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => {
                    setIsOpen(prev => !prev);
                    if (!isOpen) {
                        setFocusedIndex(options.findIndex(opt => opt.id === themePref));
                    }
                }}
                className={`h-[32px] px-2.5 rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out active:scale-95 touch-manipulation select-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                    isOpen 
                        ? 'bg-white/25 text-white border-white/30 shadow-sm' 
                        : 'bg-black/20 hover:bg-black/30 active:bg-black/40 dark:bg-white/10 dark:hover:bg-white/15 dark:active:bg-white/20 text-white border-white/10 hover:border-white/20'
                }`}
                aria-label={`Theme: ${currentOption.label}. Change appearance`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                title={`Theme: ${currentOption.label}`}
            >
                <CurrentIcon className="w-4 h-4 shrink-0 transition-transform duration-200" />
                <span className="text-[12px] font-medium hidden md:inline tracking-wide">
                    {themePref === 'system' ? 'System' : currentOption.label}
                </span>
                <ChevronDown 
                    className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-white' : ''
                    }`} 
                />
            </button>

            {/* Flyout Popover Menu */}
            {isOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    aria-label="Appearance options"
                    className="absolute right-0 top-full mt-1.5 w-[220px] bg-fluent-bg-card border border-fluent-stroke-subtle shadow-flyout rounded-lg p-1.5 z-50 animate-fade-in text-fluent-fg-primary"
                >
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wider">
                        Theme Preference
                    </div>

                    <div className="space-y-0.5 mt-1">
                        {options.map((option, index) => {
                            const IconComponent = option.icon;
                            const isSelected = themePref === option.id;
                            const isFocused = focusedIndex === index;

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={isSelected}
                                    onClick={() => {
                                        onSetTheme(option.id);
                                        setIsOpen(false);
                                        triggerRef.current?.focus();
                                    }}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] text-left transition-colors duration-150 touch-manipulation select-none ${
                                        isSelected
                                            ? 'bg-fluent-bg-subtle text-fluent-fg-primary font-medium'
                                            : isFocused
                                            ? 'bg-fluent-bg-hover text-fluent-fg-primary'
                                            : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                            <IconComponent className={`w-4 h-4 ${option.iconColor}`} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[13px] leading-snug">
                                                {option.label}
                                            </span>
                                            <span className="text-[11px] text-fluent-fg-tertiary leading-tight">
                                                {option.description}
                                            </span>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <Check className="w-4 h-4 text-fluent-brand-fg shrink-0 ml-2 animate-fade-in" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

ThemeToggle.propTypes = {
    themePref: PropTypes.oneOf(['system', 'light', 'dark']).isRequired,
    onSetTheme: PropTypes.func.isRequired,
    systemPrefersDark: PropTypes.bool
};
