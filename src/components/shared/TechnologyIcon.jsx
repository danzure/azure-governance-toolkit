import PropTypes from 'prop-types';
import { Braces } from 'lucide-react';

/**
 * Official HashiCorp Terraform Logo (Adaptive Monochrome)
 */
export function TerraformIcon({ className = 'w-3.5 h-3.5 shrink-0', ...props }) {
    return (
        <svg 
            viewBox="0 0 128 128" 
            className={className} 
            fill="currentColor" 
            aria-hidden="true" 
            {...props}
        >
            <path d="M77.941 44.5v36.836L46.324 62.918V26.082zm0 0" />
            <path d="M81.41 81.336l31.633-18.418V26.082L81.41 44.5zm0 0" opacity="0.8" />
            <path d="M11.242 42.36L42.86 60.776V23.941L11.242 5.523zm0 0M77.941 85.375L46.324 66.957v36.82l31.617 18.418zm0 0" />
        </svg>
    );
}

TerraformIcon.propTypes = {
    className: PropTypes.string,
};

/**
 * Official Microsoft Azure Bicep Logo (Adaptive Monochrome with Hexagon Frame)
 */
export function BicepIcon({ className = 'w-3.5 h-3.5 shrink-0', ...props }) {
    return (
        <svg 
            viewBox="0 0 32 32" 
            className={className} 
            aria-hidden="true" 
            {...props}
        >
            <polygon 
                points="16,1.5 2.8,9.1 2.8,22.9 16,30.5 29.2,22.9 29.2,9.1" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinejoin="round" 
            />
            <path 
                d="M21.5 18H13l2-5h3.3l.7-1.5h-3L15 10l1-1.5h3L18.3 7H15l-2.2 3 .9 1.5-6 7.5c-.4.5-.7 1.3-.7 2 0 1.5 1.1 2.8 2.5 3 0 0 10.5 1 12 1 1.9 0 3.5-1.6 3.5-3.5S23.4 18 21.5 18zM10 22.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm11.5 1c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" 
                fill="currentColor" 
            />
        </svg>
    );
}

BicepIcon.propTypes = {
    className: PropTypes.string,
};

/**
 * Official CommonMark / Markdown Logo (Adaptive Monochrome)
 */
export function MarkdownIcon({ className = 'w-3.5 h-3.5 shrink-0', ...props }) {
    return (
        <svg 
            viewBox="0 0 16 16" 
            className={className} 
            fill="currentColor" 
            aria-hidden="true" 
            {...props}
        >
            <path d="M14.85 3c.63 0 1.15.52 1.14 1.15v7.7c0 .63-.51 1.15-1.15 1.15H1.15C.52 13 0 12.48 0 11.84V4.15C0 3.52.52 3 1.15 3ZM9 11V5H7L5.5 7 4 5H2v6h2V8l1.5 1.92L7 8v3Zm2.99.5L14.5 8H13V5h-2v3H9.5Z" />
        </svg>
    );
}

MarkdownIcon.propTypes = {
    className: PropTypes.string,
};

/**
 * JSON Format Icon ({ } Braces)
 */
export function JsonIcon({ className = 'w-3.5 h-3.5 shrink-0', ...props }) {
    return <Braces className={className} aria-hidden="true" {...props} />;
}

JsonIcon.propTypes = {
    className: PropTypes.string,
};

/**
 * Official Microsoft Azure Resource Manager / Azure Logo (Adaptive Monochrome)
 */
export function ArmIcon({ className = 'w-3.5 h-3.5 shrink-0', ...props }) {
    return (
        <svg 
            viewBox="0 0 24 24" 
            className={className} 
            fill="currentColor" 
            aria-hidden="true" 
            {...props}
        >
            <path d="M5.483 21.3H.735L8.16 3.033h4.948L5.483 21.3zM13.27 3.033l-2.07 5.093 3.655 4.887 4.298-9.98H13.27zm1.884 10.973l-2.84 3.826 3.085 3.468h7.866l-8.111-7.294z" />
        </svg>
    );
}

ArmIcon.propTypes = {
    className: PropTypes.string,
};

/**
 * Official Microsoft PowerShell Console Prompt Icon (Adaptive Monochrome)
 */
export function PowerShellIcon({ className = 'w-3.5 h-3.5 shrink-0', ...props }) {
    return (
        <svg 
            viewBox="0 0 24 24" 
            className={className} 
            fill="currentColor" 
            aria-hidden="true" 
            {...props}
        >
            <path d="M2.5 4.5A2 2 0 0 1 4.5 2.5h15a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-15zm4.8 4.2a.75.75 0 0 0-1.06 1.06L8.94 12l-2.7 2.24a.75.75 0 1 0 .96 1.15l3.25-2.7a.75.75 0 0 0 0-1.18L7.3 8.7zm5.45 6.55a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5z" />
        </svg>
    );
}

/**
 * Official Microsoft 4-Color Logo
 */
export function MicrosoftIcon({ className = 'w-3.5 h-3.5 shrink-0', ...props }) {
    return (
        <svg 
            viewBox="0 0 23 23" 
            className={className} 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true" 
            {...props}
        >
            <path d="M0 0h11v11H0z" fill="#f25022"/>
            <path d="M12 0h11v11H12z" fill="#7fba00"/>
            <path d="M0 12h11v11H0z" fill="#00a4ef"/>
            <path d="M12 12h11v11H12z" fill="#ffb900"/>
        </svg>
    );
}

MicrosoftIcon.propTypes = {
    className: PropTypes.string,
};

/**
 * TechnologyIcon Dispatcher Component
 *
 * Renders official technology and format icons adapted for light and dark modes.
 *
 * @param {Object} props
 * @param {'bicep' | 'terraform' | 'markdown' | 'json' | 'arm' | 'powershell' | 'microsoft'} props.name
 * @param {string} [props.className]
 */
export default function TechnologyIcon({ name, className, ...props }) {
    const normalizedName = (name || '').toLowerCase().trim();

    switch (normalizedName) {
        case 'bicep':
            return <BicepIcon className={className} {...props} />;
        case 'terraform':
        case 'tf':
            return <TerraformIcon className={className} {...props} />;
        case 'markdown':
        case 'md':
            return <MarkdownIcon className={className} {...props} />;
        case 'json':
            return <JsonIcon className={className} {...props} />;
        case 'arm':
        case 'azure':
            return <ArmIcon className={className} {...props} />;
        case 'powershell':
        case 'ps':
            return <PowerShellIcon className={className} {...props} />;
        case 'microsoft':
        case 'ms':
        case 'msft':
            return <MicrosoftIcon className={className} {...props} />;
        default:
            return <JsonIcon className={className} {...props} />;
    }
}

TechnologyIcon.propTypes = {
    name: PropTypes.oneOf(['bicep', 'terraform', 'tf', 'markdown', 'md', 'json', 'arm', 'azure', 'powershell', 'ps', 'microsoft', 'ms', 'msft']).isRequired,
    className: PropTypes.string,
};

