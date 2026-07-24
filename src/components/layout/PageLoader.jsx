
export default function PageLoader() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 h-full min-h-[400px] animate-fade-in">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-[3px] border-fluent-brand-bg/20 border-t-fluent-brand-bg animate-spin" />
                <div className="text-[14px] font-medium text-fluent-fg-secondary animate-pulse">
                    Loading...
                </div>
            </div>
        </div>
    );
}
