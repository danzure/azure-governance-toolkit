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
export default function Tooltip({ content, align = 'left', children }) {
    if (!content) return children;

    const alignClasses = {
        left: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        right: 'right-0'
    };

    return (
        <div className="relative group">
            {children}
            <div className={`absolute top-full mt-1 px-2.5 py-1.5 text-[11px] rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-[#242424] dark:bg-[#323130] text-white w-max max-w-[250px] whitespace-normal leading-tight ${alignClasses[align]}`}>
                {content}
            </div>
        </div>
    );
}

Tooltip.propTypes = {
    content: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
