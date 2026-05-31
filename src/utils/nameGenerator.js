/**
 * Generates a compliant Azure resource name based on configuration and resource-specific rules.
 *
 * @param {Object} resource - The resource definition object from constants.js
 * @param {Object} config - Naming configuration
 * @param {string} config.workload - Workload name
 * @param {string} config.orgPrefix - Organisation prefix
 * @param {string} config.regionAbbrev - Region abbreviation (e.g., 'uks')
 * @param {string} config.instance - Instance number (padded to 3 digits)
 * @param {string} config.envValue - Environment abbreviation (e.g., 'prod')
 * @param {string[]} config.namingOrder - Array defining segment order
 * @param {boolean} config.showOrg - Whether to include org prefix
 * @param {string} [config.patternOverride] - Optional custom pattern to replace resource+workload
 * @param {string} [selectedSubResource=null] - Optional suffix for sub-resources
 * @returns {string} The generated resource name
 */
export function generateName(resource, config, selectedSubResource = null) {
    const { workload, orgPrefix, regionAbbrev, instance, envValue, namingOrder, showOrg, patternOverride } = config;

    let resAbbrev = resource.abbrev || "res";

    // If resource has subResources and one is selected, append the suffix
    if (resource.subResources && selectedSubResource) {
        resAbbrev = `${resAbbrev}-${selectedSubResource}`;
    }

    // Special handling for Azure Firewall and Bastion subnets (must be exact names)
    if (resource.name === 'Subnet') {
        if (selectedSubResource === 'afw') return 'AzureFirewallSubnet';
        if (selectedSubResource === 'bas') return 'AzureBastionSubnet';
        if (selectedSubResource === 'gw') return 'GatewaySubnet';
        if (selectedSubResource === 'afwm') return 'AzureFirewallManagementSubnet';
        if (selectedSubResource === 'rs') return 'RouteServerSubnet';
    }

    // Special handling for Network watcher (fixed name)
    if (resource.name === 'Network watcher') {
        const regValue = config.regionValue || 'uksouth';
        return `NetworkWatcher_${regValue}`;
    }

    const cleanWorkload = workload.toLowerCase().replace(/[^a-z0-9]/g, '') || 'workload';
    const cleanOrg = orgPrefix.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Special handling for DevOps organization
    if (resource.name === 'DevOps organization') {
        const orgName = cleanOrg || cleanWorkload;
        return `ado-${orgName}`;
    }

    const regAbbrev = regionAbbrev || 'uks';
    const suffix = (instance || '001').padStart(3, '0');

    // Check if resource allows hyphens based on chars field
    const charsList = resource.chars ? resource.chars.split(',').map(c => c.trim()) : [];
    const allowsHyphens = charsList.includes('-');

    // Special handling for Windows VM (15 char limit)
    if (resAbbrev === 'vmw') {
        const maxWorkload = 15 - 3 - 1 - 3 - 3;
        return `${resAbbrev}${cleanWorkload.substring(0, maxWorkload)}${envValue.substring(0, 1)}${regAbbrev.substring(0, 3)}${suffix}`.toLowerCase();
    }

    // Handle pattern override which may contain placeholders
    let processedPattern = patternOverride;
    let skipParts = {};
    if (processedPattern) {
        if (processedPattern.includes('{env}')) {
            processedPattern = processedPattern.replace('{env}', envValue);
            skipParts['Environment'] = true;
        }
        if (processedPattern.includes('{region}')) {
            processedPattern = processedPattern.replace('{region}', regAbbrev);
            skipParts['Region'] = true;
        }
        if (processedPattern.includes('{instance}')) {
            processedPattern = processedPattern.replace('{instance}', suffix);
            skipParts['Instance'] = true;
        }
    }

    // Build parts based on naming order
    let parts = [];
    namingOrder.forEach(part => {
        if (part === 'Org' && showOrg && cleanOrg) parts.push(cleanOrg);
        if (part === 'Resource') {
            if (processedPattern) {
                parts.push(processedPattern);
            } else {
                parts.push(resAbbrev);
            }
        }
        if (part === 'Workload') {
            if (!processedPattern) {
                parts.push(cleanWorkload);
            }
        }
        if (part === 'Environment' && !skipParts['Environment']) parts.push(envValue);
        if (part === 'Region' && !skipParts['Region']) {
            if (resource.name !== 'Subscription' && resource.name !== 'Management group') {
                parts.push(regAbbrev);
            }
        }
        if (part === 'Instance' && !skipParts['Instance']) parts.push(suffix);
    });

    const separator = allowsHyphens ? '-' : '';
    let result = parts.join(separator);

    return result.toLowerCase();
}
