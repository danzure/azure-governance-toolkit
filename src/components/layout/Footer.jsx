import { Github, Linkedin, Coffee } from 'lucide-react';

/**
 * Footer Component
 * 
 * Styled according to Microsoft Fluent UI 2 guidelines.
 * Displays copyright info, brand mark, and secondary navigation links with subtle interactive effects.
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto w-full border-t border-fluent-stroke-subtle bg-fluent-bg-canvas transition-colors duration-200" role="contentinfo">
            <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">

                {/* Left Side: Brand & Copyright */}
                <div className="flex items-center gap-3.5">
                    {/* Brand logo */}
                    <div className="flex items-center justify-center w-9 h-9 transition-transform duration-300 hover:scale-105 active:scale-95">
                        <img src="/atozazure-favicon-192x192.png" alt="atozazure logo" className="w-8 h-8 object-contain" />
                    </div>

                    <div className="flex flex-col justify-center gap-1">
                        <div className="flex items-center gap-1.5 leading-none">
                            <span className="font-semibold text-[14px] text-fluent-fg-primary tracking-tight">
                                atozazure
                            </span>
                            <span className="text-[12px] text-fluent-fg-tertiary opacity-70 font-normal leading-none">|</span>
                            <span className="text-[12px] text-fluent-fg-tertiary font-medium leading-none">
                                Azure Governance Tools
                            </span>
                        </div>
                        <span className="text-[11px] text-fluent-fg-tertiary opacity-80 leading-none">
                            &copy; {currentYear} Daniel Powley. All rights reserved.
                        </span>
                    </div>
                </div>

                {/* Right Side: Links styled like Fluent UI 2 buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">

                    <a
                        href="https://buymeacoffee.com/danielpowley"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg transition-all duration-150 active:scale-98"
                    >
                        <Coffee className="w-4 h-4 text-fluent-fg-tertiary" />
                        <span>Buy me a Coffee</span>
                    </a>

                    <a
                        href="https://github.com/danzure/azure-governance-toolkit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg transition-all duration-150 active:scale-98"
                    >
                        <Github className="w-4 h-4 text-fluent-fg-tertiary" />
                        <span>GitHub</span>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/danielpowley92/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg transition-all duration-150 active:scale-98"
                    >
                        <Linkedin className="w-4 h-4 text-fluent-fg-tertiary" />
                        <span>LinkedIn</span>
                    </a>


                </div>

            </div>
        </footer>
    );
}
