import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * ValidationHighlight Component
 * 
 * Renders a string of text with inline syntax highlighting for invalid characters.
 * Identifies any character not matching the provided allowedCharsPattern and 
 * applies a red underline and title attribute detailing the issue.
 * Operates efficiently by grouping sequential valid characters into single text nodes.
 * 
 * @param {Object} props
 * @param {string} props.name - The target string (usually a generated resource name) to validate.
 * @param {string} [props.allowedCharsPattern] - Comma-separated list of allowed char ranges (e.g. 'a-z,0-9,-').
 * @returns {JSX.Element}
 */
export default function ValidationHighlight({ name, allowedCharsPattern }) {
    const validator = useMemo(() => {
        if (!allowedCharsPattern) return () => true;
        const allowedParts = allowedCharsPattern.split(',').map(s => s.trim());
        let regexStr = '^[';
        allowedParts.forEach(p => {
            if (p === 'a-z') regexStr += 'a-z';
            else if (p === 'A-Z') regexStr += 'A-Z';
            else if (p === '0-9') regexStr += '0-9';
            else if (p === '-') regexStr += '\\-';
            else if (p === '_') regexStr += '_';
            else if (p === '.') regexStr += '\\.';
            else if (p === '()') regexStr += '\\(\\)';
        });
        regexStr += ']$';
        const regex = new RegExp(regexStr);
        return (char) => regex.test(char);
    }, [allowedCharsPattern]);

    // Group consecutive valid characters into single text nodes to reduce DOM elements
    const segments = useMemo(() => {
        const result = [];
        let validBuffer = '';
        for (let i = 0; i < name.length; i++) {
            const char = name[i];
            if (validator(char)) {
                validBuffer += char;
            } else {
                if (validBuffer) {
                    result.push({ type: 'valid', text: validBuffer });
                    validBuffer = '';
                }
                result.push({ type: 'invalid', text: char });
            }
        }
        if (validBuffer) {
            result.push({ type: 'valid', text: validBuffer });
        }
        return result;
    }, [name, validator]);

    return (
        <span className="font-mono">
            {segments.map((seg, i) =>
                seg.type === 'valid' ? (
                    seg.text
                ) : (
                    <span key={i} className="text-[#a80000] dark:text-[#f1707b] font-bold underline decoration-wavy" title={`Invalid: '${seg.text}'`}>
                        {seg.text}
                    </span>
                )
            )}
        </span>
    );
}

ValidationHighlight.propTypes = {
    name: PropTypes.string.isRequired,
    allowedCharsPattern: PropTypes.string,
};
