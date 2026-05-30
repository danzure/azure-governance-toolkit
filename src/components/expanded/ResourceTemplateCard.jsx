import React, { useState, useMemo } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import PropTypes from 'prop-types';
import { generateBicepTemplate, generateTerraformTemplate, generateArmTemplate, generateBundleTemplates } from '../../utils/templateGenerator';

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
                        className={`h-[26px] px-2.5 rounded-sm text-[12px] font-medium transition-all flex items-center gap-1.5 border ${isIacCopied ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' : 'bg-white dark:bg-[#323130] border-[#e1dfdd] dark:border-[#484644] text-[#605e5c] dark:text-[#c8c6c4] hover:border-[#c8c6c4] dark:hover:border-[#605e5c] hover:text-[#323130] dark:hover:text-[#e1dfdd]'}`}
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
