import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Creates and configures the Sentry MCP server
 *
 * @param authToken - The Sentry authentication token
 * @returns The configured MCP server
 */
export declare function createServer(authToken: string): Promise<McpServer>;
