import { useState, useMemo } from 'react';
import { Search, Plus, Minus, ShieldCheck } from 'lucide-react';
import { COMMON_RBAC_PROVIDERS } from '../../data/rbacData';
import SearchableSelect from '../shared/SearchableSelect';

export default function PermissionsSelector({ actions, notActions, onAddAction, onRemoveAction, onAddNotAction, onRemoveNotAction }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeProvider, setActiveProvider] = useState('All');

    const filteredProviders = useMemo(() => {
        let providers = COMMON_RBAC_PROVIDERS;
        if (activeProvider !== 'All') {
            providers = providers.filter(p => p.provider === activeProvider);
        }
        
        if (!searchTerm) return providers;
        
        const lowerSearch = searchTerm.toLowerCase();
        return providers.map(p => ({
            provider: p.provider,
            operations: p.operations.filter(op => op.toLowerCase().includes(lowerSearch))
        })).filter(p => p.operations.length > 0);
    }, [searchTerm, activeProvider]);

    const providerOptions = useMemo(() => {
        return [
            { label: 'All Providers', value: 'All' },
            ...COMMON_RBAC_PROVIDERS.map(p => ({ label: p.provider, value: p.provider }))
        ];
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 border-b border-fluent-stroke-subtle pb-2">
                <ShieldCheck className="w-5 h-5 text-fluent-brand-fg" />
                <h3 className="text-[16px] font-semibold text-fluent-fg-primary">Permissions Selector</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fluent-fg-tertiary" />
                    <input 
                        type="text" 
                        placeholder="Search operations (e.g. read, virtualMachines)..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 h-[32px] border rounded outline-none text-[13px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-canvas text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                    />
                </div>
                <div className="w-full sm:w-[250px] shrink-0 z-50">
                    <SearchableSelect 
                        items={providerOptions}
                        value={activeProvider}
                        onChange={setActiveProvider}
                        compact={true}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                {/* Available Operations */}
                <div className="flex flex-col gap-2 h-[400px]">
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">Available Operations</span>
                    <div className="flex-1 overflow-y-auto border border-fluent-stroke-subtle rounded bg-fluent-bg-canvas p-2">
                        {filteredProviders.length === 0 ? (
                            <div className="text-center text-[12px] text-fluent-fg-tertiary py-8">No operations found</div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {filteredProviders.map(p => (
                                    <div key={p.provider} className="mb-2">
                                        <div className="text-[11px] font-bold text-fluent-fg-secondary mb-1 uppercase tracking-wider">{p.provider}</div>
                                        {p.operations.map(op => {
                                            const isAction = actions.includes(op);
                                            const isNotAction = notActions.includes(op);
                                            return (
                                                <div key={op} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 hover:bg-fluent-bg-hover rounded text-[12px] font-mono group">
                                                    <span className="text-fluent-fg-primary break-all">{op}</span>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                        <button 
                                                            disabled={isAction}
                                                            onClick={() => onAddAction(op)}
                                                            className="px-2 py-0.5 bg-fluent-cat-green-bg text-fluent-cat-green-fg rounded-[4px] border border-fluent-cat-green-bg hover:border-fluent-fg-primary disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-semibold"
                                                        >
                                                            + Action
                                                        </button>
                                                        <button 
                                                            disabled={isNotAction}
                                                            onClick={() => onAddNotAction(op)}
                                                            className="px-2 py-0.5 bg-fluent-cat-red-bg text-fluent-cat-red-fg rounded-[4px] border border-fluent-cat-red-bg hover:border-fluent-fg-primary disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-semibold"
                                                        >
                                                            + NotAction
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Operations */}
                <div className="flex flex-col gap-2 h-[400px]">
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">Selected Permissions</span>
                    <div className="flex-1 overflow-y-auto border border-fluent-stroke-subtle rounded bg-fluent-bg-canvas p-3 flex flex-col gap-4">
                        
                        <div className="flex flex-col gap-2">
                            <h4 className="text-[12px] font-bold text-fluent-cat-green-fg flex items-center gap-1.5 border-b border-fluent-stroke-subtle pb-1">
                                <Plus className="w-3.5 h-3.5" /> Actions ({actions.length})
                            </h4>
                            {actions.length === 0 ? (
                                <div className="text-[12px] text-fluent-fg-tertiary italic">No actions selected</div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {actions.map(op => (
                                        <div key={op} className="flex items-center justify-between gap-2 p-1.5 hover:bg-fluent-bg-hover rounded text-[12px] font-mono group border border-transparent hover:border-fluent-stroke-subtle">
                                            <span className="text-fluent-fg-primary truncate" title={op}>{op}</span>
                                            <button onClick={() => onRemoveAction(op)} className="text-fluent-fg-tertiary hover:text-fluent-state-danger p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-[12px] font-bold text-fluent-cat-red-fg flex items-center gap-1.5 border-b border-fluent-stroke-subtle pb-1">
                                <Minus className="w-3.5 h-3.5" /> NotActions ({notActions.length})
                            </h4>
                            {notActions.length === 0 ? (
                                <div className="text-[12px] text-fluent-fg-tertiary italic">No NotActions selected</div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {notActions.map(op => (
                                        <div key={op} className="flex items-center justify-between gap-2 p-1.5 hover:bg-fluent-bg-hover rounded text-[12px] font-mono group border border-transparent hover:border-fluent-stroke-subtle">
                                            <span className="text-fluent-fg-primary truncate" title={op}>{op}</span>
                                            <button onClick={() => onRemoveNotAction(op)} className="text-fluent-fg-tertiary hover:text-fluent-state-danger p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
