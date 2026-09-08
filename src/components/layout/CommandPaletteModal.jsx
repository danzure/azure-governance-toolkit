import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    X,
    ArrowRight,
    ExternalLink,
    Copy,
    Check,
    Compass,
    CheckCircle2,
    History
} from 'lucide-react';

import {
    buildSearchIndex,
    filterSearchIndex,
    groupResultsByCategory,
    getRecentCommandIds,
    saveRecentCommandId,
    removeRecentCommandId,
    clearRecentCommands,
    getInitialCommandPaletteItems
} from '../../utils/commandPaletteUtils';

/**
 * CommandPaletteItem Component
 * 
 * Memoized single result item row. Prevents re-rendering 210 items on every arrow key press,
 * ensuring only the previously active and newly active items re-render for 60 FPS keyboard traversal.
 */
const CommandPaletteItem = React.memo(function CommandPaletteItem({
    item,
    isActive,
    itemIndex,
    isExternal,
    copiedNotification,
    onSelect,
    onMouseMove,
    onRemoveRecent
}) {
    const IconComponent = item.iconComponent;

    return (
        <div
            role="option"
            aria-selected={isActive}
            data-active={isActive ? 'true' : 'false'}
            data-index={itemIndex}
            onClick={() => onSelect(item)}
            onMouseMove={onMouseMove}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] cursor-pointer transition-colors duration-150 select-none gap-3 ${
                isActive
                    ? 'bg-[#f0f0f0] dark:bg-[#333333] text-fluent-fg-primary'
                    : 'bg-transparent text-fluent-fg-secondary hover:bg-[#f0f0f0] dark:hover:bg-[#333333] hover:text-fluent-fg-primary'
            }`}
        >
            {/* Item Left: Icon Box + Titles */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                    className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
                        item.iconUrl
                            ? 'bg-fluent-bg-subtle'
                            : item.isRecent
                            ? 'bg-fluent-bg-subtle text-fluent-fg-secondary'
                            : isActive
                            ? 'bg-fluent-cat-blue-bg text-fluent-cat-blue-fg'
                            : 'bg-fluent-bg-subtle text-fluent-fg-secondary'
                    }`}
                >
                    {item.iconUrl ? (
                        <img
                            src={item.iconUrl}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-5 h-5 object-contain bg-transparent"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : item.isRecent ? (
                        <History className="w-4 h-4 shrink-0" />
                    ) : IconComponent ? (
                        <IconComponent className="w-4 h-4 shrink-0" />
                    ) : (
                        <Compass className="w-4 h-4 shrink-0" />
                    )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[14px] font-medium text-fluent-fg-primary truncate">
                            {item.title}
                        </span>

                        {/* Abbreviation badge */}
                        {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-[2px] bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary shrink-0 leading-none">
                                {item.badge}
                            </span>
                        )}

                        {/* Category color tag */}
                        {item.categoryTag && item.categoryColors && (
                            <span
                                className={`px-1.5 py-0.5 text-[10px] font-medium rounded-[2px] shrink-0 leading-none ${item.categoryColors.bgClass} ${item.categoryColors.textClass}`}
                            >
                                {item.categoryTag}
                            </span>
                        )}

                        {/* Copied feedback badge */}
                        {item.id === 'action-copy-url' && copiedNotification && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-[2px] bg-fluent-cat-green-bg text-fluent-cat-green-fg inline-flex items-center gap-1 animate-fade-in shrink-0">
                                <Check className="w-3 h-3" /> Copied!
                            </span>
                        )}
                    </div>

                    <span className="text-[12px] text-fluent-fg-tertiary truncate leading-tight mt-0.5">
                        {item.subtitle}
                    </span>
                </div>
            </div>

            {/* Item Right: Action cues & remove recent button */}
            <div className="flex items-center gap-2 shrink-0">
                {item.isRecent && onRemoveRecent && (
                    <button
                        type="button"
                        title="Remove from recent"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveRecent(item.originalId || item.id);
                        }}
                        className="p-1 rounded-[2px] hover:bg-fluent-bg-hover text-fluent-fg-tertiary hover:text-fluent-state-danger transition-colors cursor-pointer"
                        aria-label="Remove from recent commands"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
                {isExternal ? (
                    <ExternalLink className="w-4 h-4 text-fluent-fg-tertiary" />
                ) : item.actionType === 'copy-url' ? (
                    <Copy className="w-4 h-4 text-fluent-fg-tertiary" />
                ) : item.actionType === 'set-theme' && item.badge === 'Active' ? (
                    <CheckCircle2 className="w-4 h-4 text-fluent-brand-fg" />
                ) : (
                    <ArrowRight className="w-4 h-4 text-fluent-fg-tertiary" />
                )}
            </div>
        </div>
    );
});

CommandPaletteItem.propTypes = {
    item: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    itemIndex: PropTypes.number.isRequired,
    isExternal: PropTypes.bool.isRequired,
    copiedNotification: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onRemoveRecent: PropTypes.func
};

/**
 * CommandPaletteModal Component
 * 
 * Asynchronously loaded modal surface containing search query state,
 * indexed filtering, auto-scrolling list, and keycap footer.
 */
export default function CommandPaletteModal({ onOpenChange, themePref = 'system', onSetTheme }) {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [copiedNotification, setCopiedNotification] = useState(false);
    const [recentIds, setRecentIds] = useState(() => getRecentCommandIds());

    const searchInputRef = useRef(null);
    const resultsContainerRef = useRef(null);
    const lastMousePosRef = useRef({ x: -1, y: -1 });
    const isKeyboardNavRef = useRef(false);
    const lastKeyboardTimeRef = useRef(0);

    // Autofocus input on initial mount
    useEffect(() => {
        requestAnimationFrame(() => {
            searchInputRef.current?.focus();
        });
    }, []);

    // Retrieve cached search index (O(1) retrieval)
    const searchIndex = useMemo(() => buildSearchIndex(themePref), [themePref]);

    // Active displayed items: initial recommendation view when query is empty, or filtered items
    const displayedResults = useMemo(() => {
        if (!query.trim()) {
            return getInitialCommandPaletteItems(searchIndex, recentIds);
        }
        return filterSearchIndex(searchIndex, query);
    }, [query, searchIndex, recentIds]);

    // Group results by category
    const groupedResults = useMemo(() => {
        return groupResultsByCategory(displayedResults);
    }, [displayedResults]);

    // Flat list of matching items for indexed keyboard navigation
    const flatItems = displayedResults;

    // Clamp selected index within range
    useEffect(() => {
        setSelectedIndex((prev) => {
            if (flatItems.length === 0) return 0;
            return Math.min(prev, flatItems.length - 1);
        });
    }, [flatItems.length]);

    // Execute the action for a given item
    const executeAction = useCallback(
        (item) => {
            if (!item) return;

            // Record to recent commands
            const rawId = item.originalId || item.id;
            saveRecentCommandId(rawId);
            setRecentIds(getRecentCommandIds());

            if (item.actionType === 'route' || item.actionType === 'service' || item.actionType === 'ca-policy' || item.actionType === 'rbac-role') {
                onOpenChange(false);
                navigate(item.target);
            } else if (item.actionType === 'external') {
                window.open(item.target, '_blank', 'noopener,noreferrer');
                onOpenChange(false);
            } else if (item.actionType === 'set-theme' && onSetTheme) {
                onSetTheme(item.themeValue);
            } else if (item.actionType === 'copy-url') {
                if (typeof window !== 'undefined') {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopiedNotification(true);
                    setTimeout(() => {
                        setCopiedNotification(false);
                        onOpenChange(false);
                    }, 1000);
                }
            }
        },
        [navigate, onOpenChange, onSetTheme]
    );

    // Remove single recent command
    const handleRemoveRecent = useCallback((idToRemove) => {
        removeRecentCommandId(idToRemove);
        setRecentIds(getRecentCommandIds());
    }, []);

    // Clear all recent commands
    const handleClearRecents = useCallback(() => {
        clearRecentCommands();
        setRecentIds([]);
    }, []);

    // Keyboard navigation within the open dialog
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                isKeyboardNavRef.current = true;
                lastKeyboardTimeRef.current = Date.now();
                setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatItems.length));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                isKeyboardNavRef.current = true;
                lastKeyboardTimeRef.current = Date.now();
                setSelectedIndex((prev) => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
            } else if (e.key === 'Home') {
                e.preventDefault();
                isKeyboardNavRef.current = true;
                lastKeyboardTimeRef.current = Date.now();
                setSelectedIndex(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                isKeyboardNavRef.current = true;
                lastKeyboardTimeRef.current = Date.now();
                setSelectedIndex(Math.max(0, flatItems.length - 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (flatItems.length > 0 && flatItems[selectedIndex]) {
                    executeAction(flatItems[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onOpenChange(false);
            }
        },
        [executeAction, flatItems, onOpenChange, selectedIndex]
    );

    // Anti-jitter mouse hover handling during keyboard navigation
    const handleItemMouseMove = useCallback(
        (e) => {
            const indexAttr = e.currentTarget.getAttribute('data-index');
            if (indexAttr === null) return;
            const itemIndex = Number(indexAttr);

            if (lastMousePosRef.current.x === -1 && lastMousePosRef.current.y === -1) {
                lastMousePosRef.current = { x: e.clientX, y: e.clientY };
                if (!isKeyboardNavRef.current && selectedIndex !== itemIndex) {
                    setSelectedIndex(itemIndex);
                }
                return;
            }

            const dx = e.clientX - lastMousePosRef.current.x;
            const dy = e.clientY - lastMousePosRef.current.y;
            const distance = Math.hypot(dx, dy);

            if (isKeyboardNavRef.current) {
                const timeSinceKey = Date.now() - lastKeyboardTimeRef.current;
                if (timeSinceKey > 150 && distance > 6) {
                    isKeyboardNavRef.current = false;
                    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
                    setSelectedIndex(itemIndex);
                }
                return;
            }

            if (distance > 0) {
                lastMousePosRef.current = { x: e.clientX, y: e.clientY };
                if (selectedIndex !== itemIndex) {
                    setSelectedIndex(itemIndex);
                }
            }
        },
        [selectedIndex]
    );

    // Scroll active item into view inside the list container without jumping the main page
    useEffect(() => {
        const container = resultsContainerRef.current;
        if (!container) return;

        const activeEl = container.querySelector('[data-active="true"]');
        if (!activeEl) return;

        const containerRect = container.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        if (activeRect.bottom > containerRect.bottom) {
            container.scrollTop += (activeRect.bottom - containerRect.bottom + 6);
        } else if (activeRect.top < containerRect.top) {
            container.scrollTop -= (containerRect.top - activeRect.top + 6);
        }
    }, [selectedIndex]);

    let currentGlobalIndex = -1;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in dark:bg-black/60 flex items-center justify-center p-3 sm:p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onOpenChange(false);
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
        >
            <div
                className="w-full max-w-[42rem] bg-fluent-bg-card dark:bg-[#292929] rounded-xl border border-fluent-stroke-subtle dark:border-[#383838] shadow-flyout flex flex-col overflow-hidden animate-scale-in text-fluent-fg-primary max-h-[82vh] sm:max-h-[580px]"
                onKeyDown={handleKeyDown}
            >
                {/* Search Header */}
                <div className="px-4 py-3 border-b border-fluent-stroke-subtle dark:border-[#333333] bg-fluent-bg-canvas flex items-center gap-3 shrink-0">
                    <div className="flex-1 flex items-center gap-2.5 pb-1.5 border-b-2 border-fluent-brand-bg transition-all min-w-0 relative">
                        <Search className="w-4 h-4 text-fluent-fg-secondary shrink-0" aria-hidden="true" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedIndex(0);
                                if (resultsContainerRef.current) {
                                    resultsContainerRef.current.scrollTop = 0;
                                }
                            }}
                            placeholder="Search sections, tools, services, actions..."
                            className="command-palette-input flex-1 bg-transparent text-[15px] sm:text-[16px] text-fluent-fg-primary placeholder:text-fluent-fg-tertiary outline-none min-w-0 border-none p-0 focus:outline-none focus:ring-0 shadow-none"
                            aria-label="Search command palette"
                        />
                        {query ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    setSelectedIndex(0);
                                    searchInputRef.current?.focus();
                                }}
                                className="p-0.5 rounded hover:bg-fluent-bg-hover text-fluent-fg-tertiary hover:text-fluent-fg-primary transition-colors shrink-0"
                                aria-label="Clear search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        ) : null}
                    </div>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-fluent-bg-subtle text-fluent-fg-tertiary border border-fluent-stroke-subtle rounded-[2px] shrink-0 leading-none">
                        ESC
                    </span>
                </div>

                {/* Results Body */}
                <div
                    ref={resultsContainerRef}
                    className="max-h-[26rem] overflow-y-auto px-2 py-2 flex flex-col gap-0.5 overscroll-contain"
                    role="listbox"
                    aria-label="Command palette search results"
                >
                    {flatItems.length === 0 ? (
                        <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-lg bg-fluent-bg-subtle border border-fluent-stroke-subtle flex items-center justify-center mb-3">
                                <Search className="w-5 h-5 text-fluent-fg-tertiary" />
                            </div>
                            <p className="text-[14px] font-semibold text-fluent-fg-primary mb-1">
                                No results found for &ldquo;{query}&rdquo;
                            </p>
                            <p className="text-[12px] text-fluent-fg-tertiary max-w-[340px] mb-4">
                                Try searching for &ldquo;Key vault&rdquo;, &ldquo;Virtual machine&rdquo;, &ldquo;MFA&rdquo;, or &ldquo;Theme&rdquo;.
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedResults).map(([category, items]) => (
                            <div key={category} className="flex flex-col gap-0.5 mb-1.5">
                                <div className="px-3 py-1 text-[12px] font-semibold text-fluent-fg-tertiary uppercase tracking-[0.05em] flex items-center justify-between">
                                    <span>{category}</span>
                                    {category === 'Recent' && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClearRecents();
                                            }}
                                            className="text-[11px] font-normal lowercase tracking-normal text-fluent-fg-tertiary hover:text-fluent-state-danger transition-colors cursor-pointer px-1 py-0.5 rounded"
                                            aria-label="Clear recent commands"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                {items.map((item) => {
                                    currentGlobalIndex += 1;
                                    const itemIndex = currentGlobalIndex;
                                    const isActive = itemIndex === selectedIndex;
                                    const isExternal = item.actionType === 'external';

                                    return (
                                        <CommandPaletteItem
                                            key={item.id}
                                            item={item}
                                            isActive={isActive}
                                            itemIndex={itemIndex}
                                            isExternal={isExternal}
                                            copiedNotification={copiedNotification}
                                            onSelect={executeAction}
                                            onMouseMove={handleItemMouseMove}
                                            onRemoveRecent={handleRemoveRecent}
                                        />
                                    );
                                })}
                            </div>
                        ))
                    )}

                    {!query && flatItems.length > 0 && (
                        <div className="px-3 py-2 text-center text-[11px] text-fluent-fg-tertiary border-t border-fluent-stroke-subtle mt-1 select-none">
                            Type to search across all 156+ Azure services, CA policies, and RBAC templates
                        </div>
                    )}
                </div>

                {/* Footer Bar */}
                <div className="px-4 py-2 border-t border-fluent-stroke-subtle bg-fluent-bg-canvas flex items-center justify-between text-[12px] text-fluent-fg-tertiary shrink-0 select-none">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="inline-flex items-center gap-1.5">
                            <kbd className="px-1.5 py-0.5 rounded-[2px] bg-fluent-bg-subtle border border-fluent-stroke-subtle font-mono text-[10px] font-semibold text-fluent-fg-secondary leading-none">
                                ↑
                            </kbd>
                            <kbd className="px-1.5 py-0.5 rounded-[2px] bg-fluent-bg-subtle border border-fluent-stroke-subtle font-mono text-[10px] font-semibold text-fluent-fg-secondary leading-none">
                                ↓
                            </kbd>
                            <span>to navigate</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <kbd className="px-1.5 py-0.5 rounded-[2px] bg-fluent-bg-subtle border border-fluent-stroke-subtle font-mono text-[10px] font-semibold text-fluent-fg-secondary leading-none">
                                ↵
                            </kbd>
                            <span>to select</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <kbd className="px-1.5 py-0.5 rounded-[2px] bg-fluent-bg-subtle border border-fluent-stroke-subtle font-mono text-[10px] font-semibold text-fluent-fg-secondary leading-none">
                                ESC
                            </kbd>
                            <span>to close</span>
                        </span>
                    </div>

                    <div className="text-[12px] text-fluent-fg-tertiary">
                        {flatItems.length} {flatItems.length === 1 ? 'item' : 'items'}
                    </div>
                </div>
            </div>
        </div>
    );
}

CommandPaletteModal.propTypes = {
    onOpenChange: PropTypes.func.isRequired,
    themePref: PropTypes.oneOf(['system', 'light', 'dark']),
    onSetTheme: PropTypes.func
};

