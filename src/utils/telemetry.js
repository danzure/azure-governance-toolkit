import { ApplicationInsights } from '@microsoft/applicationinsights-web';

/**
 * Azure Application Insights Telemetry Module
 * 
 * Initialises the App Insights SDK once and exports helpers for
 * page-view tracking and custom event tracking throughout the app.
 * 
 * The connection string is read from the VITE_APPINSIGHTS_CONNECTION_STRING
 * environment variable (set in .env, which is git-ignored).
 */

let appInsights = null;

/**
 * Initialise Application Insights. Safe to call multiple times —
 * subsequent calls are no-ops.
 */
export function initTelemetry() {
    const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;

    if (!connectionString) {
        console.warn(
            '[Telemetry] VITE_APPINSIGHTS_CONNECTION_STRING is not set. ' +
            'Application Insights will not be initialised.'
        );
        return;
    }

    if (appInsights) return; // already initialised

    appInsights = new ApplicationInsights({
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

    appInsights.loadAppInsights();

    // Set a cloud role name so this app is easy to find in the portal
    appInsights.addTelemetryInitializer((envelope) => {
        if (envelope.tags) {
            envelope.tags['ai.cloud.role'] = 'atozazure-governance-toolkit';
        }
    });
}

/**
 * Track a page view.  Called on every React Router navigation.
 * @param {string} name  – friendly page name, e.g. "Dashboard"
 * @param {string} uri   – the route path, e.g. "/resource-naming"
 */
export function trackPageView(name, uri) {
    appInsights?.trackPageView({ name, uri });
}


