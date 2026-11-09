import { memo } from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import { ARCHETYPE_PRESETS } from '../data/archetypes';
import { AzureServiceIcon } from '@features/naming';

/**
 * Archetype Preset Selector Bar
 * Allows one-click instantiation of standard enterprise AI Foundry architectures.
 */
function FoundryArchetypeBar({ activeArchetypeId, onSelectArchetype }) {
    const activePreset = ARCHETYPE_PRESETS.find((p) => p.id === activeArchetypeId);

    return (
        <div className="rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card shadow-soft p-3 sm:px-4 sm:py-3 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <AzureServiceIcon resourceName="Microsoft Foundry hub" category="AI + ML" className="w-4 h-4 shrink-0" />
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">
                        Architecture Archetypes
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11px] font-medium text-fluent-fg-secondary">
                        CAF Presets
                    </span>
                </div>
                {activePreset && (
                    <span className="text-[12px] text-fluent-fg-secondary hidden md:inline truncate">
                        {activePreset.shortDesc}
                    </span>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {ARCHETYPE_PRESETS.map((preset) => {
                    const isActive = activeArchetypeId === preset.id;
                    return (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => onSelectArchetype(preset)}
                            title={preset.shortDesc}
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
                    );
                })}
            </div>
        </div>
    );
}

FoundryArchetypeBar.propTypes = {
    activeArchetypeId: PropTypes.string,
    onSelectArchetype: PropTypes.func.isRequired
};

export default memo(FoundryArchetypeBar);

