import { memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { buildTopologyAndBOM } from '../utils/topologyBuilder';
import { FOUNDRY_DNS_ZONES } from '../data/dnsZones';
import { Layers, Copy, Check, Network } from 'lucide-react';
import { AzureServiceIcon } from '@features/naming';

function FoundryBOMTable({ config, hideSubHeader = false }) {
    const { bom } = useMemo(() => buildTopologyAndBOM(config), [config]);
    const [copiedId, setCopiedId] = useState(null);
    const isPrivate = config.networkMode === 'private';

    const activeDnsZones = useMemo(() => {
        if (!isPrivate) return [];
        return FOUNDRY_DNS_ZONES.filter((dz) => {
            if (dz.resourceType === 'Microsoft.CognitiveServices/accounts' && !config.enableOpenAi) return false;
            if (dz.resourceType === 'Microsoft.Search/searchServices' && !config.enableAiSearch) return false;
            if (dz.resourceType === 'Microsoft.ContainerRegistry/registries' && !config.enableContainerRegistry) return false;
            return true;
        });
    }, [isPrivate, config.enableOpenAi, config.enableAiSearch, config.enableContainerRegistry]);

    const handleCopy = useCallback(async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }, []);

    const handleCopyMarkdown = useCallback(() => {
        const header = '| Role / Component | Scope | Generated Name | ARM Provider | SKU / Tier | Network Security | Cost Model |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |';
        const rows = bom.map((item) => `| ${item.category} | ${item.scope || '-'} | \`${item.name}\` | \`${item.provider}\` | ${item.tier} | ${item.network} | ${item.costTier} |`);
        const sections = [header, ...rows];

        if (isPrivate && activeDnsZones.length > 0) {
            sections.push('');
            sections.push('### Required Private DNS Zones');
            sections.push('| Private DNS Zone | Target Service | Purpose |');
            sections.push('| :--- | :--- | :--- |');
            activeDnsZones.forEach((dz) => {
                sections.push(`| \`${dz.zone}\` | ${dz.service} | ${dz.description} |`);
            });
        }

        handleCopy(sections.join('\n'), 'markdown');
    }, [bom, isPrivate, activeDnsZones, handleCopy]);

    return (
        <div className="w-full flex-1 h-full flex flex-col animate-fade-in">
            {/* Sub-Header Bar (hidden when integrated into unified page toolbar) */}
            {!hideSubHeader && (
                <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-fluent-stroke-subtle bg-fluent-bg-canvas shrink-0">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                        <span className="text-[13px] font-semibold text-fluent-fg-primary">
                            Landing Zone Bill of Materials ({bom.length} Azure Resources)
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleCopyMarkdown}
                        className={`shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border active:scale-95 ${
                            copiedId === 'markdown'
                                ? 'bg-fluent-cat-green-bg border-fluent-cat-green-border text-fluent-cat-green-fg'
                                : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary'
                        }`}
                    >
                        {copiedId === 'markdown' ? (
                            <>
                                <Check className="w-3.5 h-3.5 animate-scale-in" />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Markdown</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Table Container */}
            <div className="p-4 flex-1 flex flex-col bg-fluent-bg-card">
                <div className="overflow-x-auto rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card">
                    <table className="w-full text-left text-[12.5px] border-collapse">
                        <thead>
                            <tr className="border-b border-fluent-stroke-subtle bg-fluent-bg-subtle text-fluent-fg-secondary text-[12px] font-semibold whitespace-nowrap">
                                <th className="py-2.5 px-3 w-[16%]">Role / Component</th>
                                <th className="py-2.5 px-3 w-[20%]">Generated Name</th>
                                <th className="py-2.5 px-3 w-[23%]">ARM Provider</th>
                                <th className="py-2.5 px-3 w-[13%]">SKU / Tier</th>
                                <th className="py-2.5 px-3 w-[15%]">Network Security</th>
                                <th className="py-2.5 px-3 w-[13%]">Cost Model</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-fluent-stroke-subtle">
                            {bom.map((item, idx) => {
                                const isControlPlane = item.network === 'Control Plane';
                                const isPublic = item.network.includes('Public');
                                const dotColor = isControlPlane
                                    ? 'bg-fluent-cat-blue-fg'
                                    : isPublic
                                        ? 'bg-fluent-cat-yellow-fg'
                                        : 'bg-fluent-cat-green-fg';
                                const rowCopyId = `row-${idx}`;
                                return (
                                    <tr key={idx} className="hover:bg-fluent-bg-hover transition-colors group">
                                        <td className="py-2.5 px-3 font-medium text-fluent-fg-primary whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <AzureServiceIcon resourceName={item.resourceType} category={item.categoryGroup} className="w-4 h-4 shrink-0" />
                                                <div className="flex flex-col min-w-0">
                                                    <span>{item.category}</span>
                                                    {item.scope && (
                                                        <span className="text-[11px] font-normal text-fluent-fg-tertiary truncate max-w-[200px]" title={item.scope}>
                                                            {item.scope}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono font-semibold text-fluent-fg-primary whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <span className="select-all">{item.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(item.name, rowCopyId)}
                                                    title={`Copy ${item.name}`}
                                                    className={`p-1 rounded-[3px] transition-opacity shrink-0 ${
                                                        copiedId === rowCopyId
                                                            ? 'opacity-100 text-fluent-cat-green-fg'
                                                            : 'opacity-0 group-hover:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                    }`}
                                                >
                                                    {copiedId === rowCopyId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-fluent-fg-secondary text-[11.5px] max-w-[210px] truncate" title={item.provider}>
                                            {item.provider}
                                        </td>
                                        <td className="py-2.5 px-3 text-fluent-fg-secondary text-[12px] whitespace-nowrap">
                                            {item.tier}
                                        </td>
                                        <td className="py-2.5 px-3 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[11.5px] font-medium text-fluent-fg-primary whitespace-nowrap">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                                                <span>{item.network}</span>
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-fluent-fg-secondary text-[12px] whitespace-nowrap">
                                            {item.costTier}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Required Private DNS Zones Section */}
                {isPrivate && activeDnsZones.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Network className="w-4 h-4 text-fluent-brand-fg shrink-0" />
                                <h3 className="text-[13px] font-semibold text-fluent-fg-primary">
                                    Required Private DNS Zones ({activeDnsZones.length})
                                </h3>
                            </div>
                            <span className="text-[12px] text-fluent-fg-secondary">
                                Link these Private DNS zones to your Hub VNet for zero-trust name resolution
                            </span>
                        </div>
                        <div className="overflow-x-auto rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card">
                            <table className="w-full text-left text-[12.5px] border-collapse">
                                <thead>
                                    <tr className="border-b border-fluent-stroke-subtle bg-fluent-bg-subtle text-fluent-fg-secondary text-[12px] font-semibold whitespace-nowrap">
                                        <th className="py-2 px-3 w-[34%]">Private DNS Zone</th>
                                        <th className="py-2 px-3 w-[24%]">Target Service</th>
                                        <th className="py-2 px-3 w-[42%]">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fluent-stroke-subtle">
                                    {activeDnsZones.map((dz) => {
                                        const dnsCopyId = `dns-${dz.zone}`;
                                        return (
                                            <tr key={dz.zone} className="hover:bg-fluent-bg-hover transition-colors group">
                                                <td className="py-2 px-3 font-mono font-semibold text-fluent-fg-primary whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-cyan-fg shrink-0" />
                                                        <span className="select-all">{dz.zone}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(dz.zone, dnsCopyId)}
                                                            title={`Copy ${dz.zone}`}
                                                            className={`p-1 rounded-[3px] transition-opacity shrink-0 ${
                                                                copiedId === dnsCopyId
                                                                    ? 'opacity-100 text-fluent-cat-green-fg'
                                                                    : 'opacity-0 group-hover:opacity-100 text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-subtle'
                                                            }`}
                                                        >
                                                            {copiedId === dnsCopyId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3 font-medium text-fluent-fg-primary whitespace-nowrap">
                                                    {dz.service}
                                                </td>
                                                <td className="py-2 px-3 text-[12px] text-fluent-fg-secondary">
                                                    {dz.description}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

FoundryBOMTable.propTypes = {
    config: PropTypes.object.isRequired,
    hideSubHeader: PropTypes.bool
};

export default memo(FoundryBOMTable);
