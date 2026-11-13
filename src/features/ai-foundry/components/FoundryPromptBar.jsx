import { useState, useRef, useEffect, forwardRef, useMemo } from 'react';
import {
    ArrowRight,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Lightbulb,
    Layers,
    Info,
    Square,
    Sliders,
    Copy,
    Check
} from 'lucide-react';
import PropTypes from 'prop-types';
import { ResetButton } from '@shared';
import { useMediaQuery } from '@core/hooks';
import { trackEvent, trackException } from '@core/telemetry';
import { ARCHETYPE_PRESETS } from '../data/archetypes';
import { getFoundryResourceNames } from '../utils/foundryNaming';
import { generateAiFoundryFallback } from '../utils/foundryAiFallback';

const FOUNDRY_LOADING_PHASES = [
    'Analyzing AI workload & compliance posture...',
    'Evaluating Managed VNet & Private Link perimeter...',
    'Synthesizing CAF AI Foundry landing zone...'
];

const FOUNDRY_EXAMPLE_PROMPTS = [
    'Regulated banking AML copilot in West Europe with CMK encryption and GPT-4o',
    'Enterprise RAG customer support hub in UK South with AI Search semantic ranker',
    'Autonomous multi-agent DevOps system in Sweden Central with Container Registry',
    'EU sovereign GDPR analytics zone in Germany West Central with DataZone GPT-4o',
    'LLMOps fine-tuning and evaluation pipeline with ACR, PyPI, and Hugging Face',
    'Fast-track dev sandbox in UK South with GPT-4o mini and public access for PoC'
];

/**
 * FoundryPromptBar Component
 *
 * Unified top AI Copilot & Architecture Console for Azure AI Foundry Designer.
 * Encapsulates the Copilot header with live governance badges, natural-language prompt bar,
 * one-click CAF archetype quick-presets, prompt carousel, and collapsible parameter drawer.
 */
const FoundryPromptBar = forwardRef(({
    config,
    onApplyConfig,
    onSelectArchetype,
    onResetAll,
    activeArchetypeId,
    securitySummary,
    isConfigMinimized = true,
    onToggleMinimize,
    children
}, ref) => {
    const isMobile = useMediaQuery('(max-width: 639px)');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingPhase, setLoadingPhase] = useState(0);
    const [error, setError] = useState(null);
    const [lastResult, setLastResult] = useState(null);
    const [hasRunPrompt, setHasRunPrompt] = useState(false);
    const [copiedHub, setCopiedHub] = useState(false);
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const abortControllerRef = useRef(null);
    const phaseIntervalRef = useRef(null);

    const names = useMemo(() => getFoundryResourceNames(config), [config]);
    const activePreset = useMemo(
        () => ARCHETYPE_PRESETS.find((p) => p.id === activeArchetypeId),
        [activeArchetypeId]
    );
    const archetypeShortLabel = activePreset
        ? activePreset.label.split(' (')[0]
        : 'Custom';
    const archetypeDotClass = activePreset
        ? activePreset.dotColor
        : 'bg-fluent-cat-purple-fg';

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        if (phaseIntervalRef.current) {
            clearInterval(phaseIntervalRef.current);
            phaseIntervalRef.current = null;
        }
        setIsLoading(false);
    };

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
        setPrompt('');
        setLastResult(null);
        setError(null);
        setHasRunPrompt(false);
        if (onResetAll) {
            onResetAll();
        }
    };

    const handleCopyHub = async () => {
        if (!names.hubName) return;
        try {
            await navigator.clipboard.writeText(names.hubName);
            setCopiedHub(true);
            setTimeout(() => setCopiedHub(false), 2000);
        } catch (err) {
            console.error('Failed to copy hub name', err);
        }
    };

    const applySynthesizedResult = (data) => {
        if (!data?.config) return;
        onApplyConfig(data.config);

        const synthesizedNames = getFoundryResourceNames(data.config);
        setLastResult({
            summary: data.summary || 'AI Foundry Landing Zone Synthesized',
            explanation: data.explanation,
            environment: data.config.environment,
            region: data.config.region,
            networkMode: data.config.networkMode,
            modelCount: (data.config.modelDeployments || []).length,
            projectCount: synthesizedNames.projects.length,
            enableCmk: Boolean(data.config.enableCmk),
            hubName: synthesizedNames.hubName,
            projectNames: synthesizedNames.projects.map((p) => p.generatedName)
        });
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (isLoading) return;
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) return;

        setIsLoading(true);
        setLoadingPhase(0);
        setError(null);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const MIN_ANIMATION_MS = 1200;
        const PHASE_INTERVAL_MS = 450;

        phaseIntervalRef.current = setInterval(() => {
            setLoadingPhase((prev) => (prev + 1) % FOUNDRY_LOADING_PHASES.length);
        }, PHASE_INTERVAL_MS);

        const startTime = Date.now();

        try {
            const apiUrl = import.meta.env.DEV ? 'http://localhost:7071/api/generateAiFoundry' : '/api/generateAiFoundry';

            let data;
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: trimmedPrompt }),
                    signal: controller.signal
                });

                if (response.ok) {
                    data = await response.json();
                    trackEvent('AI_Generate_Foundry_Zone', { source: 'api', promptLength: trimmedPrompt.length });
                } else {
                    data = generateAiFoundryFallback(trimmedPrompt);
                    trackEvent('AI_Generate_Foundry_Zone', { source: 'client_fallback', promptLength: trimmedPrompt.length });
                }
            } catch (fetchErr) {
                if (fetchErr.name === 'AbortError' || controller.signal.aborted) {
                    return;
                }
                data = generateAiFoundryFallback(trimmedPrompt);
                trackEvent('AI_Generate_Foundry_Zone', { source: 'client_fallback_network_error', promptLength: trimmedPrompt.length });
            }

            if (controller.signal.aborted) return;

            const elapsed = Date.now() - startTime;
            if (elapsed < MIN_ANIMATION_MS) {
                await new Promise((resolve) => setTimeout(resolve, MIN_ANIMATION_MS - elapsed));
            }

            if (controller.signal.aborted) return;

            applySynthesizedResult(data);
            setHasRunPrompt(true);
            setPrompt('');
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        } catch (err) {
            if (err.name === 'AbortError' || controller.signal.aborted) {
                return;
            }
            console.error('AI Foundry Request Error:', err);
            trackException(err, { component: 'FoundryPromptBar', promptLength: trimmedPrompt.length });
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            if (phaseIntervalRef.current) {
                clearInterval(phaseIntervalRef.current);
                phaseIntervalRef.current = null;
            }
            abortControllerRef.current = null;
            setIsLoading(false);
        }
    };

    const placeholderText = isMobile
        ? 'Describe AI Foundry zone (e.g. EU RAG with CMK)...'
        : 'Describe your AI Foundry landing zone (e.g. Regulated banking RAG in West Europe with CMK, GPT-4o, and Private Link)...';

    const isPrivate = config.networkMode === 'private';

    return (
        <div className={`w-full bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft transition-all duration-300 relative z-30 ${!isConfigMinimized ? 'overflow-visible' : 'overflow-hidden'}`}>
            {/* 1. Unified Console Header */}
            <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 border-b border-fluent-stroke-subtle bg-fluent-bg-card rounded-t-lg">
                {/* Left: Branding & Guidance Hint */}
                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[13px] sm:text-[14px] font-semibold text-fluent-fg-primary tracking-tight">
                            AI Foundry Copilot
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-medium bg-fluent-bg-subtle text-fluent-fg-secondary border border-fluent-stroke-subtle">
                            Powered by OpenAI
                        </span>
                    </div>
                    <div className="hidden 2xl:flex items-center gap-1.5 text-[11.5px] text-fluent-fg-tertiary">
                        <Info className="w-3.5 h-3.5 shrink-0 text-fluent-fg-tertiary" />
                        <span className="truncate">AI-generated landing zones should be reviewed prior to deployment.</span>
                    </div>
                </div>

                {/* Right: Live Governance Badges & Customize Parameters Toggle */}
                <div className="flex items-center justify-end gap-2 flex-wrap ml-auto">
                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px]" title="Workload identifier">
                            <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                            <span className="text-fluent-fg-tertiary">Workload:</span>
                            <span className="font-medium text-fluent-fg-primary font-mono">{config.workload || 'coreai'}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px]" title="Deployment environment">
                            <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-green-fg shrink-0" />
                            <span className="text-fluent-fg-tertiary">Env:</span>
                            <span className="font-medium text-fluent-fg-primary">{config.environment}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px]" title="Azure region">
                            <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-orange-fg shrink-0" />
                            <span className="text-fluent-fg-tertiary">Region:</span>
                            <span className="font-medium text-fluent-fg-primary font-mono">{names.regionAbbrev}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px]" title="Network perimeter mode">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPrivate ? 'bg-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-fg'}`} />
                            <span className="text-fluent-fg-tertiary">Network:</span>
                            <span className="font-medium text-fluent-fg-primary">{isPrivate ? 'Private' : 'Public'}</span>
                        </div>
                        {securitySummary && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px]" title="Microsoft Cloud Security Benchmark compliance">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${securitySummary.allPassed ? 'bg-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-fg'}`} />
                                <span className="text-fluent-fg-tertiary">MCSB:</span>
                                <span className="font-mono font-medium text-fluent-fg-primary">
                                    {securitySummary.passed}/{securitySummary.total}
                                </span>
                            </div>
                        )}
                    </div>

                    {onToggleMinimize && (
                        <button
                            type="button"
                            onClick={onToggleMinimize}
                            className={`ml-auto h-[28px] sm:h-[30px] px-2.5 rounded-[4px] border transition-all duration-200 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium active:scale-95 shrink-0 ${
                                !isConfigMinimized
                                    ? 'bg-fluent-bg-subtle text-fluent-brand-fg border-fluent-stroke-strong shadow-xs'
                                    : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                            }`}
                            title={isConfigMinimized ? 'Customize AI Foundry parameters' : 'Hide AI Foundry parameters'}
                            aria-expanded={!isConfigMinimized}
                        >
                            <Sliders className="w-3.5 h-3.5 text-fluent-brand-fg" />
                            <span>{isConfigMinimized ? 'Customize Parameters' : 'Hide Parameters'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-fluent-fg-tertiary transition-transform duration-200 ${!isConfigMinimized ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Console Body: Mobile Badges, Copilot Input, AI Feedback & Quick Archetypes */}
            <div className="p-3 sm:p-4 flex flex-col gap-3 bg-fluent-bg-card">
                {/* Mobile Parameter Badges */}
                <div className="flex sm:hidden items-center gap-1.5 flex-wrap">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px]">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${archetypeDotClass}`} />
                        <span className="text-fluent-fg-tertiary">Archetype:</span>
                        <span className="font-medium text-fluent-fg-primary">{archetypeShortLabel}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                        <span className="text-fluent-fg-tertiary">Workload:</span>
                        <span className="font-medium text-fluent-fg-primary font-mono">{config.workload || 'coreai'}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-green-fg shrink-0" />
                        <span className="text-fluent-fg-tertiary">Env:</span>
                        <span className="font-medium text-fluent-fg-primary">{config.environment}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-orange-fg shrink-0" />
                        <span className="text-fluent-fg-tertiary">Region:</span>
                        <span className="font-medium text-fluent-fg-primary font-mono">{names.regionAbbrev}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px]">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPrivate ? 'bg-fluent-cat-green-fg' : 'bg-fluent-cat-yellow-fg'}`} />
                        <span className="font-medium text-fluent-fg-primary">{isPrivate ? 'Private' : 'Public'}</span>
                    </div>
                </div>

                {/* Copilot Prompt Form */}
                <form onSubmit={handleSubmit} className="relative w-full" aria-busy={isLoading}>
                    <div
                        className={`p-[1px] rounded-lg transition-all duration-300 ${
                            isLoading
                                ? 'bg-[linear-gradient(90deg,var(--colorCopilotBlue),var(--colorCopilotIris),var(--colorCopilotCyan),var(--colorCopilotBlue))] bg-[length:200%_100%] animate-gemini-flow shadow-depth'
                                : 'bg-fluent-stroke-subtle hover:bg-fluent-stroke-strong focus-within:bg-[linear-gradient(135deg,var(--colorCopilotBlue),var(--colorCopilotIris),var(--colorCopilotCyan))] shadow-soft focus-within:shadow-depth'
                        }`}
                    >
                        <div className="relative flex items-center w-full h-[46px] sm:h-[48px] bg-fluent-bg-card rounded-[7px] px-3 sm:px-3.5 gap-2.5 overflow-hidden">
                            {/* Copilot Sparkle SVG */}
                            <div className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 ${isLoading ? 'animate-sparkle-glow scale-105' : ''}`}>
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <defs>
                                        <linearGradient id="foundryCopilotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="var(--colorCopilotBlue)" />
                                            <stop offset="50%" stopColor="var(--colorCopilotIris)" />
                                            <stop offset="100%" stopColor="var(--colorCopilotCyan)" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"
                                        fill="url(#foundryCopilotGrad)"
                                    />
                                    <path
                                        d="M19 16L20.2 19.3L23.5 20.5L20.2 21.7L19 25L17.8 21.7L14.5 20.5L17.8 19.3L19 16Z"
                                        fill="url(#foundryCopilotGrad)"
                                        opacity="0.85"
                                    />
                                </svg>
                            </div>

                            {isLoading ? (
                                <div
                                    className="flex-1 h-full min-w-0 flex items-center gap-2 sm:gap-2.5 select-none animate-fade-in"
                                    aria-live="polite"
                                >
                                    <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-mono font-medium text-fluent-fg-secondary shrink-0">
                                        {loadingPhase + 1}/{FOUNDRY_LOADING_PHASES.length}
                                    </span>
                                    <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
                                        <span
                                            key={loadingPhase}
                                            className="text-[13px] sm:text-[14px] font-medium text-fluent-fg-primary truncate animate-slide-up"
                                        >
                                            {FOUNDRY_LOADING_PHASES[loadingPhase]}
                                        </span>
                                        {prompt && (
                                            <span className="hidden lg:inline-block text-[12px] text-fluent-fg-tertiary truncate max-w-[260px] italic">
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
                                    placeholder={placeholderText}
                                    title="Describe your AI Foundry landing zone"
                                    aria-label="Describe your AI Foundry landing zone"
                                    className="flex-1 h-full bg-transparent min-w-0 !border-0 !outline-none !ring-0 !shadow-none text-[13px] sm:text-[14px] text-fluent-fg-primary placeholder:text-fluent-fg-tertiary"
                                />
                            )}

                            {/* Right-Hand Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                {isLoading ? (
                                    <button
                                        type="button"
                                        onClick={handleStop}
                                        className="h-[28px] sm:h-[30px] px-2.5 rounded-[6px] flex items-center justify-center gap-1.5 bg-fluent-bg-subtle hover:bg-fluent-bg-hover text-fluent-fg-primary border border-fluent-stroke-subtle active:scale-95 transition-all duration-150 shadow-sm cursor-pointer select-none"
                                        title="Stop generation"
                                        aria-label="Stop generation"
                                    >
                                        <Square className="w-2.5 h-2.5 fill-current text-fluent-fg-primary shrink-0" />
                                        <span className="text-[12px] font-medium">Stop</span>
                                    </button>
                                ) : (
                                    <>
                                        {prompt && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPrompt('');
                                                }}
                                                className="flex items-center justify-center w-7 h-7 rounded-[4px] text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover active:bg-fluent-bg-subtle transition-all duration-200 active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg shrink-0"
                                                title="Clear prompt"
                                                aria-label="Clear prompt"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}

                                        {prompt && hasRunPrompt && onResetAll && (
                                            <div className="w-[1px] h-4 bg-fluent-stroke-subtle shrink-0 mx-0.5" />
                                        )}

                                        {hasRunPrompt && onResetAll && (
                                            <ResetButton
                                                variant="ghost"
                                                onClick={handleReset}
                                                title="Reset AI Foundry landing zone"
                                                ariaLabel="Reset AI Foundry landing zone"
                                                className="h-[28px] sm:h-[30px] px-2 sm:px-2.5 text-[12px] animate-fade-in"
                                            >
                                                <span className="hidden sm:inline">Reset Zone</span>
                                            </ResetButton>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={!prompt.trim()}
                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[6px] flex items-center justify-center transition-all duration-200 active:scale-95 touch-manipulation shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg ${
                                                prompt.trim()
                                                    ? 'bg-fluent-brand-bg text-white hover:bg-fluent-brand-hover shadow-sm cursor-pointer'
                                                    : 'text-fluent-fg-tertiary bg-fluent-bg-subtle border border-fluent-stroke-subtle cursor-not-allowed opacity-50'
                                            }`}
                                            title={prompt.trim() ? 'Synthesize AI Foundry Landing Zone' : 'Describe your AI Foundry requirements'}
                                            aria-label="Synthesize AI Foundry Landing Zone"
                                        >
                                            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Indeterminate Copilot Stream */}
                            {isLoading && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-fluent-bg-subtle overflow-hidden pointer-events-none">
                                    <div className="h-full w-full bg-[linear-gradient(90deg,transparent_0%,var(--colorCopilotBlue)_25%,var(--colorCopilotIris)_50%,var(--colorCopilotCyan)_75%,transparent_100%)] animate-stream-ltr" />
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                {error && <p className="text-fluent-state-danger text-[13px] mt-1 ml-1">{error}</p>}

                {/* AI Resolution Feedback Banner */}
                {lastResult && (
                    <div className="relative bg-fluent-bg-subtle rounded-lg border border-fluent-stroke-subtle p-3 sm:p-3.5 shadow-xs animate-fade-in flex flex-col gap-2.5">
                        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                            <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                                <div className="w-6 h-6 rounded-[4px] bg-fluent-info-bg text-fluent-brand-fg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                                    <span className="text-[13px] font-semibold text-fluent-fg-primary leading-snug">
                                        {lastResult.summary}
                                    </span>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-cat-blue-bg text-fluent-cat-blue-fg uppercase">
                                            {lastResult.environment}
                                        </span>
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-bg-card text-fluent-fg-secondary border border-fluent-stroke-subtle">
                                            {lastResult.region}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[11px] font-medium rounded-[4px] ${
                                            lastResult.networkMode === 'private'
                                                ? 'bg-fluent-cat-green-bg text-fluent-cat-green-fg'
                                                : 'bg-fluent-cat-yellow-bg text-fluent-cat-yellow-fg'
                                        }`}>
                                            {lastResult.networkMode === 'private' ? 'Zero-Trust Private' : 'Public Access'}
                                        </span>
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-bg-card text-fluent-fg-secondary border border-fluent-stroke-subtle">
                                            {lastResult.modelCount} {lastResult.modelCount === 1 ? 'Model' : 'Models'}
                                        </span>
                                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-bg-card text-fluent-fg-secondary border border-fluent-stroke-subtle">
                                            {lastResult.projectCount} {lastResult.projectCount === 1 ? 'Project' : 'Projects'}
                                        </span>
                                        {lastResult.enableCmk && (
                                            <span className="px-2 py-0.5 text-[11px] font-medium rounded-[4px] bg-fluent-cat-purple-bg text-fluent-cat-purple-fg">
                                                CMK HSM
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
                            <div className="flex items-start gap-2 text-[12px] text-fluent-fg-secondary bg-fluent-bg-card px-3 py-2 rounded-[4px] border border-fluent-stroke-subtle">
                                <Lightbulb className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0 mt-0.5" />
                                <span>{lastResult.explanation}</span>
                            </div>
                        )}

                        {lastResult.hubName && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                <div className="flex items-center gap-1 text-[11px] font-medium text-fluent-fg-secondary mr-1">
                                    <Layers className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                    <span>Provisioned CAF Topology:</span>
                                </div>
                                <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded-[4px] bg-fluent-bg-card text-fluent-fg-primary border border-fluent-stroke-subtle">
                                    {lastResult.hubName}
                                </span>
                                {lastResult.projectNames.map((projName) => (
                                    <span
                                        key={projName}
                                        className="px-2 py-0.5 text-[11px] font-mono rounded-[4px] bg-fluent-bg-card text-fluent-fg-secondary border border-fluent-stroke-subtle"
                                    >
                                        {projName}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Compact CAF Archetype Quick-Preset Strip */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11.5px] font-medium text-fluent-fg-tertiary mr-1 shrink-0">
                        CAF Archetypes:
                    </span>
                    {ARCHETYPE_PRESETS.map((preset) => {
                        const isActive = activeArchetypeId === preset.id;
                        const shortTitle = preset.label.split(' (')[0];
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => onSelectArchetype(preset)}
                                title={`${preset.label} — Best for: ${preset.bestFor}`}
                                className={`px-2.5 h-[28px] rounded-[4px] text-[12px] font-medium border transition-all duration-150 inline-flex items-center gap-1.5 active:scale-95 ${
                                    isActive
                                        ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text font-semibold shadow-xs'
                                        : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary hover:bg-fluent-bg-hover'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${preset.dotColor}`} />
                                <span>{shortTitle}</span>
                                {isActive && <Check className="w-3 h-3 text-fluent-brand-fg shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. Docked Bottom Shelf (Prompt Examples Carousel & Live Hub Name Badge) */}
            <div className={`px-3 sm:px-4 py-2 border-t border-fluent-stroke-subtle bg-fluent-bg-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${isConfigMinimized || !children ? 'rounded-b-lg' : ''}`}>
                <div className="flex items-center flex-1 min-w-0 gap-1.5">
                    <span className="text-[12px] font-medium text-fluent-fg-secondary flex items-center gap-1.5 shrink-0">
                        <Lightbulb className="w-3.5 h-3.5 text-fluent-brand-fg" />
                        <span>Try an AI prompt:</span>
                    </span>

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
                            className="flex items-center overflow-x-auto gap-1.5 py-0.5 px-0.5 scrollbar-none scroll-smooth touch-pan-x overscroll-x-contain"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 16px, black calc(100% - 16px), ${canScrollRight ? 'transparent' : 'black'} 100%)`,
                                WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 16px, black calc(100% - 16px), ${canScrollRight ? 'transparent' : 'black'} 100%)`
                            }}
                        >
                            {FOUNDRY_EXAMPLE_PROMPTS.map((example, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setPrompt(example)}
                                    className="whitespace-nowrap flex-shrink-0 text-left text-[11.5px] bg-fluent-bg-card border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg px-2.5 py-1 min-h-[26px] rounded-[4px] shadow-xs transition-all duration-150 active:scale-[0.97] touch-manipulation select-none disabled:opacity-50"
                                >
                                    {example}
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

                {/* Right: Live Canonical Hub Name Badge */}
                {names.hubName && (
                    <div className="hidden lg:flex items-center gap-1.5 shrink-0 pl-2 border-l border-fluent-stroke-subtle">
                        <span className="text-[11px] text-fluent-fg-tertiary">Hub:</span>
                        <span
                            className="font-mono text-[11px] text-fluent-fg-primary px-2 py-0.5 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle select-all"
                            title="Canonical CAF AI Foundry Hub name"
                        >
                            {names.hubName}
                        </span>
                        <button
                            type="button"
                            onClick={handleCopyHub}
                            title="Copy canonical Hub name"
                            aria-label="Copy canonical Hub name"
                            className="p-1 rounded-[4px] text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors active:scale-95"
                        >
                            {copiedHub ? (
                                <Check className="w-3 h-3 text-fluent-cat-green-fg" />
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* 4. In-Card Parameter Drawer */}
            {children && (
                <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                        !isConfigMinimized ? 'grid-rows-[1fr] border-t border-fluent-stroke-subtle' : 'grid-rows-[0fr]'
                    }`}
                >
                    <div className={`${!isConfigMinimized ? 'overflow-visible' : 'overflow-hidden'} min-h-0 rounded-b-lg`}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
});

FoundryPromptBar.propTypes = {
    config: PropTypes.object.isRequired,
    onApplyConfig: PropTypes.func.isRequired,
    onSelectArchetype: PropTypes.func.isRequired,
    onResetAll: PropTypes.func,
    activeArchetypeId: PropTypes.string,
    securitySummary: PropTypes.shape({
        passed: PropTypes.number,
        total: PropTypes.number,
        failingCount: PropTypes.number,
        allPassed: PropTypes.bool
    }),
    isConfigMinimized: PropTypes.bool,
    onToggleMinimize: PropTypes.func,
    children: PropTypes.node
};

FoundryPromptBar.displayName = 'FoundryPromptBar';

export default FoundryPromptBar;
