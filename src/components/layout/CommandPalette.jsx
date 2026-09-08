import { useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { preloadCommandPalette } from '../../utils/commandPalettePreloader';

// Lazily load the heavy modal surface and search index datasets
const CommandPaletteModal = lazy(() => import('./CommandPaletteModal'));

/**
 * CommandPalette Component
 *
 * An Azure Portal-inspired quick search and action palette triggered via `Ctrl+K`, `Cmd+K`, or `/`.
 *
 * Features:
 * - Code-split architecture: Search datasets (~405 KB) are loaded asynchronously in a separate chunk.
 * - Idle preloading: Automatically preloads the chunk during browser idle time or on trigger hover/focus.
 * - Zero closed-state memory overhead: Only mounts modal state and index when opened.
 * - Instant shortcut response: Keydown listener is mounted at boot; pressing Ctrl, Cmd, or / warms up the chunk immediately.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the palette is open.
 * @param {Function} props.onOpenChange - Callback to toggle visibility.
 * @param {string} [props.themePref] - Active theme preference ('system' | 'light' | 'dark').
 * @param {Function} [props.onSetTheme] - Callback to switch theme preference.
 */
export default function CommandPalette({ isOpen, onOpenChange, themePref = 'system', onSetTheme }) {
    // Preload modal and search datasets during idle browser time
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if ('requestIdleCallback' in window) {
                const idleId = window.requestIdleCallback(() => preloadCommandPalette(), { timeout: 2500 });
                return () => {
                    if (window.cancelIdleCallback) {
                        window.cancelIdleCallback(idleId);
                    }
                };
            } else {
                const timerId = setTimeout(() => preloadCommandPalette(), 1500);
                return () => clearTimeout(timerId);
            }
        }
    }, []);

    // Global keyboard shortcut listener for Ctrl+K, Cmd+K, and /
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Warm up the chunk when modifier keys are pressed
            if (e.ctrlKey || e.metaKey || e.key === '/') {
                preloadCommandPalette();
            }

            const targetTag = e.target?.tagName?.toLowerCase();
            const isInput =
                targetTag === 'input' ||
                targetTag === 'textarea' ||
                e.target?.isContentEditable;

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                onOpenChange(!isOpen);
            } else if (e.key === '/' && !isInput && !isOpen) {
                e.preventDefault();
                onOpenChange(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onOpenChange]);

    if (!isOpen) return null;

    return (
        <Suspense fallback={null}>
            <CommandPaletteModal
                onOpenChange={onOpenChange}
                themePref={themePref}
                onSetTheme={onSetTheme}
            />
        </Suspense>
    );
}

CommandPalette.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    themePref: PropTypes.oneOf(['system', 'light', 'dark']),
    onSetTheme: PropTypes.func
};

