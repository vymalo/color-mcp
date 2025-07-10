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

// Register weather tools
server.tool(
    "get-alerts",
    "Get weather alerts for a state",
    {
        state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
    },
    async () => {
        return {
            content: []
        }
    },
);

server.tool(
    "get-forecast",
    "Get weather forecast for a location",
    {
        latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
        longitude: z
            .number()
            .min(-180)
            .max(180)
            .describe("Longitude of the location"),
    },
    async () => {
        return {
            content: []
        }
    },
);