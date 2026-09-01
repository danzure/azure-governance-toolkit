/**
 * SEO & Document Metadata Manager
 * 
 * Centralized SEO configuration, DOM head manipulation, and dynamic Schema.org structured data
 * for SPA route navigation.
 * Updates document.title, canonical URL, meta description, keywords, Open Graph, Twitter tags,
 * and JSON-LD Breadcrumbs.
 */

export const ROUTE_SEO = {
    '/': {
        title: 'atozazure | The Ultimate Azure Governance Toolkit',
        headerTitle: 'Dashboard',
        description: 'Streamline your Azure cloud governance with atozazure. Discover our comprehensive suite of free tools for Resource Naming (CAF), Conditional Access, Management Group topologies, Tagging strategy, and Custom RBAC roles.',
        keywords: 'azure resource naming, Azure Resource Naming, Azure resource naming tool, Azure naming convention, Microsoft Cloud Adoption Framework, CAF naming, Azure governance, Azure Conditional Access templates, Entra ID Conditional Access, Azure Management Groups designer, Azure Landing Zones, Azure tagging strategy, Azure policy tag rules, Azure custom RBAC role generator, Azure role definitions, Bicep, Terraform Azure',
        canonical: 'https://app.atozazure.com/',
        ogType: 'website',
        breadcrumbs: [
            { name: 'Home', url: 'https://app.atozazure.com/' }
        ],
    },
    '/resource-naming': {
        title: 'Azure Resource Naming Tool (CAF Compliant) | atozazure',
        headerTitle: 'Azure Resource Naming Tool',
        description: 'Generate standardized Azure resource names conforming to Microsoft Cloud Adoption Framework (CAF) best practices. Features real-time regex validation, customizable prefix ordering, and multi-service IaC export.',
        keywords: 'azure resource naming, Azure Resource Naming, Azure resource naming tool, Azure naming convention CAF, Microsoft Cloud Adoption Framework naming, Azure resource abbreviation, Azure naming rules, Azure resource name generator, Azure CAF standards, Terraform Azure resource names, Bicep resource naming, cloud adoption framework resource naming',
        canonical: 'https://app.atozazure.com/resource-naming',
        ogType: 'website',
        breadcrumbs: [
            { name: 'Home', url: 'https://app.atozazure.com/' },
            { name: 'Azure Resource Naming Tool', url: 'https://app.atozazure.com/resource-naming' }
        ],
    },
    '/conditional-access': {
        title: 'Azure Conditional Access Policy Builder & Templates | atozazure',
        headerTitle: 'Conditional Access Policy Builder',
        description: 'Design, configure, and export Microsoft Entra ID Conditional Access policies. Includes Microsoft Zero Trust security baselines, emergency access exclusions, and JSON templates.',
        keywords: 'azure conditional access, Conditional Access policy builder, Microsoft Entra ID Conditional Access, Zero Trust baseline policies, Conditional Access naming convention, Azure MFA policy templates, emergency break glass exclusion, Entra ID policy JSON export, Azure identity security, Entra ID baseline templates',
        canonical: 'https://app.atozazure.com/conditional-access',
        ogType: 'website',
        breadcrumbs: [
            { name: 'Home', url: 'https://app.atozazure.com/' },
            { name: 'Conditional Access Policy Builder', url: 'https://app.atozazure.com/conditional-access' }
        ],
    },
    '/management-groups': {
        title: 'Azure Management Group Topology Designer | atozazure',
        headerTitle: 'Management Group Topology Designer',
        description: 'Architect and visualize Azure Enterprise-Scale Landing Zone management group hierarchies with interactive tree diagrams, policy assignments, and Bicep / Terraform export.',
        keywords: 'azure management groups, Azure landing zone topology designer, Enterprise Scale Landing Zones ESLZ, Azure management group hierarchy builder, Bicep management groups, Terraform azurerm_management_group, Azure cloud architecture diagram, Azure landing zone hierarchy, Azure tenant root group, cloud architecture diagram',
        canonical: 'https://app.atozazure.com/management-groups',
        ogType: 'website',
        breadcrumbs: [
            { name: 'Home', url: 'https://app.atozazure.com/' },
            { name: 'Management Group Topology Designer', url: 'https://app.atozazure.com/management-groups' }
        ],
    },
    '/tagging-strategy': {
        title: 'Azure Tagging Strategy Builder & Policy Generator | atozazure',
        headerTitle: 'Tagging Strategy Builder',
        description: 'Define and enforce standardized cloud tagging taxonomies across Azure subscriptions and resource groups with built-in Azure Policy definitions and CAF best practices.',
        keywords: 'azure tagging strategy, Azure policy tag governance, cloud tagging taxonomy, Azure CAF tagging conventions, Azure tag policy generator JSON, mandatory tag enforcement, FinOps cloud cost allocation tags, Azure resource tagging, Azure compliance policy',
        canonical: 'https://app.atozazure.com/tagging-strategy',
        ogType: 'website',
        breadcrumbs: [
            { name: 'Home', url: 'https://app.atozazure.com/' },
            { name: 'Tagging Strategy Builder', url: 'https://app.atozazure.com/tagging-strategy' }
        ],
    },
    '/rbac-designer': {
        title: 'Azure Custom RBAC Role Designer & Builder | atozazure',
        headerTitle: 'RBAC Custom Role Designer',
        description: 'Build, validate, and export Azure Custom Role Definitions with least-privilege permissions for ARM, Bicep, Terraform, and Azure CLI.',
        keywords: 'azure custom rbac role, Azure RBAC custom role designer, Azure custom role builder, Azure role definition JSON, least privilege Azure permissions, Azure RBAC generator, Bicep custom role definition, Terraform azurerm_role_definition, Microsoft Entra permissions, Azure IAM governance',
        canonical: 'https://app.atozazure.com/rbac-designer',
        ogType: 'website',
        breadcrumbs: [
            { name: 'Home', url: 'https://app.atozazure.com/' },
            { name: 'RBAC Custom Role Designer', url: 'https://app.atozazure.com/rbac-designer' }
        ],
    },
};

export const DEFAULT_SEO = {
    title: 'Page Not Found | atozazure',
    headerTitle: 'Page Not Found',
    description: 'The requested page could not be found on atozazure Azure Governance Toolkit.',
    keywords: 'Azure governance tools, page not found, 404, atozazure',
    canonical: 'https://app.atozazure.com/',
    ogType: 'website',
    breadcrumbs: [
        { name: 'Home', url: 'https://app.atozazure.com/' },
        { name: 'Page Not Found', url: 'https://app.atozazure.com/' }
    ],
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
    if (typeof document === 'undefined' || !content) return;
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
    if (typeof document === 'undefined' || !href) return;
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
}

/**
 * Updates or creates a JSON-LD structured data script tag in document head
 * @param {string} id - Script element ID
 * @param {object} data - JSON-LD object
 */
function setJsonLdScript(id, data) {
    if (typeof document === 'undefined' || !data) return;
    let script = document.querySelector(`script#${id}`);
    if (!script) {
        script = document.createElement('script');
        script.setAttribute('id', id);
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
}

/**
 * Applies full SEO metadata to the DOM for the given pathname
 * @param {string} pathname 
 */
export function applySEO(pathname) {
    if (typeof document === 'undefined') return;

    const seo = getRouteSEO(pathname);
    const ogImage = 'https://app.atozazure.com/atozazure-favicon-192x192.png?v=2';
    const siteName = 'atozazure | Azure Governance Toolkit';

    // Browser tab title
    document.title = seo.title;

    // Standard search engine meta tags
    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'keywords', seo.keywords);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Canonical link
    setLinkTag('canonical', seo.canonical);

    // Open Graph
    setMetaTag('property', 'og:title', seo.title);
    setMetaTag('property', 'og:description', seo.description);
    setMetaTag('property', 'og:url', seo.canonical);
    setMetaTag('property', 'og:type', seo.ogType || 'website');
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:alt', `${seo.headerTitle} - atozazure`);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary');
    setMetaTag('name', 'twitter:title', seo.title);
    setMetaTag('name', 'twitter:description', seo.description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:image:alt', `${seo.headerTitle} - atozazure`);

    // Schema.org BreadcrumbList JSON-LD
    if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
        const breadcrumbData = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': seo.breadcrumbs.map((item, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': item.name,
                'item': item.url,
            })),
        };
        setJsonLdScript('seo-breadcrumb-jsonld', breadcrumbData);
    }
}

