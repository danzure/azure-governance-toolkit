import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

export default function RoleExportPanel({ roleName, description, assignableScopes, actions, notActions }) {
    const [copied, setCopied] = useState(false);

    const generatedJson = useMemo(() => {
        const payload = {
            Name: roleName || "Custom Role Name",
            IsCustom: true,
            Description: description || "Custom role description",
            Actions: actions.length > 0 ? actions : [],
            NotActions: notActions.length > 0 ? notActions : [],
            DataActions: [],
            NotDataActions: [],
            AssignableScopes: assignableScopes.length > 0 ? assignableScopes : ["/"]
        };
        return JSON.stringify(payload, null, 2);
    }, [roleName, description, assignableScopes, actions, notActions]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(generatedJson);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }, [generatedJson]);

    return (
        <div className="flex flex-col border border-fluent-stroke-subtle rounded-lg bg-fluent-bg-card shadow-soft overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-fluent-stroke-subtle bg-fluent-bg-subtle">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-fluent-brand-fg" />
                    <h3 className="text-[14px] font-semibold text-fluent-fg-primary">Azure Custom Role JSON</h3>
                </div>
                
                <button
                    onClick={handleCopy}
                    className={`px-3 h-[32px] rounded-[4px] text-[13px] font-medium transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-1.5 border active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 ${copied 
                        ? 'bg-[#f1faf1] dark:bg-[#1b2b1b] border-[#c6ebc9] dark:border-[#1e4620] text-[#107c10] dark:text-[#a3d4a3]' 
                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary'}`}
                    title="Copy JSON"
                >
                    {copied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
            </div>
            
            <div className="bg-[#1E1E1E] w-full relative">
                <pre className="text-[13px] leading-relaxed font-mono overflow-auto p-5 text-[#D4D4D4] m-0 h-[400px]">
                    <code>{generatedJson}</code>
                </pre>
            </div>
        </div>
    );
}
