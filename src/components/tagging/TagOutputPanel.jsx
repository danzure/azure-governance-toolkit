import { useState, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Copy, Check } from 'lucide-react';
import TechnologyIcon from '../shared/TechnologyIcon';
import { 
    generateTagJson, 
    generateTagMarkdown, 
    generateTagBicep, 
    generateTagTerraform 
} from '../../data/taggingData';

/**
 * TagOutputPanel Component
 * 
 * Takes the tag definitions from the TagBuilder and dynamically generates
 * actionable outputs:
 * - Azure Policy JSON (initiative structure)
 * - Bicep (native Azure resource definitions)
 * - Terraform (azurerm_policy_definition resources)
 * - Markdown table (documentation and wiki export)
 * 
 * Includes 1-click copy-to-clipboard functionality with positive feedback.
 * 
 * @param {Object} props
 * @param {Array} props.tags - Array of tag definition objects to generate output for.
 */
export default function TagOutputPanel({ tags }) {
    const [activeTab, setActiveTab] = useState('json'); // 'json' | 'bicep' | 'terraform' | 'markdown'
    const [copied, setCopied] = useState(false);
    const copyTimeoutRef = useRef(null);

    const outputContent = useMemo(() => {
        switch (activeTab) {
            case 'json':
                return generateTagJson(tags);
            case 'bicep':
                return generateTagBicep(tags);
            case 'terraform':
                return generateTagTerraform(tags);
            case 'markdown':
                return generateTagMarkdown(tags);
            default:
                return '';
        }
    }, [tags, activeTab]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(outputContent);
            setCopied(true);
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }, [outputContent]);

    return (
        <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full flex flex-col overflow-hidden h-full min-h-[400px]">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle px-4 py-3 shrink-0">
                {/* Format Tabs */}
                <div 
                    className="flex shrink-0 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-md p-0.5 w-full sm:w-auto flex-wrap" 
                    role="tablist"
                    aria-label="Export format"
                >
                    <button 
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'json'}
                        onClick={() => setActiveTab('json')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-medium transition-all duration-200 ease-in-out active:scale-95 ${
                            activeTab === 'json' 
                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle' 
                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'
                        }`}
                    >
                        <TechnologyIcon name="json" className="w-3.5 h-3.5 shrink-0" /> 
                        <span>JSON</span>
                    </button>
                    <button 
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'bicep'}
                        onClick={() => setActiveTab('bicep')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-medium transition-all duration-200 ease-in-out active:scale-95 ${
                            activeTab === 'bicep' 
                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle' 
                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'
                        }`}
                    >
                        <TechnologyIcon name="bicep" className="w-3.5 h-3.5 shrink-0" /> 
                        <span>Bicep</span>
                    </button>
                    <button 
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'terraform'}
                        onClick={() => setActiveTab('terraform')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-medium transition-all duration-200 ease-in-out active:scale-95 ${
                            activeTab === 'terraform' 
                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle' 
                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'
                        }`}
                    >
                        <TechnologyIcon name="terraform" className="w-3.5 h-3.5 shrink-0" /> 
                        <span>Terraform</span>
                    </button>
                    <button 
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'markdown'}
                        onClick={() => setActiveTab('markdown')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-[12px] font-medium transition-all duration-200 ease-in-out active:scale-95 ${
                            activeTab === 'markdown' 
                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle' 
                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'
                        }`}
                    >
                        <TechnologyIcon name="markdown" className="w-3.5 h-3.5 shrink-0" />
                        <span>Markdown</span>
                    </button>
                </div>

                {/* Copy Button */}
                <button
                    type="button"
                    onClick={handleCopy}
                    className={`shrink-0 w-full sm:w-auto h-[32px] px-3 rounded-[4px] text-[13px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border active:scale-95 shadow-sm ${
                        copied
                            ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                            : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                    }`}
                    title="Copy generated output"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5" /> 
                            <span>Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" /> 
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            
            {/* Terminal Code Content */}
            <div className="flex-1 bg-fluent-code-bg w-full min-h-0 overflow-hidden relative">
                <pre className="h-full text-[13px] leading-relaxed font-mono overflow-auto p-5 text-fluent-code-fg m-0 custom-scrollbar">
                    <code>{outputContent}</code>
                </pre>
            </div>
        </div>
    );
}

TagOutputPanel.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        requirement: PropTypes.string,
        effect: PropTypes.string,
        allowedValues: PropTypes.string
    })).isRequired
};
