import { memo, useRef, useEffect, useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ServiceFilter Component
 * 
 * A cohesive, unified Fluent 2 command bar combining an inline search input
 * and a segmented category track with smooth overflow fade and non-shifting scroll controls.
 * 
 * @param {Object} props
 * @param {string} props.activeCategory - The name of the currently selected category filter.
 * @param {Function} props.onCategoryChange - Callback fired when a new category is selected.
 * @param {Array<string>} props.categories - List of all available category names.
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
                setCanScrollLeft(scrollLeft > 2);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
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

    // Update scroll state when categories change or active category changes
    useEffect(() => {
        checkScroll();
    }, [activeCategory, categories]);

    // Scroll active category into view on mount or change
    useEffect(() => {
        if (activeCategory && scrollContainerRef.current) {
            const activeBtn = scrollContainerRef.current.querySelector(`[data-category="${activeCategory}"]`);
            if (activeBtn) {
                setTimeout(() => {
                    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
        <div className="w-full" role="toolbar" aria-label="Filter and category toolbar">
            <div className="flex flex-col sm:flex-row sm:items-center min-h-[32px] gap-2">
                {/* Fluent 2 Standard Search Input */}
                <div className="flex items-center shrink-0 w-full sm:w-[220px] md:w-[240px] h-[32px] px-2.5 gap-2 rounded-[4px] border transition-colors duration-150 bg-fluent-bg-card border-fluent-stroke-strong focus-within:border-fluent-brand-bg focus-within:ring-1 focus-within:ring-fluent-brand-bg shadow-sm">
                    <Search className="w-3.5 h-3.5 shrink-0 text-fluent-fg-tertiary" aria-hidden="true" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder={isMobile ? "Filter..." : "Filter... (/)"}
                        aria-label="Filter resources"
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] text-fluent-fg-primary placeholder:text-fluent-fg-tertiary"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={onClearSearch}
                            aria-label="Clear search"
                            className="p-1 rounded-[3px] text-fluent-fg-tertiary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Fluent 2 Segmented Control Track for Categories */}
                <div className="flex items-center flex-1 min-w-0 h-[32px] p-0.5 rounded-[4px] bg-fluent-bg-subtle border border-fluent-stroke-subtle relative">
                    {/* Fixed-slot Scroll Left Button (No Layout Shift) */}
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        aria-label="Scroll categories left"
                        aria-hidden={!canScrollLeft}
                        tabIndex={canScrollLeft ? 0 : -1}
                        className={`hidden sm:flex shrink-0 w-5 h-6 items-center justify-center rounded-[3px] text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-opacity duration-200 ${
                            !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Scrollable Category Tabs Viewport with Smooth Edge Fade */}
                    <div className="relative flex-1 min-w-0 overflow-hidden h-full flex items-center">
                        <div
                            ref={scrollContainerRef}
                            className="flex items-center gap-1 overflow-x-auto h-full px-1 scrollbar-none"
                            role="tablist"
                            aria-label="Category filters"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 16px, black calc(100% - 16px), ${canScrollRight ? 'transparent' : 'black'} 100%)`,
                                WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'} 0%, black 16px, black calc(100% - 16px), ${canScrollRight ? 'transparent' : 'black'} 100%)`
                            }}
                        >
                            {categories.map((cat) => {
                                const isActive = activeCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        data-category={cat}
                                        onClick={() => onCategoryChange(cat)}
                                        role="tab"
                                        type="button"
                                        aria-selected={isActive}
                                        className={`
                                            shrink-0 h-[24px] px-2.5 rounded-[3px] text-[12px] font-medium transition-all duration-150 active:scale-95
                                            focus:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg select-none
                                            ${isActive
                                                ? 'bg-fluent-bg-card text-fluent-brand-fg font-semibold shadow-sm border border-fluent-stroke-subtle'
                                                : 'text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover'
                                            }
                                        `}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Fixed-slot Scroll Right Button (No Layout Shift) */}
                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        aria-label="Scroll categories right"
                        aria-hidden={!canScrollRight}
                        tabIndex={canScrollRight ? 0 : -1}
                        className={`hidden sm:flex shrink-0 w-5 h-6 items-center justify-center rounded-[3px] text-fluent-fg-secondary hover:text-fluent-fg-primary hover:bg-fluent-bg-hover transition-opacity duration-200 ${
                            !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Pinned Clear Filter Button */}
                    {activeCategory !== 'All' && (
                        <button
                            type="button"
                            onClick={() => onCategoryChange('All')}
                            title="Clear category filter"
                            aria-label="Clear category filter"
                            className="shrink-0 h-[24px] px-2 rounded-[3px] text-[11px] font-semibold transition-all duration-150 inline-flex items-center gap-1 bg-fluent-brand-bg text-white hover:bg-fluent-brand-hover active:scale-95 shadow-sm ml-1"
                        >
                            <X className="w-3 h-3" aria-hidden="true" />
                            <span>Clear</span>
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
