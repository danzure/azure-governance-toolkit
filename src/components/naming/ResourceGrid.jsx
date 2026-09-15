import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import ResourceCard from './ResourceCard';
import useLocalStorage from '../../hooks/useLocalStorage';
import { toResourceId } from '../../utils/resourceIdHelper';

/**
 * ResourceGrid Component
 * 
 * Renders the responsive grid of Azure resource naming cards with infinite scroll,
 * staggered enter animations, expanded detailed view management, intelligent viewport centering,
 * and sub-resource state tracking.
 * 
 * @param {Object} props
 * @param {Array<Object>} props.resources - Filtered array of Azure resource definitions
 * @param {Function} props.generateName - Name generator callback
 * @param {string|null} props.copiedId - Active copied item identifier for UI feedback
 * @param {Function} props.onCopy - Clipboard copy callback handler
 * @param {string|null} [props.selectedService] - Deep-linked or externally selected Azure service name
 * @returns {JSX.Element}
 */
export default function ResourceGrid({ resources, generateName, copiedId, onCopy, selectedService = null }) {
    const [expandedCard, setExpandedCard] = useState(null);
    const [subResourceSelections, setSubResourceSelections] = useLocalStorage('azres_subResources', {});
    const [visibleCount, setVisibleCount] = useState(24);
    const loadMoreRef = useRef(null);

    // Reset visible count when filtered resources change
    useEffect(() => {
        setVisibleCount(24);
    }, [resources]);

    // Infinite scroll observer - only active when there are more items to reveal
    useEffect(() => {
        if (visibleCount >= resources.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + 24, resources.length));
                }
            },
            { rootMargin: '400px' }
        );

        const currentTarget = loadMoreRef.current;
        if (currentTarget) observer.observe(currentTarget);

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [visibleCount, resources.length]);

    // Handle escape key to close expanded cards
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setExpandedCard(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle externally requested service selection (e.g. from Command Palette or deep link)
    useEffect(() => {
        if (selectedService) {
            const serviceIndex = resources.findIndex(
                r => r.name.toLowerCase() === selectedService.toLowerCase()
            );
            if (serviceIndex >= 0) {
                if (serviceIndex >= visibleCount) {
                    setVisibleCount(serviceIndex + 12);
                }
                const matched = resources[serviceIndex];
                setExpandedCard(matched.name);
            }
        }
    }, [selectedService, resources, visibleCount]);

    const displayedResources = useMemo(() => {
        return resources.slice(0, visibleCount);
    }, [resources, visibleCount]);

    /**
     * Smoothly positions the expanded resource card in the visible viewport area.
     * If the card fits comfortably within the visible area below the sticky toolbar,
     * it centers it. If the card is taller than the viewport, it cleanly positions
     * the top with comfortable padding below the sticky header.
     */
    const scrollToCard = useCallback((resourceName) => {
        if (!resourceName) return;
        const cardId = toResourceId(resourceName);
        const element = document.getElementById(cardId);
        const container = document.getElementById('main-scroll-container') || document.documentElement;

        if (!element || !container) return;

        // Measure sticky filter toolbar if present
        const stickyHeader = container.querySelector('.sticky') || document.querySelector('.sticky');
        const stickyHeight = stickyHeader ? stickyHeader.getBoundingClientRect().height : 54;
        const topPadding = 16;
        const totalTopOffset = stickyHeight + topPadding;

        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate card's current top position relative to scrollable container content
        const cardOffsetTop = (elementRect.top - containerRect.top) + container.scrollTop;
        const cardHeight = element.offsetHeight;
        const availableHeight = container.clientHeight - stickyHeight;

        let targetScrollTop;

        // If the card fits within the available visible height below the sticky header
        if (cardHeight <= availableHeight - 24) {
            // Center the card vertically in the available visible space with equal margins top and bottom
            const visibleCenterY = stickyHeight + (availableHeight / 2);
            targetScrollTop = cardOffsetTop + (cardHeight / 2) - visibleCenterY;
        } else {
            // If card is taller than available space, position top cleanly below sticky toolbar
            targetScrollTop = cardOffsetTop - totalTopOffset;
        }

        const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
        targetScrollTop = Math.max(0, Math.min(Math.round(targetScrollTop), maxScroll));

        container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    }, []);

    // Synchronize smooth scrolling after DOM reflow and card expansion settles
    useEffect(() => {
        if (!expandedCard) return;

        let rafId2;
        const rafId1 = requestAnimationFrame(() => {
            rafId2 = requestAnimationFrame(() => {
                scrollToCard(expandedCard);
            });
        });

        return () => {
            cancelAnimationFrame(rafId1);
            if (rafId2) cancelAnimationFrame(rafId2);
        };
    }, [expandedCard, scrollToCard]);

    const handleCardToggle = useCallback((resourceName, isCurrentlyExpanded) => {
        if (isCurrentlyExpanded) {
            setExpandedCard(null);
        } else {
            setExpandedCard(resourceName);
        }
    }, []);

    const handleSubResourceChange = useCallback((resourceName, suffix) => {
        setSubResourceSelections(prev => ({ ...prev, [resourceName]: suffix }));
    }, [setSubResourceSelections]);

    if (displayedResources.length === 0) {
        return (
            <div className="text-center py-16 text-fluent-fg-tertiary">
                <p className="text-[14px]">No resources found matching your criteria.</p>
                <p className="text-[12px] mt-2">Try adjusting your search or category filter.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedResources.map((resource, index) => {
                    const selectedSubResource = subResourceSelections[resource.name] || (resource.subResources?.[0]?.suffix);
                    const genName = generateName(resource, selectedSubResource);
                    const isCopied = copiedId === resource.name;
                    const isExpanded = expandedCard === resource.name;
                    const staggerClass = index < 10 ? `stagger-${index + 1}` : '';
                    const cardId = toResourceId(resource.name);

                    return (
                        <div key={resource.name} className={`animate-fade-in opacity-0 ${staggerClass} ${isExpanded ? 'col-span-full z-10' : 'h-full'}`}>
                            <ResourceCard
                                id={cardId}
                                resource={resource}
                                genName={genName}
                                isCopied={isCopied}
                                isExpanded={isExpanded}
                                onCopy={onCopy}
                                onToggle={handleCardToggle}
                                selectedSubResource={selectedSubResource}
                                onSubResourceChange={handleSubResourceChange}
                                generateName={generateName}
                            />
                        </div>
                    );
                })}
            </div>
            {/* Invisible div to trigger intersection observer for infinite scroll */}
            {visibleCount < resources.length && (
                <div ref={loadMoreRef} className="h-4 w-full" aria-hidden="true" />
            )}
        </>
    );
}

ResourceGrid.propTypes = {
    resources: PropTypes.arrayOf(PropTypes.object).isRequired,
    generateName: PropTypes.func.isRequired,
    copiedId: PropTypes.string,
    onCopy: PropTypes.func.isRequired,
    selectedService: PropTypes.string
};

