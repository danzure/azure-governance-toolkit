import { useState, useRef, useEffect, forwardRef } from 'react';
import { Sparkles, ArrowRight, Loader2, X, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, Lightbulb, ShieldCheck } from 'lucide-react';
import PropTypes from 'prop-types';
import { generateRbacRoleFallback } from '../../utils/rbacAiFallback';

/**
 * RbacPromptBar Component
 * 
 * A natural language input bar that calls the Azure OpenAI backend (or smart fallback)
 * to automatically configure custom Azure RBAC roles based on user intent and least privilege.
 */
const RbacPromptBar = forwardRef(({
    setRoleName,
    setDescription,
    setAssignableScopes,
    setActions,
    setNotActions,
    onResetAll
}, ref) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastResult, setLastResult] = useState(null);
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollRef = useRef(false);
    const checkScroll = () => {
        if (checkScrollRef.current) return;
        checkScrollRef.current = true;
        requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
            }
            checkScrollRef.current = false;
        });
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            setTimeout(checkScroll, 100);
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
            return () => {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            current.scrollTo({
                left: current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
                behavior: 'smooth'
            });
        }
    };

    const handleReset = () => {
        setLastResult(null);
        setError(null);
        if (onResetAll) {
            onResetAll();
        }
    };

    const applyRoleData = (data) => {
        if (data.roleName && setRoleName) setRoleName(data.roleName);
        if (data.description && setDescription) setDescription(data.description);
        if (data.assignableScopes && setAssignableScopes) setAssignableScopes(data.assignableScopes);
        if (Array.isArray(data.actions) && setActions) setActions(data.actions);
        if (Array.isArray(data.notActions) && setNotActions) setNotActions(data.notActions);

        // Store summary for feedback card
        if (data.roleSummary || data.explanation || (data.actions && data.actions.length > 0)) {
            setLastResult({
                name: data.roleName,
                summary: data.roleSummary,
                explanation: data.explanation,
                actionsCount: (data.actions || []).length,
                notActionsCount: (data.notActions || []).length,
                actions: data.actions || [],
                notActions: data.notActions || []
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) return;

        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = import.meta.env.DEV ? 'http://localhost:7071/api/generateRbacRole' : '/api/generateRbacRole';
            
            let data;
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: trimmedPrompt })
                });

                if (response.ok) {
                    data = await response.json();
                } else {
                    // Fall back to client-side heuristic engine if API is unconfigured / unavailable
                    data = generateRbacRoleFallback(trimmedPrompt);
                }
            } catch {
                // Fetch failed (network/offline) - use client-side heuristic engine
                data = generateRbacRoleFallback(trimmedPrompt);
            }

            applyRoleData(data);

            // Clear the input after success
            setPrompt('');
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

        } catch (err) {
            console.error('RBAC AI Generation Error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const presets = [
        "Junior App Service Operator (start/restart apps, no delete or secrets)",
        "Key Vault Secrets Officer (read/write secrets, no vault delete or purge)",
        "AKS Workload Developer (deploy workloads, read metrics, no cluster delete)",
        "Network Traffic Administrator (manage NSGs, route tables & VNet peering)",
        "AI & OpenAI Solutions Engineer (manage models, AI Search, no IAM)",
        "FinOps Billing & Cost Reader (cost analysis, budgets, rate cards, read-only)",
        "Security Incident Responder (Sentinel incident triage & Log Analytics)",
        "Virtual Machine Operator (start/restart/power-off VMs without delete)",
        "Database Operations Engineer (read/write SQL & Cosmos DB, no delete)",
        "Storage Account Operator (manage blob containers and files without account deletion)"
    ];

    return (
        <div className="w-full mb-2 group relative z-30">
            <div className="flex flex-wrap items-center justify-between gap-y-1 mb-1.5 ml-1">
                <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[13px] font-semibold text-fluent-brand-fg uppercase tracking-wider">
                        AI Role Designer
                    </span>
                    <span className="text-[11px] sm:text-[12px] text-fluent-fg-secondary">
                        — AI-generated configurations should be reviewed before deployment.
                    </span>
                </div>
                {onResetAll && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-[12px] flex items-center gap-1.5 text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover font-medium px-2.5 h-[26px] rounded-[4px] transition-all duration-200 ease-in-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50"
                        title="Reset custom role configuration"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset Role
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="relative flex items-center w-full">
                {/* Glow effect behind the bar */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fluent-brand-bg to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500" />
                
                <div className="relative flex items-center w-full h-[50px] bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft focus-within:border-fluent-brand-bg focus-within:ring-2 focus-within:ring-fluent-brand-bg/20 transition-all duration-200 ease-in-out overflow-hidden">
                    
                    <div className="flex items-center justify-center w-12 shrink-0">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 text-fluent-brand-bg animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5 text-fluent-brand-bg" />
                        )}
                    </div>
                    
                    <input
                        ref={ref}
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        placeholder={isLoading ? "Analyzing role permissions & security boundaries..." : "Describe the role duties (e.g. Junior App Service Operator who can restart web apps but cannot delete or read secrets)..."}
                        className="flex-1 h-full bg-transparent min-w-0 !border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none text-[13px] sm:text-[14px] text-fluent-fg-primary placeholder:text-fluent-fg-tertiary disabled:opacity-50 disabled:cursor-not-allowed pr-20"
                    />

                    <div className="absolute right-2 flex items-center gap-1">
                        {prompt && !isLoading && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPrompt('');
                                }}
                                className="flex items-center justify-center w-8 h-8 rounded-[4px] text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle transition-all duration-200 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50"
                                aria-label="Clear Input"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {prompt.trim() && !isLoading && (
                            <button
                                type="submit"
                                className="flex items-center justify-center w-8 h-8 rounded-[4px] bg-fluent-brand-bg text-white hover:bg-fluent-brand-hover shadow-sm transition-all duration-200 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50"
                                aria-label="Generate Custom Role"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </form>
            {error && <p className="text-fluent-state-danger text-[13px] mt-2 ml-2">{error}</p>}

            {/* AI Architecture Resolution Feedback Banner */}
            {lastResult && (
                <div className="mt-3 relative bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle p-3.5 shadow-soft animate-fade-in flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-[4px] bg-fluent-info-bg text-fluent-brand-fg flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[13px] font-semibold text-fluent-fg-primary">
                                    {lastResult.name || lastResult.summary || 'Custom Role Generated'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-cat-green-bg text-fluent-cat-green-fg">
                                        {lastResult.actionsCount} Allowed Actions
                                    </span>
                                    {lastResult.notActionsCount > 0 && (
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-cat-red-bg text-fluent-cat-red-fg">
                                            {lastResult.notActionsCount} Denied (NotActions)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLastResult(null)}
                            className="text-fluent-fg-tertiary hover:text-fluent-fg-primary p-1 rounded hover:bg-fluent-bg-hover transition-colors"
                            aria-label="Dismiss AI Summary"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {lastResult.summary && (
                        <p className="text-[13px] text-fluent-fg-secondary">
                            {lastResult.summary}
                        </p>
                    )}

                    {lastResult.explanation && (
                        <div className="flex items-start gap-2 text-[12px] text-fluent-fg-secondary bg-fluent-bg-subtle px-3 py-2 rounded-[4px] border border-fluent-stroke-subtle">
                            <Lightbulb className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0 mt-0.5" />
                            <span>{lastResult.explanation}</span>
                        </div>
                    )}

                    {lastResult.actions && lastResult.actions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <div className="flex items-center gap-1 text-[11px] font-medium text-fluent-fg-secondary mr-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <span>Key Permissions:</span>
                            </div>
                            {lastResult.actions.slice(0, 5).map((actionName, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-[4px] bg-fluent-bg-subtle text-fluent-fg-primary border border-fluent-stroke-subtle"
                                >
                                    {actionName}
                                </span>
                            ))}
                            {lastResult.actions.length > 5 && (
                                <span className="text-[11px] text-fluent-fg-secondary font-medium">
                                    +{lastResult.actions.length - 5} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Pinned Presets */}
            <div className="mt-3 ml-1 flex items-center w-full gap-2">
                <p className="text-[12px] shrink-0 text-fluent-fg-secondary">Try an AI prompt:</p>
                <div className="flex items-center flex-1 min-w-0 gap-1">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        aria-label="Scroll examples left"
                        aria-hidden={!canScrollLeft}
                        tabIndex={canScrollLeft ? 0 : -1}
                        className={`hidden sm:flex shrink-0 p-0.5 rounded transition-colors text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary ${!canScrollLeft ? 'opacity-0 pointer-events-none w-0 p-0 overflow-hidden' : ''}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="relative flex-1 min-w-0 overflow-hidden">
                        <div 
                            ref={scrollContainerRef}
                            className="flex items-center overflow-x-auto gap-2 py-1 scrollbar-none scroll-smooth" 
                            style={{ 
                                scrollbarWidth: 'none', 
                                msOverflowStyle: 'none',
                                maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 24px, black calc(100% - 24px), ${canScrollRight ? 'transparent' : 'black'} 100%)`,
                                WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 24px, black calc(100% - 24px), ${canScrollRight ? 'transparent' : 'black'} 100%)`
                            }}
                        >
                            {presets.map((preset, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setPrompt(preset)}
                                    className="whitespace-nowrap flex-shrink-0 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-card px-3 py-1 rounded-[4px] shadow-soft transition-all duration-200 ease-in-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        aria-label="Scroll examples right"
                        aria-hidden={!canScrollRight}
                        tabIndex={canScrollRight ? 0 : -1}
                        className={`hidden sm:flex shrink-0 p-0.5 rounded transition-colors text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary ${!canScrollRight ? 'opacity-0 pointer-events-none w-0 p-0 overflow-hidden' : ''}`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
});

RbacPromptBar.propTypes = {
    setRoleName: PropTypes.func.isRequired,
    setDescription: PropTypes.func.isRequired,
    setAssignableScopes: PropTypes.func.isRequired,
    setActions: PropTypes.func.isRequired,
    setNotActions: PropTypes.func.isRequired,
    onResetAll: PropTypes.func
};

RbacPromptBar.displayName = 'RbacPromptBar';

export default RbacPromptBar;
