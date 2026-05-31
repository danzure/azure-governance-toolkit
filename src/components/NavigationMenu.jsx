import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

/**
 * NavigationMenu Component
 * 
 * A left-side slide-out drawer for application navigation.
 * Includes a focus trap when open — keyboard focus cycles within the drawer
 * and cannot escape to elements behind the overlay. Focus is restored to the
 * trigger button when the drawer is closed.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the menu is currently open.
 * @param {Function} props.onClose - Callback to close the menu.
 * @returns {JSX.Element}
 */
export default function NavigationMenu({ isOpen, onClose }) {
    const drawerRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previouslyFocusedRef = useRef(null);

    // Capture the element that opened the drawer and focus the close button
    useEffect(() => {
        if (isOpen) {
            // Remember what was focused before opening so we can restore it
            previouslyFocusedRef.current = document.activeElement;

            // Slight delay to ensure the drawer has transitioned into view
            const timer = setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);

            return () => clearTimeout(timer);
        } else {
            // Restore focus to the element that opened the drawer
            if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
                previouslyFocusedRef.current.focus();
                previouslyFocusedRef.current = null;
            }
        }
    }, [isOpen]);

    // Focus trap: cycle Tab focus within the drawer while it's open
    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        // Close on Escape
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
            return;
        }

        // Only trap Tab key
        if (e.key !== 'Tab') return;

        const drawer = drawerRef.current;
        if (!drawer) return;

        // Query all focusable elements within the drawer
        const focusableElements = drawer.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift+Tab: if focus is on the first element, wrap to the last
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab: if focus is on the last element, wrap to the first
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }, [isOpen, onClose]);

    // Attach keydown listener at the document level to catch all Tab/Escape presses
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 dark:bg-black/40 z-50 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Slide-out Drawer */}
            <div 
                ref={drawerRef}
                className={`fixed top-0 left-0 h-full w-[280px] bg-fluent-bg-card shadow-xl z-50 transform transition-transform duration-300 ease-in-out border-r border-fluent-stroke-subtle flex flex-col ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                aria-hidden={!isOpen}
            >
                {/* Header inside drawer */}
                <div className="h-[48px] flex items-center justify-between px-5 border-b border-fluent-stroke-subtle">
                    <span className="font-semibold text-[16px] tracking-tight">Navigation</span>
                    <button 
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="p-1 rounded hover:bg-fluent-bg-hover transition-colors"
                        aria-label="Close navigation menu"
                        tabIndex={isOpen ? 0 : -1}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-2 space-y-1" aria-label="Main navigation">
                    <NavLink
                        to="/"
                        onClick={onClose}
                        tabIndex={isOpen ? 0 : -1}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2 rounded text-[14px] font-medium transition-colors ${
                                isActive 
                                    ? 'bg-fluent-bg-hover text-fluent-brand-fg font-semibold' 
                                    : 'text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary'
                            }`
                        }
                    >
                        <img src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Dashboard.svg" alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/azure-resources"
                        onClick={onClose}
                        tabIndex={isOpen ? 0 : -1}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2 rounded text-[14px] font-medium transition-colors ${
                                isActive 
                                    ? 'bg-fluent-bg-hover text-fluent-brand-fg font-semibold' 
                                    : 'text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary'
                            }`
                        }
                    >
                        <img src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg" alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
                        Azure Resources
                    </NavLink>
                    
                    <NavLink
                        to="/conditional-access"
                        onClick={onClose}
                        tabIndex={isOpen ? 0 : -1}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2 rounded text-[14px] font-medium transition-colors ${
                                isActive 
                                    ? 'bg-fluent-bg-hover text-fluent-brand-fg font-semibold' 
                                    : 'text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary'
                            }`
                        }
                    >
                        <img src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg" alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
                        Conditional Access
                    </NavLink>
                </nav>
            </div>
        </>
    );
}

NavigationMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
