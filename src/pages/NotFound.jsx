import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in text-center h-full min-h-[400px]">
            <div className="relative rounded-lg border shadow-soft bg-fluent-bg-card dark:bg-fluent-bg-subtle border-fluent-stroke-subtle max-w-md w-full flex flex-col items-center gap-6 p-8">
                <div className="w-16 h-16 rounded-lg bg-fluent-bg-canvas border border-fluent-stroke-subtle text-fluent-state-danger flex items-center justify-center shadow-soft">
                    <span className="text-3xl font-bold">404</span>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-fluent-fg-primary">Page Not Found</h1>
                    <p className="text-[14px] text-fluent-fg-secondary">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="px-3 h-[32px] bg-fluent-brand-bg text-white rounded-[4px] text-[13px] font-medium hover:bg-fluent-brand-hover transition-all duration-200 ease-in-out shadow-sm inline-flex items-center justify-center gap-1.5 w-full active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-bg/50 focus-visible:border-fluent-brand-bg mt-2"
                >
                    <Home className="w-4 h-4" />
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}
