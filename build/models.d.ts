/**
 * Data structure for Sentry issue information
 */
export interface SentryIssueData {
    title: string;
    issueId: string;
    status: string;
    level: string;
    firstSeen: string;
    lastSeen: string;
    count: number;
    stacktrace: string;
}
/**
 * Custom error class for Sentry-specific errors
 */
export declare class SentryError extends Error {
    constructor(message: string);
}
