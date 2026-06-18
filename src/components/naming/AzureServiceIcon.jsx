import { useState } from 'react';
import PropTypes from 'prop-types';
import { getServiceIconUrl } from '../data/serviceIcons';
import { Box, LayoutGrid, Cpu, Network, Database, Globe, DatabaseZap, ShieldCheck, Workflow, BarChart3, Sparkles, Settings2, Wifi, GitBranch } from 'lucide-react';

const CATEGORY_ICONS = {
    'General': LayoutGrid,
    'Compute': Cpu,
    'Networking': Network,
    'Storage': Database,
    'Web': Globe,
    'Databases': DatabaseZap,
    'Containers': Box,
    'Security': ShieldCheck,
    'Integration': Workflow,
    'Analytics': BarChart3,
    'AI + ML': Sparkles,
    'Management + Governance': Settings2,
    'IoT': Wifi,
    'DevOps': GitBranch,
};

/**
 * AzureServiceIcon Component
 * 
 * Renders the official Azure architecture SVG icon for a given resource.
 * Falls back gracefully to the generic Lucide category icon if the
 * icon fails to load or no mapping exists.
 * 
 * @param {Object} props
 * @param {string} props.resourceName - The resource.name (e.g. "Virtual Machine - Windows")
 * @param {string} props.category - The resource category for fallback icon selection
 * @param {string} [props.className] - CSS class for sizing (e.g. "w-5 h-5")
 */
export default function AzureServiceIcon({ resourceName, category, className = 'w-5 h-5' }) {
    const iconUrl = getServiceIconUrl(resourceName);
    const [hasError, setHasError] = useState(false);

    if (!iconUrl || hasError) {
        const FallbackIcon = CATEGORY_ICONS[category] || Box;
        return <FallbackIcon className={className} />;
    }

    return (
        <img
            src={iconUrl}
            alt=""
            className={className}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
}

AzureServiceIcon.propTypes = {
    resourceName: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export { CATEGORY_ICONS };
