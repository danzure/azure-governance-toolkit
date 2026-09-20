import { useState, useEffect } from 'react';

/**
 * Custom hook to track whether a CSS media query matches.
 * 
 * @param {string} query - CSS media query string (e.g. '(max-width: 639px)')
 * @returns {boolean} - True if the media query matches, false otherwise
 */
export default function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mediaQuery = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches);

        setMatches(mediaQuery.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}
