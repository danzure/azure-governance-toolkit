import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Info, ChevronDown, ExternalLink, Sliders } from 'lucide-react';
import PermissionsSelector from '../components/rbac/PermissionsSelector';
import RbacConfigPanel from '../components/rbac/RbacConfigPanel';
import RbacPromptBar from '../components/ai/RbacPromptBar';
import { RBAC_ROLE_TEMPLATES } from '../data/rbacData';

export default function RbacDesignerPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isConfigMinimized, setIsConfigMinimized] = useState(true);
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [assignableScopes, setAssignableScopes] = useState('');
    const [actions, setActions] = useState([]);
    const [notActions, setNotActions] = useState([]);
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
    const aiInputRef = useRef(null);

    // Keyboard shortcuts handler:
    // - Escape: Unfocus AI prompt bar
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (document.activeElement === aiInputRef.current) {
                    aiInputRef.current?.blur();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [aiInputRef]);

    const handleAddAction = useCallback((op) => {
        setActions(prev => prev.includes(op) ? prev : [...prev, op]);
        setNotActions(prev => prev.filter(a => a !== op));
    }, []);

    const handleRemoveAction = useCallback((op) => {
        setActions(prev => prev.filter(a => a !== op));
    }, []);

    const handleAddNotAction = useCallback((op) => {
        setNotActions(prev => prev.includes(op) ? prev : [...prev, op]);
        setActions(prev => prev.filter(a => a !== op));
    }, []);

    const handleRemoveNotAction = useCallback((op) => {
        setNotActions(prev => prev.filter(a => a !== op));
    }, []);

    const handleClearPermissions = useCallback(() => {
        setActions([]);
        setNotActions([]);
    }, []);

    const handleClearActions = useCallback(() => {
        setActions([]);
    }, []);

    const handleClearNotActions = useCallback(() => {
        setNotActions([]);
    }, []);

    // Convert comma separated string to array for export
    const parseScopes = (scopesString) => {
        return scopesString.split(',').map(s => s.trim()).filter(Boolean);
    };

    const applyTemplate = useCallback((templateId) => {
        if (templateId === 'clear') {
            setRoleName('');
            setDescription('');
            setAssignableScopes('');
            setActions([]);
            setNotActions([]);
            return;
        }

        const template = RBAC_ROLE_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            setRoleName(template.name);
            setDescription(template.description);
            setAssignableScopes(template.assignableScopes);
            setActions(template.actions);
            setNotActions(template.notActions);
        }
    }, []);

    // Deep-link integration from Command Palette (?template=)
    useEffect(() => {
        const templateId = searchParams.get('template');
        if (templateId) {
            applyTemplate(templateId);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams, applyTemplate]);

    const handleToggleMinimize = useCallback(() => setIsConfigMinimized(prev => !prev), []);

    // Format scope for clean display in collapsed parameter strip
    const formatScopeBadge = (scope) => {
        if (!scope) return '/';
        if (scope === '/') return 'Root (/)';
        if (scope.includes('/resourceGroups/')) {
            const parts = scope.split('/resourceGroups/');
            return parts[1] ? `rg:${parts[1].split('/')[0]}` : scope;
        }
        if (scope.includes('/managementGroups/')) {
            const parts = scope.split('/managementGroups/');
            return parts[1] ? `mg:${parts[1].split('/')[0]}` : scope;
        }
        if (scope.includes('/subscriptions/')) {
            const parts = scope.split('/subscriptions/');
            return parts[1] ? `sub:${parts[1].slice(0, 8)}...` : scope;
        }
        return scope.length > 20 ? `${scope.slice(0, 18)}...` : scope;
    };

    // Live synthesized role definition schema string
    const liveRoleSchema = useMemo(() => {
        const cleanName = roleName ? roleName.trim().replace(/\s+/g, '') : 'CustomRole';
        return `${cleanName}-Definition`;
    }, [roleName]);

    return (
        <div className="flex flex-col min-w-0 w-full">
            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 flex-1 flex flex-col gap-4 sm:gap-5 pb-12">
                
                {/* Header */}
                <div className="flex flex-col gap-3 mb-1">
                    <div>
                        <h1 className="text-[20px] sm:text-[24px] font-semibold text-fluent-fg-primary mb-2">
                            RBAC Custom Role Designer
                        </h1>
                        <p className="text-[14px] text-fluent-fg-secondary max-w-3xl mt-1 block">
                            Design and generate JSON definitions for Azure Custom Roles by selecting specific resource provider operations.
                        </p>
                    </div>
                </div>

                {/* About / Introduction */}
                <div className="bg-fluent-bg-subtle rounded-lg flex flex-col overflow-hidden mb-1">
                    <div
                        className="px-3 py-1.5 flex flex-col text-sm text-fluent-fg-secondary cursor-pointer hover:bg-fluent-bg-hover transition-colors"
                        onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
                        role="button"
                        aria-expanded={isGuidanceExpanded}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsGuidanceExpanded(!isGuidanceExpanded);
                            }
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 flex-shrink-0 text-fluent-brand-fg" />
                            <p className="text-fluent-fg-primary text-[13px]">
                                How to use this tool
                            </p>
                            <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${isGuidanceExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        <div className={`grid transition-[grid-template-rows] duration-250 ease-out ${isGuidanceExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden min-h-0">
                                <div className={`mt-3 flex flex-col gap-3 text-[13px] text-fluent-fg-secondary cursor-default transition-opacity duration-200 ${isGuidanceExpanded ? 'opacity-100' : 'opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                                    <p>
                                        This tool generates standardized JSON definitions for <a href="https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Azure Custom Roles <ExternalLink className="w-3 h-3 ml-0.5" /></a> based on your selected actions and data actions.
                                    </p>
                                    <ul className="list-disc pl-5 ml-2 flex flex-col gap-2">
                                        <li><strong>Describe Intent:</strong> Type what your custom role needs to do in the AI prompt bar to generate permissions automatically.</li>
                                        <li><strong>Define Properties:</strong> Customize role name, description, and assignable scopes under manual configuration.</li>
                                        <li><strong>Select Permissions:</strong> Search and refine specific operations to allow (Actions) or explicitly deny (NotActions).</li>
                                        <li><strong>Export Definition:</strong> Copy or download the generated JSON role definition to deploy directly to Azure.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Smart Role Generator (Primary Interaction Point) */}
                <RbacPromptBar
                    ref={aiInputRef}
                    setRoleName={setRoleName}
                    setDescription={setDescription}
                    setAssignableScopes={setAssignableScopes}
                    setActions={setActions}
                    setNotActions={setNotActions}
                    onResetAll={() => applyTemplate('clear')}
                />

                {/* Manual Configuration: Collapsed Summary Strip OR Expanded RbacConfigPanel */}
                {isConfigMinimized ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-3 sm:px-4 py-2 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card shadow-soft transition-all animate-fade-in">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <div className="flex items-center gap-1.5 shrink-0 text-fluent-fg-secondary">
                                <Sliders className="w-3.5 h-3.5 text-fluent-brand-fg" />
                                <span className="text-[12px] font-semibold text-fluent-fg-primary">Parameters:</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[12px] transition-colors" title="Custom Role Name">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-purple-fg shrink-0" />
                                    <span className="text-fluent-fg-tertiary">Role:</span>
                                    <span className="font-medium text-fluent-fg-primary">{roleName || 'Custom Role'}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[12px] transition-colors" title="Assignable Scope">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-orange-fg shrink-0" />
                                    <span className="text-fluent-fg-tertiary">Scope:</span>
                                    <span className="font-medium text-fluent-fg-primary font-mono">{formatScopeBadge(assignableScopes)}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[12px] transition-colors" title="Permitted Actions Count">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-cyan-fg shrink-0" />
                                    <span className="text-fluent-fg-tertiary">Actions:</span>
                                    <span className="font-mono font-medium text-fluent-fg-primary">{actions.length}</span>
                                </div>
                                {notActions.length > 0 && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-[12px] transition-colors" title="Restricted NotActions Count">
                                        <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-red-fg shrink-0" />
                                        <span className="text-fluent-fg-tertiary">NotActions:</span>
                                        <span className="font-mono font-medium text-fluent-fg-primary">{notActions.length}</span>
                                    </div>
                                )}
                                <span className="hidden lg:inline-flex items-center font-mono text-[11px] text-fluent-fg-secondary px-2.5 py-1 rounded-[4px] bg-fluent-bg-canvas border border-fluent-stroke-subtle" title="Active role definition identifier">
                                    {liveRoleSchema}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleToggleMinimize}
                            className="h-[32px] px-3 rounded-[4px] border transition-colors inline-flex items-center justify-center gap-1.5 bg-fluent-bg-card border-fluent-stroke-strong text-fluent-fg-secondary hover:border-fluent-fg-primary hover:text-fluent-fg-primary text-[13px] font-medium active:scale-95 shrink-0"
                        >
                            <Sliders className="w-3.5 h-3.5 text-fluent-brand-fg" />
                            <span>Customize Parameters</span>
                            <ChevronDown className="w-3.5 h-3.5 text-fluent-fg-tertiary" />
                        </button>
                    </div>
                ) : (
                    <RbacConfigPanel
                        roleName={roleName}
                        setRoleName={setRoleName}
                        description={description}
                        setDescription={setDescription}
                        assignableScopes={assignableScopes}
                        setAssignableScopes={setAssignableScopes}
                        actions={actions}
                        notActions={notActions}
                        onResetRole={() => applyTemplate('clear')}
                        onApplyTemplate={applyTemplate}
                        onToggleMinimize={handleToggleMinimize}
                    />
                )}

                {/* Permissions Selector & Custom Role JSON Preview */}
                <div className="bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft p-4 flex flex-col">
                    <PermissionsSelector 
                        roleName={roleName}
                        description={description}
                        assignableScopes={parseScopes(assignableScopes)}
                        actions={actions}
                        notActions={notActions}
                        onAddAction={handleAddAction}
                        onRemoveAction={handleRemoveAction}
                        onAddNotAction={handleAddNotAction}
                        onRemoveNotAction={handleRemoveNotAction}
                        onClearPermissions={handleClearPermissions}
                        onClearActions={handleClearActions}
                        onClearNotActions={handleClearNotActions}
                    />
                </div>
            </div>
        </div>
    );
}

