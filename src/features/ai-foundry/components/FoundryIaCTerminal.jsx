import { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';
import { TechnologyIcon } from '@shared';
import { generateBicepTemplate } from '../utils/bicepGenerator';
import { generateTerraformTemplate } from '../utils/terraformGenerator';
import { getFoundryResourceNames } from '../utils/foundryNaming';

function FoundryIaCTerminal({ config }) {
    const [activeTab, setActiveTab] = useState('bicep');
    const [copied, setCopied] = useState(false);

    const code = useMemo(() => {
        return activeTab === 'bicep'
            ? generateBicepTemplate(config)
            : generateTerraformTemplate(config);
    }, [activeTab, config]);

    const docsUrl = activeTab === 'bicep'
        ? 'https://learn.microsoft.com/azure/templates/microsoft.machinelearningservices/workspaces?pivots=deployment-language-bicep'
        : 'https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/ai_foundry';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleDownload = () => {
        const ext = activeTab === 'bicep' ? 'bicep' : 'tf';
        const { hubName } = getFoundryResourceNames(config);
        const filename = `${hubName || 'ai-foundry'}.${ext}`;
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col flex-1 h-full min-h-[480px] lg:min-h-[540px] overflow-hidden bg-fluent-code-bg animate-fade-in">
            {/* Sub-Header Toolbar */}
            <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-fluent-stroke-subtle bg-fluent-bg-canvas shrink-0">
                {/* Format Selector Tabs */}
                <div className="flex items-center gap-1 p-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle" role="tablist" aria-label="IaC format">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'bicep'}
                        onClick={() => setActiveTab('bicep')}
                        className={`px-3 h-[26px] rounded-[3px] text-[12px] transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                            activeTab === 'bicep'
                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
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
                        className={`px-3 h-[26px] rounded-[3px] text-[12px] transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                            activeTab === 'terraform'
                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent font-medium'
                        }`}
                    >
                        <TechnologyIcon name="terraform" className="w-3.5 h-3.5 shrink-0" />
                        <span>Terraform</span>
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <a
                        href={docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View ${activeTab === 'bicep' ? 'Bicep' : 'Terraform'} documentation`}
                        className="shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary active:scale-95"
                    >
                        <TechnologyIcon name={activeTab} className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{activeTab === 'bicep' ? 'Bicep Docs' : 'Terraform Registry'}</span>
                        <span className="sm:hidden">Docs</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>

                    <button
                        type="button"
                        onClick={handleDownload}
                        title={`Download ${activeTab === 'bicep' ? 'Bicep' : 'Terraform'} file`}
                        className="shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary active:scale-95"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border active:scale-95 ${
                            copied
                                ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 animate-scale-in" />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Surface */}
            <div className="relative flex-1 min-h-[420px] lg:min-h-0 w-full">
                <pre className="lg:absolute lg:inset-0 w-full h-full text-[13px] leading-relaxed font-mono overflow-auto p-5 text-fluent-code-fg m-0 select-all">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

FoundryIaCTerminal.propTypes = {
    config: PropTypes.object.isRequired
};

export default memo(FoundryIaCTerminal);

