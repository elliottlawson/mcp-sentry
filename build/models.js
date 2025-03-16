/**
 * Custom error class for Sentry-specific errors
 */
export class SentryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SentryError';
    }
}
