import { useState, useCallback, useRef, useEffect } from 'react';
import { ShieldCheck, Info, ChevronDown, ChevronRight, ExternalLink, RotateCcw } from 'lucide-react';
import PermissionsSelector from '../components/rbac/PermissionsSelector';
import RoleExportPanel from '../components/rbac/RoleExportPanel';
import Tooltip from '../components/shared/Tooltip';

export default function RbacDesignerPage() {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [assignableScopes, setAssignableScopes] = useState('');
    const [actions, setActions] = useState([]);
    const [notActions, setNotActions] = useState([]);
    const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
    const [isExamplesOpen, setIsExamplesOpen] = useState(false);
    const examplesRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (examplesRef.current && !examplesRef.current.contains(event.target)) {
                setIsExamplesOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddAction = useCallback((op) => {
        setActions(prev => prev.includes(op) ? prev : [...prev, op]);
    }, []);

    const handleRemoveAction = useCallback((op) => {
        setActions(prev => prev.filter(a => a !== op));
    }, []);

    const handleAddNotAction = useCallback((op) => {
        setNotActions(prev => prev.includes(op) ? prev : [...prev, op]);
    }, []);

    const handleRemoveNotAction = useCallback((op) => {
        setNotActions(prev => prev.filter(a => a !== op));
    }, []);

    // Convert comma separated string to array for export
    const parseScopes = (scopesString) => {
        return scopesString.split(',').map(s => s.trim()).filter(Boolean);
    };

    const applyTemplate = (type) => {
        if (type === 'vmOperator') {
            setRoleName('Virtual Machine Operator');
            setDescription('Can start, stop, restart, and monitor virtual machines, and read related network interfaces.');
            setAssignableScopes('/subscriptions/00000000-0000-0000-0000-000000000000');
            setActions([
                'Microsoft.Compute/virtualMachines/start/action',
                'Microsoft.Compute/virtualMachines/restart/action',
                'Microsoft.Compute/virtualMachines/deallocate/action',
                'Microsoft.Compute/virtualMachines/read',
                'Microsoft.Compute/virtualMachines/instanceView/read',
                'Microsoft.Network/networkInterfaces/read'
            ]);
            setNotActions([]);
        } else if (type === 'networkAdmin') {
            setRoleName('Network Administrator');
            setDescription('Can manage all network resources but cannot delete virtual networks.');
            setAssignableScopes('/subscriptions/00000000-0000-0000-0000-000000000000');
            setActions([
                'Microsoft.Network/*'
            ]);
            setNotActions([
                'Microsoft.Network/virtualNetworks/delete'
            ]);
        } else if (type === 'resourceReader') {
            setRoleName('Global Resource Reader (No Secrets)');
            setDescription('Read-only access to all resources except Key Vault secrets and keys.');
            setAssignableScopes('/subscriptions/00000000-0000-0000-0000-000000000000');
            setActions([
                '*/read'
            ]);
            setNotActions([
                'Microsoft.KeyVault/vaults/secrets/read',
                'Microsoft.KeyVault/vaults/keys/read'
            ]);
        } else if (type === 'kvSecretUser') {
            setRoleName('Key Vault Secret User');
            setDescription('Read secrets from Key Vaults but cannot manage or create them.');
            setAssignableScopes('/subscriptions/00000000-0000-0000-0000-000000000000');
            setActions([
                'Microsoft.KeyVault/vaults/read',
                'Microsoft.KeyVault/vaults/secrets/read'
            ]);
            setNotActions([]);
        } else if (type === 'aksAdmin') {
            setRoleName('AKS Cluster Admin');
            setDescription('Full management access to AKS clusters including credential retrieval.');
            setAssignableScopes('/subscriptions/00000000-0000-0000-0000-000000000000');
            setActions([
                'Microsoft.ContainerService/managedClusters/*'
            ]);
            setNotActions([]);
        } else if (type === 'clear') {
            setRoleName('');
            setDescription('');
            setAssignableScopes('');
            setActions([]);
            setNotActions([]);
        }
    };

    return (
        <div className="flex flex-col min-w-0 w-full">
            <div className="max-w-[1600px] w-full min-w-0 mx-auto px-3 sm:px-6 pt-4 sm:pt-6 flex-1 flex flex-col gap-6 pb-12">
                
                {/* Header */}
                <div className="flex flex-col gap-3 mb-2">
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
                            {isGuidanceExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-0.5" /> : <ChevronRight className="w-3.5 h-3.5 ml-0.5" />}
                        </div>
                        {isGuidanceExpanded && (
                            <div className="mt-3 flex flex-col gap-3 text-[13px] text-fluent-info-text dark:text-fluent-fg-secondary cursor-default" onClick={(e) => e.stopPropagation()}>
                                <p>
                                    This tool generates standardized JSON definitions for <a href="https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles" target="_blank" rel="noopener noreferrer" className="text-fluent-brand-fg hover:underline inline-flex items-center gap-0.5 font-medium">Azure Custom Roles <ExternalLink className="w-3 h-3 ml-0.5" /></a> based on your selected actions and data actions.
                                </p>
                                <ul className="list-disc pl-5 ml-2 flex flex-col gap-2">
                                    <li><strong>Define Properties:</strong> Set a clear role name, description, and the assignable scopes where the role can be applied.</li>
                                    <li><strong>Select Permissions:</strong> Search and add specific operations to allow (Actions) or explicitly deny (NotActions) from the available resource providers.</li>
                                    <li><strong>Export Definition:</strong> Copy or download the generated JSON role definition to deploy directly to Azure.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Unified Designer Configuration */}
                <div className="bg-fluent-bg-card rounded-lg border border-fluent-stroke-subtle shadow-soft p-4 flex flex-col gap-8">
                    {/* Role Metadata Configuration */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-2 border-b border-fluent-stroke-subtle pb-2">
                            <Info className="w-5 h-5 text-fluent-brand-fg" />
                            <h3 className="text-[16px] font-semibold text-fluent-fg-primary">Role Properties</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-fluent-fg-primary block">Role Name</label>
                                <input 
                                    type="text"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    placeholder="e.g. Virtual Machine Operator"
                                    className="w-full px-3 h-[32px] border rounded outline-none text-[13px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-canvas text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-fluent-fg-primary block">Assignable Scopes</label>
                                <div className="flex items-center w-full h-[32px] border rounded transition-all duration-200 focus-within:border-fluent-brand-bg focus-within:ring-2 focus-within:ring-fluent-brand-bg/20 bg-fluent-bg-canvas border-fluent-stroke-strong overflow-visible relative">
                                    <input 
                                        type="text"
                                        value={assignableScopes}
                                        onChange={(e) => setAssignableScopes(e.target.value)}
                                        placeholder="e.g. /subscriptions/00000000-0000-0000-0000-000000000000"
                                        className="flex-1 min-w-0 px-3 h-full outline-none text-[13px] font-mono bg-transparent text-fluent-fg-primary placeholder:text-fluent-fg-tertiary"
                                    />
                                    <div ref={examplesRef} className="h-full border-l border-fluent-stroke-subtle bg-fluent-bg-subtle flex items-center shrink-0 relative">
                                        <button 
                                            type="button"
                                            onClick={() => setIsExamplesOpen(!isExamplesOpen)}
                                            className="h-full px-3 text-[12px] bg-transparent border-none text-fluent-fg-secondary hover:text-fluent-brand-fg outline-none cursor-pointer font-medium flex items-center gap-1.5 focus:ring-0"
                                        >
                                            Examples...
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExamplesOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {isExamplesOpen && (
                                            <div className="absolute top-[100%] right-0 mt-1 w-56 bg-fluent-bg-card border border-fluent-stroke-subtle rounded shadow-flyout z-50 overflow-hidden animate-fade-in">
                                                {[
                                                    { label: 'Root (Tenant)', value: '/' },
                                                    { label: 'Management Group', value: '/providers/Microsoft.Management/managementGroups/my-mg' },
                                                    { label: 'Subscription', value: '/subscriptions/00000000-0000-0000-0000-000000000000' },
                                                    { label: 'Resource Group', value: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg' }
                                                ].map(ex => (
                                                    <button
                                                        key={ex.label}
                                                        type="button"
                                                        onClick={() => {
                                                            setAssignableScopes(ex.value);
                                                            setIsExamplesOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-[12px] text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary transition-colors cursor-pointer"
                                                    >
                                                        {ex.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label className="text-[13px] font-semibold text-fluent-fg-primary block">Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what this role allows..."
                                    className="w-full px-3 py-2 min-h-[60px] border rounded outline-none text-[13px] transition-all duration-200 focus:border-fluent-brand-bg focus:ring-2 focus:ring-fluent-brand-bg/20 bg-fluent-bg-canvas text-fluent-fg-primary border-fluent-stroke-strong placeholder:text-fluent-fg-tertiary resize-y"
                                />
                            </div>
                        </div>

                        {/* Examples Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <p className="text-[12px] font-semibold shrink-0 text-fluent-fg-secondary mr-2">Try a template:</p>
                            <button
                                type="button"
                                onClick={() => applyTemplate('vmOperator')}
                                className="whitespace-nowrap flex-shrink-0 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-card px-3 py-1 rounded-[4px] shadow-sm transition-all duration-200 ease-in-out active:scale-[0.98]"
                            >
                                Virtual Machine Operator
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTemplate('networkAdmin')}
                                className="whitespace-nowrap flex-shrink-0 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-card px-3 py-1 rounded-[4px] shadow-sm transition-all duration-200 ease-in-out active:scale-[0.98]"
                            >
                                Network Administrator
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTemplate('resourceReader')}
                                className="whitespace-nowrap flex-shrink-0 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-card px-3 py-1 rounded-[4px] shadow-sm transition-all duration-200 ease-in-out active:scale-[0.98]"
                            >
                                Safe Reader
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTemplate('kvSecretUser')}
                                className="whitespace-nowrap flex-shrink-0 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-card px-3 py-1 rounded-[4px] shadow-sm transition-all duration-200 ease-in-out active:scale-[0.98]"
                            >
                                Key Vault Secrets User
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTemplate('aksAdmin')}
                                className="whitespace-nowrap flex-shrink-0 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-card px-3 py-1 rounded-[4px] shadow-sm transition-all duration-200 ease-in-out active:scale-[0.98]"
                            >
                                AKS Cluster Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTemplate('clear')}
                                className="whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 text-left text-[12px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary hover:text-fluent-state-danger hover:border-fluent-state-danger hover:bg-fluent-bg-card px-3 py-1 rounded-[4px] shadow-sm transition-all duration-200 ease-in-out active:scale-[0.98] ml-auto"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Clear Fields
                            </button>
                        </div>
                    </div>

                    {/* Permissions Selector */}
                    <PermissionsSelector 
                        actions={actions}
                        notActions={notActions}
                        onAddAction={handleAddAction}
                        onRemoveAction={handleRemoveAction}
                        onAddNotAction={handleAddNotAction}
                        onRemoveNotAction={handleRemoveNotAction}
                    />
                </div>

                {/* Export Panel */}
                <RoleExportPanel 
                    roleName={roleName}
                    description={description}
                    assignableScopes={parseScopes(assignableScopes)}
                    actions={actions}
                    notActions={notActions}
                />
            </div>
        </div>
    );
}
