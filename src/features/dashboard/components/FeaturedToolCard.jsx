import PropTypes from 'prop-types';
import {
    ArrowRight,
    Sparkles,
    Star
} from 'lucide-react';

/**
 * Featured Tool Hero Card for Dashboard Bento Grid.
 * Highlights the flagship Azure Resource Naming Tool with capability tags
 * and quick-launch action.
 */
export default function FeaturedToolCard({ tool, onNavigate }) {
    return (
        <div
            onClick={() => onNavigate(tool.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(tool.path);
                }
            }}
            aria-label={`${tool.title} - Featured Tool`}
            className="
                relative group cursor-pointer overflow-hidden
                rounded-xl border border-fluent-stroke-subtle
                bg-fluent-bg-card hover:bg-fluent-bg-hover
                p-4 sm:p-5 tall:p-5.5
                shadow-soft dark:shadow-none hover:shadow-depth hover:border-fluent-stroke-strong hover:-translate-y-0.5
                transition-all duration-200 ease-in-out
                active:scale-[0.99]
                flex flex-col justify-between
                md:col-span-2 xl:col-span-2
                animate-slide-up stagger-1
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg focus-visible:border-fluent-brand-bg
            "
        >
            {/* Top Brand Gradient Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary-gradient" />

            {/* Subtle Ambient Brand Aura */}
            <div className="pointer-events-none absolute -right-10 -top-10 w-44 h-44 rounded-full bg-fluent-info-bg opacity-40 blur-2xl group-hover:opacity-70 transition-opacity" />

            <div className="relative z-10 flex flex-col gap-3">
                {/* Header Row: Badges */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1.5 bg-fluent-brand-bg text-white text-[11px] px-2.5 py-0.5 rounded-[4px] font-semibold shadow-sm">
                            <Sparkles className="w-3.5 h-3.5" />
                            Featured Flagship
                        </span>
                        {tool.isNew && (
                            <span className="inline-flex items-center gap-1 bg-fluent-brand-bg text-white text-[10.5px] tall:text-[11px] px-2 py-0.5 rounded-[4px] font-semibold shadow-sm">
                                <Star className="w-3 h-3 fill-current" />
                                New
                            </span>
                        )}
                        {tool.hasAi && (
                            <span className="inline-flex items-center gap-1 bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-brand-fg text-[11px] px-2 py-0.5 rounded-[4px] font-medium shadow-sm group-hover:border-fluent-stroke-strong transition-colors">
                                <Sparkles className="w-3 h-3" />
                                AI Powered
                            </span>
                        )}
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-tertiary text-[11px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-green-fg shrink-0" />
                        150+ Azure Services
                    </span>
                </div>

                {/* Main Content: Icon, Title & Expanded Description */}
                <div className="flex items-start gap-3.5 sm:gap-4 my-0.5">
                    <img
                        src={tool.iconUrl}
                        alt={`${tool.title} icon`}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-200 ease-in-out"
                    />
                    <div className="flex-1 min-w-0">
                        <h2 className="text-[17px] sm:text-[19px] tall:text-[20px] font-semibold tracking-tight text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors duration-200 leading-snug">
                            {tool.title}
                        </h2>
                        <p className="text-[12.5px] sm:text-[13px] tall:text-[13.5px] text-fluent-fg-secondary leading-relaxed mt-1 line-clamp-2 sm:line-clamp-none">
                            {tool.description}
                        </p>
                    </div>
                </div>

                {/* Capability Pills Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px] text-fluent-fg-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-blue-fg shrink-0" />
                        <span>CAF Best Practices</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px] text-fluent-fg-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-green-fg shrink-0" />
                        <span>Bicep &amp; Terraform Export</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px] text-fluent-fg-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                        <span>Custom Naming Schemas</span>
                    </span>
                    <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px] text-fluent-fg-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-orange-fg shrink-0" />
                        <span>AI Grounding</span>
                    </span>
                </div>
            </div>

            {/* Action Footer Bar */}
            <div className="relative z-10 mt-3 pt-2.5 border-t border-fluent-stroke-subtle flex items-center justify-start">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(tool.path);
                    }}
                    className="px-3.5 h-[32px] bg-fluent-brand-bg text-white rounded-[4px] text-[13px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm inline-flex items-center justify-center gap-2 active:scale-95"
                >
                    <span>Launch Naming Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
            </div>
        </div>
    );
}

FeaturedToolCard.propTypes = {
    tool: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        iconUrl: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        hasAi: PropTypes.bool,
    }).isRequired,
    onNavigate: PropTypes.func.isRequired,
};
