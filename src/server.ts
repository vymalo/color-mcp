import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";

// Create server instance
export const server = new McpServer({
    name: "colors",
    version: "1.0.0",
    
    capabilities: {
        resources: {},
        tools: {},
    },
});

