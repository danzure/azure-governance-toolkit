import { Github, Linkedin, BookOpen, Scale } from 'lucide-react';

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
            <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Left Side: Brand & Copyright */}
                <div className="flex items-center gap-3.5">
                    {/* Fluent 2 themed logo container */}
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-fluent-info-bg text-fluent-brand-fg shadow-sm transition-transform duration-300 hover:scale-105 active:scale-95">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" fillOpacity="0.2" />
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[14px] text-fluent-fg-primary tracking-tight">
                                app.atozazure
                            </span>
                            <span className="text-[12px] text-fluent-fg-tertiary opacity-70 font-normal">|</span>
                            <span className="text-[12px] text-fluent-fg-tertiary font-medium">
                                Naming Tools
                            </span>
                        </div>
                        <span className="text-[11px] text-fluent-fg-tertiary opacity-80 mt-0.5">
                            &copy; {currentYear} Daniel Powley. All rights reserved.
                        </span>
                    </div>
                </div>

                {/* Right Side: Links styled like Fluent UI 2 buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <a 
                        href="https://blog.atozazure.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg transition-all duration-150 active:scale-98"
                    >
                        <BookOpen className="w-4 h-4 text-fluent-fg-tertiary" />
                        <span>Blog</span>
                    </a>
                    
                    <a 
                        href="https://github.com/danzure/azres-naming-tool" 
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
                    
                    <div className="hidden sm:block w-px h-5 bg-fluent-stroke-subtle mx-1"></div>
                    
                    <a 
                        href="https://opensource.org/licenses/MIT" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium text-fluent-fg-secondary hover:bg-fluent-bg-hover hover:text-fluent-brand-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg transition-all duration-150 active:scale-98"
                    >
                        <Scale className="w-4 h-4 text-fluent-fg-tertiary" />
                        <span>MIT License</span>
                    </a>
                </div>

            </div>
        </footer>
    );
}
