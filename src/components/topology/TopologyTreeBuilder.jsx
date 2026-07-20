import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Plus, Trash2, ChevronDown, ChevronRight, Edit2, ZoomIn, ZoomOut, X, Wand2, Download } from 'lucide-react';
import Tooltip from '../shared/Tooltip';
import { generateName } from '../../utils/nameGenerator';
import { toPng } from 'html-to-image';

const TreeNode = ({ node, level, onAddChild, onRemove, onUpdateName, onAddSubscription, onRemoveSubscription, onUpdateSubscriptionName, onGenerateSubName }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const isRoot = level === 0;

    return (
        <div className="flex flex-col items-center relative">
            {/* The Node Card */}
            <div className={`z-10 relative flex flex-col p-2 rounded-lg border border-fluent-stroke-subtle shadow-sm transition-all hover:z-50
                ${isRoot ? 'bg-fluent-bg-subtle px-5 py-2 rounded-full items-center justify-center' : 'bg-fluent-bg-card hover:border-fluent-brand-bg/50'}
            `}>
                <div className="flex items-center w-full">
                    <img 
                        src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Management-Groups.svg" 
                        alt="Management Group" 
                        crossOrigin="anonymous"
                        className="w-5 h-5 mr-3 object-contain opacity-80"
                    />

                    <div className="flex-1 flex items-center relative mr-2">
                        {isRoot ? (
                             <span className="text-[13px] font-semibold text-fluent-fg-secondary pr-2">{node.name}</span>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={node.name}
                                    onChange={(e) => onUpdateName(node.id, e.target.value)}
                                    className="flex-1 min-w-[140px] w-full pl-2 pr-7 h-[32px] border rounded outline-none text-[13px] font-medium transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                                    placeholder="Group Name"
                                    spellCheck="false"
                                />
                                <Edit2 className="w-3 h-3 text-fluent-fg-tertiary absolute right-2 pointer-events-none opacity-50" />
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {level < 6 && (
                            <Tooltip align="center" content="Add Child Group">
                                <button
                                    onClick={() => {
                                        setIsExpanded(true);
                                        onAddChild(node.id);
                                    }}
                                    className="p-1.5 flex items-center justify-center rounded-md text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </Tooltip>
                        )}
                        {!isRoot && (
                            <Tooltip align="center" content="Attach Subscription">
                                <button
                                    onClick={() => onAddSubscription(node.id)}
                                    className="p-1.5 flex items-center justify-center rounded-md bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                                >
                                    <img 
                                        src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Subscriptions.svg" 
                                        alt="Subscription" 
                                        crossOrigin="anonymous"
                                        className="w-4 h-4 object-contain opacity-90"
                                    />
                                </button>
                            </Tooltip>
                        )}
                        {!isRoot && (
                            <Tooltip align="center" content="Remove this group and all its children">
                                <button
                                    onClick={() => onRemove(node.id)}
                                    className="p-1.5 flex items-center justify-center rounded-md text-fluent-status-danger bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>

                {/* Subscriptions List */}
                {!isRoot && node.subscriptions && node.subscriptions.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-3 w-full border-t border-fluent-stroke-subtle pt-2">
                        {node.subscriptions.map(sub => (
                            <div key={sub.id} className="flex items-center bg-fluent-bg-card border border-fluent-stroke-strong rounded px-2.5 h-[32px] gap-2">
                                <img 
                                    src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Subscriptions.svg" 
                                    alt="Subscription" 
                                    crossOrigin="anonymous"
                                    className="w-3.5 h-3.5 shrink-0 object-contain opacity-70"
                                />
                                <input 
                                    type="text"
                                    value={sub.name}
                                    onChange={(e) => onUpdateSubscriptionName(node.id, sub.id, e.target.value)}
                                    className="bg-transparent border-none text-[13px] text-fluent-fg-secondary flex-1 min-w-[120px] focus:outline-none focus:text-fluent-fg-primary h-full"
                                    placeholder="Subscription ID or Name"
                                    spellCheck="false"
                                />
                                <Tooltip align="center" content="Generate from Naming Tool">
                                    <button 
                                        onClick={() => onGenerateSubName(node.id, sub.id)} 
                                        className="text-fluent-brand-fg hover:bg-fluent-brand-bg/10 p-1 rounded transition-colors flex items-center justify-center"
                                    >
                                        <Wand2 className="w-3.5 h-3.5" />
                                    </button>
                                </Tooltip>
                                <button onClick={() => onRemoveSubscription(node.id, sub.id)} className="text-fluent-fg-tertiary hover:text-fluent-status-danger p-1 rounded transition-colors flex items-center justify-center">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Expand/Collapse Handle */}
                {node.children.length > 0 && (
                    <div 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-full flex items-center justify-center cursor-pointer hover:bg-fluent-bg-subtle z-20 text-fluent-fg-tertiary shadow-sm transition-colors"
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                )}
            </div>

            {/* Org-Chart Children Layout */}
            {isExpanded && node.children.length > 0 && (
                <div className="flex flex-row relative pt-6 mt-0">
                    {/* Vertical line from parent to horizontal connector */}
                    <div className="absolute top-0 left-1/2 w-px h-6 bg-fluent-stroke-subtle -translate-x-1/2"></div>

                    {node.children.map((child, i) => {
                        const isFirst = i === 0;
                        const isLast = i === node.children.length - 1;
                        const isOnly = node.children.length === 1;

                        return (
                            <div key={child.id} className="flex flex-col items-center relative px-2 sm:px-4">
                                {/* Horizontal Connector */}
                                {!isOnly && (
                                    <div className={`absolute top-0 h-px bg-fluent-stroke-subtle
                                        ${isFirst ? 'left-1/2 right-0' : ''}
                                        ${isLast ? 'left-0 right-1/2' : ''}
                                        ${!isFirst && !isLast ? 'left-0 right-0' : ''}
                                    `} />
                                )}
                                
                                {/* Vertical line to child */}
                                <div className="absolute top-0 left-1/2 w-px h-6 bg-fluent-stroke-subtle -translate-x-1/2"></div>
                                
                                {/* Wrapper to push child card down */}
                                <div className="pt-6">
                                    <TreeNode 
                                        node={child} 
                                        level={level + 1}
                                        onAddChild={onAddChild}
                                        onRemove={onRemove}
                                        onUpdateName={onUpdateName}
                                        onAddSubscription={onAddSubscription}
                                        onRemoveSubscription={onRemoveSubscription}
                                        onUpdateSubscriptionName={onUpdateSubscriptionName}
                                        onGenerateSubName={onGenerateSubName}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

TreeNode.propTypes = {
    node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        children: PropTypes.array.isRequired
    }).isRequired,
    level: PropTypes.number.isRequired,
    onAddChild: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdateName: PropTypes.func.isRequired,
    onAddSubscription: PropTypes.func.isRequired,
    onRemoveSubscription: PropTypes.func.isRequired,
    onUpdateSubscriptionName: PropTypes.func.isRequired,
    onGenerateSubName: PropTypes.func.isRequired
};

export default function TopologyTreeBuilder({ topology, setTopology }) {
    const [zoomLevel, setZoomLevel] = useState(1);
    const treeRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    
    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    
    const updateNode = (nodes, id, updater) => {
        return nodes.map(node => {
            if (node.id === id) {
                return updater(node);
            }
            if (node.children) {
                return { ...node, children: updateNode(node.children, id, updater) };
            }
            return node;
        });
    };

    const handleUpdateName = (id, newName) => {
        setTopology(prev => updateNode(prev, id, node => ({ ...node, name: newName })));
    };

    const handleAddChild = (parentId) => {
        const newChild = {
            id: `mg-${Date.now()}`,
            name: 'New Management Group',
            children: []
        };
        setTopology(prev => updateNode(prev, parentId, node => ({
            ...node,
            children: [...node.children, newChild]
        })));
    };

    const removeNode = (nodes, idToRemove) => {
        return nodes.filter(node => node.id !== idToRemove).map(node => ({
            ...node,
            children: removeNode(node.children, idToRemove)
        }));
    };

    const handleRemove = (id) => {
        setTopology(prev => removeNode(prev, id));
    };

    const handleAddSubscription = (parentId) => {
        const newSub = { id: `sub-${Date.now()}`, name: '' };
        setTopology(prev => updateNode(prev, parentId, node => ({
            ...node,
            subscriptions: [...(node.subscriptions || []), newSub]
        })));
    };

    const handleUpdateSubscriptionName = (nodeId, subId, newName) => {
        setTopology(prev => updateNode(prev, nodeId, node => ({
            ...node,
            subscriptions: (node.subscriptions || []).map(s => s.id === subId ? { ...s, name: newName } : s)
        })));
    };

    const handleRemoveSubscription = (nodeId, subId) => {
        setTopology(prev => updateNode(prev, nodeId, node => ({
            ...node,
            subscriptions: (node.subscriptions || []).filter(s => s.id !== subId)
        })));
    };

    const handleGenerateSubName = (nodeId, subId) => {
        const getLs = (key, def) => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : def;
            } catch {
                return def;
            }
        };

        const config = {
            workload: getLs('azres_workload', 'workload'),
            envValue: getLs('azres_env', 'prod'),
            regionAbbrev: 'uks', // Ignored for subscriptions
            instance: getLs('azres_instance', '001'),
            orgPrefix: getLs('azres_orgPrefix', ''),
            namingOrder: getLs('azres_namingOrder', ['Org', 'Resource', 'Workload', 'Environment', 'Region', 'Instance']),
            showOrg: getLs('azres_showOrg', false)
        };

        const subResource = { name: 'Subscription', abbrev: 'sub', chars: 'a-z, A-Z, 0-9, -, .' };
        const generatedName = generateName(subResource, config);
        
        handleUpdateSubscriptionName(nodeId, subId, generatedName);
    };

    const applyTemplate = (type) => {
        if (type === 'independent') {
            setZoomLevel(1);
            setTopology([{
                id: 'root', name: 'Tenant Root Group', children: [
                    { id: `mg-${Date.now()}-1`, name: 'Production', children: [] },
                    { id: `mg-${Date.now()}-2`, name: 'Non-Production', children: [] }
                ]
            }]);
        } else if (type === 'small') {
            setZoomLevel(1);
            setTopology([{
                id: 'root', name: 'Tenant Root Group', children: [
                    { id: `mg-${Date.now()}-1`, name: 'Workloads', children: [] },
                    { id: `mg-${Date.now()}-2`, name: 'Sandbox', children: [] }
                ]
            }]);
        } else if (type === 'medium') {
            setZoomLevel(0.8);
            setTopology([{
                id: 'root', name: 'Tenant Root Group', children: [
                    {
                        id: `mg-${Date.now()}-1`, name: 'Contoso Root', children: [
                            { id: `mg-${Date.now()}-2`, name: 'Platform', children: [] },
                            {
                                id: `mg-${Date.now()}-3`, name: 'Landing Zones', children: [
                                    { id: `mg-${Date.now()}-4`, name: 'Corp', children: [] },
                                    { id: `mg-${Date.now()}-5`, name: 'Online', children: [] }
                                ]
                            },
                            { id: `mg-${Date.now()}-6`, name: 'Decommissioned', children: [] },
                            { id: `mg-${Date.now()}-7`, name: 'Sandboxes', children: [] }
                        ]
                    }
                ]
            }]);
        } else if (type === 'large') {
            setZoomLevel(0.6);
            setTopology([{
                id: 'root', name: 'Tenant Root Group', children: [
                    {
                        id: `mg-${Date.now()}-1`, name: 'Contoso Root', children: [
                            {
                                id: `mg-${Date.now()}-2`, name: 'Platform', children: [
                                    { id: `mg-${Date.now()}-3`, name: 'Identity', children: [] },
                                    { id: `mg-${Date.now()}-4`, name: 'Management', children: [] },
                                    { id: `mg-${Date.now()}-5`, name: 'Connectivity', children: [] }
                                ]
                            },
                            {
                                id: `mg-${Date.now()}-6`, name: 'Landing Zones', children: [
                                    { id: `mg-${Date.now()}-7`, name: 'Corp', children: [] },
                                    { id: `mg-${Date.now()}-8`, name: 'Online', children: [] }
                                ]
                            },
                            { id: `mg-${Date.now()}-9`, name: 'Decommissioned', children: [] },
                            { id: `mg-${Date.now()}-10`, name: 'Sandboxes', children: [] }
                        ]
                    }
                ]
            }]);
        } else if (type === 'default') {
            setZoomLevel(0.9);
            setTopology([{
                id: 'root', name: 'Tenant Root Group', children: [
                    {
                        id: `mg-${Date.now()}-1`, name: 'Contoso Root', children: [
                            { id: `mg-${Date.now()}-2`, name: 'Platform', children: [] },
                            {
                                id: `mg-${Date.now()}-3`, name: 'Landing Zones', children: [
                                    { id: `mg-${Date.now()}-4`, name: 'Corp', children: [] },
                                    { id: `mg-${Date.now()}-5`, name: 'Online', children: [] }
                                ]
                            }
                        ]
                    }
                ]
            }]);
        }
    };

    const handleExportImage = async () => {
        if (!treeRef.current) return;
        setIsExporting(true);
        
        try {
            const element = treeRef.current;
            
            // Save original styles
            const originalTransform = element.style.transform;
            const originalTransition = element.style.transition;
            
            // Temporarily set scale to 1 for accurate capture
            element.style.transition = 'none';
            element.style.transform = 'scale(1)';
            
            // Wait for DOM to update
            await new Promise(r => setTimeout(r, 100));
            
            const dataUrl = await toPng(element, {
                backgroundColor: document.documentElement.classList.contains('dark') ? '#292929' : '#ffffff',
                cacheBust: true,
                pixelRatio: 2,
                style: {
                    transform: 'scale(1)',
                    transition: 'none'
                }
            });
            
            // Restore styles
            element.style.transform = originalTransform;
            element.style.transition = originalTransition;
            
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `azure-topology-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        } catch (err) {
            console.error('Failed to export topology image', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full flex flex-col overflow-hidden p-5 flex-1 min-h-[600px]">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start gap-4 shrink-0">
                <div>
                    <h3 className="text-lg font-semibold text-fluent-fg-primary mb-1">Topology Builder</h3>
                    <p className="text-sm text-fluent-fg-secondary">
                        Define your management group structure. The changes will automatically sync to the deployment code.
                    </p>
                </div>
                
                <div className="flex flex-col items-start md:items-end shrink-0 gap-2">
                    <span className="text-[11px] font-semibold text-fluent-fg-tertiary uppercase tracking-wider">Quick Templates</span>
                    <div className="flex flex-wrap gap-2">
                        <Tooltip align="right" content="Reset to standard Cloud Adoption Framework baseline, recommended for most businesses">
                            <button onClick={() => applyTemplate('default')} className="px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d83b01]"></span>
                                Default
                            </button>
                        </Tooltip>
                        <Tooltip align="right" content="Simple Production/Non-Prod split for independent setups (1-10 employees)">
                            <button onClick={() => applyTemplate('independent')} className="px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#107c10]"></span>
                                Independent
                            </button>
                        </Tooltip>
                        <Tooltip align="right" content="Workloads & Sandbox environments for small scale apps (10-100 employees)">
                            <button onClick={() => applyTemplate('small')} className="px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0078d4]"></span>
                                Small
                            </button>
                        </Tooltip>
                        <Tooltip align="right" content="Standard Cloud Adoption Framework layout (100-1000 employees)">
                            <button onClick={() => applyTemplate('medium')} className="px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#8764b8]"></span>
                                Medium
                            </button>
                        </Tooltip>
                        <Tooltip align="right" content="Enterprise scale with dedicated Platform and Landing Zone separations (1000+ employees)">
                            <button onClick={() => applyTemplate('large')} className="px-3 h-[32px] rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5c2d91]"></span>
                                Large
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            
            <div className="overflow-auto flex-1 w-full pb-8">
                <div 
                    ref={treeRef}
                    className="w-max min-w-full pt-4 px-8 pb-4 flex justify-center origin-top transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                >
                    {topology.map(rootNode => (
                        <TreeNode
                            key={rootNode.id}
                            node={rootNode}
                            level={0}
                            onAddChild={handleAddChild}
                            onRemove={handleRemove}
                            onUpdateName={handleUpdateName}
                            onAddSubscription={handleAddSubscription}
                            onRemoveSubscription={handleRemoveSubscription}
                            onUpdateSubscriptionName={handleUpdateSubscriptionName}
                            onGenerateSubName={handleGenerateSubName}
                        />
                    ))}
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-10 right-6 z-20 flex flex-col gap-2 bg-white dark:bg-[#292929] border border-[#d1d1d1] dark:border-[#525252] rounded-md shadow-sm p-0.5">
                <Tooltip position="left" content="Export as PNG">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleExportImage(); }}
                        disabled={isExporting}
                        className={`p-1.5 hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] text-fluent-fg-primary transition-colors rounded-sm flex items-center justify-center ${isExporting ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </Tooltip>
                <div className="h-px bg-[#d1d1d1] dark:bg-[#525252] w-full"></div>
                <Tooltip position="left" content="Zoom In">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleZoomIn(); }}
                        className="p-1.5 hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] text-fluent-fg-primary transition-colors rounded-sm flex items-center justify-center"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                </Tooltip>
                <div className="h-px bg-[#d1d1d1] dark:bg-[#525252] w-full"></div>
                <Tooltip position="left" content="Zoom Out">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleZoomOut(); }}
                        className="p-1.5 hover:bg-[#f5f5f5] dark:hover:bg-[#3b3a39] text-fluent-fg-primary transition-colors rounded-sm flex items-center justify-center"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}

TopologyTreeBuilder.propTypes = {
    topology: PropTypes.array.isRequired,
    setTopology: PropTypes.func.isRequired
};
