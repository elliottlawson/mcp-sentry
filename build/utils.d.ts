/**
 * Extracts a Sentry issue ID from a URL or standalone ID
 *
 * @param issueIdOrUrl - The Sentry issue ID or URL
 * @returns The extracted issue ID
 * @throws SentryError if the issue ID or URL is invalid
 */
export declare function extractIssueId(issueIdOrUrl: string): string;
/**
 * Creates a formatted stacktrace from a Sentry event
 *
 * @param event - The Sentry event data
 * @returns A formatted stacktrace string
 */
export declare function createStacktrace(event: any): string;
