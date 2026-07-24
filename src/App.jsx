import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/telemetry';

import Header from './components/layout/Header';
import NavigationMenu from './components/layout/NavigationMenu';
import Footer from './components/layout/Footer';
import ScrollToTopButton from './components/layout/ScrollToTopButton';
import useLocalStorage from './hooks/useLocalStorage';
import ErrorBoundary from './components/layout/ErrorBoundary';
import PageLoader from './components/layout/PageLoader';

import { Suspense, lazy } from 'react';

// Lazy loaded Pages
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const ResourceNamingPage = lazy(() => import('./pages/ResourceNaming'));
const ConditionalAccessPage = lazy(() => import('./pages/ConditionalAccess'));
const ManagementGroupsPage = lazy(() => import('./pages/ManagementGroups'));
const TaggingStrategyPage = lazy(() => import('./pages/TaggingStrategy'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

/**
 * Main Layout & Routing Component
 */
export default function App() {
    // Detect system dark mode preference
    const [systemPrefersDark, setSystemPrefersDark] = useState(() => 
        typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    );

    // Persistent state using local storage for user preferences
    const [themePref, setThemePref] = useLocalStorage('azres_themePref', () => {
        if (typeof window !== 'undefined') {
            try {
                const oldPref = window.localStorage.getItem('azres_darkMode');
                if (oldPref !== null) {
                    window.localStorage.removeItem('azres_darkMode');
                    return JSON.parse(oldPref) ? 'dark' : 'light';
                }
            } catch {
                // ignore
            }
        }
        return 'system';
    });

    const isDarkMode = themePref === 'system' ? systemPrefersDark : themePref === 'dark';
    
    // State for persistent navigation sidebar
    const [isNavExpanded, setIsNavExpanded] = useLocalStorage('azres_navExpanded', false);
    
    // Mobile detection (< 768px)
    const [isMobile, setIsMobile] = useState(() => 
        typeof window !== 'undefined' && window.innerWidth < 768
    );
    // Separate mobile nav open state (not persisted)
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const handleChange = (e) => {
            setIsMobile(e.matches);
            if (e.matches) setIsMobileNavOpen(false);
        };
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, []);

    // Get current route to update header title
    const location = useLocation();

    // Auto-close mobile nav on route change
    useEffect(() => {
        if (isMobile) setIsMobileNavOpen(false);
    }, [location.pathname, isMobile]);

    // Toggle document class for Tailwind dark mode
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
        if (!mediaQuery) return;

        const handleSystemThemeChange = (e) => {
            setSystemPrefersDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    const handleSetTheme = useCallback((theme) => {
        setThemePref(theme);
    }, [setThemePref]);
    const handleToggleMenu = useCallback(() => {
        if (isMobile) {
            setIsMobileNavOpen(prev => !prev);
        } else {
            setIsNavExpanded(prev => !prev);
        }
    }, [isMobile, setIsNavExpanded]);
    const handleCloseMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

    // Determine header subtitle based on current route
    let headerTitle;
    if (location.pathname === '/') {
        headerTitle = "Dashboard";
    } else if (location.pathname === '/resource-naming') {
        headerTitle = "Azure Resource Naming Tool";
    } else if (location.pathname === '/conditional-access') {
        headerTitle = "Conditional Access Policy Builder";
    } else if (location.pathname === '/management-groups') {
        headerTitle = "Management Group Topology Designer";
    } else if (location.pathname === '/tagging-strategy') {
        headerTitle = "Tagging Strategy Builder";
    } else {
        headerTitle = "Page Not Found";
    }

    // Track page view and handle route changes (title & scroll)
    useEffect(() => {
        // Update browser tab title
        document.title = `${headerTitle} | Azure Governance Toolkit`;

        // Log telemetry
        trackPageView(headerTitle, location.pathname);

        // Reset scroll position for the main content area
        const mainContainer = document.getElementById('main-scroll-container');
        if (mainContainer) {
            mainContainer.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [location.pathname, headerTitle]);

    return (
        <div className="h-screen font-sans transition-colors duration-200 bg-fluent-bg-canvas text-fluent-fg-primary flex flex-col overflow-hidden">
            <Header
                themePref={themePref}
                onSetTheme={handleSetTheme}
                onToggleMenu={handleToggleMenu}
                title={headerTitle}
                isMobile={isMobile}
            />

            <div className="flex-1 flex overflow-hidden pt-[48px] min-w-0">
                {/* Mobile backdrop overlay */}
                {isMobile && isMobileNavOpen && (
                    <div 
                        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 pt-[48px]"
                        onClick={handleCloseMobileNav}
                        aria-hidden="true"
                    />
                )}
                <NavigationMenu 
                    isExpanded={isMobile ? isMobileNavOpen : isNavExpanded} 
                    onToggleExpand={handleToggleMenu}
                    isMobile={isMobile}
                    onClose={handleCloseMobileNav}
                />

                <main id="main-scroll-container" tabIndex="-1" className="flex-1 min-w-0 w-full relative flex flex-col overflow-y-auto overscroll-y-none outline-none">
                    <ErrorBoundary>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<DashboardPage />} />
                                <Route path="/resource-naming" element={<ResourceNamingPage />} />
                                <Route path="/conditional-access" element={<ConditionalAccessPage />} />
                                <Route path="/management-groups" element={<ManagementGroupsPage />} />
                                <Route path="/tagging-strategy" element={<TaggingStrategyPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Suspense>
                    </ErrorBoundary>
                    {location.pathname === '/' && <Footer />}
                </main>
            </div>
            
            <ScrollToTopButton />
        </div>
    );
}
