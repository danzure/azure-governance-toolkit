import { memo, useRef, useEffect, useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ServiceFilter Component
 * 
 * A compact, unified toolbar combining an inline search input and horizontal
 * scrollable category tabs. Designed to follow Fluent UI principles with
 * minimal vertical footprint, segmented tab styling, and edge-fade overflow hints.
 * 
 * @param {Object} props
 * @param {string} props.activeCategory - The name of the currently selected category filter.
 * @param {Function} props.onCategoryChange - Callback fired when a new category is selected.
 * @param {Array<string>} props.categories - List of all available category names.
 * @param {number} props.resultCount - Number of filtered resources to display as a count badge.
 * @param {string} props.searchTerm - Current search/filter input value.
 * @param {Function} props.onSearchChange - Callback for search input changes.
 * @param {Function} props.onClearSearch - Callback to clear the search term.
 * @param {React.RefObject} props.searchInputRef - Ref forwarded to the search input element.
 * @returns {JSX.Element}
 */
const ServiceFilter = ({
    activeCategory,
    onCategoryChange,
    categories,
    searchTerm,
    onSearchChange,
    onClearSearch,
    searchInputRef
}) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const checkScrollRef = useRef(false);
    const checkScroll = () => {
        if (checkScrollRef.current) return;
        checkScrollRef.current = true;
        requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
            }
            checkScrollRef.current = false;
        });
    };

    // Correctly initialize scroll state and attach listeners
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScroll();
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);

            return () => {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [categories]);

    // Update scroll state when categories change or active category changes (in case of auto-scroll)
    useEffect(() => {
        checkScroll();
    }, [activeCategory, categories]);

    // Scroll active category into view on mount or change
    useEffect(() => {
        if (activeCategory && scrollContainerRef.current) {
            const activeBtn = scrollContainerRef.current.querySelector(`[data-category="${activeCategory}"]`);
            if (activeBtn) {
                // Use a timeout to ensure layout is complete before scrolling
                setTimeout(() => {
                    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    // Re-check scroll buttons after auto-scroll animation (approx 300ms)
                    setTimeout(checkScroll, 350);
                }, 100);
            }
        }
    }, [activeCategory]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -200 : 200,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="rounded-lg border shadow-soft bg-fluent-bg-card border-fluent-stroke-subtle" role="toolbar" aria-label="Filter and category toolbar">
            <div className="flex flex-col sm:flex-row sm:items-center sm:h-[42px] px-3 gap-3 sm:gap-2 py-3 sm:py-0">
                {/* Inline compact search */}
                <div className="flex items-center shrink-0 w-full sm:w-[220px] h-[36px] sm:h-[30px] px-2 gap-1.5 rounded border transition-colors bg-fluent-bg-canvas border-fluent-stroke-subtle focus-within:border-fluent-brand-bg focus-within:ring-1 focus-within:ring-fluent-brand-bg/20">
                    <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 text-fluent-fg-tertiary" aria-hidden="true" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder={isMobile ? "Filter..." : "Filter... (/)"}
                        aria-label="Filter resources"
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] sm:text-[12px] text-fluent-fg-primary placeholder:text-fluent-fg-tertiary"
                    />
                    {searchTerm && (
                        <button onClick={onClearSearch} aria-label="Clear search" className="p-1 sm:p-0.5 rounded-sm hover:bg-fluent-bg-hover transition-colors">
                            <X className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-fluent-fg-tertiary" />
                        </button>
                    )}
                </div>

                {/* Divider — desktop only */}
                <div className="w-px h-5 shrink-0 bg-fluent-stroke-subtle hidden sm:block" aria-hidden="true" />

                {/* Categories area wrapper (tabs + clear button) */}
                <div className="flex items-center w-full sm:w-auto flex-1 min-w-0 gap-1 sm:gap-0">
                    {/* Scroll left — desktop only */}
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        aria-label="Scroll categories left"
                        aria-hidden={!canScrollLeft}
                        tabIndex={canScrollLeft ? 0 : -1}
                        className={`hidden sm:flex shrink-0 p-0.5 rounded transition-colors text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary ${!canScrollLeft ? 'opacity-0 pointer-events-none w-0 p-0 overflow-hidden' : ''}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Scrollable category tabs */}
                    <div className="relative flex-1 min-w-0 overflow-hidden">
                        <div
                            ref={scrollContainerRef}
                            className="flex items-center gap-1.5 sm:gap-0.5 overflow-x-auto py-1 scrollbar-none"
                            role="tablist"
                            aria-label="Category filters"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 24px, black calc(100% - 24px), ${canScrollRight ? 'transparent' : 'black'} 100%)`,
                                WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 24px, black calc(100% - 24px), ${canScrollRight ? 'transparent' : 'black'} 100%)`
                            }}
                        >
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    data-category={cat}
                                    onClick={() => onCategoryChange(cat)}
                                    role="tab"
                                    aria-selected={activeCategory === cat}
                                    className={`
                                        shrink-0 px-3 py-1.5 sm:px-2.5 sm:py-1 text-[13px] sm:text-[12px] font-medium rounded-[4px] transition-colors duration-150
                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg
                                        ${activeCategory === cat
                                            ? 'bg-fluent-info-bg text-fluent-brand-fg shadow-sm font-semibold'
                                            : 'bg-fluent-bg-canvas sm:bg-transparent border border-fluent-stroke-subtle sm:border-transparent text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary'
                                        }
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scroll right — desktop only */}
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        aria-label="Scroll categories right"
                        aria-hidden={!canScrollRight}
                        tabIndex={canScrollRight ? 0 : -1}
                        className={`hidden sm:flex shrink-0 p-0.5 rounded transition-colors text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-fg-primary ${!canScrollRight ? 'opacity-0 pointer-events-none w-0 p-0 overflow-hidden' : ''}`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Clear filter */}
                    {activeCategory !== 'All' && (
                        <button
                            onClick={() => onCategoryChange('All')}
                            title="Clear filter"
                            aria-label="Clear category filter"
                            className="ml-2 sm:ml-0 shrink-0 flex items-center gap-1.5 h-[32px] sm:h-[28px] px-2.5 sm:px-2 rounded-[4px] text-[13px] sm:text-[12px] font-semibold transition-colors bg-fluent-brand-bg text-white hover:bg-fluent-brand-hover"
                        >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Clear</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

ServiceFilter.propTypes = {
    activeCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
    searchInputRef: PropTypes.object,
};

export default memo(ServiceFilter);
