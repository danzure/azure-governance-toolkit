import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

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

    if (!showScrollTop) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed right-4 sm:right-8 bottom-6 sm:bottom-8 p-2.5 rounded-xl shadow-flyout transition-colors duration-150 z-50 bg-fluent-bg-canvas border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg/30"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
