/**
 * Validates an Azure resource name against resource-specific constraints.
 * 
 * Returns an array of validation issues, each with:
 * - type: 'error' | 'warning'
 * - code: string identifier for the rule
 * - message: human-readable description
 * 
 * @param {string} name - The generated resource name
 * @param {Object} resource - The resource definition from constants.js
 * @param {number} [resource.maxLength] - Maximum allowed characters
 * @param {string} [resource.chars] - Comma-separated allowed character classes
 * @returns {Array<{type: string, code: string, message: string}>}
 */
export function validateName(name, resource) {
    const issues = [];

    if (!name || !resource) return issues;

    // 1. Length check
    if (resource.maxLength && name.length > resource.maxLength) {
        issues.push({
            type: 'error',
            code: 'TOO_LONG',
            message: `Name is ${name.length} chars, exceeds maximum of ${resource.maxLength}.`,
        });
    }

    // 2. Parse allowed characters to understand constraints
    const charsList = resource.chars ? resource.chars.split(',').map(c => c.trim()) : [];
    const allowsHyphens = charsList.includes('-');
    const allowsPeriods = charsList.includes('.');
    const _allowsUnderscores = charsList.includes('_');
    const allowsUppercase = charsList.includes('A-Z');
    const allowsLowercase = charsList.includes('a-z');

    // 3. Start/end character checks
    const startChar = name[0];
    const endChar = name[name.length - 1];
    const specialChars = ['-', '_', '.'];

    if (specialChars.includes(startChar)) {
        issues.push({
            type: 'error',
            code: 'STARTS_WITH_SPECIAL',
            message: `Name cannot start with '${startChar}'.`,
        });
    }

    if (name.length > 1 && specialChars.includes(endChar)) {
        issues.push({
            type: 'error',
            code: 'ENDS_WITH_SPECIAL',
            message: `Name cannot end with '${endChar}'.`,
        });
    }

    // 4. Consecutive special character checks
    if (allowsHyphens && name.includes('--')) {
        issues.push({
            type: 'warning',
            code: 'CONSECUTIVE_HYPHENS',
            message: 'Name contains consecutive hyphens (--).',
        });
    }

    if (allowsPeriods && name.includes('..')) {
        issues.push({
            type: 'warning',
            code: 'CONSECUTIVE_PERIODS',
            message: 'Name contains consecutive periods (..).',
        });
    }

    // 5. Case violation check
    if (allowsLowercase && !allowsUppercase && /[A-Z]/.test(name)) {
        issues.push({
            type: 'error',
            code: 'UPPERCASE_NOT_ALLOWED',
            message: 'Uppercase letters are not allowed for this resource.',
        });
    }

    return issues;
}
