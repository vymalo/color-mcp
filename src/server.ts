import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const server = new McpServer(
	{
		name: 'colors',
		version: '1.0.0',
	},
	{
		capabilities: {
			tools: {},
		},
	},
);
