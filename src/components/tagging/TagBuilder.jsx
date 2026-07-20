import { Plus, Trash2, Info } from 'lucide-react';
import Tooltip from '../shared/Tooltip';

/**
 * TagBuilder Component
 * 
 * An interactive form component that allows users to define a collection of Azure resource tags.
 * Users can specify the tag name, requirement level (Mandatory/Optional), policy effect 
 * (Audit/Deny/Modify), and allowed values. It manages the local state of these tag definitions.
 * 
 * @param {Object} props
 * @param {Array} props.tags - Array of tag definition objects.
 * @param {Function} props.setTags - State setter for the tags array.
 */
export default function TagBuilder({ tags, setTags }) {
    const handleAddTag = () => {
        setTags([...tags, { 
            id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9), 
            name: '', 
            requirement: 'Mandatory', 
            effect: 'Audit', 
            allowedValues: '' 
        }]);
    };

    const handleUpdateTag = (id, field, value) => {
        setTags(tags.map(tag => tag.id === id ? { ...tag, [field]: value } : tag));
    };

    const handleRemoveTag = (id) => {
        setTags(tags.filter(tag => tag.id !== id));
    };

    const policyTooltip = (
        <div className="flex flex-col gap-2 text-left">
            <div><strong className="text-fluent-brand-fg">Audit:</strong> Logs a warning if the tag is missing, but does not block creation.</div>
            <div><strong className="text-fluent-brand-fg">Deny:</strong> Blocks the creation or update of the resource if the tag is missing.</div>
            <div><strong className="text-fluent-brand-fg">Modify:</strong> Automatically appends the tag to the resource during creation.</div>
        </div>
    );

    return (
        <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle w-full flex flex-col overflow-hidden h-full p-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[16px] font-semibold text-fluent-fg-primary flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Tags.svg" alt="Tags" className="w-5 h-5" />
                    Tag Definitions
                    <Tooltip content={policyTooltip} position="right" align="center" className="z-[60] ml-1">
                        <Info className="w-4 h-4 text-fluent-fg-tertiary hover:text-fluent-brand-fg transition-colors cursor-help outline-none" />
                    </Tooltip>
                </h2>
                <button
                    onClick={handleAddTag}
                    className="px-3 h-[32px] bg-fluent-brand-bg text-white rounded-[4px] text-[13px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                    <Plus className="w-4 h-4" />
                    Add Tag
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {tags.length === 0 ? (
                    <div className="text-center py-8 text-fluent-fg-tertiary text-[13px]">
                        No tags defined. Click 'Add Tag' to start building your strategy.
                    </div>
                ) : (
                    tags.map((tag, index) => (
                        <div key={tag.id} className="bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft dark:shadow-none hover:shadow-depth hover:border-fluent-stroke-strong transition-all duration-200 p-4 relative group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                                onClick={() => handleRemoveTag(tag.id)}
                                className="shrink-0 h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium transition-all inline-flex items-center justify-center gap-1.5 border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-state-danger"
                                title="Remove Tag"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
                                <div>
                                    <label className="block text-[12px] font-semibold text-fluent-fg-secondary mb-1">Tag Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Environment, CostCenter"
                                        value={tag.name}
                                        onChange={(e) => handleUpdateTag(tag.id, 'name', e.target.value)}
                                        className="flex-1 min-w-0 w-full px-3 h-[32px] border rounded outline-none text-[14px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-fluent-fg-secondary mb-1">Requirement</label>
                                        <select
                                            value={tag.requirement}
                                            onChange={(e) => handleUpdateTag(tag.id, 'requirement', e.target.value)}
                                            className="px-2.5 h-[32px] min-w-0 w-full border rounded outline-none text-[13px] transition-all duration-200 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong hover:border-fluent-fg-primary focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 cursor-pointer text-ellipsis"
                                        >
                                            <option value="Mandatory">Mandatory</option>
                                            <option value="Optional">Optional</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-fluent-fg-secondary mb-1">
                                            Policy Effect
                                        </label>
                                        <select
                                            value={tag.effect}
                                            onChange={(e) => handleUpdateTag(tag.id, 'effect', e.target.value)}
                                            className="px-2.5 h-[32px] min-w-0 w-full border rounded outline-none text-[13px] transition-all duration-200 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong hover:border-fluent-fg-primary focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 cursor-pointer text-ellipsis"
                                        >
                                            <option value="Audit">Audit</option>
                                            <option value="Deny">Deny</option>
                                            <option value="Modify">Modify (Append)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[12px] font-semibold text-fluent-fg-secondary mb-1">Allowed Values (Comma separated, leave blank for any)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. dev, test, prod"
                                        value={tag.allowedValues}
                                        onChange={(e) => handleUpdateTag(tag.id, 'allowedValues', e.target.value)}
                                        className="flex-1 min-w-0 w-full px-3 h-[32px] border rounded outline-none text-[14px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
}
