import { useState, useMemo } from 'react';
import { Code2, Copy, Check, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';
import { generateBicepTemplate, generateTerraformTemplate, generateArmTemplate, generateBundleTemplates, getIacDocsUrl } from '../../../utils/templateGenerator';

/**
 * ResourceTemplateCard Component
 * 
 * Provides native Infrastructure-as-Code (IaC) snippets for the selected resource.
 * Supports toggling between Bicep and Terraform definitions, automatically 
 * injecting the locally generated compliant name. Also supports generating
 * multi-resource definitions when a deployment bundle is active.
 * 
 * @param {Object} props
 * @param {Object} props.resource - The currently selected resource dictionary.
 * @param {string} props.genName - The compliant resource name to inject.
 * @param {Array<Object>} [props.bundle] - Active deployment bundle array if applicable.
 * @param {Function} props.getBundleName - Helper function to extract names for bundled objects.
 * @param {Object} props.t - Shared tailwind class tokens for consistent themeing.
 * @returns {JSX.Element}
 */
export default function ResourceTemplateCard({ resource, genName, bundle, getBundleName }) {
    const [iacTab, setIacTab] = useState('bicep');
    const [isIacCopied, setIsIacCopied] = useState(false);

    const iacTemplate = useMemo(() => {
        if (bundle && bundle.length > 0) {
            return generateBundleTemplates(bundle, iacTab, getBundleName);
        }
        if (iacTab === 'bicep') return generateBicepTemplate(resource, genName);
        if (iacTab === 'terraform') return generateTerraformTemplate(resource, genName);
        return generateArmTemplate(resource, genName);
    }, [bundle, iacTab, resource, genName, getBundleName]);

    const docsUrl = useMemo(() => {
        const targetResource = (bundle && bundle.length > 0) ? bundle[0] : resource;
        return getIacDocsUrl(targetResource, iacTab);
    }, [bundle, resource, iacTab]);

    const handleCopyIac = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(iacTemplate);
        setIsIacCopied(true);
        setTimeout(() => setIsIacCopied(false), 2000);
    };

    return (
        <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full flex flex-col overflow-hidden h-full flex-1 min-h-0">
            <div className="px-5 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle shrink-0">
                <div className="flex items-center gap-3 text-fluent-fg-primary font-semibold select-none">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-fluent-brand-bg/10 text-fluent-brand-fg shrink-0">
                        <Code2 className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px]">Code Templates (IaC)</span>
                        <span className="text-[12px] font-normal text-fluent-fg-secondary">Review and export your {iacTab === 'terraform' ? 'Terraform' : iacTab === 'bicep' ? 'Bicep' : 'ARM'} code</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 lg:gap-2 w-full sm:w-auto">
                        <div className="flex shrink-0 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-md p-0.5 w-full sm:w-auto">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIacTab('bicep'); }}
                                className={`flex-1 sm:flex-none text-[12px] px-3 py-1.5 font-medium rounded-sm transition-all duration-200 ease-in-out active:scale-95 ${iacTab === 'bicep' ? 'bg-fluent-bg-card text-fluent-brand-fg shadow-sm border border-fluent-stroke-subtle' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'}`}
                            >
                                Bicep
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIacTab('arm'); }}
                                className={`flex-1 sm:flex-none text-[12px] px-3 py-1.5 font-medium rounded-sm transition-all duration-200 ease-in-out active:scale-95 ${iacTab === 'arm' ? 'bg-fluent-bg-card text-fluent-brand-fg shadow-sm border border-fluent-stroke-subtle' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'}`}
                            >
                                ARM
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIacTab('terraform'); }}
                                className={`flex-1 sm:flex-none text-[12px] px-3 py-1.5 font-medium rounded-sm transition-all duration-200 ease-in-out active:scale-95 ${iacTab === 'terraform' ? 'bg-fluent-bg-card text-fluent-brand-fg shadow-sm border border-fluent-stroke-subtle' : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'}`}
                            >
                                Terraform
                            </button>
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
                            <a
                                href={docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none px-3 h-[32px] rounded-[4px] border transition-colors duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50"
                                onClick={(e) => e.stopPropagation()}
                                title="View documentation"
                            >
                                {iacTab === 'terraform' ? (
                                    <img src="/terraform.svg" className="w-[14px] h-[14px] shrink-0" alt="Terraform" />
                                ) : (
                                    <svg viewBox="0 0 23 23" className="w-[14px] h-[14px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h11v11H0z" fill="#f35325"/>
                                        <path d="M12 0h11v11H12z" fill="#81bc06"/>
                                        <path d="M0 12h11v11H0z" fill="#05a6f0"/>
                                        <path d="M12 12h11v11H12z" fill="#ffba08"/>
                                    </svg>
                                )}
                                <span className="hidden sm:inline">{iacTab === 'terraform' ? 'Terraform Registry' : iacTab === 'bicep' ? 'Bicep Template' : 'ARM Template'}</span>
                                <span className="sm:hidden">Docs</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                            
                            <div className="w-px h-5 bg-fluent-stroke-subtle hidden sm:block"></div>
                            
                            <button
                                onClick={handleCopyIac}
                                className={`flex-1 sm:flex-none px-3 h-[32px] rounded-[4px] text-[13px] font-medium transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 border active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 ${isIacCopied ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary'}`}
                                title="Copy code"
                            >
                                {isIacCopied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                                <span>{isIacCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-[#1E1E1E] w-full flex-1 relative min-h-[14.5rem]">
                <pre className="absolute inset-0 text-[13px] leading-relaxed font-mono overflow-auto p-5 text-[#D4D4D4] m-0">
                    <code>{iacTemplate}</code>
                </pre>
            </div>
        </div>
    );
}

ResourceTemplateCard.propTypes = {
    resource: PropTypes.object.isRequired,
    genName: PropTypes.string.isRequired,
    bundle: PropTypes.array,
    getBundleName: PropTypes.func.isRequired,
};
