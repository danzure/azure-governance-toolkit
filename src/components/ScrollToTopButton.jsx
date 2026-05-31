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
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
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
            className="fixed bottom-24 right-8 p-3 rounded-full shadow-lg hover:shadow-depth transition-all duration-300 z-50 animate-scale-in bg-fluent-brand-bg text-white hover:bg-fluent-brand-hover"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
