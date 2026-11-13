import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import { ARCHETYPE_PRESETS } from '../data/archetypes';
import { AzureServiceIcon } from '@features/naming';

/**
 * Archetype Preset Selector Bar
 * Allows one-click instantiation of standard enterprise AI Foundry architectures.
 */
function FoundryArchetypeBar({ activeArchetypeId, onSelectArchetype }) {
    const [hoveredPreset, setHoveredPreset] = useState(null);
    const activePreset = ARCHETYPE_PRESETS.find((p) => p.id === activeArchetypeId);
    const isCustom = activeArchetypeId === 'custom';
    const displayedPreset = hoveredPreset || activePreset;

    return (
        <div className="relative z-20 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card shadow-soft p-3 sm:px-4 sm:py-3 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <AzureServiceIcon resourceName="Microsoft Foundry hub" category="AI + ML" className="w-4 h-4 shrink-0" />
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">
                        Architecture Archetypes
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-secondary">
                        CAF Presets
                    </span>
                    {isCustom && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-primary animate-fade-in">
                            <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                            <span>Custom Configuration</span>
                        </span>
                    )}
                </div>
                <span className="text-[12px] text-fluent-fg-tertiary hidden md:inline">
                    Select a reference architecture preset or tailor parameters below
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {ARCHETYPE_PRESETS.map((preset) => {
                    const isActive = activeArchetypeId === preset.id;

                    return (
                        <div
                            key={preset.id}
                            className="relative group/archetype"
                            onMouseEnter={() => setHoveredPreset(preset)}
                            onMouseLeave={() => setHoveredPreset(null)}
                        >
                            <button
                                type="button"
                                onClick={() => onSelectArchetype(preset)}
                                className={`px-3 h-[32px] rounded-[4px] text-[13px] font-medium border transition-all duration-200 ease-in-out inline-flex items-center gap-2 active:scale-95 ${
                                    isActive
                                        ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text font-semibold shadow-sm'
                                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${preset.dotColor}`} />
                                <span className="truncate">{preset.label}</span>
                                {isActive && <Check className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0" />}
                            </button>

                            {/* Rich Hover Popover Card */}
                            <div
                                className="absolute z-50 top-full mt-2 w-[280px] sm:w-[340px] max-w-[calc(100vw-32px)] p-3 rounded-lg bg-fluent-bg-card border border-fluent-stroke-subtle shadow-flyout text-[12px] opacity-0 pointer-events-none group-hover/archetype:opacity-100 group-hover/archetype:pointer-events-auto transition-all duration-200 delay-150 ease-out flex flex-col gap-2 left-0"
                                role="tooltip"
                            >
                                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-fluent-stroke-subtle">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${preset.dotColor}`} />
                                        <span className="font-semibold text-fluent-fg-primary text-[12.5px] truncate">
                                            {preset.label}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-fluent-bg-subtle text-fluent-fg-secondary shrink-0">
                                        CAF Pattern
                                    </span>
                                </div>

                                <div className="text-[12px] text-fluent-fg-primary leading-snug">
                                    <span className="text-fluent-fg-tertiary font-medium">Best for: </span>
                                    <span>{preset.bestFor}</span>
                                </div>

                                <div className="p-2 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] text-fluent-fg-secondary leading-tight">
                                    <span className="font-semibold text-fluent-fg-primary block mb-0.5">Architecture Core:</span>
                                    <span>{preset.shortDesc}</span>
                                </div>

                                {preset.useCases && preset.useCases.length > 0 && (
                                    <div className="flex flex-col gap-1 pt-0.5">
                                        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-fluent-fg-tertiary">
                                            Recommended Use Cases
                                        </span>
                                        <ul className="flex flex-col gap-1 text-[11.5px] text-fluent-fg-secondary">
                                            {preset.useCases.map((uc, uIdx) => (
                                                <li key={uIdx} className="flex items-start gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-brand-fg shrink-0 mt-1" />
                                                    <span className="leading-snug">{uc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Persistent Responsive Active Archetype Summary Bar */}
            <div className="px-3 py-2 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[12px]">
                {displayedPreset ? (
                    <>
                        <div className="flex items-start sm:items-center gap-2 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 sm:mt-0 ${displayedPreset.dotColor}`} />
                            <p className="text-fluent-fg-secondary leading-snug">
                                <strong className="text-fluent-fg-primary font-semibold">
                                    {hoveredPreset ? `Preview (${displayedPreset.label}):` : 'Best for:'}
                                </strong>{' '}
                                {displayedPreset.bestFor}
                            </p>
                        </div>
                        <span className="text-[11.5px] text-fluent-fg-tertiary sm:text-right shrink-0 lg:max-w-[45%] truncate" title={displayedPreset.shortDesc}>
                            {displayedPreset.shortDesc}
                        </span>
                    </>
                ) : (
                    <div className="flex items-start sm:items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-fluent-cat-purple-fg shrink-0 mt-1.5 sm:mt-0" />
                        <p className="text-fluent-fg-secondary leading-snug">
                            <strong className="text-fluent-fg-primary font-semibold">Custom Configuration:</strong>{' '}
                            Parameters have been tailored from the baseline. Select any CAF archetype above to reset to a reference preset.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

FoundryArchetypeBar.propTypes = {
    activeArchetypeId: PropTypes.string,
    onSelectArchetype: PropTypes.func.isRequired
};

export default memo(FoundryArchetypeBar);

