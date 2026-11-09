import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { validateSecurity } from '../utils/securityValidator';
import { ShieldCheck, AlertTriangle, Check } from 'lucide-react';

function FoundrySecurityChecklist({ config, onRemediateRule }) {
    const checks = useMemo(() => validateSecurity(config), [config]);
    const passCount = checks.filter(c => c.passed).length;
    const allPassed = passCount === checks.length;

    return (
        <div className="w-full flex-1 h-full flex flex-col animate-fade-in">
            {/* Sub-Header Bar */}
            <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-fluent-stroke-subtle bg-fluent-bg-canvas shrink-0">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">
                        Microsoft Cloud Security Benchmark (MCSB) Audit
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold border ${
                        allPassed
                            ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                            : 'bg-fluent-bg-subtle border-fluent-stroke-subtle text-fluent-cat-yellow-fg'
                    }`}>
                        {allPassed ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{passCount} of {checks.length} Controls Met</span>
                    </span>
                </div>
            </div>

            {/* Audit Cards Container */}
            <div className="p-4 flex-1 flex flex-col gap-2.5 bg-fluent-bg-card">
                {checks.map((check) => {
                    const severityDot = check.severity === 'critical'
                        ? 'bg-fluent-cat-red-fg'
                        : check.severity === 'high'
                            ? 'bg-fluent-cat-orange-fg'
                            : 'bg-fluent-cat-blue-fg';

                    return (
                        <div
                            key={check.id}
                            className={`p-3.5 rounded-[4px] border border-fluent-stroke-subtle border-l-[3px] transition-all flex items-start gap-3 bg-fluent-bg-card shadow-soft ${
                                check.passed 
                                    ? 'border-l-fluent-cat-green-fg' 
                                    : 'border-l-fluent-cat-yellow-fg'
                            }`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 border ${
                                check.passed
                                    ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                    : 'bg-fluent-bg-subtle border-fluent-stroke-subtle text-fluent-cat-yellow-fg'
                            }`}>
                                {check.passed ? (
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                ) : (
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                )}
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded-[3px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary shrink-0">
                                            {check.id}
                                        </span>
                                        <span className="text-[13px] font-semibold text-fluent-fg-primary">
                                            {check.title}
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] uppercase font-semibold tracking-wider text-fluent-fg-secondary shrink-0">
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${severityDot}`} />
                                        <span>{check.severity}</span>
                                    </span>
                                </div>
                                <span className="text-[12px] text-fluent-fg-secondary leading-relaxed">
                                    {check.description}
                                </span>
                                {!check.passed && (
                                    <div className="mt-1 px-2.5 py-1.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-wrap items-center justify-between gap-2 text-[12px] font-medium text-fluent-cat-yellow-fg">
                                        <div className="inline-flex items-center gap-2 min-w-0">
                                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                            <span>Recommendation: Enable this control to satisfy Zero-Trust landing zone compliance.</span>
                                        </div>
                                        {onRemediateRule && (
                                            <button
                                                type="button"
                                                onClick={() => onRemediateRule(check.id)}
                                                className="shrink-0 h-[26px] px-2.5 bg-fluent-brand-bg text-white rounded-[4px] text-[12px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 active:scale-95"
                                            >
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                <span>Apply Fix</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

FoundrySecurityChecklist.propTypes = {
    config: PropTypes.object.isRequired,
    onRemediateRule: PropTypes.func
};

export default memo(FoundrySecurityChecklist);
