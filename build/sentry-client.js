import axios from 'axios';
import { SentryError } from './models.js';
import { extractIssueId, createStacktrace } from './utils.js';
const SENTRY_API_BASE = 'https://sentry.io/api/0/';
/**
 * Client for interacting with the Sentry API
 */
export class SentryClient {
    /**
     * Creates a new Sentry API client
     *
     * @param authToken - The Sentry authentication token
     */
    constructor(authToken) {
        this.authToken = authToken;
        this.client = axios.create({
            baseURL: SENTRY_API_BASE,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Retrieves a Sentry issue by ID or URL
     *
     * @param issueIdOrUrl - The Sentry issue ID or URL
     * @returns The Sentry issue data
     * @throws McpError if there's an error retrieving the issue
     */
    async getIssue(issueIdOrUrl) {
        try {
            const issueId = extractIssueId(issueIdOrUrl);
            // Get issue data
            const issueResponse = await this.client.get(`issues/${issueId}/`);
            if (issueResponse.status === 401) {
                throw new Error('Error: Unauthorized. Please check your Sentry authentication token.');
            }
            const issueData = issueResponse.data;
            // Get issue hashes
            const hashesResponse = await this.client.get(`issues/${issueId}/hashes/`);
            const hashes = hashesResponse.data;
            if (!hashes || hashes.length === 0) {
                throw new Error('No Sentry events found for this issue');
            }
            const latestEvent = hashes[0].latestEvent;
            const stacktrace = createStacktrace(latestEvent);
            return {
                title: issueData.title,
                issueId: issueId,
                status: issueData.status,
                level: issueData.level,
                firstSeen: issueData.firstSeen,
                lastSeen: issueData.lastSeen,
                count: issueData.count,
                stacktrace: stacktrace
            };
        }
        catch (error) {
            if (error instanceof SentryError) {
                throw error;
            }
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Error: Unauthorized. Please check your Sentry authentication token.');
                }
                throw new Error(`Error fetching Sentry issue: ${error.message}`);
            }
            throw new Error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Formats the Sentry issue data as a text string
     *
     * @param issueData - The Sentry issue data
     * @returns A formatted text representation of the issue
     */
    formatIssueAsText(issueData) {
        return `
Sentry Issue: ${issueData.title}
Issue ID: ${issueData.issueId}
Status: ${issueData.status}
Level: ${issueData.level}
First Seen: ${issueData.firstSeen}
Last Seen: ${issueData.lastSeen}
Event Count: ${issueData.count}

${issueData.stacktrace}
    `.trim();
    }
}
