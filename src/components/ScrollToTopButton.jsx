import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setShowScrollTop(window.scrollY > 200);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (!showScrollTop) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg hover:shadow-depth transition-all duration-300 z-50 animate-scale-in bg-primary-gradient dark:bg-[#323130] text-white hover:shadow-glow dark:hover:shadow-none dark:hover:bg-[#484644]"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
