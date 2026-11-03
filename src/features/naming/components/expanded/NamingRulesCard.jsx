import PropTypes from 'prop-types';
import { BookOpen } from 'lucide-react';

/**
 * NamingRuleRow Sub-component
 * 
 * Helper component to render a consistent key-value style row within the rules table.
 * 
 * @param {Object} props
 * @param {string} props.label - Rule title (e.g., 'Max Length').
 * @param {string} props.description - Short summary of the rule's purpose.
 * @param {React.ReactNode} props.children - Values or visualizations to display on the right.
 * @param {boolean} [props.isLast=false] - Whether to omit the bottom border styling.
 * @param {Object} props.t - Shared tailwind class tokens for consistent themeing.
 * @returns {JSX.Element}
 */
function NamingRuleRow({ label, description, children, isLast = false, t }) {
    return (
        <div className={`flex items-center justify-between py-1.5 ${isLast ? '' : `border-b ${t.divider}`}`}>
            <div className="flex flex-col gap-0 min-w-0 mr-3">
                <span className={`text-[13px] font-medium leading-tight ${t.strong}`}>{label}</span>
                <span className="text-[12px] text-fluent-fg-tertiary leading-tight">{description}</span>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

NamingRuleRow.propTypes = {
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    isLast: PropTypes.bool,
    t: PropTypes.object.isRequired,
};

/**
 * NamingRulesCard Component
 * 
 * Displays a structured table of Azure's technical naming rules for the selected resource.
 * Details the required uniqueness scope, character limits, recommended abbreviation, 
 * and specific allowed characters or regex constraints.
 * 
 * @param {Object} props
 * @param {Object} props.resource - The resource definition containing lengths, abbreviations, and scopes.
 * @param {string} props.scopeDesc - Formatted human-readable explanation of the resource's uniqueness scope.
 * @param {string} [props.selectedSubResource] - Currently selected sub-resource context (e.g., specific subnet type).
 * @param {Object} props.t - Shared tailwind class tokens for consistent themeing.
 * @returns {JSX.Element}
 */
export default function NamingRulesCard({ resource, scopeDesc, selectedSubResource, t }) {
    return (
        <div className={`rounded-md border overflow-hidden flex-shrink-0 ${t.card}`}>
            <div className="p-4">
                <div className="flex items-center gap-1.5 mb-4">
                    <BookOpen className={`w-3 h-3 ${t.muted}`} />
                    <span className={`text-[12px] font-semibold ${t.caption}`}>Naming rules</span>
                </div>
                <div className="flex flex-col">
                    <NamingRuleRow label="Uniqueness Scope" description="The level at which the name must be unique." t={t}>
                        <div className="flex flex-col items-end gap-0.5 text-right">
                            <span className={`text-[14px] font-semibold ${t.strong}`}>{resource.scope || 'Resource group'}</span>
                            <span className="text-[12px] max-w-[200px] leading-tight text-fluent-fg-tertiary">{scopeDesc}</span>
                        </div>
                    </NamingRuleRow>

                    <NamingRuleRow label="Max Length" description="Maximum number of characters allowed." t={t}>
                        <span className={`text-[14px] font-mono font-semibold ${t.strong}`}>
                            {resource.maxLength} chars
                        </span>
                    </NamingRuleRow>

                    <NamingRuleRow label="Recommended Abbrev" description="Common abbreviation for this resource type." t={t}>
                        <code className={`text-[13px] px-2 py-0.5 rounded-sm font-mono font-medium border ${t.code}`}>
                            {resource.abbrev}{selectedSubResource ? `-${selectedSubResource}` : ''}
                        </code>
                    </NamingRuleRow>

                    <NamingRuleRow label="Allowed Characters" description="Only the characters shown here are permitted in the name." isLast t={t}>
                        <div className="flex items-center gap-1 flex-wrap justify-end">
                            {resource.chars?.split(',').map((char, i) => (
                                <span key={i} className={`text-[12px] px-1.5 py-0.5 rounded-sm font-mono font-medium min-w-[22px] text-center border ${t.charBadge}`}>
                                    {char.trim()}
                                </span>
                            ))}
                        </div>
                    </NamingRuleRow>
                </div>
            </div>
        </div>
    );
}

NamingRulesCard.propTypes = {
    resource: PropTypes.object.isRequired,
    scopeDesc: PropTypes.string.isRequired,
    selectedSubResource: PropTypes.string,
    t: PropTypes.object.isRequired,
};
