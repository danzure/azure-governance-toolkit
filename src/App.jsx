import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import NavigationMenu from './components/NavigationMenu';
import useLocalStorage from './hooks/useLocalStorage';

// Pages
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
    
    // State for slide-out navigation drawer
    const [isNavOpen, setIsNavOpen] = useState(false);
    
    // Get current route to update header title
    const location = useLocation();

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
    const handleToggleMenu = useCallback(() => setIsNavOpen(prev => !prev), []);
    const handleCloseMenu = useCallback(() => setIsNavOpen(false), []);

    // Determine header subtitle based on current route
    let headerTitle = "Resource Naming Tool";
    if (location.pathname === '/conditional-access') {
        headerTitle = "Conditional Access Generator";
    }

    return (
        <div className="min-h-screen font-sans transition-colors duration-200 bg-[#faf9f8] dark:bg-[#111009] text-[#242424] dark:text-white flex flex-col">
            <Header
                isDarkMode={isDarkMode}
                onToggleTheme={handleToggleTheme}
                onToggleMenu={handleToggleMenu}
                title={headerTitle}
            />

            <NavigationMenu 
                isOpen={isNavOpen} 
                onClose={handleCloseMenu} 
            />

            <main className="flex-1 w-full relative">
                <Routes>
                    <Route path="/" element={<ResourceNamingPage />} />
                    <Route path="/conditional-access" element={<ConditionalAccessPage />} />
                </Routes>
            </main>
        </div>
    );
}
