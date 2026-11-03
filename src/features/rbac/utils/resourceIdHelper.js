/**
 * Generates a consistent, sanitized HTML id for an Azure resource card.
 * Strips special characters, spaces, and parentheses to ensure clean CSS/DOM queries.
 * 
 * @param {string} name - Azure resource name (e.g. "Kubernetes Services (AKS)")
 * @returns {string} Sanitized id attribute (e.g. "az-resource-kubernetes-services-aks")
 */
export function toResourceId(name) {
    if (!name) return 'az-resource-unknown';
    const sanitized = String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    return `az-resource-${sanitized || 'item'}`;
}
