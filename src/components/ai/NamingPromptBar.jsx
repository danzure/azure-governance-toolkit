import { useState, useRef, useEffect, forwardRef } from 'react';
import { Sparkles, ArrowRight, X, ChevronLeft, ChevronRight, CheckCircle2, Lightbulb, Layers, Info } from 'lucide-react';
import PropTypes from 'prop-types';
import ResetButton from '../shared/ResetButton';
import { generateResourceNameFallback } from '../../utils/namingAiFallback';
import { trackEvent, trackException } from '../../utils/telemetry';

/**
 * NamingPromptBar Component
 * 
 * A natural language input bar that calls the Azure OpenAI backend (or smart fallback)
 * to automatically generate Resource Naming configurations based on user intent.
 */
const NAMING_LOADING_PHASES = [
    'Analyzing architecture & intent...',
    'Matching Cloud Adoption Framework patterns...',
    'Synthesizing resource naming configuration...'
];

const NamingPromptBar = forwardRef(({
    setWorkload,
    setEnvValue,
    setRegionValue,
    setSearchTerm,
    setOrgPrefix,
    setShowOrg,
    setInstance,
    setActiveCategory,
    onResetAll
}, ref) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingPhase, setLoadingPhase] = useState(0);
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

    const applyNamingData = (data) => {
        // Apply the AI configuration to the parent state
        if (data.workload !== undefined && setWorkload) setWorkload(data.workload);
        if (data.envValue && setEnvValue) setEnvValue(data.envValue);
        if (data.regionValue && setRegionValue) setRegionValue(data.regionValue);
        if (data.searchTerm && setSearchTerm) setSearchTerm(data.searchTerm);
        
        if (setOrgPrefix && data.orgPrefix !== undefined) {
            setOrgPrefix(data.orgPrefix);
            if (setShowOrg) {
                setShowOrg(Boolean(data.orgPrefix));
            }
        }

        if (setInstance && data.instance) {
            setInstance(data.instance);
        }
        
        // Clear any active filters so the results are visible
        if (setActiveCategory) setActiveCategory('All');

        // Store summary for feedback card
        if (data.architectureSummary || data.explanation || data.searchTerm) {
            const resourceList = (data.searchTerm || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);

            setLastResult({
                summary: data.architectureSummary,
                explanation: data.explanation,
                resources: resourceList,
                workload: data.workload,
                env: data.envValue,
                region: data.regionValue,
                instance: data.instance,
                orgPrefix: data.orgPrefix
            });
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (isLoading) return;
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) return;

        setIsLoading(true);
        setLoadingPhase(0);
        setError(null);

        const MIN_ANIMATION_MS = 1400; // Pacing duration to allow animation to breathe gracefully
        const PHASE_INTERVAL_MS = 480; // Interval for cycling through reasoning phases

        const phaseInterval = setInterval(() => {
            setLoadingPhase((prev) => (prev + 1) % NAMING_LOADING_PHASES.length);
        }, PHASE_INTERVAL_MS);

        const startTime = Date.now();

        try {
            const apiUrl = import.meta.env.DEV ? 'http://localhost:7071/api/generateResourceName' : '/api/generateResourceName';
            
            let data;
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: trimmedPrompt })
                });

                if (response.ok) {
                    data = await response.json();
                    trackEvent('AI_Generate_Resource_Name', { source: 'api', promptLength: trimmedPrompt.length });
                } else {
                    // Fall back to client-side heuristic engine if API is unconfigured / unavailable
                    data = generateResourceNameFallback(trimmedPrompt);
                    trackEvent('AI_Generate_Resource_Name', { source: 'client_fallback', promptLength: trimmedPrompt.length });
                }
            } catch {
                // Fetch failed (network error/port 7071 offline) - use client-side heuristic engine
                data = generateResourceNameFallback(trimmedPrompt);
                trackEvent('AI_Generate_Resource_Name', { source: 'client_fallback_network_error', promptLength: trimmedPrompt.length });
            }

            // Ensure smooth, perceptible processing animation with relaxed pacing
            const elapsed = Date.now() - startTime;
            if (elapsed < MIN_ANIMATION_MS) {
                await new Promise((resolve) => setTimeout(resolve, MIN_ANIMATION_MS - elapsed));
            }

            applyNamingData(data);

            // Clear the input after success
            setPrompt('');
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

        } catch (err) {
            console.error('AI Request Error:', err);
            trackException(err, { component: 'NamingPromptBar', promptLength: trimmedPrompt.length });
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            clearInterval(phaseInterval);
            setIsLoading(false);
        }
    };

    const presets = [
        "Secure Enterprise RAG pattern with OpenAI and AI Search in UK South",
        "Real-time IoT data pipeline using Event Hubs and Stream Analytics",
        "Mission-critical AKS microservices with geo-replication in West Europe",
        "Zero-trust Hub and Spoke networking topology with Azure Firewall",
        "Dev/Test environment for Spring Boot application with PostgreSQL",
        "Modern Data Warehouse with Azure Databricks and Data Lake Storage",
        "Serverless event-driven processing with Azure Functions and Cosmos DB",
        "Machine Learning Operations (MLOps) workspace with compute clusters",
        "Global disaster recovery setup with Traffic Manager and App Service",
        "Highly available E-Commerce platform for Contoso Retail"
    ];

    return (
        <div className="w-full mb-2 relative z-30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2 ml-0.5 sm:ml-1">
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] sm:text-[14px] font-semibold text-fluent-brand-fg">
                            Architecture Copilot
                        </span>
                        <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-fluent-fg-secondary">
                            <Info className="w-3.5 h-3.5 text-fluent-fg-tertiary shrink-0" />
                            <span>AI-generated suggestions should be reviewed prior to deployment.</span>
                        </div>
                    </div>
                    {onResetAll && (
                        <ResetButton
                            onClick={handleReset}
                            title="Reset naming configuration"
                            className="sm:hidden"
                        >
                            Reset All
                        </ResetButton>
                    )}
                </div>
                <div className="flex sm:hidden items-center gap-1.5 text-[11px] text-fluent-fg-secondary leading-tight">
                    <Info className="w-3 h-3 text-fluent-fg-tertiary shrink-0" />
                    <span>AI-generated suggestions should be reviewed prior to deployment.</span>
                </div>
                {onResetAll && (
                    <ResetButton
                        onClick={handleReset}
                        title="Reset naming configuration"
                        className="hidden sm:inline-flex"
                    >
                        Reset All
                    </ResetButton>
                )}
            </div>
            <form onSubmit={handleSubmit} className="relative flex items-center w-full group" aria-busy={isLoading}>
                {/* Luminous aura behind the bar */}
                <div
                    className={`absolute -inset-0.5 bg-copilot-aura-gradient rounded-lg blur-md transition-all duration-500 ease-in-out ${
                        isLoading
                            ? 'opacity-80 bg-[length:200%_200%] animate-copilot-aura'
                            : 'opacity-20 group-hover:opacity-35'
                    }`}
                />
                
                <div
                    className={`relative flex items-center w-full h-[50px] sm:h-[52px] bg-fluent-bg-card rounded-lg border shadow-soft transition-all duration-300 ease-in-out overflow-hidden ${
                        isLoading
                            ? 'border-fluent-brand-bg shadow-depth ring-1 ring-fluent-brand-bg/30'
                            : 'border-fluent-stroke-subtle focus-within:border-fluent-brand-bg'
                    }`}
                >
                    {/* Animated Sparkles Hero Icon */}
                    <div className="relative flex items-center justify-center w-10 sm:w-12 shrink-0">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-7 h-7 rounded-full bg-fluent-info-bg animate-pulse-slow opacity-80" />
                                <div className="absolute w-5 h-5 rounded-full bg-fluent-brand-bg/20 animate-ping-slow pointer-events-none" />
                            </div>
                        )}
                        <Sparkles
                            className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                                isLoading
                                    ? 'text-fluent-brand-fg animate-sparkle-twinkle drop-shadow-[0_0_10px_rgba(15,108,189,0.5)] dark:drop-shadow-[0_0_12px_rgba(31,158,255,0.8)]'
                                    : 'text-fluent-brand-bg'
                            }`}
                        />
                    </div>
                    
                    {/* Active Processing Dynamic Canvas vs Text Input */}
                    {isLoading ? (
                        <div
                            className="flex-1 h-full min-w-0 flex items-center gap-2.5 pr-[84px] sm:pr-28 select-none animate-fade-in"
                            aria-live="polite"
                        >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-[13px] sm:text-[14px] font-medium bg-gradient-to-r from-fluent-brand-fg via-purple-500 to-cyan-500 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer-text truncate">
                                    {NAMING_LOADING_PHASES[loadingPhase]}
                                </span>
                                {prompt && (
                                    <span className="hidden md:inline-block text-[12px] text-fluent-fg-tertiary truncate max-w-[280px] italic">
                                        “{prompt}”
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <input
                            ref={ref}
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            readOnly={isLoading}
                            placeholder="Describe your cloud architecture (e.g. Production Web App with Azure SQL in West Europe for Contoso)..."
                            className="flex-1 h-full bg-transparent min-w-0 !border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none text-[13px] sm:text-[14px] text-fluent-fg-primary placeholder:text-fluent-fg-tertiary transition-opacity duration-200 pr-[76px] sm:pr-20"
                        />
                    )}

                    {/* Right-hand actions */}
                    <div className="absolute right-1.5 sm:right-2 flex items-center gap-1.5">
                        {isLoading ? (
                            <div
                                className="flex items-center gap-1.5 px-2 sm:px-2.5 h-[30px] rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-brand-fg select-none shadow-sm transition-all duration-200"
                                title="AI Copilot is processing your request..."
                                aria-label="AI Copilot is processing your request"
                            >
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-brand-fg animate-thinking-dot [animation-delay:0ms]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-brand-fg animate-thinking-dot [animation-delay:180ms]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-brand-fg animate-thinking-dot [animation-delay:360ms]" />
                                </span>
                                <span className="hidden sm:inline text-[11px] font-medium tracking-wide uppercase text-fluent-brand-fg">
                                    Thinking
                                </span>
                            </div>
                        ) : (
                            <>
                                {prompt && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPrompt('');
                                        }}
                                        className="flex items-center justify-center w-8 h-8 rounded-[4px] text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle transition-all duration-200 ease-in-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                                        aria-label="Clear Input"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}

                                {prompt.trim() && (
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center w-8 h-8 rounded-[4px] bg-fluent-brand-bg text-white hover:bg-fluent-brand-hover shadow-sm transition-all duration-200 ease-in-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                                        aria-label="Generate Configuration"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Indeterminate Fluent Progress Stream */}
                    {isLoading && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-fluent-bg-subtle overflow-hidden pointer-events-none">
                            <div className="h-full w-2/3 bg-copilot-stream-gradient animate-copilot-stream shadow-[0_0_8px_rgba(15,108,189,0.5)] dark:shadow-[0_0_8px_rgba(31,158,255,0.7)]" />
                        </div>
                    )}
                </div>
            </form>
            {error && <p className="text-fluent-state-danger text-[13px] mt-2 ml-2">{error}</p>}

            {/* AI Architecture Resolution Feedback Banner */}
            {lastResult && (
                <div className="mt-3 relative bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle p-3 sm:p-3.5 shadow-soft animate-fade-in flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                        <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                            <div className="w-6 h-6 rounded-[4px] bg-fluent-info-bg text-fluent-brand-fg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                                <span className="text-[13px] font-semibold text-fluent-fg-primary leading-snug">
                                    {lastResult.summary || 'Architecture Configuration Applied'}
                                </span>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {lastResult.env && (
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-cat-blue-bg text-fluent-cat-blue-fg uppercase">
                                            {lastResult.env}
                                        </span>
                                    )}
                                    {lastResult.region && (
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-bg-subtle text-fluent-fg-secondary border border-fluent-stroke-subtle">
                                            {lastResult.region}
                                        </span>
                                    )}
                                    {lastResult.workload && (
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-info-bg text-fluent-info-text border border-fluent-info-border">
                                            {lastResult.workload}
                                        </span>
                                    )}
                                    {lastResult.instance && (
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-bg-subtle text-fluent-fg-secondary border border-fluent-stroke-subtle">
                                            #{lastResult.instance}
                                        </span>
                                    )}
                                    {lastResult.orgPrefix && (
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-bg-subtle text-fluent-fg-secondary border border-fluent-stroke-subtle">
                                            Org: {lastResult.orgPrefix}
                                        </span>
                                    )}
                                    {lastResult.resources && lastResult.resources.length > 0 && (
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-cat-green-bg text-fluent-cat-green-fg">
                                            {lastResult.resources.length} Services Matched
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLastResult(null)}
                            className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-fluent-fg-tertiary hover:text-fluent-fg-primary rounded-[4px] hover:bg-fluent-bg-hover transition-colors touch-manipulation shrink-0"
                            aria-label="Dismiss AI Summary"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {lastResult.explanation && (
                        <div className="flex items-start gap-2 text-[12px] text-fluent-fg-secondary bg-fluent-bg-subtle px-3 py-2 rounded-[4px] border border-fluent-stroke-subtle">
                            <Lightbulb className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0 mt-0.5" />
                            <span>{lastResult.explanation}</span>
                        </div>
                    )}

                    {lastResult.resources && lastResult.resources.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <div className="flex items-center gap-1 text-[11px] font-medium text-fluent-fg-secondary mr-1">
                                <Layers className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <span>Matched Services:</span>
                            </div>
                            {lastResult.resources.slice(0, 5).map((resName, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-bg-subtle text-fluent-fg-primary border border-fluent-stroke-subtle"
                                >
                                    {resName}
                                </span>
                            ))}
                            {lastResult.resources.length > 5 && (
                                <span className="text-[11px] text-fluent-fg-secondary font-medium">
                                    +{lastResult.resources.length - 5} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Pinned Presets */}
            <div className="mt-2.5 sm:mt-3 ml-0.5 sm:ml-1 flex flex-col sm:flex-row sm:items-center w-full gap-1.5 sm:gap-2">
                <div className="flex items-center justify-between shrink-0">
                    <span className="text-[12px] font-medium sm:font-normal text-fluent-fg-secondary flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-fluent-brand-fg sm:hidden" />
                        Try an example:
                    </span>
                    <span className="sm:hidden text-[11px] text-fluent-fg-tertiary">
                        Swipe presets →
                    </span>
                </div>

                <div className="flex items-center flex-1 min-w-0 gap-1">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        aria-label="Scroll examples left"
                        aria-hidden={!canScrollLeft}
                        tabIndex={canScrollLeft ? 0 : -1}
                        className={`hidden sm:flex shrink-0 p-1 rounded transition-colors text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary ${!canScrollLeft ? 'opacity-0 pointer-events-none w-0 p-0 overflow-hidden' : ''}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="relative flex-1 min-w-0 overflow-hidden py-0.5">
                        <div 
                            ref={scrollContainerRef}
                            className="flex items-center overflow-x-auto gap-2 py-1 px-0.5 scrollbar-none scroll-smooth touch-pan-x overscroll-x-contain" 
                            style={{ 
                                scrollbarWidth: 'none', 
                                msOverflowStyle: 'none',
                                maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 20px, black calc(100% - 20px), ${canScrollRight ? 'transparent' : 'black'} 100%)`,
                                WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 20px, black calc(100% - 20px), ${canScrollRight ? 'transparent' : 'black'} 100%)`
                            }}
                        >
                            {presets.map((preset, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setPrompt(preset)}
                                    className="whitespace-nowrap flex-shrink-0 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-card px-3 py-1.5 sm:py-1 min-h-[32px] sm:min-h-[26px] rounded-[6px] sm:rounded-[4px] shadow-soft transition-all duration-200 ease-in-out active:scale-[0.97] touch-manipulation select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg disabled:opacity-50 disabled:pointer-events-none"
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
                        className={`hidden sm:flex shrink-0 p-1 rounded transition-colors text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary ${!canScrollRight ? 'opacity-0 pointer-events-none w-0 p-0 overflow-hidden' : ''}`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
});

NamingPromptBar.propTypes = {
    setWorkload: PropTypes.func.isRequired,
    setEnvValue: PropTypes.func.isRequired,
    setRegionValue: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    setOrgPrefix: PropTypes.func,
    setShowOrg: PropTypes.func,
    setInstance: PropTypes.func,
    setActiveCategory: PropTypes.func,
    onResetAll: PropTypes.func
};

NamingPromptBar.displayName = 'NamingPromptBar';

export default NamingPromptBar;
