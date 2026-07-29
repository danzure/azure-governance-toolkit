import { useState, useRef, useEffect, forwardRef } from 'react';
import { Sparkles, ArrowRight, Loader2, X, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * PromptBar Component
 * 
 * A premium natural language input bar that calls the Azure OpenAI backend
 * to automatically generate Resource Naming configurations based on user intent.
 */
const PromptBar = forwardRef(({ setWorkload, setEnvValue, setRegionValue, setSearchTerm, setActiveCategory, onResetAll }, ref) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            // Note: In development with swa-cli or when deployed, /api routes to our Azure Functions
            // If running Vite and Functions separately without a proxy, we need the full localhost URL.
            // For this setup, we assume Vite proxy or absolute URL for local dev.
            const apiUrl = import.meta.env.DEV ? 'http://localhost:7071/api/generateResourceName' : '/api/generateResourceName';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt.trim() })
            });

            if (!response.ok) {
                throw new Error('Failed to generate configuration');
            }

            const data = await response.json();
            
            // Apply the AI configuration to the parent state
            if (data.workload !== undefined) setWorkload(data.workload);
            if (data.envValue) setEnvValue(data.envValue);
            if (data.regionValue) setRegionValue(data.regionValue);
            if (data.searchTerm) setSearchTerm(data.searchTerm);
            
            // Clear any active filters so the results are visible
            if (setActiveCategory) setActiveCategory('All');

            // Clear the input after success
            setPrompt('');
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

        } catch (err) {
            console.error('AI Request Error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const presets = [
        "Production E-Commerce Web App with Azure SQL Backend in West Europe",
        "Enterprise Data Analytics Environment for Finance in UK South",
        "Azure Virtual Desktop for Remote Workers in UK South",
        "Core Hub and Spoke Networking in UK West",
        "Serverless API Architecture for Mobile App in North Europe",
        "Machine Learning Workspace for Data Science in West Europe",
        "Staging API Management Gateway with Azure Functions in North Europe",
        "Development Firewall and VPN Gateway Hub in UK South",
        "Disaster Recovery Storage and Data Factory in UK West",
        "Production AKS Microservices Environment in North Europe"
    ];

    return (
        <div className="w-full mb-2 group relative z-30">
            <div className="flex items-center justify-between mb-1.5 ml-1">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-fluent-brand-fg uppercase tracking-wider">
                        AI Generate
                    </span>
                    <span className="bg-fluent-bg-subtle text-fluent-fg-secondary border border-fluent-stroke-subtle text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold">
                        EXPERIMENTAL
                    </span>
                </div>
                {onResetAll && (
                    <button
                        type="button"
                        onClick={onResetAll}
                        className="text-[12px] flex items-center gap-1.5 text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover font-medium px-2.5 h-[26px] rounded-[4px] transition-all duration-200 ease-in-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50"
                        title="Reset all settings and filters"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset All
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
                        placeholder={isLoading ? "Analyzing intent..." : "Describe your cloud architecture..."}
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
                                aria-label="Generate Configuration"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </form>
            {error && <p className="text-fluent-state-danger text-[13px] mt-2 ml-2">{error}</p>}

            {/* Pinned Presets */}
            <div className="mt-3 ml-1 flex items-center w-full gap-2">
                <p className="text-[12px] shrink-0 text-fluent-fg-secondary">Try an example:</p>
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

PromptBar.propTypes = {
    setWorkload: PropTypes.func.isRequired,
    setEnvValue: PropTypes.func.isRequired,
    setRegionValue: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    setActiveCategory: PropTypes.func,
    onResetAll: PropTypes.func
};

PromptBar.displayName = 'PromptBar';

export default PromptBar;
