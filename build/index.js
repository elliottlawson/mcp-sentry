#!/usr/bin/env -S node --no-warnings --experimental-specifier-resolution=node
import { program } from 'commander';
import { createServer } from './server.js';
import dotenv from 'dotenv';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// Load environment variables from .env file
dotenv.config();
const MISSING_AUTH_TOKEN_MESSAGE = 'Sentry authentication token not found. Please specify your Sentry auth token using --auth-token or the SENTRY_TOKEN environment variable.';
// Configure the command-line interface
program
    .name('mcp-sentry')
    .description('A Model Context Protocol server for retrieving and analyzing issues from Sentry.io')
    .version('0.1.0')
    .option('-a, --auth-token <token>', 'Sentry authentication token')
    .parse(process.argv);
async function main() {
    try {
        const options = program.opts();
        // Get the auth token from command-line argument or environment variable
        const authToken = options.authToken || process.env.SENTRY_TOKEN;
        if (!authToken) {
            console.error(MISSING_AUTH_TOKEN_MESSAGE);
            process.exit(1);
        }
        // Create and start the server
        const server = await createServer(authToken);
        console.log('Starting Sentry MCP server...');
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.log('Sentry MCP Server running on stdio');
        // Handle termination signals
        const shutdown = () => {
            console.log('Shutting down Sentry MCP server...');
            process.exit(0);
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
    catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
main();
