import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Boxes, Shield, X } from 'lucide-react';

/**
 * NavigationMenu Component
 * 
 * A left-side slide-out drawer for application navigation.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the menu is currently open.
 * @param {Function} props.onClose - Callback to close the menu.
 * @returns {JSX.Element}
 */
export default function NavigationMenu({ isOpen, onClose }) {
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
                className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-[#1b1a19] shadow-xl z-50 transform transition-transform duration-300 ease-in-out border-r border-transparent dark:border-[#323130] flex flex-col ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header inside drawer */}
                <div className="h-[48px] flex items-center justify-between px-5 border-b border-[#edebe9] dark:border-[#323130]">
                    <span className="font-semibold text-[16px] tracking-tight">Navigation</span>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-2 space-y-1">
                    <NavLink
                        to="/"
                        onClick={onClose}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2 rounded text-[14px] font-medium transition-colors ${
                                isActive 
                                    ? 'bg-[#f3f2f1] dark:bg-[#323130] text-[#0078d4] dark:text-[#4fc3f7]' 
                                    : 'text-[#323130] dark:text-[#e1dfdd] hover:bg-[#f3f2f1] dark:hover:bg-[#323130]'
                            }`
                        }
                    >
                        <Boxes className="w-5 h-5" />
                        Azure Resources
                    </NavLink>
                    
                    <NavLink
                        to="/conditional-access"
                        onClick={onClose}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2 rounded text-[14px] font-medium transition-colors ${
                                isActive 
                                    ? 'bg-[#f3f2f1] dark:bg-[#323130] text-[#0078d4] dark:text-[#4fc3f7]' 
                                    : 'text-[#323130] dark:text-[#e1dfdd] hover:bg-[#f3f2f1] dark:hover:bg-[#323130]'
                            }`
                        }
                    >
                        <Shield className="w-5 h-5" />
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
