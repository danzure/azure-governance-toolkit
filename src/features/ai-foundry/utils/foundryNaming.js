import { generateName, RESOURCE_DATA_SORTED, AZURE_REGIONS } from '@features/naming';

/**
 * Derives fully CAF-compliant Azure resource names for all components
 * in an AI Foundry landing zone based on Microsoft Cloud Adoption Framework standards.
 * 
 * @param {Object} config - AI Foundry configuration object
 * @returns {Object} Dictionary of compliant Azure resource names
 */
export function getFoundryResourceNames(config) {
    const regionObj = AZURE_REGIONS.find(r => r.value === config.region) || { abbrev: 'uks' };
    const regionAbbrev = regionObj.abbrev || 'uks';
    const instance = (config.instance || '001').padStart(3, '0');
    const workload = (config.workload || 'coreai').toLowerCase().replace(/[^a-z0-9]/g, '');
    const envValue = config.environment || 'prod';
    const namingOrder = ['Org', 'Resource', 'Workload', 'Environment', 'Region', 'Instance'];

    const baseNamingConfig = {
        workload,
        orgPrefix: '',
        regionAbbrev,
        regionValue: config.region || 'uksouth',
        instance,
        envValue,
        namingOrder,
        showOrg: false
    };

    const resolveName = (resourceName, workloadOverride = null) => {
        const res = RESOURCE_DATA_SORTED.find(r => r.name === resourceName);
        if (!res) return '';
        const effectiveConfig = workloadOverride
            ? { ...baseNamingConfig, workload: workloadOverride.toLowerCase().replace(/[^a-z0-9]/g, '') }
            : baseNamingConfig;
        return generateName(res, effectiveConfig);
    };

    const hubName = resolveName('Microsoft Foundry hub');
    const rgName = resolveName('Resource group');
    const storageName = resolveName('Storage account');
    const keyVaultName = resolveName('Key vault');
    const openAiName = resolveName('Azure OpenAI Service');
    const searchName = resolveName('Azure AI Search');
    const logAnalyticsName = resolveName('Log Analytics workspace');
    const appInsightsName = resolveName('Application Insights');
    const acrName = resolveName('Container registry');
    const uamiName = resolveName('Managed identity (user)');

    const projects = (config.projects || []).map((p, idx) => {
        const cleanApp = (p.id || p.name || `app${idx + 1}`)
            .replace(/^proj-/, '')
            .replace(/[^a-z0-9]/g, '') || `app${idx + 1}`;
        return {
            ...p,
            generatedName: resolveName('Microsoft Foundry project', cleanApp)
        };
    });

    return {
        regionAbbrev,
        rgName,
        hubName,
        projects,
        storageName,
        keyVaultName,
        openAiName,
        searchName,
        logAnalyticsName,
        appInsightsName,
        acrName,
        uamiName
    };
}

