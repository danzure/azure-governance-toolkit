import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    Rss,
    RefreshCw,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Clock,
    AlertCircle,
    Info
} from 'lucide-react';
import { fetchAzureRss, AZURE_RSS_FEED_URL } from '../../utils/rssParser';

/**
 * Azure Service Updates RSS Feed Widget.
 * Can be rendered full-width or in modular columns.
 */
export default function AzureUpdatesFeed({ itemsPerPage: _itemsPerPage = 4 }) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [isFallback, setIsFallback] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [channelMeta, setChannelMeta] = useState({ title: 'Azure Service Updates', lastBuildDate: '' });

    const loadFeed = useCallback(async (forceRefresh = false) => {
        if (forceRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const data = await fetchAzureRss({ forceRefresh });
            setItems(data.items || []);
            setChannelMeta({
                title: data.title || 'Azure Service Updates',
                lastBuildDate: data.lastBuildDate || ''
            });
            setIsFallback(Boolean(data.isFallback));
            if (data.error && data.isFallback) {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message || 'Unable to load Azure updates.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadFeed(false);
    }, [loadFeed]);

    const feedScrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [visibleRange, setVisibleRange] = useState({ start: 1, end: 4 });

    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollStartRef = useRef(0);
    const hasDraggedRef = useRef(false);

    // Compute status counts for filter tabs
    const statusCounts = useMemo(() => {
        const counts = { all: items.length, launched: 0, preview: 0, retirement: 0, security: 0 };
        for (const item of items) {
            if (item.statusType === 'launched') counts.launched++;
            else if (item.statusType === 'preview') counts.preview++;
            else if (item.statusType === 'retirement') counts.retirement++;
            else if (item.statusType === 'security') counts.security++;
        }
        return counts;
    }, [items]);

    // Filter items based on active status tab
    const filteredItems = useMemo(() => {
        if (activeTab === 'all') return items;
        return items.filter((item) => item.statusType === activeTab);
    }, [items, activeTab]);

    const checkScrollState = useCallback(() => {
        const el = feedScrollRef.current;
        if (!el || filteredItems.length === 0) {
            setCanScrollLeft(false);
            setCanScrollRight(false);
            return;
        }

        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 2);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);

        const cardEl = el.firstElementChild;
        if (cardEl) {
            const cardWidth = cardEl.getBoundingClientRect().width;
            const gap = 10;
            const totalStep = cardWidth + gap;

            const firstIdx = Math.max(0, Math.round(scrollLeft / totalStep));
            const cardsInView = Math.max(1, Math.round(clientWidth / totalStep));

            const start = Math.min(filteredItems.length, firstIdx + 1);
            const end = Math.min(filteredItems.length, firstIdx + cardsInView);
            setVisibleRange({ start, end });
        }
    }, [filteredItems.length]);

    // Reset scroll position on active status tab changes
    useEffect(() => {
        const el = feedScrollRef.current;
        if (el) {
            el.scrollTo({ left: 0, behavior: 'instant' });
        }
        checkScrollState();
    }, [activeTab, checkScrollState]);

    // Attach scroll and resize observers
    useEffect(() => {
        const el = feedScrollRef.current;
        if (!el) return;

        checkScrollState();

        el.addEventListener('scroll', checkScrollState, { passive: true });
        window.addEventListener('resize', checkScrollState);

        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                checkScrollState();
            });
            resizeObserver.observe(el);
        }

        const timeoutId = setTimeout(checkScrollState, 150);

        return () => {
            clearTimeout(timeoutId);
            el.removeEventListener('scroll', checkScrollState);
            window.removeEventListener('resize', checkScrollState);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [checkScrollState, filteredItems.length, isLoading]);

    const scroll = (direction) => {
        const el = feedScrollRef.current;
        if (el) {
            const scrollAmount = direction === 'left' ? -el.clientWidth : el.clientWidth;
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Mouse drag scrolling handlers (for desktop gesture support without trackpad)
    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        const el = feedScrollRef.current;
        if (!el) return;

        isDraggingRef.current = true;
        startXRef.current = e.pageX;
        scrollStartRef.current = el.scrollLeft;
        hasDraggedRef.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        const el = feedScrollRef.current;
        if (!el) return;

        const delta = e.pageX - startXRef.current;
        if (Math.abs(delta) > 5) {
            hasDraggedRef.current = true;
            el.scrollLeft = scrollStartRef.current - delta;
        }
    };

    const handleMouseUpOrLeave = () => {
        isDraggingRef.current = false;
    };

    const handleResetFilters = () => {
        setActiveTab('all');
    };

    const getStatusBadgeClass = (statusType) => {
        switch (statusType) {
            case 'launched':
                return 'bg-fluent-cat-green-bg text-fluent-cat-green-fg border-fluent-cat-green-border';
            case 'preview':
                return 'bg-fluent-cat-blue-bg text-fluent-cat-blue-fg border-fluent-stroke-subtle';
            case 'retirement':
                return 'bg-fluent-cat-red-bg text-fluent-cat-red-fg border-fluent-stroke-subtle';
            case 'security':
                return 'bg-fluent-cat-purple-bg text-fluent-cat-purple-fg border-fluent-stroke-subtle';
            default:
                return 'bg-fluent-bg-subtle text-fluent-fg-secondary border-fluent-stroke-subtle';
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between gap-3 rounded-xl border border-fluent-stroke-subtle bg-fluent-bg-card p-3.5 sm:p-4 shadow-soft">
            {/* Streamlined Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-fluent-stroke-subtle">
                {/* Left Side: Title, Live indicator & Status Filter Tabs */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap min-w-0">
                    {/* Title & Live Feed Badge */}
                    <div className="flex items-center gap-2 min-w-0">
                        <a
                            href={AZURE_RSS_FEED_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 h-[26px] w-[26px] rounded-[4px] border border-fluent-stroke-subtle bg-fluent-cat-orange-bg hover:border-fluent-stroke-strong flex items-center justify-center transition-all active:scale-95 shadow-sm"
                            title="Open official RSS feed (XML)"
                            aria-label="Open official RSS feed (XML)"
                        >
                            <Rss className="w-3.5 h-3.5 text-fluent-cat-orange-fg" />
                        </a>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <h2 
                                className="text-[14.5px] sm:text-[15px] font-bold tracking-tight text-fluent-fg-primary truncate"
                                title={channelMeta.lastBuildDate ? `Last build: ${channelMeta.lastBuildDate}` : channelMeta.title}
                            >
                                Azure Service Updates
                            </h2>
                            {!isFallback ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-medium bg-fluent-bg-subtle border border-fluent-stroke-subtle text-fluent-fg-secondary shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-fluent-cat-green-fg animate-pulse" />
                                    Live
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-medium bg-fluent-cat-yellow-bg text-fluent-cat-yellow-fg border border-fluent-stroke-subtle shrink-0">
                                    <Info className="w-2.5 h-2.5" />
                                    Offline
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:block w-[1px] h-5 bg-fluent-stroke-subtle shrink-0" />

                    {/* Status Filter Tabs (Fluent 2 Segmented Control Track) */}
                    <div 
                        className="inline-flex items-center p-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle overflow-x-auto scrollbar-none shrink-0" 
                        role="tablist"
                        aria-label="Filter updates by status"
                    >
                        {[
                            { id: 'all', label: 'All', count: statusCounts.all },
                            { id: 'launched', label: 'GA', count: statusCounts.launched },
                            { id: 'preview', label: 'Preview', count: statusCounts.preview },
                            { id: 'retirement', label: 'Retirements', count: statusCounts.retirement },
                            { id: 'security', label: 'Security', count: statusCounts.security },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        h-[24px] px-2.5 rounded-[3px] text-[12px] font-medium transition-all duration-150 shrink-0 inline-flex items-center gap-1.5 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg
                                        ${isActive
                                            ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                            : 'bg-transparent text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border border-transparent'
                                        }
                                    `}
                                >
                                    <span>{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span
                                            className={`
                                                text-[10px] px-1.5 py-0.2 rounded-[3px] font-semibold leading-none transition-colors
                                                ${isActive
                                                    ? 'bg-fluent-info-bg text-fluent-brand-fg'
                                                    : 'bg-fluent-bg-card text-fluent-fg-tertiary border border-fluent-stroke-subtle'
                                                }
                                            `}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Integrated Cached Updates Notice */}
                    {error && isFallback && (
                        <div className="inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-subtle text-[12px] text-fluent-fg-secondary shrink-0 animate-fade-in">
                            <AlertCircle className="w-3.5 h-3.5 text-fluent-state-danger shrink-0" />
                            <span>Showing cached updates ({error}).</span>
                        </div>
                    )}
                </div>

                {/* Right Side: Pagination & Action Controls (Fluent 2 Standardized Controls) */}
                <div className="flex items-center gap-2 shrink-0 ml-auto">
                    {/* Page counter hint */}
                    {filteredItems.length > 0 && (
                        <span className="text-[12px] text-fluent-fg-tertiary hidden sm:inline font-medium">
                            {visibleRange.start}–{visibleRange.end} of {filteredItems.length}
                        </span>
                    )}

                    {/* Prev/Next Page Segmented Buttons */}
                    <div className="inline-flex items-center rounded-[4px] border border-fluent-stroke-subtle bg-fluent-bg-card shadow-sm overflow-hidden" role="group" aria-label="Pagination">
                        <button
                            type="button"
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft || isLoading}
                            className="shrink-0 h-[26px] w-[26px] inline-flex items-center justify-center text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover border-r border-fluent-stroke-subtle transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95"
                            aria-label="Previous updates page"
                            title="Previous page"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight || isLoading}
                            className="shrink-0 h-[26px] w-[26px] inline-flex items-center justify-center text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95"
                            aria-label="Next updates page"
                            title="Next page"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="hidden sm:block w-[1px] h-4 bg-fluent-stroke-subtle shrink-0" />

                    {/* Action Buttons (Refresh & External Link) */}
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => loadFeed(true)}
                            disabled={isLoading || isRefreshing}
                            title={error && isFallback ? "Retry fetching live updates" : "Refresh feed data"}
                            aria-label={error && isFallback ? "Retry fetching live updates" : "Refresh feed data"}
                            className={`shrink-0 h-[26px] px-2.5 rounded-[4px] border transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg active:scale-95 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium shadow-sm disabled:opacity-50 ${
                                error && isFallback
                                    ? 'bg-fluent-bg-card border-fluent-stroke-strong text-fluent-brand-fg hover:border-fluent-brand-bg hover:bg-fluent-bg-hover font-semibold'
                                    : 'bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary hover:bg-fluent-bg-hover'
                            }`}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-fluent-brand-fg' : (error && isFallback ? 'text-fluent-brand-fg' : '')}`} />
                            <span>{isRefreshing ? (error && isFallback ? 'Retrying...' : 'Refreshing...') : (error && isFallback ? 'Retry' : 'Refresh')}</span>
                        </button>

                        <a
                            href="https://azure.microsoft.com/updates/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 h-[26px] px-2.5 rounded-[4px] border bg-fluent-bg-card border-fluent-stroke-subtle text-fluent-fg-secondary hover:border-fluent-stroke-strong hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg active:scale-95 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium shadow-sm"
                            title="Open official Azure Updates portal"
                            aria-label="Open official Azure Updates portal"
                        >
                            <span>Updates Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Updates Cards Surface */}
            {isLoading ? (
                // Skeleton Cards
                <div className="flex overflow-hidden gap-2.5 -mx-1 px-1 pt-1 pb-2.5 flex-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-full sm:w-[calc(50%-5px)] lg:w-[calc(25%-7.5px)] shrink-0 h-[148px] sm:h-[158px] rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card p-3.5 flex flex-col justify-between animate-pulse"
                        >
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="h-3.5 w-16 bg-fluent-bg-subtle rounded-[4px]" />
                                    <div className="h-3 w-12 bg-fluent-bg-subtle rounded-[4px]" />
                                </div>
                                <div className="h-3.5 w-4/5 bg-fluent-bg-subtle rounded-[4px]" />
                                <div className="h-3 w-full bg-fluent-bg-subtle rounded-[4px]" />
                                <div className="h-3 w-3/4 bg-fluent-bg-subtle rounded-[4px]" />
                            </div>
                            <div className="pt-2 border-t border-fluent-stroke-subtle flex items-center justify-between">
                                <div className="h-3 w-14 bg-fluent-bg-subtle rounded-[4px]" />
                                <div className="h-3 w-10 bg-fluent-bg-subtle rounded-[4px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredItems.length === 0 ? (
                // Compact Empty State
                <div className="py-8 px-3 rounded-lg border border-dashed border-fluent-stroke-subtle bg-fluent-bg-subtle text-center flex flex-col items-center justify-center gap-1.5 flex-1">
                    <Info className="w-4 h-4 text-fluent-fg-tertiary" />
                    <span className="text-[12px] text-fluent-fg-secondary">
                        No updates in this category.
                    </span>
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="h-[26px] px-2.5 rounded-[4px] text-[12px] font-medium bg-fluent-bg-card border border-fluent-stroke-strong text-fluent-fg-primary hover:bg-fluent-bg-hover active:scale-95 transition-all shadow-sm"
                    >
                        View All Updates
                    </button>
                </div>
            ) : (
                // Items Grid with Native Trackpad Gesture & Momentum Snap
                <div 
                    ref={feedScrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    className="flex overflow-x-auto gap-2.5 -mx-1 px-1 pt-1 pb-2.5 snap-x snap-mandatory scrollbar-hide scroll-smooth flex-1"
                >
                    {filteredItems.map((item) => {
                        const badgeStyle = getStatusBadgeClass(item.statusType);

                        return (
                            <a
                                key={item.id}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    if (hasDraggedRef.current) {
                                        e.preventDefault();
                                    }
                                }}
                                className="
                                    relative group flex flex-col justify-between
                                    p-3.5 rounded-lg border border-fluent-stroke-subtle bg-fluent-bg-card
                                    hover:bg-fluent-bg-hover hover:border-fluent-stroke-strong
                                    transition-all duration-200 shadow-soft dark:shadow-none hover:shadow-depth
                                    active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg
                                    min-h-[148px] sm:min-h-[158px]
                                    w-full sm:w-[calc(50%-5px)] lg:w-[calc(25%-7.5px)] shrink-0 snap-start
                                "
                            >
                                <div className="flex flex-col min-w-0">
                                    {/* Top Row: Status Badge & Relative Time */}
                                    <div className="flex items-center justify-between gap-1 mb-2">
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-[3px] border ${badgeStyle} shrink-0`}
                                        >
                                            {item.statusLabel}
                                        </span>

                                        <div
                                            className="flex items-center gap-1 text-[11px] text-fluent-fg-tertiary shrink-0"
                                            title={item.formattedDate}
                                        >
                                            <Clock className="w-3 h-3 text-fluent-fg-tertiary" />
                                            <span>{item.relativeTime || item.formattedDate}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-[13px] sm:text-[13.5px] font-bold text-fluent-fg-primary group-hover:text-fluent-brand-fg transition-colors line-clamp-2 leading-snug mb-1.5">
                                        {item.displayTitle || item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[12px] text-fluent-fg-secondary leading-relaxed line-clamp-3">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Footer: Category & Direct Link */}
                                <div className="pt-2.5 mt-2 border-t border-fluent-stroke-subtle flex items-center justify-between text-[11.5px] font-medium">
                                    <span className="text-fluent-fg-tertiary truncate max-w-[140px] text-[11px]">
                                        {item.primaryCategory || 'General'}
                                    </span>

                                    <div className="flex items-center gap-1 text-fluent-brand-fg group-hover:underline shrink-0">
                                        <span>View</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

AzureUpdatesFeed.propTypes = {
    itemsPerPage: PropTypes.number
};
