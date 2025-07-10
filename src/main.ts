import {server} from "./server";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Color MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});