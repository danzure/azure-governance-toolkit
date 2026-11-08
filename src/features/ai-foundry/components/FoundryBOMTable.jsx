import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { buildTopologyAndBOM } from '../utils/topologyBuilder';
import { Layers } from 'lucide-react';
import { AzureServiceIcon } from '@features/naming';

function FoundryBOMTable({ config }) {
    const { bom } = useMemo(() => buildTopologyAndBOM(config), [config]);

    return (
        <div className="w-full flex-1 h-full flex flex-col gap-3 p-4 bg-fluent-bg-canvas rounded-lg border border-fluent-stroke-subtle animate-fade-in">
            <div className="flex items-center justify-between border-b border-fluent-stroke-subtle pb-2">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-fluent-brand-fg" />
                    <span className="text-[13px] font-semibold text-fluent-fg-primary">
                        Landing Zone Bill of Materials ({bom.length} Azure Resources)
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto rounded border border-fluent-stroke-subtle bg-fluent-bg-card">
                <table className="w-full text-left text-[12px] border-collapse">
                    <thead>
                        <tr className="border-b border-fluent-stroke-subtle bg-fluent-bg-subtle text-fluent-fg-secondary font-semibold">
                            <th className="py-2 px-3">Role / Component</th>
                            <th className="py-2 px-3">Generated Name</th>
                            <th className="py-2 px-3">ARM Provider</th>
                            <th className="py-2 px-3">SKU / Tier</th>
                            <th className="py-2 px-3">Network Security</th>
                            <th className="py-2 px-3">Cost Model</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-fluent-stroke-subtle">
                        {bom.map((item, idx) => (
                            <tr key={idx} className="hover:bg-fluent-bg-hover transition-colors">
                                <td className="py-2.5 px-3 font-medium text-fluent-fg-primary">
                                    <div className="flex items-center gap-2">
                                        <AzureServiceIcon resourceName={item.resourceType} category={item.categoryGroup} className="w-4 h-4 shrink-0" />
                                        <span>{item.category}</span>
                                    </div>
                                </td>
                                <td className="py-2.5 px-3 font-mono font-medium text-fluent-fg-primary">
                                    {item.name}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-fluent-fg-tertiary text-[11px]">
                                    {item.provider}
                                </td>
                                <td className="py-2.5 px-3 text-fluent-fg-secondary">
                                    {item.tier}
                                </td>
                                <td className="py-2.5 px-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
                                        item.network.includes('Private') 
                                            ? 'bg-fluent-cat-green-bg text-fluent-cat-green-fg'
                                            : 'bg-fluent-cat-yellow-bg text-fluent-cat-yellow-fg'
                                    }`}>
                                        {item.network}
                                    </span>
                                </td>
                                <td className="py-2.5 px-3 text-fluent-fg-secondary">
                                    {item.costTier}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

FoundryBOMTable.propTypes = {
    config: PropTypes.object.isRequired
};

export default memo(FoundryBOMTable);
