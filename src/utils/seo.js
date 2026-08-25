/**
 * SEO & Document Metadata Manager
 * 
 * Centralized SEO configuration and DOM head manipulation for SPA route navigation.
 * Updates document.title, canonical URL, meta description, Open Graph, and Twitter tags.
 */

export const ROUTE_SEO = {
    '/': {
        title: 'atozazure | The Ultimate Azure Governance Toolkit',
        headerTitle: 'Dashboard',
        description: 'Streamline your Azure cloud governance with atozazure. Discover our comprehensive suite of free tools for Resource Naming, Conditional Access policies, Management Group topologies, Tagging strategy, and Custom RBAC roles.',
        canonical: 'https://app.atozazure.com/',
        ogType: 'website',
    },
    '/resource-naming': {
        title: 'Azure Resource Naming Tool (CAF Compliant) | atozazure',
        headerTitle: 'Azure Resource Naming Tool',
        description: 'Generate standardized Azure resource names conforming to Microsoft Cloud Adoption Framework (CAF) best practices. Features real-time regex validation, customizable prefix ordering, and multi-service IaC export.',
        canonical: 'https://app.atozazure.com/resource-naming',
        ogType: 'website',
    },
    '/conditional-access': {
        title: 'Azure Conditional Access Policy Builder & Templates | atozazure',
        headerTitle: 'Conditional Access Policy Builder',
        description: 'Design, configure, and export Microsoft Entra ID Conditional Access policies. Includes Microsoft Zero Trust security baselines, emergency access exclusions, and JSON templates.',
        canonical: 'https://app.atozazure.com/conditional-access',
        ogType: 'website',
    },
    '/management-groups': {
        title: 'Azure Management Group Topology Designer | atozazure',
        headerTitle: 'Management Group Topology Designer',
        description: 'Architect and visualize Azure Enterprise-Scale Landing Zone management group hierarchies with interactive tree diagrams, policy assignments, and Bicep / Terraform export.',
        canonical: 'https://app.atozazure.com/management-groups',
        ogType: 'website',
    },
    '/tagging-strategy': {
        title: 'Azure Tagging Strategy Builder & Policy Generator | atozazure',
        headerTitle: 'Tagging Strategy Builder',
        description: 'Define and enforce standardized cloud tagging taxonomies across Azure subscriptions and resource groups with built-in Azure Policy definitions and CAF best practices.',
        canonical: 'https://app.atozazure.com/tagging-strategy',
        ogType: 'website',
    },
    '/rbac-designer': {
        title: 'Azure Custom RBAC Role Designer & Builder | atozazure',
        headerTitle: 'RBAC Custom Role Designer',
        description: 'Build, validate, and export Azure Custom Role Definitions with least-privilege permissions for ARM, Bicep, Terraform, and Azure CLI.',
        canonical: 'https://app.atozazure.com/rbac-designer',
        ogType: 'website',
    },
};

export const DEFAULT_SEO = {
    title: 'Page Not Found | atozazure',
    headerTitle: 'Page Not Found',
    description: 'The requested page could not be found on atozazure Azure Governance Toolkit.',
    canonical: 'https://app.atozazure.com/',
    ogType: 'website',
};

/**
 * Retrieve SEO metadata for a given path
 * @param {string} pathname 
 * @returns {object}
 */
export function getRouteSEO(pathname) {
    return ROUTE_SEO[pathname] || DEFAULT_SEO;
}

/**
 * Updates or creates a <meta> tag in the document head
 * @param {string} attribute - 'name' or 'property'
 * @param {string} attrValue - Attribute value (e.g. 'description', 'og:title')
 * @param {string} content - Value for content attribute
 */
function setMetaTag(attribute, attrValue, content) {
    if (typeof document === 'undefined') return;
    let meta = document.querySelector(`meta[${attribute}="${attrValue}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, attrValue);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

/**
 * Updates or creates a <link> tag in the document head
 * @param {string} rel - Link relation (e.g. 'canonical')
 * @param {string} href - URL target
 */
function setLinkTag(rel, href) {
    if (typeof document === 'undefined') return;
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
}

/**
 * Applies full SEO metadata to the DOM for the given pathname
 * @param {string} pathname 
 */
export function applySEO(pathname) {
    if (typeof document === 'undefined') return;

    const seo = getRouteSEO(pathname);

    // Browser tab title
    document.title = seo.title;

    // Meta Description
    setMetaTag('name', 'description', seo.description);

    // Canonical link
    setLinkTag('canonical', seo.canonical);

    // Open Graph
    setMetaTag('property', 'og:title', seo.title);
    setMetaTag('property', 'og:description', seo.description);
    setMetaTag('property', 'og:url', seo.canonical);
    setMetaTag('property', 'og:type', seo.ogType || 'website');

    // Twitter Card
    setMetaTag('name', 'twitter:title', seo.title);
    setMetaTag('name', 'twitter:description', seo.description);
}
