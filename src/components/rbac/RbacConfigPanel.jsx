import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
    Sliders, 
    Edit3, 
    Globe, 
    Sparkles, 
    ChevronUp, 
    ChevronDown, 
    X, 
    ExternalLink 
} from 'lucide-react';
import ResetButton from '../shared/ResetButton';
import TechnologyIcon from '../shared/TechnologyIcon';
import { RBAC_ROLE_TEMPLATES } from '../../data/rbacData';

/**
 * Quick assignable scope pills for standard Azure deployment tiers
 */
const QUICK_SCOPES = [
    { label: 'Subscription', value: '/subscriptions/00000000-0000-0000-0000-000000000000' },
    { label: 'Resource Group', value: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-workload' },
    { label: 'Management Group', value: '/providers/Microsoft.Management/managementGroups/mg-core' },
    { label: 'Root (/)', value: '/' }
];

/**
 * Common scope presets with descriptive guidance
 */
const COMMON_SCOPE_PATTERNS = [
    { 
        label: 'Entire Subscription', 
        value: '/subscriptions/00000000-0000-0000-0000-000000000000',
        desc: 'Permits role assignment across all resources within the subscription'
    },
    { 
        label: 'Specific Resource Group', 
        value: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-workload',
        desc: 'Constrains role assignment strictly to a specific resource group boundary'
    },
    { 
        label: 'Management Group Level', 
        value: '/providers/Microsoft.Management/managementGroups/mg-core',
        desc: 'Inherits role assignment down to all child subscriptions and resource groups'
    },
    { 
        label: 'Root Scope (Multiple Subs)', 
        value: '/',
        desc: 'Tenant-wide scope for broad administrative access'
    }
];

/**
 * RbacConfigPanel Component
 * 
 * Displays the refined configuration form for defining RBAC custom role parameters:
 * - Fluent 2 structured grid: Role Identity & Scopes vs Description & Governance
 * - Quick scope preset pills & combobox flyout
 * - Archetype template browser with category filtering
 * - Unified with the Azure Resource Naming ConfigPanel design system
 */
export default function RbacConfigPanel({
    roleName,
    setRoleName,
    description,
    setDescription,
    assignableScopes,
    setAssignableScopes,
    actions = [],
    notActions = [],
    onResetRole,
    onApplyTemplate,
    onToggleMinimize
}) {
    const [isScopeMenuOpen, setIsScopeMenuOpen] = useState(false);
    const [activeTemplateCategory, setActiveTemplateCategory] = useState('All');
    const scopeMenuRef = useRef(null);

    // Extract categories for template filter tabs
    const templateCategories = useMemo(() => {
        const cats = new Set();
        RBAC_ROLE_TEMPLATES.forEach(t => {
            if (t.category) cats.add(t.category);
        });
        return ['All', ...Array.from(cats)];
    }, []);

    // Filter templates based on active category
    const filteredTemplates = useMemo(() => {
        if (activeTemplateCategory === 'All') return RBAC_ROLE_TEMPLATES;
        return RBAC_ROLE_TEMPLATES.filter(t => t.category === activeTemplateCategory);
    }, [activeTemplateCategory]);

    // Close scope dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (scopeMenuRef.current && !scopeMenuRef.current.contains(event.target)) {
                setIsScopeMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle template selection
    const handleTemplateClick = useCallback((templateId) => {
        if (onApplyTemplate) {
            onApplyTemplate(templateId);
        }
    }, [onApplyTemplate]);

    return (
        <div className="relative z-40 animate-slide-up bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft flex flex-col overflow-hidden">
            
            {/* Header: Edge-to-edge Fluent 2 card header */}
            <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-fluent-stroke-subtle bg-fluent-bg-card">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-fluent-info-bg text-fluent-brand-fg shrink-0">
                        <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-[15px] sm:text-[16px] font-semibold text-fluent-fg-primary leading-snug">
                            Role Parameters & Definition Builder
                        </h3>
                        <p className="text-[12px] text-fluent-fg-secondary">
                            Configure core role metadata, assignable deployment scopes, and conventions aligned with Azure RBAC
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
                    <ResetButton
                        onClick={onResetRole}
                        title="Reset all role properties and permissions"
                    >
                        Reset Role
                    </ResetButton>
                    {onToggleMinimize && (
                        <button
                            type="button"
                            onClick={onToggleMinimize}
                            title="Collapse configuration panel"
                            className="px-3 h-[32px] rounded-[4px] border transition-all duration-200 ease-in-out active:scale-95 inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary text-[13px] font-medium"
                        >
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Hide Parameters</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Form Body: Balanced Two-Column Functional Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 bg-fluent-bg-card">
                
                {/* Column 1: Role Identity & Scopes */}
                <div className="flex flex-col bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-lg p-4 sm:p-4.5 gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-fluent-stroke-subtle">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-fluent-info-bg text-fluent-brand-fg shrink-0">
                            <Edit3 className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-[13px] font-semibold text-fluent-fg-primary">
                            Role Identity & Identifiers
                        </h4>
                    </div>

                    {/* Field: Role Name */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="rbac-param-role-name" className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-fluent-cat-purple-fg" title="Role Name token" />
                                Role Name
                            </label>
                            <span className="text-[11px] text-fluent-fg-tertiary">Role Identifier</span>
                        </div>
                        <div className="relative flex items-center w-full">
                            <input
                                id="rbac-param-role-name"
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="e.g. Virtual Machine Operator, Safe Reader"
                                className="flex-1 min-w-0 w-full px-3 h-[32px] pr-8 border rounded-[4px] outline-none text-[13px] transition-all duration-200 focus:border-fluent-brand-bg bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                            />
                            {roleName && (
                                <button
                                    type="button"
                                    onClick={() => setRoleName('')}
                                    title="Clear role name"
                                    aria-label="Clear role name"
                                    className="absolute right-2 w-5 h-5 flex items-center justify-center rounded-sm text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Name of the custom role displayed in Azure Portal, CLI, and Access Control (IAM).
                        </span>
                    </div>

                    {/* Field: Assignable Scopes with Quick Pills & Flyout */}
                    <div className="flex flex-col gap-1.5" ref={scopeMenuRef}>
                        <div className="flex items-center justify-between">
                            <label htmlFor="rbac-param-scopes" className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-fluent-cat-orange-fg" title="Scope token" />
                                Assignable Scopes
                            </label>
                            <span className="text-[11px] text-fluent-fg-tertiary">Deployment Scope</span>
                        </div>
                        
                        <div className="relative flex items-center w-full">
                            <input
                                id="rbac-param-scopes"
                                type="text"
                                value={assignableScopes}
                                onChange={(e) => setAssignableScopes(e.target.value)}
                                placeholder="/subscriptions/00000000-0000-0000-0000-000000000000"
                                className="flex-1 min-w-0 w-full px-3 h-[32px] pr-16 border rounded-[4px] outline-none font-mono text-[12px] transition-all duration-200 focus:border-fluent-brand-bg bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                            />
                            <div className="absolute right-1 flex items-center gap-0.5">
                                {assignableScopes && (
                                    <button
                                        type="button"
                                        onClick={() => setAssignableScopes('')}
                                        title="Clear scope"
                                        aria-label="Clear scope"
                                        className="w-5 h-5 flex items-center justify-center rounded-sm text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsScopeMenuOpen(prev => !prev)}
                                    title="Choose from common scope patterns"
                                    aria-label="Common Scope Patterns"
                                    aria-expanded={isScopeMenuOpen}
                                    className="w-6 h-6 flex items-center justify-center rounded-sm text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors"
                                >
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isScopeMenuOpen ? 'rotate-180 text-fluent-brand-fg' : ''}`} />
                                </button>
                            </div>

                            {/* Scope Patterns Dropdown Flyout */}
                            {isScopeMenuOpen && (
                                <div className="absolute top-[100%] left-0 right-0 z-50 shadow-flyout border rounded-[4px] overflow-hidden mt-1 bg-fluent-bg-card border-fluent-stroke-subtle animate-fade-in">
                                    <div className="p-2 border-b border-fluent-stroke-subtle bg-fluent-bg-subtle">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-fluent-fg-secondary">
                                            Common Scope Patterns
                                        </span>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto py-1">
                                        {COMMON_SCOPE_PATTERNS.map((item, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    setAssignableScopes(item.value);
                                                    setIsScopeMenuOpen(false);
                                                }}
                                                className="px-3 py-2 text-[12px] cursor-pointer hover:bg-fluent-bg-hover flex flex-col gap-0.5 transition-colors border-b border-fluent-stroke-subtle last:border-b-0"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-fluent-fg-primary">{item.label}</span>
                                                    {assignableScopes === item.value && (
                                                        <span className="text-[11px] text-fluent-brand-fg font-semibold">Active</span>
                                                    )}
                                                </div>
                                                <span className="font-mono text-[11px] text-fluent-fg-secondary truncate">{item.value}</span>
                                                <span className="text-[11px] text-fluent-fg-tertiary">{item.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick-select Scope Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            {QUICK_SCOPES.map(item => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => setAssignableScopes(item.value)}
                                    className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium border transition-all duration-200 ease-in-out active:scale-95 ${assignableScopes === item.value
                                        ? 'bg-fluent-brand-bg text-white border-fluent-brand-bg font-semibold'
                                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Specifies the Azure management boundary where this role can be assigned (Subscription, Resource Group, or Management Group).
                        </span>
                    </div>
                </div>

                {/* Column 2: Description & Governance */}
                <div className="flex flex-col bg-fluent-bg-canvas border border-fluent-stroke-subtle rounded-lg p-4 sm:p-4.5 gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-fluent-stroke-subtle">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-fluent-info-bg text-fluent-brand-fg shrink-0">
                            <Globe className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-[13px] font-semibold text-fluent-fg-primary">
                            Description & Governance
                        </h4>
                    </div>

                    {/* Field: Role Description */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="rbac-param-description" className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-fluent-cat-cyan-fg" title="Description token" />
                                Description
                            </label>
                            <span className="text-[11px] text-fluent-fg-tertiary">Role Summary</span>
                        </div>
                        <div className="relative flex items-start w-full">
                            <textarea
                                id="rbac-param-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the operational responsibilities and governance boundaries for this role..."
                                rows={2}
                                className="w-full px-3 py-2 pr-8 border rounded-[4px] outline-none text-[13px] transition-all duration-200 focus:border-fluent-brand-bg bg-fluent-bg-card text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary resize-y min-h-[68px]"
                            />
                            {description && (
                                <button
                                    type="button"
                                    onClick={() => setDescription('')}
                                    title="Clear description"
                                    aria-label="Clear description"
                                    className="absolute right-2 top-2 w-5 h-5 flex items-center justify-center rounded-sm text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Explains the purpose of the custom role and what level of operational access is granted.
                        </span>
                    </div>

                    {/* Field: Definition Summary & Azure RBAC Docs */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[13px] font-semibold text-fluent-fg-primary flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-fluent-cat-green-fg" title="Role status" />
                                Role Definition Summary
                            </label>
                            <a
                                href="https://learn.microsoft.com/azure/role-based-access-control/custom-roles"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Explore Microsoft Azure Custom Roles Documentation"
                                className="h-[32px] px-2.5 rounded-[4px] border transition-all duration-200 ease-in-out active:scale-95 shrink-0 inline-flex items-center gap-1.5 no-underline bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary"
                            >
                                <TechnologyIcon name="microsoft" className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-[12px] font-medium hidden sm:inline">RBAC Docs</span>
                                <ExternalLink className="w-3 h-3 text-fluent-fg-tertiary" />
                            </a>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[12px]" title="Role Type">
                                <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                                <span className="text-fluent-fg-tertiary">Type:</span>
                                <span className="font-medium text-fluent-fg-primary">CustomRole</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[12px]" title="Permitted Operations">
                                <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-cyan-fg shrink-0" />
                                <span className="text-fluent-fg-tertiary">Actions:</span>
                                <span className="font-mono font-medium text-fluent-fg-primary">{actions.length}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-card border border-fluent-stroke-subtle text-[12px]" title="Restricted Operations">
                                <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-red-fg shrink-0" />
                                <span className="text-fluent-fg-tertiary">NotActions:</span>
                                <span className="font-mono font-medium text-fluent-fg-primary">{notActions.length}</span>
                            </div>
                        </div>
                        <span className="text-[12px] text-fluent-fg-secondary">
                            Live metadata synthesized for ARM templates, Bicep modules, and Azure CLI definitions.
                        </span>
                    </div>
                </div>
            </div>

            {/* Role Templates & Presets Section */}
            <div className="border-t border-fluent-stroke-subtle p-4 sm:p-5 flex flex-col gap-3.5 bg-fluent-bg-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-fluent-brand-fg" />
                        <div>
                            <h4 className="text-[13px] font-semibold text-fluent-fg-primary leading-snug">
                                Role Archetype Presets & Starting Templates
                            </h4>
                            <p className="text-[11px] text-fluent-fg-secondary">
                                Quickly bootstrap custom roles with curated baseline permissions for common workloads
                            </p>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {templateCategories.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveTemplateCategory(cat)}
                                className={`px-2.5 py-1 rounded-[4px] text-[11px] font-medium border transition-all duration-200 ease-in-out active:scale-95 ${activeTemplateCategory === cat
                                    ? 'bg-fluent-brand-bg text-white border-fluent-brand-bg font-semibold shadow-xs'
                                    : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates List */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {filteredTemplates.map((tmpl) => {
                        const isSelected = roleName === tmpl.name;
                        return (
                            <button
                                key={tmpl.id}
                                type="button"
                                onClick={() => handleTemplateClick(tmpl.id)}
                                title={`${tmpl.description} (${tmpl.category})`}
                                className={`whitespace-nowrap shrink-0 text-left text-[12px] px-2.5 py-1 rounded-[4px] transition-all duration-200 ease-in-out active:scale-[0.98] border ${
                                    isSelected 
                                        ? 'bg-fluent-brand-bg text-white font-semibold border-fluent-brand-bg shadow-xs' 
                                        : 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:text-fluent-fg-primary hover:border-fluent-fg-primary'
                                }`}
                            >
                                {tmpl.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

RbacConfigPanel.propTypes = {
    roleName: PropTypes.string.isRequired,
    setRoleName: PropTypes.func.isRequired,
    description: PropTypes.string.isRequired,
    setDescription: PropTypes.func.isRequired,
    assignableScopes: PropTypes.string.isRequired,
    setAssignableScopes: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.string),
    notActions: PropTypes.arrayOf(PropTypes.string),
    onResetRole: PropTypes.func.isRequired,
    onApplyTemplate: PropTypes.func.isRequired,
    onToggleMinimize: PropTypes.func.isRequired
};
