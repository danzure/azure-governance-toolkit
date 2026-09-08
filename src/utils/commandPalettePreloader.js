/**
 * Command Palette Preloader Utility
 * 
 * Provides an idle/interaction preload trigger for the code-split
 * CommandPaletteModal chunk without triggering Fast Refresh warnings in component files.
 */
let preloadPromise = null;

export const preloadCommandPalette = () => {
    if (!preloadPromise && typeof window !== 'undefined') {
        preloadPromise = import('../components/layout/CommandPaletteModal');
    }
    return preloadPromise;
};
