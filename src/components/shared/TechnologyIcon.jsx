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
            viewBox="0 0 128 128" 
            className={className} 
            fill="currentColor" 
            aria-hidden="true" 
            {...props}
        >
            <path d="M43.983 4.653a5.911 5.911 0 015.6 4.022l35.91 106.396a5.911 5.911 0 01-5.603 7.802h41.38a5.917 5.917 0 004.8-2.465 5.909 5.909 0 00.798-5.34L90.961 8.672a5.91 5.91 0 00-5.602-4.022z" />
            <path d="M42.647 5.131a5.92 5.92 0 00-5.61 4.029L1.132 115.55a5.91 5.91 0 005.6 7.8h28.893c1.239 0 2.446-.41 3.452-1.113a5.923 5.923 0 002.157-2.916l7.019-20.71-13.411-12.857c-.246-.273-1.353-2.274-.369-4.002 1.108-1.659 2.955-1.659 2.955-1.659h17.285l9.074-26.145L48.274 8.321c-.042-.205-.914-1.365-2.281-2.28-1.37-.915-3.345-.909-3.345-.909z" opacity="0.8" />
            <path d="M37.767 80.871a2.724 2.724 0 00-1.86 4.718l37.83 35.31c1.101 1.03 2.502 1.631 4.007 1.631 0 0 1.282.068 2.055-.033 1.817-.273 3.525-1.768 4.09-2.39 1.457-1.939.794-4.95.794-4.95l-11.45-34.28z" opacity="0.9" />
        </svg>
    );
}

ArmIcon.propTypes = {
    className: PropTypes.string,
};

export const AzureIcon = ArmIcon;

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

