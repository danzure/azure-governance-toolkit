import { Plus, Trash2, Info } from 'lucide-react';

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
            id: crypto.randomUUID(), 
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

    return (
        <div className="bg-fluent-bg-card rounded-xl p-5 border border-fluent-stroke-subtle shadow-soft flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[16px] font-semibold text-fluent-fg-primary flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/benc-uk/icon-collection/master/azure-icons/Tags.svg" alt="Tags" className="w-5 h-5" />
                    Tag Definitions
                </h2>
                <button
                    onClick={handleAddTag}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-fluent-brand-bg text-white rounded-md text-[13px] font-medium hover:bg-fluent-brand-hover transition-colors shadow-sm"
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
                        <div key={tag.id} className="p-4 border border-fluent-stroke-subtle rounded-lg bg-fluent-bg-subtle relative group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <button
                                onClick={() => handleRemoveTag(tag.id)}
                                className="absolute top-3 right-3 text-fluent-fg-tertiary hover:text-fluent-danger transition-colors"
                                title="Remove Tag"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-6">
                                <div>
                                    <label className="block text-[12px] font-semibold text-fluent-fg-secondary mb-1">Tag Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Environment, CostCenter"
                                        value={tag.name}
                                        onChange={(e) => handleUpdateTag(tag.id, 'name', e.target.value)}
                                        className="w-full px-3 py-1.5 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-md text-[14px] text-fluent-fg-primary focus:outline-none focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-fluent-fg-secondary mb-1">Requirement</label>
                                        <select
                                            value={tag.requirement}
                                            onChange={(e) => handleUpdateTag(tag.id, 'requirement', e.target.value)}
                                            className="w-full px-3 py-1.5 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-md text-[14px] text-fluent-fg-primary focus:outline-none focus:border-fluent-brand-bg transition-all"
                                        >
                                            <option value="Mandatory">Mandatory</option>
                                            <option value="Optional">Optional</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-[12px] font-semibold text-fluent-fg-secondary mb-1">
                                            Policy Effect
                                            <Info 
                                                className="w-3.5 h-3.5 text-fluent-brand-fg opacity-80 hover:opacity-100 transition-opacity cursor-help outline-none" 
                                                title="Audit: Logs a warning if the tag is missing, but does not block creation.&#10;Deny: Blocks the creation or update of the resource if the tag is missing.&#10;Modify: Automatically appends the tag to the resource during creation."
                                            />
                                        </label>
                                        <select
                                            value={tag.effect}
                                            onChange={(e) => handleUpdateTag(tag.id, 'effect', e.target.value)}
                                            className="w-full px-3 py-1.5 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-md text-[14px] text-fluent-fg-primary focus:outline-none focus:border-fluent-brand-bg transition-all"
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
                                        className="w-full px-3 py-1.5 bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-md text-[14px] text-fluent-fg-primary focus:outline-none focus:border-fluent-brand-bg focus:ring-1 focus:ring-fluent-brand-bg transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
