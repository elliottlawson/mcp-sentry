# mcp-sentry: A Sentry MCP Server

A Model Context Protocol server for retrieving and analyzing issues from Sentry.io. This server provides tools to inspect error reports, stacktraces, and other debugging information from your Sentry account.

## Overview

This MCP server allows AI assistants to access and analyze Sentry issues, providing detailed information about errors in your applications.

### Tools

1. **get_sentry_issue**

   Retrieve and analyze a Sentry issue by ID or URL

   **Input:**
   - `issue_id_or_url` (string): Sentry issue ID or URL to analyze

   **Returns:** Issue details including:
   - Title
   - Issue ID
   - Status
   - Level
   - First seen timestamp
   - Last seen timestamp
   - Event count
   - Full stacktrace

### Prompts

1. **sentry-issue**

   Retrieve issue details from Sentry

   **Input:**
   - `issue_id_or_url` (string): Sentry issue ID or URL

   **Returns:** Formatted issue details as conversation context

## Installation

### Prerequisites

- Node.js 14 or later
- A Sentry account with an authentication token

### Using npm

```bash
npm install -g mcp-sentry
```

After installation, you can run it as a command:

```bash
mcp-sentry --auth-token YOUR_SENTRY_TOKEN
```

Or with the environment variable:

```bash
SENTRY_TOKEN=YOUR_SENTRY_TOKEN mcp-sentry
```

### Using npx (without installation)

```bash
npx mcp-sentry --auth-token YOUR_SENTRY_TOKEN
```

## Development

### Project Structure

```
mcp-sentry/
├── src/
│   ├── index.ts           # Main entry point
│   ├── server.ts          # MCP server implementation
│   ├── sentry-client.ts   # Sentry API client
│   ├── models.ts          # Data models
│   ├── utils.ts           # Utility functions
│   └── types/             # Type definitions
├── build/                 # Compiled JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev -- --auth-token YOUR_SENTRY_TOKEN
```

## Authentication

This server requires a Sentry authentication token to access the Sentry API. You can provide this token in two ways:

1. Using the `--auth-token` command-line option:
   ```bash
   mcp-sentry --auth-token YOUR_SENTRY_TOKEN
   ```

2. Using the `SENTRY_TOKEN` environment variable:
   ```bash
   SENTRY_TOKEN=YOUR_SENTRY_TOKEN mcp-sentry
   ```

## Usage with Claude Desktop

Add this to your Claude Desktop configuration:

```json
"mcpServers": {
  "sentry": {
    "command": "mcp-sentry",
    "args": ["--auth-token", "YOUR_SENTRY_TOKEN"]
  }
}
```

## Usage with Zed

Add to your Zed settings.json:

```json
"context_servers": [
  "mcp-server-sentry": {
    "command": {
      "path": "mcp-sentry",
      "args": ["--auth-token", "YOUR_SENTRY_TOKEN"]
    }
  }
],
```

## Debugging

You can use the MCP inspector to debug the server:

```bash
npx @modelcontextprotocol/inspector mcp-sentry --auth-token YOUR_SENTRY_TOKEN
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.
