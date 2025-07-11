import {server} from "../server";
import {z} from "zod";
import {colorMe} from "../lib/colored";

export function registerColorInfoTools() {
    server.tool(
        "get-color-info",
        "Get complete color information in JSON format",
        {
            color: z.string().describe("Color string (e.g., be it hex, rgb, rgba, cmyk, hsv or hsl)"),
        },
        async ({color: colorStr}) => {
            const color = await colorMe({color: colorStr});
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(color, null, 2)
                }]
            };
        },
    );
}