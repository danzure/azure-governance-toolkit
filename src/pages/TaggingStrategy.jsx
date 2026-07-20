import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronRight, Info } from 'lucide-react';
import TagBuilder from '../components/tagging/TagBuilder';
import TagOutputPanel from '../components/tagging/TagOutputPanel';

/**
 * TaggingStrategyPage Component
 * 
 * Provides a comprehensive UI for building and managing Azure tagging strategies.
 * It integrates the TagBuilder for defining tags (names, requirements, policy effects,
 * and allowed values) and the TagOutputPanel for exporting those definitions as
 * Markdown documentation or Azure Policy JSON.
 */
export default function TaggingStrategyPage() {
    const [tags, setTags] = useState([]);
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);

    return (
        <div className="flex flex-col min-w-0 w-full h-full">
            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-4 sm:px-6 pt-4 sm:pt-6 animate-fade-in flex-1 flex flex-col h-full pb-6">
                <div className="mb-6 shrink-0">
                    <h1 className="text-[22px] md:text-[24px] font-normal text-fluent-fg-primary mb-2">
                        Tagging Strategy Builder
                    </h1>
                    <p className="text-[13px] md:text-[14px] text-fluent-fg-secondary max-w-3xl">
                        Visually define your organizational tagging matrix and automatically generate Azure Policy (JSON) definitions and Markdown documentation.
                    </p>
                </div>

                <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden mb-6 shrink-0">
                    <div
                        className="px-3 py-2.5 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
                        role="button"
                        aria-expanded={isGuidanceExpanded}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsGuidanceExpanded(!isGuidanceExpanded);
                            }
                        }}
                    >
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 flex-shrink-0 text-fluent-brand-fg" />
                                <p className="text-fluent-fg-primary text-[13px]">
                                    How to use this tool
                                </p>
                                {isGuidanceExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-0.5" /> : <ChevronRight className="w-3.5 h-3.5 ml-0.5" />}
                            </div>

                        {isGuidanceExpanded && (
                            <div className="mt-3 flex flex-col gap-3 text-[13px] text-fluent-info-text dark:text-fluent-fg-secondary cursor-default" onClick={(e) => e.stopPropagation()}>
                                <p>
                                    This tool helps define an organizational tagging matrix aligned with <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Cloud Adoption Framework (CAF) resource tagging <ExternalLink className="w-3 h-3 ml-0.5" /></a> conventions.
                                </p>
                                <ul className="list-disc pl-5 ml-2 flex flex-col gap-2">
                                    <li><strong>Build Tags:</strong> Add custom tags and define their requirements (Mandatory/Optional) in the Tag Builder.</li>
                                    <li><strong>Configure Enforcement:</strong> Choose Policy Effects (Audit, Deny, Modify) for each tag to dictate how it's enforced in Azure.</li>
                                    <li><strong>Export Outputs:</strong> Use the right-hand panel to copy Markdown documentation for your wiki or JSON policy definitions for deployment.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                    <div className="w-full lg:w-1/2 flex flex-col min-h-[400px]">
                        <TagBuilder tags={tags} setTags={setTags} />
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col min-h-[400px]">
                        <TagOutputPanel tags={tags} />
                    </div>
                </div>
            </div>
        </div>
    );
}
