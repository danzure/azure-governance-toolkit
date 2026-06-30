import PropTypes from 'prop-types';

/**
 * Tooltip Component
 * 
 * A simple wrapper component that displays an absolute-positioned tooltip box
 * when hovering over its children. The tooltip appears directly below the target.
 * 
 * @param {Object} props
 * @param {string} props.content - Text to display inside the tooltip.
 * @param {React.ReactNode} props.children - Element the tooltip is attached to.
 * @returns {JSX.Element}
 */
export default function Tooltip({ content, align = 'left', position = 'bottom', className = '', children }) {
    if (!content) return children;

    const alignClasses = {
        left: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        right: 'right-0'
    };

    let positionClasses = '';
    
    if (position === 'bottom') {
        positionClasses = `top-full mt-1 ${alignClasses[align]}`;
    } else if (position === 'top') {
        positionClasses = `bottom-full mb-1 ${alignClasses[align]}`;
    } else if (position === 'left') {
        positionClasses = `right-full mr-2 top-1/2 -translate-y-1/2`;
    } else if (position === 'right') {
        positionClasses = `left-full ml-2 top-1/2 -translate-y-1/2`;
    }

    return (
        <div className={`relative group ${className}`}>
            {children}
            <div className={`absolute px-2.5 py-1.5 text-[11px] rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-fg-primary w-max max-w-[250px] whitespace-normal leading-tight ${positionClasses}`}>
                {content}
            </div>
        </div>
    );
}

Tooltip.propTypes = {
    content: PropTypes.string.isRequired,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    position: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};
