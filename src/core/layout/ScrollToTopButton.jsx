import PropTypes from 'prop-types';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTopButton Component
 * 
 * Fluent 2 secondary action button appended at the end of each page,
 * smoothly returning the viewport container to the top when clicked.
 * 
 * @param {Object} props
 * @param {string} [props.className] Optional custom class names
 * @param {string} [props.label='Back to top'] Optional custom button label
 * @returns {JSX.Element}
 */
export default function ScrollToTopButton({ className = '', label = 'Back to top' }) {
    const scrollToTop = () => {
        const scrollContainer = typeof document !== 'undefined' ? document.getElementById('main-scroll-container') : null;
        if (scrollContainer && typeof scrollContainer.scrollTo === 'function') {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary text-[13px] font-medium active:scale-95 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg ${className}`}
            title="Scroll back to top"
            aria-label={label}
        >
            <span>{label}</span>
            <ArrowUp className="w-3.5 h-3.5" />
        </button>
    );
}

ScrollToTopButton.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
};

