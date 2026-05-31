import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * NavigationMenu Component
 * 
 * A persistent left-side navigation sidebar.
 * 
 * @param {Object} props
 * @param {boolean} props.isExpanded - Whether the menu is currently expanded.
 * @param {Function} props.onToggleExpand - Callback to toggle the menu expansion.
 * @returns {JSX.Element}
 */
export default function NavigationMenu({ isExpanded, onToggleExpand }) {
    return (
        <div 
            className={`relative flex flex-col h-full bg-fluent-bg-card shadow-soft z-40 transition-[width] duration-300 ease-in-out border-r border-fluent-stroke-subtle ${
                isExpanded ? 'w-[280px]' : 'w-[64px]'
            }`}
            aria-label="Navigation menu"
        >
            {/* Header inside drawer */}
            <div className={`h-[48px] flex items-center border-b border-fluent-stroke-subtle overflow-hidden whitespace-nowrap transition-all duration-300 ${isExpanded ? 'px-4 justify-between' : 'justify-center px-0'}`}>
                {isExpanded && <span className="font-semibold text-[16px] tracking-tight pl-1">Navigation</span>}
                <button
                    onClick={onToggleExpand}
                    className="p-1.5 rounded-md hover:bg-fluent-bg-hover text-fluent-fg-secondary hover:text-fluent-fg-primary transition-colors flex-shrink-0"
                    aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
                    title={isExpanded ? "Collapse menu" : "Expand menu"}
                >
                    {isExpanded ? <ChevronsLeft className="w-5 h-5" /> : <ChevronsRight className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-4 space-y-1 overflow-hidden" aria-label="Main navigation">
                <NavLink
                    to="/"
                    title={!isExpanded ? "Dashboard" : undefined}
                    className={({ isActive }) => 
                        `group relative flex items-center gap-3 py-2.5 mx-2 rounded-md text-[15px] transition-all duration-200 ${
                            isExpanded ? 'px-3' : 'justify-center px-0'
                        } ${
                            isActive 
                                ? 'bg-fluent-bg-subtle text-fluent-brand-fg font-semibold' 
                                : 'text-fluent-fg-secondary font-medium hover:bg-fluent-bg-hover hover:text-fluent-fg-primary'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[16px] bg-fluent-brand-bg rounded-full" />
                            )}
                            <img 
                                src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Dashboard.svg" 
                                alt="" 
                                className={`w-5 h-5 min-w-[20px] object-contain transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} ${!isExpanded ? 'mx-auto' : ''}`} 
                                aria-hidden="true" 
                            />
                            {isExpanded && <span className="whitespace-nowrap">Dashboard</span>}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/azure-resources"
                    title={!isExpanded ? "Azure Resources" : undefined}
                    className={({ isActive }) => 
                        `group relative flex items-center gap-3 py-2.5 mx-2 rounded-md text-[15px] transition-all duration-200 ${
                            isExpanded ? 'px-3' : 'justify-center px-0'
                        } ${
                            isActive 
                                ? 'bg-fluent-bg-subtle text-fluent-brand-fg font-semibold' 
                                : 'text-fluent-fg-secondary font-medium hover:bg-fluent-bg-hover hover:text-fluent-fg-primary'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[16px] bg-fluent-brand-bg rounded-full" />
                            )}
                            <img 
                                src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/All-Resources.svg" 
                                alt="" 
                                className={`w-5 h-5 min-w-[20px] object-contain transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} ${!isExpanded ? 'mx-auto' : ''}`} 
                                aria-hidden="true" 
                            />
                            {isExpanded && <span className="whitespace-nowrap">Azure Resources</span>}
                        </>
                    )}
                </NavLink>
                
                <NavLink
                    to="/conditional-access"
                    title={!isExpanded ? "Conditional Access" : undefined}
                    className={({ isActive }) => 
                        `group relative flex items-center gap-3 py-2.5 mx-2 rounded-md text-[15px] transition-all duration-200 ${
                            isExpanded ? 'px-3' : 'justify-center px-0'
                        } ${
                            isActive 
                                ? 'bg-fluent-bg-subtle text-fluent-brand-fg font-semibold' 
                                : 'text-fluent-fg-secondary font-medium hover:bg-fluent-bg-hover hover:text-fluent-fg-primary'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[16px] bg-fluent-brand-bg rounded-full" />
                            )}
                            <img 
                                src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Conditional-Access.svg" 
                                alt="" 
                                className={`w-5 h-5 min-w-[20px] object-contain transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} ${!isExpanded ? 'mx-auto' : ''}`} 
                                aria-hidden="true" 
                            />
                            {isExpanded && <span className="whitespace-nowrap">Conditional Access</span>}
                        </>
                    )}
                </NavLink>
            </nav>


        </div>
    );
}

NavigationMenu.propTypes = {
    isExpanded: PropTypes.bool.isRequired,
    onToggleExpand: PropTypes.func.isRequired,
};
