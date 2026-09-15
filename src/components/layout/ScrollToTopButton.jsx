import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTopButton Component
 * 
 * Floating action button that appears when the main content container is scrolled down,
 * smoothly returning the viewport to the top when clicked.
 * 
 * @returns {JSX.Element|null}
 */
export default function ScrollToTopButton() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (!scrollContainer) return;

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setShowScrollTop(scrollContainer.scrollTop > 200);
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = useCallback(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            aria-hidden={!showScrollTop}
            tabIndex={showScrollTop ? 0 : -1}
            className={`fixed right-4 sm:right-8 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-8 p-2.5 rounded-xl shadow-flyout transition-all duration-200 ease-in-out active:scale-95 z-50 bg-fluent-bg-canvas border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-stroke-strong ${
                showScrollTop 
                    ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                    : 'opacity-0 translate-y-3 pointer-events-none scale-95'
            }`}
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
