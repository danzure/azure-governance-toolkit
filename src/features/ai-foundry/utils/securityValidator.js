import { SECURITY_RULES } from '../data/securityRules';

/**
 * Validates an AI Foundry configuration against security best practices and MCSB rules.
 * 
 * @param {Object} config - AI Foundry configuration object
 * @returns {Array<Object>} List of evaluated security items with pass/fail status
 */
export function validateSecurity(config) {
    if (!config) return [];

    return SECURITY_RULES.map(rule => {
        const passed = rule.evaluate(config);
        return {
            ...rule,
            passed,
            status: passed ? 'pass' : 'warning'
        };
    });
}

