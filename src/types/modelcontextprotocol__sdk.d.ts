declare module '@modelcontextprotocol/sdk' {
  export class McpServer {
    constructor(options: { name: string; version: string });
    
    tool(
      name: string,
      description: string,
      schema: any,
      handler: (args: any) => Promise<{ content: Array<{ type: string; text: string }> }>
    ): void;
    
    prompt(
      name: string,
      description: string,
      schema: any,
      handler: (args: any) => Promise<{ 
        description: string;
        messages: Array<{
          role: string;
          content: { type: string; text: string }
        }>
      }>
    ): void;
    
    listen(): Promise<void>;
  }
  
  export class McpError extends Error {
    constructor(message: string);
  }
  
  export interface TextContent {
    type: 'text';
    text: string;
  }
}

// Add declarations for submodules
declare module '@modelcontextprotocol/sdk/server' {
  export { McpServer } from '@modelcontextprotocol/sdk';
}

declare module '@modelcontextprotocol/sdk/shared/error' {
  export { McpError } from '@modelcontextprotocol/sdk';
}
