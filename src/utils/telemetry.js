/**
 * Azure Application Insights Telemetry Module
 * 
 * Initialises the App Insights SDK asynchronously and exports helpers for
 * page-view tracking and custom event tracking throughout the app.
 * Events recorded before initialization finishes are buffered in memory and flushed.
 * 
 * The connection string is read from the VITE_APPINSIGHTS_CONNECTION_STRING
 * environment variable (set in .env, which is git-ignored).
 */

let appInsights = null;
let isInitializing = false;
const eventBuffer = [];

function flushBuffer(instance) {
    while (eventBuffer.length > 0) {
        const action = eventBuffer.shift();
        try {
            action(instance);
        } catch (err) {
            console.warn('[Telemetry] Error executing buffered telemetry action:', err);
        }
    }
}

/**
 * Initialise Application Insights asynchronously. Safe to call multiple times —
 * subsequent calls are no-ops.
 */
export async function initTelemetry() {
    const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;

    if (!connectionString) {
        return;
    }

    if (appInsights || isInitializing) return;
    isInitializing = true;

    try {
        const { ApplicationInsights } = await import('@microsoft/applicationinsights-web');
        const instance = new ApplicationInsights({
            config: {
                connectionString,
                /* ── Auto-collection settings ── */
                enableAutoRouteTracking: false,   // We handle route changes manually via React Router
                autoTrackPageVisitTime: true,     // Track how long users spend on each page
                disableFetchTracking: false,      // Track outbound fetch/XHR calls
                enableCorsCorrelation: true,      // Correlate cross-origin requests
                /* ── Performance & Sampling ── */
                maxBatchInterval: 15000,          // Flush telemetry every 15s (default 15000)
                disableExceptionTracking: false,  // Capture unhandled exceptions
                enableUnhandledPromiseRejectionTracking: true,
            },
        });

        instance.loadAppInsights();

        // Set a cloud role name so this app is easy to find in the portal
        instance.addTelemetryInitializer((envelope) => {
            if (envelope.tags) {
                envelope.tags['ai.cloud.role'] = 'atozazure-governance-toolkit';
            }
        });

        appInsights = instance;
        flushBuffer(instance);
    } catch (err) {
        console.error('[Telemetry] Failed to load Application Insights dynamically:', err);
    } finally {
        isInitializing = false;
    }
}

/**
 * Track a page view. Called on every React Router navigation.
 * @param {string} name – friendly page name, e.g. "Dashboard"
 * @param {string} uri – the route path, e.g. "/resource-naming"
 */
export function trackPageView(name, uri) {
    if (appInsights) {
        appInsights.trackPageView({ name, uri });
    } else {
        eventBuffer.push(ai => ai.trackPageView({ name, uri }));
    }
}

/**
 * Track a custom user event (e.g. AI generation, resource export, copy action).
 * @param {string} name – Event name, e.g. "Generate_Resource_Name"
 * @param {Record<string, any>} [properties] – Additional custom dimensions
 */
export function trackEvent(name, properties = {}) {
    if (appInsights) {
        appInsights.trackEvent({ name, properties });
    } else {
        eventBuffer.push(ai => ai.trackEvent({ name, properties }));
    }
}

/**
 * Track an application exception.
 * @param {Error|unknown} exception – Error object or message
 * @param {Record<string, any>} [properties] – Additional context/dimensions
 * @param {number} [severityLevel=3] – AI severity level (0=Verbose, 1=Information, 2=Warning, 3=Error, 4=Critical)
 */
export function trackException(exception, properties = {}, severityLevel = 3) {
    if (!exception) return;
    const errorObj = exception instanceof Error ? exception : new Error(String(exception));
    if (appInsights) {
        appInsights.trackException({
            exception: errorObj,
            properties,
            severityLevel
        });
    } else {
        eventBuffer.push(ai => ai.trackException({
            exception: errorObj,
            properties,
            severityLevel
        }));
    }
}

/**
 * Track a diagnostic trace message.
 * @param {string} message – Log message
 * @param {Record<string, any>} [properties] – Additional context
 * @param {number} [severityLevel=1] – Severity level
 */
export function trackTrace(message, properties = {}, severityLevel = 1) {
    if (appInsights) {
        appInsights.trackTrace({ message, properties, severityLevel });
    } else {
        eventBuffer.push(ai => ai.trackTrace({ message, properties, severityLevel }));
    }
}

/**
 * Get the underlying ApplicationInsights instance if direct access is needed.
 * @returns {ApplicationInsights|null}
 */
export function getAppInsights() {
    return appInsights;
}


