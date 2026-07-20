import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (!scrollContainer) return;

        // 1. High-performance scroll listener for the > 200px check (reading scrollTop is fast)
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

        // 2. IntersectionObserver for bottom detection (eliminates layout thrashing from scrollHeight reads)
        const footer = scrollContainer.querySelector('footer');
        let observer;
        if (footer) {
            observer = new IntersectionObserver((entries) => {
                setIsAtBottom(entries[0].isIntersecting);
            }, {
                root: scrollContainer,
                threshold: 0.5 // Trigger when footer is at least 50% visible
            });
            observer.observe(footer);
        }

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
            if (observer) observer.disconnect();
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
            className={`group fixed right-4 sm:right-8 p-2.5 rounded-xl shadow-flyout hover:-translate-y-1 transition-all duration-300 z-50 animate-scale-in bg-fluent-bg-canvas/70 dark:bg-fluent-bg-canvas/70 backdrop-blur-md border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg/30 ${isAtBottom ? 'bottom-4' : 'bottom-6 sm:bottom-8'}`}
        >
            <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        </button>
    );
}
