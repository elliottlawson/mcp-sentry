import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SentryClient } from './sentry-client.js';
import { z } from 'zod';
import { VERSION, NAME } from './version.js';
/**
 * Creates and configures the Sentry MCP server
 *
 * @param authToken - The Sentry authentication token
 * @returns The configured MCP server
 */
export async function createServer(authToken) {
    // Create the server and Sentry client
    const server = new McpServer({
        name: NAME,
        version: VERSION,
    });
    const sentryClient = new SentryClient(authToken);
    // Register the get_sentry_issue tool
    server.tool('get_sentry_issue', `Retrieve and analyze a Sentry issue by ID or URL. Use this tool when you need to:
    - Investigate production errors and crashes
    - Access detailed stacktraces from Sentry
    - Analyze error patterns and frequencies
    - Get information about when issues first/last occurred
    - Review error counts and status`, {
        issue_id_or_url: z.string().describe('Sentry issue ID or URL to analyze'),
    }, async ({ issue_id_or_url }) => {
        try {
            const issueData = await sentryClient.getIssue(issue_id_or_url);
            const formattedText = sentryClient.formatIssueAsText(issueData);
            return {
                content: [
                    {
                        type: 'text',
                        text: formattedText,
                    },
                ],
            };
        }
        catch (error) {
            // Let the McpServer handle the error formatting
            throw error;
        }
    });
    // Register the sentry-issue prompt
    server.prompt('sentry-issue', 'Retrieve issue details from Sentry', {
        issue_id_or_url: z.string().describe('Sentry issue ID or URL'),
    }, async ({ issue_id_or_url }) => {
        try {
            const issueData = await sentryClient.getIssue(issue_id_or_url);
            const formattedText = sentryClient.formatIssueAsText(issueData);
            return {
                description: `Sentry Issue: ${issueData.title}`,
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: formattedText,
                        },
                    },
                ],
            };
        }
        catch (error) {
            // Let the McpServer handle the error formatting
            throw error;
        }
    });
    return server;
}
