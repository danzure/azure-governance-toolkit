import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScrollToTopButton from './ScrollToTopButton';

describe('ScrollToTopButton Component', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        globalThis.document = {
            getElementById: vi.fn(),
        };
        globalThis.window = {
            scrollTo: vi.fn(),
        };
    });

    it('exports a valid React functional component', () => {
        expect(typeof ScrollToTopButton).toBe('function');
    });

    it('triggers scroll on main-scroll-container when container exists', () => {
        const scrollToMock = vi.fn();
        const mockContainer = {
            scrollTo: scrollToMock,
        };

        const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(mockContainer);

        // Render the component as a virtual DOM element and simulate click
        const element = ScrollToTopButton({});
        expect(element).toBeDefined();
        expect(element.props.title).toBe('Scroll back to top');
        expect(element.props['aria-label']).toBe('Back to top');

        element.props.onClick();

        expect(getElementByIdSpy).toHaveBeenCalledWith('main-scroll-container');
        expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('falls back to window.scrollTo when main-scroll-container is missing', () => {
        vi.spyOn(document, 'getElementById').mockReturnValue(null);
        const windowScrollToMock = vi.fn();
        globalThis.window.scrollTo = windowScrollToMock;

        const element = ScrollToTopButton({ label: 'Return to top', className: 'custom-class' });
        expect(element.props['aria-label']).toBe('Return to top');
        expect(element.props.className).toContain('custom-class');

        element.props.onClick();

        expect(windowScrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});
