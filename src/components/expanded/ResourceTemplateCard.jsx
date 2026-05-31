import { useState, useMemo } from 'react';
import { Code2, Copy, Check, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';
import { generateBicepTemplate, generateTerraformTemplate, generateArmTemplate, generateBundleTemplates, getIacDocsUrl } from '../../utils/templateGenerator';

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
export default function ResourceTemplateCard({ resource, genName, bundle, getBundleName, t }) {
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
        <div className={`rounded-md border overflow-hidden flex flex-col flex-1 ${t.card}`}>
            <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
                <div className="flex items-center gap-1.5">
                    <Code2 className={`w-3 h-3 ${t.muted}`} />
                    <span className={`text-[12px] font-semibold ${t.caption}`}>Infrastructure as Code</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-[#edebe9] dark:bg-[#323130] rounded-sm p-0.5">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIacTab('bicep'); }}
                            className={`text-[12px] px-3 py-1 font-medium rounded-sm transition-all ${iacTab === 'bicep' ? 'bg-white dark:bg-[#484644] text-[#0078d4] dark:text-[#60cdff] shadow-sm' : 'text-[#605e5c] dark:text-[#c8c6c4] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                        >
                            Bicep
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIacTab('arm'); }}
                            className={`text-[12px] px-3 py-1 font-medium rounded-sm transition-all ${iacTab === 'arm' ? 'bg-white dark:bg-[#484644] text-[#0078d4] dark:text-[#60cdff] shadow-sm' : 'text-[#605e5c] dark:text-[#c8c6c4] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                        >
                            ARM
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIacTab('terraform'); }}
                            className={`text-[12px] px-3 py-1 font-medium rounded-sm transition-all ${iacTab === 'terraform' ? 'bg-white dark:bg-[#484644] text-[#0078d4] dark:text-[#60cdff] shadow-sm' : 'text-[#605e5c] dark:text-[#c8c6c4] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
                        >
                            Terraform
                        </button>
                    </div>
                    <button
                        onClick={handleCopyIac}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-[13px] font-medium transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg ${isIacCopied ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' : 'border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39]'}`}
                        title="Copy template"
                    >
                        {isIacCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isIacCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                </div>
            </div>
            <div className="border-t border-[#e1dfdd] dark:border-[#3b3a39] bg-[#f3f2f1] dark:bg-[#1b1a19]">
                <pre className={`text-[11px] font-mono whitespace-pre-wrap overflow-x-auto overflow-y-auto max-h-[14.5rem] p-4 ${t.text}`}>
                    {iacTemplate}
                </pre>
            </div>
            <div className="border-t border-[#e1dfdd] dark:border-[#3b3a39] px-4 py-3 flex justify-start bg-fluent-bg-canvas dark:bg-[#1b1a19]">
                <a
                    href={docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#d1d1d1] dark:border-[#525252] bg-white dark:bg-[#292929] text-[#242424] dark:text-[#ffffff] text-[13px] font-medium hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {iacTab === 'terraform' ? (
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.465 14.282v-6.082l5.35-3.084v6.082l-5.35 3.084z" fill="#5C4EE5"/>
                            <path d="M7.643 17.842v-6.08l5.348-3.085v6.08l-5.348 3.085z" fill="#5C4EE5"/>
                            <path d="M7.643 10.613V4.53l5.348-3.083v6.082l-5.348 3.084z" fill="#5C4EE5"/>
                            <path d="M13.821 14.282v-6.082l5.35-3.084v6.082l-5.35 3.084z" fill="#5C4EE5"/>
                        </svg>
                    ) : (
                        <svg viewBox="0 0 23 23" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h11v11H0z" fill="#f35325"/>
                            <path d="M12 0h11v11H12z" fill="#81bc06"/>
                            <path d="M0 12h11v11H0z" fill="#05a6f0"/>
                            <path d="M12 12h11v11H12z" fill="#ffba08"/>
                        </svg>
                    )}
                    {iacTab === 'terraform' ? 'Terraform Registry' : iacTab === 'bicep' ? 'Bicep Template' : 'ARM Template'}
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}

ResourceTemplateCard.propTypes = {
    resource: PropTypes.object.isRequired,
    genName: PropTypes.string.isRequired,
    bundle: PropTypes.array,
    getBundleName: PropTypes.func.isRequired,
    t: PropTypes.object.isRequired,
};
