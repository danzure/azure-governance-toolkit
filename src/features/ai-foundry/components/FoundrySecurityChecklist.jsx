import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { validateSecurity } from '../utils/securityValidator';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

function FoundrySecurityChecklist({ config }) {
    const checks = useMemo(() => validateSecurity(config), [config]);
    const passCount = checks.filter(c => c.passed).length;
    const allPassed = passCount === checks.length;

    return (
        <div className="w-full flex-1 h-full flex flex-col gap-3 p-4 bg-fluent-bg-canvas rounded-lg border border-fluent-stroke-subtle animate-fade-in">
            <div className="flex items-center justify-between border-b border-fluent-stroke-subtle pb-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-fluent-brand-fg" />
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">
                        Microsoft Cloud Security Benchmark (MCSB) Audit
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold border ${
                        allPassed
                            ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                            : 'bg-fluent-cat-yellow-bg border-fluent-stroke-subtle text-fluent-cat-yellow-fg'
                    }`}>
                        {allPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{passCount} of {checks.length} Controls Met</span>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
                {checks.map((check) => (
                    <div
                        key={check.id}
                        className={`p-3 rounded-lg border transition-all flex items-start gap-3 bg-fluent-bg-card ${
                            check.passed 
                                ? 'border-fluent-stroke-subtle' 
                                : 'border-fluent-cat-yellow-fg/40'
                        }`}
                    >
                        <div className="mt-0.5 shrink-0">
                            {check.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-fluent-cat-green-fg" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-fluent-cat-yellow-fg" />
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono font-bold text-fluent-fg-tertiary">{check.id}</span>
                                    <span className="text-[13px] font-semibold text-fluent-fg-primary">{check.title}</span>
                                </div>
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                                    check.severity === 'critical' ? 'bg-fluent-cat-red-bg text-fluent-cat-red-fg' :
                                    check.severity === 'high' ? 'bg-fluent-cat-orange-bg text-fluent-cat-orange-fg' :
                                    'bg-fluent-bg-subtle text-fluent-fg-tertiary'
                                }`}>
                                    {check.severity}
                                </span>
                            </div>
                            <span className="text-[12px] text-fluent-fg-secondary">
                                {check.description}
                            </span>
                            {!check.passed && (
                                <div className="mt-1 text-[11px] font-medium text-fluent-cat-yellow-fg">
                                    ⚠️ Recommendation: Enable this control in the configurator to satisfy enterprise Zero-Trust landing zone compliance.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

FoundrySecurityChecklist.propTypes = {
    config: PropTypes.object.isRequired
};

export default memo(FoundrySecurityChecklist);
