import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ResourceCard from './ResourceCard';
import useLocalStorage from '../hooks/useLocalStorage';

export default function ResourceGrid({ resources, generateName, copiedId, onCopy }) {
    const [expandedCard, setExpandedCard] = useState(null);
    const [subResourceSelections, setSubResourceSelections] = useLocalStorage('azres_subResources', {});
    const [visibleCount, setVisibleCount] = useState(24);
    const loadMoreRef = useRef(null);

    // Reset visible count when filtered resources change
    useEffect(() => {
        setVisibleCount(24);
    }, [resources]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + 24, 1000));
                }
            },
            { rootMargin: '500px' }
        );

        const currentTarget = loadMoreRef.current;
        if (currentTarget) observer.observe(currentTarget);

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, []);

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

    const displayedResources = useMemo(() => {
        return resources.slice(0, visibleCount);
    }, [resources, visibleCount]);

    const handleCardToggle = useCallback((resourceName, isCurrentlyExpanded) => {
        if (isCurrentlyExpanded) {
            setExpandedCard(null);
        } else {
            setExpandedCard(resourceName);
            // Scroll to center the card after a brief delay to allow expansion
            setTimeout(() => {
                const element = document.getElementById(`resource-${resourceName}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 50);
        }
    }, []);

    const handleSubResourceChange = useCallback((resourceName, suffix) => {
        setSubResourceSelections(prev => ({ ...prev, [resourceName]: suffix }));
    }, [setSubResourceSelections]);

    if (displayedResources.length === 0) {
        return (
            <div className="text-center py-16 text-[#605e5c] dark:text-[#a19f9d]">
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

                    return (
                        <div key={resource.name} className={`animate-fade-in opacity-0 ${staggerClass} ${isExpanded ? 'col-span-full z-10' : 'h-full'}`}>
                            <ResourceCard
                                id={`resource-${resource.name}`}
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
            <div ref={loadMoreRef} className="h-4 w-full" aria-hidden="true" />
        </>
    );
}
