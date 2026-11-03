import { describe, it, expect } from 'vitest';
import { validateName } from './nameValidator';

const makeResource = (overrides = {}) => ({
    name: 'Resource group',
    abbrev: 'rg',
    maxLength: 90,
    scope: 'Subscription',
    chars: 'a-z, A-Z, 0-9, -, _, (), .',
    ...overrides,
});

describe('validateName', () => {
    // ─── Edge Cases ─────────────────────────────────────────────────

    it('returns empty array for null/undefined inputs', () => {
        expect(validateName(null, null)).toEqual([]);
        expect(validateName('', makeResource())).toEqual([]);
        expect(validateName('test', null)).toEqual([]);
    });

    it('returns empty array for a valid name', () => {
        const resource = makeResource();
        const issues = validateName('rg-web-prod-uks-001', resource);
        expect(issues).toEqual([]);
    });

    // ─── TOO_LONG ───────────────────────────────────────────────────

    it('detects name exceeding maxLength', () => {
        const resource = makeResource({ maxLength: 10 });
        const issues = validateName('rg-web-prod-uks-001', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'error',
            code: 'TOO_LONG',
        }));
    });

    it('does not flag name at exactly maxLength', () => {
        const resource = makeResource({ maxLength: 19 });
        const issues = validateName('rg-web-prod-uks-001', resource);
        const tooLong = issues.find(i => i.code === 'TOO_LONG');
        expect(tooLong).toBeUndefined();
    });

    // ─── STARTS_WITH_SPECIAL ────────────────────────────────────────

    it('detects name starting with hyphen', () => {
        const resource = makeResource();
        const issues = validateName('-rg-web-prod', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'error',
            code: 'STARTS_WITH_SPECIAL',
        }));
    });

    it('detects name starting with period', () => {
        const resource = makeResource();
        const issues = validateName('.rg-web-prod', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'error',
            code: 'STARTS_WITH_SPECIAL',
        }));
    });

    it('detects name starting with underscore', () => {
        const resource = makeResource();
        const issues = validateName('_rg-web-prod', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'error',
            code: 'STARTS_WITH_SPECIAL',
        }));
    });

    // ─── ENDS_WITH_SPECIAL ──────────────────────────────────────────

    it('detects name ending with hyphen', () => {
        const resource = makeResource();
        const issues = validateName('rg-web-prod-', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'error',
            code: 'ENDS_WITH_SPECIAL',
        }));
    });

    it('detects name ending with period', () => {
        const resource = makeResource();
        const issues = validateName('rg-web-prod.', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'error',
            code: 'ENDS_WITH_SPECIAL',
        }));
    });

    it('does not flag ENDS_WITH_SPECIAL for single-char names', () => {
        const resource = makeResource();
        // A single special char should only trigger STARTS_WITH_SPECIAL, not both
        const issues = validateName('-', resource);
        const endsIssue = issues.find(i => i.code === 'ENDS_WITH_SPECIAL');
        expect(endsIssue).toBeUndefined();
    });

    // ─── CONSECUTIVE_HYPHENS ────────────────────────────────────────

    it('detects consecutive hyphens', () => {
        const resource = makeResource();
        const issues = validateName('rg--web-prod', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'warning',
            code: 'CONSECUTIVE_HYPHENS',
        }));
    });

    it('does not flag consecutive hyphens for resources that disallow hyphens', () => {
        const resource = makeResource({ chars: 'a-z, 0-9' });
        const issues = validateName('st--webprod', resource);
        const consecutive = issues.find(i => i.code === 'CONSECUTIVE_HYPHENS');
        expect(consecutive).toBeUndefined();
    });

    // ─── CONSECUTIVE_PERIODS ────────────────────────────────────────

    it('detects consecutive periods', () => {
        const resource = makeResource();
        const issues = validateName('rg..web.prod', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'warning',
            code: 'CONSECUTIVE_PERIODS',
        }));
    });

    it('does not flag consecutive periods for resources that disallow periods', () => {
        const resource = makeResource({ chars: 'a-z, A-Z, 0-9, -' });
        const issues = validateName('rg..web', resource);
        const consecutive = issues.find(i => i.code === 'CONSECUTIVE_PERIODS');
        expect(consecutive).toBeUndefined();
    });

    // ─── UPPERCASE_NOT_ALLOWED ──────────────────────────────────────

    it('detects uppercase when resource only allows lowercase', () => {
        const resource = makeResource({ chars: 'a-z, 0-9, -' });
        const issues = validateName('St-Web-Prod', resource);
        expect(issues).toContainEqual(expect.objectContaining({
            type: 'error',
            code: 'UPPERCASE_NOT_ALLOWED',
        }));
    });

    it('does not flag uppercase when resource allows A-Z', () => {
        const resource = makeResource({ chars: 'a-z, A-Z, 0-9, -' });
        const issues = validateName('Rg-Web-Prod', resource);
        const caseIssue = issues.find(i => i.code === 'UPPERCASE_NOT_ALLOWED');
        expect(caseIssue).toBeUndefined();
    });

    // ─── Multiple Issues ────────────────────────────────────────────

    it('detects multiple issues at once', () => {
        const resource = makeResource({ maxLength: 5, chars: 'a-z, 0-9, -' });
        const issues = validateName('-too-long-name-', resource);
        const codes = issues.map(i => i.code);
        expect(codes).toContain('TOO_LONG');
        expect(codes).toContain('STARTS_WITH_SPECIAL');
        expect(codes).toContain('ENDS_WITH_SPECIAL');
    });
});
