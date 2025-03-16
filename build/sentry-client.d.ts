import { SentryIssueData } from './models.js';
/**
 * Client for interacting with the Sentry API
 */
export declare class SentryClient {
    private authToken;
    private client;
    /**
     * Creates a new Sentry API client
     *
     * @param authToken - The Sentry authentication token
     */
    constructor(authToken: string);
    /**
     * Retrieves a Sentry issue by ID or URL
     *
     * @param issueIdOrUrl - The Sentry issue ID or URL
     * @returns The Sentry issue data
     * @throws McpError if there's an error retrieving the issue
     */
    getIssue(issueIdOrUrl: string): Promise<SentryIssueData>;
    /**
     * Formats the Sentry issue data as a text string
     *
     * @param issueData - The Sentry issue data
     * @returns A formatted text representation of the issue
     */
    formatIssueAsText(issueData: SentryIssueData): string;
}
