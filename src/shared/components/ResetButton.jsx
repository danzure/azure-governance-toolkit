import PropTypes from 'prop-types';
import { RefreshCw } from 'lucide-react';

/**
 * Standardized Fluent 2 Reset Button component.
 * Features accessible focus rings and unified button geometry aligned with Cloud Adoption Framework design standards.
 *
 * @param {Object} props
 * @param {Function} props.onClick - Callback executed when the button is clicked.
 * @param {React.ReactNode} [props.children='Reset Defaults'] - Button label or nested content.
 * @param {string} [props.title='Reset to defaults'] - Tooltip title text.
 * @param {string} [props.className=''] - Additional custom CSS classes.
 * @param {string} [props.ariaLabel] - Explicit accessibility label.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {boolean} [props.showIcon=true] - Whether to show the unified RefreshCw icon.
 * @param {'secondary'|'ghost'} [props.variant='secondary'] - Visual style variant of the button.
 */
export default function ResetButton({
    onClick,
    children = 'Reset Defaults',
    title = 'Reset to defaults',
    className = '',
    ariaLabel,
    disabled = false,
    showIcon = true,
    variant = 'secondary'
}) {
    const variantClasses = variant === 'ghost'
        ? 'border border-transparent hover:border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover active:bg-fluent-bg-subtle'
        : 'border border-fluent-stroke-strong bg-fluent-bg-card hover:bg-fluent-bg-hover text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary shadow-sm';

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel || (typeof children === 'string' ? children : title)}
            title={title}
            className={`h-[32px] px-3 rounded-[4px] text-[13px] font-medium transition-all duration-200 ease-in-out active:scale-95 inline-flex items-center justify-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-fluent-bg-subtle disabled:border-fluent-stroke-subtle disabled:text-fluent-fg-tertiary ${variantClasses} ${className}`}
        >
            {showIcon && <RefreshCw className="w-3.5 h-3.5 shrink-0" />}
            {children}
        </button>
    );
}

ResetButton.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node,
    title: PropTypes.string,
    className: PropTypes.string,
    ariaLabel: PropTypes.string,
    disabled: PropTypes.bool,
    showIcon: PropTypes.bool,
    variant: PropTypes.oneOf(['secondary', 'ghost'])
};
