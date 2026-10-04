import PropTypes from 'prop-types';
import { User } from 'lucide-react';
import Tooltip from '../shared/Tooltip';
import BuyMeACoffeeIcon from '../shared/BuyMeACoffeeIcon';
// Eagerly resolve brand logos, falling back to public assets
const logoModules = import.meta.glob('../../assets/logos/*.png', { eager: true, import: 'default' });
const logoLight = logoModules['../../assets/logos/atozazure-horizontal-light.png'] || '/atozazure-logo-lightmode-transparent.png';
const logoDark = logoModules['../../assets/logos/atozazure-logo-darkmode.png'] || '/atozazure-logo-darkmode-transparent.png';


/**
 * Footer Component
 * 
 * Styled according to Microsoft Fluent UI 2 guidelines.
 * Displays copyright info, brand mark, support callout, and navigation links.
 * Supports 'full' (dashboard) and 'slim' (tool pages) variants.
 */
export default function Footer({ variant = 'full' }) {
    const currentYear = new Date().getFullYear();
    const showActions = variant === 'full';

    return (
        <footer className="mt-auto w-full border-t border-fluent-stroke-subtle bg-fluent-bg-canvas transition-colors duration-200" role="contentinfo">
            <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-6 pt-2.5 sm:pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">

                {/* Left Side: Single-line Brand & Copyright Lockup */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center md:justify-start text-[12px] sm:text-[12.5px] text-fluent-fg-tertiary">
                    <a
                        href="https://atozazure.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fluent-brand-bg rounded-[2px] translate-y-[1px] -mr-1.5 md:-ml-0.5"
                        aria-label="atozazure"
                    >
                        {logoLight && logoDark ? (
                            <>
                                <img
                                    src={logoLight}
                                    alt="atozazure"
                                    className="h-[22px] sm:h-[24px] w-auto object-contain dark:hidden transition-transform duration-200 ease-in-out group-hover:scale-105 active:scale-95"
                                />
                                <img
                                    src={logoDark}
                                    alt="atozazure"
                                    className="h-[22px] sm:h-[24px] w-auto object-contain hidden dark:block transition-transform duration-200 ease-in-out group-hover:scale-105 active:scale-95"
                                />
                            </>
                        ) : (
                            <span className="font-semibold text-[13px] sm:text-[14px] text-fluent-fg-primary tracking-tight group-hover:text-fluent-brand-fg transition-colors">
                                atozazure
                            </span>
                        )}
                    </a>

                    <span className="w-[1px] h-3 sm:h-3.5 bg-fluent-stroke-subtle shrink-0 select-none inline-block self-center mx-0.5" aria-hidden="true" />
                    <span className="font-medium text-fluent-fg-secondary">
                        Azure Governance Tools
                    </span>
                    <span className="opacity-35 hidden sm:inline select-none" aria-hidden="true">&bull;</span>
                    <span className="text-fluent-fg-tertiary">
                        &copy; {currentYear} Daniel Powley. All rights reserved.
                    </span>
                </div>

                {/* Right Side: Navigation Links with Tooltip (Dashboard only) */}
                {showActions && (
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-3.5">
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <Tooltip
                                content="Enjoying the toolkit? A coffee helps support development and keep the tools free for everyone! ☕"
                                position="top"
                                align="start-mobile-end-desktop"
                                className="inline-flex"
                            >
                                <a
                                    href="https://buymeacoffee.com/danielpowley"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn relative inline-flex items-center justify-center gap-1.5 h-[32px] px-3 rounded-[4px] text-[12.5px] font-medium bg-fluent-bg-card border border-fluent-stroke-subtle hover:border-fluent-stroke-strong text-fluent-fg-primary hover:bg-fluent-bg-hover shadow-soft hover:shadow-depth transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                                    aria-label="Support development - Buy me a Coffee"
                                >
                                    <BuyMeACoffeeIcon className="h-[18px] w-auto shrink-0 transition-transform duration-200 ease-in-out group-hover/btn:scale-105" />
                                    <span>Buy me a Coffee</span>

                                    {/* Notification indicator dot to draw attention */}
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none" aria-hidden="true">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fluent-cat-orange-fg opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-fluent-cat-orange-fg" />
                                    </span>
                                </a>
                            </Tooltip>

                            <a
                                href="https://atozazure.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn relative inline-flex items-center justify-center gap-1.5 h-[32px] px-3 rounded-[4px] text-[12.5px] font-medium bg-fluent-bg-card border border-fluent-stroke-subtle hover:border-fluent-stroke-strong text-fluent-fg-primary hover:bg-fluent-bg-hover shadow-soft hover:shadow-depth transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg"
                                aria-label="About Daniel Powley - Visit atozazure.com"
                            >
                                <User className="w-3.5 h-3.5 text-fluent-brand-fg shrink-0 transition-transform duration-200 ease-in-out group-hover/btn:scale-110" />
                                <span>About me</span>
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </footer>
    );
}

Footer.propTypes = {
    variant: PropTypes.oneOf(['full', 'slim'])
};

