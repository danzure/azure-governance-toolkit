import { useState, forwardRef } from 'react';
import { Sparkles, ArrowRight, Loader2, X, RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AiPromptBar Component
 * 
 * A premium natural language input bar that calls the Azure OpenAI backend
 * to automatically generate Resource Naming configurations based on user intent.
 */
const AiPromptBar = forwardRef(({ setWorkload, setEnvValue, setRegionValue, setSearchTerm, setActiveCategory, onResetAll }, ref) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
                    <span className="text-xs font-semibold text-fluent-brand-bg uppercase tracking-wider">
                        Smart Generate
                    </span>
                    <span className="bg-fluent-bg-tertiary text-fluent-fg-secondary border border-fluent-stroke-subtle text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        EXPERIMENTAL
                    </span>
                </div>
                {onResetAll && (
                    <button
                        type="button"
                        onClick={onResetAll}
                        className="text-[12px] flex items-center gap-1.5 text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover font-medium px-2.5 py-1.5 rounded-md transition-colors"
                        title="Reset all settings and filters"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset All
                    </button>
                )}
            </div>
            <form onSubmit={handleSubmit} className="relative flex items-center w-full">
                {/* Glow effect behind the bar */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fluent-brand-bg to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                
                <div className="relative flex items-center w-full h-[50px] bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft focus-within:border-fluent-brand-bg focus-within:ring-1 focus-within:ring-fluent-brand-bg/50 transition-all overflow-hidden">
                    
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
                        placeholder={isLoading ? "Analyzing intent and matching to CAF..." : "Describe your cloud architecture (e.g., 'A production data analytics environment for Finance in West Europe')..."}
                        className="flex-1 h-full bg-transparent !border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none text-[15px] text-fluent-fg-primary placeholder:text-fluent-fg-tertiary disabled:opacity-50 pr-20"
                    />

                    <div className="absolute right-2 flex items-center gap-1">
                        {prompt && !isLoading && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPrompt('');
                                    // Optionally refocus: ref?.current?.focus();
                                }}
                                className="flex items-center justify-center w-8 h-8 rounded-md text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle transition-colors"
                                aria-label="Clear Input"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {prompt.trim() && !isLoading && (
                            <button
                                type="submit"
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-fluent-brand-bg text-white hover:bg-fluent-brand-hover transition-colors"
                                aria-label="Generate Configuration"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </form>
            {error && <p className="text-red-500 text-sm mt-2 ml-2">{error}</p>}

            {/* Pinned Presets */}
            <div className="flex overflow-x-auto gap-2 mt-3 ml-1 pb-2 scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {presets.map((preset, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setPrompt(preset)}
                        className="whitespace-nowrap flex-shrink-0 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-card px-3 py-1 rounded-full shadow-soft transition-colors"
                    >
                        {preset}
                    </button>
                ))}
            </div>
        </div>
    );
});

AiPromptBar.propTypes = {
    setWorkload: PropTypes.func.isRequired,
    setEnvValue: PropTypes.func.isRequired,
    setRegionValue: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    setActiveCategory: PropTypes.func,
    onResetAll: PropTypes.func
};

AiPromptBar.displayName = 'AiPromptBar';

export default AiPromptBar;
