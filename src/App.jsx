import { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from './components/Header';
import NavigationMenu from './components/NavigationMenu';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import useLocalStorage from './hooks/useLocalStorage';

// Pages
import DashboardPage from './pages/DashboardPage';
import ResourceNamingPage from './pages/ResourceNamingPage';
import ConditionalAccessPage from './pages/ConditionalAccessPage';

/**
 * Main Layout & Routing Component
 */
export default function App() {
    // Detect system dark mode preference as the default when no localStorage value exists
    const systemPrefersDark = typeof window !== 'undefined'
        && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

    // Persistent state using local storage for user preferences
    const [isDarkMode, setIsDarkMode] = useLocalStorage('azres_darkMode', systemPrefersDark);
    
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

    // Listen for system theme changes and sync when the user hasn't set a manual preference
    useEffect(() => {
        const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
        if (!mediaQuery) return;

        const handleSystemThemeChange = (e) => {
            // Only auto-sync if there is no manually saved preference in localStorage
            const savedPref = window.localStorage.getItem('azres_darkMode');
            if (savedPref === null) {
                setIsDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [setIsDarkMode]);

    const handleToggleTheme = useCallback(() => setIsDarkMode(prev => !prev), [setIsDarkMode]);
    const handleToggleMenu = useCallback(() => {
        if (isMobile) {
            setIsMobileNavOpen(prev => !prev);
        } else {
            setIsNavExpanded(prev => !prev);
        }
    }, [isMobile, setIsNavExpanded]);
    const handleCloseMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

    // Determine header subtitle based on current route
    let headerTitle = "Dashboard";
    if (location.pathname === '/azure-resources') {
        headerTitle = "Azure Resource Naming Tool";
    } else if (location.pathname === '/conditional-access') {
        headerTitle = "Conditional Access Policy Builder";
    }

    return (
        <div className="h-screen font-sans transition-colors duration-200 bg-fluent-bg-canvas text-fluent-fg-primary flex flex-col overflow-hidden">
            <Header
                isDarkMode={isDarkMode}
                onToggleTheme={handleToggleTheme}
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

                <main id="main-scroll-container" className="flex-1 min-w-0 w-full relative flex flex-col overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/azure-resources" element={<ResourceNamingPage />} />
                        <Route path="/conditional-access" element={<ConditionalAccessPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <Footer />
                </main>
            </div>
            
            <ScrollToTopButton />
        </div>
    );
}
