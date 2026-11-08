import { memo } from 'react';
import PropTypes from 'prop-types';
import { ARCHETYPE_PRESETS } from '../data/archetypes';
import { AzureServiceIcon } from '@features/naming';

/**
 * Archetype Preset Selector Bar
 * Allows one-click instantiation of standard enterprise AI Foundry architectures.
 */
function FoundryArchetypeBar({ activeArchetypeId, onSelectArchetype }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <AzureServiceIcon resourceName="Microsoft Foundry hub" category="AI + ML" className="w-4 h-4 shrink-0" />
                <span className="text-[13px] font-semibold text-fluent-fg-primary">
                    Architecture Archetypes (CAF Presets)
                </span>
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
                            className={`group inline-flex items-center gap-2 px-3 h-[32px] rounded-[4px] text-[13px] font-medium border transition-all active:scale-95 ${
                                isActive
                                    ? 'bg-fluent-info-bg border-fluent-info-border text-fluent-info-text shadow-sm'
                                    : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${preset.dotColor}`} />
                            <span className="truncate">{preset.label}</span>
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

